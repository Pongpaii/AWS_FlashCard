import type { MasteryLevel, MatchMode } from '../../types'

/** Thai copy for each Match Game mode, shared by every screen that shows it. */
export const MODE_META: Record<MatchMode, { label: string; blurb: string; tone: string }> = {
  meaning: {
    label: 'ความหมาย',
    blurb: 'จับคู่ชื่อ service กับคำอธิบายภาษาไทย',
    tone: 'ring-indigo-300 hover:bg-indigo-50',
  },
  keyword: {
    label: 'จำไปสอบ',
    blurb: 'จับคู่ชื่อ service กับคีย์เวิร์ดที่โจทย์ข้อสอบชอบใช้',
    tone: 'ring-sky-300 hover:bg-sky-50',
  },
}

/** Three-level memory marks, ordered best to worst for button rows. */
export const MASTERY_LEVELS: readonly MasteryLevel[] = ['good', 'medium', 'bad'] as const

export const MASTERY_META: Record<
  MasteryLevel,
  { label: string; active: string; idle: string }
> = {
  good: {
    label: 'จำได้ดี',
    active: 'bg-green-600 text-white ring-green-600',
    idle: 'bg-white text-green-700 ring-green-300 hover:bg-green-50',
  },
  medium: {
    label: 'จำได้กลาง',
    active: 'bg-amber-500 text-white ring-amber-500',
    idle: 'bg-white text-amber-700 ring-amber-300 hover:bg-amber-50',
  },
  bad: {
    label: 'จำไม่ได้',
    active: 'bg-red-600 text-white ring-red-600',
    idle: 'bg-white text-red-700 ring-red-300 hover:bg-red-50',
  },
}
