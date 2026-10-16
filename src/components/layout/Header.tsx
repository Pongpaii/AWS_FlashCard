import { useEffect, useRef } from 'react'
import { NavLink, useLocation } from 'react-router-dom'

interface HeaderProps {
  masteredCount: number
  totalCount: number
}

/** MVP: the three core study tabs, always visible. */
const MAIN_LINKS = [
  { to: '/', label: 'หน้าแรก' },
  { to: '/learn', label: 'เรียนรู้' },
  { to: '/flashcards', label: 'Flash Cards' },
  { to: '/match', label: 'เกมจับคู่' },
] as const

/** Extra study pages, tucked into the "เพิ่มเติม" menu to keep the bar short. */
const MORE_LINKS = [
  { to: '/quiz', label: 'ควิซ' },
  { to: '/well-architected', label: 'Well-Architected' },
  { to: '/caf', label: 'CAF' },
  { to: '/pricing', label: 'Pricing' },
  { to: '/support', label: 'Support Plans' },
  { to: '/custom-match', label: 'จับคู่กำหนดเอง' },
] as const

const linkClass = ({ isActive }: { isActive: boolean }) =>
  [
    'rounded-lg px-3 py-2 text-sm font-medium transition-colors',
    isActive
      ? 'bg-orange-50 text-orange-600'
      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
  ].join(' ')

/** Sticky top bar with the app title, navigation, and a mastered counter. */
export function Header({ masteredCount, totalCount }: HeaderProps) {
  const { pathname } = useLocation()
  const moreRef = useRef<HTMLDetailsElement>(null)
  const isMoreActive = MORE_LINKS.some((link) => link.to === pathname)

  // Close the "more" menu after navigating, or when clicking anywhere else.
  useEffect(() => {
    moreRef.current?.removeAttribute('open')
  }, [pathname])
  useEffect(() => {
    const close = (event: MouseEvent) => {
      const menu = moreRef.current
      if (menu !== null && !menu.contains(event.target as Node)) menu.removeAttribute('open')
    }
    document.addEventListener('click', close)
    return () => document.removeEventListener('click', close)
  }, [])

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-6 gap-y-3 px-4 py-3">
        <NavLink to="/" className="flex items-center gap-2" aria-label="กลับไปหน้าแรก">
          <span
            aria-hidden="true"
            className="grid h-9 w-9 place-items-center rounded-lg bg-orange-500 text-sm font-bold text-white"
          >
            AWS
          </span>
          <span className="leading-tight">
            <span className="block text-base font-bold text-slate-800">Flash Cards</span>
            <span className="block text-xs text-slate-500">เตรียมสอบ CLF-C02</span>
          </span>
        </NavLink>

        <nav aria-label="เมนูหลัก" className="flex flex-wrap items-center gap-1">
          {MAIN_LINKS.map((link) => (
            <NavLink key={link.to} to={link.to} end={link.to === '/'} className={linkClass}>
              {link.label}
            </NavLink>
          ))}

          <details ref={moreRef} className="relative">
            <summary
              className={[
                'cursor-pointer list-none rounded-lg px-3 py-2 text-sm font-medium transition-colors [&::-webkit-details-marker]:hidden',
                isMoreActive
                  ? 'bg-orange-50 text-orange-600'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
              ].join(' ')}
            >
              เพิ่มเติม <span aria-hidden="true">▾</span>
            </summary>
            <div className="absolute left-0 z-30 mt-1 flex min-w-48 flex-col gap-0.5 rounded-xl bg-white p-1.5 shadow-lg ring-1 ring-slate-200">
              {MORE_LINKS.map((link) => (
                <NavLink key={link.to} to={link.to} className={linkClass}>
                  {link.label}
                </NavLink>
              ))}
            </div>
          </details>
        </nav>

        <p className="ml-auto text-sm text-slate-500">
          จำได้แล้ว{' '}
          <strong className="tabular-nums text-indigo-600">
            {masteredCount}/{totalCount}
          </strong>{' '}
          บริการ
        </p>
      </div>
    </header>
  )
}
