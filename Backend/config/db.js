import mongoose from 'mongoose'

const connectDb = async () => {
   const uri = process.env.MONGO_URL || process.env.MONGODB_URL || process.env.MONGODB_URI
   if (!uri) {
      console.error('Missing MongoDB connection string. Set MONGO_URL or MONGODB_URL in .env')
      return
   }

   try {
      await mongoose.connect(uri)
      console.log('MongoDB connected successfully')
   } catch (error) {
      console.error('MongoDB connection error:', error.message || error)
      process.exit(1)
   }
}

export default connectDb