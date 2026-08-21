import { memo } from 'react'
import type { MatchCard as MatchCardModel } from '../../types'

interface MatchCardProps {
  card: MatchCardModel
  isSelected: boolean
  /** True while this tile is flagged as part of a wrong pick. */
  isWrong: boolean
  onSelect: (cardId: string) => void
}

/**
 * One board tile. Every tile shows its content from the start, so matching is
 * about reading and pairing rather than remembering positions.
 *
 * Memoised because a hard board renders 16 tiles and only a couple change per
 * selection.
 */
export const MatchCard = memo(function MatchCard({
  card,
  isSelected,
  isWrong,
  onSelect,
}: MatchCardProps) {
  // Solved tiles leave their grid slot in place so the board never reflows.
  if (card.isMatched) {
    return (
      <div
        aria-hidden="true"
        className="min-h-[8.5rem] rounded-xl border-2 border-dashed border-green-200 bg-green-50/40 transition-opacity duration-300"
      />
    )
  }

  const stateClasses = isWrong
    ? 'animate-shake border-red-400 bg-red-50 ring-2 ring-red-300'
    : isSelected
      ? 'border-orange-400 bg-orange-50 ring-2 ring-orange-300'
      : 'border-slate-200 bg-white hover:border-indigo-300 hover:bg-indigo-50/40'

  return (
    <button
      type="button"
      aria-pressed={isSelected}
      aria-label={
        card.type === 'service'
          ? `ชื่อบริการ ${card.content}${card.subtitle === undefined ? '' : ` (${card.subtitle})`}`
          : `คำอธิบาย ${card.content}`
      }
      onClick={() => onSelect(card.id)}
      className={[
        'flex min-h-[8.5rem] flex-col items-center justify-center gap-1 rounded-xl border-2 p-3 text-center shadow-sm transition-colors duration-150',
        stateClasses,
      ].join(' ')}
    >
      <span
        className={
          card.type === 'service'
            ? 'text-lg font-bold leading-snug text-slate-900 sm:text-xl'
            : 'text-[13px] leading-relaxed text-slate-700'
        }
      >
        {card.content}
      </span>

      {/* Expanded product name, so abbreviations are learnable in this mode too. */}
      {card.subtitle !== undefined && (
        <span className="text-[11px] font-medium leading-snug text-slate-500">
          {card.subtitle}
        </span>
      )}
    </button>
  )
})
