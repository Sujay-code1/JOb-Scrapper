import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../../hooks/useAppHooks.js'
import { dismissToast } from '../../features/notifications/notificationSlice.js'

export default function ToastProvider() {
  const notifications = useAppSelector((state) => state.notifications?.items || [])
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (!notifications.length) return

    const timer = setTimeout(() => {
      dispatch(dismissToast(notifications[0].id))
    }, 3000)

    return () => clearTimeout(timer)
  }, [dispatch, notifications])

  if (!notifications.length) return null

  return (
    <div className="fixed right-4 top-4 z-50 flex w-full max-w-sm flex-col gap-3">
      {notifications.map((item) => (
        <div
          key={item.id}
          className={`rounded-2xl border px-4 py-3 text-sm shadow-lg backdrop-blur ${
            item.type === 'success'
              ? 'border-emerald-200 bg-emerald-50 text-emerald-900'
              : item.type === 'error'
                ? 'border-rose-200 bg-rose-50 text-rose-900'
                : 'border-sky-200 bg-sky-50 text-sky-900'
          }`}
        >
          <div className="flex items-start justify-between gap-3">
            <p className="font-medium">{item.message}</p>
            <button
              type="button"
              onClick={() => dispatch(dismissToast(item.id))}
              className="text-xs font-semibold uppercase tracking-[0.2em] opacity-80 hover:opacity-100"
            >
              Close
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
