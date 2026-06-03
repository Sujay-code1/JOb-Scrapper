import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAppDispatch } from '../hooks/useAppHooks.js'
import { authRequested, authSucceeded, authFailed } from '../features/user/userSlice.js'
import { authApi } from '../services/api.js'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [loading, setLoadingState] = useState(false)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMessage('')
    setLoadingState(true)
    dispatch(authRequested())
    try {
      const response = await authApi.login({ email, password })
      dispatch(authSucceeded(response))
      navigate('/dashboard')
    } catch (error) {
      setErrorMessage(error.message)
      dispatch(authFailed(error.message))
    } finally {
      setLoadingState(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg">
        <h1 className="text-2xl font-semibold text-slate-900">Login</h1>
        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm text-slate-700">Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-indigo-500 focus:outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-slate-700">Password</label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-indigo-500 focus:outline-none"
              required
            />
          </div>
          {errorMessage && <div className="text-sm text-red-600">{errorMessage}</div>}
          <button
            type="submit"
            className="w-full rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-slate-600">
          Don't have an account? <Link to="/register" className="text-indigo-600 hover:underline">Register here</Link>
        </p>
      </div>
    </div>
  )
}
