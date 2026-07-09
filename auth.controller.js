import jwt from 'jsonwebtoken'
import User from '../models/user.model.js'

const sendToken = (user, statusCode, res) => {
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' })
  res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', maxAge: 7 * 24 * 60 * 60 * 1000 })
  res.status(statusCode).json({
    success: true, token,
    user: { _id: user._id, name: user.name, email: user.email, role: user.role, company: user.company }
  })
}

export const register = async (req, res, next) => {
  try {
    const { name, email, password, company, phone } = req.body
    if (await User.findOne({ email })) return res.status(400).json({ success: false, message: 'Email already registered.' })
    const user = await User.create({ name, email, password, company, phone })
    sendToken(user, 201, res)
  } catch (err) { next(err) }
}

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email }).select('+password')
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' })
    }
    sendToken(user, 200, res)
  } catch (err) { next(err) }
}

export const logout = (req, res) => {
  res.clearCookie('token')
  res.json({ success: true, message: 'Logged out.' })
}

export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id)
    res.json({ success: true, user })
  } catch (err) { next(err) }
}

// @POST /api/auth/forgot-password/verify
export const verifyEmail = async (req, res, next) => {
  try {
    const { email } = req.body
    const user = await User.findOne({ email })
    if (!user) return res.status(404).json({ success: false, message: 'No account found with this email.' })
    res.json({ success: true, message: 'Email found.' })
  } catch (err) { next(err) }
}

// @POST /api/auth/forgot-password/reset
export const resetPassword = async (req, res, next) => {
  try {
    const { email, newPassword } = req.body
    const user = await User.findOne({ email })
    if (!user) return res.status(404).json({ success: false, message: 'No account found with this email.' })
    user.password = newPassword
    await user.save()
    res.json({ success: true, message: 'Password reset successfully!' })
  } catch (err) { next(err) }
}

// @PUT /api/auth/profile
export const updateProfile = async (req, res, next) => {
  try {
    const { name, phone, company } = req.body
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, phone, company },
      { new: true, runValidators: true }
    )
    res.json({ success: true, message: 'Profile updated.', user })
  } catch (err) { next(err) }
}

// @PUT /api/auth/change-password
export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body
    const user = await User.findById(req.user._id).select('+password')
    if (!(await user.comparePassword(currentPassword))) {
      return res.status(400).json({ success: false, message: 'Current password is incorrect.' })
    }
    user.password = newPassword
    await user.save()
    res.json({ success: true, message: 'Password changed successfully!' })
  } catch (err) { next(err) }
}
