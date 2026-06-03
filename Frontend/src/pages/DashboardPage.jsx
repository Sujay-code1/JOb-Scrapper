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

  // Demo job data for display
  const demoJobs = [
    {
      id: 1,
      jobTitle: 'Senior React Developer',
      companyName: 'Tech Startup Inc',
      location: 'Remote',
      skills: ['React', 'TypeScript', 'Node.js', 'MongoDB'],
      salary: '$120k - $150k',
      platform: 'LinkedIn',
      jobLink: 'https://linkedin.com/jobs/1',
      description: 'We are looking for an experienced React developer to join our growing team.',
    },
    {
      id: 2,
      jobTitle: 'Full Stack Developer',
      companyName: 'Cloud Solutions Ltd',
      location: 'San Francisco, CA',
      skills: ['React', 'Python', 'AWS', 'PostgreSQL'],
      salary: '$130k - $170k',
      platform: 'Indeed',
      jobLink: 'https://indeed.com/jobs/2',
      description: 'Join our team to build scalable web applications and cloud infrastructure.',
    },
    {
      id: 3,
      jobTitle: 'Frontend Engineer',
      companyName: 'Digital Agency Pro',
      location: 'New York, NY',
      skills: ['Vue.js', 'Tailwind CSS', 'JavaScript', 'Git'],
      salary: '$100k - $130k',
      platform: 'Glassdoor',
      jobLink: 'https://glassdoor.com/jobs/3',
      description: 'Help us create beautiful and responsive user interfaces for our clients.',
    },
    {
      id: 4,
      jobTitle: 'Backend Developer',
      companyName: 'Enterprise Systems Co',
      location: 'Chicago, IL',
      skills: ['Node.js', 'Express', 'PostgreSQL', 'Docker'],
      salary: '$110k - $145k',
      platform: 'Monster',
      jobLink: 'https://monster.com/jobs/4',
      description: 'Build robust backend systems and APIs for our enterprise clients.',
    },
  ]

  const displayJobs = results.length > 0 ? results : demoJobs

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
          <h2 className="text-xl font-semibold mb-6">Job Listings</h2>
          {status === 'loading' && <div className="text-center py-8 text-slate-600">Searching jobs...</div>}
          {error && <div className="text-center py-8 text-red-600">{error}</div>}
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
            {displayJobs.map((job) => (
              <div key={job.id || job.jobLink} className="border border-slate-200 rounded-2xl p-6 hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-slate-900">{job.jobTitle}</h3>
                    <p className="text-sm text-slate-600 mt-1">{job.companyName}</p>
                  </div>
                  <span className="text-xs bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full">{job.platform || 'Job Board'}</span>
                </div>

                <div className="mb-4 space-y-2">
                  <p className="text-sm text-slate-700">
                    <span className="font-medium">Location:</span> {job.location}
                  </p>
                  {job.salary && (
                    <p className="text-sm text-slate-700">
                      <span className="font-medium">Salary:</span> {job.salary}
                    </p>
                  )}
                  {job.description && (
                    <p className="text-sm text-slate-600 mt-3 line-clamp-2">{job.description}</p>
                  )}
                </div>

                <div className="mb-4">
                  <p className="text-xs font-medium text-slate-700 mb-2">Required Skills:</p>
                  <div className="flex flex-wrap gap-2">
                    {(job.skills || []).map((skill, idx) => (
                      <span key={idx} className="text-xs bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2 pt-4 border-t border-slate-200">
                  <button
                    onClick={() => window.open(job.jobLink || '#', '_blank')}
                    className="flex-1 rounded-lg bg-slate-100 px-4 py-2 text-sm text-slate-700 hover:bg-slate-200 transition-colors"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => handleApply(job)}
                    className="flex-1 rounded-lg bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-700 transition-colors"
                  >
                    Apply Now
                  </button>
                </div>
              </div>
            ))}
          </div>
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
