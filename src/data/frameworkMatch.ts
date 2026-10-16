import type { FrameworkMatchMode, MatchItem, MatchMode, MatchPair } from '../types'
import { SERVICE_IDS } from './awsServices'
import { pairsForGroups } from './matchDecks'

/**
 * Word pools for the framework-themed Match Game modes. They reuse the pair
 * groups of the custom match builder, so the wording stays in one place.
 */

function toMatchItem(pair: MatchPair): MatchItem {
  return {
    id: pair.pairId,
    name: pair.term,
    fullName: pair.termSubtitle ?? pair.term,
    description: pair.meaning,
  }
}

/** Groups dealt by each framework mode. */
const FRAMEWORK_GROUPS: Record<FrameworkMatchMode, string[]> = {
  // Perspectives first so the core 6-4-4 structure dominates the pool order.
  caf: ['caf-perspectives', 'caf-phases', 'caf-domains', 'caf-capabilities'],
  waf: ['wa-pillars', 'wa-principle-to-pillar'],
}

export const FRAMEWORK_MATCH_ITEMS: Record<FrameworkMatchMode, readonly MatchItem[]> = {
  caf: pairsForGroups(FRAMEWORK_GROUPS.caf).map(toMatchItem),
  waf: pairsForGroups(FRAMEWORK_GROUPS.waf).map(toMatchItem),
}

export function isFrameworkMode(mode: MatchMode): mode is FrameworkMatchMode {
  return mode === 'caf' || mode === 'waf'
}

/** Ids of every framework word, so stars / mastery / dealt history accept them. */
export const FRAMEWORK_ITEM_IDS: ReadonlySet<string> = new Set(
  Object.values(FRAMEWORK_MATCH_ITEMS).flatMap((items) => items.map((item) => item.id)),
)

/** Every id the progress store keeps: AWS services plus framework words. */
export const TRACKED_IDS: ReadonlySet<string> = new Set([...SERVICE_IDS, ...FRAMEWORK_ITEM_IDS])
