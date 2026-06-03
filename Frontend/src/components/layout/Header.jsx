import { Link, useNavigate } from 'react-router-dom'
import { useAppDispatch } from '../../hooks/useAppHooks.js'
import { logout } from '../../features/user/userSlice.js'
import { authApi } from '../../services/api.js'

export default function Header() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await authApi.logout()
    } catch (error) {
      console.warn('Logout request failed', error)
    }
    dispatch(logout())
    localStorage.removeItem('job-scraper-auth')
    navigate('/login')
  }

  return (
    <header className="bg-white border-b border-slate-200">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <div>
          <Link to="/dashboard" className="text-lg font-semibold text-slate-900">
            JobScraper Demo
          </Link>
        </div>
        <div className="flex items-center gap-3 text-sm text-slate-600">
          <Link to="/dashboard" className="hover:text-slate-900">Dashboard</Link>
          <Link to="/profile" className="hover:text-slate-900">Profile</Link>
          <button onClick={handleLogout} className="rounded-lg bg-slate-100 px-3 py-2 hover:bg-slate-200">
            Logout
          </button>
        </div>
      </div>
    </header>
  )
}
