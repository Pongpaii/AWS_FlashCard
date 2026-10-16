import { useMemo, useState } from 'react'
import { SUPPORT_PLAN_STYLES, supportPlanById, supportPlans } from '../../data/supportPlans'
import {
  SUPPORT_TABLES,
  SUPPORT_TABLE_IDS,
  blankableCells,
  dealBlanks,
  type SupportTableId,
  type TableBlank,
} from '../../data/supportTableGame'

type TableChoice = SupportTableId | 'both'
type BlankCount = 6 | 12 | 'all'

const TABLE_CHOICES: { id: TableChoice; label: string }[] = [
  { id: 'response', label: 'ตารางเวลาตอบกลับ' },
  { id: 'features', label: 'ตารางสิทธิ์ที่ได้' },
  { id: 'both', label: 'ทั้งสองตาราง' },
]

const COUNT_CHOICES: { id: BlankCount; label: string }[] = [
  { id: 6, label: '6 ช่อง' },
  { id: 12, label: '12 ช่อง' },
  { id: 'all', label: 'ปิดทั้งตาราง' },
]

function tableIdsFor(choice: TableChoice): SupportTableId[] {
  return choice === 'both' ? [...SUPPORT_TABLE_IDS] : [choice]
}

const CELL = 'px-2.5 py-2 text-sm align-top'

/**
 * "เกมจำตาราง": the two support plan tables with random cells blanked. Pick a
 * blank, choose its value, and the game moves on to the next blank. Nothing is
 * persisted; it is a scratchpad for memorising the tables.
 */
export function SupportTableGame() {
  const [tableChoice, setTableChoice] = useState<TableChoice>('response')
  const [countChoice, setCountChoice] = useState<BlankCount>(6)
  const [blanks, setBlanks] = useState<TableBlank[] | null>(null)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [activeKey, setActiveKey] = useState<string | null>(null)
  const [lastResult, setLastResult] = useState<{ ok: boolean; answer: string } | null>(null)

  const blankByKey = useMemo(
    () => new Map((blanks ?? []).map((blank) => [blank.key, blank])),
    [blanks],
  )
  const answeredCount = Object.keys(answers).length
  const correctCount = (blanks ?? []).filter((blank) => answers[blank.key] === blank.answer).length
  const isDone = blanks !== null && answeredCount === blanks.length
  const active = activeKey === null ? undefined : blankByKey.get(activeKey)

  const start = (next: TableBlank[]) => {
    setBlanks(next)
    setAnswers({})
    setActiveKey(next[0]?.key ?? null)
    setLastResult(null)
  }

  const startNew = () => start(dealBlanks(tableIdsFor(tableChoice), countChoice))

  const retryMistakes = () => {
    if (blanks === null) return
    start(blanks.filter((blank) => answers[blank.key] !== blank.answer))
  }

  const pick = (value: string) => {
    if (blanks === null || active === undefined || answers[active.key] !== undefined) return
    const nextAnswers = { ...answers, [active.key]: value }
    setAnswers(nextAnswers)
    setLastResult({ ok: value === active.answer, answer: active.answer })

    // Move to the next unanswered blank after this one, wrapping around.
    const index = blanks.findIndex((blank) => blank.key === active.key)
    const ordered = [...blanks.slice(index + 1), ...blanks.slice(0, index)]
    setActiveKey(ordered.find((blank) => nextAnswers[blank.key] === undefined)?.key ?? null)
  }

  if (blanks === null) {
    const poolSize = blankableCells(tableIdsFor(tableChoice)).length
    return (
      <section
        id="table-game"
        className="rounded-xl bg-white p-5 shadow-md ring-1 ring-slate-200"
      >
        <h2 className="text-lg font-bold text-slate-900">เกมจำตาราง Support Plan</h2>
        <p className="mt-1 text-sm text-slate-600">
          ระบบจะปิดช่องในตารางแบบสุ่ม คลิกช่อง “?” แล้วเลือกค่าที่ถูก ช่องที่ไม่ได้ปิดคือตัวช่วย
          ถ้าอยากทดสอบจริงให้เลือก “ปิดทั้งตาราง” ผลตรงนี้ไม่ถูกบันทึก ฝึกซ้ำได้ไม่จำกัด
        </p>

        <fieldset className="mt-4">
          <legend className="text-xs font-bold uppercase tracking-wide text-slate-500">ตาราง</legend>
          <div className="mt-2 flex flex-wrap gap-2">
            {TABLE_CHOICES.map((item) => (
              <ChoiceChip
                key={item.id}
                label={item.label}
                isActive={tableChoice === item.id}
                onClick={() => setTableChoice(item.id)}
              />
            ))}
          </div>
        </fieldset>

        <fieldset className="mt-4">
          <legend className="text-xs font-bold uppercase tracking-wide text-slate-500">
            จำนวนช่องที่ปิด
          </legend>
          <div className="mt-2 flex flex-wrap gap-2">
            {COUNT_CHOICES.map((item) => (
              <ChoiceChip
                key={String(item.id)}
                label={item.id === 'all' ? `${item.label} (${poolSize} ช่อง)` : item.label}
                isActive={countChoice === item.id}
                onClick={() => setCountChoice(item.id)}
              />
            ))}
          </div>
        </fieldset>

        <button
          type="button"
          onClick={startNew}
          className="mt-5 rounded-lg bg-orange-500 px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-orange-600"
        >
          เริ่มเล่น
        </button>
      </section>
    )
  }

  const tableIds = [...new Set(blanks.map((blank) => blank.tableId))]
  const percent = blanks.length === 0 ? 0 : Math.round((correctCount / blanks.length) * 100)
  const activeRow =
    active === undefined
      ? undefined
      : SUPPORT_TABLES[active.tableId].rows.find((row) => row.id === active.rowId)

  return (
    <section id="table-game" className="flex flex-col gap-4 rounded-xl bg-white p-5 shadow-md ring-1 ring-slate-200">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-lg font-bold text-slate-900">เกมจำตาราง Support Plan</h2>
        <p className="text-sm text-slate-500">
          ตอบแล้ว <strong className="tabular-nums text-slate-700">{answeredCount}</strong>/
          {blanks.length} · ถูก{' '}
          <strong className="tabular-nums text-emerald-700">{correctCount}</strong>
        </p>
      </div>

      {tableIds.map((tableId) => {
        const table = SUPPORT_TABLES[tableId]
        return (
          <div key={tableId}>
            <h3 className="mb-2 text-sm font-bold text-slate-700">{table.title}</h3>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] border-collapse">
                <caption className="sr-only">
                  {table.title} บางช่องถูกปิดไว้ให้ทาย
                </caption>
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th
                      scope="col"
                      className="sticky left-0 bg-slate-50 px-2.5 py-2 text-left text-xs font-bold uppercase tracking-wide text-slate-500"
                    >
                      {tableId === 'response' ? 'ระดับความรุนแรง' : 'สิทธิ์ที่ได้'}
                    </th>
                    {supportPlans.map((plan) => (
                      <th key={plan.id} scope="col" className="px-2.5 py-2 text-left">
                        <span
                          className={`inline-block rounded-full px-2.5 py-0.5 text-[11px] font-bold ${SUPPORT_PLAN_STYLES[plan.id].badge}`}
                        >
                          {plan.name}
                        </span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {table.rows.map((row) => (
                    <tr key={row.id} className="border-b border-slate-100 last:border-0">
                      <th
                        scope="row"
                        className={`${CELL} sticky left-0 bg-white text-left font-semibold text-slate-800`}
                      >
                        {row.label}
                        {row.sublabel !== undefined && (
                          <span className="mt-0.5 block text-xs font-normal text-slate-400">
                            {row.sublabel}
                          </span>
                        )}
                      </th>
                      {supportPlans.map((plan) => {
                        const blank = blankByKey.get(`${tableId}:${row.id}:${plan.id}`)
                        return (
                          <td key={plan.id} className={CELL}>
                            {blank === undefined ? (
                              <span className="text-slate-500">{row.values[plan.id]}</span>
                            ) : (
                              <BlankCell
                                blank={blank}
                                picked={answers[blank.key]}
                                isActive={blank.key === activeKey}
                                label={`${row.label} แผน ${plan.name}`}
                                onActivate={() => setActiveKey(blank.key)}
                              />
                            )}
                          </td>
                        )
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )
      })}

      <div aria-live="polite" className="sr-only">
        {lastResult !== null &&
          (lastResult.ok ? 'ถูกต้อง' : `ยังไม่ใช่ คำตอบคือ ${lastResult.answer}`)}
      </div>

      {isDone ? (
        <div className="rounded-xl bg-slate-50 p-5 text-center ring-1 ring-slate-200">
          <p className="text-3xl font-bold tabular-nums text-indigo-700">
            {correctCount}/{blanks.length}
            <span className="ml-2 text-base font-medium text-slate-500">({percent}%)</span>
          </p>
          <p className="mt-2 text-sm text-slate-600">
            {percent === 100
              ? 'จำตารางได้แม่นทั้งรอบ ลองเพิ่มจำนวนช่องหรือปิดทั้งตาราง'
              : 'ช่องสีแดงคือช่องที่พลาด ดูคำตอบที่ถูกในช่องนั้นแล้วลองฝึกซ้ำ'}
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {percent < 100 && (
              <button
                type="button"
                onClick={retryMistakes}
                className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-orange-600"
              >
                ฝึกเฉพาะช่องที่พลาด
              </button>
            )}
            <button
              type="button"
              onClick={startNew}
              className="rounded-lg bg-white px-4 py-2 text-sm font-bold text-indigo-700 ring-1 ring-indigo-200 transition-colors hover:bg-indigo-50"
            >
              สุ่มช่องใหม่
            </button>
            <button
              type="button"
              onClick={() => setBlanks(null)}
              className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-slate-600 ring-1 ring-slate-200 transition-colors hover:bg-slate-100"
            >
              เปลี่ยนการตั้งค่า
            </button>
          </div>
        </div>
      ) : (
        active !== undefined && (
          <div className="sticky bottom-2 z-10 rounded-xl bg-indigo-50 p-4 shadow-lg ring-1 ring-indigo-200">
            <p className="text-sm text-indigo-900">
              ช่องนี้:{' '}
              <strong className="font-bold">{activeRow?.label}</strong> ·{' '}
              <span
                className={`inline-block rounded-full px-2 py-0.5 text-[11px] font-bold ${SUPPORT_PLAN_STYLES[active.planId].badge}`}
              >
                {supportPlanById[active.planId].name}
              </span>
              {lastResult !== null && (
                <span
                  aria-hidden="true"
                  className={`ml-3 font-semibold ${lastResult.ok ? 'text-emerald-700' : 'text-red-700'}`}
                >
                  {lastResult.ok ? '✓ ข้อก่อนหน้าถูก' : `✕ ข้อก่อนหน้าคือ “${lastResult.answer}”`}
                </span>
              )}
            </p>
            <div
              role="group"
              aria-label="เลือกค่าที่ถูกสำหรับช่องนี้"
              className="mt-3 flex flex-wrap gap-2"
            >
              {active.choices.map((choice) => (
                <button
                  key={choice}
                  type="button"
                  onClick={() => pick(choice)}
                  className="rounded-lg bg-white px-3 py-2 text-sm font-semibold text-slate-700 ring-1 ring-slate-200 transition-colors hover:bg-indigo-100"
                >
                  {choice}
                </button>
              ))}
            </div>
          </div>
        )
      )}

      {!isDone && (
        <button
          type="button"
          onClick={() => setBlanks(null)}
          className="self-start rounded-lg bg-white px-4 py-2 text-sm font-semibold text-slate-600 ring-1 ring-slate-200 transition-colors hover:bg-slate-100"
        >
          เลิกเล่นรอบนี้
        </button>
      )}
    </section>
  )
}

function ChoiceChip({
  label,
  isActive,
  onClick,
}: {
  label: string
  isActive: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      aria-pressed={isActive}
      onClick={onClick}
      className={[
        'rounded-full px-4 py-1.5 text-sm font-semibold transition-colors',
        isActive
          ? 'bg-orange-500 text-white'
          : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-100',
      ].join(' ')}
    >
      {label}
    </button>
  )
}

/** A hidden cell: "?" until answered, then the correct value coloured by result. */
function BlankCell({
  blank,
  picked,
  isActive,
  label,
  onActivate,
}: {
  blank: TableBlank
  picked: string | undefined
  isActive: boolean
  label: string
  onActivate: () => void
}) {
  if (picked === undefined) {
    return (
      <button
        type="button"
        onClick={onActivate}
        aria-pressed={isActive}
        aria-label={`ทายช่อง ${label}`}
        className={[
          'w-full rounded-md px-2 py-1.5 text-center text-sm font-bold transition-colors',
          isActive
            ? 'bg-indigo-600 text-white ring-2 ring-indigo-300'
            : 'bg-indigo-50 text-indigo-600 ring-1 ring-indigo-200 hover:bg-indigo-100',
        ].join(' ')}
      >
        ?
      </button>
    )
  }

  const isCorrect = picked === blank.answer
  return (
    <span
      className={`block rounded-md px-2 py-1.5 ring-1 ${
        isCorrect
          ? 'bg-emerald-50 text-emerald-800 ring-emerald-200'
          : 'bg-red-50 text-red-800 ring-red-200'
      }`}
    >
      <span className="sr-only">{isCorrect ? 'ตอบถูก: ' : 'ตอบผิด คำตอบที่ถูกคือ '}</span>
      <span className="font-semibold">{blank.answer}</span>
      {!isCorrect && (
        <span className="mt-0.5 block text-xs line-through opacity-70">
          <span className="sr-only">คุณตอบ </span>
          {picked}
        </span>
      )}
    </span>
  )
}
