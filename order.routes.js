import express from 'express'
import { createOrder, getMyOrders, trackOrder, getOrderById, cancelOrder } from '../controllers/order.controller.js'
import { protect } from '../middleware/auth.middleware.js'

const router = express.Router()
router.use(protect)
router.post('/', createOrder)
router.get('/', getMyOrders)
router.get('/:id', getOrderById)
router.get('/track/:trackingNumber', trackOrder)
router.put('/:id/cancel', cancelOrder)
export default router
