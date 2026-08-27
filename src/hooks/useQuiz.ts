import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { DEFAULT_QUIZ_LENGTH, quizQuestions } from '../data/quizQuestions'
import type {
  PreparedQuizQuestion,
  QuizDomainFilter,
  QuizQuestion,
  RandomFn,
} from '../types'
import { sample, shuffle } from '../utils/shuffle'
import { useProgress } from './useProgress'

/**
 * Draws a session and shuffles each question's options, so the correct answer
 * is not always in the same position.
 */
export function prepareQuestions(
  bank: readonly QuizQuestion[],
  count: number,
  domain: QuizDomainFilter = 'all',
  rng: RandomFn = Math.random,
): PreparedQuizQuestion[] {
  const pool = domain === 'all' ? bank : bank.filter((item) => item.domain === domain)
  // Fewer questions than requested is fine: serve whatever the domain has.
  const picked = sample(pool, Math.min(count, pool.length), rng)

  return picked.map((question) => ({
    question,
    options: shuffle(
      question.choices.map((text, index) => ({
        text,
        isCorrect: index === question.correctIndex,
      })),
      rng,
    ),
  }))
}

/** Percentage score, rounded to a whole number. */
export function scorePercent(correct: number, total: number): number {
  if (total <= 0) return 0
  return Math.round((correct / total) * 100)
}

/** CLF-C02 needs roughly 70%, so use that as the pass mark for feedback. */
export const PASS_PERCENT = 70

export interface UseQuizResult {
  /** Prepared questions for the running session. */
  questions: PreparedQuizQuestion[]
  current: PreparedQuizQuestion | null
  currentIndex: number
  /** Index into `current.options` the player picked, or null before answering. */
  selectedIndex: number | null
  /** True once the player has committed an answer for the current question. */
  isRevealed: boolean
  correctCount: number
  /** One entry per answered question, in order. */
  results: boolean[]
  isComplete: boolean
  hasStarted: boolean
  percent: number
  passed: boolean
  startQuiz: (domain?: QuizDomainFilter, count?: number) => void
  answer: (optionIndex: number) => void
  next: () => void
  restart: () => void
}

export function useQuiz(): UseQuizResult {
  const { recordQuizResult } = useProgress()

  const [questions, setQuestions] = useState<PreparedQuizQuestion[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [results, setResults] = useState<boolean[]>([])
  const [isComplete, setIsComplete] = useState(false)
  const [hasStarted, setHasStarted] = useState(false)

  const startQuiz = useCallback(
    (domain: QuizDomainFilter = 'all', count: number = DEFAULT_QUIZ_LENGTH) => {
      setQuestions(prepareQuestions(quizQuestions, count, domain))
      setCurrentIndex(0)
      setSelectedIndex(null)
      setResults([])
      setIsComplete(false)
      setHasStarted(true)
    },
    [],
  )

  const current = questions.length === 0 ? null : (questions[currentIndex] ?? null)
  const isRevealed = selectedIndex !== null

  const answer = useCallback(
    (optionIndex: number) => {
      // Answers are final: ignore extra clicks once revealed.
      if (selectedIndex !== null || current === null) return
      const option = current.options[optionIndex]
      if (option === undefined) return

      setSelectedIndex(optionIndex)
      setResults((previous) => [...previous, option.isCorrect])
    },
    [current, selectedIndex],
  )

  const next = useCallback(() => {
    if (selectedIndex === null) return

    setSelectedIndex(null)
    setCurrentIndex((index) => {
      const isLast = index + 1 >= questions.length
      if (isLast) {
        setIsComplete(true)
        return index
      }
      return index + 1
    })
  }, [questions.length, selectedIndex])

  const restart = useCallback(() => {
    setQuestions([])
    setCurrentIndex(0)
    setSelectedIndex(null)
    setResults([])
    setIsComplete(false)
    setHasStarted(false)
  }, [])

  const correctCount = useMemo(() => results.filter(Boolean).length, [results])
  const percent = scorePercent(correctCount, questions.length)

  // Persist exactly once when the session finishes. A ref guard keeps the write
  // out of the render pass and survives strict mode double-invocation.
  const recordedRef = useRef(false)

  useEffect(() => {
    if (!isComplete) {
      recordedRef.current = false
      return
    }
    if (recordedRef.current || questions.length === 0) return

    recordedRef.current = true
    recordQuizResult(correctCount, questions.length)
  }, [isComplete, questions.length, correctCount, recordQuizResult])

  return {
    questions,
    current,
    currentIndex,
    selectedIndex,
    isRevealed,
    correctCount,
    results,
    isComplete,
    hasStarted,
    percent,
    passed: percent >= PASS_PERCENT,
    startQuiz,
    answer,
    next,
    restart,
  }
}
