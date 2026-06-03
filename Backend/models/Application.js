import mongoose from 'mongoose'

const applicationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  jobTitle: { type: String, required: true },
  companyName: { type: String, required: true },
  platform: { type: String, required: true },
  jobLink: { type: String, required: true },
  dateApplied: { type: Date, default: Date.now },
  status: { type: String, default: 'Applied' },
}, { timestamps: true })

const Application = mongoose.model('Application', applicationSchema)
export default Application
