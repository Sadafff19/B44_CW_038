import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import {
  FiLoader,
  FiPackage,
  FiClock,
  FiAlertCircle,
  FiChevronRight
} from 'react-icons/fi'

const Orders = () => {
  const navigate = useNavigate()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchOrders = async () => {
    try {
      setLoading(true)
      setError('')
      const token = localStorage.getItem('token')
      if (!token) throw new Error('Please login to view your orders.')
      const res = await axios.get('http://localhost:4000/api/orders/farmer', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setOrders(Array.isArray(res.data) ? res.data : [])
    } catch (e) {
      console.error('Orders fetch error:', e)
      setError(e.response?.data?.error || e.message || 'Unable to load orders.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <FiLoader className="animate-spin text-4xl text-primary-500" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4 text-red-600">
        <FiAlertCircle className="mr-2" /> {error}
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-gray-500 p-6">
        <FiPackage className="text-6xl mb-4 text-gray-300" />
        <p className="text-xl mb-4">No orders received yet.</p>
        <button
          onClick={() => navigate('/farmer/products')}
          className="btn-primary"
        >
          Add Products to Get Orders
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-4">
      <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
        <FiPackage className="text-primary-500" /> Orders Received
      </h1>
      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order._id}
            className="card flex flex-col md:flex-row md:items-center justify-between cursor-pointer hover:bg-gray-50 transition"
            onClick={() => navigate(`/farmer/orders/${order._id}`)}
          >
            <div className="flex items-center gap-4">
              <FiClock className="text-xl text-gray-500" />
              <div>
                <p className="font-medium text-gray-800">ID: {order._id.slice(-6).toUpperCase()}</p>
                <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleString()}</p>
              </div>
            </div>
            <div className="mt-3 md:mt-0 flex items-center gap-4">
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

export default Orders
