import React, { useState, useEffect } from 'react'
import axios from 'axios'
import {
  FiLoader,
  FiMapPin,
  FiThermometer,
  FiWind,
  FiDroplet,
  FiCloud,
  FiSunrise,
  FiSunset,
  FiRepeat,
  FiAlertCircle
} from 'react-icons/fi'
import { useAuth } from '../../contexts/AuthContext'

const Weather = () => {
  const { user, loading: authLoading } = useAuth()
  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Fetch current weather from backend
  const fetchWeather = async () => {
    if (!user) return
    const token = localStorage.getItem('token')
    if (!token) {
      setError('Authentication required. Please log in.')
      setLoading(false)
      return
    }
    const coords = user.location?.coordinates
    if (!coords || coords.length !== 2) {
      setError('Location not set. Please update your profile.')
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError('')
      const res = await axios.get('http://localhost:4000/api/weather/current', {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = res.data
      if (!data || typeof data.temperature !== 'number') {
        throw new Error('Incomplete weather data received.')
      }
      setWeather(data)
    } catch (err) {
      console.error('[Weather Error]', err)
      setError(err.response?.data?.error || err.message || 'Failed to load weather data.')
    } finally {
      setLoading(false)
    }
  }

  // Initial load
  useEffect(() => {
    if (!authLoading) fetchWeather()
  }, [authLoading, user])

  // Format ISO timestamps to HH:MM
  const formatTime = (dateStr) => {
    try {
      return new Date(dateStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    } catch {
      return '--'
    }
  }

  // Loading or auth-check
  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center h-full min-h-screen">
        <FiLoader className="animate-spin text-6xl text-primary-500" />
      </div>
    )
  }

  return (
    <div className="w-full max-w-4xl mx-auto py-10 px-6 space-y-10">
      {/* Header */}
      <h1 className="text-4xl font-bold text-gray-800 flex items-center gap-3">
        <FiCloud className="text-6xl text-blue-500" /> Current Weather
      </h1>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-3 p-4 bg-red-100 text-red-700 rounded-lg">
          <FiAlertCircle className="text-2xl" />
          <p className="text-lg">{error}</p>
        </div>
      )}

      {/* Weather Card */}
      {weather && !error && (
        <div className="bg-white shadow-lg rounded-xl p-8 space-y-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <FiMapPin className="text-2xl text-gray-600" />
              <span className="text-xl font-medium text-gray-800">{weather.location}</span>
            </div>
            <button
              onClick={fetchWeather}
              className="text-gray-600 hover:text-gray-800 text-2xl transition"
            >
              <FiRepeat />
            </button>
          </div>

          <div className="flex flex-col md:flex-row justify-around items-center gap-10">
            <div className="text-center">
              <FiThermometer className="text-7xl text-red-500" />
              <p className="text-6xl font-bold mt-2">{Math.round(weather.temperature)}°C</p>
              <p className="text-gray-500 mt-1">Feels like {Math.round(weather.feels_like)}°C</p>
            </div>
            <div className="text-center">
              <FiCloud className="text-7xl text-blue-500" />
              <p className="capitalize text-xl font-medium text-gray-700 mt-2">{weather.weather}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 text-base text-gray-600">
            <div className="flex items-center gap-2">
              <FiDroplet className="text-2xl text-blue-400" />
              <span>Humidity: <strong>{weather.humidity}%</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <FiWind className="text-2xl text-green-400" />
              <span>Wind: <strong>{weather.wind_speed} m/s</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <FiCloud className="text-2xl text-gray-400" />
              <span>Cloud Cover: <strong>{weather.cloud_cover}%</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <FiSunrise className="text-2xl text-yellow-500" />
              <span>Sunrise: <strong>{formatTime(weather.sunrise)}</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <FiSunset className="text-2xl text-orange-500" />
              <span>Sunset: <strong>{formatTime(weather.sunset)}</strong></span>
            </div>
          </div>
        </div>
      )}

      {/* No Data */}
      {!weather && !error && (
        <div className="flex flex-col items-center text-gray-500 space-y-4">
          <p className="text-lg">No weather data available.</p>
          <button
            onClick={fetchWeather}
            className="inline-flex items-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-lg text-lg hover:bg-primary-700 transition"
          >
            <FiRepeat className="text-xl" /> Retry
          </button>
        </div>
      )}
    </div>
  )
}

export default Weather