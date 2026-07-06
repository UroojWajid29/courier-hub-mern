import { useState, useEffect } from 'react'
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
const STATUSES = ['pending', 'booked', 'in_transit', 'delivered', 'returned', 'cancelled']

export default function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({ courier: '', status: '' })

  const fetchOrders = async () => {
    setLoading(true)
    try {
      const q = new URLSearchParams()
      if (filters.courier) q.set('courier', filters.courier)
      if (filters.status) q.set('status', filters.status)
      const { data } = await axios.get(`/api/admin/orders?${q}`)
      setOrders(data.orders || [])
    } catch {} finally { setLoading(false) }
  }

  useEffect(() => { fetchOrders() }, [filters])

  const updateStatus = async (id, status) => {
    try {
      await axios.put(`/api/admin/orders/${id}/status`, { status })
      toast.success(`Status updated to ${status}`)
      fetchOrders()
    } catch { toast.error('Failed to update status.') }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">All Orders</h1>
        <p className="text-gray-500 text-sm mt-1">Manage orders across all users</p>
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
          {STATUSES.map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
        </select>
      </div>

      <div className="card overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600" />
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p className="text-4xl mb-3">📦</p>
            <p>No orders found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  {['Tracking #', 'User', 'Consignee', 'City', 'Courier', 'COD', 'Status', 'Update Status', 'Date'].map(h => (
                    <th key={h} className="text-left py-3 px-4 text-gray-500 font-medium text-xs uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {orders.map(order => (
                  <tr key={order._id} className="hover:bg-gray-50">
                    <td className="py-3 px-4 font-mono text-xs text-blue-600 font-medium">{order.trackingNumber || '—'}</td>
                    <td className="py-3 px-4">
                      <p className="font-medium text-gray-800">{order.user?.name || '—'}</p>
                      <p className="text-xs text-gray-400">{order.user?.email}</p>
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-medium">{order.consigneeName}</p>
                      <p className="text-xs text-gray-400">{order.consigneePhone}</p>
                    </td>
                    <td className="py-3 px-4 text-gray-500">{order.consigneeCity}</td>
                    <td className="py-3 px-4">
                      <span className={`font-semibold text-xs ${COURIER_COLORS[order.courier]}`}>
                        {COURIER_NAMES[order.courier]}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-medium">Rs {order.codAmount?.toLocaleString('en-PK')}</td>
                    <td className="py-3 px-4">
                      <span className={`badge ${STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-700'}`}>
                        {order.status?.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <select
                        className="input py-1 text-xs w-32"
                        value={order.status}
                        onChange={e => updateStatus(order._id, e.target.value)}
                      >
                        {STATUSES.map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
                      </select>
                    </td>
                    <td className="py-3 px-4 text-gray-400 text-xs">
                      {new Date(order.createdAt).toLocaleDateString('en-PK')}
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
