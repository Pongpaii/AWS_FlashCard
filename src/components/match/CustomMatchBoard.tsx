import { formatSeconds } from '../../hooks/useMatchGame'
import type { CustomMatchState, StarRating } from '../../types'
import { Timer } from '../ui/Timer'
import { MatchCard } from './MatchCard'

interface CustomMatchBoardProps {
  state: CustomMatchState
  finalSeconds: number | null
  stars: StarRating | null
  /** Thai summary of what was dealt, e.g. "Well-Architected: 6 pillars · 6 คู่". */
  selectionLabel: string
  onSelectCard: (cardId: string) => void
  onReplay: () => void
  onBackToBuilder: () => void
}

/**
 * Playable board for a custom match round: HUD, tiles, and an end summary.
 * Nothing here is persisted, so the run does not touch the leaderboard.
 */
export function CustomMatchBoard({
  state,
  finalSeconds,
  stars,
  selectionLabel,
  onSelectCard,
  onReplay,
  onBackToBuilder,
}: CustomMatchBoardProps) {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 rounded-xl bg-white px-5 py-3 shadow-md ring-1 ring-slate-200">
        <p className="text-sm text-slate-500">
          เวลา{' '}
          <Timer
            startTime={state.startTime}
            isRunning={!state.isComplete}
            frozenSeconds={state.isComplete ? finalSeconds : null}
          />
        </p>
        <p className="text-sm text-slate-500">
          ทายไปแล้ว <strong className="tabular-nums text-slate-700">{state.attempts}</strong> ครั้ง
        </p>
        <p className="text-sm text-slate-500">
          จับคู่ได้{' '}
          <strong className="tabular-nums text-slate-700">
            {state.matchedPairs.length}/{state.pairCount}
          </strong>
        </p>

        <button
          type="button"
          aria-label="กลับไปแก้ชุดการ์ดที่เลือก"
          onClick={onBackToBuilder}
          className="ml-auto rounded-lg bg-white px-3 py-1.5 text-sm font-semibold text-slate-700 ring-1 ring-slate-200 transition-colors hover:bg-slate-100"
        >
          แก้ชุดการ์ด
        </button>
      </div>

      <p className="text-xs text-slate-500">ชุดที่เล่นอยู่: {selectionLabel}</p>

      <div
        role="group"
        aria-label="กระดานเกมจับคู่แบบกำหนดเอง"
        className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4"
      >
        {state.cards.map((card) => (
          <MatchCard
            key={card.id}
            card={card}
            isSelected={state.selectedIds.includes(card.id)}
            isWrong={state.wrongIds.includes(card.id)}
            onSelect={onSelectCard}
          />
        ))}
      </div>

      {state.isComplete && (
        <section
          aria-live="polite"
          className="rounded-xl bg-white p-6 text-center shadow-md ring-1 ring-emerald-200"
        >
          <h2 className="text-xl font-bold text-slate-900">จับคู่ครบแล้ว</h2>
          <p aria-hidden="true" className="mt-1 text-2xl">
            {stars === null ? '' : '⭐'.repeat(stars)}
          </p>
          <p className="mt-1 text-sm text-slate-600">
            ใช้เวลา{' '}
            <strong className="tabular-nums text-emerald-700">
              {formatSeconds(finalSeconds ?? 0)}
            </strong>{' '}
            · ทาย <strong className="tabular-nums text-emerald-700">{state.attempts}</strong> ครั้ง
            จาก {state.pairCount} คู่
            {stars !== null && (
              <span className="text-slate-500"> · ได้ {stars} ดาว</span>
            )}
          </p>
          <p className="mt-2 text-xs text-slate-400">
            รอบนี้เป็นการฝึกล้วน ๆ ไม่ถูกบันทึกลงกระดานผู้นำ
          </p>

          <div className="mt-4 flex flex-wrap justify-center gap-2">
            <button
              type="button"
              aria-label="สุ่มการ์ดชุดเดิมแล้วเล่นอีกครั้ง"
              onClick={onReplay}
              className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-orange-600"
            >
              สุ่มใหม่ชุดเดิม
            </button>
            <button
              type="button"
              aria-label="กลับไปแก้ชุดการ์ดที่เลือก"
              onClick={onBackToBuilder}
              className="rounded-lg bg-white px-4 py-2 text-sm font-bold text-slate-700 ring-1 ring-slate-200 transition-colors hover:bg-slate-100"
            >
              เลือกชุดใหม่
            </button>
          </div>
        </section>
      )}
    </div>
  )
}
