import { useState, useEffect } from 'react'
import axios from 'axios'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-700',
  booked: 'bg-blue-100 text-blue-700',
  in_transit: 'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
  returned: 'bg-gray-100 text-gray-700',
}

const COURIER_COLORS = { tcs: '#E31837', leopards: '#FF6B00', mp: '#1E3A8A' }
const COURIER_NAMES = { tcs: 'TCS Express', leopards: 'Leopards', mp: 'M&P Express' }

export default function DashboardPage() {
  const { user } = useAuth()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios.get('/api/dashboard/stats')
      .then(({ data }) => setStats(data.stats))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const statCards = stats ? [
    { label: 'Total Orders', value: stats.total, icon: '📦', color: 'bg-blue-50 text-blue-700' },
    { label: 'In Transit', value: stats.inTransit, icon: '🚚', color: 'bg-purple-50 text-purple-700' },
    { label: 'Delivered', value: stats.delivered, icon: '✅', color: 'bg-green-50 text-green-700' },
    { label: 'Total COD (PKR)', value: `Rs ${stats.codTotal?.toLocaleString('en-PK')}`, icon: '💰', color: 'bg-yellow-50 text-yellow-700' },
  ] : []

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">Welcome back, {user?.name}! 👋</p>
        </div>
        <Link to="/orders/new" className="btn-primary flex items-center gap-2">
          <span>+</span> New Shipment
        </Link>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map(s => (
          <div key={s.label} className={`card p-5 ${s.color.split(' ')[0]}`}>
            <p className="text-2xl mb-1">{s.icon}</p>
            <p className="text-2xl font-bold text-gray-900">{s.value}</p>
            <p className="text-sm text-gray-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Chart */}
        <div className="card p-5 lg:col-span-2">
          <h2 className="font-semibold text-gray-900 mb-4">Orders (Last 7 Days)</h2>
          {stats?.dailyOrders?.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={stats.dailyOrders}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="_id" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Orders" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-48 flex items-center justify-center text-gray-400">
              <div className="text-center">
                <p className="text-4xl mb-2">📊</p>
                <p>No orders yet — create your first shipment!</p>
              </div>
            </div>
          )}
        </div>

        {/* Courier breakdown */}
        <div className="card p-5">
          <h2 className="font-semibold text-gray-900 mb-4">By Courier</h2>
          <div className="space-y-3">
            {['tcs', 'leopards', 'mp'].map(c => (
              <div key={c}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium">{COURIER_NAMES[c]}</span>
                  <span className="text-gray-500">{stats?.byCourier?.[c] || 0}</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: stats?.total ? `${((stats?.byCourier?.[c] || 0) / stats.total) * 100}%` : '0%',
                      backgroundColor: COURIER_COLORS[c]
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Status breakdown */}
          <h2 className="font-semibold text-gray-900 mt-6 mb-3">By Status</h2>
          <div className="space-y-2">
            {[
              { key: 'booked', label: 'Booked', val: stats?.booked },
              { key: 'in_transit', label: 'In Transit', val: stats?.inTransit },
              { key: 'delivered', label: 'Delivered', val: stats?.delivered },
              { key: 'cancelled', label: 'Cancelled', val: stats?.cancelled },
            ].map(s => (
              <div key={s.key} className="flex items-center justify-between">
                <span className={`badge ${STATUS_COLORS[s.key]}`}>{s.label}</span>
                <span className="font-semibold text-gray-900">{s.val || 0}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      {stats?.recentOrders?.length > 0 && (
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Recent Orders</h2>
            <Link to="/orders" className="text-blue-600 text-sm hover:text-blue-700">View all →</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  {['Tracking #', 'Consignee', 'City', 'Courier', 'COD', 'Status'].map(h => (
                    <th key={h} className="text-left py-2 px-3 text-gray-500 font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {stats.recentOrders.map(order => (
                  <tr key={order._id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="py-2.5 px-3 font-mono text-xs text-blue-600">{order.trackingNumber || '—'}</td>
                    <td className="py-2.5 px-3 font-medium">{order.consigneeName}</td>
                    <td className="py-2.5 px-3 text-gray-500">{order.consigneeCity}</td>
                    <td className="py-2.5 px-3">
                      <span className="font-medium" style={{ color: COURIER_COLORS[order.courier] }}>
                        {COURIER_NAMES[order.courier]}
                      </span>
                    </td>
                    <td className="py-2.5 px-3">Rs {order.codAmount?.toLocaleString('en-PK')}</td>
                    <td className="py-2.5 px-3">
                      <span className={`badge ${STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-700'}`}>
                        {order.status.replace('_', ' ')}
                      </span>
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
