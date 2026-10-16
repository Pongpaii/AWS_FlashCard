import { useProgress } from '../../hooks/useProgress'
import type { useBonusRound } from '../../hooks/useBonusRound'
import {
  BONUS_MAX_COMBO,
  BONUS_START_SECONDS,
  BONUS_TIME_GAIN,
  BONUS_TIME_PENALTY,
  bonusTimePoints,
} from '../../utils/matchPicker'
import { MatchCard } from './MatchCard'
import { RoundReview } from './RoundReview'

interface BonusRoundProps {
  bonus: ReturnType<typeof useBonusRound>
  onNextRound: () => void
  onChangeMode: () => void
}

/** Short explainer shown on the end-of-round screen before Bonus Time starts. */
export function BonusRules() {
  return (
    <ul className="mt-2 space-y-1 text-left text-xs text-slate-600">
      <li>⏱ เวลาเริ่ม {BONUS_START_SECONDS} วินาที นับถอยหลัง</li>
      <li>✅ จับคู่ถูก +{BONUS_TIME_GAIN} วินาที · ❌ ผิด −{BONUS_TIME_PENALTY} วินาที</li>
      <li>🔥 ถูกติดกันได้คอมโบ คูณคะแนนสูงสุด x{BONUS_MAX_COMBO}</li>
      <li>🧠 คำที่ยากที่สุดของคุณ เป็นคีย์เวิร์ดข้อสอบ (โหมด CAF / WAF ใช้คำอธิบาย) และไม่มีชื่อเต็มช่วย</li>
    </ul>
  )
}

/** Bonus Time board, countdown, and result. */
export function BonusRound({ bonus, onNextRound, onChangeMode }: BonusRoundProps) {
  const { starredSet } = useProgress()
  const { state, secondsLeft, finalScore, bestScore, isNewBest, selectCard } = bonus
  const isOver = state.status === 'cleared' || state.status === 'timeout'
  const shownSeconds = Math.ceil(secondsLeft)
  const percent = Math.min(100, (secondsLeft / BONUS_START_SECONDS) * 100)
  const isLow = secondsLeft <= 10
  const pairCount = state.services.length

  return (
    <div className="flex flex-col gap-5">
      <div className="rounded-xl bg-slate-900 px-5 py-4 text-white shadow-md">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
          <p className="rounded-full bg-amber-400 px-3 py-1 text-xs font-black text-slate-900">
            ⚡ BONUS TIME
          </p>
          <p className="relative text-sm">
            เหลือ{' '}
            <strong
              className={`text-2xl tabular-nums ${isLow ? 'text-red-400' : 'text-amber-300'}`}
              aria-live="off"
            >
              {shownSeconds}
            </strong>{' '}
            วิ
            {state.lastDelta !== null && !isOver && (
              <span
                key={state.lastDelta.key}
                aria-hidden="true"
                className={`animate-fade-up absolute -top-4 left-full ml-1 text-sm font-bold ${
                  state.lastDelta.seconds > 0 ? 'text-green-400' : 'text-red-400'
                }`}
              >
                {state.lastDelta.seconds > 0 ? `+${state.lastDelta.seconds}` : state.lastDelta.seconds}
              </span>
            )}
          </p>
          <p className="text-sm">
            คะแนน <strong className="tabular-nums text-amber-300">{state.score}</strong>
          </p>
          <p className="text-sm">
            คอมโบ{' '}
            <strong className="tabular-nums text-orange-300">
              x{Math.min(Math.max(state.combo, 1), BONUS_MAX_COMBO)}
            </strong>
            {state.combo >= 2 && <span aria-hidden="true"> 🔥</span>}
          </p>
          <p className="text-sm">
            จับคู่ได้{' '}
            <strong className="tabular-nums">
              {state.matchedPairs.length}/{pairCount}
            </strong>
          </p>
        </div>

        <div
          role="progressbar"
          aria-label="เวลาที่เหลือในรอบโบนัส"
          aria-valuemin={0}
          aria-valuemax={BONUS_START_SECONDS}
          aria-valuenow={shownSeconds}
          className="mt-3 h-2 overflow-hidden rounded-full bg-slate-700"
        >
          <div
            className={`h-full rounded-full transition-[width] duration-200 ${isLow ? 'bg-red-500' : 'bg-amber-400'}`}
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>

      {!isOver && (
        <div
          role="group"
          aria-label="กระดานรอบโบนัส"
          className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4"
        >
          {state.cards.map((card) => (
            <MatchCard
              key={card.id}
              card={card}
              isSelected={state.selectedIds.includes(card.id)}
              isWrong={state.wrongIds.includes(card.id)}
              isStarred={starredSet.has(card.pairId)}
              onSelect={selectCard}
            />
          ))}
        </div>
      )}

      {isOver && (
        <div className="animate-fade-up rounded-xl bg-white p-8 text-center shadow-md ring-1 ring-slate-200">
          <p className="text-sm font-medium text-slate-500">จบรอบโบนัส</p>
          <h2 className="mt-1 text-2xl font-bold text-slate-900">
            {state.status === 'cleared' ? 'เคลียร์ครบทุกคู่! ⚡' : 'หมดเวลา ⏱'}
          </h2>
          {isNewBest && (
            <p className="mx-auto mt-3 w-fit rounded-full bg-orange-100 px-3 py-1 text-xs font-bold text-orange-700">
              🎉 สถิติโบนัสใหม่!
            </p>
          )}

          <dl className="mx-auto mt-6 grid max-w-md grid-cols-2 gap-3">
            <div className="rounded-xl bg-amber-50 px-4 py-3">
              <dt className="text-xs font-medium text-amber-700">คะแนนรวม</dt>
              <dd className="mt-0.5 text-2xl font-bold tabular-nums text-amber-800">{finalScore}</dd>
            </div>
            <div className="rounded-xl bg-emerald-50 px-4 py-3">
              <dt className="text-xs font-medium text-emerald-700">สถิติสูงสุด</dt>
              <dd className="mt-0.5 text-2xl font-bold tabular-nums text-emerald-800">{bestScore}</dd>
            </div>
            <div className="rounded-xl bg-slate-100 px-4 py-3">
              <dt className="text-xs font-medium text-slate-500">คอมโบสูงสุด</dt>
              <dd className="mt-0.5 text-xl font-bold tabular-nums text-slate-800">x{state.bestCombo}</dd>
            </div>
            <div className="rounded-xl bg-slate-100 px-4 py-3">
              <dt className="text-xs font-medium text-slate-500">โบนัสเวลา</dt>
              <dd className="mt-0.5 text-xl font-bold tabular-nums text-slate-800">
                {state.status === 'cleared' ? `+${bonusTimePoints(secondsLeft)}` : '—'}
              </dd>
            </div>
          </dl>

          <RoundReview services={state.services} mode="keyword" mistakes={state.mistakes} />

          <div className="mt-7 flex flex-wrap justify-center gap-2">
            <button
              type="button"
              onClick={onNextRound}
              className="rounded-lg bg-orange-500 px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-orange-600"
            >
              เล่นรอบถัดไป
            </button>
            <button
              type="button"
              onClick={onChangeMode}
              className="rounded-lg bg-white px-5 py-2.5 text-sm font-bold text-slate-700 ring-1 ring-slate-200 transition-colors hover:bg-slate-100"
            >
              เลือกโหมดใหม่
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
