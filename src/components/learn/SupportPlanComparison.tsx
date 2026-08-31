import {
  SEVERITY_LABELS_TH,
  SUPPORT_PLAN_STYLES,
  supportFeatureRows,
  supportPlans,
} from '../../data/supportPlans'
import { SUPPORT_SEVERITIES } from '../../types'

/** Shared cell paddings so both tables line up visually. */
const CELL = 'px-3 py-2.5 text-sm'
const HEAD_CELL = 'px-3 py-2.5 text-left text-xs font-bold uppercase tracking-wide text-slate-500'

/** Column headers: one per support plan, coloured by tier. */
function PlanHeaderRow({ firstLabel }: { firstLabel: string }) {
  return (
    <tr className="border-b border-slate-200 bg-slate-50">
      <th scope="col" className={`${HEAD_CELL} sticky left-0 bg-slate-50`}>
        {firstLabel}
      </th>
      {supportPlans.map((plan) => (
        <th key={plan.id} scope="col" className="px-3 py-2.5 text-left">
          <span
            className={`inline-block rounded-full px-2.5 py-0.5 text-[11px] font-bold ${SUPPORT_PLAN_STYLES[plan.id].badge}`}
          >
            {plan.name}
          </span>
        </th>
      ))}
    </tr>
  )
}

/** Renders `true` / `false` / detail strings consistently. */
function FeatureValue({ value }: { value: string | boolean }) {
  if (value === true) {
    return (
      <span className="font-bold text-emerald-600">
        <span aria-hidden="true">✓ </span>มี
      </span>
    )
  }
  if (value === false) {
    return (
      <span className="text-slate-400">
        <span aria-hidden="true">✕ </span>ไม่มี
      </span>
    )
  }
  return <span className="text-slate-700">{value}</span>
}

/**
 * The two tables the exam questions are built from: response time per case
 * severity, and the feature matrix. Both scroll horizontally on small screens.
 */
export function SupportPlanComparison() {
  return (
    <div className="flex flex-col gap-6">
      <section className="rounded-xl bg-white p-5 shadow-md ring-1 ring-slate-200">
        <h2 className="text-lg font-bold text-slate-900">เวลาตอบกลับตามระดับความรุนแรง</h2>
        <p className="mt-1 text-sm text-slate-600">
          ตัวเลขชุดนี้คือหัวใจของคำถามเรื่อง support plan เกือบทุกข้อ จำแค่ 2 ตัวก็ได้แต้มไปเยอะ:
          production ล่ม = 1 ชั่วโมง (Business ขึ้นไป) และระบบวิกฤตล่ม = 30 นาที (On-Ramp) กับ 15
          นาที (Enterprise)
        </p>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse">
            <caption className="sr-only">
              ตารางเปรียบเทียบเวลาตอบกลับของแผน AWS Support แต่ละระดับ แยกตามความรุนแรงของเคส
            </caption>
            <thead>
              <PlanHeaderRow firstLabel="ระดับความรุนแรง" />
            </thead>
            <tbody>
              {SUPPORT_SEVERITIES.map((severity) => (
                <tr key={severity} className="border-b border-slate-100 last:border-0">
                  <th
                    scope="row"
                    className={`${CELL} sticky left-0 bg-white text-left font-semibold text-slate-800`}
                  >
                    {SEVERITY_LABELS_TH[severity].label}
                    <span className="mt-0.5 block text-xs font-normal text-slate-400">
                      {SEVERITY_LABELS_TH[severity].example}
                    </span>
                  </th>
                  {supportPlans.map((plan) => {
                    const value = plan.responseTimes[severity]
                    return (
                      <td key={plan.id} className={CELL}>
                        {value === null ? (
                          <span className="text-slate-400">
                            <span aria-hidden="true">✕ </span>ไม่ครอบคลุม
                          </span>
                        ) : (
                          <span className="font-semibold text-slate-800">{value}</span>
                        )}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-xl bg-white p-5 shadow-md ring-1 ring-slate-200">
        <h2 className="text-lg font-bold text-slate-900">สิ่งที่ได้ในแต่ละแผน</h2>
        <p className="mt-1 text-sm text-slate-600">
          เส้นแบ่งที่ออกสอบบ่อยที่สุดมี 2 เส้น: Trusted Advisor ครบทุก check เริ่มที่ Business และ
          Technical Account Manager เริ่มที่ Enterprise On-Ramp
        </p>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse">
            <caption className="sr-only">
              ตารางเปรียบเทียบสิทธิ์และฟีเจอร์ของแผน AWS Support แต่ละระดับ
            </caption>
            <thead>
              <PlanHeaderRow firstLabel="สิทธิ์ที่ได้" />
            </thead>
            <tbody>
              {supportFeatureRows.map((row) => (
                <tr key={row.label} className="border-b border-slate-100 last:border-0">
                  <th
                    scope="row"
                    className={`${CELL} sticky left-0 bg-white text-left font-semibold text-slate-800`}
                  >
                    {row.label}
                  </th>
                  {supportPlans.map((plan) => (
                    <td key={plan.id} className={CELL}>
                      <FeatureValue value={row.values[plan.id]} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
