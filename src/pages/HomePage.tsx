import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Leaderboard } from '../components/ui/Leaderboard'
import { ProgressBar } from '../components/ui/ProgressBar'
import { formatSeconds } from '../hooks/useMatchGame'
import { useProgress } from '../hooks/useProgress'
import type { Difficulty } from '../types'
import { DIFFICULTIES, PAIR_COUNT } from '../types'

const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  easy: 'ง่าย',
  medium: 'กลาง',
  hard: 'ยาก',
}

/** Landing screen: mode picker, overall stats, and a quick resume shortcut. */
export function HomePage() {
  const { summary, bestTimeFor, bestScoreFor, resetProgress, leaderboardFor, clearLeaderboard } =
    useProgress()

  const [boardDifficulty, setBoardDifficulty] = useState<Difficulty>('easy')
  const boardEntries = leaderboardFor(boardDifficulty)
  const totalRuns = DIFFICULTIES.reduce(
    (sum, difficulty) => sum + leaderboardFor(difficulty).length,
    0,
  )

  const handleReset = () => {
    if (window.confirm('ต้องการล้างความก้าวหน้าทั้งหมดหรือไม่ การกระทำนี้ย้อนกลับไม่ได้')) {
      resetProgress()
    }
  }

  const handleClearBoard = () => {
    if (window.confirm('ต้องการล้างกระดานผู้นำทั้งหมดหรือไม่ ความก้าวหน้าการเรียนจะยังอยู่')) {
      clearLeaderboard()
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <section className="rounded-xl bg-white p-6 shadow-md ring-1 ring-slate-200 sm:p-8">
        <p className="text-sm font-semibold text-orange-600">AWS Certified Cloud Practitioner</p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          ฝึกจำ AWS Services ให้พร้อมสอบ CLF-C02
        </h1>
        <p className="mt-2 max-w-2xl text-slate-600">
          รวม {summary.totalServices} บริการใน 10 หมวด พร้อมคำอธิบาย เคล็ดลับจำ และจุดที่มักออกสอบ
          ความก้าวหน้าของคุณถูกเก็บไว้ในเบราว์เซอร์นี้เท่านั้น
        </p>

        <div className="mt-6 max-w-xl">
          <ProgressBar
            value={summary.masteredCount}
            total={summary.totalServices}
            label="บริการที่จำได้แล้ว"
          />
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Link
          to="/learn"
          aria-label="เข้าโหมดเรียนรู้"
          className="group rounded-xl bg-white p-6 shadow-md ring-1 ring-slate-200 transition-shadow hover:shadow-lg"
        >
          <span
            aria-hidden="true"
            className="grid h-11 w-11 place-items-center rounded-lg bg-emerald-100 text-xl"
          >
            📘
          </span>
          <h2 className="mt-3 text-xl font-bold text-slate-900 group-hover:text-emerald-600">
            เรียนรู้
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            อ่านทบทวนทุกบริการแยกตามหมวด พร้อมหน้าที่หลัก เคล็ดลับจำ และจุดที่มักออกสอบ ค้นหาได้
          </p>
        </Link>

        <Link
          to="/well-architected"
          aria-label="ดูสรุป AWS Well-Architected Framework"
          className="group rounded-xl bg-white p-6 shadow-md ring-1 ring-slate-200 transition-shadow hover:shadow-lg"
        >
          <span
            aria-hidden="true"
            className="grid h-11 w-11 place-items-center rounded-lg bg-purple-100 text-xl"
          >
            🏛️
          </span>
          <h2 className="mt-3 text-xl font-bold text-slate-900 group-hover:text-purple-600">
            Well-Architected
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            6 pillar กับ design principles ทั้งหมด พร้อมตัวช่วยจำ คู่ที่มักสับสน
            และแบบฝึกจับ pillar จากสถานการณ์
          </p>
        </Link>

        <Link
          to="/caf"
          aria-label="ดูสรุป AWS Cloud Adoption Framework"
          className="group rounded-xl bg-white p-6 shadow-md ring-1 ring-slate-200 transition-shadow hover:shadow-lg"
        >
          <span
            aria-hidden="true"
            className="grid h-11 w-11 place-items-center rounded-lg bg-indigo-100 text-xl"
          >
            🧭
          </span>
          <h2 className="mt-3 text-xl font-bold text-slate-900 group-hover:text-indigo-600">
            CAF
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Cloud Adoption Framework: 6 perspectives, 4 phases, 4 domains พร้อมแบบฝึกจับ
            perspective และตารางเทียบกับ Well-Architected
          </p>
        </Link>

        <Link
          to="/custom-match"
          aria-label="สร้างเกมจับคู่แบบกำหนดเอง"
          className="group rounded-xl bg-white p-6 shadow-md ring-1 ring-slate-200 transition-shadow hover:shadow-lg"
        >
          <span
            aria-hidden="true"
            className="grid h-11 w-11 place-items-center rounded-lg bg-rose-100 text-xl"
          >
            🎛️
          </span>
          <h2 className="mt-3 text-xl font-bold text-slate-900 group-hover:text-rose-600">
            จับคู่กำหนดเอง
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            เลือกเองว่าจะจับคู่เรื่องอะไร ผสมข้ามหมวดได้ทั้ง services, Well-Architected, CAF
            และ Pricing เลือกจำนวนคู่ได้ 4 ถึง 12
          </p>
        </Link>

        <Link
          to="/pricing"
          aria-label="เข้าหน้าเรียนรู้เรื่องราคาและค่าใช้จ่าย"
          className="group rounded-xl bg-white p-6 shadow-md ring-1 ring-slate-200 transition-shadow hover:shadow-lg"
        >
          <span
            aria-hidden="true"
            className="grid h-11 w-11 place-items-center rounded-lg bg-emerald-100 text-xl"
          >
            💰
          </span>
          <h2 className="mt-3 text-xl font-bold text-slate-900 group-hover:text-emerald-600">
            Pricing
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            4 แท็บในหน้าเดียว: เรียนรู้ ตัวเลขที่ต้องจำ ทายรูปแบบราคาให้ไว และเกมจับคู่ศัพท์เรื่องราคา
          </p>
        </Link>

        <Link
          to="/support"
          aria-label="ดูสรุปแผน AWS Support"
          className="group rounded-xl bg-white p-6 shadow-md ring-1 ring-slate-200 transition-shadow hover:shadow-lg"
        >
          <span
            aria-hidden="true"
            className="grid h-11 w-11 place-items-center rounded-lg bg-amber-100 text-xl"
          >
            🛟
          </span>
          <h2 className="mt-3 text-xl font-bold text-slate-900 group-hover:text-amber-600">
            Support Plans
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            เทียบแผน support ทั้ง 5 ระดับ เวลาตอบกลับตามความรุนแรงของเคส สิทธิ์ TAM
            และคำใบ้ในโจทย์ที่ชี้ไปแต่ละแผน
          </p>
        </Link>

        <Link
          to="/quiz"
          aria-label="เข้าโหมดควิซตามสถานการณ์"
          className="group rounded-xl bg-white p-6 shadow-md ring-1 ring-slate-200 transition-shadow hover:shadow-lg"
        >
          <span
            aria-hidden="true"
            className="grid h-11 w-11 place-items-center rounded-lg bg-sky-100 text-xl"
          >
            🧠
          </span>
          <h2 className="mt-3 text-xl font-bold text-slate-900 group-hover:text-sky-600">
            ควิซสถานการณ์
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            โจทย์สไตล์ข้อสอบ CLF-C02 ให้สถานการณ์มาแล้วเลือกคำตอบ พร้อมคำอธิบายว่าทำไมข้ออื่นไม่ใช่
          </p>
        </Link>

        <Link
          to="/flashcards"
          aria-label="เข้าโหมด Flash Cards"
          className="group rounded-xl bg-white p-6 shadow-md ring-1 ring-slate-200 transition-shadow hover:shadow-lg"
        >
          <span
            aria-hidden="true"
            className="grid h-11 w-11 place-items-center rounded-lg bg-orange-100 text-xl"
          >
            🗂️
          </span>
          <h2 className="mt-3 text-xl font-bold text-slate-900 group-hover:text-orange-600">
            Flash Cards
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            พลิกการ์ดดูคำตอบ ทำเครื่องหมายว่าจำได้หรือยังไม่แม่น กรองตามหมวด และใช้คีย์ลัดได้
          </p>
        </Link>

        <Link
          to="/match"
          aria-label="เข้าโหมดเกมจับคู่"
          className="group rounded-xl bg-white p-6 shadow-md ring-1 ring-slate-200 transition-shadow hover:shadow-lg"
        >
          <span
            aria-hidden="true"
            className="grid h-11 w-11 place-items-center rounded-lg bg-indigo-100 text-xl"
          >
            🎯
          </span>
          <h2 className="mt-3 text-xl font-bold text-slate-900 group-hover:text-indigo-600">
            เกมจับคู่
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            เห็นการ์ดทุกใบตั้งแต่แรก คลิกจับคู่ชื่อ service กับหน้าที่ของมัน เลือกได้ 3 ระดับ
            พร้อมจับเวลาและเก็บสถิติดีที่สุด
          </p>
        </Link>
      </section>

      <section className="rounded-xl bg-white p-6 shadow-md ring-1 ring-slate-200">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="text-lg font-bold text-slate-900">
            🏆 กระดานผู้นำ
            <span className="ml-2 text-sm font-normal text-slate-500">
              เร็วที่สุดของเกมจับคู่
            </span>
          </h2>
          {totalRuns > 0 && (
            <button
              type="button"
              aria-label="ล้างกระดานผู้นำทั้งหมด"
              onClick={handleClearBoard}
              className="text-xs font-semibold text-slate-400 underline decoration-dotted hover:text-red-600"
            >
              ล้างกระดาน
            </button>
          )}
        </div>

        <div role="group" aria-label="เลือกระดับของกระดานผู้นำ" className="mt-4 flex flex-wrap gap-2">
          {DIFFICULTIES.map((difficulty) => {
            const isActive = difficulty === boardDifficulty
            const count = leaderboardFor(difficulty).length

            return (
              <button
                key={difficulty}
                type="button"
                aria-pressed={isActive}
                aria-label={`ดูกระดานระดับ${DIFFICULTY_LABELS[difficulty]} มี ${count} สถิติ`}
                onClick={() => setBoardDifficulty(difficulty)}
                className={[
                  'rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-orange-500 text-white'
                    : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-100',
                ].join(' ')}
              >
                ระดับ{DIFFICULTY_LABELS[difficulty]}{' '}
                <span className="tabular-nums opacity-80">({count})</span>
              </button>
            )
          })}
        </div>

        <p className="mt-3 text-xs text-slate-400">
          ระดับ{DIFFICULTY_LABELS[boardDifficulty]} = {PAIR_COUNT[boardDifficulty]} คู่ ·
          เรียงจากเวลาน้อยที่สุด ถ้าเวลาเท่ากันคนที่ทายน้อยครั้งกว่าอยู่บน ·
          เก็บสถิติไว้ในเบราว์เซอร์นี้เท่านั้น
        </p>

        <div className="mt-4">
          <Leaderboard entries={boardEntries} difficulty={boardDifficulty} />
        </div>
      </section>

      <section className="rounded-xl bg-white p-6 shadow-md ring-1 ring-slate-200">
        <h2 className="text-lg font-bold text-slate-900">สถิติของคุณ</h2>

        <dl className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-xl bg-indigo-50 px-4 py-3">
            <dt className="text-xs font-medium text-indigo-700">จำได้แล้ว</dt>
            <dd className="mt-0.5 text-2xl font-bold tabular-nums text-indigo-800">
              {summary.masteredCount}
              <span className="text-sm font-medium text-indigo-500">
                /{summary.totalServices}
              </span>
            </dd>
          </div>
          <div className="rounded-xl bg-red-50 px-4 py-3">
            <dt className="text-xs font-medium text-red-700">ยังไม่แม่น</dt>
            <dd className="mt-0.5 text-2xl font-bold tabular-nums text-red-800">
              {summary.reviewingCount}
            </dd>
          </div>
          <div className="rounded-xl bg-orange-50 px-4 py-3">
            <dt className="text-xs font-medium text-orange-700">เรียนต่อกัน</dt>
            <dd className="mt-0.5 text-2xl font-bold tabular-nums text-orange-800">
              {summary.streak}
              <span className="text-sm font-medium text-orange-500"> วัน</span>
            </dd>
          </div>
          <div className="rounded-xl bg-slate-100 px-4 py-3">
            <dt className="text-xs font-medium text-slate-600">เล่นเกมไปแล้ว</dt>
            <dd className="mt-0.5 text-2xl font-bold tabular-nums text-slate-800">
              {summary.gamesPlayed}
              <span className="text-sm font-medium text-slate-500"> เกม</span>
            </dd>
          </div>
        </dl>

        <h3 className="mt-6 text-sm font-bold text-slate-700">สถิติเกมจับคู่ที่ดีที่สุด</h3>
        <ul className="mt-2 grid gap-2 sm:grid-cols-3">
          {DIFFICULTIES.map((difficulty) => {
            const time = bestTimeFor(difficulty)
            const attempts = bestScoreFor(difficulty)

            return (
              <li
                key={difficulty}
                className="rounded-xl bg-slate-50 px-4 py-3 ring-1 ring-slate-200"
              >
                <p className="text-sm font-semibold text-slate-700">
                  ระดับ{DIFFICULTY_LABELS[difficulty]}
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  เวลา{' '}
                  <strong className="tabular-nums text-emerald-700">
                    {time === null ? '—' : formatSeconds(time)}
                  </strong>
                  {' · '}ทาย{' '}
                  <strong className="tabular-nums text-emerald-700">
                    {attempts === null ? '—' : `${attempts} ครั้ง`}
                  </strong>
                </p>
              </li>
            )
          })}
        </ul>

        <div className="mt-6 flex flex-wrap items-center gap-2">
          {summary.hasFlashCardProgress ? (
            <Link
              to="/flashcards?mode=review"
              aria-label="ฝึกต่อจากคราวที่แล้วด้วยการ์ดที่ยังไม่แม่น"
              className="rounded-lg bg-orange-500 px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-orange-600"
            >
              ฝึกต่อจากคราวที่แล้ว
            </Link>
          ) : (
            <Link
              to="/flashcards"
              aria-label="เริ่มทบทวนการ์ดใบแรก"
              className="rounded-lg bg-orange-500 px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-orange-600"
            >
              เริ่มทบทวนเลย
            </Link>
          )}

          {summary.hasFlashCardProgress && (
            <button
              type="button"
              aria-label="ล้างความก้าวหน้าทั้งหมด"
              onClick={handleReset}
              className="rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 ring-1 ring-slate-200 transition-colors hover:bg-slate-100"
            >
              ล้างความก้าวหน้า
            </button>
          )}

          {summary.lastStudyDate !== '' && (
            <p className="text-sm text-slate-500">
              ทบทวนล่าสุด: <span className="tabular-nums">{summary.lastStudyDate}</span>
            </p>
          )}
        </div>
      </section>
    </div>
  )
}
