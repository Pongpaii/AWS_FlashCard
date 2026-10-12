import { examKeywordsFor } from '../../data/examKeywords'
import { useProgress } from '../../hooks/useProgress'
import type { AWSService, MatchMode } from '../../types'
import { suggestMastery } from '../../utils/matchPicker'
import { MASTERY_LEVELS, MASTERY_META } from './matchLabels'

interface RoundReviewProps {
  services: readonly AWSService[]
  mode: MatchMode
  /** pairId -> wrong picks during the round. */
  mistakes: Readonly<Record<string, number>>
}

/**
 * Post-round list of the words just played. Each word can be starred and
 * marked จำได้ดี / จำได้กลาง / จำไม่ได้; both feed back into which words the
 * next boards deal.
 */
export function RoundReview({ services, mode, mistakes }: RoundReviewProps) {
  const { masteryOf, setMastery, isStarred, toggleStar } = useProgress()

  const applySuggestions = () => {
    for (const service of services) {
      setMastery(service.id, suggestMastery(mistakes[service.id] ?? 0))
    }
  }

  return (
    <section className="mt-7 border-t border-slate-200 pt-6 text-left" aria-labelledby="round-review">
      <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
        <h3 id="round-review" className="text-base font-bold text-slate-900">
          ทบทวนคำในรอบนี้
        </h3>
        <button
          type="button"
          onClick={applySuggestions}
          aria-label="ทำเครื่องหมายทุกคำตามผลรอบนี้ ไม่ผิดเป็นจำได้ดี ผิดหนึ่งครั้งเป็นจำได้กลาง ผิดสองครั้งขึ้นไปเป็นจำไม่ได้"
          className="rounded-lg bg-slate-800 px-3 py-1.5 text-xs font-bold text-white transition-colors hover:bg-slate-700"
        >
          ทำเครื่องหมายตามผลรอบนี้
        </button>
      </div>
      <p className="mb-3 text-xs text-slate-500">
        กด ☆ เพื่อติดดาวคำที่อยากเน้น และเลือกระดับความจำ คำที่ติดดาวหรือจำไม่ได้จะถูกสุ่มมาบ่อยขึ้น
        ส่วนคำที่เพิ่งเล่นไปจะไม่ถูกสุ่มซ้ำในรอบถัด ๆ ไป
      </p>

      <ul className="flex flex-col gap-2">
        {services.map((service) => {
          const starred = isStarred(service.id)
          const current = masteryOf(service.id)
          const wrong = mistakes[service.id] ?? 0
          const keywords = examKeywordsFor(service.id)

          return (
            <li
              key={service.id}
              className="flex flex-wrap items-center gap-x-3 gap-y-2 rounded-xl bg-slate-50 px-3 py-2.5 ring-1 ring-slate-200"
            >
              <button
                type="button"
                aria-pressed={starred}
                aria-label={starred ? `เอาดาวออกจาก ${service.name}` : `ติดดาว ${service.name}`}
                onClick={() => toggleStar(service.id)}
                className={[
                  'grid h-8 w-8 place-items-center rounded-full text-lg transition-colors',
                  starred ? 'text-amber-400 hover:bg-amber-50' : 'text-slate-300 hover:bg-slate-200',
                ].join(' ')}
              >
                <span aria-hidden="true">{starred ? '★' : '☆'}</span>
              </button>

              <div className="min-w-0 flex-1">
                <p className="font-bold text-slate-900">
                  {service.name}
                  <span
                    className={`ml-2 text-xs font-medium ${wrong === 0 ? 'text-green-600' : 'text-red-600'}`}
                  >
                    {wrong === 0 ? 'ไม่ผิดเลย' : `ผิด ${wrong} ครั้ง`}
                  </span>
                </p>
                <p className="truncate text-xs text-slate-500">
                  {mode === 'keyword' && keywords.length > 0 ? keywords.join(' · ') : service.description}
                </p>
              </div>

              <div role="group" aria-label={`ระดับความจำของ ${service.name}`} className="flex gap-1">
                {MASTERY_LEVELS.map((level) => {
                  const meta = MASTERY_META[level]
                  const isActive = current === level
                  return (
                    <button
                      key={level}
                      type="button"
                      aria-pressed={isActive}
                      onClick={() => setMastery(service.id, level)}
                      className={[
                        'rounded-full px-2.5 py-1 text-xs font-semibold ring-1 transition-colors',
                        isActive ? meta.active : meta.idle,
                      ].join(' ')}
                    >
                      {meta.label}
                    </button>
                  )
                })}
              </div>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
