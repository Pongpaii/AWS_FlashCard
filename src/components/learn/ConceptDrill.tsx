import { useMemo, useState } from 'react'
import type { ConceptDrillItem } from '../../types'
import { shuffle } from '../../utils/shuffle'

/** One answer button in the drill. */
export interface DrillOption {
  id: string
  label: string
  /** Secondary line, usually the Thai name. */
  sublabel?: string
  /** Tailwind background class for the colour dot. */
  dot?: string
}

interface ConceptDrillProps {
  title: string
  blurb: string
  options: DrillOption[]
  items: ConceptDrillItem[]
  /** How many cues one round serves. */
  roundLength?: number
}

interface Answered {
  picked: string
  isCorrect: boolean
}

/**
 * Generic recall drill: read a cue, pick which concept it belongs to, see why.
 * Nothing is persisted; it is a scratchpad for memorising a closed set of terms.
 */
export function ConceptDrill({
  title,
  blurb,
  options,
  items,
  roundLength = 8,
}: ConceptDrillProps) {
  const buildRound = () => shuffle(items).slice(0, roundLength)

  const [round, setRound] = useState<ConceptDrillItem[]>(buildRound)
  const [index, setIndex] = useState(0)
  const [answered, setAnswered] = useState<Answered | null>(null)
  const [correctCount, setCorrectCount] = useState(0)

  const current = round[index]
  const isLast = index === round.length - 1
  const percent = useMemo(
    () => (round.length === 0 ? 0 : Math.round((correctCount / round.length) * 100)),
    [correctCount, round.length],
  )

  const answerLabel =
    current === undefined
      ? ''
      : (options.find((option) => option.id === current.answer)?.label ?? current.answer)

  const handlePick = (picked: string) => {
    if (answered !== null || current === undefined) return
    const isCorrect = picked === current.answer
    if (isCorrect) setCorrectCount((value) => value + 1)
    setAnswered({ picked, isCorrect })
  }

  const handleRestart = () => {
    setRound(buildRound())
    setIndex(0)
    setAnswered(null)
    setCorrectCount(0)
  }

  if (current === undefined) {
    return (
      <section className="rounded-xl bg-white p-6 text-center shadow-md ring-1 ring-slate-200">
        <h2 className="text-lg font-bold text-slate-900">จบรอบแล้ว</h2>
        <p className="mt-2 text-3xl font-bold tabular-nums text-indigo-700">
          {correctCount}/{round.length}
          <span className="ml-2 text-base font-medium text-slate-500">({percent}%)</span>
        </p>
        <p className="mt-2 text-sm text-slate-600">
          {percent === 100
            ? 'แม่นทั้งรอบ ลองสลับโจทย์ใหม่เพื่อยืนยันว่าจำได้จริง'
            : 'ยังพลาดอยู่บ้าง อ่านหัวข้อที่พลาดอีกรอบแล้วกลับมาลองใหม่'}
        </p>
        <button
          type="button"
          onClick={handleRestart}
          aria-label="เริ่มฝึกรอบใหม่"
          className="mt-4 rounded-lg bg-orange-500 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-orange-600"
        >
          เริ่มรอบใหม่
        </button>
      </section>
    )
  }

  return (
    <section className="rounded-xl bg-white p-5 shadow-md ring-1 ring-slate-200">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-lg font-bold text-slate-900">{title}</h2>
        <p className="text-sm text-slate-500">
          ข้อ <strong className="tabular-nums text-slate-700">{index + 1}</strong>/{round.length} ·
          ถูก <strong className="tabular-nums text-emerald-700">{correctCount}</strong>
        </p>
      </div>
      <p className="mt-1 text-sm text-slate-600">{blurb}</p>

      <p className="mt-4 rounded-lg bg-slate-50 p-4 text-[15px] font-medium leading-relaxed text-slate-800">
        {current.cue}
      </p>

      <div
        role="group"
        aria-label="เลือกคำตอบที่ตรงกับสถานการณ์"
        className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3"
      >
        {options.map((option) => {
          const isAnswerKey = answered !== null && option.id === current.answer
          const isWrongPick =
            answered !== null && answered.picked === option.id && !answered.isCorrect

          return (
            <button
              key={option.id}
              type="button"
              disabled={answered !== null}
              onClick={() => handlePick(option.id)}
              aria-label={`ตอบ ${option.label}`}
              className={[
                'rounded-lg px-3 py-2.5 text-left text-sm font-semibold transition-colors',
                isAnswerKey
                  ? 'bg-emerald-500 text-white'
                  : isWrongPick
                    ? 'bg-red-500 text-white'
                    : answered !== null
                      ? 'bg-slate-50 text-slate-400'
                      : 'bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50',
              ].join(' ')}
            >
              <span className="flex items-center gap-2">
                {option.dot !== undefined && (
                  <span
                    aria-hidden="true"
                    className={`h-2.5 w-2.5 shrink-0 rounded-full ${answered === null ? option.dot : 'bg-white/70'}`}
                  />
                )}
                {option.label}
              </span>
              {option.sublabel !== undefined && (
                <span className="mt-0.5 block text-xs font-normal opacity-80">
                  {option.sublabel}
                </span>
              )}
            </button>
          )
        })}
      </div>

      <div aria-live="polite" className="mt-4">
        {answered !== null && (
          <div
            className={`rounded-lg p-3 ring-1 ${
              answered.isCorrect
                ? 'bg-emerald-50 text-emerald-900 ring-emerald-200'
                : 'bg-red-50 text-red-900 ring-red-200'
            }`}
          >
            <p className="text-sm font-bold">
              {answered.isCorrect ? '✓ ถูกต้อง' : `✕ ยังไม่ใช่ คำตอบคือ ${answerLabel}`}
            </p>
            <p className="mt-1 text-sm leading-relaxed">{current.why}</p>
          </div>
        )}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          disabled={answered === null}
          onClick={() => {
            setAnswered(null)
            setIndex((value) => value + 1)
          }}
          aria-label={isLast ? 'ดูผลรอบนี้' : 'ไปข้อถัดไป'}
          className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-orange-600 disabled:bg-slate-200 disabled:text-slate-400"
        >
          {isLast ? 'ดูผล' : 'ข้อถัดไป'}
        </button>
        <button
          type="button"
          onClick={handleRestart}
          aria-label="สลับโจทย์และเริ่มรอบใหม่"
          className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-slate-600 ring-1 ring-slate-200 transition-colors hover:bg-slate-100"
        >
          สลับโจทย์ใหม่
        </button>
      </div>
    </section>
  )
}
