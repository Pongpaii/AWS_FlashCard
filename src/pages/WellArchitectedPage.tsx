import { Link } from 'react-router-dom'
import { PillarArticle } from '../components/learn/PillarArticle'
import { PillarDrill } from '../components/learn/PillarDrill'
import {
  PILLAR_CONFUSIONS,
  PILLAR_MNEMONICS,
  PILLAR_STYLES,
  WA_SOURCES,
  WA_TOOL_FACTS,
  wellArchitectedPillars,
} from '../data/wellArchitected'

/** Reading + drilling mode for the AWS Well-Architected Framework. */
export function WellArchitectedPage() {
  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          AWS Well-Architected Framework
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          กรอบแนวคิดสำหรับออกแบบและทบทวนระบบบน AWS มี 6 pillar และรวมกัน{' '}
          {wellArchitectedPillars.reduce((sum, pillar) => sum + pillar.principles.length, 0)}{' '}
          design principles ข้อสอบ CLF-C02 มักให้สถานการณ์มาแล้วถามว่าเข้า pillar ไหน
          หน้านี้จึงมีทั้งตารางท่องจำ การ์ดอ่านละเอียด และแบบฝึกจับ pillar
        </p>
      </div>

      <section className="rounded-xl bg-white p-5 shadow-md ring-1 ring-slate-200">
        <h2 className="text-lg font-bold text-slate-900">6 pillar ตามลำดับที่ต้องจำ</h2>
        <ol className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {wellArchitectedPillars.map((pillar, index) => (
            <li key={pillar.id}>
              <a
                href={`#pillar-${pillar.id}`}
                className={`flex h-full items-start gap-3 rounded-lg p-3 ring-1 transition-colors hover:bg-white ${PILLAR_STYLES[pillar.id].soft} ${PILLAR_STYLES[pillar.id].ring}`}
              >
                <span
                  aria-hidden="true"
                  className={`grid h-7 w-7 shrink-0 place-items-center rounded-md text-xs font-bold ${PILLAR_STYLES[pillar.id].badge}`}
                >
                  {index + 1}
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-bold text-slate-900">{pillar.name}</span>
                  <span className="block text-xs text-slate-500">{pillar.nameTh}</span>
                  <span className={`mt-1 block text-xs font-semibold ${PILLAR_STYLES[pillar.id].text}`}>
                    {pillar.principles.length} design principles
                  </span>
                </span>
              </a>
            </li>
          ))}
        </ol>
      </section>

      <section className="rounded-xl bg-indigo-50 p-5 ring-1 ring-indigo-100">
        <h2 className="text-lg font-bold text-indigo-900">ตัวช่วยจำ</h2>
        <p className="mt-1 text-sm text-indigo-800">
          เลือกวิธีที่ถูกใจไปวิธีเดียวก็พอ แต่ต้องท่องได้ครบ 6 ตัวและถูกลำดับ
        </p>
        <dl className="mt-3 grid gap-2 sm:grid-cols-2">
          {PILLAR_MNEMONICS.map((item) => (
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

      <PillarDrill />

      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-bold text-slate-900">รายละเอียดแต่ละ pillar</h2>
        <div className="grid gap-3 lg:grid-cols-2">
          {wellArchitectedPillars.map((pillar, index) => (
            <PillarArticle key={pillar.id} pillar={pillar} order={index + 1} />
          ))}
        </div>
      </section>

      <section className="rounded-xl bg-white p-5 shadow-md ring-1 ring-slate-200">
        <h2 className="text-lg font-bold text-slate-900">คู่ที่มักสับสน แยกให้ออก</h2>
        <p className="mt-1 text-sm text-slate-600">
          โจทย์ส่วนใหญ่ไม่ได้ยากเพราะไม่รู้จัก pillar แต่ยากเพราะสอง pillar ดูใช้ได้ทั้งคู่
        </p>
        <ul className="mt-3 flex flex-col gap-2">
          {PILLAR_CONFUSIONS.map((item) => (
            <li key={item.pair} className="rounded-lg bg-slate-50 p-3">
              <p className="text-sm font-bold text-slate-800">{item.pair}</p>
              <p className="mt-0.5 text-sm leading-relaxed text-slate-600">{item.rule}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-xl bg-white p-5 shadow-md ring-1 ring-slate-200">
        <h2 className="text-lg font-bold text-slate-900">
          AWS Well-Architected Tool และ Lens
        </h2>
        <ul className="mt-3 flex list-disc flex-col gap-1.5 pl-5 text-sm leading-relaxed text-slate-700">
          {WA_TOOL_FACTS.map((fact) => (
            <li key={fact}>{fact}</li>
          ))}
        </ul>
        <p className="mt-4 text-xs text-slate-400">
          ที่มา:{' '}
          {WA_SOURCES.map((source, index) => (
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
          จำ pillar ได้แล้ว ลองเจอในโจทย์จริงดู
        </p>
        <div className="mt-3 flex flex-wrap justify-center gap-2">
          <Link
            to="/custom-match"
            className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-orange-600"
          >
            เล่นเกมจับคู่ pillar
          </Link>
          <Link
            to="/caf"
            className="rounded-lg bg-white px-4 py-2 text-sm font-bold text-indigo-700 ring-1 ring-indigo-200 transition-colors hover:bg-indigo-50"
          >
            ต่อด้วย CAF
          </Link>
          <Link
            to="/quiz"
            className="rounded-lg bg-white px-4 py-2 text-sm font-bold text-slate-700 ring-1 ring-slate-200 transition-colors hover:bg-slate-100"
          >
            ไปทำควิซ
          </Link>
          <Link
            to="/support"
            className="rounded-lg bg-white px-4 py-2 text-sm font-bold text-amber-700 ring-1 ring-amber-200 transition-colors hover:bg-amber-50"
          >
            อ่าน Support Plans
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
