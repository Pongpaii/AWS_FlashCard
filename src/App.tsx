import { Navigate, Route, Routes } from 'react-router-dom'
import { Header } from './components/layout/Header'
import { ProgressProvider } from './hooks/ProgressProvider'
import { useProgress } from './hooks/useProgress'
import { FlashCardPage } from './pages/FlashCardPage'
import { HomePage } from './pages/HomePage'
import { MatchGamePage } from './pages/MatchGamePage'

/** Shell that renders the header and the routed page. */
function AppShell() {
  const { summary } = useProgress()

  return (
    <div className="min-h-screen bg-slate-50">
      <Header masteredCount={summary.masteredCount} totalCount={summary.totalServices} />

      <main className="mx-auto max-w-6xl px-4 py-6 sm:py-8">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/flashcards" element={<FlashCardPage />} />
          <Route path="/match" element={<MatchGamePage />} />
          {/* Unknown paths fall back to the landing page. */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <footer className="mx-auto max-w-6xl px-4 pb-8 text-center text-xs text-slate-400">
        ข้อมูลอ้างอิงสำหรับเตรียมสอบ AWS Certified Cloud Practitioner (CLF-C02) ·
        ความก้าวหน้าถูกเก็บในเบราว์เซอร์ของคุณเท่านั้น
      </footer>
    </div>
  )
}

export default function App() {
  return (
    <ProgressProvider>
      <AppShell />
    </ProgressProvider>
  )
}
