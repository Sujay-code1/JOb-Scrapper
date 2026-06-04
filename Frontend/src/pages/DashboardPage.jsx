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
  const [jobPage, setJobPage] = useState(1)
  const [historyPage, setHistoryPage] = useState(1)
  const { results = [], status, error } = useAppSelector((state) => state.jobs || {})
  const { token } = useAppSelector((state) => state.auth || {})
  const history = useAppSelector((state) => state.applications?.history || [])

  const jobsPerPage = 6
  const historyPerPage = 6
  const jobPageCount = Math.max(1, Math.ceil(results.length / jobsPerPage))
  const historyPageCount = Math.max(1, Math.ceil(history.length / historyPerPage))
  const currentJobPage = Math.min(jobPage, jobPageCount)
  const currentHistoryPage = Math.min(historyPage, historyPageCount)
  const paginatedJobs = results.slice((currentJobPage - 1) * jobsPerPage, currentJobPage * jobsPerPage)
  const paginatedHistory = history.slice((currentHistoryPage - 1) * historyPerPage, currentHistoryPage * historyPerPage)
  const jobStart = (currentJobPage - 1) * jobsPerPage
  const jobEnd = Math.min(currentJobPage * jobsPerPage, results.length)
  const historyStart = (currentHistoryPage - 1) * historyPerPage
  const historyEnd = Math.min(currentHistoryPage * historyPerPage, history.length)

  useEffect(() => {
    const loadHistory = async () => {
      dispatch(setApplicationLoading())
      try {
        const response = await applicationApi.getAll(token)
        const applications = Array.isArray(response?.applications) ? response.applications : []
        dispatch(setApplicationHistory(applications))
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
      dispatch(setResults(Array.isArray(response?.jobs) ? response.jobs : []))
    } catch (err) {
      dispatch(setJobError(err.message || 'Failed to fetch jobs'))
    }
  }

  const handleApply = async (job) => {
    try {
      const response = await applicationApi.add(
        {
          jobTitle: job.jobTitle,
          companyName: job.companyName,
          platform: job.platform,
          jobLink: job.jobLink,
          dateApplied: new Date().toISOString(),
          status: 'Applied',
        },
        token,
      )
      dispatch(addApplication(response.application))
      window.open(job.jobLink, '_blank')
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8">
      <Header />

      <div className="mx-auto max-w-7xl space-y-8 pt-6">
        <section className="overflow-hidden rounded-4xl bg-linear-to-r from-indigo-600 via-sky-600 to-cyan-500 p-8 text-white shadow-xl shadow-slate-400/10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-sm uppercase tracking-[0.24em] text-cyan-100">Job Scraper</p>
              <h1 className="mt-4 text-3xl font-semibold sm:text-4xl">Find jobs across top platforms in one click.</h1>
              <p className="mt-4 max-w-2xl text-sm text-slate-100/90">Search by role and location, then save applications directly to your history.</p>
            </div>

            <div className="rounded-3xl bg-white/10 px-5 py-4 shadow-lg shadow-slate-900/5 backdrop-blur-sm">
              <p className="text-sm text-slate-100/85">Saved applications</p>
              <p className="mt-2 text-3xl font-semibold">{history.length}</p>
            </div>
          </div>
        </section>

        <section className="rounded-3xl bg-white p-6 shadow-md">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-slate-900">Job Scraper</h2>
              <p className="mt-1 text-sm text-slate-500">Enter a keyword and location to scrape jobs from supported boards.</p>
            </div>
            <div className="rounded-full bg-slate-100 px-4 py-2 text-sm text-slate-600">Results: {results.length}</div>
          </div>

          <form onSubmit={handleSearch} className="mt-6 grid gap-4 sm:grid-cols-[1.8fr_1fr_auto]">
            <input
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-indigo-500"
              placeholder="Job title or keyword"
              required
            />
            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-indigo-500"
              placeholder="Location"
            />
            <button className="rounded-3xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700">
              Scrape Jobs
            </button>
          </form>

          {status === 'loading' && <div className="mt-4 rounded-3xl bg-slate-50 px-4 py-3 text-sm text-slate-600">Searching jobs…</div>}
          {error && <div className="mt-4 rounded-3xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>}
        </section>

        <section className="rounded-3xl bg-white p-6 shadow-md">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-slate-900">Job Listings</h2>
              <p className="mt-1 text-sm text-slate-500">Click Apply to open the job link and save it to your application history.</p>
            </div>
            <div className="text-sm text-slate-500">{results.length} jobs found</div>
          </div>

          {status === 'loading' && <div className="mt-8 text-center text-slate-600">Searching jobs...</div>}
          {error && status !== 'loading' && <div className="mt-8 text-center text-rose-600">{error}</div>}

          {results.length === 0 && status !== 'loading' ? (
            <div className="mt-8 rounded-3xl border border-dashed border-slate-200 bg-slate-50 px-6 py-12 text-center text-slate-500">
              No jobs found yet. Enter a keyword and location, then click Scrape Jobs.
            </div>
          ) : (
            <>
              <div className="mt-6 overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200 text-left">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-4 py-4 text-sm font-semibold text-slate-700">Job Title</th>
                      <th className="px-4 py-4 text-sm font-semibold text-slate-700">Company</th>
                      <th className="px-4 py-4 text-sm font-semibold text-slate-700">Location</th>
                      <th className="px-4 py-4 text-sm font-semibold text-slate-700">Platform</th>
                      <th className="px-4 py-4 text-sm font-semibold text-slate-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {paginatedJobs.map((job) => (
                      <tr key={job.id || job.jobLink} className="hover:bg-slate-50">
                        <td className="px-4 py-4 align-top">
                          <p className="font-semibold text-slate-900">{job.jobTitle}</p>
                          <a href={job.jobLink} target="_blank" rel="noreferrer" className="mt-1 block text-sm text-indigo-600 hover:underline">
                            View job details
                          </a>
                        </td>
                        <td className="px-4 py-4 align-top text-slate-600">{job.companyName}</td>
                        <td className="px-4 py-4 align-top text-slate-600">{job.location || 'Remote'}</td>
                        <td className="px-4 py-4 align-top">
                          <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-700">
                            {job.platform || 'Job Board'}
                          </span>
                        </td>
                        <td className="px-4 py-4 align-top">
                          <button
                            onClick={() => handleApply(job)}
                            className="rounded-2xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700"
                          >
                            Apply Now
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {jobPageCount > 1 && (
                <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between text-sm text-slate-600">
                  <p>
                    Showing {jobStart + 1} to {jobEnd} of {results.length} jobs
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setJobPage((prev) => Math.max(1, prev - 1))}
                      disabled={jobPage === 1}
                      className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm transition disabled:cursor-not-allowed disabled:opacity-50 hover:bg-slate-50"
                    >
                      Previous
                    </button>
                    <span>
                      Page {jobPage} of {jobPageCount}
                    </span>
                    <button
                      onClick={() => setJobPage((prev) => Math.min(jobPageCount, prev + 1))}
                      disabled={jobPage === jobPageCount}
                      className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm transition disabled:cursor-not-allowed disabled:opacity-50 hover:bg-slate-50"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </section>

        <section className="rounded-3xl bg-white p-6 shadow-md">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-slate-900">Application History</h2>
              <p className="mt-1 text-sm text-slate-500">Track jobs you’ve applied to and revisit each opportunity.</p>
            </div>
            <div className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-600">{history.length} stored</div>
          </div>

          {history.length === 0 ? (
            <div className="mt-8 rounded-3xl border border-dashed border-slate-200 bg-slate-50 px-6 py-12 text-center text-slate-500">
              No application history yet. Apply to a job to start tracking your progress.
            </div>
          ) : (
            <>
              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {paginatedHistory.map((application) => (
                  <div key={application._id} className="rounded-3xl border border-slate-200 bg-slate-50 p-5 shadow-sm">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-base font-semibold text-slate-900">{application.jobTitle}</p>
                        <p className="mt-1 text-sm text-slate-600">{application.companyName}</p>
                        <p className="mt-2 text-sm text-slate-500">{application.platform}</p>
                      </div>
                      <span className="rounded-full bg-indigo-600 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white">
                        {application.status}
                      </span>
                    </div>
                    <div className="mt-4 flex items-center justify-between gap-3 text-sm text-slate-500">
                      <span>{new Date(application.dateApplied).toLocaleDateString()}</span>
                      <a href={application.jobLink} target="_blank" rel="noreferrer" className="text-indigo-600 hover:underline">
                        Open link
                      </a>
                    </div>
                  </div>
                ))}
              </div>

              {historyPageCount > 1 && (
                <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between text-sm text-slate-600">
                  <p>
                    Showing {historyStart + 1} to {historyEnd} of {history.length} applications
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setHistoryPage((prev) => Math.max(1, prev - 1))}
                      disabled={historyPage === 1}
                      className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm transition disabled:cursor-not-allowed disabled:opacity-50 hover:bg-slate-50"
                    >
                      Previous
                    </button>
                    <span>
                      Page {historyPage} of {historyPageCount}
                    </span>
                    <button
                      onClick={() => setHistoryPage((prev) => Math.min(historyPageCount, prev + 1))}
                      disabled={historyPage === historyPageCount}
                      className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm transition disabled:cursor-not-allowed disabled:opacity-50 hover:bg-slate-50"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </div>
  )
}
