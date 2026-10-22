import { ArrowLeft, FileQuestion } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAppContext } from '../context/useAppContext.js'
import { getHomePathForRole } from '../utils/navigation.js'

export function NotFoundPage() {
  const { currentUser } = useAppContext()
  const destination = currentUser
    ? getHomePathForRole(currentUser.role)
    : '/login'

  return (
    <main className="status-page">
      <section className="status-card" aria-labelledby="not-found-title">
        <div className="status-card__icon" aria-hidden="true">
          <FileQuestion size={30} />
        </div>
        <span className="status-code">404</span>
        <h1 id="not-found-title">ไม่พบหน้าที่ต้องการ</h1>
        <p>URL นี้ไม่มีอยู่ในระบบต้นแบบ กรุณากลับไปยังหน้าหลัก</p>
        <Link className="primary-link" to={destination}>
          <ArrowLeft size={18} aria-hidden="true" />
          {currentUser ? 'กลับไปหน้า Dashboard' : 'กลับไปหน้า Login'}
        </Link>
      </section>
    </main>
  )
}
