import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import {
  FiImage,
  FiTag,
  FiDollarSign,
  FiPackage,
  FiCheckCircle,
  FiLoader
} from 'react-icons/fi'
import { useAuth } from '../../contexts/AuthContext'

const AddProduct = () => {
  const { user } = useAuth()
  const navigate = useNavigate()

  // Form state
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    organic: false,
    imageUrl: ''
  })
  const [preview, setPreview] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  // Update image preview when URL changes
  useEffect(() => {
    if (!form.imageUrl) {
      setPreview('')
      return
    }
    const img = new Image()
    img.onload = () => setPreview(form.imageUrl)
    img.onerror = () => setPreview('')
    img.src = form.imageUrl
  }, [form.imageUrl])

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setError('')
    setSuccess(false)
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  // Validate and submit form
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess(false)

    // Front-end validation
    if (!form.name.trim()) return setError('Product name is required.')
    if (!form.price || isNaN(form.price) || Number(form.price) < 0)
      return setError('Please enter a valid non-negative price.')
    if (form.stock && (isNaN(form.stock) || Number(form.stock) < 0))
      return setError('Stock must be a non-negative number.')

    // Auth check
    const token = localStorage.getItem('token')
    if (!token) return setError('Authentication required. Please log in.')

    // Build payload
    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      price: parseFloat(form.price),
      stock: parseInt(form.stock || '0', 10),
      organic: form.organic,
      imageUrl: form.imageUrl.trim() || undefined,
      farmerId: user?._id
    }

    try {
      setLoading(true)
      await axios.post('http://localhost:4000/api/products', payload, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setSuccess(true)
      // Reset form
      setForm({ name: '', description: '', price: '', stock: '', organic: false, imageUrl: '' })
      setPreview('')
      // Redirect after a brief confirmation
      setTimeout(() => navigate('/farmer/products'), 800)
    } catch (err) {
      console.error('[AddProduct Error]', err)
      setError(err.response?.data?.error || 'Failed to add product. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">➕ Add New Product</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-lg p-6 space-y-6"
      >
        {error && (
          <div className="text-red-700 bg-red-100 p-3 rounded">
            {error}
          </div>
        )}
        {success && (
          <div className="flex items-center text-green-700 bg-green-100 p-3 rounded">
            <FiCheckCircle className="mr-2" /> Product added successfully!
          </div>
        )}

        {/* Name */}
        <div>
          <label className="block text-sm font-medium mb-1">
            <FiTag className="inline mr-1" /> Product Name *
          </label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            type="text"
            placeholder="Enter product name"
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Description (optional)
          </label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={4}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="Short description"
          />
        </div>

        {/* Price & Stock */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Price (₹) *
            </label>
            <input
              name="price"
              value={form.price}
              onChange={handleChange}
              type="number"
              placeholder="0.00"
              min="0"
              step="0.01"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              <FiPackage className="inline mr-1" /> Stock
            </label>
            <input
              name="stock"
              value={form.stock}
              onChange={handleChange}
              type="number"
              placeholder="0"
              min="0"
              step="1"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>

        {/* Organic Checkbox */}
        <div className="flex items-center">
          <input
            id="organic"
            name="organic"
            type="checkbox"
            checked={form.organic}
            onChange={handleChange}
            className="h-4 w-4 text-primary-600 border-gray-300 rounded"
          />
          <label htmlFor="organic" className="ml-2 text-sm font-medium">
            Organic Product
          </label>
        </div>

        {/* Image URL & Preview */}
        <div>
          <label className="block text-sm font-medium mb-1">
            <FiImage className="inline mr-1" /> Image URL
          </label>
          <input
            name="imageUrl"
            value={form.imageUrl}
            onChange={handleChange}
            type="url"
            placeholder="https://... (optional)"
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="mt-3 w-32 h-32 object-cover rounded border"
            />
          )}
        </div>

        {/* Submit Button */}
        <div className="flex justify-center">
        <button
  type="submit"
  disabled={loading}
  className="
    flex items-center gap-2
    bg-green-600 text-white
    px-6 py-2 rounded-md shadow
    hover:bg-green-700
    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500
    transition disabled:opacity-50 disabled:cursor-not-allowed
  "
>
            {loading ? (
              <>
                <FiLoader className="animate-spin" /> Adding...
              </>
            ) : (
              'Add Product'
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

export default AddProduct