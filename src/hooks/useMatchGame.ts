import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type {
  AWSService,
  CategoryFilterValue,
  Difficulty,
  MatchCard,
  MatchGameState,
  RandomFn,
  StarRating,
} from '../types'
import { PAIR_COUNT } from '../types'
import { sample, shuffle } from '../utils/shuffle'
import { useProgress } from './useProgress'

/** How long a wrong pick stays highlighted in red. */
export const WRONG_FEEDBACK_MS = 700

/**
 * Picks `count` distinct services. When a category is given but does not hold
 * enough services, falls back to the whole dataset instead of failing.
 */
export function sampleServices(
  services: readonly AWSService[],
  count: number,
  category: CategoryFilterValue = 'all',
  rng: RandomFn = Math.random,
): { picked: AWSService[]; usedFallback: boolean } {
  if (count <= 0) return { picked: [], usedFallback: false }

  const pool =
    category === 'all' ? services : services.filter((service) => service.category === category)

  const needsFallback = pool.length < count
  const source = needsFallback ? services : pool

  return { picked: sample(source, count, rng), usedFallback: needsFallback }
}

/** Creates one `service` tile and one `description` tile per service, shuffled. */
export function buildMatchCards(
  services: readonly AWSService[],
  rng: RandomFn = Math.random,
): MatchCard[] {
  const cards: MatchCard[] = []

  for (const service of services) {
    cards.push({
      id: `${service.id}-service`,
      pairId: service.id,
      content: service.name,
      // Spell out the abbreviation, unless the full name adds nothing.
      ...(service.fullName !== service.name ? { subtitle: service.fullName } : {}),
      type: 'service',
      isMatched: false,
    })
    cards.push({
      id: `${service.id}-description`,
      pairId: service.id,
      content: service.description,
      type: 'description',
      isMatched: false,
    })
  }

  return shuffle(cards, rng)
}

/** Two tiles match when they share a pairId but differ in type. */
export function isMatch(a: MatchCard, b: MatchCard): boolean {
  return a.id !== b.id && a.pairId === b.pairId && a.type !== b.type
}

/** Star rating: 3 for <= pairs+2 attempts, 2 for <= pairs*2, otherwise 1. */
export function calculateStars(attempts: number, pairCount: number): StarRating {
  if (pairCount <= 0) return 1
  if (attempts <= pairCount + 2) return 3
  if (attempts <= pairCount * 2) return 2
  return 1
}

/** Formats seconds as mm:ss. */
export function formatSeconds(totalSeconds: number): string {
  const safe = Math.max(0, Math.floor(totalSeconds))
  const minutes = Math.floor(safe / 60)
  const seconds = safe % 60
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

function emptyState(difficulty: Difficulty): MatchGameState {
  return {
    cards: [],
    selectedIds: [],
    wrongIds: [],
    matchedPairs: [],
    attempts: 0,
    startTime: null,
    isComplete: false,
    difficulty,
  }
}

export interface UseMatchGameOptions {
  services: readonly AWSService[]
}

export interface UseMatchGameResult {
  state: MatchGameState
  pairCount: number
  /** True once a board has been dealt (even if already finished). */
  hasStarted: boolean
  /** Seconds used by the finished game; null while still playing. */
  finalSeconds: number | null
  stars: StarRating | null
  /** Leaderboard rank earned by the finished run; null when it missed the cut. */
  rank: number | null
  /** Thai warning shown when the chosen category had too few services. */
  notice: string | null
  startGame: (difficulty: Difficulty, category?: CategoryFilterValue) => void
  /** Selects a tile, or deselects it when it is already selected. */
  selectCard: (cardId: string) => void
  resetGame: () => void
}

export function useMatchGame({ services }: UseMatchGameOptions): UseMatchGameResult {
  const { recordMatchResult, submitScore, playerName } = useProgress()

  const [state, setState] = useState<MatchGameState>(() => emptyState('easy'))
  const [hasStarted, setHasStarted] = useState(false)
  const [finalSeconds, setFinalSeconds] = useState<number | null>(null)
  const [rank, setRank] = useState<number | null>(null)
  const [notice, setNotice] = useState<string | null>(null)

  // Read inside the completion effect without re-running it when the name changes.
  const playerNameRef = useRef(playerName)
  playerNameRef.current = playerName

  const wrongTimeoutRef = useRef<number | null>(null)
  // Guards against double-counting a finished game in React strict mode.
  const recordedRef = useRef(false)

  const clearWrongTimeout = useCallback(() => {
    if (wrongTimeoutRef.current !== null) {
      window.clearTimeout(wrongTimeoutRef.current)
      wrongTimeoutRef.current = null
    }
  }, [])

  // Release the pending timer when the page unmounts.
  useEffect(() => clearWrongTimeout, [clearWrongTimeout])

  const pairCount = PAIR_COUNT[state.difficulty]

  const startGame = useCallback(
    (difficulty: Difficulty, category: CategoryFilterValue = 'all') => {
      clearWrongTimeout()
      recordedRef.current = false

      const count = PAIR_COUNT[difficulty]
      const { picked, usedFallback } = sampleServices(services, count, category)

      setNotice(
        usedFallback
          ? 'หมวดนี้มีการ์ดไม่พอสำหรับระดับที่เลือก ระบบสุ่มจากทุกหมวดให้แทน'
          : null,
      )
      setFinalSeconds(null)
      setRank(null)
      setHasStarted(true)
      setState({
        cards: buildMatchCards(picked),
        selectedIds: [],
        wrongIds: [],
        matchedPairs: [],
        attempts: 0,
        startTime: Date.now(),
        isComplete: false,
        difficulty,
      })
    },
    [clearWrongTimeout, services],
  )

  const resetGame = useCallback(() => {
    clearWrongTimeout()
    recordedRef.current = false
    setHasStarted(false)
    setFinalSeconds(null)
    setRank(null)
    setNotice(null)
    setState((current) => emptyState(current.difficulty))
  }, [clearWrongTimeout])

  /** Drops the red highlight once the feedback window has passed. */
  const clearWrongHighlight = useCallback(() => {
    wrongTimeoutRef.current = null
    setState((current) => (current.wrongIds.length === 0 ? current : { ...current, wrongIds: [] }))
  }, [])

  const selectCard = useCallback(
    (cardId: string) => {
      setState((current) => {
        if (current.isComplete) return current

        const card = current.cards.find((item) => item.id === cardId)
        if (card === undefined || card.isMatched) return current

        // Clicking the highlighted tile again clears the selection.
        if (current.selectedIds.includes(cardId)) {
          return { ...current, selectedIds: current.selectedIds.filter((id) => id !== cardId) }
        }

        const selectedIds = [...current.selectedIds, cardId]

        // First tile of the turn: just highlight it.
        if (selectedIds.length < 2) {
          return { ...current, selectedIds, wrongIds: [] }
        }

        const attempts = current.attempts + 1
        const first = current.cards.find((item) => item.id === selectedIds[0])
        const second = card

        if (first !== undefined && isMatch(first, second)) {
          const cards = current.cards.map((item) =>
            item.pairId === first.pairId ? { ...item, isMatched: true } : item,
          )
          const matchedPairs = current.matchedPairs.includes(first.pairId)
            ? current.matchedPairs
            : [...current.matchedPairs, first.pairId]

          return {
            ...current,
            cards,
            selectedIds: [],
            wrongIds: [],
            matchedPairs,
            attempts,
            isComplete: matchedPairs.length === cards.length / 2,
          }
        }

        // Wrong pick: clear the selection right away so the next click counts,
        // and flash both tiles red for a moment.
        clearWrongTimeout()
        wrongTimeoutRef.current = window.setTimeout(clearWrongHighlight, WRONG_FEEDBACK_MS)

        return { ...current, selectedIds: [], wrongIds: selectedIds, attempts }
      })
    },
    [clearWrongHighlight, clearWrongTimeout],
  )

  // Persist the result exactly once when the board is solved.
  useEffect(() => {
    if (!state.isComplete || recordedRef.current) return
    recordedRef.current = true

    const seconds =
      state.startTime === null ? 1 : Math.max(1, Math.round((Date.now() - state.startTime) / 1000))

    setFinalSeconds(seconds)
    recordMatchResult(state.difficulty, seconds, state.attempts)
    setRank(
      submitScore({
        name: playerNameRef.current,
        difficulty: state.difficulty,
        seconds,
        attempts: state.attempts,
        stars: calculateStars(state.attempts, PAIR_COUNT[state.difficulty]),
      }),
    )
  }, [
    state.isComplete,
    state.startTime,
    state.difficulty,
    state.attempts,
    recordMatchResult,
    submitScore,
  ])

  const stars = useMemo<StarRating | null>(
    () => (state.isComplete ? calculateStars(state.attempts, pairCount) : null),
    [state.isComplete, state.attempts, pairCount],
  )

  return {
    state,
    pairCount,
    hasStarted,
    finalSeconds,
    stars,
    rank,
    notice,
    startGame,
    selectCard,
    resetGame,
  }
}
