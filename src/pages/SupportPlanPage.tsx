import { Link } from 'react-router-dom'
import { SupportPlanArticle } from '../components/learn/SupportPlanArticle'
import { SupportPlanComparison } from '../components/learn/SupportPlanComparison'
import {
  SUPPORT_PLAN_NOTICE,
  SUPPORT_PLAN_SOURCES,
  SUPPORT_PLAN_STYLES,
  supportPlanCues,
  supportPlans,
} from '../data/supportPlans'

/** Reading mode dedicated to the AWS Support plans, a Billing & Support topic. */
export function SupportPlanPage() {
  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">AWS Support Plans</h1>
        <p className="mt-1 text-sm text-slate-600">
          หมวด Billing &amp; Support ของ CLF-C02 ออกเรื่องแผน support แทบทุกชุดข้อสอบ
          หน้านี้รวมทั้ง 5 แผน เวลาตอบกลับตามความรุนแรงของเคส สิทธิ์ที่ต่างกัน
          และคำใบ้ในโจทย์ที่ชี้ไปยังแต่ละแผน
        </p>
      </div>

      <nav
        aria-label="ข้ามไปยังแผนที่ต้องการ"
        className="flex flex-wrap gap-2 rounded-xl bg-white p-4 shadow-md ring-1 ring-slate-200"
      >
        {supportPlans.map((plan) => (
          <a
            key={plan.id}
            href={`#plan-${plan.id}`}
            className={`rounded-full px-3 py-1.5 text-sm font-semibold transition-opacity hover:opacity-80 ${SUPPORT_PLAN_STYLES[plan.id].badge}`}
          >
            {plan.name}
          </a>
        ))}
      </nav>

      <SupportPlanComparison />

      <section className="rounded-xl bg-indigo-50 p-5 ring-1 ring-indigo-100">
        <h2 className="text-lg font-bold text-indigo-900">อ่านโจทย์แล้วตอบให้ไว</h2>
        <p className="mt-1 text-sm text-indigo-800">
          ข้อสอบมักไม่บอกชื่อแผนตรง ๆ แต่ใส่คำใบ้มาให้ ตารางนี้จับคู่คำใบ้กับคำตอบ
        </p>
        <ul className="mt-3 flex flex-col gap-2">
          {supportPlanCues.map((item) => (
            <li
              key={item.cue}
              className="flex flex-wrap items-baseline gap-x-2 gap-y-1 rounded-lg bg-white px-3 py-2 text-sm ring-1 ring-indigo-100"
            >
              <span className="text-slate-600">“{item.cue}”</span>
              <span aria-hidden="true" className="text-indigo-300">
                →
              </span>
              <strong className="font-bold text-indigo-700">{item.answer}</strong>
            </li>
          ))}
        </ul>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-bold text-slate-900">รายละเอียดแต่ละแผน</h2>
        <div className="grid gap-3 lg:grid-cols-2">
          {supportPlans.map((plan) => (
            <SupportPlanArticle key={plan.id} plan={plan} />
          ))}
        </div>
      </section>

      <section className="rounded-xl bg-amber-50 p-5 ring-1 ring-amber-200">
        <h2 className="text-base font-bold text-amber-900">
          ข่าวอัปเดตที่ยังไม่เข้าข้อสอบ
        </h2>
        <p className="mt-1 text-sm leading-relaxed text-amber-900">{SUPPORT_PLAN_NOTICE}</p>
        <p className="mt-3 text-xs text-amber-800">
          ที่มา:{' '}
          {SUPPORT_PLAN_SOURCES.map((source, index) => (
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

      <div className="rounded-xl bg-white p-5 text-center shadow-md ring-1 ring-slate-200">
        <p className="text-sm font-medium text-slate-700">
          อ่านจบแล้ว ลองทำโจทย์หมวดค่าใช้จ่ายและซัพพอร์ตดู
        </p>
        <div className="mt-3 flex flex-wrap justify-center gap-2">
          <Link
            to="/quiz"
            className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-orange-600"
          >
            ไปทำควิซ
          </Link>
          <Link
            to="/learn"
            className="rounded-lg bg-white px-4 py-2 text-sm font-bold text-indigo-700 ring-1 ring-indigo-200 transition-colors hover:bg-indigo-100"
          >
            กลับไปหน้าเรียนรู้
          </Link>
        </div>
      </div>
    </div>
  )
}
