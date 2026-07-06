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
