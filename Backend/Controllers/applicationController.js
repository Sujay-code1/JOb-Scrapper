import Application from '../models/Application.js'

export const addApplication = async (req, res) => {
  try {
    const { jobTitle, companyName, platform, jobLink, dateApplied, status } = req.body
    if (!jobTitle || !companyName || !platform || !jobLink) {
      return res.status(400).json({ message: 'All job fields are required' })
    }

    const application = await Application.create({
      user: req.user._id,
      jobTitle,
      companyName,
      platform,
      jobLink,
      dateApplied: dateApplied || Date.now(),
      status: status || 'Applied',
    })

    res.status(201).json({ application })
  } catch (error) {
    res.status(500).json({ message: 'Failed to add application', error: error.message })
  }
}

export const getApplications = async (req, res) => {
  try {
    const applications = await Application.find({ user: req.user._id }).sort({ createdAt: -1 })
    res.json({ applications })
  } catch (error) {
    res.status(500).json({ message: 'Failed to load applications', error: error.message })
  }
}
