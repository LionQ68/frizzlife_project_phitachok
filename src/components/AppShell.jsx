import {
  BellRing,
  Gauge,
  LayoutDashboard,
  MonitorCog,
  UsersRound,
} from 'lucide-react'
import { useCallback, useMemo, useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useAppContext } from '../context/useAppContext.js'
import { useMediaQuery } from '../hooks/useMediaQuery.js'
import { Header } from './Header.jsx'
import { Sidebar } from './Sidebar.jsx'

const ADMIN_NAVIGATION = [
  { label: 'ภาพรวมระบบ', to: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'จัดการอุปกรณ์', to: '/admin/devices', icon: Gauge },
  { label: 'จัดการผู้ใช้', to: '/admin/users', icon: UsersRound },
  { label: 'การแจ้งเตือน', to: '/admin/alerts', icon: BellRing },
  { label: 'ตัวจำลองอุปกรณ์', to: '/admin/simulator', icon: MonitorCog },
]

const USER_NAVIGATION = [
  { label: 'ภาพรวมของฉัน', to: '/user/dashboard', icon: LayoutDashboard },
]

const PAGE_TITLES = {
  '/admin/dashboard': 'ภาพรวมระบบ',
  '/admin/devices': 'จัดการอุปกรณ์',
  '/admin/users': 'จัดการผู้ใช้',
  '/admin/alerts': 'การแจ้งเตือนและเหตุการณ์',
  '/admin/simulator': 'ตัวจำลองอุปกรณ์',
  '/user/dashboard': 'ภาพรวมของฉัน',
}

function getPageTitle(pathname) {
  if (pathname.startsWith('/admin/devices/')) {
    return 'รายละเอียดอุปกรณ์'
  }

  return PAGE_TITLES[pathname] ?? 'Frizzlife Smart Water'
}

export function AppShell() {
  const { currentUser, logout } = useAppContext()
  const location = useLocation()
  const navigate = useNavigate()
  const [isNavigationOpen, setIsNavigationOpen] = useState(false)
  const isMobileNavigation = useMediaQuery('(max-width: 900px)')
  const navigationItems = currentUser.role === 'ADMIN'
    ? ADMIN_NAVIGATION
    : USER_NAVIGATION
  const pageTitle = useMemo(
    () => getPageTitle(location.pathname),
    [location.pathname],
  )

  const closeNavigation = useCallback(() => setIsNavigationOpen(false), [])
  const openNavigation = useCallback(() => setIsNavigationOpen(true), [])

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">ข้ามไปเนื้อหาหลัก</a>
      <Sidebar
        isMobile={isMobileNavigation}
        isOpen={isNavigationOpen}
        items={navigationItems}
        onClose={closeNavigation}
        role={currentUser.role}
      />

      <button
        className={`sidebar-overlay${isNavigationOpen ? ' sidebar-overlay--visible' : ''}`}
        type="button"
        aria-hidden="true"
        tabIndex={-1}
        onClick={closeNavigation}
      />

      <div className="shell-workspace">
        <Header
          currentUser={currentUser}
          isNavigationOpen={isNavigationOpen}
          onLogout={handleLogout}
          onMenuClick={openNavigation}
          pageTitle={pageTitle}
        />
        <main className="shell-content" id="main-content" tabIndex={-1}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
