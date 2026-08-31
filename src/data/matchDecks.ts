import type { MatchDeck, MatchGroup, MatchPair } from '../types'
import { CATEGORIES } from '../types'
import { CATEGORY_LABELS_TH, awsServices } from './awsServices'
import { cafDomains, cafPerspectives, cafPhases } from './cloudAdoptionFramework'
import { pricingModelPairs, pricingRulePairs, pricingToolPairs } from './pricingTerms'
import { wellArchitectedPillars } from './wellArchitected'

/**
 * Every pair pool the custom match builder can deal from.
 *
 * A group is the smallest selectable unit; a deck is just a tab that groups
 * related groups together. Pair ids are namespaced per group so that mixing
 * groups on one board can never collide.
 */

/** One group per service category: service name ↔ Thai description. */
function serviceGroups(): MatchGroup[] {
  return CATEGORIES.map((category) => {
    const pairs: MatchPair[] = awsServices
      .filter((service) => service.category === category)
      .map((service) => ({
        pairId: `svc-${service.id}`,
        term: service.name,
        ...(service.fullName !== service.name ? { termSubtitle: service.fullName } : {}),
        meaning: service.description,
      }))

    return {
      id: `services-${category}`,
      label: `${CATEGORY_LABELS_TH[category]} — ${category}`,
      hint: 'ชื่อบริการ ↔ หน้าที่',
      pairs,
    }
  })
}

/** Pillar name ↔ what the pillar is about. */
function pillarGroup(): MatchGroup {
  return {
    id: 'wa-pillars',
    label: '6 pillars',
    hint: 'ชื่อ pillar ↔ เรื่องที่ pillar นั้นดู',
    pairs: wellArchitectedPillars.map((pillar) => ({
      pairId: `wa-pillar-${pillar.id}`,
      term: pillar.name,
      termSubtitle: pillar.nameTh,
      meaning: pillar.focus,
    })),
  }
}

/** One group per pillar: design principle (English) ↔ Thai meaning. */
function principleGroups(): MatchGroup[] {
  return wellArchitectedPillars.map((pillar) => ({
    id: `wa-principles-${pillar.id}`,
    label: `Design principles — ${pillar.name}`,
    hint: 'ชื่อหลักการภาษาอังกฤษ ↔ ความหมาย',
    pairs: pillar.principles.map((principle, index) => ({
      pairId: `wa-dp-${pillar.id}-${index}`,
      term: principle.en,
      termSubtitle: pillar.name,
      meaning: principle.th,
    })),
  }))
}

/**
 * Design principle ↔ the pillar it belongs to. Meanings repeat across pairs, so
 * this group phrases the meaning tile per principle to keep every tile unique.
 */
function principleToPillarGroup(): MatchGroup {
  const pairs: MatchPair[] = []

  for (const pillar of wellArchitectedPillars) {
    for (const [index, principle] of pillar.principles.entries()) {
      pairs.push({
        pairId: `wa-map-${pillar.id}-${index}`,
        term: principle.en,
        meaning: `อยู่ใน ${pillar.name} — ${principle.th}`,
      })
    }
  }

  return {
    id: 'wa-principle-to-pillar',
    label: 'หลักการอยู่ pillar ไหน (รวมทุก pillar)',
    hint: 'ชื่อหลักการ ↔ pillar ที่สังกัด',
    pairs,
  }
}

/** CAF perspective ↔ what it covers. */
function cafPerspectiveGroup(): MatchGroup {
  return {
    id: 'caf-perspectives',
    label: '6 perspectives',
    hint: 'ชื่อ perspective ↔ เรื่องที่ดู',
    pairs: cafPerspectives.map((perspective) => ({
      pairId: `caf-p-${perspective.id}`,
      term: perspective.name,
      termSubtitle: perspective.nameTh,
      meaning: perspective.focus,
    })),
  }
}

/** CAF capability ↔ what it does, tagged with its perspective. */
function cafCapabilityGroup(): MatchGroup {
  const pairs: MatchPair[] = []

  for (const perspective of cafPerspectives) {
    for (const capability of perspective.capabilities) {
      pairs.push({
        pairId: `caf-cap-${perspective.id}-${capability.name}`,
        term: capability.name,
        meaning: `${perspective.name} — ${capability.th}`,
      })
    }
  }

  return {
    id: 'caf-capabilities',
    label: 'Capabilities อยู่ perspective ไหน',
    hint: 'ชื่อ capability ↔ perspective และหน้าที่',
    pairs,
  }
}

/** CAF phase ↔ what happens in it. */
function cafPhaseGroup(): MatchGroup {
  return {
    id: 'caf-phases',
    label: '4 transformation phases',
    hint: 'ชื่อเฟส ↔ สิ่งที่ทำในเฟสนั้น',
    pairs: cafPhases.map((phase) => ({
      pairId: `caf-phase-${phase.id}`,
      term: phase.name,
      termSubtitle: phase.nameTh,
      meaning: phase.description,
    })),
  }
}

/** CAF transformation domain ↔ what it changes. */
function cafDomainGroup(): MatchGroup {
  return {
    id: 'caf-domains',
    label: '4 transformation domains',
    hint: 'ชื่อ domain ↔ สิ่งที่เปลี่ยน',
    pairs: cafDomains.map((domain) => ({
      pairId: `caf-domain-${domain.id}`,
      term: domain.name,
      termSubtitle: domain.nameTh,
      meaning: domain.description,
    })),
  }
}

/** All decks, in the order the builder shows them. */
export const matchDecks: MatchDeck[] = [
  {
    id: 'services',
    label: 'AWS Services',
    description: 'จับคู่ชื่อบริการกับหน้าที่ เลือกได้ทีละหมวดหรือหลายหมวดพร้อมกัน',
    groups: serviceGroups(),
  },
  {
    id: 'well-architected',
    label: 'Well-Architected',
    description: '6 pillars และ design principles ทั้งหมด เลือกฝึกทีละ pillar ได้',
    groups: [pillarGroup(), principleToPillarGroup(), ...principleGroups()],
  },
  {
    id: 'caf',
    label: 'Cloud Adoption Framework',
    description: '6 perspectives, 4 phases, 4 domains และ capabilities ที่ออกสอบบ่อย',
    groups: [cafPerspectiveGroup(), cafPhaseGroup(), cafDomainGroup(), cafCapabilityGroup()],
  },
  {
    id: 'pricing',
    label: 'Pricing & Billing',
    description: 'รูปแบบราคา เครื่องมือดูค่าใช้จ่าย และกฎการคิดเงินที่ออกสอบ',
    groups: [
      {
        id: 'pricing-models',
        label: 'รูปแบบการซื้อและ Free Tier',
        hint: 'ชื่อรูปแบบราคา ↔ เงื่อนไข',
        pairs: pricingModelPairs,
      },
      {
        id: 'pricing-tools',
        label: 'เครื่องมือด้านค่าใช้จ่าย',
        hint: 'ชื่อเครื่องมือ ↔ หน้าที่',
        pairs: pricingToolPairs,
      },
      {
        id: 'pricing-rules',
        label: 'กฎการคิดเงินที่ต้องจำ',
        hint: 'สิ่งที่คิดเงิน ↔ วิธีคิด',
        pairs: pricingRulePairs,
      },
    ],
  },
]

/** Flat lookup of every group by id. */
export const matchGroupById: Map<string, MatchGroup> = new Map(
  matchDecks.flatMap((deck) => deck.groups.map((group) => [group.id, group] as const)),
)

/** Which deck a group belongs to, so the builder can label selections. */
export const deckIdByGroupId: Map<string, string> = new Map(
  matchDecks.flatMap((deck) => deck.groups.map((group) => [group.id, deck.id] as const)),
)

/**
 * Collects the pairs of the given groups, skipping unknown ids.
 *
 * Deduplicates on both `pairId` and `term`: the same design principle appears in
 * its own pillar group and in the combined mapping group under different pair
 * ids, and two tiles showing the same term would make the board guesswork.
 */
export function pairsForGroups(groupIds: readonly string[]): MatchPair[] {
  const pairs: MatchPair[] = []
  const seenIds = new Set<string>()
  const seenTerms = new Set<string>()

  for (const groupId of groupIds) {
    const group = matchGroupById.get(groupId)
    if (group === undefined) continue

    for (const pair of group.pairs) {
      if (seenIds.has(pair.pairId) || seenTerms.has(pair.term)) continue
      seenIds.add(pair.pairId)
      seenTerms.add(pair.term)
      pairs.push(pair)
    }
  }

  return pairs
}

/** Ready-made selections for the quick-start buttons. */
export const MATCH_PRESETS: {
  id: string
  label: string
  blurb: string
  groupIds: string[]
  pairCount: number
}[] = [
  {
    id: 'preset-wa-pillars',
    label: 'Well-Architected: 6 pillars',
    blurb: 'จับคู่ชื่อ pillar กับเรื่องที่ดู 6 คู่',
    groupIds: ['wa-pillars'],
    pairCount: 6,
  },
  {
    id: 'preset-wa-principles',
    label: 'Well-Architected: design principles',
    blurb: 'สุ่มหลักการจากทุก pillar แล้วทายว่าอยู่ pillar ไหน',
    groupIds: ['wa-principle-to-pillar'],
    pairCount: 8,
  },
  {
    id: 'preset-caf-core',
    label: 'CAF: perspectives + phases + domains',
    blurb: 'โครงสร้างหลักของ CAF ครบทั้ง 6-4-4',
    groupIds: ['caf-perspectives', 'caf-phases', 'caf-domains'],
    pairCount: 8,
  },
  {
    id: 'preset-caf-capabilities',
    label: 'CAF: capabilities',
    blurb: 'ทายว่า capability อยู่ perspective ไหน',
    groupIds: ['caf-capabilities'],
    pairCount: 8,
  },
  {
    id: 'preset-pricing',
    label: 'Pricing ทั้งชุด',
    blurb: 'รูปแบบราคา เครื่องมือ และกฎการคิดเงิน',
    groupIds: ['pricing-models', 'pricing-tools', 'pricing-rules'],
    pairCount: 8,
  },
  {
    id: 'preset-mixed',
    label: 'รวมทุกกรอบแนวคิด',
    blurb: 'ผสม Well-Architected, CAF และ Pricing ในกระดานเดียว',
    groupIds: [
      'wa-pillars',
      'caf-perspectives',
      'caf-phases',
      'caf-domains',
      'pricing-models',
      'pricing-tools',
    ],
    pairCount: 10,
  },
]

/** Pair counts offered in the builder. */
export const PAIR_COUNT_OPTIONS: readonly number[] = [4, 6, 8, 10, 12] as const
