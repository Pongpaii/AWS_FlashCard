import { useState } from 'react'
import { Link } from 'react-router-dom'
import { QuizQuestionCard } from '../components/quiz/QuizQuestionCard'
import { ProgressBar } from '../components/ui/ProgressBar'
import {
  DEFAULT_QUIZ_LENGTH,
  QUIZ_DOMAIN_LABELS_TH,
  QUIZ_DOMAIN_STYLES,
  TOTAL_QUESTIONS,
  domainCounts,
} from '../data/quizQuestions'
import { useProgress } from '../hooks/useProgress'
import { PASS_PERCENT, useQuiz } from '../hooks/useQuiz'
import type { QuizDomainFilter } from '../types'
import { QUIZ_DOMAINS } from '../types'

/** Scenario quiz: pick a domain, answer, read the explanation, see the score. */
export function QuizPage() {
  const { progress } = useProgress()
  const {
    questions,
    current,
    currentIndex,
    selectedIndex,
    correctCount,
    results,
    isComplete,
    hasStarted,
    percent,
    passed,
    startQuiz,
    answer,
    next,
    restart,
  } = useQuiz()

  const [domain, setDomain] = useState<QuizDomainFilter>('all')

  const quizStats = progress.quiz
  const overallAccuracy =
    quizStats.totalAnswered === 0
      ? null
      : Math.round((quizStats.totalCorrect / quizStats.totalAnswered) * 100)

  if (!hasStarted) {
    return (
      <div className="flex flex-col gap-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">ควิซตามสถานการณ์</h1>
          <p className="mt-1 text-sm text-slate-600">
            โจทย์สไตล์ข้อสอบ CLF-C02 ที่ให้สถานการณ์มาแล้วเลือกบริการหรือแนวทางที่เหมาะที่สุด
            ตอบแล้วมีคำอธิบายทันทีว่าทำไมข้ออื่นไม่ใช่ รวม {TOTAL_QUESTIONS} ข้อในคลัง
          </p>
        </div>

        {quizStats.quizzesTaken > 0 && (
          <dl className="grid grid-cols-3 gap-3">
            <div className="rounded-xl bg-white px-4 py-3 shadow-sm ring-1 ring-slate-200">
              <dt className="text-xs font-medium text-slate-500">ทำควิซไปแล้ว</dt>
              <dd className="mt-0.5 text-2xl font-bold tabular-nums text-slate-800">
                {quizStats.quizzesTaken}
                <span className="text-sm font-medium text-slate-500"> ครั้ง</span>
              </dd>
            </div>
            <div className="rounded-xl bg-orange-50 px-4 py-3 ring-1 ring-orange-100">
              <dt className="text-xs font-medium text-orange-700">คะแนนดีที่สุด</dt>
              <dd className="mt-0.5 text-2xl font-bold tabular-nums text-orange-800">
                {quizStats.bestPercent}%
              </dd>
            </div>
            <div className="rounded-xl bg-indigo-50 px-4 py-3 ring-1 ring-indigo-100">
              <dt className="text-xs font-medium text-indigo-700">ความแม่นรวม</dt>
              <dd className="mt-0.5 text-2xl font-bold tabular-nums text-indigo-800">
                {overallAccuracy === null ? '—' : `${overallAccuracy}%`}
              </dd>
            </div>
          </dl>
        )}

        <section className="rounded-xl bg-white p-6 shadow-md ring-1 ring-slate-200">
          <h2 className="text-lg font-bold text-slate-900">เลือกหมวดข้อสอบ</h2>
          <p className="mt-1 text-sm text-slate-500">
            หนึ่งรอบมีไม่เกิน {DEFAULT_QUIZ_LENGTH} ข้อ สุ่มใหม่ทุกครั้ง เกณฑ์ผ่านที่ใช้อ้างอิงคือ{' '}
            {PASS_PERCENT}%
          </p>

          <div role="group" aria-label="เลือกหมวดข้อสอบ" className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              aria-pressed={domain === 'all'}
              onClick={() => setDomain('all')}
              className={[
                'rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors',
                domain === 'all'
                  ? 'bg-slate-800 text-white'
                  : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-100',
              ].join(' ')}
            >
              ทุกหมวด <span className="tabular-nums opacity-80">({domainCounts.all})</span>
            </button>

            {QUIZ_DOMAINS.map((item) => {
              const isActive = domain === item

              return (
                <button
                  key={item}
                  type="button"
                  aria-pressed={isActive}
                  aria-label={`หมวด ${QUIZ_DOMAIN_LABELS_TH[item]} มี ${domainCounts[item]} ข้อ`}
                  onClick={() => setDomain(item)}
                  className={[
                    'flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors',
                    isActive
                      ? QUIZ_DOMAIN_STYLES[item].badge
                      : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-100',
                  ].join(' ')}
                >
                  {!isActive && (
                    <span
                      aria-hidden="true"
                      className={`h-2 w-2 rounded-full ${QUIZ_DOMAIN_STYLES[item].dot}`}
                    />
                  )}
                  {QUIZ_DOMAIN_LABELS_TH[item]}{' '}
                  <span className="tabular-nums opacity-80">({domainCounts[item]})</span>
                </button>
              )
            })}
          </div>

          <button
            type="button"
            onClick={() => startQuiz(domain)}
            aria-label="เริ่มทำควิซ"
            className="mt-6 rounded-lg bg-orange-500 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-orange-600"
          >
            เริ่มทำควิซ
          </button>
        </section>
      </div>
    )
  }

  if (isComplete) {
    return (
      <div className="flex flex-col gap-5">
        <div className="animate-fade-up rounded-xl bg-white p-8 text-center shadow-md ring-1 ring-slate-200">
          <p className="text-sm font-medium text-slate-500">ผลคะแนนรอบนี้</p>
          <p
            className={`mt-2 text-5xl font-bold tabular-nums ${
              passed ? 'text-green-600' : 'text-orange-600'
            }`}
          >
            {percent}%
          </p>
          <p className="mt-1 text-slate-600">
            ตอบถูก <strong className="tabular-nums">{correctCount}</strong> จาก{' '}
            <span className="tabular-nums">{questions.length}</span> ข้อ
          </p>

          <p
            className={`mx-auto mt-5 max-w-md rounded-lg px-4 py-3 text-sm font-semibold ${
              passed ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-900'
            }`}
          >
            {passed
              ? `ผ่านเกณฑ์ ${PASS_PERCENT}% ที่ใช้อ้างอิง ทบทวนข้อที่พลาดอีกนิดก็พร้อมสอบ`
              : `ยังไม่ถึงเกณฑ์ ${PASS_PERCENT}% ลองกลับไปอ่านแท็บเรียนรู้ในหมวดที่พลาดแล้วทำอีกรอบ`}
          </p>

          <ol className="mx-auto mt-6 flex max-w-md flex-wrap justify-center gap-1.5">
            {results.map((isCorrect, index) => (
              <li
                key={index}
                aria-label={`ข้อ ${index + 1} ${isCorrect ? 'ถูก' : 'ผิด'}`}
                className={`grid h-8 w-8 place-items-center rounded-lg text-xs font-bold tabular-nums ${
                  isCorrect ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}
              >
                {index + 1}
              </li>
            ))}
          </ol>

          <div className="mt-7 flex flex-wrap justify-center gap-2">
            <button
              type="button"
              onClick={() => startQuiz(domain)}
              aria-label="ทำควิซอีกรอบด้วยชุดคำถามใหม่"
              className="rounded-lg bg-orange-500 px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-orange-600"
            >
              ทำอีกรอบ (สุ่มใหม่)
            </button>
            <button
              type="button"
              onClick={restart}
              aria-label="กลับไปเลือกหมวดข้อสอบ"
              className="rounded-lg bg-white px-5 py-2.5 text-sm font-bold text-slate-700 ring-1 ring-slate-200 transition-colors hover:bg-slate-100"
            >
              เลือกหมวดใหม่
            </button>
            <Link
              to="/learn"
              className="rounded-lg bg-white px-5 py-2.5 text-sm font-bold text-indigo-700 ring-1 ring-indigo-200 transition-colors hover:bg-indigo-50"
            >
              ไปอ่านทบทวน
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (current === null) {
    return (
      <div className="rounded-xl bg-white p-10 text-center shadow-md ring-1 ring-slate-200">
        <p className="text-lg font-semibold text-slate-800">ไม่มีคำถามในหมวดนี้</p>
        <button
          type="button"
          onClick={restart}
          className="mt-5 rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600"
        >
          เลือกหมวดใหม่
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <h1 className="text-xl font-bold tracking-tight text-slate-900">ควิซตามสถานการณ์</h1>
        <p className="text-sm text-slate-500">
          ตอบถูก <strong className="tabular-nums text-green-700">{correctCount}</strong> /{' '}
          <span className="tabular-nums">{results.length}</span> ที่ตอบแล้ว
        </p>
        <button
          type="button"
          onClick={restart}
          aria-label="ออกจากควิซและกลับไปเลือกหมวด"
          className="ml-auto rounded-lg bg-white px-3 py-1.5 text-sm font-semibold text-slate-600 ring-1 ring-slate-200 transition-colors hover:bg-slate-100"
        >
          ออกจากควิซ
        </button>
      </div>

      <ProgressBar value={results.length} total={questions.length} label="ความคืบหน้า" />

      <QuizQuestionCard
        prepared={current}
        questionNumber={currentIndex + 1}
        totalQuestions={questions.length}
        selectedIndex={selectedIndex}
        onAnswer={answer}
        onNext={next}
        isLastQuestion={currentIndex + 1 >= questions.length}
      />
    </div>
  )
}
