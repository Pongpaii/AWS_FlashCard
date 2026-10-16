import { serviceById } from '../../data/awsServices'
import { PILLAR_STYLES } from '../../data/wellArchitected'
import type { WellArchitectedPillar } from '../../types'

interface PillarArticleProps {
  pillar: WellArchitectedPillar
  /** 1-based position, shown so the published order is easy to memorise. */
  order: number
}

/** One Well-Architected pillar written out as a readable study note. */
export function PillarArticle({ pillar, order }: PillarArticleProps) {
  const style = PILLAR_STYLES[pillar.id]

  return (
    <article
      id={`pillar-${pillar.id}`}
      className={`flex flex-col gap-3 rounded-xl bg-white p-5 shadow-sm ring-1 ${style.ring}`}
    >
      <header className="flex flex-wrap items-start gap-x-3 gap-y-2">
        <span
          aria-hidden="true"
          className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg text-sm font-bold ${style.badge}`}
        >
          {order}
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="text-xl font-bold leading-tight text-slate-900">{pillar.name}</h3>
          <p className="text-sm text-slate-500">{pillar.nameTh}</p>
        </div>
        <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${style.badge}`}>
          {pillar.principles.length} design principles
        </span>
      </header>

      <p className="border-l-4 border-slate-200 pl-3 text-[15px] font-medium leading-relaxed text-slate-700">
        {pillar.focus}
      </p>

      <section>
        <h4 className="mb-1 text-[11px] font-bold uppercase tracking-wide text-indigo-600">
          นิยาม
        </h4>
        <p className="text-[15px] leading-relaxed text-slate-700">{pillar.definition}</p>
      </section>

      <section>
        <h4 className="mb-1.5 text-[11px] font-bold uppercase tracking-wide text-indigo-600">
          Design principles
        </h4>
        <ol className="flex flex-col gap-2">
          {pillar.principles.map((principle, index) => (
            <li key={principle.en} className={`rounded-lg p-2.5 ${style.soft}`}>
              <p className={`text-sm font-bold ${style.text}`}>
                <span className="tabular-nums opacity-60">{index + 1}. </span>
                {principle.en}
              </p>
              <p className="mt-0.5 text-sm leading-relaxed text-slate-600">{principle.th}</p>
            </li>
          ))}
        </ol>
      </section>

      <section>
        <h4 className="mb-1.5 text-[11px] font-bold uppercase tracking-wide text-slate-500">
          คำใบ้ในโจทย์ที่ชี้มาที่ pillar นี้
        </h4>
        <ul className="flex flex-wrap gap-1.5">
          {pillar.keywords.map((keyword) => (
            <li
              key={keyword}
              className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700"
            >
              {keyword}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h4 className="mb-1.5 text-[11px] font-bold uppercase tracking-wide text-slate-500">
          บริการที่มักมาคู่กัน
        </h4>
        <ul className="flex flex-wrap gap-1.5">
          {pillar.services.map((id) => {
            const service = serviceById.get(id)
            if (service === undefined) return null
            return (
              <li
                key={id}
                title={service.fullName}
                className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 ring-1 ring-slate-200"
              >
                {service.name}
              </li>
            )
          })}
        </ul>
      </section>

      <section className="rounded-lg bg-orange-50 p-3">
        <h4 className="mb-1 text-[11px] font-bold uppercase tracking-wide text-orange-700">
          จุดที่มักออกสอบ
        </h4>
        <p className="text-sm leading-relaxed text-orange-900">{pillar.examTips}</p>
      </section>
    </article>
  )
}
