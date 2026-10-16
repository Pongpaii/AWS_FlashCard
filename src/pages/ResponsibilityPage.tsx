import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ConceptDrill } from '../components/learn/ConceptDrill'
import { DeckMatchGame } from '../components/match/DeckMatchGame'
import { matchDecks } from '../data/matchDecks'
import {
  OWNER_IDS,
  OWNER_META,
  SERVICE_MODELS,
  SERVICE_MODEL_ROWS,
  SHARED_CONTROLS,
  SRM_CONTROL_TYPES,
  SRM_EXAM_TIPS,
  SRM_SIDES,
  SRM_SOURCES,
  responsibilityItems,
} from '../data/sharedResponsibility'
import type { ConceptDrillItem } from '../types'

type SrmTab = 'learn' | 'drill' | 'match'

const TABS: { id: SrmTab; label: string }[] = [
  { id: 'learn', label: 'เรียนรู้' },
  { id: 'drill', label: 'เกมจำ: ใครรับผิดชอบ' },
  { id: 'match', label: 'จับคู่' },
]

const srmGroups = matchDecks.find((deck) => deck.id === 'responsibility')?.groups ?? []

const drillOptions = OWNER_IDS.map((owner) => ({
  id: owner,
  label: OWNER_META[owner].label,
  sublabel: OWNER_META[owner].sublabel,
  dot: OWNER_META[owner].dot,
}))

const drillItems: ConceptDrillItem[] = responsibilityItems.map((item) => ({
  id: item.id,
  cue: item.task,
  answer: item.owner,
  why: item.why,
}))

function OwnerBadge({ owner }: { owner: keyof typeof OWNER_META }) {
  return (
    <span
      className={`inline-block rounded-full px-2.5 py-0.5 text-[11px] font-bold ${OWNER_META[owner].badge}`}
    >
      {OWNER_META[owner].label}
    </span>
  )
}

/** AWS Shared Responsibility Model: reading notes, a who-owns-it drill, and a match game. */
export function ResponsibilityPage() {
  const [tab, setTab] = useState<SrmTab>('learn')

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Shared Responsibility Model
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          หัวข้อหลักของหมวด Security &amp; Compliance ใน CLF-C02: AWS ดูแลความปลอดภัย
          “ของ” คลาวด์ ลูกค้าดูแลความปลอดภัย “ใน” คลาวด์ และเส้นแบ่งจะขยับตามชนิดบริการที่ใช้
        </p>
      </div>

      <div
        role="tablist"
        aria-label="โหมดการเรียนเรื่อง Shared Responsibility"
        className="flex flex-wrap gap-2 rounded-xl bg-white p-3 shadow-md ring-1 ring-slate-200"
      >
        {TABS.map((item) => {
          const isActive = item.id === tab
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setTab(item.id)}
              className={[
                'rounded-lg px-4 py-2 text-sm font-semibold transition-colors',
                isActive
                  ? 'bg-orange-500 text-white'
                  : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-100',
              ].join(' ')}
            >
              {item.label}
            </button>
          )
        })}
      </div>

      {tab === 'learn' && (
        <div className="flex flex-col gap-5">
          <section className="grid gap-3 lg:grid-cols-2">
            {SRM_SIDES.map((side) => (
              <article
                key={side.owner}
                className={`rounded-xl p-5 ring-1 ${OWNER_META[side.owner].soft}`}
              >
                <h2 className={`text-lg font-bold ${OWNER_META[side.owner].text}`}>
                  {side.title}
                </h2>
                <ul className="mt-3 flex list-disc flex-col gap-1.5 pl-5 text-sm leading-relaxed text-slate-700">
                  {side.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </article>
            ))}
          </section>

          <section className="rounded-xl bg-white p-5 shadow-md ring-1 ring-slate-200">
            <h2 className="text-lg font-bold text-slate-900">เส้นแบ่งขยับตามชนิดบริการ</h2>
            <p className="mt-1 text-sm text-slate-600">
              ยิ่งบริการเป็นแบบ managed มากเท่าไร AWS ยิ่งรับงานไปมากเท่านั้น แต่ข้อมูลกับสิทธิ์การเข้าถึงเป็นของลูกค้าเสมอ
            </p>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[600px] border-collapse">
                <caption className="sr-only">
                  ตารางแสดงว่าใครรับผิดชอบแต่ละชั้น แยกตามชนิดบริการ
                </caption>
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th
                      scope="col"
                      className="px-3 py-2.5 text-left text-xs font-bold uppercase tracking-wide text-slate-500"
                    >
                      ชั้นที่ต้องดูแล
                    </th>
                    {SERVICE_MODELS.map((model) => (
                      <th key={model.id} scope="col" className="px-3 py-2.5 text-left">
                        <span className="block text-sm font-bold text-slate-800">{model.label}</span>
                        <span className="block text-xs font-normal text-slate-500">
                          {model.example}
                        </span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {SERVICE_MODEL_ROWS.map((row) => (
                    <tr key={row.layer} className="border-b border-slate-100 last:border-0">
                      <th
                        scope="row"
                        className="px-3 py-2.5 text-left text-sm font-semibold text-slate-800"
                      >
                        {row.layer}
                      </th>
                      {SERVICE_MODELS.map((model) => (
                        <td key={model.id} className="px-3 py-2.5">
                          <OwnerBadge owner={row.owners[model.id]} />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="rounded-xl bg-white p-5 shadow-md ring-1 ring-slate-200">
            <h2 className="text-lg font-bold text-slate-900">ชนิดของ control ที่ต้องรู้จัก</h2>
            <ul className="mt-3 grid gap-2 md:grid-cols-3">
              {SRM_CONTROL_TYPES.map((control) => (
                <li key={control.name} className="rounded-lg bg-slate-50 p-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-bold text-slate-900">{control.name}</p>
                    <OwnerBadge owner={control.owner} />
                  </div>
                  <p className="mt-1 text-sm leading-relaxed text-slate-600">{control.detail}</p>
                </li>
              ))}
            </ul>

            <h3 className="mt-5 text-sm font-bold text-slate-800">
              Shared controls ทั้ง 3 ตัว แบ่งงานกันอย่างไร
            </h3>
            <div className="mt-2 overflow-x-auto">
              <table className="w-full min-w-[560px] border-collapse">
                <caption className="sr-only">
                  ตารางแบ่งงานของ shared controls ระหว่าง AWS กับลูกค้า
                </caption>
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th
                      scope="col"
                      className="px-3 py-2.5 text-left text-xs font-bold uppercase tracking-wide text-slate-500"
                    >
                      Control
                    </th>
                    <th scope="col" className="px-3 py-2.5 text-left">
                      <OwnerBadge owner="aws" />
                    </th>
                    <th scope="col" className="px-3 py-2.5 text-left">
                      <OwnerBadge owner="customer" />
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {SHARED_CONTROLS.map((control) => (
                    <tr key={control.name} className="border-b border-slate-100 last:border-0">
                      <th
                        scope="row"
                        className="px-3 py-2.5 text-left text-sm font-semibold text-slate-800"
                      >
                        {control.name}
                      </th>
                      <td className="px-3 py-2.5 text-sm text-slate-700">{control.aws}</td>
                      <td className="px-3 py-2.5 text-sm text-slate-700">{control.customer}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="rounded-xl bg-amber-50 p-5 ring-1 ring-amber-200">
            <h2 className="text-base font-bold text-amber-900">จุดที่มักออกสอบ</h2>
            <ul className="mt-2 flex list-disc flex-col gap-1.5 pl-5 text-sm leading-relaxed text-amber-900">
              {SRM_EXAM_TIPS.map((tip) => (
                <li key={tip}>{tip}</li>
              ))}
            </ul>
            <p className="mt-3 text-xs text-amber-800">
              ที่มา:{' '}
              {SRM_SOURCES.map((source, index) => (
                <span key={source.url}>
                  {index > 0 && ' · '}
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noreferrer"
                    className="font-semibold underline decoration-dotted hover:text-amber-950"
                  >
                    {source.label}
                  </a>
                </span>
              ))}
            </p>
          </section>
        </div>
      )}

      {tab === 'drill' && (
        <ConceptDrill
          title="เกมจำ: งานนี้ใครรับผิดชอบ"
          blurb="อ่านงานแล้วเลือกว่าเป็นของ AWS ลูกค้า หรือเป็น shared control ผลตรงนี้ไม่ถูกบันทึก ฝึกซ้ำได้ไม่จำกัด"
          options={drillOptions}
          items={drillItems}
          roundLength={10}
        />
      )}

      {tab === 'match' && (
        <DeckMatchGame
          groups={srmGroups}
          defaultPairCount={8}
          title="เกมจับคู่ Shared Responsibility"
        />
      )}

      <div className="rounded-xl bg-white p-5 text-center shadow-md ring-1 ring-slate-200">
        <p className="text-sm font-medium text-slate-700">
          พร้อมแล้วลองทำโจทย์หมวด Security &amp; Compliance
        </p>
        <div className="mt-3 flex flex-wrap justify-center gap-2">
          <Link
            to="/quiz"
            className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-orange-600"
          >
            ไปทำควิซ
          </Link>
          <Link
            to="/custom-match"
            className="rounded-lg bg-white px-4 py-2 text-sm font-bold text-indigo-700 ring-1 ring-indigo-200 transition-colors hover:bg-indigo-100"
          >
            เกมจับคู่แบบกำหนดเอง
          </Link>
        </div>
      </div>
    </div>
  )
}
