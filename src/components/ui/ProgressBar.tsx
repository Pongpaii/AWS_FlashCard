interface ProgressBarProps {
  /** Completed units, clamped into [0, total]. */
  value: number
  total: number
  label?: string
}

/** Horizontal progress indicator with an accessible Thai description. */
export function ProgressBar({ value, total, label }: ProgressBarProps) {
  const safeTotal = Math.max(0, total)
  const safeValue = Math.min(Math.max(0, value), safeTotal)
  const percent = safeTotal === 0 ? 0 : Math.round((safeValue / safeTotal) * 100)

  return (
    <div className="w-full">
      <div className="mb-1.5 flex items-baseline justify-between text-sm">
        <span className="font-medium text-slate-600">{label ?? 'ความก้าวหน้า'}</span>
        <span className="tabular-nums text-slate-500">
          {safeValue} / {safeTotal} ({percent}%)
        </span>
      </div>

      <div
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={safeTotal}
        aria-valuenow={safeValue}
        aria-label={`${label ?? 'ความก้าวหน้า'} ${safeValue} จาก ${safeTotal}`}
        className="h-2.5 w-full overflow-hidden rounded-full bg-slate-200"
      >
        <div
          className="h-full rounded-full bg-orange-500 transition-[width] duration-300 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  )
}
