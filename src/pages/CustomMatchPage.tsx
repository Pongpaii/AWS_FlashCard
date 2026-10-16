import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { CustomMatchBoard } from '../components/match/CustomMatchBoard'
import {
  MATCH_PRESETS,
  PAIR_COUNT_OPTIONS,
  matchDecks,
  matchGroupById,
  pairsForGroups,
} from '../data/matchDecks'
import { useCustomMatch } from '../hooks/useCustomMatch'

/** Smallest board worth dealing. */
const MIN_PAIRS = 3

/**
 * Custom match builder: pick any combination of groups across decks (services,
 * Well-Architected, CAF, pricing), pick how many pairs, then play.
 */
export function CustomMatchPage() {
  const { state, hasStarted, finalSeconds, stars, startGame, selectCard, replay, resetGame } =
    useCustomMatch()

  const [activeDeckId, setActiveDeckId] = useState(matchDecks[0]?.id ?? 'services')
  const [selectedGroupIds, setSelectedGroupIds] = useState<string[]>(['wa-pillars'])
  const [requestedPairs, setRequestedPairs] = useState(6)

  const activeDeck = matchDecks.find((deck) => deck.id === activeDeckId) ?? matchDecks[0]
  const selectedPairs = useMemo(() => pairsForGroups(selectedGroupIds), [selectedGroupIds])

  const available = selectedPairs.length
  const dealtPairs = Math.min(requestedPairs, available)
  const canStart = available >= MIN_PAIRS

  const selectionLabel = useMemo(() => {
    const labels = selectedGroupIds
      .map((id) => matchGroupById.get(id)?.label)
      .filter((label): label is string => label !== undefined)

    if (labels.length === 0) return 'ยังไม่ได้เลือกชุดการ์ด'
    if (labels.length <= 2) return `${labels.join(' + ')} · ${dealtPairs} คู่`
    return `${labels[0]} และอีก ${labels.length - 1} ชุด · ${dealtPairs} คู่`
  }, [selectedGroupIds, dealtPairs])

  const toggleGroup = (groupId: string) => {
    setSelectedGroupIds((current) =>
      current.includes(groupId)
        ? current.filter((id) => id !== groupId)
        : [...current, groupId],
    )
  }

  const selectWholeDeck = (deckId: string) => {
    const deck = matchDecks.find((item) => item.id === deckId)
    if (deck === undefined) return
    setSelectedGroupIds(deck.groups.map((group) => group.id))
  }

  const handleStart = () => {
    if (!canStart) return
    startGame(selectedPairs, requestedPairs)
  }

  const handlePreset = (groupIds: string[], pairCount: number) => {
    setSelectedGroupIds(groupIds)
    setRequestedPairs(pairCount)
    startGame(pairsForGroups(groupIds), pairCount)
  }

  if (hasStarted) {
    return (
      <div className="flex flex-col gap-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            เกมจับคู่แบบกำหนดเอง
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            คลิกการ์ดฝั่งชื่อแล้วคลิกการ์ดฝั่งความหมายที่คู่กัน จับคู่ครบเร็วและทายพลาดน้อย
            ยิ่งได้ดาวมาก
          </p>
        </div>

        <CustomMatchBoard
          state={state}
          finalSeconds={finalSeconds}
          stars={stars}
          selectionLabel={selectionLabel}
          onSelectCard={selectCard}
          onReplay={replay}
          onBackToBuilder={resetGame}
        />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          เกมจับคู่แบบกำหนดเอง
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          เลือกได้เองว่าจะจับคู่เรื่องอะไร ผสมข้ามหมวดและข้ามกรอบแนวคิดได้ ทั้ง AWS Services,
          Well-Architected, Cloud Adoption Framework และ Pricing รอบนี้ไม่บันทึกลงกระดานผู้นำ
          จึงฝึกซ้ำได้ตามใจ
        </p>
      </div>

      <section className="rounded-xl bg-white p-5 shadow-md ring-1 ring-slate-200">
        <h2 className="text-lg font-bold text-slate-900">เริ่มเร็วด้วยชุดที่จัดไว้ให้</h2>
        <p className="mt-1 text-sm text-slate-500">
          กดปุ่มเดียวแล้วเล่นได้เลย เหมาะกับตอนที่อยากทวนเรื่องใดเรื่องหนึ่งแบบเร็ว ๆ
        </p>
        <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {MATCH_PRESETS.map((preset) => {
            const count = pairsForGroups(preset.groupIds).length
            return (
              <button
                key={preset.id}
                type="button"
                aria-label={`เริ่มเกม ${preset.label} จำนวน ${Math.min(preset.pairCount, count)} คู่`}
                onClick={() => handlePreset(preset.groupIds, preset.pairCount)}
                className="rounded-xl bg-white p-4 text-left ring-2 ring-slate-200 transition-colors hover:bg-indigo-50 hover:ring-indigo-300"
              >
                <p className="text-sm font-bold text-slate-900">{preset.label}</p>
                <p className="mt-0.5 text-xs leading-relaxed text-slate-500">{preset.blurb}</p>
                <p className="mt-2 text-xs font-semibold text-indigo-600">
                  {Math.min(preset.pairCount, count)} คู่ · คลังมี {count} คู่
                </p>
              </button>
            )
          })}
        </div>
      </section>

      <section className="rounded-xl bg-white p-5 shadow-md ring-1 ring-slate-200">
        <h2 className="text-lg font-bold text-slate-900">1. เลือกเรื่องที่จะจับคู่</h2>
        <p className="mt-1 text-sm text-slate-500">
          ติ๊กได้หลายชุดพร้อมกัน ระบบจะสุ่มการ์ดจากทุกชุดที่เลือกมารวมกันในกระดานเดียว
        </p>

        <div
          role="tablist"
          aria-label="เลือกกลุ่มเนื้อหา"
          className="mt-4 flex flex-wrap gap-2 border-b border-slate-200 pb-3"
        >
          {matchDecks.map((deck) => {
            const isActive = deck.id === activeDeckId
            const pickedInDeck = deck.groups.filter((group) =>
              selectedGroupIds.includes(group.id),
            ).length

            return (
              <button
                key={deck.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveDeckId(deck.id)}
                className={[
                  'rounded-full px-3.5 py-1.5 text-sm font-semibold transition-colors',
                  isActive
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-100',
                ].join(' ')}
              >
                {deck.label}
                {pickedInDeck > 0 && (
                  <span className="ml-1.5 tabular-nums opacity-80">({pickedInDeck})</span>
                )}
              </button>
            )
          })}
        </div>

        {activeDeck !== undefined && (
          <div className="mt-4">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <p className="text-sm text-slate-600">{activeDeck.description}</p>
              <button
                type="button"
                aria-label={`เลือกทุกชุดในกลุ่ม ${activeDeck.label}`}
                onClick={() => selectWholeDeck(activeDeck.id)}
                className="text-xs font-semibold text-indigo-600 underline decoration-dotted hover:text-indigo-800"
              >
                เลือกทุกชุดในกลุ่มนี้
              </button>
            </div>

            <ul className="mt-3 grid gap-2 sm:grid-cols-2">
              {activeDeck.groups.map((group) => {
                const isChecked = selectedGroupIds.includes(group.id)
                return (
                  <li key={group.id}>
                    <label
                      className={[
                        'flex h-full cursor-pointer items-start gap-3 rounded-lg p-3 ring-1 transition-colors',
                        isChecked
                          ? 'bg-indigo-50 ring-indigo-300'
                          : 'bg-white ring-slate-200 hover:bg-slate-50',
                      ].join(' ')}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleGroup(group.id)}
                        aria-label={`เลือกชุด ${group.label} มี ${group.pairs.length} คู่`}
                        className="mt-0.5 h-4 w-4 shrink-0 accent-indigo-600"
                      />
                      <span className="min-w-0">
                        <span className="block text-sm font-semibold text-slate-800">
                          {group.label}
                        </span>
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
          </div>
        )}
      </section>

      <section className="rounded-xl bg-white p-5 shadow-md ring-1 ring-slate-200">
        <h2 className="text-lg font-bold text-slate-900">2. เลือกจำนวนคู่แล้วเริ่มเล่น</h2>
        <p className="mt-1 text-sm text-slate-500">
          ถ้าคลังที่เลือกมีการ์ดน้อยกว่าที่ตั้งไว้ ระบบจะใช้เท่าที่มีทั้งหมด
        </p>

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

        <p className="mt-4 text-sm text-slate-600">
          เลือกไว้ <strong className="tabular-nums text-slate-800">{selectedGroupIds.length}</strong>{' '}
          ชุด · คลังรวม <strong className="tabular-nums text-slate-800">{available}</strong> คู่ ·
          จะแจกจริง <strong className="tabular-nums text-indigo-700">{dealtPairs}</strong> คู่ (
          {dealtPairs * 2} การ์ด)
        </p>

        {!canStart && (
          <p
            role="status"
            className="mt-3 rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-900 ring-1 ring-amber-200"
          >
            ต้องมีอย่างน้อย {MIN_PAIRS} คู่จึงจะเริ่มได้ ติ๊กเพิ่มอีกชุดหรือเลือกชุดที่มีการ์ดมากกว่านี้
          </p>
        )}

        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            disabled={!canStart}
            onClick={handleStart}
            aria-label="เริ่มเกมจับคู่ตามที่เลือก"
            className="rounded-lg bg-orange-500 px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-orange-600 disabled:bg-slate-200 disabled:text-slate-400"
          >
            เริ่มเล่น
          </button>
          <button
            type="button"
            onClick={() => setSelectedGroupIds([])}
            aria-label="ล้างชุดการ์ดที่เลือกทั้งหมด"
            className="rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 ring-1 ring-slate-200 transition-colors hover:bg-slate-100"
          >
            ล้างที่เลือก
          </button>
        </div>
      </section>

      <div className="rounded-xl bg-white p-5 text-center shadow-md ring-1 ring-slate-200">
        <p className="text-sm font-medium text-slate-700">
          อยากอ่านทวนก่อนเล่น ไปหน้าสรุปได้เลย
        </p>
        <div className="mt-3 flex flex-wrap justify-center gap-2">
          <Link
            to="/well-architected"
            className="rounded-lg bg-white px-4 py-2 text-sm font-bold text-purple-700 ring-1 ring-purple-200 transition-colors hover:bg-purple-50"
          >
            Well-Architected
          </Link>
          <Link
            to="/caf"
            className="rounded-lg bg-white px-4 py-2 text-sm font-bold text-indigo-700 ring-1 ring-indigo-200 transition-colors hover:bg-indigo-50"
          >
            Cloud Adoption Framework
          </Link>
          <Link
            to="/match"
            className="rounded-lg bg-white px-4 py-2 text-sm font-bold text-slate-700 ring-1 ring-slate-200 transition-colors hover:bg-slate-100"
          >
            เกมจับคู่แบบเก็บสถิติ
          </Link>
        </div>
      </div>
    </div>
  )
}
