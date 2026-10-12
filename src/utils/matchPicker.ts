import type { AWSService, CategoryFilterValue, MasteryLevel, RandomFn } from '../types'

/** What the picker needs to know about the learner. */
export interface PickContext {
  /** Recently dealt ids, newest first. Avoided whenever the pool allows. */
  recentIds: readonly string[]
  starred: ReadonlySet<string>
  /** Mastery per service id; missing means "never marked". */
  mastery: ReadonlyMap<string, MasteryLevel>
}

/** Relative chance of being dealt, by how well the word is remembered. */
export const MASTERY_WEIGHT: Record<MasteryLevel | 'unmarked', number> = {
  bad: 4,
  medium: 3,
  unmarked: 2,
  good: 1,
}

/** Starred words are this many times more likely to be dealt. */
export const STAR_MULTIPLIER = 3

export function weightFor(serviceId: string, context: PickContext): number {
  const level = context.mastery.get(serviceId) ?? 'unmarked'
  const base = MASTERY_WEIGHT[level]
  return context.starred.has(serviceId) ? base * STAR_MULTIPLIER : base
}

/**
 * Weighted sampling without replacement (Efraimidis-Spirakis): each item gets
 * the key u^(1/w) and the `count` largest keys win.
 */
export function weightedSample<T>(
  items: readonly T[],
  count: number,
  weight: (item: T) => number,
  rng: RandomFn = Math.random,
): T[] {
  if (count <= 0) return []

  return items
    .map((item) => {
      const w = Math.max(weight(item), Number.EPSILON)
      const raw = rng()
      // Keep u inside (0, 1) so a misbehaving rng cannot collapse every key to 0 or 1.
      const u = Number.isFinite(raw) ? Math.min(Math.max(raw, 1e-12), 1 - 1e-12) : 0.5
      return { item, key: Math.pow(u, 1 / w) }
    })
    .sort((a, b) => b.key - a.key)
    .slice(0, count)
    .map((entry) => entry.item)
}

/**
 * Chooses the services for one board.
 *
 * 1. Restrict to the category, or fall back to every service when the category
 *    is too small for a full board.
 * 2. Draw from services NOT dealt recently, weighted so starred and poorly
 *    remembered words come up more often.
 * 3. Only when that is not enough, top up with the least recently dealt ones.
 */
export function pickMatchServices(
  services: readonly AWSService[],
  count: number,
  category: CategoryFilterValue,
  context: PickContext,
  rng: RandomFn = Math.random,
): { picked: AWSService[]; usedFallback: boolean } {
  if (count <= 0) return { picked: [], usedFallback: false }

  const inCategory =
    category === 'all' ? services : services.filter((service) => service.category === category)
  const usedFallback = inCategory.length < count
  const pool = usedFallback ? services : inCategory

  const recentRank = new Map<string, number>()
  context.recentIds.forEach((id, index) => {
    if (!recentRank.has(id)) recentRank.set(id, index)
  })

  const fresh = pool.filter((service) => !recentRank.has(service.id))
  const picked = weightedSample(fresh, count, (service) => weightFor(service.id, context), rng)

  if (picked.length < count) {
    // Oldest first: the larger the index in recentIds, the longer ago it was dealt.
    const stale = pool
      .filter((service) => recentRank.has(service.id))
      .sort((a, b) => (recentRank.get(b.id) ?? 0) - (recentRank.get(a.id) ?? 0))
    picked.push(...stale.slice(0, count - picked.length))
  }

  return { picked, usedFallback }
}

/** Prepends a board's ids to the recent list, de-duplicated and capped. */
export function pushRecentIds(
  recentIds: readonly string[],
  dealtIds: readonly string[],
  max: number,
): string[] {
  const dealt = new Set(dealtIds)
  return [...dealtIds, ...recentIds.filter((id) => !dealt.has(id))].slice(0, max)
}

/** Suggested mark from this round's mistakes: 0 good, 1 medium, 2+ bad. */
export function suggestMastery(mistakes: number): MasteryLevel {
  if (mistakes <= 0) return 'good'
  if (mistakes === 1) return 'medium'
  return 'bad'
}
