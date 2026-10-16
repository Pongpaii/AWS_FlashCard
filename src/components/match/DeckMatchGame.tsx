import { useMemo, useState } from 'react'
import { PAIR_COUNT_OPTIONS, pairsForGroups } from '../../data/matchDecks'
import { useCustomMatch } from '../../hooks/useCustomMatch'
import type { MatchGroup } from '../../types'
import { CustomMatchBoard } from './CustomMatchBoard'

interface DeckMatchGameProps {
  /** Groups offered here; all are selected to begin with. */
  groups: MatchGroup[]
  defaultPairCount?: number
}

/**
 * A match game scoped to one topic: pick which groups to include, pick how many
 * pairs, play. Same engine as the full custom builder, just fewer choices, so it
 * can be embedded inside a topic page.
 */
export function DeckMatchGame({ groups, defaultPairCount = 6 }: DeckMatchGameProps) {
  const { state, hasStarted, finalSeconds, stars, startGame, selectCard, replay, resetGame } =
    useCustomMatch()

  const [selectedIds, setSelectedIds] = useState<string[]>(() => groups.map((group) => group.id))
  const [requestedPairs, setRequestedPairs] = useState(defaultPairCount)

  const pairs = useMemo(() => pairsForGroups(selectedIds), [selectedIds])
  const dealt = Math.min(requestedPairs, pairs.length)
  const canStart = pairs.length >= 3

  const selectionLabel = useMemo(() => {
    const labels = selectedIds
      .map((id) => groups.find((group) => group.id === id)?.label)
      .filter((label): label is string => label !== undefined)
    return labels.length === 0 ? 'ยังไม่ได้เลือกชุด' : `${labels.join(' + ')} · ${dealt} คู่`
  }, [selectedIds, groups, dealt])

  if (hasStarted) {
    return (
      <CustomMatchBoard
        state={state}
        finalSeconds={finalSeconds}
        stars={stars}
        selectionLabel={selectionLabel}
        onSelectCard={selectCard}
        onReplay={replay}
        onBackToBuilder={resetGame}
      />
    )
  }

  return (
    <section className="rounded-xl bg-white p-5 shadow-md ring-1 ring-slate-200">
      <h2 className="text-lg font-bold text-slate-900">เกมจับคู่เรื่องราคา</h2>
      <p className="mt-1 text-sm text-slate-600">
        เลือกชุดที่อยากฝึกแล้วกดเริ่ม รอบนี้ไม่บันทึกลงกระดานผู้นำ ฝึกซ้ำได้ไม่จำกัด
      </p>

      <ul className="mt-4 grid gap-2 sm:grid-cols-3">
        {groups.map((group) => {
          const isChecked = selectedIds.includes(group.id)
          return (
            <li key={group.id}>
              <label
                className={[
                  'flex h-full cursor-pointer items-start gap-3 rounded-lg p-3 ring-1 transition-colors',
                  isChecked
                    ? 'bg-emerald-50 ring-emerald-300'
                    : 'bg-white ring-slate-200 hover:bg-slate-50',
                ].join(' ')}
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() =>
                    setSelectedIds((current) =>
                      current.includes(group.id)
                        ? current.filter((id) => id !== group.id)
                        : [...current, group.id],
                    )
                  }
                  aria-label={`เลือกชุด ${group.label} มี ${group.pairs.length} คู่`}
                  className="mt-0.5 h-4 w-4 shrink-0 accent-emerald-600"
                />
                <span className="min-w-0">
                  <span className="block text-sm font-semibold text-slate-800">{group.label}</span>
                  <span className="block text-xs text-slate-500">{group.hint}</span>
                  <span className="mt-0.5 block text-xs font-semibold tabular-nums text-slate-400">
                    {group.pairs.length} คู่
                  </span>
                </span>
              </label>
            </li>
          )
        })}
      </ul>

      <div role="group" aria-label="เลือกจำนวนคู่" className="mt-4 flex flex-wrap gap-2">
        {PAIR_COUNT_OPTIONS.map((count) => {
          const isActive = count === requestedPairs
          return (
            <button
              key={count}
              type="button"
              aria-pressed={isActive}
              aria-label={`เล่น ${count} คู่`}
              onClick={() => setRequestedPairs(count)}
              className={[
                'rounded-full px-4 py-1.5 text-sm font-semibold tabular-nums transition-colors',
                isActive
                  ? 'bg-orange-500 text-white'
                  : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-100',
              ].join(' ')}
            >
              {count} คู่
            </button>
          )
        })}
      </div>

      <p className="mt-3 text-sm text-slate-600">
        คลังรวม <strong className="tabular-nums text-slate-800">{pairs.length}</strong> คู่ ·
        จะแจกจริง <strong className="tabular-nums text-emerald-700">{dealt}</strong> คู่ (
        {dealt * 2} การ์ด)
      </p>

      <button
        type="button"
        disabled={!canStart}
        onClick={() => startGame(pairs, requestedPairs)}
        aria-label="เริ่มเกมจับคู่เรื่องราคา"
        className="mt-4 rounded-lg bg-orange-500 px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-orange-600 disabled:bg-slate-200 disabled:text-slate-400"
      >
        เริ่มเล่น
      </button>

      {!canStart && (
        <p role="status" className="mt-3 text-sm text-amber-700">
          ต้องมีอย่างน้อย 3 คู่จึงจะเริ่มได้ ติ๊กเพิ่มอีกชุด
        </p>
      )}
    </section>
  )
}
