import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import { getAuth } from 'firebase/auth'
import { useAuth } from '../../contexts/AuthContext'
import { FaGoogle } from 'react-icons/fa'
import { FiLoader, FiAlertCircle } from 'react-icons/fi'

const Signup = () => {
  const { user, loginWithGoogle } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // If already authenticated, redirect based on role
  useEffect(() => {
    if (user) {
      if (user.role === 'FARMER') navigate('/farmer/dashboard')
      else if (user.role === 'CONSUMER') navigate('/shop')
      else navigate('/')
    }
  }, [user, navigate])

  const handleGoogleSignup = async () => {
    setError('')
    setLoading(true)
    try {
      // 1️⃣ Sign in with Firebase
      await loginWithGoogle()
      const auth = getAuth()
      const fbUser = auth.currentUser
      if (!fbUser) throw new Error('Authentication failed')

      // 2️⃣ Force-refresh ID token
      const token = await fbUser.getIdToken(true)

      // 3️⃣ Send token to backend for signup
      const res = await axios.post('http://localhost:4000/api/auth/signup', { token })
      if (!res.data.success) {
        throw new Error(res.data.error || 'User creation failed')
      }

      // 4️⃣ Redirect based on returned role
      const role = res.data.user.role
      if (role === 'FARMER') navigate('/farmer/dashboard')
      else if (role === 'CONSUMER') navigate('/shop')
      else navigate('/')
    } catch (err) {
      console.error('Signup error:', err)
      setError(err.response?.data?.error || err.message || 'Failed to sign up. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-6">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-gray-800">Create your account</h1>
          <p className="text-gray-500">Sign up to start selling or shopping fresh local produce!</p>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-100 text-red-700 rounded">
            <FiAlertCircle className="text-xl" />
            <span>{error}</span>
          </div>
        )}

        <button
          onClick={handleGoogleSignup}
          disabled={loading}
          className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50"
        >
          {loading ? (
            <FiLoader className="animate-spin text-xl" />
          ) : (
            <><FaGoogle className="text-xl" /> Sign up with Google</>
          )}
        </button>

        <p className="text-center text-sm text-gray-500">
          Already have an account?{' '}
          <Link to="/login" className="text-primary-500 hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Signup