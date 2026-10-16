import { describe, expect, it } from 'vitest'
import { buildMatchCards, poolForMode } from '../hooks/useMatchGame'
import { MATCH_PAIR_COUNT } from '../types'
import { pickMatchServices } from '../utils/matchPicker'
import { normalizeProgress } from '../utils/storage'
import { SERVICE_IDS, awsServices } from './awsServices'
import { FRAMEWORK_MATCH_ITEMS, TRACKED_IDS, isFrameworkMode } from './frameworkMatch'

const modes = ['caf', 'waf'] as const

describe('framework match modes', () => {
  it.each(modes)('%s pool is big enough and has unique ids, terms and meanings', (mode) => {
    const items = FRAMEWORK_MATCH_ITEMS[mode]
    expect(items.length).toBeGreaterThanOrEqual(MATCH_PAIR_COUNT)
    expect(new Set(items.map((item) => item.id)).size).toBe(items.length)
    expect(new Set(items.map((item) => item.name)).size).toBe(items.length)
    expect(new Set(items.map((item) => item.description)).size).toBe(items.length)
  })

  it('framework ids never collide with service ids', () => {
    for (const mode of modes) {
      for (const item of FRAMEWORK_MATCH_ITEMS[mode]) expect(SERVICE_IDS.has(item.id)).toBe(false)
    }
  })

  it('poolForMode switches pools only for framework modes', () => {
    expect(isFrameworkMode('caf')).toBe(true)
    expect(isFrameworkMode('meaning')).toBe(false)
    expect(poolForMode('meaning', awsServices)).toBe(awsServices)
    expect(poolForMode('keyword', awsServices)).toBe(awsServices)
    expect(poolForMode('caf', awsServices)).toBe(FRAMEWORK_MATCH_ITEMS.caf)
    expect(poolForMode('waf', awsServices)).toBe(FRAMEWORK_MATCH_ITEMS.waf)
  })

  it.each(modes)('%s deals a full board of framework words with plain meaning tiles', (mode) => {
    const pick = pickMatchServices(poolForMode(mode, awsServices), MATCH_PAIR_COUNT, 'all', {
      recentIds: [],
      starred: new Set(),
      mastery: new Map(),
    })
    expect(pick.picked).toHaveLength(MATCH_PAIR_COUNT)
    expect(pick.usedFallback).toBe(false)
    expect(pick.picked.every((item) => !SERVICE_IDS.has(item.id))).toBe(true)

    const cards = buildMatchCards(pick.picked, mode)
    expect(cards).toHaveLength(MATCH_PAIR_COUNT * 2)
    expect(cards.every((card) => card.keywords === undefined)).toBe(true)
  })

  it('progress keeps stars, mastery and dealt history for framework words', () => {
    const cafId = FRAMEWORK_MATCH_ITEMS.caf[0].id
    const wafId = FRAMEWORK_MATCH_ITEMS.waf[0].id
    const progress = normalizeProgress(
      {
        flashCards: { mastered: [cafId], reviewing: ['gone'] },
        starred: [wafId],
        matchGame: { recentIds: [cafId, wafId, 'gone'] },
      },
      TRACKED_IDS,
    )
    expect(progress.flashCards.mastered).toEqual([cafId])
    expect(progress.flashCards.reviewing).toEqual([])
    expect(progress.starred).toEqual([wafId])
  })
})
