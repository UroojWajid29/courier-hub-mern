import { useState } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import toast from 'react-hot-toast'
import {
  LayoutDashboard, Package, Plus, Search, Truck,
  Menu, LogOut, Shield, Link2, User, Sun, Moon, Calculator
} from 'lucide-react'

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/orders', label: 'My Orders', icon: Package },
  { to: '/orders/new', label: 'New Shipment', icon: Plus },
  { to: '/track', label: 'Track Order', icon: Search },
  { to: '/rates', label: 'Rate Calculator', icon: Calculator },
  { to: '/couriers', label: 'Couriers', icon: Truck },
  { to: '/profile', label: 'Profile', icon: User },
]

const quickLinks = [
  { name: 'TCS Express', url: 'https://www.tcsexpress.com', color: 'text-red-500' },
  { name: 'Leopards', url: 'https://www.leopardscourier.com', color: 'text-orange-500' },
  { name: 'M&P Express', url: 'https://mulphilog.com.pk', color: 'text-blue-600' },
]

export default function Layout() {
  const { user, logout } = useAuth()
  const { isDark, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    toast.success('Logged out!')
    navigate('/login')
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700">
      <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center">
            <Truck className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="font-bold text-gray-900 dark:text-white text-lg leading-none">CourierHub</p>
            <p className="text-xs text-gray-400 mt-0.5">Shipment Management</p>
          </div>
        </div>
        <button onClick={toggleTheme} className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
          {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
              }`
            }
          >
            <item.icon className="w-4 h-4 flex-shrink-0" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      {user?.role === 'admin' && (
        <div className="px-3 py-2 border-t border-gray-100 dark:border-gray-700">
          <button
            onClick={() => { setSidebarOpen(false); navigate('/admin') }}
            className="flex items-center gap-2 px-3 py-2.5 w-full rounded-lg text-sm font-medium bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 hover:bg-purple-100 transition-colors"
          >
            <Shield className="w-4 h-4" /> Switch to Admin Panel
          </button>
        </div>
      )}

      <div className="px-3 py-3 border-t border-gray-100 dark:border-gray-700">
        <p className="text-xs font-semibold text-gray-400 px-3 mb-2 uppercase tracking-wider">Quick Links</p>
        {quickLinks.map(c => (
          <a key={c.name} href={c.url} target="_blank" rel="noopener noreferrer"
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium ${c.color} hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors`}>
            <Link2 className="w-3 h-3" /> {c.name}
          </a>
        ))}
      </div>

      <div className="px-3 py-3 border-t border-gray-100 dark:border-gray-700">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-blue-700 dark:text-blue-400 font-bold text-sm">{user?.name?.[0]?.toUpperCase()}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{user?.name}</p>
            <p className="text-xs text-gray-400 truncate">{user?.email}</p>
          </div>
          <button onClick={handleLogout} title="Logout" className="text-gray-400 hover:text-red-500 transition-colors">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-950 overflow-hidden">
      <aside className="hidden md:flex w-60 flex-col flex-shrink-0">
        <SidebarContent />
      </aside>

      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <aside className="relative w-64 flex flex-col">
            <SidebarContent />
          </aside>
        </div>
      )}

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="md:hidden bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex items-center gap-3">
          <button onClick={() => setSidebarOpen(true)} className="text-gray-500 dark:text-gray-400">
            <Menu className="w-6 h-6" />
          </button>
          <span className="font-bold text-blue-600">CourierHub</span>
        </header>
        <main className="flex-1 overflow-y-auto p-6 dark:bg-gray-950">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
