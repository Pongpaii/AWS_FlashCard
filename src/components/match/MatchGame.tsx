import { useState } from 'react'
import { CATEGORY_LABELS_TH, categoryCounts } from '../../data/awsServices'
import { formatSeconds, useMatchGame } from '../../hooks/useMatchGame'
import { useProgress } from '../../hooks/useProgress'
import type { AWSService, CategoryFilterValue, Difficulty } from '../../types'
import { CATEGORIES, DIFFICULTIES, PAIR_COUNT } from '../../types'
import { ANONYMOUS_NAME, MAX_PLAYER_NAME_LENGTH } from '../../utils/storage'
import { Timer } from '../ui/Timer'
import { MatchCard } from './MatchCard'
import { MatchResult } from './MatchResult'

interface MatchGameProps {
  services: readonly AWSService[]
  onBackHome: () => void
}

const DIFFICULTY_META: Record<Difficulty, { label: string; blurb: string; tone: string }> = {
  easy: { label: 'ง่าย', blurb: '4 คู่ · 8 การ์ด', tone: 'ring-green-300 hover:bg-green-50' },
  medium: { label: 'กลาง', blurb: '6 คู่ · 12 การ์ด', tone: 'ring-amber-300 hover:bg-amber-50' },
  hard: { label: 'ยาก', blurb: '8 คู่ · 16 การ์ด', tone: 'ring-red-300 hover:bg-red-50' },
}

/** Difficulty picker, playable board, and end-of-game summary. */
export function MatchGame({ services, onBackHome }: MatchGameProps) {
  const { bestTimeFor, bestScoreFor, playerName, setPlayerName, leaderboardFor } = useProgress()
  const {
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
  } = useMatchGame({ services })

  const [category, setCategory] = useState<CategoryFilterValue>('all')

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
            ถ้าหมวดที่เลือกมีการ์ดไม่พอสำหรับระดับที่เลือก ระบบจะสุ่มจากทุกหมวดให้แทน
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
          <h2 className="text-lg font-bold text-slate-900">3. เลือกระดับความยากเพื่อเริ่มเล่น</h2>
          <p className="mt-1 text-sm text-slate-500">
            การ์ดทุกใบจะแสดงให้เห็นตั้งแต่แรก คลิกชื่อบริการแล้วคลิกคำอธิบายที่คู่กัน
          </p>

          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {DIFFICULTIES.map((difficulty) => {
              const meta = DIFFICULTY_META[difficulty]
              const best = bestTimeFor(difficulty)
              const bestAttempts = bestScoreFor(difficulty)

              return (
                <button
                  key={difficulty}
                  type="button"
                  aria-label={`เริ่มเกมระดับ${meta.label} ${PAIR_COUNT[difficulty]} คู่`}
                  onClick={() => startGame(difficulty, category)}
                  className={`rounded-xl bg-white p-4 text-left ring-2 transition-colors ${meta.tone}`}
                >
                  <p className="text-xl font-bold text-slate-900">{meta.label}</p>
                  <p className="mt-0.5 text-sm text-slate-500">{meta.blurb}</p>
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

        <button
          type="button"
          aria-label="เริ่มเกมใหม่และกลับไปหน้าเลือกระดับ"
          onClick={resetGame}
          className="ml-auto rounded-lg bg-white px-3 py-1.5 text-sm font-semibold text-slate-700 ring-1 ring-slate-200 transition-colors hover:bg-slate-100"
        >
          เลือกระดับใหม่
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
            onSelect={selectCard}
          />
        ))}
      </div>

      {state.isComplete && stars !== null && (
        <MatchResult
          difficulty={state.difficulty}
          elapsedSeconds={finalSeconds ?? 0}
          attempts={state.attempts}
          stars={stars}
          rank={rank}
          leaderboard={leaderboardFor(state.difficulty)}
          bestTime={bestTimeFor(state.difficulty)}
          bestScore={bestScoreFor(state.difficulty)}
          onPlayAgain={() => startGame(state.difficulty, category)}
          onBackHome={onBackHome}
        />
      )}
    </div>
  )
}
