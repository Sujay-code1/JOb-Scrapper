import { scrapeJobsFromBoards } from '../utils/scraperClients/puppeteerScraper.js'

export const scrapeJobs = async (req, res) => {
  try {
    const { keyword, location } = req.body
    if (!keyword) {
      return res.status(400).json({ message: 'Keyword is required' })
    }

    const jobs = await scrapeJobsFromBoards(keyword, location || '')
    res.json({ jobs })
  } catch (error) {
    res.status(500).json({ message: 'Scrape failed', error: error.message })
  }
}
