import type { KeyboardEvent } from 'react'
import { CATEGORY_LABELS_TH, CATEGORY_STYLES } from '../../data/awsServices'
import type { AWSService } from '../../types'

interface FlashCardProps {
  service: AWSService
  isFlipped: boolean
  onFlip: () => void
}

/** A single study card that flips in 3D to reveal the answer, hint, and tips. */
export function FlashCard({ service, isFlipped, onFlip }: FlashCardProps) {
  const style = CATEGORY_STYLES[service.category]

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    // Space is handled globally by the deck; Enter flips the focused card.
    if (event.key === 'Enter') {
      event.preventDefault()
      onFlip()
    }
  }

  return (
    <div className="flip-scene h-[26rem] w-full sm:h-[24rem]">
      <div
        role="button"
        tabIndex={0}
        aria-pressed={isFlipped}
        aria-label={
          isFlipped
            ? `ด้านหลังการ์ด ${service.name} กด Enter เพื่อพลิกกลับ`
            : `ด้านหน้าการ์ด ${service.name} กด Enter เพื่อดูคำตอบ`
        }
        onClick={onFlip}
        onKeyDown={handleKeyDown}
        className={`flip-inner cursor-pointer rounded-xl ${isFlipped ? 'flip-inner--flipped' : ''}`}
      >
        {/* Front: service identity only. */}
        <div className="flip-face flex flex-col items-center justify-center gap-3 rounded-xl bg-white p-6 text-center shadow-md ring-1 ring-slate-200">
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${style.badge}`}
          >
            {CATEGORY_LABELS_TH[service.category]} · {service.category}
          </span>

          <h2 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            {service.name}
          </h2>
          <p className="text-lg text-slate-500">{service.fullName}</p>

          <p className="mt-4 text-sm text-slate-400">คลิกการ์ด หรือกด Space เพื่อดูคำตอบ</p>
        </div>

        {/* Back: answer, memory hint, and exam tips when available. */}
        <div className="flip-face flip-face--back flex flex-col gap-4 overflow-y-auto rounded-xl bg-white p-6 shadow-md ring-1 ring-slate-200">
          <div className="flex items-center gap-2">
            <span aria-hidden="true" className={`h-2.5 w-2.5 rounded-full ${style.dot}`} />
            <h3 className="text-xl font-bold text-slate-900">{service.name}</h3>
            <span className="text-sm text-slate-400">{service.fullName}</span>
          </div>

          <section>
            <h4 className="mb-1 text-xs font-bold uppercase tracking-wide text-indigo-600">
              หน้าที่หลัก
            </h4>
            <p className="text-[15px] leading-relaxed text-slate-700">{service.answer}</p>
          </section>

          <section className="rounded-lg bg-amber-50 p-3">
            <h4 className="mb-1 text-xs font-bold uppercase tracking-wide text-amber-700">
              เคล็ดลับจำ
            </h4>
            <p className="text-sm leading-relaxed text-amber-900">{service.hint}</p>
          </section>

          {service.examTips ? (
            <section className="rounded-lg bg-orange-50 p-3">
              <h4 className="mb-1 text-xs font-bold uppercase tracking-wide text-orange-700">
                จุดที่มักออกสอบ
              </h4>
              <p className="text-sm leading-relaxed text-orange-900">{service.examTips}</p>
            </section>
          ) : null}
        </div>
      </div>
    </div>
  )
}
