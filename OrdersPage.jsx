import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'

const STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-700',
  booked: 'bg-blue-100 text-blue-700',
  in_transit: 'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
  returned: 'bg-gray-100 text-gray-700',
}

const COURIER_NAMES = { tcs: 'TCS', leopards: 'Leopards', mp: 'M&P' }
const COURIER_COLORS = { tcs: 'text-red-600', leopards: 'text-orange-600', mp: 'text-blue-700' }

export default function OrdersPage() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({ courier: '', status: '' })
  const [total, setTotal] = useState(0)

  const fetchOrders = async () => {
    setLoading(true)
    try {
      const q = new URLSearchParams()
      if (filters.courier) q.set('courier', filters.courier)
      if (filters.status) q.set('status', filters.status)
      const { data } = await axios.get(`/api/orders?${q}`)
      setOrders(data.orders || [])
      setTotal(data.total || 0)
    } catch {} finally { setLoading(false) }
  }

  useEffect(() => { fetchOrders() }, [filters])

  const handleCancel = async (id) => {
    if (!confirm('Cancel this order?')) return
    try {
      await axios.put(`/api/orders/${id}/cancel`)
      toast.success('Order cancelled.')
      fetchOrders()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Cannot cancel.')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
          <p className="text-gray-500 text-sm mt-1">{total} total orders</p>
        </div>
        <Link to="/orders/new" className="btn-primary">+ New Shipment</Link>
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <select className="input w-40" value={filters.courier} onChange={e => setFilters(f => ({ ...f, courier: e.target.value }))}>
          <option value="">All Couriers</option>
          <option value="tcs">TCS Express</option>
          <option value="leopards">Leopards</option>
          <option value="mp">M&P Express</option>
        </select>
        <select className="input w-40" value={filters.status} onChange={e => setFilters(f => ({ ...f, status: e.target.value }))}>
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="booked">Booked</option>
          <option value="in_transit">In Transit</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-5xl mb-3">📦</p>
            <p className="text-gray-500 font-medium">No orders found</p>
            <Link to="/orders/new" className="btn-primary inline-block mt-4">Book Your First Shipment</Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  {['Tracking #', 'Consignee', 'City', 'Courier', 'Weight', 'COD', 'Status', 'Date', 'Actions'].map(h => (
                    <th key={h} className="text-left py-3 px-4 text-gray-500 font-medium text-xs uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {orders.map(order => (
                  <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4 font-mono text-xs text-blue-600 font-medium">{order.trackingNumber || '—'}</td>
                    <td className="py-3 px-4">
                      <p className="font-medium text-gray-900">{order.consigneeName}</p>
                      <p className="text-xs text-gray-400">{order.consigneePhone}</p>
                    </td>
                    <td className="py-3 px-4 text-gray-600">{order.consigneeCity}</td>
                    <td className="py-3 px-4">
                      <span className={`font-semibold text-xs ${COURIER_COLORS[order.courier]}`}>
                        {COURIER_NAMES[order.courier]}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-600">{order.weight} kg</td>
                    <td className="py-3 px-4 font-medium">Rs {order.codAmount?.toLocaleString('en-PK')}</td>
                    <td className="py-3 px-4">
                      <span className={`badge ${STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-700'}`}>
                        {order.status?.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-400 text-xs">
                      {new Date(order.createdAt).toLocaleDateString('en-PK')}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <Link to={`/track?t=${order.trackingNumber}`} className="text-blue-600 hover:text-blue-700 text-xs font-medium">Track</Link>
                        {!['delivered', 'cancelled'].includes(order.status) && (
                          <button onClick={() => handleCancel(order._id)} className="text-red-500 hover:text-red-600 text-xs font-medium">Cancel</button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
