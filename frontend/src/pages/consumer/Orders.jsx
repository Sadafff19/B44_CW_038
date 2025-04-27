import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../../contexts/AuthContext'
import {
  FiLoader,
  FiAlertCircle,
  FiClipboard,
  FiChevronRight
} from 'react-icons/fi'

const ConsumerOrders = () => {
  const { user, loading: authLoading } = useAuth()
  const navigate = useNavigate()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login')
    }
  }, [authLoading, user, navigate])

  // Fetch consumer orders
  const fetchOrders = async () => {
    try {
      setLoading(true)
      setError('')
      const token = localStorage.getItem('token')
      if (!token) throw new Error('Please login to view your orders.')

      const res = await axios.get('http://localhost:4000/api/orders/mine', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setOrders(Array.isArray(res.data) ? res.data : [])
    } catch (err) {
      console.error('Fetch consumer orders error:', err)
      setError(err.response?.data?.error || err.message || 'Failed to load your orders.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!authLoading) fetchOrders()
  }, [authLoading])

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <FiLoader className="animate-spin text-4xl text-green-600" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4 text-red-600">
        <FiAlertCircle className="mr-2 text-xl" /> {error}
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-gray-600 p-6">
        <FiClipboard className="text-6xl mb-4 text-gray-300" />
        <h2 className="text-2xl font-semibold mb-2">No orders found</h2>
        <p className="mb-4">Once you place an order, it will appear here.</p>
        <button
          onClick={() => navigate('/shop')}
          className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
        >
          Continue Shopping
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
        <FiClipboard className="text-2xl text-green-600" /> My Orders
      </h1>

      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order._id}
            onClick={() => navigate(`/orders/${order._id}`)}
            className="card flex items-center justify-between p-4 hover:bg-green-50 cursor-pointer transition"
          >
            <div>
              <p className="font-medium text-gray-800">Order #{order._id.slice(-6).toUpperCase()}</p>
              <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleString()}</p>
            </div>
            <div className="flex items-center gap-4">
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                  order.status === 'PAID' ? 'bg-green-100 text-green-800' :
                  'bg-gray-100 text-gray-800'
                }`}
              >
                {order.status}
              </span>
              <FiChevronRight className="text-gray-400" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ConsumerOrders