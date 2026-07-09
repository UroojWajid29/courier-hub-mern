import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'
import { Search, Plus, Printer, X } from 'lucide-react'
import { SkeletonTable } from '../components/Skeleton'
import ShippingLabel from '../components/ShippingLabel'

const STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-700',
  booked: 'bg-blue-100 text-blue-700',
  in_transit: 'bg-purple-100 text-purple-700',
  out_for_delivery: 'bg-orange-100 text-orange-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
  returned: 'bg-gray-100 text-gray-700',
}
const COURIER_NAMES = { tcs: 'TCS', leopards: 'Leopards', mp: 'M&P' }
const COURIER_COLORS = { tcs: 'text-red-600', leopards: 'text-orange-600', mp: 'text-blue-700' }

export default function OrdersPage() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState({ courier: '', status: '' })
  const [total, setTotal] = useState(0)
  const [labelOrder, setLabelOrder] = useState(null)

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

  // Filter by search locally
  const filteredOrders = orders.filter(o => {
    if (!search) return true
    const s = search.toLowerCase()
    return (
      o.trackingNumber?.toLowerCase().includes(s) ||
      o.consigneeName?.toLowerCase().includes(s) ||
      o.consigneeCity?.toLowerCase().includes(s)
    )
  })

  return (
    <div className="space-y-6">
      {labelOrder && <ShippingLabel order={labelOrder} onClose={() => setLabelOrder(null)} />}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Orders</h1>
          <p className="text-gray-500 text-sm mt-1">{total} total orders</p>
        </div>
        <Link to="/orders/new" className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> New Shipment
        </Link>
      </div>

      {/* Search + Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            className="input pl-9"
            placeholder="Search by name, tracking, city..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
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
          <option value="out_for_delivery">Out for Delivery</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {loading ? <SkeletonTable rows={5} cols={8} /> : filteredOrders.length === 0 ? (
        <div className="card p-16 text-center">
          <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="font-medium text-gray-500">No orders found</p>
          <Link to="/orders/new" className="btn-primary inline-flex items-center gap-2 mt-4 text-sm">
            <Plus className="w-4 h-4" /> Book Your First Shipment
          </Link>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                <tr>
                  {['Tracking #', 'Consignee', 'City', 'Courier', 'Weight', 'COD', 'Status', 'Date', 'Actions'].map(h => (
                    <th key={h} className="text-left py-3 px-4 text-gray-500 dark:text-gray-400 font-medium text-xs uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                {filteredOrders.map(order => (
                  <tr key={order._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="py-3 px-4 font-mono text-xs text-blue-600 font-medium">{order.trackingNumber || '—'}</td>
                    <td className="py-3 px-4">
                      <p className="font-medium text-gray-900 dark:text-white">{order.consigneeName}</p>
                      <p className="text-xs text-gray-400">{order.consigneePhone}</p>
                    </td>
                    <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{order.consigneeCity}</td>
                    <td className="py-3 px-4">
                      <span className={`font-semibold text-xs ${COURIER_COLORS[order.courier]}`}>
                        {COURIER_NAMES[order.courier]}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{order.weight} kg</td>
                    <td className="py-3 px-4 font-medium text-gray-900 dark:text-white">Rs {order.codAmount?.toLocaleString('en-PK')}</td>
                    <td className="py-3 px-4">
                      <span className={`badge ${STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-700'}`}>
                        {order.status?.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-400 text-xs">
                      {new Date(order.createdAt).toLocaleDateString('en-PK')}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Link to={`/track?t=${order.trackingNumber}`} className="text-blue-600 hover:text-blue-700 text-xs font-medium">Track</Link>
                        <button onClick={() => setLabelOrder(order)} className="text-gray-500 hover:text-gray-700" title="Print Label">
                          <Printer className="w-3.5 h-3.5" />
                        </button>
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
        </div>
      )}
    </div>
  )
}
