import type { RandomFn } from '../types'

/**
 * Fisher-Yates shuffle. Pure: returns a new array and never mutates the input.
 * `rng` is injectable so callers (and tests) can make the result reproducible.
 */
export function shuffle<T>(items: readonly T[], rng: RandomFn = Math.random): T[] {
  const result = [...items]

  for (let i = result.length - 1; i > 0; i -= 1) {
    // Clamp the raw random value so a misbehaving rng cannot produce an out-of-range index.
    const raw = rng()
    const bounded = Number.isFinite(raw) ? Math.min(Math.max(raw, 0), 0.999999999) : 0
    const j = Math.floor(bounded * (i + 1))
    const tmp = result[i]
    result[i] = result[j]
    result[j] = tmp
  }

  return result
}

/**
 * Picks `count` distinct items at random. When fewer items are available than
 * requested, every item is returned (shuffled) rather than throwing.
 */
export function sample<T>(items: readonly T[], count: number, rng: RandomFn = Math.random): T[] {
  if (count <= 0) return []
  return shuffle(items, rng).slice(0, Math.min(count, items.length))
}
