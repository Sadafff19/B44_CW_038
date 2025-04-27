import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import {
  FiLoader,
  FiTag,
  FiDollarSign,
  FiPackage,
  FiImage,
  FiCheckCircle,
  FiSave,
  FiAlertCircle,
  FiEdit2
} from 'react-icons/fi'

const EditProduct = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    organic: false,
    imageUrl: ''
  })
  const [preview, setPreview] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      setError('Authentication expired. Please login again.')
      setLoading(false)
      return
    }

    const fetchProduct = async () => {
      try {
        setLoading(true)
        const res = await axios.get(`http://localhost:4000/api/products/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        const p = res.data
        setForm({
          name: p.name || '',
          description: p.description || '',
          price: p.price?.toString() || '',
          stock: p.stock?.toString() || '',
          organic: p.organic || false,
          imageUrl: p.imageUrl || ''
        })
      } catch (e) {
        console.error('Fetch product error', e)
        setError(e.response?.data?.error || e.message || 'Failed to load product.')
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [id])

  useEffect(() => {
    if (form.imageUrl) {
      const img = new Image()
      img.onload = () => setPreview(form.imageUrl)
      img.onerror = () => setPreview('')
      img.src = form.imageUrl
    } else {
      setPreview('')
    }
  }, [form.imageUrl])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setError('')
    setSuccess(false)
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess(false)

    if (!form.name.trim() || !form.price) {
      setError('Product name and price are required.')
      return
    }

    const token = localStorage.getItem('token')
    if (!token) {
      setError('Please login to continue.')
      return
    }

    try {
      setSaving(true)
      const payload = {
        name: form.name.trim(),
        description: form.description.trim(),
        price: parseFloat(form.price),
        stock: parseInt(form.stock || '0', 10),
        organic: form.organic,
        imageUrl: form.imageUrl.trim() || undefined
      }
      await axios.put(`http://localhost:4000/api/products/${id}`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setSuccess(true)
      // Navigate back after a short pause
      setTimeout(() => navigate('/farmer/products'), 1000)
    } catch (e) {
      console.error('Update product error', e)
      setError(e.response?.data?.error || e.message || 'Failed to update product.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <FiLoader className="animate-spin text-4xl text-primary-500" />
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center flex items-center justify-center gap-2">
        <FiEdit2 className="text-blue-500" /> Edit Product
      </h1>

      {error && (
        <div className="flex items-center p-3 bg-red-100 text-red-700 rounded mb-4">
          <FiAlertCircle className="mr-2" /> {error}
        </div>
      )}

      {success && (
        <div className="flex items-center p-3 bg-green-100 text-green-700 rounded mb-4">
          <FiCheckCircle className="mr-2" /> Product updated successfully!
        </div>
      )}

      <form onSubmit={handleSubmit} className="card space-y-6">
        <div>
          <label className="block text-sm font-medium mb-1">
            <FiTag className="inline mr-1" /> Product Name *
          </label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="input"
            placeholder="Product name"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Description
          </label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="input h-24"
            placeholder="Short description (optional)"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              <FiDollarSign className="inline mr-1" /> Price (₹) *
            </label>
            <input
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
              className="input"
              placeholder="e.g. 199"
              min="0"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              <FiPackage className="inline mr-1" /> Stock
            </label>
            <input
              type="number"
              name="stock"
              value={form.stock}
              onChange={handleChange}
              className="input"
              placeholder="Available stock"
              min="0"
            />
          </div>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            name="organic"
            checked={form.organic}
            onChange={handleChange}
            className="mr-2"
          />
          <label className="text-sm font-medium">Organic</label>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            <FiImage className="inline mr-1" /> Image URL
          </label>
          <input
            type="url"
            name="imageUrl"
            value={form.imageUrl}
            onChange={handleChange}
            className="input"
            placeholder="https://..."
          />
          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="mt-3 w-32 h-32 object-cover rounded"
            />
          )}
        </div>

        <div className="flex justify-center">
          <button
            type="submit"
            disabled={saving}
            className="btn-primary flex items-center gap-2"
          >
            {saving ? (
              <>
                <FiLoader className="animate-spin" /> Saving...
              </>
            ) : (
              <>
                <FiSave className="mr-1" /> Save Changes
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

export default EditProduct