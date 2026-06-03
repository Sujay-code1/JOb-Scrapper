import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../hooks/useAppHooks.js'
import Header from '../components/layout/Header.jsx'
import { setResults, setJobError, setJobLoading } from '../features/jobs/jobSlice.js'
import { addApplication, setApplicationHistory, setApplicationError, setApplicationLoading } from '../features/application/applicationSlice.js'
import { jobApi, applicationApi } from '../services/api.js'

export default function DashboardPage() {
  const dispatch = useAppDispatch()
  const [keyword, setKeyword] = useState('Frontend')
  const [location, setLocation] = useState('Remote')
  const { results, status, error } = useAppSelector((state) => state.jobs)
  const { token } = useAppSelector((state) => state.auth)
  const { history } = useAppSelector((state) => state.applications)

  useEffect(() => {
    const loadHistory = async () => {
      dispatch(setApplicationLoading())
      try {
        const response = await applicationApi.getAll(token)
        dispatch(setApplicationHistory(response.applications))
      } catch (err) {
        dispatch(setApplicationError(err.message))
      }
    }

    if (token) loadHistory()
  }, [dispatch, token])

  const handleSearch = async (e) => {
    e.preventDefault()
    dispatch(setJobLoading())
    try {
      const response = await jobApi.scrape({ keyword, location }, token)
      dispatch(setResults(response.jobs))
    } catch (err) {
      dispatch(setJobError(err.message))
    }
  }

  const handleApply = async (job) => {
    try {
      const response = await applicationApi.add({
        jobTitle: job.jobTitle,
        companyName: job.companyName,
        platform: job.platform,
        jobLink: job.jobLink,
        dateApplied: new Date().toISOString(),
        status: 'Applied',
      }, token)
      dispatch(addApplication(response.application))
      window.open(job.jobLink, '_blank')
    } catch (err) {
      console.error(err)
    }
  }

  return (
      <div className="min-h-screen bg-slate-50 px-4 py-8">
        <Header />
        <div className="mx-auto max-w-6xl space-y-8 pt-4">
        <div className="rounded-3xl bg-white p-6 shadow-md">
          <p className="text-sm text-slate-500">Welcome to the demo job scraper platform. Use the form below to search jobs and save your applications.</p>
        </div>
        <section className="rounded-3xl bg-white p-6 shadow-md">
          <h2 className="text-xl font-semibold">Job Scraper</h2>
          <form onSubmit={handleSearch} className="mt-4 flex flex-col gap-4 sm:flex-row">
            <input
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="flex-1 rounded-lg border border-slate-300 px-4 py-3"
              placeholder="Job title or keyword"
              required
            />
            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="rounded-lg border border-slate-300 px-4 py-3"
              placeholder="Location"
            />
            <button className="rounded-lg bg-indigo-600 px-6 py-3 text-white hover:bg-indigo-700">
              Scrape Jobs
            </button>
          </form>
          {status === 'loading' && <div className="mt-4 text-sm text-slate-500">Searching jobs...</div>}
          {error && <div className="mt-4 text-sm text-red-600">{error}</div>}
        </section>

        <section className="rounded-3xl bg-white p-6 shadow-md">
          <h2 className="text-xl font-semibold">Job Results</h2>
          {results.length === 0 ? (
            <div className="mt-4 text-slate-600">Search jobs to see listings here.</div>
          ) : (
            <div className="mt-4 overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 text-sm">
                <thead className="bg-slate-50 text-left text-slate-700">
                  <tr>
                    <th className="px-4 py-3">Title</th>
                    <th className="px-4 py-3">Company</th>
                    <th className="px-4 py-3">Location</th>
                    <th className="px-4 py-3">Platform</th>
                    <th className="px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {results.map((job, idx) => (
                    <tr key={`${job.jobLink}-${idx}`}>
                      <td className="px-4 py-3">{job.jobTitle}</td>
                      <td className="px-4 py-3">{job.companyName}</td>
                      <td className="px-4 py-3">{job.location}</td>
                      <td className="px-4 py-3">{job.platform}</td>
                      <td className="px-4 py-3 space-x-2">
                        <button
                          onClick={() => window.open(job.jobLink, '_blank')}
                          className="rounded-md bg-slate-100 px-3 py-2 text-sm text-slate-700 hover:bg-slate-200"
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleApply(job)}
                          className="rounded-md bg-indigo-600 px-3 py-2 text-sm text-white hover:bg-indigo-700"
                        >
                          Apply
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="rounded-3xl bg-white p-6 shadow-md">
          <h2 className="text-xl font-semibold">Application History</h2>
          {history.length === 0 ? (
            <div className="mt-4 text-slate-600">Your applications will appear here after applying.</div>
          ) : (
            <div className="mt-4 space-y-3">
              {history.map((application) => (
                <div key={application._id} className="rounded-2xl border border-slate-200 p-4">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="font-semibold">{application.jobTitle}</p>
                      <p className="text-sm text-slate-600">{application.companyName} · {application.platform}</p>
                    </div>
                    <div className="text-sm text-slate-500">{new Date(application.dateApplied).toLocaleDateString()}</div>
                  </div>
                  <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
                    <a href={application.jobLink} target="_blank" rel="noreferrer" className="text-indigo-600 hover:underline">
                      Open link
                    </a>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-700">{application.status}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
