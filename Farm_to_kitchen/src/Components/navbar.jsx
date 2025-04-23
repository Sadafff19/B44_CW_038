
import { NavLink } from 'react-router-dom';
import { useContext } from 'react';
import { UserContext } from '../context/userContext';

const Navbar = () => {
  const { isLogged } = useContext(UserContext);

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
            <NavLink to='/' className="text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 border-green-500 text-sm font-medium">Home</NavLink>
            <NavLink to='/shop' className="text-gray-500 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-gray-300 text-sm font-medium">Shop</NavLink>
            <NavLink to='/order' className="text-gray-500 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-gray-300 text-sm font-medium">Orders</NavLink>
            <NavLink to='/about' className="text-gray-500 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-gray-300 text-sm font-medium">About</NavLink>
            <NavLink to='/contact' className="text-gray-500 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-gray-300 text-sm font-medium">Contact</NavLink>
          </div>
          <div className="flex items-center">
            {isLogged ? (
              <NavLink to='/profile' className='pages'>Profile</NavLink>
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
