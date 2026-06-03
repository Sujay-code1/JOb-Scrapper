import { Navigate } from 'react-router-dom'
import { useAppSelector } from '../../hooks/useAppHooks.js'

export default function ProtectedRoute({ children }) {
  const token = useAppSelector((state) => state.auth.token)
  return token ? children : <Navigate to="/login" replace />
}
