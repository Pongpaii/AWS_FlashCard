import type { LeaderboardEntry, MatchMode, StarRating, UserProgress } from '../types'
import { MATCH_MODES } from '../types'

/** The single localStorage key holding the whole progress document. */
export const STORAGE_KEY = 'aws-flashcards-progress'

/** How many runs the leaderboard keeps per mode. */
export const MAX_LEADERBOARD_PER_MODE = 10

/** How many recently dealt service ids are remembered (3 boards of 8). */
export const MAX_RECENT_IDS = 24

/**
 * Before modes existed the game had easy/medium/hard. Hard used today's board
 * size with descriptions, so its records carry over as `meaning`; the smaller
 * boards are not comparable and are dropped.
 */
const LEGACY_DIFFICULTY_TO_MODE: Record<string, MatchMode> = { hard: 'meaning' }

/** Longest accepted player name. */
export const MAX_PLAYER_NAME_LENGTH = 20

/** Name used when the player leaves the field blank. */
export const ANONYMOUS_NAME = 'ผู้เล่นนิรนาม'

/** Progress used for a brand new user, or whenever stored data is unusable. */
export const DEFAULT_PROGRESS: UserProgress = {
  flashCards: {
    totalStudied: 0,
    mastered: [],
    learning: [],
    reviewing: [],
    lastStudyDate: '',
    streak: 0,
  },
  matchGame: {
    gamesPlayed: 0,
    bestTime: {},
    bestScore: {},
    lastPlayDate: '',
    recentIds: [],
  },
  quiz: {
    quizzesTaken: 0,
    bestPercent: 0,
    totalAnswered: 0,
    totalCorrect: 0,
    lastQuizDate: '',
  },
  playerName: '',
  leaderboard: [],
  starred: [],
}

/** Deep copy of DEFAULT_PROGRESS so callers can never mutate the shared constant. */
export function defaultProgress(): UserProgress {
  return {
    flashCards: { ...DEFAULT_PROGRESS.flashCards, mastered: [], learning: [], reviewing: [] },
    matchGame: { ...DEFAULT_PROGRESS.matchGame, bestTime: {}, bestScore: {}, recentIds: [] },
    quiz: { ...DEFAULT_PROGRESS.quiz },
    playerName: '',
    leaderboard: [],
    starred: [],
  }
}

/** Trims and length-caps a player name, falling back to the anonymous label. */
export function sanitizePlayerName(value: unknown): string {
  if (typeof value !== 'string') return ANONYMOUS_NAME
  // Collapse whitespace so names cannot be padded to fake a different entry.
  const cleaned = value.replace(/\s+/g, ' ').trim().slice(0, MAX_PLAYER_NAME_LENGTH)
  return cleaned.length === 0 ? ANONYMOUS_NAME : cleaned
}

/**
 * Leaderboard ordering: fastest time wins, fewer guesses breaks a tie, and an
 * earlier run wins when both are identical.
 */
export function compareLeaderboardEntries(a: LeaderboardEntry, b: LeaderboardEntry): number {
  if (a.seconds !== b.seconds) return a.seconds - b.seconds
  if (a.attempts !== b.attempts) return a.attempts - b.attempts
  return a.playedAt.localeCompare(b.playedAt)
}

/** Keeps only the top runs of a single mode, sorted best first. */
function topEntries(entries: LeaderboardEntry[]): LeaderboardEntry[] {
  return [...entries].sort(compareLeaderboardEntries).slice(0, MAX_LEADERBOARD_PER_MODE)
}

/**
 * Adds a run to the board and reports the rank it earned.
 * `rank` is 1-based, or null when the run did not make the cut.
 */
export function insertLeaderboardEntry(
  leaderboard: readonly LeaderboardEntry[],
  entry: LeaderboardEntry,
): { leaderboard: LeaderboardEntry[]; rank: number | null } {
  const others = leaderboard.filter((item) => item.mode !== entry.mode)
  const sameMode = topEntries([...leaderboard.filter((item) => item.mode === entry.mode), entry])

  const index = sameMode.findIndex((item) => item.id === entry.id)

  return {
    leaderboard: [...others, ...sameMode],
    rank: index === -1 ? null : index + 1,
  }
}

/** Every run of one mode, best first. */
export function leaderboardFor(
  leaderboard: readonly LeaderboardEntry[],
  mode: MatchMode,
): LeaderboardEntry[] {
  return leaderboard.filter((entry) => entry.mode === mode).sort(compareLeaderboardEntries)
}

const MODE_SET = new Set<string>(MATCH_MODES)

/** Reads the mode of a stored entry, migrating the legacy `difficulty` field. */
function toMode(source: Record<string, unknown>): MatchMode | null {
  if (typeof source.mode === 'string' && MODE_SET.has(source.mode)) {
    return source.mode as MatchMode
  }
  if (typeof source.difficulty === 'string') {
    return LEGACY_DIFFICULTY_TO_MODE[source.difficulty] ?? null
  }
  return null
}

/** Coerces one stored value into a valid entry, or null when unusable. */
function toLeaderboardEntry(raw: unknown): LeaderboardEntry | null {
  if (typeof raw !== 'object' || raw === null) return null
  const source = raw as Record<string, unknown>

  const mode = toMode(source)
  if (mode === null) return null
  if (typeof source.seconds !== 'number' || !Number.isFinite(source.seconds) || source.seconds <= 0) {
    return null
  }
  if (
    typeof source.attempts !== 'number' ||
    !Number.isFinite(source.attempts) ||
    source.attempts <= 0
  ) {
    return null
  }

  const stars = source.stars
  const safeStars: StarRating = stars === 1 || stars === 2 || stars === 3 ? stars : 1

  return {
    id: typeof source.id === 'string' && source.id.length > 0 ? source.id : createEntryId(),
    name: sanitizePlayerName(source.name),
    mode,
    seconds: Math.round(source.seconds),
    attempts: Math.round(source.attempts),
    stars: safeStars,
    playedAt: typeof source.playedAt === 'string' ? source.playedAt : new Date(0).toISOString(),
  }
}

/** Drops unusable entries, then trims each mode to its top runs. */
export function normalizeLeaderboard(raw: unknown): LeaderboardEntry[] {
  if (!Array.isArray(raw)) return []

  const parsed: LeaderboardEntry[] = []
  const seenIds = new Set<string>()
  for (const item of raw) {
    const entry = toLeaderboardEntry(item)
    if (entry === null || seenIds.has(entry.id)) continue
    seenIds.add(entry.id)
    parsed.push(entry)
  }

  return MATCH_MODES.flatMap((mode) => topEntries(parsed.filter((entry) => entry.mode === mode)))
}

/** Unique-enough id for a leaderboard row without pulling in a uuid dependency. */
export function createEntryId(): string {
  const random = Math.random().toString(36).slice(2, 10)
  return `${Date.now().toString(36)}-${random}`
}

/** Today's date as an ISO "YYYY-MM-DD" string in the user's local timezone. */
export function todayISO(now: Date = new Date()): string {
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/

/** Whole days between two ISO dates, or null when either value is unparsable. */
function daysBetween(from: string, to: string): number | null {
  if (!ISO_DATE.test(from) || !ISO_DATE.test(to)) return null
  const a = Date.parse(`${from}T00:00:00Z`)
  const b = Date.parse(`${to}T00:00:00Z`)
  if (Number.isNaN(a) || Number.isNaN(b)) return null
  return Math.round((b - a) / 86_400_000)
}

/**
 * Consecutive-day streak.
 * Same day keeps the streak, exactly one day later increments it, anything else
 * (including a missing or malformed previous date) restarts at 1.
 */
export function calculateStreak(lastDate: string, today: string, currentStreak: number): number {
  const safeStreak = Number.isFinite(currentStreak) && currentStreak > 0 ? Math.floor(currentStreak) : 0
  const gap = daysBetween(lastDate, today)

  if (gap === null) return 1
  if (gap === 0) return Math.max(safeStreak, 1)
  if (gap === 1) return safeStreak + 1
  return 1
}

// --- Sanitisation helpers: everything read back from localStorage is untrusted. ---

function toStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return []
  const seen = new Set<string>()
  for (const item of value) {
    if (typeof item === 'string' && item.length > 0) seen.add(item)
  }
  return [...seen]
}

function toCount(value: unknown): number {
  if (typeof value !== 'number' || !Number.isFinite(value) || value < 0) return 0
  return Math.floor(value)
}

function toIsoDate(value: unknown): string {
  return typeof value === 'string' && ISO_DATE.test(value) ? value : ''
}

function toPositiveNumberMap(value: unknown): Record<string, number> {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) return {}
  const result: Record<string, number> = {}
  for (const [key, raw] of Object.entries(value as Record<string, unknown>)) {
    if (typeof raw === 'number' && Number.isFinite(raw) && raw > 0) {
      result[key] = raw
    }
  }
  return result
}

/**
 * Keeps only per-mode best records. A legacy "hard" record becomes the
 * `meaning` record unless one already exists; the better of the two wins.
 */
function toModeRecordMap(value: unknown): Record<string, number> {
  const raw = toPositiveNumberMap(value)
  const result: Record<string, number> = {}

  for (const [key, amount] of Object.entries(raw)) {
    const mode = MODE_SET.has(key) ? key : LEGACY_DIFFICULTY_TO_MODE[key]
    if (mode === undefined) continue
    const previous = result[mode]
    result[mode] = previous === undefined ? amount : Math.min(previous, amount)
  }

  return result
}

/**
 * Coerces an arbitrary parsed value into a valid UserProgress, filling missing
 * fields from the defaults. When `validIds` is supplied, service ids that no
 * longer exist in the dataset are dropped. The three mastery lists are kept
 * disjoint with priority mastered > learning > reviewing.
 */
export function normalizeProgress(raw: unknown, validIds?: ReadonlySet<string>): UserProgress {
  const base = defaultProgress()
  if (typeof raw !== 'object' || raw === null) return base

  const source = raw as Record<string, unknown>
  const fc = (typeof source.flashCards === 'object' && source.flashCards !== null
    ? source.flashCards
    : {}) as Record<string, unknown>
  const mg = (typeof source.matchGame === 'object' && source.matchGame !== null
    ? source.matchGame
    : {}) as Record<string, unknown>
  const qz = (typeof source.quiz === 'object' && source.quiz !== null
    ? source.quiz
    : {}) as Record<string, unknown>

  const keepKnownIds = (ids: string[]) => (validIds ? ids.filter((id) => validIds.has(id)) : ids)

  const mastered = keepKnownIds(toStringArray(fc.mastered))
  const masteredSet = new Set(mastered)
  const learning = keepKnownIds(toStringArray(fc.learning)).filter((id) => !masteredSet.has(id))
  const learningSet = new Set(learning)
  const reviewing = keepKnownIds(toStringArray(fc.reviewing)).filter(
    (id) => !masteredSet.has(id) && !learningSet.has(id),
  )

  return {
    flashCards: {
      totalStudied: toCount(fc.totalStudied),
      mastered,
      learning,
      reviewing,
      lastStudyDate: toIsoDate(fc.lastStudyDate),
      streak: toCount(fc.streak),
    },
    matchGame: {
      gamesPlayed: toCount(mg.gamesPlayed),
      bestTime: toModeRecordMap(mg.bestTime),
      bestScore: toModeRecordMap(mg.bestScore),
      lastPlayDate: toIsoDate(mg.lastPlayDate),
      recentIds: keepKnownIds(toStringArray(mg.recentIds)).slice(0, MAX_RECENT_IDS),
    },
    quiz: {
      quizzesTaken: toCount(qz.quizzesTaken),
      // A percentage can never exceed 100, however odd the stored value is.
      bestPercent: Math.min(100, toCount(qz.bestPercent)),
      totalAnswered: toCount(qz.totalAnswered),
      // Correct answers can never outnumber the questions answered.
      totalCorrect: Math.min(toCount(qz.totalCorrect), toCount(qz.totalAnswered)),
      lastQuizDate: toIsoDate(qz.lastQuizDate),
    },
    // An empty name stays empty: it means "never entered one yet", so the input
    // starts blank rather than pre-filled with the anonymous label.
    playerName:
      typeof source.playerName === 'string' && source.playerName.trim().length > 0
        ? sanitizePlayerName(source.playerName)
        : '',
    leaderboard: normalizeLeaderboard(source.leaderboard),
    starred: keepKnownIds(toStringArray(source.starred)),
  }
}

/**
 * Reads progress from localStorage. Never throws: a missing key, broken JSON,
 * an unexpected shape, or a blocked storage API all fall back to defaults.
 */
export function loadProgress(validIds?: ReadonlySet<string>): UserProgress {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (stored === null) return defaultProgress()
    return normalizeProgress(JSON.parse(stored), validIds)
  } catch {
    // Private mode, disabled storage, or corrupt JSON: start clean.
    return defaultProgress()
  }
}

/**
 * Persists progress. Swallows quota and security errors so that a failed write
 * never breaks the session; in-memory state remains the source of truth.
 */
export function saveProgress(progress: UserProgress): boolean {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
    return true
  } catch {
    return false
  }
}

/** Removes the stored document. Used by the "reset progress" action. */
export function clearProgress(): void {
  try {
    window.localStorage.removeItem(STORAGE_KEY)
  } catch {
    // Nothing to recover from: the caller resets in-memory state regardless.
  }
}
