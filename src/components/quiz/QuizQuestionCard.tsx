import { Link } from 'react-router-dom'
import { QUIZ_DOMAIN_LABELS_TH, QUIZ_DOMAIN_STYLES } from '../../data/quizQuestions'
import type { PreparedQuizQuestion } from '../../types'

interface QuizQuestionCardProps {
  prepared: PreparedQuizQuestion
  questionNumber: number
  totalQuestions: number
  selectedIndex: number | null
  onAnswer: (optionIndex: number) => void
  onNext: () => void
  isLastQuestion: boolean
}

const OPTION_LETTERS = ['ก', 'ข', 'ค', 'ง', 'จ'] as const

/** One scenario question with its options and post-answer explanation. */
export function QuizQuestionCard({
  prepared,
  questionNumber,
  totalQuestions,
  selectedIndex,
  onAnswer,
  onNext,
  isLastQuestion,
}: QuizQuestionCardProps) {
  const { question, options } = prepared
  const isRevealed = selectedIndex !== null
  const style = QUIZ_DOMAIN_STYLES[question.domain]
  const answeredCorrectly = isRevealed && options[selectedIndex].isCorrect

  return (
    <div className="flex flex-col gap-5 rounded-xl bg-white p-6 shadow-md ring-1 ring-slate-200">
      <div className="flex flex-wrap items-center gap-2">
        <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${style.badge}`}>
          {QUIZ_DOMAIN_LABELS_TH[question.domain]}
        </span>
        <span className="text-sm text-slate-500">
          ข้อ <strong className="tabular-nums text-slate-700">{questionNumber}</strong> จาก{' '}
          <span className="tabular-nums">{totalQuestions}</span>
        </span>
      </div>

      <section>
        <h2 className="mb-1 text-[11px] font-bold uppercase tracking-wide text-slate-400">
          สถานการณ์
        </h2>
        <p className="border-l-4 border-slate-200 pl-3 text-[15px] leading-relaxed text-slate-700">
          {question.scenario}
        </p>
      </section>

      <p className="text-lg font-bold leading-snug text-slate-900">{question.question}</p>

      <div role="group" aria-label="ตัวเลือกคำตอบ" className="flex flex-col gap-2">
        {options.map((option, index) => {
          const isPicked = selectedIndex === index

          // Before answering: neutral. After: green for the right one, red only
          // for the wrong one the player actually picked.
          let tone = 'border-slate-200 bg-white hover:border-indigo-300 hover:bg-indigo-50/40'
          if (isRevealed) {
            if (option.isCorrect) {
              tone = 'border-green-400 bg-green-50'
            } else if (isPicked) {
              tone = 'border-red-400 bg-red-50'
            } else {
              tone = 'border-slate-200 bg-white opacity-60'
            }
          }

          return (
            <button
              key={option.text}
              type="button"
              disabled={isRevealed}
              aria-pressed={isPicked}
              onClick={() => onAnswer(index)}
              className={`flex items-start gap-3 rounded-lg border-2 p-3 text-left transition-colors ${tone}`}
            >
              <span
                aria-hidden="true"
                className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-slate-100 text-xs font-bold text-slate-600"
              >
                {OPTION_LETTERS[index] ?? index + 1}
              </span>
              <span className="text-[15px] leading-relaxed text-slate-800">{option.text}</span>
              {isRevealed && option.isCorrect && (
                <span className="ml-auto shrink-0 text-sm font-bold text-green-700">ถูก</span>
              )}
              {isRevealed && isPicked && !option.isCorrect && (
                <span className="ml-auto shrink-0 text-sm font-bold text-red-700">ที่คุณเลือก</span>
              )}
            </button>
          )
        })}
      </div>

      {isRevealed && (
        <div className="animate-fade-up flex flex-col gap-3">
          <p
            role="status"
            className={`rounded-lg px-4 py-2.5 text-sm font-bold ${
              answeredCorrectly ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}
          >
            {answeredCorrectly ? '✓ ถูกต้อง' : '✗ ยังไม่ถูก อ่านคำอธิบายด้านล่าง'}
          </p>

          <section className="rounded-lg bg-amber-50 p-4">
            <h3 className="mb-1 text-[11px] font-bold uppercase tracking-wide text-amber-700">
              คำอธิบาย
            </h3>
            <p className="text-sm leading-relaxed text-amber-900">{question.explanation}</p>
          </section>

          {question.relatedServices !== undefined && question.relatedServices.length > 0 && (
            <p className="text-xs text-slate-500">
              อ่านเพิ่มเกี่ยวกับบริการที่เกี่ยวข้องได้ในแท็บ{' '}
              <Link to="/learn" className="font-semibold text-indigo-600 underline">
                เรียนรู้
              </Link>
            </p>
          )}

          <button
            type="button"
            onClick={onNext}
            aria-label={isLastQuestion ? 'ดูผลคะแนน' : 'ไปข้อถัดไป'}
            className="self-start rounded-lg bg-orange-500 px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-orange-600"
          >
            {isLastQuestion ? 'ดูผลคะแนน' : 'ข้อถัดไป →'}
          </button>
        </div>
      )}
    </div>
  )
}
