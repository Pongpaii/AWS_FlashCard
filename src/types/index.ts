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
