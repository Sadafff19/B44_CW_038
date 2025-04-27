import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate, Link } from 'react-router-dom'
import { FcGoogle } from 'react-icons/fc'
import { FiLoader, FiAlertCircle } from 'react-icons/fi'
import { getAuth } from 'firebase/auth'
import { useAuth } from '../../contexts/AuthContext'

const Login = () => {
  const { loginWithGoogle, user, loading: authLoading } = useAuth()
  const [error, setError] = useState('')
  const [btnLoading, setBtnLoading] = useState(false)
  const navigate = useNavigate()

  // Redirect if already logged in
  useEffect(() => {
    if (!authLoading && user) {
      if (user.role === 'FARMER') navigate('/farmer/dashboard')
      else if (user.role === 'CONSUMER') navigate('/shop')
      else navigate('/')
    }
  }, [authLoading, user, navigate])

  const handleGoogleLogin = async () => {
    setError('')
    setBtnLoading(true)
    try {
      // 1️⃣ Sign in with Firebase
      await loginWithGoogle()
      const auth = getAuth()
      const fbUser = auth.currentUser
      if (!fbUser) throw new Error('Authentication failed')

      // 2️⃣ Force-refresh ID token
      const token = await fbUser.getIdToken(true)

      // 3️⃣ Send token to backend for login
      const res = await axios.post('http://localhost:4000/api/auth/login', { token })
      if (!res.data.success) {
        throw new Error(res.data.error || 'Login failed')
      }

      // 4️⃣ Redirect based on returned role
      const role = res.data.user.role
      if (role === 'FARMER') navigate('/farmer/dashboard')
      else if (role === 'CONSUMER') navigate('/shop')
      else navigate('/')
    } catch (err) {
      console.error('Login error:', err)
      setError(err.response?.data?.error || err.message || 'Login failed. Please try again.')
    } finally {
      setBtnLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-sm w-full bg-white p-8 rounded-2xl shadow-lg">
        <h1 className="text-2xl font-bold mb-6 text-center flex items-center justify-center gap-2">
          <FcGoogle className="text-3xl" /> Farm To Kitchen
        </h1>

        {error && (
          <div className="mb-4 flex items-center text-red-600 p-2 bg-red-100 rounded">
            <FiAlertCircle className="mr-2" />
            {error}
          </div>
        )}

        <button
          onClick={handleGoogleLogin}
          disabled={btnLoading}
          className="w-full py-3 flex items-center justify-center gap-2 border border-gray-300 rounded-md hover:bg-gray-100 transition disabled:opacity-50"
        >
          {btnLoading ? (
            <FiLoader className="animate-spin text-xl" />
          ) : (
            <FcGoogle className="text-2xl" />
          )}
          <span className="font-medium">
            {btnLoading ? 'Signing in...' : 'Sign in with Google'}
          </span>
        </button>

        <p className="text-sm text-center mt-4 text-gray-500">
          First time here?{' '}
          <Link to="/signup" className="text-primary-500 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Login
