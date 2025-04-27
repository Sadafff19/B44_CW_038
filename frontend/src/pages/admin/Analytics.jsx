/* src/pages/admin/Analytics.jsx — safe edition */
import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import {
  FiLoader, FiUsers, FiUser, FiBox,
  FiClipboard, FiTrendingUp, FiRefreshCw, FiAlertCircle
} from 'react-icons/fi';
import {
  ResponsiveContainer, LineChart, Line,
  CartesianGrid, XAxis, YAxis, Tooltip,
  BarChart, Bar
} from 'recharts';

/* ——— helpers ——— */
const zeroTotals = {
  users: 0, farmers: 0, consumers: 0,
  products: 0, orders: 0, revenue: 0
};
const safe = n => (typeof n === 'number' ? n : 0);

export default function AdminAnalytics() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  /* fetch once / on retry */
  const load = useCallback(() => {
    (async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const { data } = await axios.get(
          'http://localhost:4000/api/admin/analytics',
          { headers: { Authorization: `Bearer ${token}` } }
        );
        /* guarantee shape */
        setStats({
          totals:     { ...zeroTotals, ...(data?.totals || {}) },
          ordersLast30: data?.ordersLast30 || [],
          topProducts:  data?.topProducts  || []
        });
        setErr('');
      } catch (e) {
        setErr(e.response?.data?.error || e.message || 'Load failed');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(load, [load]);

  /* --------------- early returns --------------- */
  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <FiLoader className="animate-spin text-4xl text-green-600" />
      </div>
    );
  }

  if (err) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <p className="flex items-center gap-2 text-red-600">
          <FiAlertCircle className="text-xl" /> {err}
        </p>
        <button
          onClick={load}
          className="flex items-center gap-2 px-5 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          <FiRefreshCw /> Retry
        </button>
      </div>
    );
  }

  /* if backend returned nothing */
  if (!stats) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <p className="text-gray-500 mb-4">No analytics data available.</p>
        <button onClick={load} className="btn-primary flex items-center gap-2">
          <FiRefreshCw /> Reload
        </button>
      </div>
    );
  }

  const { totals, ordersLast30, topProducts } = stats;

  /* --------------- dashboard --------------- */
  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* header */}
      <div className="flex items-center gap-4">
        <h1 className="text-3xl font-extrabold text-gray-800">Analytics</h1>
        <button
          onClick={load}
          className="ml-auto flex items-center gap-1 text-sm text-gray-600 hover:text-gray-800"
        >
          <FiRefreshCw /> refresh
        </button>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
        {[
          { label: 'Users',      val: safe(totals.users),     icon: FiUsers,      clr: 'text-blue-500'   },
          { label: 'Farmers',    val: safe(totals.farmers),   icon: FiUser,       clr: 'text-green-600'  },
          { label: 'Consumers',  val: safe(totals.consumers), icon: FiUser,       clr: 'text-indigo-500' },
          { label: 'Products',   val: safe(totals.products),  icon: FiBox,        clr: 'text-orange-500' },
          { label: 'Orders',     val: safe(totals.orders),    icon: FiClipboard,  clr: 'text-purple-600' },
          { label: 'Revenue',    val: `₹${safe(totals.revenue).toLocaleString()}`,
            icon: FiTrendingUp, clr: 'text-yellow-500' }
        ].map(({ label, val, icon:Icon, clr }) => (
          <div key={label} className="card p-4 flex flex-col gap-2">
            <Icon className={`text-3xl ${clr}`} />
            <span className="text-xl font-semibold text-gray-800">{val}</span>
            <span className="text-sm text-gray-500">{label}</span>
          </div>
        ))}
      </div>

      {/* charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Orders trend */}
        <div className="card p-4">
          <h2 className="font-semibold mb-2 text-gray-700">Orders – last 30 days</h2>
          {ordersLast30.length === 0 ? (
            <p className="text-sm text-gray-500">No data.</p>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={ordersLast30} key={ordersLast30.length}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#16a34a"
                  strokeWidth={2}
                  dot={false}
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Top products */}
        <div className="card p-4">
          <h2 className="font-semibold mb-2 text-gray-700">Top-selling products</h2>
          {topProducts.length === 0 ? (
            <p className="text-sm text-gray-500">No sales yet.</p>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={topProducts} key={topProducts.length}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 12 }}
                  interval={0}
                  angle={-15}
                  height={60}
                  textAnchor="end"
                />
                <YAxis />
                <Tooltip />
                <Bar dataKey="sold" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}

/* Add once to globals (e.g. index.css)
.card { @apply bg-white rounded-xl shadow hover:shadow-md transition; }
*/