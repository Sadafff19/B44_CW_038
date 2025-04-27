/* src/components/TopNav.jsx ----------------------------------------------- */
import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  FiShoppingCart,
  FiLogOut,
  FiUser,
  FiPackage
} from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';

export default function TopNav() {
  const { user, logout } = useAuth();
  const navigate         = useNavigate();

  /* small helper: the user’s initials or default icon */
  const initials = user?.name
    ? user.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : null;

  const logoutAndGo = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-30 w-full bg-white shadow">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16
                      flex items-center justify-between">
        {/* brand */}
        <Link to="/" className="text-xl font-bold text-green-600">
          FarmToKitchen
        </Link>

        {/* primary links */}
        <nav className="flex items-center gap-8">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `text-sm font-medium ${
                isActive ? 'text-green-700' : 'text-gray-700 hover:text-green-700'
              }`
            }
          >
            Home
          </NavLink>

          <NavLink
            to="/shop"
            className={({ isActive }) =>
              `text-sm font-medium ${
                isActive ? 'text-green-700' : 'text-gray-700 hover:text-green-700'
              }`
            }
          >
            Shop
          </NavLink>

          {/* cart icon – always visible */}
          <NavLink
            to="/cart"
            className={({ isActive }) =>
              `relative inline-flex items-center ${
                isActive ? 'text-green-700' : 'text-gray-600 hover:text-green-700'
              }`
            }
          >
            <FiShoppingCart size={22} />
            {/* optional badge
            <span className="absolute -top-1 -right-2 bg-red-600
                             text-white text-xs rounded-full px-1">
              3
            </span>
            */}
          </NavLink>

          {/* user menu – only when signed-in */}
          {user ? (
            <div className="relative group">
              <button className="w-9 h-9 rounded-full bg-green-600 text-white
                                 flex items-center justify-center font-semibold">
                {initials || <FiUser size={18} />}
              </button>

              {/* dropdown */}
              <div
                className="absolute right-0 mt-2 w-44 origin-top-right bg-white
                           border border-gray-200 rounded-md shadow-lg opacity-0
                           pointer-events-none group-focus-within:opacity-100
                           group-hover:opacity-100 group-focus-within:pointer-events-auto
                           group-hover:pointer-events-auto transition"
              >
                <NavLink
                  to="/orders"
                  className="flex items-center gap-2 px-4 py-2 text-sm
                             text-gray-700 hover:bg-gray-50"
                >
                  <FiPackage /> Orders
                </NavLink>

                <NavLink
                  to="/profile"
                  className="flex items-center gap-2 px-4 py-2 text-sm
                             text-gray-700 hover:bg-gray-50"
                >
                  <FiUser /> Profile
                </NavLink>

                <button
                  onClick={logoutAndGo}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm
                             text-red-600 hover:bg-gray-50"
                >
                  <FiLogOut /> Logout
                </button>
              </div>
            </div>
          ) : (
            /* if NOT logged-in show “Login” */
            <NavLink
              to="/login"
              className={({ isActive }) =>
                `text-sm font-medium ${
                  isActive ? 'text-green-700' : 'text-gray-700 hover:text-green-700'
                }`
              }
            >
              Login
            </NavLink>
          )}
        </nav>
      </div>
    </header>
  );
}