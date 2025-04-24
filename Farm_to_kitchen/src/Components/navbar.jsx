import { NavLink } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../context/userContext';
import { auth, db } from '../firebase/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

const Navbar = () => {
  const { isLogged } = useContext(UserContext);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userRef = doc(db, 'Users', user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setUserName(userSnap.data().name || '');
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const getInitials = (name) => {
    if (!name) return '';
    const parts = name.trim().split(' ');
    return (parts[0][0] + (parts[1]?.[0] || '')).toUpperCase();
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <i className="fas fa-leaf text-green-600 text-2xl mr-2"></i>
              <span className="text-xl font-bold text-gradient">FarmFresh</span>
            </div>
          </div>

          <div className="hidden md:ml-6 md:flex md:items-center md:space-x-8">
          <NavLink
              to="/"
              className={({ isActive }) =>
                isActive
                  ? 'text-green-600 border-b-2 border-green-600 inline-flex items-center px-1 pt-1 text-sm font-medium'
                  : 'text-gray-500 hover:text-gray-700 border-b-2 border-transparent hover:border-gray-300 inline-flex items-center px-1 pt-1 text-sm font-medium'
              }
            >
            Home
            </NavLink>
            <NavLink
              to="/shop"
              className={({ isActive }) =>
                isActive
                  ? 'text-green-600 border-b-2 border-green-600 inline-flex items-center px-1 pt-1 text-sm font-medium'
                  : 'text-gray-500 hover:text-gray-700 border-b-2 border-transparent hover:border-gray-300 inline-flex items-center px-1 pt-1 text-sm font-medium'
              }
            >
            Shop
            </NavLink>
            <NavLink
              to="/order"
              className={({ isActive }) =>
                isActive
                  ? 'text-green-600 border-b-2 border-green-600 inline-flex items-center px-1 pt-1 text-sm font-medium'
                  : 'text-gray-500 hover:text-gray-700 border-b-2 border-transparent hover:border-gray-300 inline-flex items-center px-1 pt-1 text-sm font-medium'
              }
            >
            Orders
            </NavLink>
            <NavLink
              to="/about"
              className={({ isActive }) =>
                isActive
                  ? 'text-green-600 border-b-2 border-green-600 inline-flex items-center px-1 pt-1 text-sm font-medium'
                  : 'text-gray-500 hover:text-gray-700 border-b-2 border-transparent hover:border-gray-300 inline-flex items-center px-1 pt-1 text-sm font-medium'
              }
            >
            About us
            </NavLink>
            <NavLink
              to="/contact"
              className={({ isActive }) =>
                isActive
                  ? 'text-green-600 border-b-2 border-green-600 inline-flex items-center px-1 pt-1 text-sm font-medium'
                  : 'text-gray-500 hover:text-gray-700 border-b-2 border-transparent hover:border-gray-300 inline-flex items-center px-1 pt-1 text-sm font-medium'
              }
            >
            Contact
            </NavLink>
          </div>

          <div className="flex items-center space-x-4">
            {isLogged ? (
              <>
                <NavLink to='/profile' className="relative bg-green-700 text-white w-10 h-10 flex items-center justify-center rounded-full text-sm font-semibold hover:bg-green-800 transition">
                  {getInitials(userName)}
                </NavLink>
              </>
            ) : (
              <NavLink to="/login" className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium">
                Sign In
              </NavLink>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
