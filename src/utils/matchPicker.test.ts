import { describe, expect, it } from 'vitest'
import { awsServices } from '../data/awsServices'
import { EXAM_KEYWORDS } from '../data/examKeywords'
import { buildMatchCards } from '../hooks/useMatchGame'
import type { MasteryLevel } from '../types'
import { MATCH_PAIR_COUNT } from '../types'
import {
  pickMatchServices,
  pushRecentIds,
  suggestMastery,
  weightFor,
  type PickContext,
} from './matchPicker'
import { normalizeProgress } from './storage'

/** Deterministic rng (mulberry32) so the tests are reproducible. */
function seeded(seed: number) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const emptyContext = (): PickContext => ({
  recentIds: [],
  starred: new Set(),
  mastery: new Map<string, MasteryLevel>(),
})

describe('exam keywords', () => {
  it('covers every service with at least two keywords', () => {
    const missing = awsServices.filter((service) => (EXAM_KEYWORDS[service.id]?.length ?? 0) < 2)
    expect(missing.map((service) => service.id)).toEqual([])
  })

  it('has no keywords for unknown ids', () => {
    const ids = new Set(awsServices.map((service) => service.id))
    expect(Object.keys(EXAM_KEYWORDS).filter((id) => !ids.has(id))).toEqual([])
  })

  it('keyword mode puts keywords on the description tile', () => {
    const cards = buildMatchCards([awsServices[0]], 'keyword', seeded(1))
    const tile = cards.find((card) => card.type === 'description')
    expect(tile?.keywords).toEqual(EXAM_KEYWORDS[awsServices[0].id])
  })

  it('meaning mode keeps the Thai description', () => {
    const cards = buildMatchCards([awsServices[0]], 'meaning', seeded(1))
    const tile = cards.find((card) => card.type === 'description')
    expect(tile?.content).toBe(awsServices[0].description)
    expect(tile?.keywords).toBeUndefined()
  })
})

describe('pickMatchServices', () => {
  it('deals a full board of distinct services', () => {
    const { picked } = pickMatchServices(awsServices, MATCH_PAIR_COUNT, 'all', emptyContext(), seeded(2))
    expect(picked).toHaveLength(MATCH_PAIR_COUNT)
    expect(new Set(picked.map((service) => service.id)).size).toBe(MATCH_PAIR_COUNT)
  })

  it('never repeats words from recent boards when the pool is big enough', () => {
    let recentIds: string[] = []
    const rng = seeded(3)
    for (let round = 0; round < 30; round += 1) {
      const { picked } = pickMatchServices(
        awsServices,
        MATCH_PAIR_COUNT,
        'all',
        { ...emptyContext(), recentIds },
        rng,
      )
      const ids = picked.map((service) => service.id)
      expect(ids.filter((id) => recentIds.includes(id))).toEqual([])
      recentIds = pushRecentIds(recentIds, ids, 24)
    }
  })

  it('tops up with the oldest recent words when the category is small', () => {
    const migration = awsServices.filter((service) => service.category === 'Migration')
    // Migration (3) is smaller than a board, so it falls back to every service.
    const result = pickMatchServices(awsServices, MATCH_PAIR_COUNT, 'Migration', emptyContext(), seeded(4))
    expect(migration.length).toBeLessThan(MATCH_PAIR_COUNT)
    expect(result.usedFallback).toBe(true)
    expect(result.picked).toHaveLength(MATCH_PAIR_COUNT)

    // Pool of exactly 8 with 6 recent: 2 fresh + the 6 recents, still 8 distinct.
    const pool = awsServices.slice(0, 8)
    const recentIds = pool.slice(0, 6).map((service) => service.id)
    const { picked } = pickMatchServices(pool, 8, 'all', { ...emptyContext(), recentIds }, seeded(5))
    expect(new Set(picked.map((service) => service.id)).size).toBe(8)
  })

  it('deals starred and forgotten words more often', () => {
    const starredId = awsServices[10].id
    const badId = awsServices[20].id
    const goodId = awsServices[30].id
    const context: PickContext = {
      recentIds: [],
      starred: new Set([starredId]),
      mastery: new Map<string, MasteryLevel>([
        [badId, 'bad'],
        [goodId, 'good'],
      ]),
    }
    const counts: Record<string, number> = { [starredId]: 0, [badId]: 0, [goodId]: 0 }
    const rng = seeded(6)
    for (let i = 0; i < 2000; i += 1) {
      const { picked } = pickMatchServices(awsServices, MATCH_PAIR_COUNT, 'all', context, rng)
      for (const service of picked) {
        if (service.id in counts) counts[service.id] += 1
      }
    }
    expect(counts[starredId]).toBeGreaterThan(counts[badId])
    expect(counts[badId]).toBeGreaterThan(counts[goodId])
    expect(weightFor(starredId, context)).toBeGreaterThan(weightFor(goodId, context))
  })
})

describe('suggestMastery', () => {
  it('maps mistakes to a mark', () => {
    expect(suggestMastery(0)).toBe('good')
    expect(suggestMastery(1)).toBe('medium')
    expect(suggestMastery(3)).toBe('bad')
  })
})

describe('normalizeProgress migration', () => {
  it('keeps hard records as the meaning mode and drops easy/medium', () => {
    const progress = normalizeProgress({
      matchGame: { bestTime: { easy: 10, medium: 20, hard: 30 }, bestScore: { hard: 9 } },
      leaderboard: [
        { id: 'a', name: 'A', difficulty: 'easy', seconds: 5, attempts: 4, stars: 3, playedAt: '' },
        { id: 'b', name: 'B', difficulty: 'hard', seconds: 40, attempts: 9, stars: 2, playedAt: '' },
        { id: 'c', name: 'C', mode: 'keyword', seconds: 50, attempts: 9, stars: 2, playedAt: '' },
      ],
    })
    expect(progress.matchGame.bestTime).toEqual({ meaning: 30 })
    expect(progress.matchGame.bestScore).toEqual({ meaning: 9 })
    expect(progress.leaderboard.map((entry) => [entry.id, entry.mode])).toEqual([
      ['b', 'meaning'],
      ['c', 'keyword'],
    ])
  })

  it('keeps the three mastery lists disjoint and filters unknown ids', () => {
    const valid = new Set(['ec2', 's3', 'iam'])
    const progress = normalizeProgress(
      {
        flashCards: { mastered: ['ec2'], learning: ['ec2', 's3'], reviewing: ['s3', 'iam', 'nope'] },
        starred: ['iam', 'nope'],
        matchGame: { recentIds: ['s3', 'nope'] },
      },
      valid,
    )
    expect(progress.flashCards.mastered).toEqual(['ec2'])
    expect(progress.flashCards.learning).toEqual(['s3'])
    expect(progress.flashCards.reviewing).toEqual(['iam'])
    expect(progress.starred).toEqual(['iam'])
    expect(progress.matchGame.recentIds).toEqual(['s3'])
  })
})
