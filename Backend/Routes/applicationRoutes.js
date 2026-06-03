import express from 'express'
import protect from '../middleware/authMiddleware.js'
import { addApplication, getApplications } from '../controllers/applicationController.js'

const router = express.Router()
router.use(protect)

router.post('/', addApplication)
router.get('/', getApplications)

export default router
