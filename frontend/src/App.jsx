import React from 'react'
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'

// Auth Pages
import Login from './pages/auth/Login'
import Signup from './pages/auth/Signup'

// Consumer Pages
import Home from './pages/consumer/Home'
import Shop from './pages/consumer/Shop'
import Cart from './pages/consumer/Cart'
import UserOrders from './pages/consumer/Orders'
import Profile from './pages/farmer/Profile' // shared Profile page
import ConsumerLayout from './pages/consumer/ConsumerLayout';

// Farmer Pages
import FarmerLayout from './pages/farmer/FarmerLayout'
import Dashboard from './pages/farmer/Dashboard'
import Products from './pages/farmer/Products'
import AddProduct from './pages/farmer/AddProduct'
import EditProduct from './pages/farmer/EditProduct'
import Orders from './pages/farmer/Orders'
import OrderDetail from './pages/farmer/OrderDetail'
import Weather from './pages/farmer/Weather'
import CropAdvisor from './pages/farmer/CropAdvisor'
import Messages from './pages/farmer/Messages'

// Admin Pages (stub)
import AdminLayout from './pages/admin/AdminLayout'
import AdminDashboard from './pages/admin/Dashboard'
import AdminUsers      from './pages/admin/Users'
import AdminProducts   from './pages/admin/Products'
import AdminOrders     from './pages/admin/Orders'
import AdminAnalytics  from './pages/admin/Analytics'
// Protected route wrapper
const RequireAuth = ({ roles }) => {
  const { user, loading } = useAuth()
  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>
  }
  if (!user) {
    return <Navigate to="/login" replace />
  }
  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/" replace />
  }
  return <Outlet />
}

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={<Home />} />

          {/* Consumer Routes */}
          <Route element={<RequireAuth roles={['CONSUMER']} />}>
  <Route element={<ConsumerLayout />}>     {/* wrap with layout */}
    <Route index   element={<Home />} />   {/* “/” after login */}
    <Route path="shop"    element={<Shop />} />
    <Route path="cart"    element={<Cart />} />
    <Route path="orders"  element={<UserOrders />} />
    <Route path="profile" element={<Profile />} />
 </Route>
</Route>

          {/* Farmer Routes */}
          <Route element={<RequireAuth roles={[ 'FARMER' ]} />}>
            <Route path="/farmer" element={<FarmerLayout />}>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="products" element={<Products />} />
              <Route path="add-product" element={<AddProduct />} />
              <Route path="products/:id/edit" element={<EditProduct />} />
              <Route path="orders" element={<Orders />} />
              <Route path="orders/:id" element={<OrderDetail />} />
              <Route path="weather" element={<Weather />} />
              <Route path="ai" element={<CropAdvisor />} />
              <Route path="messages" element={<Messages />} />
              <Route path="profile" element={<Profile />} />
            </Route>
          </Route>

          {/* Admin Routes */}
          /* src/App.jsx  (excerpt) */
<Route element={<RequireAuth roles={['ADMIN']} />}>
  <Route path="/admin" element={<AdminLayout />}>

    {/* default → dashboard */}
    <Route index         element={<AdminDashboard />} />
    <Route path="dashboard" element={<AdminDashboard />} />

    {/* NEW — management sections */}
    <Route path="users"     element={<AdminUsers />} />
    <Route path="products"  element={<AdminProducts />} />
    <Route path="orders"    element={<AdminOrders />} />
    <Route path="analytics"  element={<AdminAnalytics />} />
    {/* you can keep adding:  <Route path="stats" element={<AdminStats />} />  */}
  </Route>
</Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App