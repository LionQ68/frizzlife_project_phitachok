import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { AppErrorBoundary } from './components/AppErrorBoundary.jsx'
import { AppShell } from './components/AppShell.jsx'
import { PageState } from './components/PageState.jsx'
import { ProtectedRoute } from './components/ProtectedRoute.jsx'
import { RoleRoute } from './components/RoleRoute.jsx'
import { useAppContext } from './context/useAppContext.js'
import { getHomePathForRole } from './utils/navigation.js'

function lazyPage(importPage, exportName) {
  return lazy(() => importPage().then((module) => ({
    default: module[exportName],
  })))
}

const AdminDashboardPage = lazyPage(
  () => import('./pages/AdminDashboardPage.jsx'),
  'AdminDashboardPage',
)
const AlertsPage = lazyPage(() => import('./pages/AlertsPage.jsx'), 'AlertsPage')
const DeviceDetailPage = lazyPage(
  () => import('./pages/DeviceDetailPage.jsx'),
  'DeviceDetailPage',
)
const DevicesPage = lazyPage(() => import('./pages/DevicesPage.jsx'), 'DevicesPage')
const LoginPage = lazyPage(() => import('./pages/LoginPage.jsx'), 'LoginPage')
const NotFoundPage = lazyPage(() => import('./pages/NotFoundPage.jsx'), 'NotFoundPage')
const SimulatorPage = lazyPage(() => import('./pages/SimulatorPage.jsx'), 'SimulatorPage')
const UnauthorizedPage = lazyPage(
  () => import('./pages/UnauthorizedPage.jsx'),
  'UnauthorizedPage',
)
const UserDashboardPage = lazyPage(
  () => import('./pages/UserDashboardPage.jsx'),
  'UserDashboardPage',
)
const UsersPage = lazyPage(() => import('./pages/UsersPage.jsx'), 'UsersPage')

function HomeRedirect() {
  const { currentUser } = useAppContext()
  return <Navigate to={getHomePathForRole(currentUser?.role)} replace />
}

export default function App() {
  return (
    <AppErrorBoundary>
      <Suspense fallback={(
        <main className="route-loading-page" id="main-content">
          <PageState
            type="loading"
            title="กำลังโหลด Dashboard"
            description="กำลังเตรียมหน้าจอและข้อมูลจำลอง กรุณารอสักครู่"
          />
        </main>
      )}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          <Route element={<ProtectedRoute />}>
            <Route index element={<HomeRedirect />} />
            <Route path="/unauthorized" element={<UnauthorizedPage />} />

            <Route element={<RoleRoute allowedRoles={['ADMIN']} />}>
              <Route path="/admin" element={<AppShell />}>
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<AdminDashboardPage />} />
                <Route path="devices" element={<DevicesPage />} />
                <Route path="devices/:deviceId" element={<DeviceDetailPage />} />
                <Route path="users" element={<UsersPage />} />
                <Route path="alerts" element={<AlertsPage />} />
                <Route path="simulator" element={<SimulatorPage />} />
              </Route>
            </Route>

            <Route element={<RoleRoute allowedRoles={['USER']} />}>
              <Route path="/user" element={<AppShell />}>
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<UserDashboardPage />} />
              </Route>
            </Route>
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </AppErrorBoundary>
  )
}
