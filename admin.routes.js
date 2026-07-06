import express from 'express'
import { getAdminStats, getAllOrders, getAllUsers, adminUpdateOrderStatus, deleteUser } from '../controllers/admin.controller.js'
import { protect, adminOnly } from '../middleware/auth.middleware.js'

const router = express.Router()

// All admin routes require login + admin role
router.use(protect, adminOnly)

router.get('/stats', getAdminStats)
router.get('/orders', getAllOrders)
router.get('/users', getAllUsers)
router.put('/orders/:id/status', adminUpdateOrderStatus)
router.delete('/users/:id', deleteUser)

export default router
