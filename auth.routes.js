import express from 'express'
import { register, login, logout, getMe, verifyEmail, resetPassword, updateProfile, changePassword } from '../controllers/auth.controller.js'
import { protect } from '../middleware/auth.middleware.js'

const router = express.Router()
router.post('/register', register)
router.post('/login', login)
router.post('/logout', logout)
router.get('/me', protect, getMe)
router.post('/forgot-password/verify', verifyEmail)
router.post('/forgot-password/reset', resetPassword)
router.put('/profile', protect, updateProfile)
router.put('/change-password', protect, changePassword)
export default router
