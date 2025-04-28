import React, { useContext, useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { UserContext } from '../context/userContext';
import { auth, db } from '../firebase/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import {
  FaUsers, FaBoxOpen, FaChartBar, FaClipboardList,
  FaPlusSquare, FaCloudSun, FaRobot, FaEnvelope, FaSignOutAlt
} from 'react-icons/fa';

const Sidebar = () => {
  const { isLogged } = useContext(UserContext);
  const [role, setRole] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userRef = doc(db, 'Users', user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setRole(userSnap.data().role || '');
        }
      }
    });
    return () => unsubscribe();
  }, []);

  const renderAdminLinks = () => (
    <>
      <NavLink to="#" className="sidebar-link"><FaUsers /> Users</NavLink>
      <NavLink to="#" className="sidebar-link"><FaBoxOpen /> Products</NavLink>
      <NavLink to="#" className="sidebar-link"><FaChartBar /> Reports</NavLink>
      <NavLink to="#" className="sidebar-link"><FaClipboardList /> Orders</NavLink>
      {/* <button onClick={logout} className="sidebar-link"><FaSignOutAlt /> Logout</button> */}
    </>
  );

  const renderFarmerLinks = () => (
    <>
      <NavLink to="#" className="sidebar-link"><FaBoxOpen /> My Products</NavLink>
      <NavLink to="#" className="sidebar-link"><FaPlusSquare /> Add Product</NavLink>
      <NavLink to="#" className="sidebar-link"><FaClipboardList /> Orders</NavLink>
      <NavLink to="#" className="sidebar-link"><FaCloudSun /> Weather</NavLink>
      <NavLink to="#" className="sidebar-link"><FaRobot /> AI</NavLink>
      <NavLink to="#" className="sidebar-link"><FaEnvelope /> Messages</NavLink>
      {/* <button onClick={logout} className="sidebar-link"><FaSignOutAlt /> Logout</button> */}
    </>
  );

  if (!isLogged || !role) return null;

  return (
    <div className="sidebar bg-green-700 text-white h-screen w-64 fixed top-0 left-0 flex flex-col p-4 space-y-4">
      <h2 className="text-2xl font-bold mb-6">Dashboard</h2>
      {role.toLowerCase() === 'admin' ? renderAdminLinks() : renderFarmerLinks()}
    </div>
  );
};

export default Sidebar;
