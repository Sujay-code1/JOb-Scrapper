import jwt from 'jsonwebtoken'
import User from '../models/User.js'

const jwtSecret = process.env.JWT_SECRET || 'dev_jwt_secret'

const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization
    const token = authHeader?.startsWith('Bearer ')
      ? authHeader.split(' ')[1]
      : req.cookies?.token

    if (!token) {
      return res.status(401).json({ message: 'Not authorized' })
    }

    const decoded = jwt.verify(token, jwtSecret)
    const user = await User.findById(decoded.id).select('-password')
    if (!user) return res.status(401).json({ message: 'Invalid token' })

    req.user = user
    next()
  } catch (error) {
    return res.status(401).json({ message: 'Not authorized', error: error.message })
  }
}

export default protect
