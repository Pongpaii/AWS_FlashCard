// Domain types shared across the whole app. Kept free of React imports on purpose
// so that pure utilities can depend on them without pulling in the UI layer.

/** The ten AWS service categories covered by the CLF-C02 exam blueprint. */
export type Category =
  | 'Compute'
  | 'Storage'
  | 'Database'
  | 'Networking'
  | 'Security'
  | 'Serverless'
  | 'Management'
  | 'AI/ML'
  | 'Migration'
  | 'Billing'

/** Ordered list of every category. Used for filters and validation. */
export const CATEGORIES: readonly Category[] = [
  'Compute',
  'Storage',
  'Database',
  'Networking',
  'Security',
  'Serverless',
  'Management',
  'AI/ML',
  'Migration',
  'Billing',
] as const

/** Match Game difficulty levels. */
export type Difficulty = 'easy' | 'medium' | 'hard'

/** Ordered list of every difficulty. */
export const DIFFICULTIES: readonly Difficulty[] = ['easy', 'medium', 'hard'] as const

/** Number of pairs on the board for each difficulty level. */
export const PAIR_COUNT: Record<Difficulty, number> = {
  easy: 4,
  medium: 6,
  hard: 8,
}

/** A category filter value: a concrete category or the "all" pseudo-value. */
export type CategoryFilterValue = Category | 'all'

/** Flash Card deck mode: study everything, or only cards not yet mastered. */
export type DeckMode = 'all' | 'review'

/** A single AWS service entry from the static dataset. */
export interface AWSService {
  /** Unique kebab-case key, e.g. "ec2", "s3-glacier". */
  id: string
  /** Short service name shown on the card front, e.g. "EC2". */
  name: string
  /** Expanded product name, e.g. "Elastic Compute Cloud". */
  fullName: string
  category: Category
  /** Short Thai summary, also used as the description card in Match Game. */
  description: string
  /** Main responsibility of the service (Thai + English technical terms). */
  answer: string
  /** Memory aid or a real-world use case. */
  hint: string
  /** Points that frequently show up on the CLF-C02 exam. */
  examTips?: string
}

/** The six pillars of the AWS Well-Architected Framework. */
export type PillarId =
  | 'operational-excellence'
  | 'security'
  | 'reliability'
  | 'performance-efficiency'
  | 'cost-optimization'
  | 'sustainability'

/** Ordered exactly as AWS publishes them, which is the order to memorise. */
export const PILLAR_IDS: readonly PillarId[] = [
  'operational-excellence',
  'security',
  'reliability',
  'performance-efficiency',
  'cost-optimization',
  'sustainability',
] as const

/** One design principle inside a pillar. */
export interface DesignPrinciple {
  /** The English wording AWS uses; this is the phrase the exam echoes. */
  en: string
  /** Thai gloss of what it actually means. */
  th: string
}

/** One pillar of the Well-Architected Framework, written as study notes. */
export interface WellArchitectedPillar {
  id: PillarId
  /** English name, e.g. "Reliability". */
  name: string
  /** Thai name shown next to the English one. */
  nameTh: string
  /** The one question this pillar answers, in Thai. */
  focus: string
  /** One-line Thai definition from the framework. */
  definition: string
  /** AWS design principles for this pillar, in the published order. */
  principles: DesignPrinciple[]
  /** Words in an exam scenario that point at this pillar. */
  keywords: string[]
  /** Service ids from the dataset that typically show up with this pillar. */
  services: string[]
  /** The trap the exam likes to set between this pillar and its neighbours. */
  examTips: string
}

/** One item in the pillar recall drill: a cue and the pillar that answers it. */
export interface PillarDrillItem {
  id: string
  /** Scenario fragment in Thai, phrased the way the exam phrases it. */
  cue: string
  answer: PillarId
  /** Why that pillar, shown after the answer is revealed. */
  why: string
}

/**
 * The five AWS Support plans tested on CLF-C02, ordered from cheapest to
 * richest. Kept as ids so the UI can key columns and rows off them.
 */
export type SupportPlanTier =
  | 'basic'
  | 'developer'
  | 'business'
  | 'enterprise-on-ramp'
  | 'enterprise'

/** Ordered list of every support plan tier. Drives the comparison columns. */
export const SUPPORT_PLAN_TIERS: readonly SupportPlanTier[] = [
  'basic',
  'developer',
  'business',
  'enterprise-on-ramp',
  'enterprise',
] as const

/** Case severity levels used in the AWS Support response-time table. */
export type SupportSeverity =
  | 'general-guidance'
  | 'system-impaired'
  | 'production-impaired'
  | 'production-down'
  | 'business-critical-down'

/** Ordered from least to most urgent, matching the AWS published table. */
export const SUPPORT_SEVERITIES: readonly SupportSeverity[] = [
  'general-guidance',
  'system-impaired',
  'production-impaired',
  'production-down',
  'business-critical-down',
] as const

/** One AWS Support plan, written as study notes for the exam. */
export interface SupportPlan {
  id: SupportPlanTier
  /** Short label used in tables, e.g. "Business". */
  name: string
  /** Full product name, e.g. "AWS Business Support". */
  fullName: string
  /** One-line Thai summary of who the plan is for. */
  tagline: string
  /** Price rule in Thai, including the monthly minimum. */
  price: string
  /** Contact channels and who may open cases. */
  channels: string
  /**
   * Response time per severity in Thai. `null` means the plan does not cover
   * that severity at all, which is the point most exam questions turn on.
   */
  responseTimes: Record<SupportSeverity, string | null>
  /** What the plan gets from Trusted Advisor. */
  trustedAdvisor: string
  /** Technical Account Manager entitlement. */
  tam: string
  /** Typical scenario wording that points at this plan. */
  bestFor: string
  /** Bullet points worth remembering. */
  highlights: string[]
  /** The trap or discriminator the exam likes to test. */
  examTips: string
}

/** One row of the plan-by-plan feature matrix. */
export interface SupportFeatureRow {
  /** Feature name in Thai (English term kept where it is the exam keyword). */
  label: string
  /** `true` = included, `false` = not included, string = short detail. */
  values: Record<SupportPlanTier, string | boolean>
}

/** Flash Card session state owned by useFlashCards. */
export interface FlashCardState {
  currentIndex: number
  isFlipped: boolean
  /** Service ids marked as mastered in this session. */
  knownCards: string[]
  /** Service ids marked as still shaky in this session. */
  unknownCards: string[]
  category: CategoryFilterValue
}

/**
 * One tile on the Match Game board. Every tile shows its content from the
 * start (Quizlet-style matching), so there is no face-down state.
 */
export interface MatchCard {
  /** `${pairId}-service` or `${pairId}-description`. */
  id: string
  /** Service id shared by the two cards of a pair. */
  pairId: string
  /** Service name or Thai description, depending on `type`. */
  content: string
  /**
   * Secondary line shown under `content`. Carries the expanded product name on
   * `service` tiles (e.g. "Elastic Compute Cloud" under "EC2"). Omitted when
   * there is nothing extra to add. Never used for matching.
   */
  subtitle?: string
  type: 'service' | 'description'
  isMatched: boolean
}

/**
 * A term/meaning pair that can be dealt onto a match board. Decoupled from
 * `AWSService` so the same board works for framework concepts and pricing
 * terms, not just services.
 */
export interface MatchPair {
  /** Unique across every deck; both tiles of the pair share it. */
  pairId: string
  /** Left-hand side: the thing to name. */
  term: string
  /** Optional second line under the term, never used for matching. */
  termSubtitle?: string
  /** Right-hand side: what the term means. */
  meaning: string
}

/** A checkbox-selectable set of pairs in the custom match builder. */
export interface MatchGroup {
  id: string
  /** Thai label shown in the builder. */
  label: string
  /** Short hint about what the pairs are, e.g. "ชื่อบริการ ↔ หน้าที่". */
  hint: string
  pairs: MatchPair[]
}

/** A themed collection of groups, shown as one tab in the builder. */
export interface MatchDeck {
  id: string
  label: string
  description: string
  groups: MatchGroup[]
}

/** State of a custom match round; mirrors MatchGameState without difficulty. */
export interface CustomMatchState {
  cards: MatchCard[]
  selectedIds: string[]
  wrongIds: string[]
  matchedPairs: string[]
  attempts: number
  startTime: number | null
  isComplete: boolean
  /** Number of pairs dealt onto the board. */
  pairCount: number
}

/** One AWS CAF perspective. */
export interface CafPerspective {
  id: string
  /** English name, e.g. "Governance". */
  name: string
  nameTh: string
  /** One-line Thai answer to "perspective นี้ดูเรื่องอะไร". */
  focus: string
  /** Longer Thai definition. */
  definition: string
  /** Typical stakeholders, as the whitepaper lists them. */
  stakeholders: string[]
  /** Example foundational capabilities with a short Thai gloss. */
  capabilities: { name: string; th: string }[]
  examTips: string
}

/** One item in a generic concept recall drill. */
export interface ConceptDrillItem {
  id: string
  cue: string
  /** Id of the correct option. */
  answer: string
  why: string
}

/** Match Game state owned by useMatchGame. */
export interface MatchGameState {
  cards: MatchCard[]
  /** Ids of the currently selected, unmatched tiles. Never longer than 2. */
  selectedIds: string[]
  /** Ids briefly flagged after a wrong pick, for red feedback. */
  wrongIds: string[]
  /** pairIds already solved. */
  matchedPairs: string[]
  attempts: number
  /** Epoch ms when the board was dealt, or null before the game starts. */
  startTime: number | null
  isComplete: boolean
  difficulty: Difficulty
}

/** Flash Card slice of the persisted progress. */
export interface FlashCardProgress {
  totalStudied: number
  /** Service ids the user marked as mastered. */
  mastered: string[]
  /** Service ids the user marked as needing review. */
  reviewing: string[]
  /** ISO date "YYYY-MM-DD"; empty string when the user never studied. */
  lastStudyDate: string
  streak: number
}

/** Match Game slice of the persisted progress. */
export interface MatchGameProgress {
  gamesPlayed: number
  /** difficulty -> best (lowest) seconds. */
  bestTime: Record<string, number>
  /** difficulty -> best (lowest) attempts. */
  bestScore: Record<string, number>
  lastPlayDate: string
}

/** The four CLF-C02 exam domains, used to group and filter quiz questions. */
export type QuizDomain =
  | 'Cloud Concepts'
  | 'Security & Compliance'
  | 'Technology'
  | 'Billing & Support'

/** Ordered list of every quiz domain. */
export const QUIZ_DOMAINS: readonly QuizDomain[] = [
  'Cloud Concepts',
  'Security & Compliance',
  'Technology',
  'Billing & Support',
] as const

/** A domain filter value: one concrete domain or the "all" pseudo-value. */
export type QuizDomainFilter = QuizDomain | 'all'

/** One scenario-based multiple choice question. */
export interface QuizQuestion {
  id: string
  domain: QuizDomain
  /** Situation the learner is placed in, in Thai. */
  scenario: string
  /** What is actually being asked. */
  question: string
  /** Answer options; exactly one is correct. */
  choices: string[]
  /** Index into `choices` of the single correct answer. */
  correctIndex: number
  /** Why the answer is right, and why the tempting ones are not. */
  explanation: string
  /** Service ids from the dataset, for cross-linking to the Learn tab. */
  relatedServices?: string[]
}

/** One option as presented to the player, after the choices are shuffled. */
export interface QuizOption {
  text: string
  isCorrect: boolean
}

/** A question prepared for a session, with its options already shuffled. */
export interface PreparedQuizQuestion {
  question: QuizQuestion
  options: QuizOption[]
}

/** Quiz statistics kept across sessions. */
export interface QuizProgress {
  quizzesTaken: number
  /** Best score as a whole percentage, 0-100. */
  bestPercent: number
  /** Running totals, so overall accuracy can be shown. */
  totalAnswered: number
  totalCorrect: number
  lastQuizDate: string
}

/** One finished Match Game run, as shown on the leaderboard. */
export interface LeaderboardEntry {
  /** Unique key for React lists and de-duplication. */
  id: string
  /** Display name supplied by the player. */
  name: string
  difficulty: Difficulty
  /** Completion time in seconds; lower is better. */
  seconds: number
  /** Number of guesses; the tie-breaker. */
  attempts: number
  stars: StarRating
  /** ISO timestamp of when the run finished. */
  playedAt: string
}

/** Everything persisted under the single localStorage key. */
export interface UserProgress {
  flashCards: FlashCardProgress
  matchGame: MatchGameProgress
  quiz: QuizProgress
  /** Last name the player entered, reused as the default next time. */
  playerName: string
  /** Best runs per difficulty, already sorted fastest first. */
  leaderboard: LeaderboardEntry[]
}

/** Aggregate counters shown next to the Flash Card deck. */
export interface DeckStats {
  known: number
  unknown: number
  remaining: number
  total: number
}

/** Star rating awarded at the end of a Match Game. */
export type StarRating = 1 | 2 | 3

/** Injectable random source so that shuffling is reproducible in tests. */
export type RandomFn = () => number
