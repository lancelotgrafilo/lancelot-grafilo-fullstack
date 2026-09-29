import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import LoadingState from './ui/LoadingState.jsx'

export default function RequireAuth() {
  const { user, checking } = useAuth()
  const location = useLocation()

  if (checking) {
    return <LoadingState label="Checking session..." />
  }

  if (!user) {
    return <Navigate to="/admin/login" replace state={{ from: location }} />
  }

  return <Outlet />
}