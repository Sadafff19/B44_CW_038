/* ─────────────────────────────────────────────────────────────
   Farmer layout (sidebar + outlet)
   • Logout calls the central AuthContext.logout()
   • No direct touches to localStorage here
   ───────────────────────────────────────────────────────────── */

   import React, { useState, useEffect } from 'react';
   import {
     NavLink, Outlet, useNavigate, useLocation,
   } from 'react-router-dom';
   import {
     FiGrid, FiBox, FiPlusCircle, FiClipboard,
     FiCloud, FiZap, FiMessageSquare, FiUser,
     FiLogOut, FiMenu, FiX, FiLoader,
   } from 'react-icons/fi';
   import { useAuth } from '../../contexts/AuthContext';
   
   /* navigation items */
   const NAV = [
     { label:'Dashboard',  to:'/farmer/dashboard',   icon:FiGrid },
     { label:'Products',   to:'/farmer/products',    icon:FiBox },
     { label:'Add Product',to:'/farmer/add-product', icon:FiPlusCircle },
     { label:'Orders',     to:'/farmer/orders',      icon:FiClipboard },
     { label:'Weather',    to:'/farmer/weather',     icon:FiCloud },
     { label:'Crop Advisor',to:'/farmer/ai',         icon:FiZap },
     { label:'Messages',   to:'/farmer/messages',    icon:FiMessageSquare },
     { label:'Profile',    to:'/farmer/profile',     icon:FiUser },
   ];
   
   /* ———————————————————————————————————————————————— */
   export default function FarmerLayout () {
     const { user, loading, logout } = useAuth();
     const [mobileOpen, setMobile]   = useState(false);
     const [loggingOut, setLO]       = useState(false);
     const nav     = useNavigate();
     const locate  = useLocation();
   
     /* redirect guests */
     useEffect(() => { if (!loading && !user) nav('/login'); }, [user,loading,nav]);
   
     /* close drawer on route change */
     useEffect(() => setMobile(false), [locate.pathname]);
   
     /* logout wrapper */
     const handleLogout = async () => {
       try   { setLO(true); await logout(); }
       finally { setLO(false); }           // logout() already pushes /login
     };
   
     /* small loader while sign-out finishes */
     if (loggingOut)
       return <div className="h-screen flex items-center justify-center">
                <FiLoader className="animate-spin text-4xl text-primary-500" />
              </div>;
   
     if (loading)
       return <div className="h-screen flex items-center justify-center">
                <FiLoader className="animate-spin text-4xl text-gray-500" />
              </div>;
   
     /* — UI — */
     const LinkItem = ({ label,to,icon:Icon }) => (
       <NavLink
         to={to}
         className={({isActive})=>
           `flex items-center px-3 py-2 rounded-md transition-colors ${
             isActive ? 'bg-green-100 text-green-700' : 'text-gray-700 hover:bg-gray-100'}`
         }>
         <Icon className="text-lg mr-3" /> <span className="font-medium">{label}</span>
       </NavLink>
     );
   
     return (
       <div className="flex min-h-screen bg-gray-50">
         {/* — Desktop sidebar — */}
         <aside className="hidden md:flex md:flex-col md:w-64 bg-white shadow-lg">
           <div className="h-16 flex items-center justify-center font-extrabold text-xl text-green-600">
             FarmToKitchen
           </div>
           <nav className="flex-1 px-4 py-6 space-y-2">
             {NAV.map((n)=><LinkItem key={n.to} {...n} />)}
           </nav>
           <button
             onClick={handleLogout}
             className="flex items-center justify-center mx-4 mb-4 h-12 rounded-md
                        bg-red-600 text-white hover:bg-red-700 transition">
             <FiLogOut className="mr-2"/> Logout
           </button>
         </aside>
   
         {/* — Mobile top-bar — */}
         <header className="md:hidden flex items-center justify-between h-16 px-4 bg-white shadow">
           <span className="font-extrabold text-xl text-green-600">FarmToKitchen</span>
           <button onClick={()=>setMobile(!mobileOpen)}>
             {mobileOpen ? <FiX size={24}/> : <FiMenu size={24}/>}
           </button>
         </header>
   
         {/* — Mobile drawer — */}
         {mobileOpen && (
           <aside className="md:hidden fixed inset-0 z-10 bg-black/50">
             <div className="w-64 h-full bg-white shadow-lg p-4 space-y-4">
               {NAV.map((n)=><LinkItem key={n.to} {...n} />)}
               <button
                 onClick={handleLogout}
                 className="w-full flex items-center justify-center h-10 mt-6 rounded-md
                            bg-red-600 text-white hover:bg-red-700 transition">
                 <FiLogOut className="mr-2"/> Logout
               </button>
             </div>
           </aside>
         )}
   
         {/* — Main outlet — */}
         <main className="flex-1 overflow-auto p-4 md:p-6">
           <Outlet/>
         </main>
       </div>
     );
   }