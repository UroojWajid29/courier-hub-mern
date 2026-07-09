import { useState, useEffect } from 'react'
import axios from 'axios'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Package, Truck, CheckCircle, DollarSign, Plus, TrendingUp, Download } from 'lucide-react'
import { SkeletonDashboard } from '../components/Skeleton'
import { exportOrdersToCSV } from '../services/exportCSV'

const STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-700',
  booked: 'bg-blue-100 text-blue-700',
  in_transit: 'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
}

const COURIER_COLORS = { tcs: '#E31837', leopards: '#FF6B00', mp: '#1E3A8A' }
const COURIER_NAMES = { tcs: 'TCS Express', leopards: 'Leopards', mp: 'M&P Express' }
const PIE_COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#ef4444', '#f59e0b']

export default function DashboardPage() {
  const { user } = useAuth()
  const [stats, setStats] = useState(null)
  const [allOrders, setAllOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      axios.get('/api/dashboard/stats'),
      axios.get('/api/orders')
    ]).then(([statsRes, ordersRes]) => {
      setStats(statsRes.data.stats)
      setAllOrders(ordersRes.data.orders || [])
    }).catch(() => {}).finally(() => setLoading(false))
  }, [])

  if (loading) return <SkeletonDashboard />

  const deliveryRate = stats?.total > 0 ? Math.round((stats.delivered / stats.total) * 100) : 0

  const statCards = [
    { label: 'Total Orders', value: stats?.total || 0, icon: Package, color: 'bg-blue-50 dark:bg-blue-900/20 text-blue-700', iconColor: 'text-blue-600' },
    { label: 'In Transit', value: stats?.inTransit || 0, icon: Truck, color: 'bg-purple-50 dark:bg-purple-900/20 text-purple-700', iconColor: 'text-purple-600' },
    { label: 'Delivered', value: stats?.delivered || 0, icon: CheckCircle, color: 'bg-green-50 dark:bg-green-900/20 text-green-700', iconColor: 'text-green-600' },
    { label: 'Total COD (PKR)', value: `Rs ${(stats?.codTotal || 0).toLocaleString('en-PK')}`, icon: DollarSign, color: 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700', iconColor: 'text-yellow-600' },
  ]

  // Pie chart data for status
  const statusData = [
    { name: 'Booked', value: stats?.booked || 0 },
    { name: 'In Transit', value: stats?.inTransit || 0 },
    { name: 'Delivered', value: stats?.delivered || 0 },
    { name: 'Cancelled', value: stats?.cancelled || 0 },
    { name: 'Pending', value: stats?.pending || 0 },
  ].filter(d => d.value > 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">Welcome back, {user?.name}! 👋</p>
        </div>
        <div className="flex gap-2">
          {allOrders.length > 0 && (
            <button onClick={() => exportOrdersToCSV(allOrders)} className="btn-secondary flex items-center gap-2 text-sm">
              <Download className="w-4 h-4" /> Export CSV
            </button>
          )}
          <Link to="/orders/new" className="btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" /> New Shipment
          </Link>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map(s => (
          <div key={s.label} className={`card p-5 ${s.color.split(' ')[0]}`}>
            <s.icon className={`w-6 h-6 ${s.iconColor} mb-2`} />
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{s.value}</p>
            <p className="text-sm text-gray-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Delivery Rate Banner */}
      {stats?.total > 0 && (
        <div className="card p-4 flex items-center gap-4">
          <TrendingUp className="w-8 h-8 text-green-600 flex-shrink-0" />
          <div className="flex-1">
            <p className="font-semibold text-gray-900 dark:text-white">Delivery Success Rate</p>
            <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2 mt-2">
              <div className="bg-green-500 h-2 rounded-full transition-all" style={{ width: `${deliveryRate}%` }} />
            </div>
          </div>
          <p className="text-2xl font-bold text-green-600">{deliveryRate}%</p>
        </div>
      )}

      {/* Charts Row */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Bar Chart */}
        <div className="card p-5 lg:col-span-2">
          <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Orders — Last 7 Days</h2>
          {stats?.dailyOrders?.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={stats.dailyOrders}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="_id" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip formatter={(v) => [`${v} orders`, 'Count']} />
                <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Orders" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-48 flex items-center justify-center text-gray-400">
              <div className="text-center">
                <Package className="w-12 h-12 mx-auto mb-2 opacity-30" />
                <p className="text-sm">No orders yet — create your first shipment!</p>
              </div>
            </div>
          )}
        </div>

        {/* Right column */}
        <div className="card p-5 space-y-5">
          {/* Courier breakdown */}
          <div>
            <h2 className="font-semibold text-gray-900 dark:text-white mb-3">By Courier</h2>
            {['tcs', 'leopards', 'mp'].map(c => (
              <div key={c} className="mb-3">
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-gray-700 dark:text-gray-300">{COURIER_NAMES[c]}</span>
                  <span className="text-gray-500">{stats?.byCourier?.[c] || 0}</span>
                </div>
                <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all"
                    style={{
                      width: stats?.total ? `${((stats?.byCourier?.[c] || 0) / stats.total) * 100}%` : '0%',
                      backgroundColor: COURIER_COLORS[c]
                    }} />
                </div>
              </div>
            ))}
          </div>

          {/* Status Pie */}
          {statusData.length > 0 && (
            <div>
              <h2 className="font-semibold text-gray-900 dark:text-white mb-3">By Status</h2>
              <ResponsiveContainer width="100%" height={120}>
                <PieChart>
                  <Pie data={statusData} cx="50%" cy="50%" innerRadius={30} outerRadius={55} dataKey="value">
                    {statusData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                  </Pie>
                  <Tooltip formatter={(v, n) => [v, n]} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap gap-1 mt-1">
                {statusData.map((d, i) => (
                  <span key={d.name} className="flex items-center gap-1 text-xs text-gray-500">
                    <span className="w-2 h-2 rounded-full inline-block" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
                    {d.name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Recent Orders */}
      {stats?.recentOrders?.length > 0 && (
        <div className="card overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-gray-700">
            <h2 className="font-semibold text-gray-900 dark:text-white">Recent Orders</h2>
            <Link to="/orders" className="text-blue-600 text-sm hover:text-blue-700">View all →</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  {['Tracking #', 'Consignee', 'City', 'Courier', 'COD', 'Status'].map(h => (
                    <th key={h} className="text-left py-2 px-4 text-gray-500 dark:text-gray-400 font-medium text-xs uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {stats.recentOrders.map(order => (
                  <tr key={order._id} className="border-t border-gray-50 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <td className="py-2.5 px-4 font-mono text-xs text-blue-600 font-medium">{order.trackingNumber || '—'}</td>
                    <td className="py-2.5 px-4 font-medium text-gray-900 dark:text-white">{order.consigneeName}</td>
                    <td className="py-2.5 px-4 text-gray-500">{order.consigneeCity}</td>
                    <td className="py-2.5 px-4">
                      <span className="font-semibold text-xs" style={{ color: COURIER_COLORS[order.courier] }}>
                        {COURIER_NAMES[order.courier]}
                      </span>
                    </td>
                    <td className="py-2.5 px-4 font-medium text-gray-900 dark:text-white">Rs {order.codAmount?.toLocaleString('en-PK')}</td>
                    <td className="py-2.5 px-4">
                      <span className={`badge ${STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-700'}`}>
                        {order.status?.replace(/_/g, ' ')}
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
