interface ScoreBoardProps {
  known: number
  unknown: number
  remaining: number
}

const ITEMS = [
  { key: 'known', label: 'จำได้', tone: 'text-green-600', bg: 'bg-green-50' },
  { key: 'unknown', label: 'ยังไม่แม่น', tone: 'text-red-600', bg: 'bg-red-50' },
  { key: 'remaining', label: 'เหลือ', tone: 'text-slate-600', bg: 'bg-slate-100' },
] as const

/** Three-up counter row for the Flash Card session. */
export function ScoreBoard({ known, unknown, remaining }: ScoreBoardProps) {
  const values = { known, unknown, remaining }

  return (
    <dl className="grid grid-cols-3 gap-2 sm:gap-3">
      {ITEMS.map((item) => (
        <div key={item.key} className={`rounded-xl ${item.bg} px-3 py-2 text-center`}>
          <dt className="text-xs font-medium text-slate-500">{item.label}</dt>
          <dd className={`mt-0.5 text-2xl font-bold tabular-nums ${item.tone}`}>
            {values[item.key]}
          </dd>
        </div>
      ))}
    </dl>
  )
}
