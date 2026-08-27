import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { CategoryFilter } from '../components/flashcard/CategoryFilter'
import { ServiceArticle } from '../components/learn/ServiceArticle'
import {
  CATEGORY_LABELS_TH,
  CATEGORY_STYLES,
  awsServices,
  categoryCounts,
} from '../data/awsServices'
import { useProgress } from '../hooks/useProgress'
import type { AWSService, Category, CategoryFilterValue } from '../types'
import { CATEGORIES } from '../types'

/** Case-insensitive substring search across every readable field. */
function matchesQuery(service: AWSService, query: string): boolean {
  if (query === '') return true
  const haystack = [
    service.name,
    service.fullName,
    service.category,
    service.description,
    service.answer,
    service.hint,
    service.examTips ?? '',
  ]
    .join(' ')
    .toLowerCase()

  return haystack.includes(query)
}

/** Reading mode: the whole dataset as study notes, grouped by category. */
export function LearnPage() {
  const { progress } = useProgress()

  const [category, setCategory] = useState<CategoryFilterValue>('all')
  const [query, setQuery] = useState('')

  const masteredSet = useMemo(
    () => new Set(progress.flashCards.mastered),
    [progress.flashCards.mastered],
  )
  const reviewingSet = useMemo(
    () => new Set(progress.flashCards.reviewing),
    [progress.flashCards.reviewing],
  )

  const normalizedQuery = query.trim().toLowerCase()

  const visible = useMemo(
    () =>
      awsServices.filter(
        (service) =>
          (category === 'all' || service.category === category) &&
          matchesQuery(service, normalizedQuery),
      ),
    [category, normalizedQuery],
  )

  // Group into the categories that actually have results, keeping the canonical order.
  const groups = useMemo(() => {
    const byCategory = new Map<Category, AWSService[]>()
    for (const service of visible) {
      const list = byCategory.get(service.category)
      if (list === undefined) {
        byCategory.set(service.category, [service])
      } else {
        list.push(service)
      }
    }
    return CATEGORIES.filter((item) => byCategory.has(item)).map((item) => ({
      category: item,
      services: byCategory.get(item) ?? [],
    }))
  }, [visible])

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">เรียนรู้</h1>
        <p className="mt-1 text-sm text-slate-600">
          อ่านทบทวน AWS Services ทั้ง {categoryCounts.all} ตัวที่ออกสอบ CLF-C02 แยกตามหมวด
          แต่ละตัวมีหน้าที่หลัก เคล็ดลับจำ และจุดที่มักออกสอบ
        </p>
      </div>

      <div className="flex flex-col gap-4 rounded-xl bg-white p-5 shadow-md ring-1 ring-slate-200">
        <label className="block">
          <span className="sr-only">ค้นหาบริการ</span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="ค้นหาชื่อบริการ คำอธิบาย หรือคำว่า serverless, DDoS, ย้ายข้อมูล…"
            aria-label="ค้นหาบริการ AWS จากชื่อหรือคำอธิบาย"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 placeholder:text-slate-400"
          />
        </label>

        <CategoryFilter counts={categoryCounts} selected={category} onSelect={setCategory} />

        <p className="text-sm text-slate-500" role="status">
          แสดง <strong className="tabular-nums text-slate-700">{visible.length}</strong> บริการ
          {normalizedQuery !== '' && <> จากคำค้น “{query.trim()}”</>}
        </p>
      </div>

      {visible.length === 0 ? (
        <div className="rounded-xl bg-white p-10 text-center shadow-md ring-1 ring-slate-200">
          <p className="text-lg font-semibold text-slate-800">ไม่พบบริการที่ตรงกับคำค้น</p>
          <p className="mt-1 text-sm text-slate-500">
            ลองใช้คำที่สั้นลง หรือล้างตัวกรองหมวดเพื่อดูทั้งหมด
          </p>
          <button
            type="button"
            aria-label="ล้างคำค้นและตัวกรองหมวด"
            onClick={() => {
              setQuery('')
              setCategory('all')
            }}
            className="mt-5 rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-orange-600"
          >
            ล้างตัวกรอง
          </button>
        </div>
      ) : (
        groups.map((group) => (
          <section key={group.category} className="flex flex-col gap-3">
            <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900">
              <span
                aria-hidden="true"
                className={`h-3 w-3 rounded-full ${CATEGORY_STYLES[group.category].dot}`}
              />
              {CATEGORY_LABELS_TH[group.category]}
              <span className="text-sm font-normal text-slate-500">
                {group.category} · {group.services.length} บริการ
              </span>
            </h2>

            <div className="grid gap-3 lg:grid-cols-2">
              {group.services.map((service) => (
                <ServiceArticle
                  key={service.id}
                  service={service}
                  status={
                    masteredSet.has(service.id)
                      ? 'mastered'
                      : reviewingSet.has(service.id)
                        ? 'reviewing'
                        : 'untouched'
                  }
                />
              ))}
            </div>
          </section>
        ))
      )}

      <div className="rounded-xl bg-indigo-50 p-5 text-center ring-1 ring-indigo-100">
        <p className="text-sm font-medium text-indigo-900">อ่านจบแล้ว ลองวัดความแม่นดู</p>
        <div className="mt-3 flex flex-wrap justify-center gap-2">
          <Link
            to="/flashcards"
            className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-orange-600"
          >
            ไปทำ Flash Cards
          </Link>
          <Link
            to="/match"
            className="rounded-lg bg-white px-4 py-2 text-sm font-bold text-indigo-700 ring-1 ring-indigo-200 transition-colors hover:bg-indigo-100"
          >
            เล่นเกมจับคู่
          </Link>
        </div>
      </div>
    </div>
  )
}
