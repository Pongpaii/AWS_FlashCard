import { useCallback, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { FlashCardDeck } from '../components/flashcard/FlashCardDeck'
import { awsServices } from '../data/awsServices'
import type { DeckMode } from '../types'

/** Flash Card screen. The `?mode=review` query param starts in review mode. */
export function FlashCardPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [mode, setMode] = useState<DeckMode>(
    searchParams.get('mode') === 'review' ? 'review' : 'all',
  )

  // Keep the URL in sync so the current mode stays bookmarkable.
  const handleModeChange = useCallback(
    (nextMode: DeckMode) => {
      setMode(nextMode)
      setSearchParams(nextMode === 'review' ? { mode: 'review' } : {}, { replace: true })
    },
    [setSearchParams],
  )

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Flash Cards</h1>
        <p className="mt-1 text-sm text-slate-600">
          {mode === 'review'
            ? 'กำลังทบทวนเฉพาะการ์ดที่ยังไม่ถูกทำเครื่องหมายว่าจำได้'
            : 'พลิกการ์ดเพื่อดูคำตอบ แล้วบอกระบบว่าจำได้หรือยังไม่แม่น'}
        </p>
      </div>

      <FlashCardDeck services={awsServices} mode={mode} onModeChange={handleModeChange} />
    </div>
  )
}
