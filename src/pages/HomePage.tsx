import { useState } from 'react'
import { Link } from 'react-router-dom'
import { MODE_META } from '../components/match/matchLabels'
import { Leaderboard } from '../components/ui/Leaderboard'
import { ProgressBar } from '../components/ui/ProgressBar'
import { formatSeconds } from '../hooks/useMatchGame'
import { useProgress } from '../hooks/useProgress'
import type { MatchMode } from '../types'
import { MATCH_MODES, MATCH_PAIR_COUNT } from '../types'

interface HomeCard {
  to: string
  ariaLabel: string
  icon: string
  title: string
  blurb: string
}

/** MVP: the three core study modes, shown as large cards. */
const MVP_CARDS: (HomeCard & { iconBg: string; hover: string })[] = [
  {
    to: '/learn',
    ariaLabel: 'เข้าโหมดเรียนรู้',
    icon: '📘',
    iconBg: 'bg-emerald-100',
    hover: 'group-hover:text-emerald-600',
    title: 'เรียนรู้',
    blurb: 'อ่านทบทวนทุกบริการแยกตามหมวด พร้อมหน้าที่หลัก เคล็ดลับจำ และจุดที่มักออกสอบ ค้นหาได้',
  },
  {
    to: '/flashcards',
    ariaLabel: 'เข้าโหมด Flash Cards',
    icon: '🗂️',
    iconBg: 'bg-orange-100',
    hover: 'group-hover:text-orange-600',
    title: 'Flash Cards',
    blurb: 'พลิกการ์ดดูคำตอบ ทำเครื่องหมายว่าจำได้หรือยังไม่แม่น กรองตามหมวด และใช้คีย์ลัดได้',
  },
  {
    to: '/match',
    ariaLabel: 'เข้าโหมดเกมจับคู่',
    icon: '🎯',
    iconBg: 'bg-indigo-100',
    hover: 'group-hover:text-indigo-600',
    title: 'เกมจับคู่',
    blurb:
      'จับคู่ service กับความหมายหรือคีย์เวิร์ดที่ออกสอบ หรือเล่นโหมด CAF / Well-Architected ติดดาวคำที่อยากเน้นได้',
  },
]

/** Extra study pages, shown as a compact list under the MVP cards. */
const MORE_CARDS: HomeCard[] = [
  {
    to: '/quiz',
    ariaLabel: 'เข้าโหมดควิซตามสถานการณ์',
    icon: '🧠',
    title: 'ควิซสถานการณ์',
    blurb: 'โจทย์สไตล์ข้อสอบ CLF-C02 พร้อมคำอธิบาย',
  },
  {
    to: '/well-architected',
    ariaLabel: 'ดูสรุป AWS Well-Architected Framework',
    icon: '🏛️',
    title: 'Well-Architected',
    blurb: '6 pillar, design principles และแบบฝึกจับ pillar',
  },
  {
    to: '/caf',
    ariaLabel: 'ดูสรุป AWS Cloud Adoption Framework',
    icon: '🧭',
    title: 'CAF',
    blurb: '6 perspectives, 4 phases, 4 domains และตารางเทียบกับ WAF',
  },
  {
    to: '/pricing',
    ariaLabel: 'เข้าหน้าเรียนรู้เรื่องราคาและค่าใช้จ่าย',
    icon: '💰',
    title: 'Pricing',
    blurb: 'รูปแบบราคา ตัวเลขที่ต้องจำ และแบบฝึก',
  },
  {
    to: '/support',
    ariaLabel: 'ดูสรุปแผน AWS Support',
    icon: '🛟',
    title: 'Support Plans',
    blurb: 'เทียบแผน support ทั้ง 5 ระดับ พร้อมเกมจำตาราง',
  },
  {
    to: '/responsibility',
    ariaLabel: 'ดูสรุป AWS Shared Responsibility Model',
    icon: '🤝',
    title: 'Shared Responsibility',
    blurb: 'AWS ดูแลอะไร ลูกค้าดูแลอะไร พร้อมเกมจำ',
  },
  {
    to: '/custom-match',
    ariaLabel: 'สร้างเกมจับคู่แบบกำหนดเอง',
    icon: '🎛️',
    title: 'จับคู่กำหนดเอง',
    blurb: 'เลือกเนื้อหาและจำนวนคู่เอง ผสมข้ามหมวดได้',
  },
]

/** Landing screen: mode picker, overall stats, and a quick resume shortcut. */
export function HomePage() {
  const { summary, bestTimeFor, bestScoreFor, resetProgress, leaderboardFor, clearLeaderboard } =
    useProgress()

  const [boardMode, setBoardMode] = useState<MatchMode>('meaning')
  const boardEntries = leaderboardFor(boardMode)
  const totalRuns = MATCH_MODES.reduce((sum, mode) => sum + leaderboardFor(mode).length, 0)

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

      <section aria-label="โหมดหลัก" className="grid gap-4 sm:grid-cols-3">
        {MVP_CARDS.map((card) => (
          <Link
            key={card.to}
            to={card.to}
            aria-label={card.ariaLabel}
            className="group rounded-xl bg-white p-6 shadow-md ring-1 ring-slate-200 transition-shadow hover:shadow-lg"
          >
            <span
              aria-hidden="true"
              className={`grid h-11 w-11 place-items-center rounded-lg text-xl ${card.iconBg}`}
            >
              {card.icon}
            </span>
            <h2 className={`mt-3 text-xl font-bold text-slate-900 ${card.hover}`}>{card.title}</h2>
            <p className="mt-1 text-sm text-slate-600">{card.blurb}</p>
          </Link>
        ))}
      </section>

      <section
        aria-labelledby="more-topics"
        className="rounded-xl bg-white p-5 shadow-md ring-1 ring-slate-200"
      >
        <h2 id="more-topics" className="text-base font-bold text-slate-900">
          เนื้อหาเพิ่มเติม
        </h2>
        <p className="mt-0.5 text-xs text-slate-500">
          สรุปเฉพาะเรื่อง แบบฝึก และควิซ เปิดได้จากเมนู “เพิ่มเติม” ด้านบนด้วย
        </p>
        <ul className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {MORE_CARDS.map((card) => (
            <li key={card.to}>
              <Link
                to={card.to}
                aria-label={card.ariaLabel}
                className="flex items-start gap-3 rounded-lg p-2.5 transition-colors hover:bg-slate-50"
              >
                <span aria-hidden="true" className="text-lg leading-6">
                  {card.icon}
                </span>
                <span>
                  <span className="block text-sm font-semibold text-slate-800">{card.title}</span>
                  <span className="block text-xs text-slate-500">{card.blurb}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
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

        <div role="group" aria-label="เลือกโหมดของกระดานผู้นำ" className="mt-4 flex flex-wrap gap-2">
          {MATCH_MODES.map((mode) => {
            const isActive = mode === boardMode
            const count = leaderboardFor(mode).length

            return (
              <button
                key={mode}
                type="button"
                aria-pressed={isActive}
                aria-label={`ดูกระดานโหมด${MODE_META[mode].label} มี ${count} สถิติ`}
                onClick={() => setBoardMode(mode)}
                className={[
                  'rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-orange-500 text-white'
                    : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-100',
                ].join(' ')}
              >
                โหมด{MODE_META[mode].label}{' '}
                <span className="tabular-nums opacity-80">({count})</span>
              </button>
            )
          })}
        </div>

        <p className="mt-3 text-xs text-slate-400">
          ทุกโหมด {MATCH_PAIR_COUNT} คู่ · เรียงจากเวลาน้อยที่สุด
          ถ้าเวลาเท่ากันคนที่ทายน้อยครั้งกว่าอยู่บน · เก็บสถิติไว้ในเบราว์เซอร์นี้เท่านั้น
        </p>

        <div className="mt-4">
          <Leaderboard entries={boardEntries} mode={boardMode} />
        </div>
      </section>

      <section className="rounded-xl bg-white p-6 shadow-md ring-1 ring-slate-200">
        <h2 className="text-lg font-bold text-slate-900">สถิติของคุณ</h2>

        <dl className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          <div className="rounded-xl bg-indigo-50 px-4 py-3">
            <dt className="text-xs font-medium text-indigo-700">จำได้ดี</dt>
            <dd className="mt-0.5 text-2xl font-bold tabular-nums text-indigo-800">
              {summary.masteredCount}
              <span className="text-sm font-medium text-indigo-500">
                /{summary.totalServices}
              </span>
            </dd>
          </div>
          <div className="rounded-xl bg-amber-50 px-4 py-3">
            <dt className="text-xs font-medium text-amber-700">จำได้กลาง</dt>
            <dd className="mt-0.5 text-2xl font-bold tabular-nums text-amber-800">
              {summary.learningCount}
            </dd>
          </div>
          <div className="rounded-xl bg-red-50 px-4 py-3">
            <dt className="text-xs font-medium text-red-700">จำไม่ได้</dt>
            <dd className="mt-0.5 text-2xl font-bold tabular-nums text-red-800">
              {summary.reviewingCount}
            </dd>
          </div>
          <div className="rounded-xl bg-yellow-50 px-4 py-3">
            <dt className="text-xs font-medium text-yellow-700">ติดดาว ★</dt>
            <dd className="mt-0.5 text-2xl font-bold tabular-nums text-yellow-800">
              {summary.starredCount}
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
        <ul className="mt-2 grid gap-2 sm:grid-cols-2">
          {MATCH_MODES.map((mode) => {
            const time = bestTimeFor(mode)
            const attempts = bestScoreFor(mode)

            return (
              <li key={mode} className="rounded-xl bg-slate-50 px-4 py-3 ring-1 ring-slate-200">
                <p className="text-sm font-semibold text-slate-700">โหมด{MODE_META[mode].label}</p>
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
