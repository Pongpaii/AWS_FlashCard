import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ConceptDrill } from '../components/learn/ConceptDrill'
import { DeckMatchGame } from '../components/match/DeckMatchGame'
import { matchDecks } from '../data/matchDecks'
import {
  COMPUTE_MODEL_ROWS,
  DATA_TRANSFER_RULES,
  FREE_TIER_TYPES,
  PRICING_DRILL_OPTIONS,
  PRICING_FUNDAMENTALS,
  PRICING_NUMBERS,
  PRICING_SOURCES,
  pricingDrillItems,
  pricingToolPairs,
} from '../data/pricingTerms'
import type { ConceptDrillItem } from '../types'

type PricingTab = 'learn' | 'numbers' | 'drill' | 'match'

const TABS: { id: PricingTab; label: string; blurb: string }[] = [
  { id: 'learn', label: 'เรียนรู้', blurb: 'หลักคิดเรื่องราคา ตารางเทียบ และกฎที่ต้องจำ' },
  { id: 'numbers', label: 'ตัวเลขที่ต้องจำ', blurb: 'ตัวเลขที่ข้อสอบถามตรง ๆ' },
  { id: 'drill', label: 'ทายเร็ว', blurb: 'อ่านโจทย์แล้วเลือกรูปแบบราคาที่ถูก' },
  { id: 'match', label: 'จับคู่', blurb: 'เกมจับคู่ศัพท์เรื่องราคา' },
]

const pricingGroups = matchDecks.find((deck) => deck.id === 'pricing')?.groups ?? []

/** Pricing study hub: reference, numbers, a recall drill, and a match game. */
export function PricingPage() {
  const [tab, setTab] = useState<PricingTab>('learn')
  const activeTab = TABS.find((item) => item.id === tab)

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Pricing &amp; Billing</h1>
        <p className="mt-1 text-sm text-slate-600">
          หมวดค่าใช้จ่ายเป็นหมวดที่ทำคะแนนง่ายที่สุดถ้าจำกฎได้ เพราะโจทย์มักถามตรง ๆ ว่าอะไรฟรี
          อะไรคิดเงิน และรูปแบบราคาไหนเหมาะกับสถานการณ์
        </p>
      </div>

      <div
        role="tablist"
        aria-label="โหมดการเรียนเรื่องราคา"
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
                  ? 'bg-emerald-600 text-white'
                  : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-100',
              ].join(' ')}
            >
              {item.label}
            </button>
          )
        })}
        {activeTab !== undefined && (
          <p className="w-full px-1 text-xs text-slate-500">{activeTab.blurb}</p>
        )}
      </div>

      {tab === 'learn' && (
        <div className="flex flex-col gap-5">
          <section className="rounded-xl bg-white p-5 shadow-md ring-1 ring-slate-200">
            <h2 className="text-lg font-bold text-slate-900">3 วิธีที่คลาวด์ช่วยประหยัด</h2>
            <p className="mt-1 text-sm text-slate-600">
              ข้อสอบชอบยกวลีเหล่านี้มาตรง ๆ จำเป็นชุดสามข้อไว้
            </p>
            <dl className="mt-4 grid gap-3 sm:grid-cols-3">
              {PRICING_FUNDAMENTALS.map((item) => (
                <div key={item.en} className="rounded-lg bg-emerald-50 p-4">
                  <dt className="text-sm font-bold text-emerald-900">{item.title}</dt>
                  <dd className="mt-0.5 text-xs font-semibold uppercase tracking-wide text-emerald-600">
                    {item.en}
                  </dd>
                  <dd className="mt-2 text-sm leading-relaxed text-slate-700">{item.detail}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section className="rounded-xl bg-white p-5 shadow-md ring-1 ring-slate-200">
            <h2 className="text-lg font-bold text-slate-900">เทียบรูปแบบการซื้อ compute</h2>
            <p className="mt-1 text-sm text-slate-600">
              จุดตัดสินมี 2 อย่างเท่านั้น: โหลดคงที่หรือไม่ และทนการขัดจังหวะได้หรือไม่
            </p>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[720px] border-collapse">
                <caption className="sr-only">
                  ตารางเปรียบเทียบรูปแบบการซื้อกำลังประมวลผลของ AWS
                </caption>
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    {['รูปแบบ', 'ข้อผูกพัน', 'ส่วนลด', 'การขัดจังหวะ', 'เหมาะกับ'].map((head) => (
                      <th
                        key={head}
                        scope="col"
                        className="px-3 py-2.5 text-left text-xs font-bold uppercase tracking-wide text-slate-500"
                      >
                        {head}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {COMPUTE_MODEL_ROWS.map((row) => (
                    <tr key={row.model} className="border-b border-slate-100 last:border-0">
                      <th
                        scope="row"
                        className="px-3 py-2.5 text-left text-sm font-bold text-slate-800"
                      >
                        {row.model}
                      </th>
                      <td className="px-3 py-2.5 text-sm text-slate-700">{row.commitment}</td>
                      <td className="px-3 py-2.5 text-sm font-semibold text-emerald-700">
                        {row.discount}
                      </td>
                      <td className="px-3 py-2.5 text-sm text-slate-700">{row.interruption}</td>
                      <td className="px-3 py-2.5 text-sm text-slate-700">{row.bestFor}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="rounded-xl bg-white p-5 shadow-md ring-1 ring-slate-200">
            <h2 className="text-lg font-bold text-slate-900">Free Tier มี 3 แบบ</h2>
            <p className="mt-1 text-sm text-slate-600">
              ข้อสอบชอบถามว่าโควตาที่ยกมาเป็นแบบหมดอายุหรือแบบฟรีตลอด
            </p>
            <ul className="mt-4 grid gap-3 sm:grid-cols-3">
              {FREE_TIER_TYPES.map((type) => (
                <li key={type.name} className="rounded-lg bg-slate-50 p-4">
                  <p className="text-sm font-bold text-slate-900">{type.name}</p>
                  <p className="mt-1 text-sm leading-relaxed text-slate-600">{type.rule}</p>
                  <p className="mt-2 text-xs leading-relaxed text-slate-500">{type.examples}</p>
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-xl bg-white p-5 shadow-md ring-1 ring-slate-200">
            <h2 className="text-lg font-bold text-slate-900">อะไรฟรี อะไรคิดเงิน</h2>
            <p className="mt-1 text-sm text-slate-600">
              กฎเดียวที่ต้องจำให้แม่น: ข้อมูลเข้าฟรี ข้อมูลออกคิดเงิน
            </p>
            <ul className="mt-4 flex flex-col gap-2">
              {DATA_TRANSFER_RULES.map((rule) => (
                <li
                  key={rule.item}
                  className={`flex flex-wrap items-baseline gap-x-3 gap-y-1 rounded-lg p-3 ring-1 ${
                    rule.charged ? 'bg-red-50 ring-red-100' : 'bg-emerald-50 ring-emerald-100'
                  }`}
                >
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                      rule.charged ? 'bg-red-500 text-white' : 'bg-emerald-500 text-white'
                    }`}
                  >
                    {rule.charged ? 'คิดเงิน' : 'ฟรี'}
                  </span>
                  <span className="text-sm font-semibold text-slate-800">{rule.item}</span>
                  <span className="text-sm text-slate-600">{rule.note}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-xl bg-white p-5 shadow-md ring-1 ring-slate-200">
            <h2 className="text-lg font-bold text-slate-900">เครื่องมือด้านค่าใช้จ่าย</h2>
            <p className="mt-1 text-sm text-slate-600">
              แยกให้ออกว่าตัวไหนดูอนาคต ตัวไหนดูอดีต และตัวไหนคอยเตือน
            </p>
            <dl className="mt-4 grid gap-2 sm:grid-cols-2">
              {pricingToolPairs.map((tool) => (
                <div key={tool.pairId} className="rounded-lg bg-slate-50 p-3">
                  <dt className="text-sm font-bold text-slate-800">{tool.term}</dt>
                  <dd className="mt-0.5 text-sm leading-relaxed text-slate-600">{tool.meaning}</dd>
                </div>
              ))}
            </dl>
          </section>
        </div>
      )}

      {tab === 'numbers' && (
        <div className="flex flex-col gap-5">
          <section className="rounded-xl bg-white p-5 shadow-md ring-1 ring-slate-200">
            <h2 className="text-lg font-bold text-slate-900">ตัวเลขที่ข้อสอบถามตรง ๆ</h2>
            <p className="mt-1 text-sm text-slate-600">
              ท่องแค่ชุดนี้ก็ตอบข้อที่ถามตัวเลขได้เกือบทั้งหมด
            </p>
            <dl className="mt-4 grid gap-2 sm:grid-cols-2">
              {PRICING_NUMBERS.map((item) => (
                <div
                  key={item.label}
                  className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1 rounded-lg bg-emerald-50 px-4 py-3"
                >
                  <dt className="text-sm text-slate-700">{item.label}</dt>
                  <dd className="text-base font-bold tabular-nums text-emerald-700">
                    {item.value}
                  </dd>
                </div>
              ))}
            </dl>
            <p className="mt-4 text-xs text-slate-400">
              ที่มา:{' '}
              {PRICING_SOURCES.map((source, index) => (
                <span key={source.url}>
                  {index > 0 && ' · '}
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noreferrer"
                    className="font-semibold underline decoration-dotted hover:text-slate-600"
                  >
                    {source.label}
                  </a>
                </span>
              ))}
            </p>
          </section>

          <section className="rounded-xl bg-amber-50 p-5 ring-1 ring-amber-200">
            <h2 className="text-base font-bold text-amber-900">กับดักที่เจอบ่อย</h2>
            <ul className="mt-2 flex list-disc flex-col gap-1.5 pl-5 text-sm leading-relaxed text-amber-900">
              <li>
                Reserved Instances ใช้กับ Fargate และ Lambda ไม่ได้ ถ้าโจทย์เอ่ยถึงสองตัวนี้ให้เลือก
                Savings Plans
              </li>
              <li>EBS คิดตามขนาดที่ provision ไว้ ปิดเครื่องแล้ว volume ยังคิดเงินต่อ</li>
              <li>
                ค่าแผน support คิดจากค่าขั้นต่ำรายเดือนหรือเปอร์เซ็นต์ของค่าใช้จ่าย แล้วแต่ค่าใดสูงกว่า
                ไม่ใช่บวกกัน
              </li>
              <li>Free Tier แบบ 12 เดือนนับจากวันเปิดบัญชี ไม่ใช่นับจากวันที่เริ่มใช้บริการนั้น</li>
              <li>
                Pricing Calculator ใช้ประมาณราคาก่อนสร้าง ส่วน Cost Explorer ดูของที่ใช้ไปแล้ว
                อย่าสลับกัน
              </li>
            </ul>
          </section>
        </div>
      )}

      {tab === 'drill' && (
        <ConceptDrill
          title="ทายรูปแบบราคาให้ไว"
          blurb="อ่านสถานการณ์แล้วเลือกรูปแบบราคาที่เหมาะที่สุด ผลตรงนี้ไม่ถูกบันทึก ฝึกซ้ำได้ไม่จำกัด"
          options={PRICING_DRILL_OPTIONS}
          items={pricingDrillItems as ConceptDrillItem[]}
        />
      )}

      {tab === 'match' && <DeckMatchGame groups={pricingGroups} defaultPairCount={6} />}

      <div className="rounded-xl bg-white p-5 text-center shadow-md ring-1 ring-slate-200">
        <p className="text-sm font-medium text-slate-700">อยากผสมเรื่องราคากับเรื่องอื่นในเกมเดียว</p>
        <div className="mt-3 flex flex-wrap justify-center gap-2">
          <Link
            to="/custom-match"
            className="rounded-lg bg-white px-4 py-2 text-sm font-bold text-rose-700 ring-1 ring-rose-200 transition-colors hover:bg-rose-50"
          >
            จับคู่กำหนดเอง
          </Link>
          <Link
            to="/support"
            className="rounded-lg bg-white px-4 py-2 text-sm font-bold text-amber-700 ring-1 ring-amber-200 transition-colors hover:bg-amber-50"
          >
            Support Plans
          </Link>
          <Link
            to="/quiz"
            className="rounded-lg bg-white px-4 py-2 text-sm font-bold text-indigo-700 ring-1 ring-indigo-200 transition-colors hover:bg-indigo-100"
          >
            ไปทำควิซ
          </Link>
        </div>
      </div>
    </div>
  )
}
