import { CATEGORY_LABELS_TH, CATEGORY_STYLES } from '../../data/awsServices'
import type { CategoryFilterValue } from '../../types'
import { CATEGORIES } from '../../types'

interface CategoryFilterProps {
  counts: Record<CategoryFilterValue, number>
  selected: CategoryFilterValue
  onSelect: (category: CategoryFilterValue) => void
}

/** Row of category buttons, each showing how many services it holds. */
export function CategoryFilter({ counts, selected, onSelect }: CategoryFilterProps) {
  return (
    <div role="group" aria-label="กรองการ์ดตามหมวด" className="flex flex-wrap gap-2">
      <button
        type="button"
        aria-pressed={selected === 'all'}
        aria-label={`ดูทั้งหมด ${counts.all} การ์ด`}
        onClick={() => onSelect('all')}
        className={[
          'rounded-full px-3 py-1.5 text-sm font-medium transition-colors',
          selected === 'all'
            ? 'bg-slate-800 text-white'
            : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-100',
        ].join(' ')}
      >
        ทั้งหมด <span className="tabular-nums opacity-80">({counts.all})</span>
      </button>

      {CATEGORIES.map((category) => {
        const isSelected = selected === category
        const style = CATEGORY_STYLES[category]

        return (
          <button
            key={category}
            type="button"
            aria-pressed={isSelected}
            aria-label={`หมวด ${CATEGORY_LABELS_TH[category]} ${counts[category]} การ์ด`}
            onClick={() => onSelect(category)}
            className={[
              'flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-colors',
              isSelected
                ? style.badge
                : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-100',
            ].join(' ')}
          >
            {!isSelected && (
              <span aria-hidden="true" className={`h-2 w-2 rounded-full ${style.dot}`} />
            )}
            {CATEGORY_LABELS_TH[category]}{' '}
            <span className="tabular-nums opacity-80">({counts[category]})</span>
          </button>
        )
      })}
    </div>
  )
}
