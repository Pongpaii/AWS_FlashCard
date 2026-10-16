import type { CategoryFilterValue, MasteryLevel, MatchItem, RandomFn } from '../types'

/** What the picker needs to know about the learner. */
export interface PickContext {
  /** Ids already dealt in the current cycle, newest first. Not dealt again until the cycle ends. */
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

/** The services a board draws from: the category, or everything when it is too small. */
export function matchPool(
  services: readonly MatchItem[],
  count: number,
  category: CategoryFilterValue,
): { pool: readonly MatchItem[]; usedFallback: boolean } {
  const inCategory =
    category === 'all' ? services : services.filter((service) => service.category === category)
  const usedFallback = inCategory.length < count
  return { pool: usedFallback ? services : inCategory, usedFallback }
}

/** How many words of the pool have not been dealt yet in the current cycle. */
export function remainingInCycle(pool: readonly MatchItem[], dealtIds: readonly string[]): number {
  const dealt = new Set(dealtIds)
  return pool.filter((service) => !dealt.has(service.id)).length
}

export interface MatchPick {
  picked: MatchItem[]
  usedFallback: boolean
  /** True when the pool ran out and a new cycle started with this board. */
  cycleRestarted: boolean
  /** The dealt list to persist after this board (newest first). */
  nextDealtIds: string[]
  /** Words of the pool still undealt after this board. */
  remaining: number
  poolSize: number
}

/**
 * Chooses the services for one board, deck style: a word is not dealt again
 * until every word of the pool has been dealt once in the current cycle.
 *
 * 1. Restrict to the category, or fall back to every service when the category
 *    is too small for a full board.
 * 2. Draw from words not yet dealt this cycle, weighted so starred and poorly
 *    remembered words come up earlier in the cycle.
 * 3. When fewer undealt words remain than a board needs, deal all of them,
 *    start a new cycle, and top up from the rest of the pool.
 */
export function pickMatchServices(
  services: readonly MatchItem[],
  count: number,
  category: CategoryFilterValue,
  context: PickContext,
  rng: RandomFn = Math.random,
): MatchPick {
  const { pool, usedFallback } = matchPool(services, count, category)
  const dealtIds = [...context.recentIds]

  if (count <= 0) {
    return {
      picked: [],
      usedFallback,
      cycleRestarted: false,
      nextDealtIds: dealtIds,
      remaining: remainingInCycle(pool, dealtIds),
      poolSize: pool.length,
    }
  }

  const weight = (service: MatchItem) => weightFor(service.id, context)
  const dealt = new Set(dealtIds)
  const fresh = pool.filter((service) => !dealt.has(service.id))

  if (fresh.length >= count) {
    const picked = weightedSample(fresh, count, weight, rng)
    const nextDealtIds = pushRecentIds(dealtIds, picked.map((service) => service.id), Infinity)
    return {
      picked,
      usedFallback,
      cycleRestarted: false,
      nextDealtIds,
      remaining: fresh.length - count,
      poolSize: pool.length,
    }
  }

  // End of the cycle: the last undealt words, plus the start of a new cycle.
  const freshIds = new Set(fresh.map((service) => service.id))
  const topUp = weightedSample(
    pool.filter((service) => !freshIds.has(service.id)),
    count - fresh.length,
    weight,
    rng,
  )
  const picked = [...weightedSample(fresh, fresh.length, weight, rng), ...topUp]

  // Forget this pool's old cycle; words outside it (other categories) keep theirs.
  const poolIds = new Set(pool.map((service) => service.id))
  const nextDealtIds = pushRecentIds(
    dealtIds.filter((id) => !poolIds.has(id)),
    topUp.map((service) => service.id),
    Infinity,
  )

  return {
    picked,
    usedFallback,
    cycleRestarted: true,
    nextDealtIds,
    remaining: pool.length - topUp.length,
    poolSize: pool.length,
  }
}

/** Bonus Time: fewer pairs, a ticking clock, and only the hardest words. */
export const BONUS_PAIR_COUNT = 6
export const BONUS_START_SECONDS = 40
/** Seconds added for every correct pair. */
export const BONUS_TIME_GAIN = 3
/** Seconds removed for every wrong pick. */
export const BONUS_TIME_PENALTY = 5
/** Highest combo multiplier. */
export const BONUS_MAX_COMBO = 5

/**
 * Chooses the hardest words for a Bonus Time board: words missed in the round
 * just played first, then the forgotten / starred ones, random among equals.
 */
export function pickBonusServices(
  services: readonly MatchItem[],
  count: number,
  roundMistakes: Readonly<Record<string, number>>,
  context: Omit<PickContext, 'recentIds'>,
  rng: RandomFn = Math.random,
): MatchItem[] {
  const scoreContext: PickContext = { ...context, recentIds: [] }
  return services
    .map((service) => ({
      service,
      score:
        (roundMistakes[service.id] ?? 0) * 100 + weightFor(service.id, scoreContext) * 10 + rng(),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, Math.max(0, count))
    .map((entry) => entry.service)
}

/** Points for a correct pair at a given combo (1 = first in a row). */
export function bonusPairPoints(combo: number): number {
  return 100 * Math.min(Math.max(1, combo), BONUS_MAX_COMBO)
}

/** Points for clearing the board with time left. */
export function bonusTimePoints(secondsLeft: number): number {
  return Math.max(0, Math.floor(secondsLeft)) * 20
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
