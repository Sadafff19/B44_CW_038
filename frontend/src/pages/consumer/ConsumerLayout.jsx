import React from 'react';
import { Outlet }   from 'react-router-dom';
import TopNav       from '../../components/TopNav';

/**
 * Wraps all consumer pages with the shared top navigation.
 * Uses <Outlet/> to render the routed child page underneath.
 */
export default function ConsumerLayout() {
  return (
    <>
      <TopNav />            {/* our universal nav bar */}
      <main className="min-h-[calc(100vh-4rem)] bg-gray-50">
        <Outlet />
      </main>
    </>
  );
}