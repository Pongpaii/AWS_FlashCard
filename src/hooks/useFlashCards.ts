import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { AWSService, CategoryFilterValue, DeckMode, DeckStats } from '../types'
import { shuffle } from '../utils/shuffle'
import { useProgress } from './useProgress'

/**
 * Builds the deck for the current filters. Pure: the caller supplies the
 * mastered set so the function stays testable.
 */
export function buildDeck(
  services: readonly AWSService[],
  category: CategoryFilterValue,
  mode: DeckMode,
  mastered: ReadonlySet<string>,
): AWSService[] {
  let filtered = [...services]

  if (category !== 'all') {
    filtered = filtered.filter((service) => service.category === category)
  }

  if (mode === 'review') {
    filtered = filtered.filter((service) => !mastered.has(service.id))
  }

  return shuffle(filtered)
}

/** Wraps an index into [0, length). Returns 0 for an empty deck. */
export function wrapIndex(index: number, length: number): number {
  if (length <= 0) return 0
  return ((index % length) + length) % length
}

export interface UseFlashCardsOptions {
  services: readonly AWSService[]
  mode: DeckMode
}

export interface UseFlashCardsResult {
  deck: AWSService[]
  current: AWSService | null
  currentIndex: number
  isFlipped: boolean
  category: CategoryFilterValue
  stats: DeckStats
  /** Cards marked in this session, used to colour the filter and progress bar. */
  knownCards: string[]
  unknownCards: string[]
  flip: () => void
  next: () => void
  prev: () => void
  markKnown: () => void
  markUnknown: () => void
  skip: () => void
  reshuffle: () => void
  /** Clears the session marks and reshuffles the full filtered deck. */
  restartAll: () => void
  setCategory: (category: CategoryFilterValue) => void
}

export function useFlashCards({ services, mode }: UseFlashCardsOptions): UseFlashCardsResult {
  const { progress, recordMastered, recordReviewing } = useProgress()

  const [category, setCategoryState] = useState<CategoryFilterValue>('all')
  const [shuffleSeed, setShuffleSeed] = useState(0)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [knownCards, setKnownCards] = useState<string[]>([])
  const [unknownCards, setUnknownCards] = useState<string[]>([])

  // Read the mastered set without making the deck depend on it: marking a card
  // must not reshuffle the deck the user is currently working through.
  const masteredSet = useMemo(
    () => new Set(progress.flashCards.mastered),
    [progress.flashCards.mastered],
  )
  const masteredRef = useRef<ReadonlySet<string>>(masteredSet)
  masteredRef.current = masteredSet

  const deck = useMemo(() => {
    void shuffleSeed // reshuffle trigger
    return buildDeck(services, category, mode, masteredRef.current)
  }, [services, category, mode, shuffleSeed])

  // A brand new deck always starts at the first card, face up.
  useEffect(() => {
    setCurrentIndex(0)
    setIsFlipped(false)
  }, [deck])

  const safeIndex = deck.length === 0 ? 0 : Math.min(currentIndex, deck.length - 1)
  const current = deck.length === 0 ? null : (deck[safeIndex] ?? null)

  const move = useCallback(
    (direction: 1 | -1) => {
      setIsFlipped(false)
      setCurrentIndex((index) => wrapIndex(index + direction, deck.length))
    },
    [deck.length],
  )

  const next = useCallback(() => move(1), [move])
  const prev = useCallback(() => move(-1), [move])
  const skip = useCallback(() => move(1), [move])

  const flip = useCallback(() => {
    setIsFlipped((flipped) => !flipped)
  }, [])

  /** Marks the current card, persists it, then advances. Idempotent per id. */
  const mark = useCallback(
    (target: 'known' | 'unknown') => {
      if (current === null) return
      const id = current.id

      setKnownCards((ids) => {
        const without = ids.filter((existing) => existing !== id)
        return target === 'known' ? [...without, id] : without
      })
      setUnknownCards((ids) => {
        const without = ids.filter((existing) => existing !== id)
        return target === 'unknown' ? [...without, id] : without
      })

      if (target === 'known') {
        recordMastered(id)
      } else {
        recordReviewing(id)
      }

      move(1)
    },
    [current, move, recordMastered, recordReviewing],
  )

  const markKnown = useCallback(() => mark('known'), [mark])
  const markUnknown = useCallback(() => mark('unknown'), [mark])

  const reshuffle = useCallback(() => {
    setShuffleSeed((seed) => seed + 1)
  }, [])

  const restartAll = useCallback(() => {
    setKnownCards([])
    setUnknownCards([])
    setShuffleSeed((seed) => seed + 1)
  }, [])

  const setCategory = useCallback((next_: CategoryFilterValue) => {
    setCategoryState(next_)
  }, [])

  const stats = useMemo<DeckStats>(() => {
    const deckIds = new Set(deck.map((service) => service.id))
    const known = knownCards.filter((id) => deckIds.has(id)).length
    const unknown = unknownCards.filter((id) => deckIds.has(id)).length

    return {
      known,
      unknown,
      remaining: Math.max(0, deck.length - known - unknown),
      total: deck.length,
    }
  }, [deck, knownCards, unknownCards])

  return {
    deck,
    current,
    currentIndex: safeIndex,
    isFlipped,
    category,
    stats,
    knownCards,
    unknownCards,
    flip,
    next,
    prev,
    markKnown,
    markUnknown,
    skip,
    reshuffle,
    restartAll,
    setCategory,
  }
}
