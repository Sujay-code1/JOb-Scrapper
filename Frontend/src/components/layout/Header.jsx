import { Link, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../hooks/useAppHooks.js'
import { logout } from '../../features/user/userSlice.js'
import { authApi } from '../../services/api.js'

export default function Header() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const profile = useAppSelector((state) => state.profile?.profile)
  const authUser = useAppSelector((state) => state.auth?.user)
  const displayName = profile?.name || authUser?.name || ''
  const firstName = displayName ? displayName.split(' ')[0] : ''

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
    <header className="sticky top-0 z-50 w-full bg-slate-900/95 shadow-sm backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-4 sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Link to="/dashboard" className="text-2xl font-bold tracking-tight text-white">
            JobScraper
          </Link>

          <div className="flex flex-wrap items-center gap-3 text-sm text-slate-200">
            {firstName && (
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-2 text-white">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/15 text-sm font-semibold uppercase">
                  {firstName.charAt(0) || 'U'}
                </span>
                <span>{firstName}</span>
              </div>
            )}
            <Link
              to="/dashboard"
              className="rounded-full border border-white/15 bg-white/10 px-4 py-2 transition hover:bg-white/20"
            >
              Dashboard
            </Link>
            <Link
              to="/profile"
              className="rounded-full border border-white/15 bg-white/10 px-4 py-2 transition hover:bg-white/20"
            >
              Profile
            </Link>
            <button
              onClick={handleLogout}
              className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
            >
              Logout
            </button>
          </div>
        </div>

        <p className="max-w-2xl text-sm text-slate-300">
          Manage applications, save jobs, and review your profile in one place.
        </p>
      </div>
    </header>
  )
}
