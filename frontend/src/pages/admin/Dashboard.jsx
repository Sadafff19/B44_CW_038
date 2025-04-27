/* src/pages/admin/AdminDashboard.jsx */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  FiHome, FiUsers, FiBox, FiClipboard,FiUser,
  FiTrendingUp, FiLoader, FiAlertCircle
} from 'react-icons/fi';

export default function AdminDashboard() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  /* redirect non-admins */
  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'ADMIN')) {
      navigate('/login');
    }
  }, [authLoading, user, navigate]);

  /* fetch once */
  useEffect(() => {
    if (authLoading) return;

    (async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const { data } = await axios.get(
          'http://localhost:4000/api/admin/stats',
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setStats(data);
        setErr('');
      } catch (e) {
        setErr(e.response?.data?.error || e.message || 'Failed to load stats');
      } finally {
        setLoading(false);
      }
    })();
  }, [authLoading]);

  /* loaders / errors */
  if (authLoading || loading)
    return (
      <div className="flex items-center justify-center h-screen">
        <FiLoader className="animate-spin text-4xl text-blue-500" />
      </div>
    );

  if (err)
    return (
      <div className="flex items-center justify-center h-screen text-red-600 p-4">
        <FiAlertCircle className="mr-2" /> {err}
      </div>
    );

  /* fallback if backend responded unexpectedly */
  if (!stats)
    return <p className="text-center mt-20 text-gray-500">No data available.</p>;

  const cards = [
    {
      label: 'Total Users',
      value: stats.totalUsers,
      icon: <FiUsers className="text-4xl text-indigo-500" />,
      route: '/admin/users'
    },
    {
      label: 'Farmers',
      value: stats.totalFarmers,
      icon: <FiUsers className="text-4xl text-green-600" />,
      route: '/admin/farmers'
    },
    {
      label: 'Consumers',
      value: stats.totalConsumers,
      icon: <FiUsers className="text-4xl text-blue-500" />,
      route: '/admin/consumers'
    },
    {
      label: 'Admins',
      value: stats.totalAdmins,
      icon: <FiUser className="text-4xl text-rose-500" />,
      route: '/admin/users?role=ADMIN'
    },
    {
      label: 'Products',
      value: stats.totalProducts,
      icon: <FiBox className="text-4xl text-purple-500" />,
      route: '/admin/products'
    },
    {
      label: 'Orders',
      value: stats.totalOrders,
      icon: <FiClipboard className="text-4xl text-yellow-500" />,
      route: '/admin/orders'
    },
    {
      label: 'Revenue',
      value: `₹${(stats.totalRevenue || 0).toLocaleString()}`,
      icon: <FiTrendingUp className="text-4xl text-amber-500" />,
      route: '/admin/analytics'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
        <FiHome className="text-2xl text-blue-600" /> Admin&nbsp;Dashboard
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        {cards.map(({ label, value, icon, route }) => (
          <div
            key={label}
            onClick={() => navigate(route)}
            className="card cursor-pointer p-6 flex flex-col gap-6 hover:bg-blue-50 transition"
          >
            {icon}
            <div>
              <p className="text-3xl font-semibold text-gray-800">{value}</p>
              <p className="text-gray-500">{label}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* global style (tailwind layer) — keep DRY
.card { @apply bg-white rounded-xl shadow hover:shadow-md transition; }
*/