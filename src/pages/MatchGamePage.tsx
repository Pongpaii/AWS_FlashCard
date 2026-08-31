import { Link, useNavigate } from 'react-router-dom'
import { MatchGame } from '../components/match/MatchGame'
import { awsServices } from '../data/awsServices'

/** Match Game screen. */
export function MatchGamePage() {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">เกมจับคู่</h1>
        <p className="mt-1 text-sm text-slate-600">
          การ์ดทุกใบแสดงให้เห็นตั้งแต่แรก คลิกชื่อ service แล้วคลิกคำอธิบายที่คู่กัน
          จับคู่ครบเร็วและทายพลาดน้อย ยิ่งได้ดาวมาก
        </p>
      </div>

      <p className="rounded-lg bg-indigo-50 px-4 py-3 text-sm text-indigo-900 ring-1 ring-indigo-100">
        โหมดนี้เก็บสถิติลงกระดานผู้นำ ถ้าอยากเลือกเนื้อหาเองหรือจับคู่เรื่อง Well-Architected, CAF
        และ Pricing ให้ไปที่{' '}
        <Link to="/custom-match" className="font-semibold underline decoration-dotted">
          เกมจับคู่แบบกำหนดเอง
        </Link>
      </p>

      <MatchGame services={awsServices} onBackHome={() => navigate('/')} />
    </div>
  )
}
