import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../../contexts/AuthContext'
import {
  FiSearch,
  FiLoader,
  FiAlertCircle,
  FiShoppingCart,
  FiBox,
  FiTag,
  FiDollarSign,
  FiPlusCircle
} from 'react-icons/fi'

const Shop = () => {
  const { user, loading: authLoading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const params = new URLSearchParams(location.search)
  const initialSearch = params.get('search') || ''

  const [products, setProducts] = useState([])
  const [search, setSearch] = useState(initialSearch)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [adding, setAdding] = useState({})
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)

  // Fetch products with pagination and search
  const fetchProducts = async ({ reset = false } = {}) => {
    try {
      if (reset) setLoading(true)
      setError('')
      const res = await axios.get('http://localhost:4000/api/products', {
        params: { search: search.trim(), page, limit: 12 }
      })
      const data = Array.isArray(res.data) ? res.data : []
      setProducts(prev => (reset ? data : [...prev, ...data]))
      setHasMore(data.length === 12)
    } catch (err) {
      console.error('Shop fetch error:', err)
      setError(err.response?.data?.error || 'Unable to load products.')
    } finally {
      setLoading(false)
    }
  }

  // Effect: initial load & search changes
  useEffect(() => {
    setPage(1)
    fetchProducts({ reset: true })
  }, [search])

  // Effect: load more pages
  useEffect(() => {
    if (page > 1) fetchProducts()
  }, [page])

  // Handle search submission
  const handleSearchKey = (e) => {
    if (e.key === 'Enter') {
      const term = e.target.value.trim()
      setSearch(term)
      navigate(`/shop?search=${encodeURIComponent(term)}`)
    }
  }

  // Add to cart handler
  const handleAddToCart = async (productId) => {
    if (!user) {
      navigate('/login')
      return
    }
    try {
      setAdding(prev => ({ ...prev, [productId]: true }))
      const token = localStorage.getItem('token')
      await axios.post(
        'http://localhost:4000/api/cart',
        { productId, qty: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      // Optionally navigate or show toast
    } catch (err) {
      console.error('Add to cart error:', err)
      alert(err.response?.data?.error || 'Failed to add to cart.')
    } finally {
      setAdding(prev => ({ ...prev, [productId]: false }))
    }
  }

  // Render loading
  if ((loading && page === 1) || authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <FiLoader className="animate-spin text-4xl text-green-600" />
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Search Bar */}
      <div className="relative max-w-md mx-auto">
        <FiSearch className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          defaultValue={initialSearch}
          onKeyDown={handleSearchKey}
          placeholder="Search produce..."
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      {/* Error State */}
      {error && (
        <div className="flex items-center gap-2 p-4 bg-red-100 text-red-700 rounded">
          <FiAlertCircle className="text-xl" /> {error}
        </div>
      )}

      {/* Products Grid */}
      {products.length === 0 && !loading ? (
        <div className="text-center text-gray-600 py-10">
          No products found.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((prod) => (
            <div
              key={prod._id}
              className="bg-white rounded-lg shadow hover:shadow-lg transition flex flex-col"
            >
              <Link to={`/shop/product/${prod._id}`} className="relative">
                <img
                  src={prod.imageUrl || '/placeholder.png'}
                  alt={prod.name}
                  onError={(e) => (e.currentTarget.src = '/placeholder.png')}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                {prod.organic && (
                  <span className="absolute top-2 left-2 bg-green-600 text-white text-xs px-2 py-1 rounded-full">
                    Organic
                  </span>
                )}
              </Link>
              <div className="p-4 flex-1 flex flex-col">
                <h3 className="font-semibold text-gray-800 mb-2 truncate">
                  {prod.name}
                </h3>
                <p className="text-green-600 font-bold mb-4 flex items-center">
                  
                  ₹{typeof prod.price === 'number' ? prod.price.toFixed(2) : '—'}
                </p>
                <button
                  onClick={() => handleAddToCart(prod._id)}
                  disabled={adding[prod._id]}
                  className="mt-auto inline-flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50"
                >
                  {adding[prod._id] ? (
                    <FiLoader className="animate-spin" />
                  ) : (
                    <>
                      <FiShoppingCart /> Add to Cart
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Load More */}
      {hasMore && (
        <div className="text-center">
          <button
            onClick={() => setPage((p) => p + 1)}
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  )
}

export default Shop
