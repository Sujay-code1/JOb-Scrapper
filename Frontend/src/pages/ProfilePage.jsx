import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../hooks/useAppHooks.js'
import { setProfile, setProfileError, setProfileLoading, clearProfile } from '../features/profile/profileSlice.js'
import { profileApi } from '../services/api.js'

export default function ProfilePage() {
  const dispatch = useAppDispatch()
  const { token } = useAppSelector((state) => state.auth)
  const { profile, error } = useAppSelector((state) => state.profile)
  const [name, setName] = useState('')
  const [location, setLocation] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const loadProfile = async () => {
      dispatch(setProfileLoading())
      try {
        const response = await profileApi.getProfile(token)
        dispatch(setProfile(response.profile))
      } catch (err) {
        dispatch(setProfileError(err.message))
      }
    }

    if (token) loadProfile()
    return () => dispatch(clearProfile())
  }, [dispatch, token])

  const handleSave = async (e) => {
    e.preventDefault()
    setMessage('')
    try {
      const response = await profileApi.updateProfile({ name, location, profileImage: imageUrl }, token)
      dispatch(setProfile(response.profile))
      setName('')
      setLocation('')
      setImageUrl('')
      setMessage('Profile updated successfully')
    } catch (err) {
      setMessage(err.message)
    }
  }

  const handleDeleteImage = async () => {
    try {
      const response = await profileApi.deleteImage(token)
      dispatch(setProfile(response.profile))
      setImageUrl('')
      setMessage('Image removed')
    } catch (err) {
      setMessage(err.message)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 pb-8 pt-28 dark:bg-slate-950">
      <div className="mx-auto max-w-3xl space-y-8">
        <div>
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            <span className="text-lg">←</span>
            Back to dashboard
          </Link>
        </div>

        <section className="rounded-3xl bg-white p-6 shadow-md dark:bg-slate-900 dark:text-slate-100">
          <h2 className="text-xl font-semibold">Profile</h2>
          <form onSubmit={handleSave} className="mt-6 space-y-4">
            <div>
              <label className="block text-sm text-slate-700">Name</label>
              <input
                value={name || profile?.name || ''}
                onChange={(e) => setName(e.target.value)}
                className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3"
              />
            </div>
            <div>
              <label className="block text-sm text-slate-700">Location</label>
              <input
                value={location || profile?.location || ''}
                onChange={(e) => setLocation(e.target.value)}
                className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3"
              />
            </div>
            <div>
              <label className="block text-sm text-slate-700">Image URL</label>
              <input
                value={imageUrl || profile?.profileImage || ''}
                onChange={(e) => setImageUrl(e.target.value)}
                className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3"
              />
            </div>
            {imageUrl && (
              <div className="mt-3">
                <img src={imageUrl} alt="Profile" className="h-24 w-24 rounded-full object-cover" />
              </div>
            )}
            <div className="flex flex-wrap gap-3">
              <button className="rounded-lg bg-indigo-600 px-6 py-3 text-white hover:bg-indigo-700">Save</button>
              <button type="button" onClick={handleDeleteImage} className="rounded-lg bg-slate-200 px-6 py-3 text-slate-700 hover:bg-slate-300">
                Remove image
              </button>
            </div>
            {message && <div className="text-sm text-slate-700">{message}</div>}
            {error && <div className="text-sm text-red-600">{error}</div>}
          </form>
        </section>
      </div>
    </div>
  )
}
