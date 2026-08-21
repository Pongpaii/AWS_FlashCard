import { useEffect } from 'react'
import { categoryCounts } from '../../data/awsServices'
import { useFlashCards } from '../../hooks/useFlashCards'
import type { AWSService, DeckMode } from '../../types'
import { ProgressBar } from '../ui/ProgressBar'
import { ScoreBoard } from '../ui/ScoreBoard'
import { CategoryFilter } from './CategoryFilter'
import { FlashCard } from './FlashCard'

interface FlashCardDeckProps {
  services: readonly AWSService[]
  mode: DeckMode
  onModeChange: (mode: DeckMode) => void
}

/** Owns the deck state, keyboard shortcuts, and every control around the card. */
export function FlashCardDeck({ services, mode, onModeChange }: FlashCardDeckProps) {
  const {
    deck,
    current,
    currentIndex,
    isFlipped,
    category,
    stats,
    flip,
    next,
    prev,
    markKnown,
    markUnknown,
    skip,
    reshuffle,
    restartAll,
    setCategory,
  } = useFlashCards({ services, mode })

  // Global shortcuts: Space flip, arrows mark/navigate, S reshuffle.
  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.altKey) return

      const target = event.target as HTMLElement | null
      const tag = target?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || target?.isContentEditable) return

      switch (event.key) {
        case ' ':
        case 'Spacebar':
          event.preventDefault()
          flip()
          break
        case 'ArrowLeft':
          event.preventDefault()
          markUnknown()
          break
        case 'ArrowRight':
          event.preventDefault()
          markKnown()
          break
        case 'ArrowUp':
          event.preventDefault()
          prev()
          break
        case 'ArrowDown':
          event.preventDefault()
          next()
          break
        default:
          if (event.key === 's' || event.key === 'S') {
            event.preventDefault()
            reshuffle()
          }
      }
    }

    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [flip, markKnown, markUnknown, next, prev, reshuffle])

  const isEmpty = deck.length === 0

  return (
    <div className="flex flex-col gap-5">
      <CategoryFilter counts={categoryCounts} selected={category} onSelect={setCategory} />

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          aria-pressed={mode === 'review'}
          aria-label={
            mode === 'review' ? 'ออกจากโหมดทบทวนการ์ดที่ยังไม่แม่น' : 'เข้าโหมดทบทวนการ์ดที่ยังไม่แม่น'
          }
          onClick={() => onModeChange(mode === 'review' ? 'all' : 'review')}
          className={[
            'rounded-lg px-3 py-2 text-sm font-semibold transition-colors',
            mode === 'review'
              ? 'bg-indigo-600 text-white hover:bg-indigo-700'
              : 'bg-white text-indigo-700 ring-1 ring-indigo-200 hover:bg-indigo-50',
          ].join(' ')}
        >
          {mode === 'review' ? 'กำลังทบทวนที่ยังไม่แม่น' : 'โหมดทบทวนที่ยังไม่แม่น'}
        </button>

        <button
          type="button"
          aria-label="สุ่มการ์ดทั้งหมดใหม่และล้างผลของรอบนี้"
          onClick={restartAll}
          className="rounded-lg bg-white px-3 py-2 text-sm font-semibold text-slate-700 ring-1 ring-slate-200 transition-colors hover:bg-slate-100"
        >
          สุ่มทั้งหมดใหม่
        </button>

        <p className="ml-auto text-sm text-slate-500">
          การ์ดที่{' '}
          <strong className="tabular-nums text-slate-700">
            {isEmpty ? 0 : currentIndex + 1}
          </strong>{' '}
          จาก <span className="tabular-nums">{deck.length}</span>
        </p>
      </div>

      <ProgressBar
        value={stats.known + stats.unknown}
        total={stats.total}
        label="ทำเครื่องหมายแล้ว"
      />
      <ScoreBoard known={stats.known} unknown={stats.unknown} remaining={stats.remaining} />

      {isEmpty || current === null ? (
        <div className="animate-fade-up rounded-xl bg-white p-10 text-center shadow-md ring-1 ring-slate-200">
          <p className="text-lg font-semibold text-slate-800">
            {mode === 'review'
              ? 'เยี่ยม! ไม่มีการ์ดที่ยังไม่แม่นในหมวดนี้แล้ว'
              : 'ไม่มีการ์ดในหมวดที่เลือก'}
          </p>
          <p className="mt-1 text-sm text-slate-500">
            เลือกหมวดอื่น หรือกลับไปดูการ์ดทั้งหมดเพื่อทบทวนต่อ
          </p>

          <div className="mt-5 flex flex-wrap justify-center gap-2">
            <button
              type="button"
              aria-label="ดูการ์ดทั้งหมดทุกหมวด"
              onClick={() => {
                setCategory('all')
                onModeChange('all')
              }}
              className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-orange-600"
            >
              ดูการ์ดทั้งหมด
            </button>

            {mode === 'review' && (
              <button
                type="button"
                aria-label="ออกจากโหมดทบทวน"
                onClick={() => onModeChange('all')}
                className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-slate-700 ring-1 ring-slate-200 transition-colors hover:bg-slate-100"
              >
                ออกจากโหมดทบทวน
              </button>
            )}
          </div>
        </div>
      ) : (
        <>
          <FlashCard service={current} isFlipped={isFlipped} onFlip={flip} />

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            <button
              type="button"
              aria-label="ทำเครื่องหมายว่าจำได้ (ลูกศรขวา)"
              onClick={markKnown}
              className="rounded-lg bg-green-600 px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-green-700"
            >
              ✓ จำได้
            </button>
            <button
              type="button"
              aria-label="ทำเครื่องหมายว่ายังไม่แม่น (ลูกศรซ้าย)"
              onClick={markUnknown}
              className="rounded-lg bg-red-600 px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-red-700"
            >
              ✗ ยังไม่แม่น
            </button>
            <button
              type="button"
              aria-label="ข้ามการ์ดนี้ไปใบถัดไป"
              onClick={skip}
              className="rounded-lg bg-white px-4 py-3 text-sm font-bold text-slate-700 ring-1 ring-slate-200 transition-colors hover:bg-slate-100"
            >
              ข้าม
            </button>
            <button
              type="button"
              aria-label="สุ่มลำดับการ์ดใหม่ (กดปุ่ม S)"
              onClick={reshuffle}
              className="rounded-lg bg-indigo-600 px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-indigo-700"
            >
              สุ่มใหม่
            </button>
          </div>

          <div className="flex items-center justify-center gap-2">
            <button
              type="button"
              aria-label="การ์ดก่อนหน้า (ลูกศรขึ้น)"
              onClick={prev}
              className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-slate-600 ring-1 ring-slate-200 transition-colors hover:bg-slate-100"
            >
              ← ก่อนหน้า
            </button>
            <button
              type="button"
              aria-label="การ์ดถัดไป (ลูกศรลง)"
              onClick={next}
              className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-slate-600 ring-1 ring-slate-200 transition-colors hover:bg-slate-100"
            >
              ถัดไป →
            </button>
          </div>

          <p className="text-center text-xs text-slate-400">
            คีย์ลัด: Space = พลิกการ์ด · → = จำได้ · ← = ยังไม่แม่น · ↑ ↓ = เลื่อนการ์ด · S = สุ่มใหม่
          </p>
        </>
      )}
    </div>
  )
}
