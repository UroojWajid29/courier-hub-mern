import Order from '../models/order.model.js'

export const getDashboardStats = async (req, res, next) => {
  try {
    const userId = req.user._id

    const [total, booked, inTransit, delivered, cancelled] = await Promise.all([
      Order.countDocuments({ user: userId }),
      Order.countDocuments({ user: userId, status: 'booked' }),
      Order.countDocuments({ user: userId, status: 'in_transit' }),
      Order.countDocuments({ user: userId, status: 'delivered' }),
      Order.countDocuments({ user: userId, status: 'cancelled' }),
    ])

    // Orders by courier
    const byCourier = await Order.aggregate([
      { $match: { user: userId } },
      { $group: { _id: '$courier', count: { $sum: 1 } } }
    ])

    // Recent 5 orders
    const recentOrders = await Order.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(5)

    // Orders per day last 7 days
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    const dailyOrders = await Order.aggregate([
      { $match: { user: userId, createdAt: { $gte: sevenDaysAgo } } },
      { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ])

    // Total COD amount
    const codTotal = await Order.aggregate([
      { $match: { user: userId } },
      { $group: { _id: null, total: { $sum: '$codAmount' } } }
    ])

    res.json({
      success: true,
      stats: {
        total, booked, inTransit, delivered, cancelled,
        pending: total - booked - inTransit - delivered - cancelled,
        codTotal: codTotal[0]?.total || 0,
        byCourier: byCourier.reduce((acc, cur) => ({ ...acc, [cur._id]: cur.count }), {}),
        dailyOrders,
        recentOrders
      }
    })
  } catch (err) { next(err) }
}
