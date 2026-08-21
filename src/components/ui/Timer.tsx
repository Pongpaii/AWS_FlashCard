import { useEffect, useState } from 'react'
import { formatSeconds } from '../../hooks/useMatchGame'

interface TimerProps {
  /** Epoch ms when the game started; null means it has not started yet. */
  startTime: number | null
  isRunning: boolean
  /** Frozen value shown after the game ends. */
  frozenSeconds?: number | null
}

/**
 * Elapsed-time readout. Derives the value from Date.now() on every tick so the
 * display cannot drift when the tab is throttled.
 */
export function Timer({ startTime, isRunning, frozenSeconds = null }: TimerProps) {
  const [elapsed, setElapsed] = useState(0)

  useEffect(() => {
    if (startTime === null || !isRunning) return

    const read = () => setElapsed(Math.max(0, Math.floor((Date.now() - startTime) / 1000)))
    read()

    const interval = window.setInterval(read, 1000)
    return () => window.clearInterval(interval)
  }, [startTime, isRunning])

  // Reset the readout whenever a new board is dealt.
  useEffect(() => {
    if (startTime === null) setElapsed(0)
  }, [startTime])

  const seconds = frozenSeconds ?? (startTime === null ? 0 : elapsed)

  return (
    <span
      className="tabular-nums font-semibold text-slate-700"
      aria-label={`เวลาที่ใช้ ${seconds} วินาที`}
    >
      {formatSeconds(seconds)}
    </span>
  )
}
