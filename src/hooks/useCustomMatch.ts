import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { CustomMatchState, MatchCard, MatchPair, RandomFn, StarRating } from '../types'
import { sample, shuffle } from '../utils/shuffle'
import { WRONG_FEEDBACK_MS, calculateStars, isMatch } from './useMatchGame'

/**
 * Match board over arbitrary term/meaning pairs.
 *
 * Deliberately separate from `useMatchGame`: this one takes any `MatchPair`
 * (framework concepts, pricing terms, services) and records nothing to the
 * leaderboard, so practising a custom board never disturbs the service-game
 * stats the home page shows.
 */

/** Builds one term tile and one meaning tile per pair, shuffled. */
export function buildPairCards(pairs: readonly MatchPair[], rng: RandomFn = Math.random): MatchCard[] {
  const cards: MatchCard[] = []

  for (const pair of pairs) {
    cards.push({
      id: `${pair.pairId}-service`,
      pairId: pair.pairId,
      content: pair.term,
      ...(pair.termSubtitle === undefined ? {} : { subtitle: pair.termSubtitle }),
      type: 'service',
      isMatched: false,
    })
    cards.push({
      id: `${pair.pairId}-description`,
      pairId: pair.pairId,
      content: pair.meaning,
      type: 'description',
      isMatched: false,
    })
  }

  return shuffle(cards, rng)
}

function emptyState(): CustomMatchState {
  return {
    cards: [],
    selectedIds: [],
    wrongIds: [],
    matchedPairs: [],
    attempts: 0,
    startTime: null,
    isComplete: false,
    pairCount: 0,
  }
}

export interface UseCustomMatchResult {
  state: CustomMatchState
  hasStarted: boolean
  /** Seconds used by the finished board; null while still playing. */
  finalSeconds: number | null
  stars: StarRating | null
  /** Deals `requestedPairs` pairs, clamped to what the pool can supply. */
  startGame: (pairs: readonly MatchPair[], requestedPairs: number) => void
  selectCard: (cardId: string) => void
  /** Reshuffles the same pool and pair count. */
  replay: () => void
  /** Clears the board and returns to the builder. */
  resetGame: () => void
}

export function useCustomMatch(): UseCustomMatchResult {
  const [state, setState] = useState<CustomMatchState>(emptyState)
  const [hasStarted, setHasStarted] = useState(false)
  const [finalSeconds, setFinalSeconds] = useState<number | null>(null)

  // Remembered so "เล่นอีกครั้ง" can redeal without going back to the builder.
  const lastRoundRef = useRef<{ pairs: readonly MatchPair[]; requested: number } | null>(null)
  const wrongTimeoutRef = useRef<number | null>(null)

  const clearWrongTimeout = useCallback(() => {
    if (wrongTimeoutRef.current !== null) {
      window.clearTimeout(wrongTimeoutRef.current)
      wrongTimeoutRef.current = null
    }
  }, [])

  useEffect(() => clearWrongTimeout, [clearWrongTimeout])

  const startGame = useCallback(
    (pairs: readonly MatchPair[], requestedPairs: number) => {
      clearWrongTimeout()
      lastRoundRef.current = { pairs, requested: requestedPairs }

      const count = Math.max(0, Math.min(requestedPairs, pairs.length))
      const picked = sample(pairs, count)

      setFinalSeconds(null)
      setHasStarted(true)
      setState({
        cards: buildPairCards(picked),
        selectedIds: [],
        wrongIds: [],
        matchedPairs: [],
        attempts: 0,
        startTime: Date.now(),
        isComplete: false,
        pairCount: count,
      })
    },
    [clearWrongTimeout],
  )

  const replay = useCallback(() => {
    const last = lastRoundRef.current
    if (last === null) return
    startGame(last.pairs, last.requested)
  }, [startGame])

  const resetGame = useCallback(() => {
    clearWrongTimeout()
    setHasStarted(false)
    setFinalSeconds(null)
    setState(emptyState())
  }, [clearWrongTimeout])

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

        if (current.selectedIds.includes(cardId)) {
          return { ...current, selectedIds: current.selectedIds.filter((id) => id !== cardId) }
        }

        const selectedIds = [...current.selectedIds, cardId]

        if (selectedIds.length < 2) {
          return { ...current, selectedIds, wrongIds: [] }
        }

        const attempts = current.attempts + 1
        const first = current.cards.find((item) => item.id === selectedIds[0])

        if (first !== undefined && isMatch(first, card)) {
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

        clearWrongTimeout()
        wrongTimeoutRef.current = window.setTimeout(clearWrongHighlight, WRONG_FEEDBACK_MS)

        return { ...current, selectedIds: [], wrongIds: selectedIds, attempts }
      })
    },
    [clearWrongHighlight, clearWrongTimeout],
  )

  // Freeze the clock once the board is solved.
  useEffect(() => {
    if (!state.isComplete) return
    setFinalSeconds((current) => {
      if (current !== null) return current
      return state.startTime === null
        ? 1
        : Math.max(1, Math.round((Date.now() - state.startTime) / 1000))
    })
  }, [state.isComplete, state.startTime])

  const stars = useMemo<StarRating | null>(
    () => (state.isComplete ? calculateStars(state.attempts, state.pairCount) : null),
    [state.isComplete, state.attempts, state.pairCount],
  )

  return { state, hasStarted, finalSeconds, stars, startGame, selectCard, replay, resetGame }
}
