import { useState, useEffect } from 'react'
import axios from 'axios'

const STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-700',
  booked: 'bg-blue-100 text-blue-700',
  in_transit: 'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
}

const COURIER_NAMES = { tcs: 'TCS Express', leopards: 'Leopards', mp: 'M&P Express' }
const COURIER_COLORS = { tcs: 'text-red-600', leopards: 'text-orange-600', mp: 'text-blue-700' }

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [allOrders, setAllOrders] = useState([])
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      axios.get('/api/admin/stats'),
      axios.get('/api/admin/orders'),
      axios.get('/api/admin/users'),
    ]).then(([statsRes, ordersRes, usersRes]) => {
      setStats(statsRes.data.stats)
      setAllOrders(ordersRes.data.orders || [])
      setUsers(usersRes.data.users || [])
    }).catch(() => {}).finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-600" />
    </div>
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Admin Overview</h1>
        <p className="text-gray-500 text-sm mt-1">Full platform statistics</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Users', value: stats?.totalUsers || 0, icon: '👥', color: 'bg-purple-50' },
          { label: 'Total Orders', value: stats?.totalOrders || 0, icon: '📦', color: 'bg-blue-50' },
          { label: 'Delivered', value: stats?.delivered || 0, icon: '✅', color: 'bg-green-50' },
          { label: 'Total COD (PKR)', value: `Rs ${(stats?.totalCOD || 0).toLocaleString('en-PK')}`, icon: '💰', color: 'bg-yellow-50' },
        ].map(s => (
          <div key={s.label} className={`card p-5 ${s.color}`}>
            <p className="text-2xl mb-1">{s.icon}</p>
            <p className="text-2xl font-bold text-gray-900">{s.value}</p>
            <p className="text-sm text-gray-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="card overflow-hidden">
        <div className="p-5 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">All Recent Orders</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                {['Tracking #', 'User', 'Consignee', 'City', 'Courier', 'COD', 'Status', 'Date'].map(h => (
                  <th key={h} className="text-left py-3 px-4 text-gray-500 font-medium text-xs uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {allOrders.slice(0, 10).map(order => (
                <tr key={order._id} className="hover:bg-gray-50">
                  <td className="py-3 px-4 font-mono text-xs text-blue-600">{order.trackingNumber || '—'}</td>
                  <td className="py-3 px-4 text-gray-600 text-xs">{order.user?.name || '—'}</td>
                  <td className="py-3 px-4 font-medium">{order.consigneeName}</td>
                  <td className="py-3 px-4 text-gray-500">{order.consigneeCity}</td>
                  <td className="py-3 px-4">
                    <span className={`font-semibold text-xs ${COURIER_COLORS[order.courier]}`}>
                      {COURIER_NAMES[order.courier]}
                    </span>
                  </td>
                  <td className="py-3 px-4">Rs {order.codAmount?.toLocaleString('en-PK')}</td>
                  <td className="py-3 px-4">
                    <span className={`badge ${STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-700'}`}>
                      {order.status?.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-400 text-xs">
                    {new Date(order.createdAt).toLocaleDateString('en-PK')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {allOrders.length === 0 && (
            <div className="text-center py-10 text-gray-400">No orders yet</div>
          )}
        </div>
      </div>

      {/* Users Table */}
      <div className="card overflow-hidden">
        <div className="p-5 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">Registered Users</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                {['Name', 'Email', 'Company', 'Phone', 'Role', 'Joined'].map(h => (
                  <th key={h} className="text-left py-3 px-4 text-gray-500 font-medium text-xs uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {users.map(user => (
                <tr key={user._id} className="hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium">{user.name}</td>
                  <td className="py-3 px-4 text-gray-500">{user.email}</td>
                  <td className="py-3 px-4 text-gray-500">{user.company || '—'}</td>
                  <td className="py-3 px-4 text-gray-500">{user.phone || '—'}</td>
                  <td className="py-3 px-4">
                    <span className={`badge ${user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-400 text-xs">
                    {new Date(user.createdAt).toLocaleDateString('en-PK')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {users.length === 0 && (
            <div className="text-center py-10 text-gray-400">No users yet</div>
          )}
        </div>
      </div>
    </div>
  )
}
