import { useMemo, useState } from 'react'
import {
  PILLAR_STYLES,
  pillarById,
  pillarDrillItems,
  wellArchitectedPillars,
} from '../../data/wellArchitected'
import type { PillarDrillItem, PillarId } from '../../types'
import { shuffle } from '../../utils/shuffle'

/** How many cues one drill round serves. */
const ROUND_LENGTH = 8

interface Answered {
  picked: PillarId
  isCorrect: boolean
}

function newRound(): PillarDrillItem[] {
  return shuffle(pillarDrillItems).slice(0, ROUND_LENGTH)
}

/**
 * Recall drill: read a scenario fragment, pick the pillar it belongs to.
 * Nothing is persisted; it is a scratchpad for memorising the six pillars.
 */
export function PillarDrill() {
  const [round, setRound] = useState<PillarDrillItem[]>(newRound)
  const [index, setIndex] = useState(0)
  const [answered, setAnswered] = useState<Answered | null>(null)
  const [correctCount, setCorrectCount] = useState(0)

  const current = round[index]
  const isLast = index === round.length - 1
  const isFinished = current === undefined

  const percent = useMemo(
    () => (round.length === 0 ? 0 : Math.round((correctCount / round.length) * 100)),
    [correctCount, round.length],
  )

  const handlePick = (picked: PillarId) => {
    if (answered !== null || current === undefined) return
    const isCorrect = picked === current.answer
    if (isCorrect) setCorrectCount((value) => value + 1)
    setAnswered({ picked, isCorrect })
  }

  const handleNext = () => {
    setAnswered(null)
    setIndex((value) => value + 1)
  }

  const handleRestart = () => {
    setRound(newRound())
    setIndex(0)
    setAnswered(null)
    setCorrectCount(0)
  }

  if (isFinished) {
    return (
      <section className="rounded-xl bg-white p-6 text-center shadow-md ring-1 ring-slate-200">
        <h2 className="text-lg font-bold text-slate-900">จบรอบแล้ว</h2>
        <p className="mt-2 text-3xl font-bold tabular-nums text-indigo-700">
          {correctCount}/{round.length}
          <span className="ml-2 text-base font-medium text-slate-500">({percent}%)</span>
        </p>
        <p className="mt-2 text-sm text-slate-600">
          {percent === 100
            ? 'แม่นทั้งรอบ ลองสลับโจทย์ใหม่อีกชุดเพื่อยืนยันว่าจำได้จริง'
            : 'ยังพลาดอยู่บ้าง อ่านการ์ด pillar ที่พลาดอีกรอบแล้วกลับมาลองใหม่'}
        </p>
        <button
          type="button"
          onClick={handleRestart}
          aria-label="เริ่มฝึกจับ pillar รอบใหม่"
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
        <h2 className="text-lg font-bold text-slate-900">ฝึกจับ pillar ให้ไว</h2>
        <p className="text-sm text-slate-500">
          ข้อ <strong className="tabular-nums text-slate-700">{index + 1}</strong>/{round.length} ·
          ถูก <strong className="tabular-nums text-emerald-700">{correctCount}</strong>
        </p>
      </div>
      <p className="mt-1 text-sm text-slate-600">
        อ่านสถานการณ์แล้วเลือกว่าอยู่ pillar ไหน ผลตรงนี้ไม่ถูกบันทึก ฝึกซ้ำได้ไม่จำกัด
      </p>

      <p className="mt-4 rounded-lg bg-slate-50 p-4 text-[15px] font-medium leading-relaxed text-slate-800">
        {current.cue}
      </p>

      <div
        role="group"
        aria-label="เลือก pillar ที่ตรงกับสถานการณ์"
        className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3"
      >
        {wellArchitectedPillars.map((pillar) => {
          const style = PILLAR_STYLES[pillar.id]
          const isAnswerKey = answered !== null && pillar.id === current.answer
          const isWrongPick =
            answered !== null && answered.picked === pillar.id && !answered.isCorrect

          return (
            <button
              key={pillar.id}
              type="button"
              disabled={answered !== null}
              onClick={() => handlePick(pillar.id)}
              aria-label={`ตอบ ${pillar.name}`}
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
                <span
                  aria-hidden="true"
                  className={`h-2.5 w-2.5 shrink-0 rounded-full ${answered === null ? style.dot : 'bg-white/70'}`}
                />
                {pillar.name}
              </span>
              <span className="mt-0.5 block text-xs font-normal opacity-80">{pillar.nameTh}</span>
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
              {answered.isCorrect
                ? '✓ ถูกต้อง'
                : `✕ ยังไม่ใช่ คำตอบคือ ${pillarById[current.answer].name}`}
            </p>
            <p className="mt-1 text-sm leading-relaxed">{current.why}</p>
          </div>
        )}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          disabled={answered === null}
          onClick={handleNext}
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
