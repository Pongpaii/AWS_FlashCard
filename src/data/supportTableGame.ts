import type { RandomFn, SupportPlanTier } from '../types'
import { SUPPORT_PLAN_TIERS, SUPPORT_SEVERITIES } from '../types'
import { shuffle } from '../utils/shuffle'
import { SEVERITY_LABELS_TH, supportFeatureRows, supportPlans } from './supportPlans'

/**
 * "Fill in the table" memory game for the two AWS Support plan tables. Cells are
 * blanked at random and the learner picks the right value from a short list.
 * Everything here is pure so the dealing rules can be unit-tested.
 */

export type SupportTableId = 'response' | 'features'

export const SUPPORT_TABLE_IDS: readonly SupportTableId[] = ['response', 'features'] as const

/** Text shown for a severity a plan does not cover. */
export const NOT_COVERED = 'ไม่ครอบคลุม'
/** Text shown for `true` / `false` feature cells. */
export const HAS_FEATURE = 'มี'
export const NO_FEATURE = 'ไม่มี'
/** Placeholder cells that carry no information and are never blanked. */
const PLACEHOLDER = '—'

export interface SupportTableRow {
  id: string
  label: string
  sublabel?: string
  values: Record<SupportPlanTier, string>
}

export interface SupportTable {
  id: SupportTableId
  title: string
  rows: SupportTableRow[]
  /**
   * Extra choices offered on every row of this table on top of the row's own
   * values, so a row with only two distinct values is not a coin flip.
   */
  sharedChoices: string[]
}

function featureText(value: string | boolean): string {
  if (value === true) return HAS_FEATURE
  if (value === false) return NO_FEATURE
  return value
}

const responseRows: SupportTableRow[] = SUPPORT_SEVERITIES.map((severity) => ({
  id: severity,
  label: SEVERITY_LABELS_TH[severity].label,
  sublabel: SEVERITY_LABELS_TH[severity].example.split(' — ')[0],
  values: Object.fromEntries(
    supportPlans.map((plan) => [plan.id, plan.responseTimes[severity] ?? NOT_COVERED]),
  ) as Record<SupportPlanTier, string>,
}))

const featureRows: SupportTableRow[] = supportFeatureRows.map((row, index) => ({
  id: `feature-${index}`,
  label: row.label,
  values: Object.fromEntries(
    SUPPORT_PLAN_TIERS.map((tier) => [tier, featureText(row.values[tier])]),
  ) as Record<SupportPlanTier, string>,
}))

/** Every response time in the table, so any time can be offered on any row. */
const allResponseTimes = [
  ...new Set(responseRows.flatMap((row) => Object.values(row.values))),
]

export const SUPPORT_TABLES: Record<SupportTableId, SupportTable> = {
  response: {
    id: 'response',
    title: 'เวลาตอบกลับตามระดับความรุนแรง',
    rows: responseRows,
    sharedChoices: allResponseTimes,
  },
  features: {
    id: 'features',
    title: 'สิทธิ์ที่ได้ในแต่ละแผน',
    rows: featureRows,
    sharedChoices: [HAS_FEATURE, NO_FEATURE],
  },
}

/** One blanked cell the learner has to fill. */
export interface TableBlank {
  /** Unique across both tables. */
  key: string
  tableId: SupportTableId
  rowId: string
  planId: SupportPlanTier
  answer: string
  /** Shuffled options; always contains `answer` exactly once. */
  choices: string[]
}

export function cellKey(tableId: SupportTableId, rowId: string, planId: SupportPlanTier): string {
  return `${tableId}:${rowId}:${planId}`
}

/** Options for one row: its own distinct values plus the table's shared ones. */
export function choicesForRow(table: SupportTable, row: SupportTableRow): string[] {
  const own = Object.values(row.values).filter((value) => value !== PLACEHOLDER)
  return [...new Set([...own, ...table.sharedChoices])]
}

/** Every cell of the given tables that may be blanked, in table order. */
export function blankableCells(tableIds: readonly SupportTableId[]): Omit<TableBlank, 'choices'>[] {
  return tableIds.flatMap((tableId) =>
    SUPPORT_TABLES[tableId].rows.flatMap((row) =>
      SUPPORT_PLAN_TIERS.filter((tier) => row.values[tier] !== PLACEHOLDER).map((tier) => ({
        key: cellKey(tableId, row.id, tier),
        tableId,
        rowId: row.id,
        planId: tier,
        answer: row.values[tier],
      })),
    ),
  )
}

/**
 * Picks `count` random cells (or every cell for `'all'`) and returns them in
 * reading order — table, then row, then plan — so the game walks the table
 * top-left to bottom-right instead of jumping around.
 */
export function dealBlanks(
  tableIds: readonly SupportTableId[],
  count: number | 'all',
  rng: RandomFn = Math.random,
): TableBlank[] {
  const cells = blankableCells(tableIds)
  const order = new Map(cells.map((cell, index) => [cell.key, index]))
  const picked =
    count === 'all' ? cells : shuffle(cells, rng).slice(0, Math.max(0, Math.min(count, cells.length)))

  return [...picked]
    .sort((a, b) => (order.get(a.key) ?? 0) - (order.get(b.key) ?? 0))
    .map((cell) => {
      const table = SUPPORT_TABLES[cell.tableId]
      const row = table.rows.find((item) => item.id === cell.rowId)
      const choices = row === undefined ? [cell.answer] : choicesForRow(table, row)
      return { ...cell, choices: shuffle(choices, rng) }
    })
}
