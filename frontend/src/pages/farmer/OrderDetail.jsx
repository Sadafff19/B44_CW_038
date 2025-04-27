import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import {
  FiArrowLeft,
  FiPackage,
  FiDollarSign,
  FiClock,
  FiUser,
  FiAlertCircle,
  FiLoader,
  FiMapPin
} from 'react-icons/fi'

const OrderDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true)
        setError('')
        const token = localStorage.getItem('token')
        if (!token) throw new Error('Session expired. Please log in again.')

        const response = await axios.get(`/api/orders/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        })

        setOrder(response.data)
      } catch (err) {
        console.error('OrderDetail Error:', err)
        setError(err.response?.data?.error || err.message || 'Unable to load order.')
      } finally {
        setLoading(false)
      }
    }
    fetchOrder()
  }, [id])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <FiLoader className="animate-spin text-4xl text-primary-500" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen p-4 text-red-600">
        <FiAlertCircle className="text-3xl mb-2" />
        <p className="text-lg mb-4">{error}</p>
        <button
          onClick={() => navigate('/farmer/orders')}
          className="btn-primary flex items-center gap-2"
        >
          <FiArrowLeft /> Back to Orders
        </button>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center h-screen p-4 text-gray-600">
        <FiAlertCircle className="text-3xl mb-2" />
        <p className="text-lg mb-4">Order not found.</p>
        <button
          onClick={() => navigate('/farmer/orders')}
          className="btn-primary flex items-center gap-2"
        >
          <FiArrowLeft /> Go Back
        </button>
      </div>
    )
  }

  const { consumerId, status, createdAt, items = [] } = order
  const totalAmount = items.reduce(
    (sum, item) => sum + (item.price || 0) * (item.qty || 0),
    0
  )

  return (
    <div className="max-w-4xl mx-auto my-8 p-6 space-y-6">
      <button
        onClick={() => navigate('/farmer/orders')}
        className="flex items-center text-gray-700 hover:text-gray-900"
      >
        <FiArrowLeft className="mr-2" /> Back to Orders
      </button>

      <div className="card space-y-6">
        {/* Order Header */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <FiPackage className="text-2xl text-primary-500" />
            <h2 className="text-2xl font-semibold">
              Order #{order._id.slice(-6).toUpperCase()}
            </h2>
          </div>
          <div className="flex items-center gap-2 text-gray-500">
            <FiClock />
            <span>{new Date(createdAt).toLocaleString()}</span>
          </div>
        </div>

        {/* Customer Info */}
        <div className="flex items-center gap-2">
          <FiUser className="text-xl text-gray-500" />
          <span className="font-medium">
            {consumerId?.name || 'Unknown Customer'}
          </span>
        </div>

        {/* Items List */}
        <div className="space-y-4">
          {items.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center gap-4 border-b pb-4"
            >
              <img
                src={item.productId?.imageUrl || '/placeholder.png'}
                alt={item.productId?.name || 'Product'}
                className="w-24 h-24 object-cover rounded"
              />
              <div className="flex-1">
                <h3 className="text-lg font-medium break-words">
                  {item.productId?.name || 'Unnamed Product'}
                </h3>
                <p className="text-gray-500">Qty: {item.qty}</p>
                <p className="text-gray-500 flex items-center gap-1">
                  <FiDollarSign /> {item.price.toFixed(2)} each
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Order Total */}
        <div className="text-right">
          <span className="text-xl font-semibold mr-2">Total:</span>
          <span className="text-2xl font-bold text-primary-600 flex items-center gap-1 justify-end">
            <FiDollarSign /> {totalAmount.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  )
}

export default OrderDetail