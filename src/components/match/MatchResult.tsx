import { formatSeconds } from '../../hooks/useMatchGame'
import type { AWSService, LeaderboardEntry, MatchMode, StarRating } from '../../types'
import { Leaderboard } from '../ui/Leaderboard'
import { MODE_META } from './matchLabels'
import { RoundReview } from './RoundReview'

interface MatchResultProps {
  mode: MatchMode
  elapsedSeconds: number
  attempts: number
  stars: StarRating
  /** Rank earned on the leaderboard, or null when the run missed the cut. */
  rank: number | null
  leaderboard: LeaderboardEntry[]
  bestTime: number | null
  bestScore: number | null
  /** Words dealt this round, for the star / mastery review. */
  roundServices: readonly AWSService[]
  mistakes: Readonly<Record<string, number>>
  onPlayAgain: () => void
  onBackHome: () => void
}

const STAR_MESSAGES: Record<StarRating, string> = {
  3: 'สุดยอด! จำได้แม่นมาก',
  2: 'ดีแล้ว อีกนิดก็เต็มสามดาว',
  1: 'ผ่านแล้ว ลองอีกรอบให้เปิดน้อยลง',
}

/** Celebratory line for the rank that was just earned. */
function rankHeadline(rank: number | null): string | null {
  if (rank === null) return null
  if (rank === 1) return 'อันดับ 1 ของโหมดนี้ ครองกระดานไปเลย'
  if (rank === 2) return 'อันดับ 2 ของโหมดนี้ เฉียดที่หนึ่งแล้ว'
  if (rank === 3) return 'อันดับ 3 ของโหมดนี้ ขึ้นโพเดียมสำเร็จ'
  return `ติดกระดานผู้นำที่อันดับ ${rank}`
}

/** End-of-game summary: time, attempts, stars, records, and the word review. */
export function MatchResult({
  mode,
  elapsedSeconds,
  attempts,
  stars,
  rank,
  leaderboard,
  bestTime,
  bestScore,
  roundServices,
  mistakes,
  onPlayAgain,
  onBackHome,
}: MatchResultProps) {
  const headline = rankHeadline(rank)
  return (
    <div className="animate-fade-up rounded-xl bg-white p-8 text-center shadow-md ring-1 ring-slate-200">
      <p className="text-sm font-medium text-slate-500">จบเกมโหมด{MODE_META[mode].label}</p>
      <h2 className="mt-1 text-2xl font-bold text-slate-900">{STAR_MESSAGES[stars]}</h2>

      <p
        className="mt-4 text-4xl tracking-[0.2em]"
        aria-label={`ได้ ${stars} ดาว จาก 3 ดาว`}
      >
        <span aria-hidden="true">
          {'★'.repeat(stars)}
          <span className="text-slate-300">{'★'.repeat(3 - stars)}</span>
        </span>
      </p>

      <dl className="mx-auto mt-6 grid max-w-md grid-cols-2 gap-3">
        <div className="rounded-xl bg-slate-100 px-4 py-3">
          <dt className="text-xs font-medium text-slate-500">เวลาที่ใช้</dt>
          <dd className="mt-0.5 text-2xl font-bold tabular-nums text-slate-800">
            {formatSeconds(elapsedSeconds)}
          </dd>
        </div>
        <div className="rounded-xl bg-slate-100 px-4 py-3">
          <dt className="text-xs font-medium text-slate-500">จำนวนครั้งที่ทาย</dt>
          <dd className="mt-0.5 text-2xl font-bold tabular-nums text-slate-800">{attempts}</dd>
        </div>
        <div className="rounded-xl bg-emerald-50 px-4 py-3">
          <dt className="text-xs font-medium text-emerald-700">เวลาที่ดีที่สุด</dt>
          <dd className="mt-0.5 text-xl font-bold tabular-nums text-emerald-800">
            {bestTime === null ? '—' : formatSeconds(bestTime)}
          </dd>
        </div>
        <div className="rounded-xl bg-emerald-50 px-4 py-3">
          <dt className="text-xs font-medium text-emerald-700">ทายน้อยที่สุด</dt>
          <dd className="mt-0.5 text-xl font-bold tabular-nums text-emerald-800">
            {bestScore === null ? '—' : bestScore}
          </dd>
        </div>
      </dl>

      <RoundReview services={roundServices} mode={mode} mistakes={mistakes} />

      <div className="mt-7 border-t border-slate-200 pt-6 text-left">
        <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
          <h3 className="text-base font-bold text-slate-900">
            กระดานผู้นำ · โหมด{MODE_META[mode].label}
          </h3>
          {headline !== null ? (
            <p className="rounded-full bg-orange-100 px-3 py-1 text-xs font-bold text-orange-700">
              🎉 {headline}
            </p>
          ) : (
            <p className="text-xs text-slate-500">
              รอบนี้ยังไม่ติดกระดาน ลองอีกครั้งให้เร็วขึ้น
            </p>
          )}
        </div>

        <Leaderboard
          entries={leaderboard}
          mode={mode}
          highlightId={leaderboard[(rank ?? 0) - 1]?.id}
          limit={5}
        />
      </div>

      <div className="mt-7 flex flex-wrap justify-center gap-2">
        <button
          type="button"
          aria-label="เล่นเกมจับคู่อีกครั้ง"
          onClick={onPlayAgain}
          className="rounded-lg bg-orange-500 px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-orange-600"
        >
          เล่นอีกครั้ง
        </button>
        <button
          type="button"
          aria-label="กลับไปหน้าแรก"
          onClick={onBackHome}
          className="rounded-lg bg-white px-5 py-2.5 text-sm font-bold text-slate-700 ring-1 ring-slate-200 transition-colors hover:bg-slate-100"
        >
          กลับหน้าแรก
        </button>
      </div>
    </div>
  )
}
