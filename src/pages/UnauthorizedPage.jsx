import { ArrowLeft, ShieldX } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { useAppContext } from '../context/useAppContext.js'
import { getHomePathForRole } from '../utils/navigation.js'

export function UnauthorizedPage() {
  const { currentUser } = useAppContext()
  const location = useLocation()
  const homePath = getHomePathForRole(currentUser?.role)

  return (
    <main className="status-page">
      <section className="status-card" aria-labelledby="unauthorized-title">
        <div className="status-card__icon status-card__icon--warning" aria-hidden="true">
          <ShieldX size={30} />
        </div>
        <span className="status-code">403</span>
        <h1 id="unauthorized-title">ไม่มีสิทธิ์เข้าถึงหน้านี้</h1>
        <p>
          บัญชี {currentUser?.role ?? 'ปัจจุบัน'} ไม่มีสิทธิ์เปิดเส้นทาง
          {location.state?.requestedPath && (
            <code>{location.state.requestedPath}</code>
          )}
        </p>
        <Link className="primary-link" to={homePath}>
          <ArrowLeft size={18} aria-hidden="true" />
          กลับไปหน้า Dashboard
        </Link>
      </section>
    </main>
  )
}
