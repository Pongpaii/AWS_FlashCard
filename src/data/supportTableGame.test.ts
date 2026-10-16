import { describe, expect, it } from 'vitest'
import { matchGroupById, pairsForGroups } from './matchDecks'
import { OWNER_IDS, responsibilityItems } from './sharedResponsibility'
import {
  NOT_COVERED,
  SUPPORT_TABLES,
  blankableCells,
  choicesForRow,
  dealBlanks,
} from './supportTableGame'

/** Deterministic rng so dealing is reproducible. */
function seeded(seed: number) {
  let state = seed
  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296
    return state / 4294967296
  }
}

describe('shared responsibility data', () => {
  it('drill items have unique ids and tasks and cover every owner', () => {
    expect(new Set(responsibilityItems.map((item) => item.id)).size).toBe(responsibilityItems.length)
    expect(new Set(responsibilityItems.map((item) => item.task)).size).toBe(
      responsibilityItems.length,
    )
    for (const owner of OWNER_IDS) {
      expect(responsibilityItems.some((item) => item.owner === owner)).toBe(true)
    }
  })

  it('match groups exist and have unique terms and meanings', () => {
    for (const id of ['srm-concepts', 'srm-services']) expect(matchGroupById.has(id)).toBe(true)
    const pairs = pairsForGroups(['srm-concepts', 'srm-services'])
    expect(pairs.length).toBeGreaterThanOrEqual(8)
    expect(new Set(pairs.map((pair) => pair.pairId)).size).toBe(pairs.length)
    expect(new Set(pairs.map((pair) => pair.meaning)).size).toBe(pairs.length)
  })
})

describe('support table game', () => {
  it('maps uncovered severities and boolean features to text', () => {
    const basic = SUPPORT_TABLES.response.rows.map((row) => row.values.basic)
    expect(basic.every((value) => value === NOT_COVERED)).toBe(true)
    expect(SUPPORT_TABLES.response.rows.find((row) => row.id === 'business-critical-down')?.values.enterprise).toBe(
      'ภายใน 15 นาที',
    )
  })

  it('never blanks placeholder cells', () => {
    const cells = blankableCells(['features'])
    expect(cells.every((cell) => cell.answer !== '—')).toBe(true)
  })

  it('choices always include the answer exactly once and offer real alternatives', () => {
    for (const table of Object.values(SUPPORT_TABLES)) {
      for (const row of table.rows) {
        const choices = choicesForRow(table, row)
        expect(new Set(choices).size).toBe(choices.length)
        expect(choices.length).toBeGreaterThanOrEqual(2)
        for (const value of Object.values(row.values)) {
          if (value !== '—') expect(choices).toContain(value)
        }
      }
    }
  })

  it('deals the requested number of unique blanks in reading order', () => {
    const all = blankableCells(['response', 'features'])
    const blanks = dealBlanks(['response', 'features'], 12, seeded(7))
    expect(blanks).toHaveLength(12)
    expect(new Set(blanks.map((blank) => blank.key)).size).toBe(12)
    const positions = blanks.map((blank) => all.findIndex((cell) => cell.key === blank.key))
    expect([...positions].sort((a, b) => a - b)).toEqual(positions)
    for (const blank of blanks) {
      expect(blank.choices.filter((choice) => choice === blank.answer)).toHaveLength(1)
    }
  })

  it("'all' blanks every eligible cell and counts are clamped", () => {
    expect(dealBlanks(['response'], 'all')).toHaveLength(blankableCells(['response']).length)
    expect(dealBlanks(['response'], 999)).toHaveLength(25)
    expect(dealBlanks(['response'], 0)).toHaveLength(0)
  })
})
