/* ──────────────────────────────────────────────────────────────
   admin / Products.jsx
   Global catalogue moderation panel for administrators
   ─────────────────────────────────────────────────────────── */
   import React, { useEffect, useState, useCallback } from 'react';
   import axios from 'axios';
   import {
     FiLoader, FiRefreshCw, FiSearch, FiStar, FiTrash2,
     FiChevronLeft, FiChevronRight, FiSlash
   } from 'react-icons/fi';
   
   /* reusable helpers ------------------------------------------------- */
   const Spinner = () => (
     <div className="flex justify-center items-center h-48">
       <FiLoader className="animate-spin text-4xl text-primary-500" />
     </div>
   );
   const ErrorBanner = ({ msg, retry }) => (
     <div className="bg-red-100 text-red-700 px-4 py-3 rounded flex items-center gap-3">
       {msg}
       {retry && (
         <button className="ml-auto underline" onClick={retry}>
           Retry
         </button>
       )}
     </div>
   );
   
   /* pagination control ------------------------------------------------ */
   const Pager = ({ page, pages, onPage }) => (
     <div className="flex items-center gap-2 text-sm text-gray-600">
       <button
         onClick={() => onPage(page - 1)}
         disabled={page === 1}
         className="p-1 disabled:opacity-30"
         title="Previous"
       >
         <FiChevronLeft />
       </button>
       <span>
         Page <strong>{page}</strong> / {pages}
       </span>
       <button
         onClick={() => onPage(page + 1)}
         disabled={page === pages}
         className="p-1 disabled:opacity-30"
         title="Next"
       >
         <FiChevronRight />
       </button>
     </div>
   );
   
   /* main component ---------------------------------------------------- */
   export default function AdminProducts() {
     /* ------- state ------- */
     const [rows, setRows] = useState([]);     // product list
     const [page, setPage] = useState(() => +sessionStorage.getItem('adm_prod_page') || 1);
     const [limit, setLimit] = useState(() => +sessionStorage.getItem('adm_prod_lim') || 10);
     const [total, setTotal] = useState(0);    // total count
     const [query, setQuery] = useState('');   // search box
     const [filter, setFilter] = useState('all'); // 'all' | 'featured' | 'oos'
     const [busy, setBusy] = useState(false);
     const [error, setError] = useState('');
   
     const pages = Math.max(1, Math.ceil(total / limit));
   
     /* ------- data fetch ------- */
     const load = useCallback(async () => {
       try {
         setBusy(true);
         setError('');
         const token = localStorage.getItem('token');
         const { data } = await axios.get('http://localhost:4000/api/admin/products', {
           headers: { Authorization: `Bearer ${token}` },
           params: { page, limit, q: query.trim(), filter },
         });
         setRows(data.items);
         setTotal(data.total);
       } catch (e) {
         console.error('[AdminProducts]', e);
         setError(e.response?.data?.error || e.message || 'Failed to load products');
       } finally {
         setBusy(false);
       }
     }, [page, limit, query, filter]);
   
     /* keep page/limit in sessionStorage so reload keeps position */
     useEffect(() => {
       sessionStorage.setItem('adm_prod_page', page);
       sessionStorage.setItem('adm_prod_lim', limit);
     }, [page, limit]);
   
     /* initial + whenever deps change */
     useEffect(() => { load(); }, [load]);
   
     /* ------- handlers ------- */
     const toggleFeatured = async (id, val) => {
       try {
         const token = localStorage.getItem('token');
         await axios.patch(
           `http://localhost:4000/api/admin/products/${id}/featured`,
           { featured: !val },
           { headers: { Authorization: `Bearer ${token}` } }
         );
         setRows(r => r.map(p => p._id === id ? { ...p, featured: !val } : p));
       } catch (e) { alert('Update failed'); }
     };
   
     const toggleDisabled = async (id, val) => {
       try {
         const token = localStorage.getItem('token');
         await axios.patch(
           `http://localhost:4000/api/admin/products/${id}/disabled`,
           { disabled: !val },
           { headers: { Authorization: `Bearer ${token}` } }
         );
         setRows(r => r.map(p => p._id === id ? { ...p, disabled: !val } : p));
       } catch (e) { alert('Update failed'); }
     };
   
     const remove = async (id) => {
       if (!window.confirm('Delete this product permanently?')) return;
       try {
         const token = localStorage.getItem('token');
         await axios.delete(`http://localhost:4000/api/admin/products/${id}`, {
           headers: { Authorization: `Bearer ${token}` },
         });
         setRows(r => r.filter(p => p._id !== id));
         setTotal(t => t - 1);
       } catch (e) { alert('Delete failed'); }
     };
   
     /* ------- render ------- */
     return (
       <div className="space-y-6">
         {/* header row */}
         <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
           <h1 className="text-3xl font-bold text-gray-800">Products</h1>
   
           <div className="flex flex-wrap gap-3">
             {/* search */}
             <label className="relative">
               <FiSearch className="absolute left-3 top-2.5 text-gray-400" />
               <input
                 value={query}
                 onChange={e => { setQuery(e.target.value); setPage(1); }}
                 placeholder="Search by name…"
                 className="pl-9 pr-3 py-2 border rounded-md focus:ring-primary-500 focus:outline-none"
               />
             </label>
   
             {/* filter */}
             <select
               value={filter}
               onChange={e => { setFilter(e.target.value); setPage(1); }}
               className="border rounded-md px-3 py-2"
             >
               <option value="all">All</option>
               <option value="featured">Featured</option>
               <option value="oos">Out of stock</option>
             </select>
   
             {/* page size */}
             <select
               value={limit}
               onChange={e => { setLimit(+e.target.value); setPage(1); }}
               className="border rounded-md px-3 py-2"
             >
               {[10, 20, 50].map(n => <option key={n}>{n}</option>)}
             </select>
   
             {/* refresh */}
             <button
               onClick={load}
               className="text-gray-600 hover:text-gray-800 p-2 border rounded-md"
               title="Refresh"
             >
               <FiRefreshCw />
             </button>
           </div>
         </div>
   
         {/* content */}
         {busy && !rows.length && <Spinner />}
         {error && <ErrorBanner msg={error} retry={load} />}
         {!busy && !error && rows.length === 0 && (
           <p className="text-center text-gray-500 py-20">No products found.</p>
         )}
   
         {!error && rows.length > 0 && (
           <>
             <div className="overflow-x-auto bg-white shadow rounded-lg">
               <table className="min-w-full text-sm">
                 <thead className="bg-gray-50 text-gray-600">
                   <tr>
                     <th className="p-3 text-left">Name</th>
                     <th className="p-3">Price</th>
                     <th className="p-3">Stock</th>
                     <th className="p-3">Featured</th>
                     <th className="p-3">Status</th>
                     <th className="p-3">Actions</th>
                   </tr>
                 </thead>
                 <tbody>
                   {rows.map(p => (
                     <tr key={p._id} className="border-t">
                       <td className="p-3">
                         <div className="flex items-center gap-3">
                           {p.imageUrl && (
                             <img src={p.imageUrl} alt={p.name}
                                  className="w-10 h-10 object-cover rounded" />
                           )}
                           <span className="font-medium text-gray-800">{p.name}</span>
                         </div>
                       </td>
                       <td className="text-center">₹{p.price.toFixed(2)}</td>
                       <td className="text-center">{p.stock}</td>
                       <td className="text-center">
                         <button
                           onClick={() => toggleFeatured(p._id, p.featured)}
                           className={`p-1 rounded-full ${
                             p.featured ? 'text-yellow-500' : 'text-gray-400 hover:text-gray-600'
                           }`}
                           title="Toggle featured"
                         >
                           <FiStar />
                         </button>
                       </td>
                       <td className="text-center">
                         {p.disabled ? (
                           <span className="px-2 py-0.5 text-xs rounded bg-red-100 text-red-700">
                             Disabled
                           </span>
                         ) : (
                           <span className="px-2 py-0.5 text-xs rounded bg-green-100 text-green-700">
                             Live
                           </span>
                         )}
                       </td>
                       <td className="text-center">
                         <div className="flex justify-center gap-3">
                           <button
                             onClick={() => toggleDisabled(p._id, p.disabled)}
                             className="p-1 text-gray-500 hover:text-gray-700"
                             title={p.disabled ? 'Enable' : 'Disable'}
                           >
                             <FiSlash />
                           </button>
                           <button
                             onClick={() => remove(p._id)}
                             className="p-1 text-red-600 hover:text-red-800"
                             title="Delete"
                           >
                             <FiTrash2 />
                           </button>
                         </div>
                       </td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>
   
             {/* pager */}
             <div className="flex justify-between items-center mt-4">
               <span className="text-sm text-gray-600">
                 Showing {(page - 1) * limit + 1}-{Math.min(page * limit, total)} of {total}
               </span>
               <Pager page={page} pages={pages} onPage={p => setPage(p)} />
             </div>
           </>
         )}
       </div>
     );
   }