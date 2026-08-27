import { CATEGORY_LABELS_TH, CATEGORY_STYLES } from '../../data/awsServices'
import type { AWSService } from '../../types'

interface ServiceArticleProps {
  service: AWSService
  /** Study status pulled from saved progress, for a quick visual cue. */
  status: 'mastered' | 'reviewing' | 'untouched'
}

const STATUS_BADGE: Record<
  ServiceArticleProps['status'],
  { label: string; className: string } | null
> = {
  mastered: { label: '✓ จำได้แล้ว', className: 'bg-green-100 text-green-700' },
  reviewing: { label: '! ยังไม่แม่น', className: 'bg-red-100 text-red-700' },
  untouched: null,
}

/** One service presented as a short readable article. */
export function ServiceArticle({ service, status }: ServiceArticleProps) {
  const style = CATEGORY_STYLES[service.category]
  const badge = STATUS_BADGE[status]

  return (
    <article className="flex flex-col gap-3 rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
      <header className="flex flex-wrap items-start gap-x-3 gap-y-2">
        <div className="min-w-0 flex-1">
          <h3 className="text-xl font-bold leading-tight text-slate-900">{service.name}</h3>
          <p className="text-sm text-slate-500">{service.fullName}</p>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {badge !== null && (
            <span className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${badge.className}`}>
              {badge.label}
            </span>
          )}
          <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${style.badge}`}>
            {CATEGORY_LABELS_TH[service.category]}
          </span>
        </div>
      </header>

      <p className="border-l-4 border-slate-200 pl-3 text-[15px] font-medium leading-relaxed text-slate-700">
        {service.description}
      </p>

      <section>
        <h4 className="mb-1 text-[11px] font-bold uppercase tracking-wide text-indigo-600">
          หน้าที่หลัก
        </h4>
        <p className="text-[15px] leading-relaxed text-slate-700">{service.answer}</p>
      </section>

      <section className="rounded-lg bg-amber-50 p-3">
        <h4 className="mb-1 text-[11px] font-bold uppercase tracking-wide text-amber-700">
          เคล็ดลับจำ
        </h4>
        <p className="text-sm leading-relaxed text-amber-900">{service.hint}</p>
      </section>

      {service.examTips !== undefined && (
        <section className="rounded-lg bg-orange-50 p-3">
          <h4 className="mb-1 text-[11px] font-bold uppercase tracking-wide text-orange-700">
            จุดที่มักออกสอบ
          </h4>
          <p className="text-sm leading-relaxed text-orange-900">{service.examTips}</p>
        </section>
      )}
    </article>
  )
}
