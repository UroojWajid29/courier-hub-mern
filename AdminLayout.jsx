import { useState } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import { LayoutDashboard, Package, Users, Truck, LogOut, Menu, User, Sun, Moon } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'

const navItems = [
  { to: '/admin', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/admin/orders', label: 'All Orders', icon: Package },
  { to: '/admin/users', label: 'Users', icon: Users },
  { to: '/admin/couriers', label: 'Couriers', icon: Truck },
]

export default function AdminLayout() {
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
    <div className="flex flex-col h-full bg-purple-900">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-purple-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-purple-500 rounded-lg flex items-center justify-center">
            <Truck className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="font-bold text-white text-lg leading-none">CourierHub</p>
            <p className="text-xs text-purple-300 mt-0.5">Admin Panel</p>
          </div>
        </div>
        <button onClick={toggleTheme} className="p-1.5 rounded-lg text-purple-300 hover:text-white hover:bg-purple-800 transition-colors">
          {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive ? 'bg-purple-600 text-white' : 'text-purple-200 hover:bg-purple-800 hover:text-white'
              }`
            }
          >
            <item.icon className="w-4 h-4 flex-shrink-0" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Switch to user view */}
      <div className="px-3 py-3 border-t border-purple-800">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 px-3 py-2 w-full rounded-lg text-sm text-purple-300 hover:bg-purple-800 hover:text-white transition-colors"
        >
          <User className="w-4 h-4" /> Switch to User View
        </button>
      </div>

      {/* User */}
      <div className="px-3 py-3 border-t border-purple-800">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-sm">{user?.name?.[0]?.toUpperCase()}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{user?.name}</p>
            <p className="text-xs text-purple-300 truncate">Administrator</p>
          </div>
          <button onClick={handleLogout} title="Logout" className="text-purple-300 hover:text-red-400 transition-colors">
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
        <header className="md:hidden bg-purple-900 px-4 py-3 flex items-center gap-3">
          <button onClick={() => setSidebarOpen(true)} className="text-white">
            <Menu className="w-6 h-6" />
          </button>
          <span className="font-bold text-white">Admin Panel</span>
        </header>
        <main className="flex-1 overflow-y-auto p-6 dark:bg-gray-950">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
