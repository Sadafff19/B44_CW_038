import React, { useContext } from 'react';
import Sidebar from './sidebar';
import { UserContext } from '../context/userContext';

const DashboardLayout = ({ children }) => {
  const { role } = useContext(UserContext);

  if (role?.toLowerCase() !== 'admin' && role?.toLowerCase() !== 'farmer') {
    return children;
  }
  

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-4">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
