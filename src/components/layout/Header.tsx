import { NavLink } from 'react-router-dom'

interface HeaderProps {
  masteredCount: number
  totalCount: number
}

const LINKS = [
  { to: '/', label: 'หน้าแรก' },
  { to: '/learn', label: 'เรียนรู้' },
  { to: '/flashcards', label: 'Flash Cards' },
  { to: '/quiz', label: 'ควิซ' },
  { to: '/match', label: 'เกมจับคู่' },
] as const

/** Sticky top bar with the app title, navigation, and a mastered counter. */
export function Header({ masteredCount, totalCount }: HeaderProps) {
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

        <nav aria-label="เมนูหลัก" className="flex items-center gap-1">
          {LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) =>
                [
                  'rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-orange-50 text-orange-600'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
                ].join(' ')
              }
            >
              {link.label}
            </NavLink>
          ))}
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
