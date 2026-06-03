import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'

const jwtSecret = process.env.JWT_SECRET || 'dev_jwt_secret'

const createToken = (userId) => {
  return jwt.sign({ id: userId }, jwtSecret, { expiresIn: '7d' })
}

export const registerUser = async (req, res) => {
  try {
    const { name, email, password, location } = req.body
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' })
    }

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' })
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      location: location || '',
    })

    const token = createToken(user._id)
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })
    return res.status(201).json({
      user: { id: user._id, name: user.name, email: user.email, location: user.location, profileImage: user.profileImage },
      token,
    })
  } catch (error) {
    res.status(500).json({ message: 'Registration failed', error: error.message })
  }
}

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' })
    }

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    const token = createToken(user._id)
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })
    return res.json({
      user: { id: user._id, name: user.name, email: user.email, location: user.location, profileImage: user.profileImage },
      token,
    })
  } catch (error) {
    res.status(500).json({ message: 'Login failed', error: error.message })
  }
}

export const logoutUser = async (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  })
  res.json({ message: 'Logged out successfully' })
}

