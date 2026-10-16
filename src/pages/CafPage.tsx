import { Link } from 'react-router-dom'
import { ConceptDrill } from '../components/learn/ConceptDrill'
import {
  CAF_MNEMONICS,
  CAF_SOURCES,
  CAF_STYLES,
  CAF_VS_WAF,
  cafDomains,
  cafDrillItems,
  cafPerspectives,
  cafPhases,
} from '../data/cloudAdoptionFramework'

/** Reading + drilling mode for the AWS Cloud Adoption Framework. */
export function CafPage() {
  const drillOptions = cafPerspectives.map((perspective) => ({
    id: perspective.id,
    label: perspective.name,
    sublabel: perspective.nameTh,
    dot: CAF_STYLES[perspective.id]?.dot ?? 'bg-slate-400',
  }))

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          AWS Cloud Adoption Framework
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          CAF คือกรอบสำหรับวางแผนพาองค์กรขึ้นคลาวด์ ไม่ใช่กรอบออกแบบระบบ ตัวเลขที่ต้องจำคือ 6
          perspectives, 4 transformation domains และ 4 transformation phases
        </p>
      </div>

      <section className="rounded-xl bg-indigo-50 p-5 ring-1 ring-indigo-100">
        <h2 className="text-lg font-bold text-indigo-900">ตัวช่วยจำ</h2>
        <dl className="mt-3 grid gap-2 sm:grid-cols-2">
          {CAF_MNEMONICS.map((item) => (
            <div key={item.label} className="rounded-lg bg-white p-3 ring-1 ring-indigo-100">
              <dt className="text-[11px] font-bold uppercase tracking-wide text-indigo-600">
                {item.label}
              </dt>
              <dd className="mt-1 text-base font-bold text-slate-900">{item.value}</dd>
              <dd className="mt-1 text-xs leading-relaxed text-slate-500">{item.note}</dd>
            </div>
          ))}
        </dl>
      </section>

      <ConceptDrill
        title="ฝึกจับ perspective ให้ไว"
        blurb="อ่านสถานการณ์แล้วเลือกว่าอยู่ perspective ไหน ผลตรงนี้ไม่ถูกบันทึก ฝึกซ้ำได้ไม่จำกัด"
        options={drillOptions}
        items={cafDrillItems}
      />

      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-bold text-slate-900">6 perspectives</h2>
        <div className="grid gap-3 lg:grid-cols-2">
          {cafPerspectives.map((perspective, index) => {
            const style = CAF_STYLES[perspective.id]
            return (
              <article
                key={perspective.id}
                id={`caf-${perspective.id}`}
                className={`flex flex-col gap-3 rounded-xl bg-white p-5 shadow-sm ring-1 ${style?.ring ?? 'ring-slate-200'}`}
              >
                <header className="flex flex-wrap items-start gap-x-3 gap-y-2">
                  <span
                    aria-hidden="true"
                    className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg text-sm font-bold ${style?.badge ?? 'bg-slate-500 text-white'}`}
                  >
                    {index + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-xl font-bold leading-tight text-slate-900">
                      {perspective.name}
                    </h3>
                    <p className="text-sm text-slate-500">{perspective.nameTh}</p>
                  </div>
                </header>

                <p className="border-l-4 border-slate-200 pl-3 text-[15px] font-medium leading-relaxed text-slate-700">
                  {perspective.focus}
                </p>

                <p className="text-[15px] leading-relaxed text-slate-700">
                  {perspective.definition}
                </p>

                <section>
                  <h4 className="mb-1.5 text-[11px] font-bold uppercase tracking-wide text-slate-500">
                    ตัวอย่าง capabilities
                  </h4>
                  <ul className="flex flex-col gap-1.5">
                    {perspective.capabilities.map((capability) => (
                      <li
                        key={capability.name}
                        className={`rounded-lg p-2.5 ${style?.soft ?? 'bg-slate-50'}`}
                      >
                        <p className={`text-sm font-bold ${style?.text ?? 'text-slate-700'}`}>
                          {capability.name}
                        </p>
                        <p className="mt-0.5 text-sm leading-relaxed text-slate-600">
                          {capability.th}
                        </p>
                      </li>
                    ))}
                  </ul>
                </section>

                <section>
                  <h4 className="mb-1.5 text-[11px] font-bold uppercase tracking-wide text-slate-500">
                    ผู้มีส่วนได้ส่วนเสียหลัก
                  </h4>
                  <ul className="flex flex-wrap gap-1.5">
                    {perspective.stakeholders.map((stakeholder) => (
                      <li
                        key={stakeholder}
                        className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700"
                      >
                        {stakeholder}
                      </li>
                    ))}
                  </ul>
                </section>

                <section className="rounded-lg bg-orange-50 p-3">
                  <h4 className="mb-1 text-[11px] font-bold uppercase tracking-wide text-orange-700">
                    จุดที่มักออกสอบ
                  </h4>
                  <p className="text-sm leading-relaxed text-orange-900">{perspective.examTips}</p>
                </section>
              </article>
            )
          })}
        </div>
      </section>

      <section className="rounded-xl bg-white p-5 shadow-md ring-1 ring-slate-200">
        <h2 className="text-lg font-bold text-slate-900">4 transformation phases</h2>
        <p className="mt-1 text-sm text-slate-600">
          ลำดับสำคัญ ข้อสอบชอบถามว่าเฟสไหนทำอะไร หรือเฟสไหนมาก่อนหลัง
        </p>
        <ol className="mt-3 grid gap-2 sm:grid-cols-2">
          {cafPhases.map((phase, index) => (
            <li key={phase.id} className="rounded-lg bg-slate-50 p-3">
              <p className="text-sm font-bold text-slate-900">
                <span className="tabular-nums text-slate-400">{index + 1}. </span>
                {phase.name}
                <span className="ml-2 text-xs font-normal text-slate-500">{phase.nameTh}</span>
              </p>
              <p className="mt-1 text-sm leading-relaxed text-slate-600">{phase.description}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="rounded-xl bg-white p-5 shadow-md ring-1 ring-slate-200">
        <h2 className="text-lg font-bold text-slate-900">4 transformation domains</h2>
        <p className="mt-1 text-sm text-slate-600">
          เรียงเป็นห่วงโซ่คุณค่า: Technology → Process → Organization → Product
          แต่ละขั้นเปิดทางให้ขั้นถัดไป
        </p>
        <ol className="mt-3 grid gap-2 sm:grid-cols-2">
          {cafDomains.map((domain, index) => (
            <li key={domain.id} className="rounded-lg bg-slate-50 p-3">
              <p className="text-sm font-bold text-slate-900">
                <span className="tabular-nums text-slate-400">{index + 1}. </span>
                {domain.name}
                <span className="ml-2 text-xs font-normal text-slate-500">{domain.nameTh}</span>
              </p>
              <p className="mt-1 text-sm leading-relaxed text-slate-600">{domain.description}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="rounded-xl bg-white p-5 shadow-md ring-1 ring-slate-200">
        <h2 className="text-lg font-bold text-slate-900">CAF ต่างจาก Well-Architected อย่างไร</h2>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[560px] border-collapse">
            <caption className="sr-only">
              ตารางเปรียบเทียบ AWS Cloud Adoption Framework กับ AWS Well-Architected Framework
            </caption>
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th
                  scope="col"
                  className="px-3 py-2.5 text-left text-xs font-bold uppercase tracking-wide text-slate-500"
                >
                  ประเด็น
                </th>
                <th scope="col" className="px-3 py-2.5 text-left">
                  <span className="inline-block rounded-full bg-indigo-600 px-2.5 py-0.5 text-[11px] font-bold text-white">
                    CAF
                  </span>
                </th>
                <th scope="col" className="px-3 py-2.5 text-left">
                  <span className="inline-block rounded-full bg-purple-600 px-2.5 py-0.5 text-[11px] font-bold text-white">
                    Well-Architected
                  </span>
                </th>
              </tr>
            </thead>
            <tbody>
              {CAF_VS_WAF.map((row) => (
                <tr key={row.aspect} className="border-b border-slate-100 last:border-0">
                  <th
                    scope="row"
                    className="px-3 py-2.5 text-left text-sm font-semibold text-slate-800"
                  >
                    {row.aspect}
                  </th>
                  <td className="px-3 py-2.5 text-sm text-slate-700">{row.caf}</td>
                  <td className="px-3 py-2.5 text-sm text-slate-700">{row.waf}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-xs text-slate-400">
          ที่มา:{' '}
          {CAF_SOURCES.map((source, index) => (
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

      <div className="rounded-xl bg-white p-5 text-center shadow-md ring-1 ring-slate-200">
        <p className="text-sm font-medium text-slate-700">
          อ่านจบแล้วลองเล่นเกมจับคู่ CAF เพื่อวัดว่าจำได้จริง
        </p>
        <div className="mt-3 flex flex-wrap justify-center gap-2">
          <Link
            to="/custom-match"
            className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-orange-600"
          >
            เกมจับคู่แบบกำหนดเอง
          </Link>
          <Link
            to="/well-architected"
            className="rounded-lg bg-white px-4 py-2 text-sm font-bold text-purple-700 ring-1 ring-purple-200 transition-colors hover:bg-purple-50"
          >
            Well-Architected
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
