import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../../contexts/AuthContext'
import {
  FiLoader,
  FiAlertCircle,
  FiShoppingCart,
  FiTrash2,
  FiMinusCircle,
  FiPlusCircle,
  FiCreditCard
} from 'react-icons/fi'

const Cart = () => {
  const { user, loading: authLoading } = useAuth()
  const navigate = useNavigate()

  const [cartItems, setCartItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [updating, setUpdating] = useState({}) // track per-item updates

  // Redirect unauthenticated consumers
  useEffect(() => {
    if (!authLoading && !user) navigate('/login')
  }, [authLoading, user, navigate])

  // Fetch cart from backend
  const fetchCart = async () => {
    try {
      setLoading(true)
      setError('')
      const token = localStorage.getItem('token')
      if (!token) throw new Error('Authentication required.')

      const res = await axios.get('http://localhost:4000/api/cart', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setCartItems(Array.isArray(res.data.items) ? res.data.items : [])
    } catch (err) {
      console.error('Fetch cart error:', err)
      setError(err.response?.data?.error || 'Failed to load cart.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!authLoading) fetchCart()
  }, [authLoading])

  // Change quantity handler
  const handleQuantityChange = async (itemId, newQty) => {
    if (newQty < 1) return
    try {
      setUpdating((u) => ({ ...u, [itemId]: true }))
      const token = localStorage.getItem('token')
      await axios.put(
        `http://localhost:4000/api/cart`,
        { itemId, qty: newQty },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setCartItems((items) =>
        items.map((it) => (it._id === itemId ? { ...it, qty: newQty } : it))
      )
    } catch (err) {
      console.error('Update cart error:', err)
      setError(err.response?.data?.error || 'Failed to update quantity.')
    } finally {
      setUpdating((u) => ({ ...u, [itemId]: false }))
    }
  }

  // Remove item handler
  const handleRemove = async (itemId) => {
    if (!window.confirm('Remove this item from your cart?')) return
    try {
      setUpdating((u) => ({ ...u, [itemId]: true }))
      const token = localStorage.getItem('token')
      await axios.delete(`http://localhost:4000/api/cart/${itemId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setCartItems((items) => items.filter((it) => it._id !== itemId))
    } catch (err) {
      console.error('Remove cart item error:', err)
      setError(err.response?.data?.error || 'Failed to remove item.')
    } finally {
      setUpdating((u) => ({ ...u, [itemId]: false }))
    }
  }

  // Compute totals
  const subtotal = cartItems.reduce(
    (sum, it) => sum + (it.price || 0) * (it.qty || 0),
    0
  )

  const isAnyUpdating = Object.values(updating).some(Boolean)

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

  if (cartItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-gray-600 p-6">
        <FiShoppingCart className="text-6xl mb-4 text-gray-300" />
        <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
        <Link
          to="/shop"
          className="mt-4 inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
        >
          Continue Shopping
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
        <FiShoppingCart className="text-2xl text-green-600" /> My Cart
      </h1>

      <div className="space-y-4">
        {cartItems.map((item) => (
          <div
            key={item._id}
            className="flex flex-col md:flex-row items-center bg-white p-4 rounded-lg shadow-md"
          >
            <img
              src={item.productId?.imageUrl || '/placeholder.png'}
              alt={item.productId?.name}
              onError={(e) => (e.currentTarget.src = '/placeholder.png')}
              className="w-24 h-24 object-cover rounded mb-4 md:mb-0 md:mr-6"
            />
            <div className="flex-1 w-full">
              <h2 className="text-lg font-medium text-gray-800">
                {item.productId?.name}
              </h2>
              <p className="text-gray-600 mb-2">
                Unit Price: ₹{(item.price || 0).toFixed(2)}
              </p>
              <div className="flex items-center gap-2 mb-2">
                <button
                  onClick={() => handleQuantityChange(item._id, item.qty - 1)}
                  disabled={updating[item._id] || item.qty <= 1}
                  className={`p-1 rounded-full bg-gray-200 hover:bg-gray-300 transition disabled:opacity-50`}
                >
                  <FiMinusCircle />
                </button>
                <span className="px-2">{item.qty}</span>
                <button
                  onClick={() => handleQuantityChange(item._id, item.qty + 1)}
                  disabled={updating[item._id]}
                  className="p-1 rounded-full bg-gray-200 hover:bg-gray-300 transition disabled:opacity-50"
                >
                  <FiPlusCircle />
                </button>
              </div>
              <p className="text-gray-800 font-semibold mb-2">
                Total: ₹{((item.price || 0) * item.qty).toFixed(2)}
              </p>
            </div>
            <button
              onClick={() => handleRemove(item._id)}
              disabled={updating[item._id]}
              className="mt-4 md:mt-0 md:ml-4 p-2 bg-red-600 text-white rounded hover:bg-red-700 transition disabled:opacity-50"
            >
              <FiTrash2 />
            </button>
          </div>
        ))}
      </div>

      {/* Summary and Checkout */}
      <div className="bg-white p-6 rounded-lg shadow-md flex flex-col md:flex-row items-center justify-between">
        <div className="mb-4 md:mb-0">
          <p className="text-gray-600">Subtotal</p>
          <p className="text-2xl font-bold">₹{subtotal.toFixed(2)}</p>
        </div>
        <button
          onClick={() => navigate('/checkout')}
          disabled={isAnyUpdating}
          className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50"
        >
          <FiCreditCard /> Proceed to Checkout
        </button>
      </div>
    </div>
  )
}

export default Cart
