// src/pages/consumer/Home.jsx

import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { FiHome, FiSearch, FiBox, FiAlertCircle, FiLoader } from 'react-icons/fi'

const Home = () => {
  const [featured, setFeatured] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchFeatured = async () => {
    try {
      setLoading(true)
      setError('')
      const res = await axios.get('http://localhost:4000/api/products/')
      setFeatured(Array.isArray(res.data) ? res.data : [])
    } catch (err) {
      console.error('Fetch featured products error:', err)
      setError(err.response?.data?.error || 'Unable to load featured products.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchFeatured()
  }, [])

  return (
    <div className="space-y-8 px-4 py-6 max-w-6xl mx-auto">
      {/* Hero */}
      <section className="bg-green-600 text-white rounded-xl p-8 flex flex-col md:flex-row items-center">
        <div className="flex-1">
          <h1 className="text-4xl font-bold mb-2 flex items-center gap-2">
            <FiHome className="text-3xl" /> Welcome to Farm To Kitchen
          </h1>
          <p className="text-lg">
            Discover fresh, local produce straight from your community’s farmers.
          </p>
        </div>
        <Link
          to="/shop"
          className="mt-4 md:mt-0 md:ml-6 inline-flex items-center gap-2 bg-white text-green-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition"
        >
          <FiBox /> Start Shopping
        </Link>
      </section>

      {/* Search bar */}
      <section>
        <div className="relative max-w-md mx-auto">
          <FiSearch className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search produce..."
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                window.location.href = `/shop?search=${encodeURIComponent(e.currentTarget.value.trim())}`
              }
            }}
          />
        </div>
      </section>

      {/* Featured Products */}
      <section>
        <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
          <FiBox className="text-xl text-green-600" /> Featured Produce
        </h2>

        {loading ? (
          <div className="flex justify-center py-10">
            <FiLoader className="animate-spin text-3xl text-green-600" />
          </div>
        ) : error ? (
          <div className="flex items-center gap-2 text-red-600 p-4 bg-red-100 rounded">
            <FiAlertCircle /> {error}
          </div>
        ) : featured.length === 0 ? (
          <div className="text-center text-gray-600 py-10">
            No featured items right now.{' '}
            <Link to="/shop" className="text-green-600 hover:underline">
              Browse all products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featured.map((prod) => (
              <Link
                key={prod._id}
                to={`/shop/product/${prod._id}`}
                className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden flex flex-col"
              >
                <div className="h-40 bg-gray-100">
                  <img
                    src={prod.imageUrl || '/placeholder.png'}
                    alt={prod.name}
                    onError={(e) => (e.currentTarget.src = '/placeholder.png')}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4 flex-1 flex flex-col">
                  <h3 className="font-medium text-gray-800 mb-2 break-words">
                    {prod.name}
                  </h3>
                  <p className="text-green-600 font-semibold mb-4">
                    ₹{typeof prod.price === 'number' ? prod.price.toFixed(2) : '—'}
                  </p>
                  <button className="mt-auto inline-block px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition text-center">
                    View Details
                  </button>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

export default Home