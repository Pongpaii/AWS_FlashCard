import { SEVERITY_LABELS_TH, SUPPORT_PLAN_STYLES } from '../../data/supportPlans'
import type { SupportPlan } from '../../types'
import { SUPPORT_SEVERITIES } from '../../types'

interface SupportPlanArticleProps {
  plan: SupportPlan
}

/** One support plan written out as a readable study note. */
export function SupportPlanArticle({ plan }: SupportPlanArticleProps) {
  const style = SUPPORT_PLAN_STYLES[plan.id]
  const covered = SUPPORT_SEVERITIES.filter((severity) => plan.responseTimes[severity] !== null)

  return (
    <article
      id={`plan-${plan.id}`}
      className={`flex flex-col gap-3 rounded-xl bg-white p-5 shadow-sm ring-1 ${style.ring}`}
    >
      <header className="flex flex-wrap items-start gap-x-3 gap-y-2">
        <div className="min-w-0 flex-1">
          <h3 className="text-xl font-bold leading-tight text-slate-900">{plan.name}</h3>
          <p className="text-sm text-slate-500">{plan.fullName}</p>
        </div>
        <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${style.badge}`}>
          {plan.id === 'basic' ? 'ฟรี' : 'มีค่าใช้จ่าย'}
        </span>
      </header>

      <p className="border-l-4 border-slate-200 pl-3 text-[15px] font-medium leading-relaxed text-slate-700">
        {plan.tagline}
      </p>

      <dl className="grid gap-3 sm:grid-cols-2">
        <div>
          <dt className="text-[11px] font-bold uppercase tracking-wide text-indigo-600">ราคา</dt>
          <dd className="mt-0.5 text-sm leading-relaxed text-slate-700">{plan.price}</dd>
        </div>
        <div>
          <dt className="text-[11px] font-bold uppercase tracking-wide text-indigo-600">
            ช่องทางติดต่อ
          </dt>
          <dd className="mt-0.5 text-sm leading-relaxed text-slate-700">{plan.channels}</dd>
        </div>
        <div>
          <dt className="text-[11px] font-bold uppercase tracking-wide text-indigo-600">
            Trusted Advisor
          </dt>
          <dd className="mt-0.5 text-sm leading-relaxed text-slate-700">{plan.trustedAdvisor}</dd>
        </div>
        <div>
          <dt className="text-[11px] font-bold uppercase tracking-wide text-indigo-600">
            Technical Account Manager
          </dt>
          <dd className="mt-0.5 text-sm leading-relaxed text-slate-700">{plan.tam}</dd>
        </div>
      </dl>

      <section className={`rounded-lg p-3 ${style.soft}`}>
        <h4 className={`mb-1 text-[11px] font-bold uppercase tracking-wide ${style.text}`}>
          เวลาตอบกลับที่ครอบคลุม
        </h4>
        {covered.length === 0 ? (
          <p className="text-sm leading-relaxed text-slate-600">
            ไม่มีการรับประกันเวลาตอบกลับ เพราะเปิดเคสทางเทคนิคไม่ได้
          </p>
        ) : (
          <ul className="flex flex-col gap-0.5 text-sm text-slate-700">
            {covered.map((severity) => (
              <li key={severity}>
                {SEVERITY_LABELS_TH[severity].label}:{' '}
                <strong className="font-semibold">{plan.responseTimes[severity]}</strong>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h4 className="mb-1 text-[11px] font-bold uppercase tracking-wide text-slate-500">
          จุดที่ควรจำ
        </h4>
        <ul className="flex list-disc flex-col gap-1 pl-5 text-sm leading-relaxed text-slate-700">
          {plan.highlights.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="rounded-lg bg-amber-50 p-3">
        <h4 className="mb-1 text-[11px] font-bold uppercase tracking-wide text-amber-700">
          เหมาะกับใคร
        </h4>
        <p className="text-sm leading-relaxed text-amber-900">{plan.bestFor}</p>
      </section>

      <section className="rounded-lg bg-orange-50 p-3">
        <h4 className="mb-1 text-[11px] font-bold uppercase tracking-wide text-orange-700">
          จุดที่มักออกสอบ
        </h4>
        <p className="text-sm leading-relaxed text-orange-900">{plan.examTips}</p>
      </section>
    </article>
  )
}
