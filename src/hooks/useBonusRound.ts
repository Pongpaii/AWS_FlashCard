import { useCallback, useEffect, useRef, useState } from 'react'
import type { AWSService, MatchCard } from '../types'
import {
  BONUS_PAIR_COUNT,
  BONUS_START_SECONDS,
  BONUS_TIME_GAIN,
  BONUS_TIME_PENALTY,
  bonusPairPoints,
  bonusTimePoints,
  pickBonusServices,
} from '../utils/matchPicker'
import { buildMatchCards, isMatch, WRONG_FEEDBACK_MS } from './useMatchGame'
import { useProgress } from './useProgress'

export type BonusStatus = 'idle' | 'playing' | 'cleared' | 'timeout'

export interface BonusState {
  status: BonusStatus
  services: AWSService[]
  cards: MatchCard[]
  selectedIds: string[]
  wrongIds: string[]
  matchedPairs: string[]
  mistakes: Record<string, number>
  /** Correct pairs in a row; resets on a wrong pick. */
  combo: number
  bestCombo: number
  /** Points from pairs; the time bonus is added when the board is cleared. */
  score: number
  /** Epoch ms when the clock hits zero. Moves with every hit and miss. */
  deadline: number
  /** Epoch ms when the round ended, or null while playing. */
  endedAt: number | null
  /** Last time change, for the floating +3 / -5 feedback. */
  lastDelta: { seconds: number; key: number } | null
}

function idleState(): BonusState {
  return {
    status: 'idle',
    services: [],
    cards: [],
    selectedIds: [],
    wrongIds: [],
    matchedPairs: [],
    mistakes: {},
    combo: 0,
    bestCombo: 0,
    score: 0,
    deadline: 0,
    endedAt: null,
    lastDelta: null,
  }
}

/** Seconds left on the clock at `now`, never negative. */
export function secondsLeft(state: BonusState, now: number): number {
  const end = state.endedAt ?? now
  return Math.max(0, (state.deadline - end) / 1000)
}

/** Final score: pair points, plus the time bonus when the board was cleared. */
export function finalBonusScore(state: BonusState): number {
  if (state.status === 'cleared') return state.score + bonusTimePoints(secondsLeft(state, 0))
  return state.score
}

/**
 * Bonus Time: a short board of the hardest words, in keyword mode with no
 * full-name hints, against a clock that gains time on hits and loses time on
 * misses. Consecutive hits build a combo multiplier.
 */
export function useBonusRound(services: readonly AWSService[]) {
  const { starredSet, masteryMap, recordBonusScore, progress } = useProgress()
  const [state, setState] = useState<BonusState>(idleState)
  const [now, setNow] = useState(() => Date.now())
  const [isNewBest, setIsNewBest] = useState(false)
  const wrongTimeoutRef = useRef<number | null>(null)
  const recordedRef = useRef(false)

  const clearWrongTimeout = useCallback(() => {
    if (wrongTimeoutRef.current !== null) {
      window.clearTimeout(wrongTimeoutRef.current)
      wrongTimeoutRef.current = null
    }
  }, [])

  useEffect(() => clearWrongTimeout, [clearWrongTimeout])

  const start = useCallback(
    (roundMistakes: Readonly<Record<string, number>>) => {
      clearWrongTimeout()
      recordedRef.current = false
      setIsNewBest(false)
      const picked = pickBonusServices(services, BONUS_PAIR_COUNT, roundMistakes, {
        starred: starredSet,
        mastery: masteryMap,
      })
      // Keyword tiles, and no expanded names on the service tiles: harder to guess.
      const cards = buildMatchCards(picked, 'keyword').map(({ subtitle: _subtitle, ...card }) => card)
      const startedAt = Date.now()
      setNow(startedAt)
      setState({
        ...idleState(),
        status: 'playing',
        services: picked,
        cards,
        deadline: startedAt + BONUS_START_SECONDS * 1000,
      })
    },
    [clearWrongTimeout, masteryMap, services, starredSet],
  )

  const exit = useCallback(() => {
    clearWrongTimeout()
    setState(idleState())
  }, [clearWrongTimeout])

  // Clock: tick while playing, and end the round when time runs out.
  useEffect(() => {
    if (state.status !== 'playing') return
    const tick = () => {
      const current = Date.now()
      setNow(current)
      setState((s) =>
        s.status === 'playing' && current >= s.deadline
          ? { ...s, status: 'timeout', endedAt: s.deadline, selectedIds: [] }
          : s,
      )
    }
    tick()
    const interval = window.setInterval(tick, 200)
    return () => window.clearInterval(interval)
  }, [state.status])

  const clearWrongHighlight = useCallback(() => {
    wrongTimeoutRef.current = null
    setState((s) => (s.wrongIds.length === 0 ? s : { ...s, wrongIds: [] }))
  }, [])

  const selectCard = useCallback(
    (cardId: string) => {
      const clickedAt = Date.now()
      setState((s) => {
        if (s.status !== 'playing' || clickedAt >= s.deadline) return s

        const card = s.cards.find((item) => item.id === cardId)
        if (card === undefined || card.isMatched) return s

        if (s.selectedIds.includes(cardId)) {
          return { ...s, selectedIds: s.selectedIds.filter((id) => id !== cardId) }
        }

        const selectedIds = [...s.selectedIds, cardId]
        if (selectedIds.length < 2) return { ...s, selectedIds, wrongIds: [] }

        const first = s.cards.find((item) => item.id === selectedIds[0])
        const deltaKey = (s.lastDelta?.key ?? 0) + 1

        if (first !== undefined && isMatch(first, card)) {
          const cards = s.cards.map((item) =>
            item.pairId === first.pairId ? { ...item, isMatched: true } : item,
          )
          const matchedPairs = [...s.matchedPairs, first.pairId]
          const combo = s.combo + 1
          const cleared = matchedPairs.length === cards.length / 2
          const deadline = s.deadline + BONUS_TIME_GAIN * 1000

          return {
            ...s,
            cards,
            selectedIds: [],
            wrongIds: [],
            matchedPairs,
            combo,
            bestCombo: Math.max(s.bestCombo, combo),
            score: s.score + bonusPairPoints(combo),
            deadline,
            status: cleared ? 'cleared' : 'playing',
            endedAt: cleared ? clickedAt : null,
            lastDelta: { seconds: BONUS_TIME_GAIN, key: deltaKey },
          }
        }

        const mistakes = { ...s.mistakes }
        for (const pairId of new Set([first?.pairId, card.pairId])) {
          if (pairId !== undefined) mistakes[pairId] = (mistakes[pairId] ?? 0) + 1
        }
        const deadline = s.deadline - BONUS_TIME_PENALTY * 1000
        const timedOut = clickedAt >= deadline

        clearWrongTimeout()
        wrongTimeoutRef.current = window.setTimeout(clearWrongHighlight, WRONG_FEEDBACK_MS)

        return {
          ...s,
          selectedIds: [],
          wrongIds: selectedIds,
          mistakes,
          combo: 0,
          deadline,
          status: timedOut ? 'timeout' : 'playing',
          endedAt: timedOut ? deadline : null,
          lastDelta: { seconds: -BONUS_TIME_PENALTY, key: deltaKey },
        }
      })
    },
    [clearWrongHighlight, clearWrongTimeout],
  )

  // Save the score once when the round ends.
  useEffect(() => {
    if (state.status !== 'cleared' && state.status !== 'timeout') return
    if (recordedRef.current) return
    recordedRef.current = true
    setIsNewBest(recordBonusScore(finalBonusScore(state)))
  }, [state, recordBonusScore])

  return {
    state,
    secondsLeft: secondsLeft(state, now),
    finalScore: finalBonusScore(state),
    bestScore: progress.matchGame.bonusBest,
    isNewBest,
    start,
    exit,
    selectCard,
  }
}
