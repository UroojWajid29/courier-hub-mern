import User from '../models/user.model.js'
import Order from '../models/order.model.js'

// @GET /api/admin/stats
export const getAdminStats = async (req, res, next) => {
  try {
    const [totalUsers, totalOrders, delivered, codTotal] = await Promise.all([
      User.countDocuments(),
      Order.countDocuments(),
      Order.countDocuments({ status: 'delivered' }),
      Order.aggregate([{ $group: { _id: null, total: { $sum: '$codAmount' } } }])
    ])

    const byCourier = await Order.aggregate([
      { $group: { _id: '$courier', count: { $sum: 1 } } }
    ])

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalOrders,
        delivered,
        totalCOD: codTotal[0]?.total || 0,
        byCourier: byCourier.reduce((acc, cur) => ({ ...acc, [cur._id]: cur.count }), {})
      }
    })
  } catch (err) { next(err) }
}

// @GET /api/admin/orders — all orders across all users
export const getAllOrders = async (req, res, next) => {
  try {
    const { courier, status, page = 1, limit = 20 } = req.query
    const query = {}
    if (courier) query.courier = courier
    if (status) query.status = status

    const total = await Order.countDocuments(query)
    const orders = await Order.find(query)
      .populate('user', 'name email company')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))

    res.json({ success: true, total, orders })
  } catch (err) { next(err) }
}

// @GET /api/admin/users — all users
export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().sort({ createdAt: -1 })
    res.json({ success: true, count: users.length, users })
  } catch (err) { next(err) }
}

// @PUT /api/admin/orders/:id/status — admin update any order status
export const adminUpdateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body
    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true })
    if (!order) return res.status(404).json({ success: false, message: 'Order not found.' })
    res.json({ success: true, message: `Order status updated to ${status}`, order })
  } catch (err) { next(err) }
}

// @DELETE /api/admin/users/:id — admin delete user
export const deleteUser = async (req, res, next) => {
  try {
    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({ success: false, message: "You can't delete yourself." })
    }
    await User.findByIdAndDelete(req.params.id)
    res.json({ success: true, message: 'User deleted.' })
  } catch (err) { next(err) }
}
