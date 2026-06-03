export const scrapeJobs = async (req, res) => {
  try {
    const { keyword, location } = req.body
    if (!keyword) {
      return res.status(400).json({ message: 'Keyword is required' })
    }

    const sampleJobs = [
      {
        jobTitle: `${keyword} Engineer`,
        companyName: 'Acme Corp',
        location: location || 'Remote',
        platform: 'LinkedIn',
        jobLink: 'https://www.linkedin.com/jobs/view/sample-1',
      },
      {
        jobTitle: `${keyword} Developer`,
        companyName: 'Naukri Inc.',
        location: location || 'Bengaluru',
        platform: 'Naukri',
        jobLink: 'https://www.naukri.com/sample-2',
      },
      {
        jobTitle: `${keyword} Intern`,
        companyName: 'InternShala Labs',
        location: location || 'Mumbai',
        platform: 'Internshala',
        jobLink: 'https://internshala.com/sample-3',
      },
      {
        jobTitle: `${keyword} Specialist`,
        companyName: 'Unstop Pvt Ltd',
        location: location || 'Hyderabad',
        platform: 'Unstop',
        jobLink: 'https://unstop.com/sample-4',
      },
    ]

    res.json({ jobs: sampleJobs })
  } catch (error) {
    res.status(500).json({ message: 'Scrape failed', error: error.message })
  }
}
