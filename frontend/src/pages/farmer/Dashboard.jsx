/* ─────────────────────────────────────────────────────────────
   Farmer Dashboard – full component
   (remove every manual token check; rely on the Axios interceptor)
   ───────────────────────────────────────────────────────────── */
   import React, { useEffect, useState, memo } from 'react';
   import { Link }            from 'react-router-dom';
   import axios               from 'axios';
   import {
     FiBox, FiClipboard, FiTrendingUp, FiLoader, FiPlus,
     FiCloud, FiZap, FiMessageSquare, FiUser,
   } from 'react-icons/fi';
   import { useAuth }         from '../../contexts/AuthContext';
   
   /* Memo-ise static icons so they don’t trigger re-renders */
   const I            = memo(({ Icon, classes }) => <Icon className={classes} />);
   const primaryIcon  = 'text-4xl text-primary-500';
   const secondaryIcon= 'text-4xl text-secondary-500';
   
   /* ─────────────────────────────────────────────────────────── */
   export default function Dashboard () {
     const { user } = useAuth();
   
     const [stats, setStats]   = useState({ totalProducts:0,totalOrders:0,totalEarnings:0 });
     const [loading, setLoad]  = useState(true);
     const [error,  setError]  = useState(null);
   
     /* fetch counts / earnings */
     useEffect(() => {
       (async () => {
         try {
           setLoad(true);
           setError(null);
   
           const [{ data:products }, { data:orders }] = await Promise.all([
             axios.get(`http://localhost:4000/api/products?farmerId=${user._id}`),
             axios.get( 'http://localhost:4000/api/orders/farmer'),
           ]);
   
           const earnings = (Array.isArray(orders) ? orders : []).reduce(
             (sum,o)=>sum+(o.items||[]).reduce((s,i)=>s+(i.price||0)*(i.qty||0),0),0);
   
           setStats({
             totalProducts : (products||[]).length,
             totalOrders   : (orders  ||[]).length,
             totalEarnings : earnings,
           });
         } catch (e) {
           console.error('[Dashboard]', e);
           setError(e.response?.data?.error || e.message || 'Failed to load dashboard data.');
         } finally { setLoad(false); }
       })();
     }, [user._id]);
   
     /* ── loading / error states ─────────────────────────────── */
     if (loading)
       return <div className="min-h-screen flex items-center justify-center">
                <FiLoader className="animate-spin text-5xl text-primary-500" />
              </div>;
   
     if (error)
       return <div className="min-h-screen flex items-center justify-center p-4">
                <p className="text-red-600 text-center">{error}</p>
              </div>;
   
     /* ── main ui ─────────────────────────────────────────────── */
     return (
       <div className="max-w-7xl mx-auto p-6 space-y-8">
         <h1 className="text-3xl font-extrabold text-gray-800 flex items-center gap-2">
           <span role="img" aria-label="farmer">👨‍🌾</span> Farmer Dashboard
         </h1>
   
         {/* Overview cards */}
         <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
           {[
             {
               icon : <I Icon={FiBox}        classes={primaryIcon} />,
               label: 'Products',
               value: stats.totalProducts,
               link : '/farmer/products',
               cta  : 'Manage',
             },
             {
               icon : <I Icon={FiClipboard}  classes={secondaryIcon} />,
               label: 'Orders Received',
               value: stats.totalOrders,
               link : '/farmer/orders',
               cta  : 'View',
             },
             {
               icon : <I Icon={FiTrendingUp} classes="text-4xl text-yellow-500" />,
               label: 'Total Earnings',
               value: `₹ ${stats.totalEarnings.toLocaleString('en-IN',{minimumFractionDigits:2})}`,
               link : '/farmer/orders',
               cta  : 'Track',
             },
           ].map(({ icon,label,value,link,cta })=>(
             <Link key={label} to={link}
                   className="card p-6 flex flex-col justify-between hover:bg-primary-50 transition">
               <div className="flex items-center gap-4">
                 {icon}
                 <div>
                   <p className="text-2xl font-semibold text-gray-800">{value}</p>
                   <p className="text-gray-500">{label}</p>
                 </div>
               </div>
               <span className="inline-flex items-center text-sm font-medium text-primary-600">
                 {cta} <FiPlus className="ml-1" />
               </span>
             </Link>
           ))}
         </div>
   
         {/* Quick actions */}
         <h2 className="text-xl font-semibold text-gray-700">Quick Actions</h2>
         <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
           {[
             { icon:<FiPlus          className="text-3xl text-green-500"   />, label:'Add Product',  to:'/farmer/add-product' },
             { icon:<FiZap           className="text-3xl text-indigo-500"  />, label:'Crop Advisor', to:'/farmer/ai'         },
             { icon:<FiCloud         className="text-3xl text-blue-500"    />, label:'Weather',      to:'/farmer/weather'    },
             { icon:<FiMessageSquare className="text-3xl text-purple-500"  />, label:'Messages',     to:'/farmer/messages'   },
             { icon:<FiUser          className="text-3xl text-gray-700"    />, label:'Profile',      to:'/farmer/profile'    },
           ].map(({icon,label,to})=>(
             <Link key={label} to={to}
                   className="card p-4 flex flex-col items-center justify-center hover:bg-primary-50 transition">
               {icon}
               <span className="mt-2 text-sm font-medium text-gray-800 text-center">{label}</span>
             </Link>
           ))}
         </div>
       </div>
     );
   }