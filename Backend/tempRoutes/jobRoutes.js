import express from 'express'
import protect from '../middleware/authMiddleware.js'
import { scrapeJobs } from '../controllers/jobController.js'

const router = express.Router()
router.use(protect)

router.post('/scrape', scrapeJobs)

export default router
