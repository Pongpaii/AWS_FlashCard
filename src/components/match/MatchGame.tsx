import { useState } from 'react'
import { CATEGORY_LABELS_TH, categoryCounts } from '../../data/awsServices'
import { useBonusRound } from '../../hooks/useBonusRound'
import { formatSeconds, poolForMode, useMatchGame } from '../../hooks/useMatchGame'
import { isFrameworkMode } from '../../data/frameworkMatch'
import { useProgress } from '../../hooks/useProgress'
import type { MatchItem, CategoryFilterValue } from '../../types'
import { CATEGORIES, MATCH_MODES, MATCH_PAIR_COUNT } from '../../types'
import { matchPool, remainingInCycle } from '../../utils/matchPicker'
import { ANONYMOUS_NAME, MAX_PLAYER_NAME_LENGTH } from '../../utils/storage'
import { Timer } from '../ui/Timer'
import { BonusRound } from './BonusRound'
import { MatchCard } from './MatchCard'
import { MatchResult } from './MatchResult'
import { MODE_META } from './matchLabels'

interface MatchGameProps {
  services: readonly MatchItem[]
  onBackHome: () => void
}

/** Mode picker, playable board, and end-of-game summary. */
export function MatchGame({ services, onBackHome }: MatchGameProps) {
  const {
    progress,
    bestTimeFor,
    bestScoreFor,
    playerName,
    setPlayerName,
    leaderboardFor,
    starredSet,
    summary,
  } = useProgress()
  const {
    state,
    pairCount,
    hasStarted,
    finalSeconds,
    stars,
    rank,
    notice,
    roundServices,
    cycle,
    startGame,
    selectCard,
    resetGame,
  } = useMatchGame({ services })

  const [category, setCategory] = useState<CategoryFilterValue>('all')
  const bonus = useBonusRound(services)

  // Deck progress for the chosen category, shown before the first board.
  const { pool: setupPool } = matchPool(services, MATCH_PAIR_COUNT, category)
  const setupRemaining = remainingInCycle(setupPool, progress.matchGame.recentIds)

  if (hasStarted && bonus.state.status !== 'idle') {
    return (
      <BonusRound
        bonus={bonus}
        onNextRound={() => {
          bonus.exit()
          startGame(state.mode, category)
        }}
        onChangeMode={() => {
          bonus.exit()
          resetGame()
        }}
      />
    )
  }

  if (!hasStarted) {
    return (
      <div className="flex flex-col gap-6">
        <section className="rounded-xl bg-white p-6 shadow-md ring-1 ring-slate-200">
          <h2 className="text-lg font-bold text-slate-900">1. ใส่ชื่อผู้เล่น</h2>
          <p className="mt-1 text-sm text-slate-500">
            ชื่อนี้จะขึ้นบนกระดานผู้นำเมื่อเล่นจบ เว้นว่างได้ ระบบจะใช้ชื่อ “{ANONYMOUS_NAME}” แทน
          </p>

          <label className="mt-4 block">
            <span className="sr-only">ชื่อผู้เล่น</span>
            <input
              type="text"
              value={playerName}
              onChange={(event) => setPlayerName(event.target.value)}
              maxLength={MAX_PLAYER_NAME_LENGTH}
              placeholder="เช่น ปองภัย"
              aria-label="ชื่อผู้เล่นสำหรับบันทึกลงกระดานผู้นำ"
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 sm:max-w-sm"
            />
          </label>
        </section>

        <section className="rounded-xl bg-white p-6 shadow-md ring-1 ring-slate-200">
          <h2 className="text-lg font-bold text-slate-900">2. เลือกหมวด (ไม่บังคับ)</h2>
          <p className="mt-1 text-sm text-slate-500">
            ถ้าหมวดที่เลือกมีไม่ถึง {MATCH_PAIR_COUNT} บริการ ระบบจะสุ่มจากทุกหมวดให้แทน
            (ใช้กับโหมดความหมายและจำไปสอบ ส่วนโหมด CAF และ Well-Architected ใช้กองคำของตัวเอง)
          </p>

          <label className="mt-4 block">
            <span className="sr-only">เลือกหมวดของ AWS Services</span>
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value as CategoryFilterValue)}
              aria-label="เลือกหมวดของ AWS Services สำหรับเกมจับคู่"
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700 sm:max-w-sm"
            >
              <option value="all">ทุกหมวด ({categoryCounts.all} บริการ)</option>
              {CATEGORIES.map((item) => (
                <option key={item} value={item}>
                  {CATEGORY_LABELS_TH[item]} — {item} ({categoryCounts[item]} บริการ)
                </option>
              ))}
            </select>
          </label>
        </section>

        <section className="rounded-xl bg-white p-6 shadow-md ring-1 ring-slate-200">
          <h2 className="text-lg font-bold text-slate-900">3. เลือกโหมดเพื่อเริ่มเล่น</h2>
          <p className="mt-1 text-sm text-slate-500">
            กระดานละ {MATCH_PAIR_COUNT} คู่ · {MATCH_PAIR_COUNT * 2} การ์ด
            ระบบสุ่มแบบกองไพ่: คำที่เล่นไปแล้วจะไม่กลับมาจนกว่าจะเล่นครบทุกคำ คำที่ติดดาว ({summary.starredCount} คำ)
            หรือจำไม่ได้จะถูกหยิบมาก่อน
          </p>
          <p className="mt-2 w-fit rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
            กองนี้เหลือ {setupRemaining}/{setupPool.length} คำที่ยังไม่ได้เล่น
          </p>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {MATCH_MODES.map((mode) => {
              const meta = MODE_META[mode]
              const best = bestTimeFor(mode)
              const bestAttempts = bestScoreFor(mode)
              const modePool = isFrameworkMode(mode) ? poolForMode(mode, services) : null
              const modeRemaining =
                modePool === null ? null : remainingInCycle(modePool, progress.matchGame.recentIds)

              return (
                <button
                  key={mode}
                  type="button"
                  aria-label={`เริ่มเกมโหมด${meta.label} ${MATCH_PAIR_COUNT} คู่`}
                  onClick={() => startGame(mode, category)}
                  className={`rounded-xl bg-white p-4 text-left ring-2 transition-colors ${meta.tone}`}
                >
                  <p className="text-xl font-bold text-slate-900">{meta.label}</p>
                  <p className="mt-0.5 text-sm text-slate-500">{meta.blurb}</p>
                  {modePool !== null && (
                    <p className="mt-2 w-fit rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600">
                      เหลือ {modeRemaining}/{modePool.length} คำที่ยังไม่ได้เล่น
                    </p>
                  )}
                  <p className="mt-3 text-xs text-slate-500">
                    สถิติดีที่สุด:{' '}
                    <span className="font-semibold tabular-nums text-emerald-700">
                      {best === null ? 'ยังไม่มี' : formatSeconds(best)}
                    </span>
                    {bestAttempts !== null && (
                      <>
                        {' · '}
                        <span className="font-semibold tabular-nums text-emerald-700">
                          {bestAttempts} ครั้ง
                        </span>
                      </>
                    )}
                  </p>
                </button>
              )
            })}
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-5">
      {notice !== null && (
        <p
          role="status"
          className="rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-900 ring-1 ring-amber-200"
        >
          {notice}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 rounded-xl bg-white px-5 py-3 shadow-md ring-1 ring-slate-200">
        <p className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">
          โหมด{MODE_META[state.mode].label}
        </p>
        <p className="text-sm text-slate-500">
          เวลา{' '}
          <Timer
            startTime={state.startTime}
            isRunning={!state.isComplete}
            frozenSeconds={state.isComplete ? finalSeconds : null}
          />
        </p>
        <p className="text-sm text-slate-500">
          ทายไปแล้ว{' '}
          <strong className="tabular-nums text-slate-700">{state.attempts}</strong> ครั้ง
        </p>
        <p className="text-sm text-slate-500">
          จับคู่ได้{' '}
          <strong className="tabular-nums text-slate-700">
            {state.matchedPairs.length}/{pairCount}
          </strong>
        </p>
        {cycle !== null && (
          <p className="text-sm text-slate-500">
            เหลือในกอง{' '}
            <strong className="tabular-nums text-slate-700">
              {cycle.remaining}/{cycle.poolSize}
            </strong>{' '}
            คำ
          </p>
        )}

        <button
          type="button"
          aria-label="เริ่มเกมใหม่และกลับไปหน้าเลือกโหมด"
          onClick={resetGame}
          className="ml-auto rounded-lg bg-white px-3 py-1.5 text-sm font-semibold text-slate-700 ring-1 ring-slate-200 transition-colors hover:bg-slate-100"
        >
          เลือกโหมดใหม่
        </button>
      </div>

      <div
        role="group"
        aria-label="กระดานเกมจับคู่"
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

      {state.isComplete && stars !== null && (
        <MatchResult
          mode={state.mode}
          elapsedSeconds={finalSeconds ?? 0}
          attempts={state.attempts}
          stars={stars}
          rank={rank}
          leaderboard={leaderboardFor(state.mode)}
          bestTime={bestTimeFor(state.mode)}
          bestScore={bestScoreFor(state.mode)}
          roundServices={roundServices}
          mistakes={state.mistakes}
          onPlayAgain={() => startGame(state.mode, category)}
          onBonus={() => bonus.start(state.mistakes, poolForMode(state.mode, services))}
          onBackHome={onBackHome}
        />
      )}
    </div>
  )
}
