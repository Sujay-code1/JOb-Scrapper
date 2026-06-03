import User from '../models/User.js'

export const getProfile = async (req, res) => {
  try {
    const user = req.user
    res.json({ profile: user })
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch profile', error: error.message })
  }
}

export const updateProfile = async (req, res) => {
  try {
    const { name, location, profileImage } = req.body
    const updated = await User.findByIdAndUpdate(
      req.user._id,
      { name: name || req.user.name, location: location ?? req.user.location, profileImage: profileImage ?? req.user.profileImage },
      { new: true, runValidators: true }
    ).select('-password')

    res.json({ profile: updated })
  } catch (error) {
    res.status(500).json({ message: 'Failed to update profile', error: error.message })
  }
}

export const deleteProfileImage = async (req, res) => {
  try {
    const updated = await User.findByIdAndUpdate(
      req.user._id,
      { profileImage: '' },
      { new: true }
    ).select('-password')
    res.json({ profile: updated })
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete profile image', error: error.message })
  }
}
