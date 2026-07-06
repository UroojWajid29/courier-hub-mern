import Order from '../models/order.model.js'
import { tcsBookShipment, tcsTrackShipment } from '../config/tcs.service.js'
import { leopardsBookShipment, leopardsTrackShipment } from '../config/leopards.service.js'
import { mpBookShipment, mpTrackShipment } from '../config/mp.service.js'

// Book shipment with chosen courier
export const createOrder = async (req, res, next) => {
  try {
    const { consigneeName, consigneePhone, consigneeAddress, consigneeCity,
      description, weight, pieces, codAmount, courier } = req.body

    // Call the right courier API
    let bookingResult
    if (courier === 'tcs') bookingResult = await tcsBookShipment(req.body)
    else if (courier === 'leopards') bookingResult = await leopardsBookShipment(req.body)
    else if (courier === 'mp') bookingResult = await mpBookShipment(req.body)
    else return res.status(400).json({ success: false, message: 'Invalid courier.' })

    if (!bookingResult.success) {
      return res.status(400).json({ success: false, message: bookingResult.message })
    }

    const order = await Order.create({
      user: req.user._id,
      consigneeName, consigneePhone, consigneeAddress, consigneeCity,
      description, weight, pieces, codAmount, courier,
      trackingNumber: bookingResult.trackingNumber,
      courierOrderId: bookingResult.orderId,
      status: 'booked',
      bookedAt: new Date(),
      trackingHistory: [{ status: 'Booked', location: consigneeCity, description: 'Order booked successfully' }]
    })

    res.status(201).json({ success: true, message: 'Order created & booked!', order, tracking: bookingResult.trackingNumber })
  } catch (err) { next(err) }
}

// Get all orders for logged-in user
export const getMyOrders = async (req, res, next) => {
  try {
    const { courier, status, page = 1, limit = 10 } = req.query
    const query = { user: req.user._id }
    if (courier) query.courier = courier
    if (status) query.status = status

    const total = await Order.countDocuments(query)
    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))

    res.json({ success: true, total, pages: Math.ceil(total / limit), orders })
  } catch (err) { next(err) }
}

// Track an order by tracking number
export const trackOrder = async (req, res, next) => {
  try {
    const { trackingNumber } = req.params

    const order = await Order.findOne({ trackingNumber, user: req.user._id })
    if (!order) return res.status(404).json({ success: false, message: 'Order not found.' })

    // Call the right courier's tracking API
    let trackResult
    if (order.courier === 'tcs') trackResult = await tcsTrackShipment(trackingNumber)
    else if (order.courier === 'leopards') trackResult = await leopardsTrackShipment(trackingNumber)
    else if (order.courier === 'mp') trackResult = await mpTrackShipment(trackingNumber)

    if (trackResult?.success) {
      // Update order status from tracking
      order.trackingHistory = trackResult.data.history.map(h => ({
        status: h.status, location: h.location, timestamp: h.time, description: h.status
      }))
      order.status = trackResult.data.status.toLowerCase().replace(/ /g, '_')
      await order.save()
    }

    res.json({ success: true, order, tracking: trackResult?.data })
  } catch (err) { next(err) }
}

// Get single order
export const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, user: req.user._id })
    if (!order) return res.status(404).json({ success: false, message: 'Order not found.' })
    res.json({ success: true, order })
  } catch (err) { next(err) }
}

// Cancel order
export const cancelOrder = async (req, res, next) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, user: req.user._id })
    if (!order) return res.status(404).json({ success: false, message: 'Order not found.' })
    if (['delivered', 'cancelled'].includes(order.status)) {
      return res.status(400).json({ success: false, message: 'Cannot cancel this order.' })
    }
    order.status = 'cancelled'
    await order.save()
    res.json({ success: true, message: 'Order cancelled.', order })
  } catch (err) { next(err) }
}
