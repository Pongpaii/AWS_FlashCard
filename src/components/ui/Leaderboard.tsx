import { formatSeconds } from '../../hooks/useMatchGame'
import type { Difficulty, LeaderboardEntry } from '../../types'

interface LeaderboardProps {
  entries: LeaderboardEntry[]
  difficulty: Difficulty
  /** Highlights the row just achieved, if it is on this board. */
  highlightId?: string
  /** Trims the table to the first N rows. */
  limit?: number
}

const MEDALS = ['🥇', '🥈', '🥉'] as const

/** Rank badge: medal for the podium, plain number after that. */
function RankBadge({ rank }: { rank: number }) {
  const medal = MEDALS[rank - 1]

  if (medal !== undefined) {
    return (
      <span className="text-xl leading-none" aria-label={`อันดับ ${rank}`}>
        {medal}
      </span>
    )
  }

  return (
    <span
      className="grid h-6 w-6 place-items-center rounded-full bg-slate-200 text-xs font-bold tabular-nums text-slate-600"
      aria-label={`อันดับ ${rank}`}
    >
      {rank}
    </span>
  )
}

/** Formats an ISO timestamp as a short Thai date. */
function formatPlayedAt(iso: string): string {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return '—'
  return date.toLocaleDateString('th-TH', { day: 'numeric', month: 'short' })
}

/** Ranking table for one difficulty, fastest run first. */
export function Leaderboard({ entries, difficulty, highlightId, limit }: LeaderboardProps) {
  const rows = limit === undefined ? entries : entries.slice(0, limit)

  if (rows.length === 0) {
    return (
      <p className="rounded-xl bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
        ยังไม่มีสถิติในระดับนี้ ลองเล่นเกมจับคู่ให้จบหนึ่งรอบเพื่อขึ้นกระดานเป็นคนแรก
      </p>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <caption className="sr-only">
          ตารางอันดับเกมจับคู่ระดับ {difficulty} เรียงจากเวลาที่เร็วที่สุด
        </caption>
        <thead>
          <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-wide text-slate-500">
            <th scope="col" className="w-14 px-2 py-2 font-semibold">
              อันดับ
            </th>
            <th scope="col" className="px-2 py-2 font-semibold">
              ชื่อผู้เล่น
            </th>
            <th scope="col" className="px-2 py-2 text-right font-semibold">
              เวลา
            </th>
            <th scope="col" className="px-2 py-2 text-right font-semibold">
              ทาย
            </th>
            <th scope="col" className="px-2 py-2 text-center font-semibold">
              ดาว
            </th>
            <th scope="col" className="px-2 py-2 text-right font-semibold">
              วันที่
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((entry, index) => {
            const rank = index + 1
            const isHighlighted = entry.id === highlightId

            return (
              <tr
                key={entry.id}
                className={[
                  'border-b border-slate-100 last:border-0',
                  isHighlighted ? 'bg-orange-50 font-semibold' : 'hover:bg-slate-50',
                ].join(' ')}
              >
                <td className="px-2 py-2.5">
                  <RankBadge rank={rank} />
                </td>
                <td className="max-w-[10rem] truncate px-2 py-2.5 text-slate-800">
                  {entry.name}
                  {isHighlighted && (
                    <span className="ml-2 rounded-full bg-orange-500 px-2 py-0.5 text-[10px] font-bold text-white">
                      รอบนี้
                    </span>
                  )}
                </td>
                <td className="px-2 py-2.5 text-right tabular-nums text-slate-800">
                  {formatSeconds(entry.seconds)}
                </td>
                <td className="px-2 py-2.5 text-right tabular-nums text-slate-600">
                  {entry.attempts}
                </td>
                <td className="px-2 py-2.5 text-center text-amber-500" aria-label={`${entry.stars} ดาว`}>
                  <span aria-hidden="true">{'★'.repeat(entry.stars)}</span>
                </td>
                <td className="px-2 py-2.5 text-right text-xs tabular-nums text-slate-400">
                  {formatPlayedAt(entry.playedAt)}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
