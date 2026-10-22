import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAppContext } from '../context/useAppContext.js'

export function ProtectedRoute() {
  const { currentUser } = useAppContext()
  const location = useLocation()

  if (!currentUser) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ requestedPath: location.pathname }}
      />
    )
  }

  return <Outlet />
}
