import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react'
import { SERVICE_IDS, TOTAL_SERVICES } from '../data/awsServices'
import type { Difficulty, LeaderboardEntry, StarRating, UserProgress } from '../types'
import {
  calculateStreak,
  clearProgress,
  createEntryId,
  defaultProgress,
  insertLeaderboardEntry,
  leaderboardFor as selectLeaderboard,
  loadProgress,
  sanitizePlayerName,
  saveProgress,
  todayISO,
} from '../utils/storage'

export interface ProgressSummary {
  masteredCount: number
  reviewingCount: number
  totalServices: number
  /** Percentage of the dataset marked as mastered, rounded to an integer. */
  masteredPercent: number
  streak: number
  gamesPlayed: number
  lastStudyDate: string
  hasFlashCardProgress: boolean
}

export interface SubmitScoreInput {
  name: string
  difficulty: Difficulty
  seconds: number
  attempts: number
  stars: StarRating
}

export interface UseProgressResult {
  progress: UserProgress
  summary: ProgressSummary
  /** Marks a service as mastered and persists the change. */
  recordMastered: (serviceId: string) => void
  /** Marks a service as needing review and persists the change. */
  recordReviewing: (serviceId: string) => void
  /** Stores the outcome of a finished Match Game. */
  recordMatchResult: (difficulty: Difficulty, seconds: number, attempts: number) => void
  /** Stores the outcome of a finished scenario quiz. */
  recordQuizResult: (correct: number, total: number) => void
  /**
   * Adds a finished run to the leaderboard and returns the rank it earned,
   * or null when it did not make the top of that difficulty.
   */
  submitScore: (input: SubmitScoreInput) => number | null
  /** Runs of one difficulty, fastest first. */
  leaderboardFor: (difficulty: Difficulty) => LeaderboardEntry[]
  /** Name remembered from the last run; empty when never set. */
  playerName: string
  setPlayerName: (name: string) => void
  /** Empties the leaderboard but keeps study progress. */
  clearLeaderboard: () => void
  /** Wipes both in-memory and stored progress. */
  resetProgress: () => void
  bestTimeFor: (difficulty: Difficulty) => number | null
  bestScoreFor: (difficulty: Difficulty) => number | null
}

/**
 * Owns everything persisted in localStorage: reads once on mount and writes
 * through on every mutation. Instantiated exactly once by ProgressProvider so
 * that every screen observes the same state.
 */
export function useProgressState(): UseProgressResult {
  // Lazy initialiser so localStorage is touched exactly once per mount.
  const [progress, setProgress] = useState<UserProgress>(() => loadProgress(SERVICE_IDS))

  // Mirror of the latest state, so submitScore can compute a rank synchronously
  // instead of waiting for the next render.
  const progressRef = useRef(progress)
  progressRef.current = progress

  /** Applies an update, persists it, and keeps in-memory state authoritative. */
  const commit = useCallback((updater: (current: UserProgress) => UserProgress) => {
    setProgress((current) => {
      const next = updater(current)
      progressRef.current = next
      // A failed write is non-fatal: the session continues with in-memory state.
      saveProgress(next)
      return next
    })
  }, [])

  /** Shared logic for marking a card, keeping mastered/reviewing disjoint. */
  const markCard = useCallback(
    (serviceId: string, target: 'mastered' | 'reviewing') => {
      if (!SERVICE_IDS.has(serviceId)) return

      commit((current) => {
        const { flashCards } = current
        const today = todayISO()

        const mastered = flashCards.mastered.filter((id) => id !== serviceId)
        const reviewing = flashCards.reviewing.filter((id) => id !== serviceId)

        if (target === 'mastered') {
          mastered.push(serviceId)
        } else {
          reviewing.push(serviceId)
        }

        const alreadyStudied =
          flashCards.mastered.includes(serviceId) || flashCards.reviewing.includes(serviceId)

        return {
          ...current,
          flashCards: {
            totalStudied: alreadyStudied ? flashCards.totalStudied : flashCards.totalStudied + 1,
            mastered,
            reviewing,
            lastStudyDate: today,
            streak: calculateStreak(flashCards.lastStudyDate, today, flashCards.streak),
          },
        }
      })
    },
    [commit],
  )

  const recordMastered = useCallback(
    (serviceId: string) => markCard(serviceId, 'mastered'),
    [markCard],
  )

  const recordReviewing = useCallback(
    (serviceId: string) => markCard(serviceId, 'reviewing'),
    [markCard],
  )

  const recordMatchResult = useCallback(
    (difficulty: Difficulty, seconds: number, attempts: number) => {
      // Guard against zero or negative values so best records stay meaningful.
      const safeSeconds = Math.max(1, Math.round(seconds))
      const safeAttempts = Math.max(1, Math.round(attempts))

      commit((current) => {
        const { matchGame } = current
        const previousTime = matchGame.bestTime[difficulty]
        const previousScore = matchGame.bestScore[difficulty]

        return {
          ...current,
          matchGame: {
            gamesPlayed: matchGame.gamesPlayed + 1,
            // Best values are monotonically non-increasing.
            bestTime: {
              ...matchGame.bestTime,
              [difficulty]:
                previousTime === undefined ? safeSeconds : Math.min(previousTime, safeSeconds),
            },
            bestScore: {
              ...matchGame.bestScore,
              [difficulty]:
                previousScore === undefined ? safeAttempts : Math.min(previousScore, safeAttempts),
            },
            lastPlayDate: todayISO(),
          },
        }
      })
    },
    [commit],
  )

  const recordQuizResult = useCallback(
    (correct: number, total: number) => {
      if (total <= 0) return
      const safeTotal = Math.round(total)
      const safeCorrect = Math.min(Math.max(0, Math.round(correct)), safeTotal)
      const percent = Math.round((safeCorrect / safeTotal) * 100)

      commit((current) => ({
        ...current,
        quiz: {
          quizzesTaken: current.quiz.quizzesTaken + 1,
          // Best score never regresses.
          bestPercent: Math.max(current.quiz.bestPercent, percent),
          totalAnswered: current.quiz.totalAnswered + safeTotal,
          totalCorrect: current.quiz.totalCorrect + safeCorrect,
          lastQuizDate: todayISO(),
        },
      }))
    },
    [commit],
  )

  const submitScore = useCallback(
    ({ name, difficulty, seconds, attempts, stars }: SubmitScoreInput): number | null => {
      const entry: LeaderboardEntry = {
        id: createEntryId(),
        name: sanitizePlayerName(name),
        difficulty,
        seconds: Math.max(1, Math.round(seconds)),
        attempts: Math.max(1, Math.round(attempts)),
        stars,
        playedAt: new Date().toISOString(),
      }

      // Rank is derived from the ref so the caller gets it right away.
      const { leaderboard, rank } = insertLeaderboardEntry(
        progressRef.current.leaderboard,
        entry,
      )

      commit((current) => ({ ...current, leaderboard, playerName: entry.name }))

      return rank
    },
    [commit],
  )

  const leaderboardForDifficulty = useCallback(
    (difficulty: Difficulty) => selectLeaderboard(progress.leaderboard, difficulty),
    [progress.leaderboard],
  )

  const setPlayerName = useCallback(
    (name: string) => {
      // Store the raw trimmed value so the field can legitimately be empty.
      const trimmed = name.replace(/\s+/g, ' ').trimStart().slice(0, 20)
      commit((current) => ({ ...current, playerName: trimmed }))
    },
    [commit],
  )

  const clearLeaderboard = useCallback(() => {
    commit((current) => ({ ...current, leaderboard: [] }))
  }, [commit])

  const resetProgress = useCallback(() => {
    clearProgress()
    const fresh = defaultProgress()
    progressRef.current = fresh
    setProgress(fresh)
  }, [])

  const bestTimeFor = useCallback(
    (difficulty: Difficulty) => progress.matchGame.bestTime[difficulty] ?? null,
    [progress.matchGame.bestTime],
  )

  const bestScoreFor = useCallback(
    (difficulty: Difficulty) => progress.matchGame.bestScore[difficulty] ?? null,
    [progress.matchGame.bestScore],
  )

  const summary = useMemo<ProgressSummary>(() => {
    const masteredCount = progress.flashCards.mastered.length
    const reviewingCount = progress.flashCards.reviewing.length

    return {
      masteredCount,
      reviewingCount,
      totalServices: TOTAL_SERVICES,
      masteredPercent:
        TOTAL_SERVICES === 0 ? 0 : Math.round((masteredCount / TOTAL_SERVICES) * 100),
      streak: progress.flashCards.streak,
      gamesPlayed: progress.matchGame.gamesPlayed,
      lastStudyDate: progress.flashCards.lastStudyDate,
      hasFlashCardProgress: masteredCount + reviewingCount > 0,
    }
  }, [progress])

  return {
    progress,
    summary,
    recordMastered,
    recordReviewing,
    recordMatchResult,
    recordQuizResult,
    submitScore,
    leaderboardFor: leaderboardForDifficulty,
    playerName: progress.playerName,
    setPlayerName,
    clearLeaderboard,
    resetProgress,
    bestTimeFor,
    bestScoreFor,
  }
}

/**
 * Shared progress context. A single provider high in the tree keeps the header,
 * the home page, and both game modes in sync without prop drilling.
 */
export const ProgressContext = createContext<UseProgressResult | null>(null)

/** Reads the shared progress state. Must be used under a ProgressProvider. */
export function useProgress(): UseProgressResult {
  const value = useContext(ProgressContext)
  if (value === null) {
    throw new Error('useProgress must be used within a ProgressProvider')
  }
  return value
}
