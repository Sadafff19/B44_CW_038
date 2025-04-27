// src/pages/admin/AdminLayout.jsx
import React, { useState, useEffect } from 'react'
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom'
import {
  FiGrid,
  FiUsers,
  FiPackage,
  FiBarChart2,
  FiLogOut,
  FiMenu,
  FiX
} from 'react-icons/fi'
import { useAuth } from '../../contexts/AuthContext'

const navItems = [
  { label: 'Dashboard', to: '/admin/dashboard', icon: <FiGrid /> },
  { label: 'Users',     to: '/admin/users',     icon: <FiUsers /> },
  { label: 'Products',  to: '/admin/products',  icon: <FiPackage /> },
  { label: 'Analytics', to: '/admin/analytics', icon: <FiBarChart2 /> }
]

export default function AdminLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, loading, logout } = useAuth()     // grab logout()
  const [mobileOpen, setMobileOpen] = useState(false)

  // Redirect unauthorized
  useEffect(() => {
    if (!loading && (!user || user.role !== 'ADMIN')) {
      navigate('/login', { replace: true })
    }
  }, [loading, user, navigate])

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <FiMenu className="animate-spin text-4xl text-gray-500" />
      </div>
    )
  }

  const handleLogout = async () => {
    try {
      await logout()              // calls Firebase signOut, removes token, redirects
    } catch (err) {
      console.error('Logout failed', err)
      // fallback:
      localStorage.removeItem('token')
      navigate('/login', { replace: true })
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:flex-col md:w-64 bg-white shadow-lg">
        <div className="flex items-center justify-center h-16 font-bold text-xl text-indigo-600">
          Admin Console
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center px-3 py-2 rounded-md transition-colors ${
                  isActive
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`
              }
            >
              <span className="text-lg mr-3">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </NavLink>
          ))}
        </nav>
        <button
          onClick={handleLogout}
          className="flex items-center justify-center h-12 mb-4 mx-4 rounded-md bg-red-600 text-white hover:bg-red-700 transition"
        >
          <FiLogOut className="mr-2" /> Logout
        </button>
      </aside>

      {/* Mobile Header */}
      <header className="md:hidden flex items-center justify-between bg-white shadow h-16 px-4">
        <div className="font-bold text-xl text-indigo-600">Admin Console</div>
        <button onClick={() => setMobileOpen((o) => !o)}>
          {mobileOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </header>

      {/* Mobile Overlay Menu */}
      {mobileOpen && (
        <aside className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-10">
          <div className="bg-white w-64 h-full shadow-lg p-4">
            <nav className="space-y-4">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center px-3 py-2 rounded-md transition-colors ${
                      isActive
                        ? 'bg-indigo-100 text-indigo-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`
                  }
                >
                  <span className="text-lg mr-3">{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                </NavLink>
              ))}
            </nav>
            <button
              onClick={handleLogout}
              className="flex items-center justify-center w-full mt-6 h-10 rounded-md bg-red-600 text-white hover:bg-red-700 transition"
            >
              <FiLogOut className="mr-2" /> Logout
            </button>
          </div>
        </aside>
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-4 md:p-6">
        <Outlet />
      </main>
    </div>
  )
}