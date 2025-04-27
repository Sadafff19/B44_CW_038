import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import {
  FiLoader,
  FiAlertCircle,
  FiPlusCircle,
  FiEdit2,
  FiTrash2,
  FiBox
} from 'react-icons/fi'
import { useAuth } from '../../contexts/AuthContext'

const Products = () => {
  const navigate = useNavigate()
  const { user, loading: authLoading } = useAuth()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Fetch farmer's products
  const fetchProducts = async () => {
    try {
      setLoading(true)
      setError('')
      const token = localStorage.getItem('token')
      if (!token) throw new Error('Authentication required. Please login.')

      const res = await axios.get('http://localhost:4000/api/products', {
        headers: { Authorization: `Bearer ${token}` }
      })
      const all = Array.isArray(res.data) ? res.data : []
      // Filter to current farmer's products
      const mine = all.filter(
        (p) => p.farmerId?._id === user?._id || p.farmerId === user?._id
      )
      setProducts(mine)
    } catch (err) {
      console.error('Fetch products error', err)
      setError(err.response?.data?.error || err.message || 'Failed to load products.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!authLoading) fetchProducts()
  }, [authLoading])

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return
    try {
      const token = localStorage.getItem('token')
      await axios.delete(`/api/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setProducts((prev) => prev.filter((p) => p._id !== id))
    } catch (err) {
      console.error('Delete product error', err)
      alert(err.response?.data?.error || err.message || 'Failed to delete product.')
    }
  }

  if (authLoading || loading) {
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

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-gray-600 p-6">
        <FiBox className="text-6xl mb-4 text-gray-300" />
        <h2 className="text-2xl font-semibold mb-2">No products found</h2>
        <p className="mb-4">Start by adding your first product.</p>
        <Link
          to="/farmer/add-product"
          className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-full hover:bg-green-700 transition"
        >
          <FiPlusCircle className="mr-2" /> Add Product
        </Link>
      </div>
    )
  }

  // Helper to format price
  const formatPrice = (price) => {
    return typeof price === 'number' ? `₹${price.toFixed(2)}` : '—'
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <FiBox className="text-primary-500" /> My Products
        </h1>
        <Link
          to="/farmer/add-product"
          className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition"
        >
          <FiPlusCircle className="mr-1" /> Add Product
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div
            key={product._id}
            className="card flex flex-col overflow-hidden"
          >
            <div className="relative">
              <img
                src={product.imageUrl || '/placeholder.png'}
                alt={product.name || 'Product'}
                className="w-full h-48 object-cover"
                onError={(e) => (e.currentTarget.src = '/placeholder.png')}
              />
              {product.organic && (
                <span className="absolute top-2 left-2 bg-green-600 text-white text-xs px-2 py-1 rounded-full">
                  Organic
                </span>
              )}
            </div>
            <div className="p-4 flex-1 flex flex-col">
              <h2 className="text-lg font-semibold text-gray-800 mb-2 break-words">
                {product.name || 'Unnamed'}
              </h2>
              <p className="text-gray-600 mb-1">{formatPrice(product.price)}</p>
              <p className="text-gray-500 mb-4">Stock: {product.stock ?? '0'}</p>
              <div className="mt-auto flex gap-2">
                <button
                  onClick={() => navigate(`/farmer/products/${product._id}/edit`)}
                  className="flex-1 inline-flex items-center justify-center px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                >
                  <FiEdit2 className="mr-1" /> Edit
                </button>
                <button
                  onClick={() => handleDelete(product._id)}
                  className="flex-1 inline-flex items-center justify-center px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
                >
                  <FiTrash2 className="mr-1" /> Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Products