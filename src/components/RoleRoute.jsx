import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAppContext } from '../context/useAppContext.js'

export function RoleRoute({ allowedRoles }) {
  const { currentUser } = useAppContext()
  const location = useLocation()

  if (!currentUser || !allowedRoles.includes(currentUser.role)) {
    return (
      <Navigate
        to="/unauthorized"
        replace
        state={{ requestedPath: location.pathname }}
      />
    )
  }

  return <Outlet />
}
