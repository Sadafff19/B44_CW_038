/* ──────────────────────────────────────────────────────────────
   admin / Orders.jsx
   Global order-management console for Admins
   ─────────────────────────────────────────────────────────── */
   import React, { useCallback, useEffect, useState } from 'react';
   import axios from 'axios';
   import {
     FiLoader, FiRefreshCw, FiSearch, FiChevronLeft, FiChevronRight,
     FiEye, FiPackage, FiCheck, FiXCircle
   } from 'react-icons/fi';
   
   /* small helpers --------------------------------------------------- */
   const Spinner = () => (
     <div className="flex items-center justify-center h-48">
       <FiLoader className="animate-spin text-4xl text-primary-500" />
     </div>
   );
   const StatusPill = ({ s }) => {
     const map = {
       PENDING:  ['bg-yellow-100 text-yellow-800', 'Pending'],
       PAID:     ['bg-blue-100 text-blue-800',     'Paid'],
       SHIPPED:  ['bg-indigo-100 text-indigo-800', 'Shipped'],
       DELIVERED:['bg-green-100 text-green-800',   'Delivered'],
       CANCELLED:['bg-red-100 text-red-800',       'Cancelled'],
     }[s] || ['bg-gray-100 text-gray-800', s];
     return <span className={`px-2 py-0.5 rounded text-xs font-medium ${map[0]}`}>{map[1]}</span>;
   };
   const Pager = ({page,pages,setPage})=>(
     <div className="flex items-center gap-2 text-sm text-gray-600">
       <button disabled={page===1} onClick={()=>setPage(p=>p-1)} className="p-1 disabled:opacity-30">
         <FiChevronLeft/>
       </button>
       <span>Page <strong>{page}</strong> / {pages}</span>
       <button disabled={page===pages} onClick={()=>setPage(p=>p+1)} className="p-1 disabled:opacity-30">
         <FiChevronRight/>
       </button>
     </div>
   );
   
   /* main component -------------------------------------------------- */
   export default function AdminOrders() {
     /* state */
     const [rows,   setRows]   = useState([]);
     const [total,  setTotal]  = useState(0);
     const [page,   setPage]   = useState(()=>+sessionStorage.getItem('adm_ord_page')||1);
     const [limit,  setLimit]  = useState(()=>+sessionStorage.getItem('adm_ord_lim') || 10);
     const [query,  setQuery]  = useState('');
     const [status, setStatus] = useState('all'); // filter
     const [busy,   setBusy]   = useState(false);
     const [err,    setErr]    = useState('');
   
     const pages = Math.max(1, Math.ceil(total/limit));
   
     /* fetch */
     const load = useCallback(async()=>{
       try{
         setBusy(true); setErr('');
         const token = localStorage.getItem('token');
         const {data} = await axios.get('http://localhost:4000/api/admin/orders',{
           headers:{Authorization:`Bearer ${token}`},
           params :{page,limit,q:query.trim(),status}
         });
         setRows(data.items); setTotal(data.total);
       }catch(e){
         console.error('[AdminOrders]',e);
         setErr(e.response?.data?.error||e.message||'Failed to load orders');
       }finally{ setBusy(false); }
     },[page,limit,query,status]);
   
     useEffect(()=>{ load(); },[load]);
   
     /* persist paginator state between reloads */
     useEffect(()=>{
       sessionStorage.setItem('adm_ord_page',page);
       sessionStorage.setItem('adm_ord_lim',limit);
     },[page,limit]);
   
     /* status update */
     const updateStatus = async(id,next)=>{
       try{
         const token=localStorage.getItem('token');
         await axios.patch(`http://localhost:4000/api/admin/orders/${id}/status`,
           {status:next},
           {headers:{Authorization:`Bearer ${token}`}}
         );
         setRows(r=>r.map(o=>o._id===id?{...o,status:next}:o));
       }catch(e){ alert('Update failed');}
     };
   
     /* render */
     return(
       <div className="space-y-6">
         {/* header */}
         <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
           <h1 className="text-3xl font-bold text-gray-800">Orders</h1>
   
           <div className="flex flex-wrap gap-3">
             {/* search */}
             <label className="relative">
               <FiSearch className="absolute left-3 top-2.5 text-gray-400"/>
               <input
                 value={query}
                 onChange={e=>{setQuery(e.target.value); setPage(1);}}
                 placeholder="Search by consumer / order id…"
                 className="pl-9 pr-3 py-2 border rounded-md focus:ring-primary-500 focus:outline-none"
               />
             </label>
   
             {/* status filter */}
             <select
               value={status}
               onChange={e=>{setStatus(e.target.value); setPage(1);}}
               className="border rounded-md px-3 py-2"
             >
               <option value="all">All</option>
               {['PENDING','PAID','SHIPPED','DELIVERED','CANCELLED']
                 .map(s=><option key={s}>{s}</option>)}
             </select>
   
             {/* page size */}
             <select
               value={limit}
               onChange={e=>{setLimit(+e.target.value); setPage(1);}}
               className="border rounded-md px-3 py-2"
             >
               {[10,20,50].map(n=><option key={n}>{n}</option>)}
             </select>
   
             {/* refresh */}
             <button onClick={load}
                     className="p-2 border rounded-md text-gray-600 hover:text-gray-800"
                     title="Refresh">
               <FiRefreshCw/>
             </button>
           </div>
         </div>
   
         {/* content */}
         {busy && !rows.length && <Spinner/>}
         {err  && <div className="bg-red-100 text-red-700 px-4 py-3 rounded">{err}</div>}
         {!busy && !err && rows.length===0 && (
           <p className="text-center text-gray-500 py-20">No orders found.</p>
         )}
   
         {!err && rows.length>0 && (
           <>
             <div className="overflow-x-auto bg-white rounded-lg shadow">
               <table className="min-w-full text-sm">
                 <thead className="bg-gray-50 text-gray-600">
                   <tr>
                     <th className="p-3 text-left">Order</th>
                     <th className="p-3">Consumer</th>
                     <th className="p-3">Date</th>
                     <th className="p-3">Items</th>
                     <th className="p-3">Total</th>
                     <th className="p-3">Status</th>
                     <th className="p-3">Actions</th>
                   </tr>
                 </thead>
                 <tbody>
                   {rows.map(o=>(
                     <tr key={o._id} className="border-t">
                       <td className="p-3">{o._id.slice(-6).toUpperCase()}</td>
                       <td className="p-3 text-center">{o.consumer?.name||'—'}</td>
                       <td className="p-3 text-center">
                         {new Date(o.createdAt).toLocaleDateString()}
                       </td>
                       <td className="p-3 text-center">{o.items.length}</td>
                       <td className="p-3 text-center">₹{o.totalAmount.toFixed(2)}</td>
                       <td className="p-3 text-center"><StatusPill s={o.status}/></td>
                       <td className="p-3 text-center">
                         <div className="flex justify-center gap-3">
                           {/* quick view / drill-in could be added later */}
                           <button className="p-1 text-gray-500 hover:text-gray-700" title="View">
                             <FiEye/>
                           </button>
                           {o.status==='PAID' && (
                             <button
                               onClick={()=>updateStatus(o._id,'SHIPPED')}
                               className="p-1 text-indigo-600 hover:text-indigo-800"
                               title="Mark shipped"
                             >
                               <FiPackage/>
                             </button>
                           )}
                           {o.status==='SHIPPED' && (
                             <button
                               onClick={()=>updateStatus(o._id,'DELIVERED')}
                               className="p-1 text-green-600 hover:text-green-800"
                               title="Mark delivered"
                             >
                               <FiCheck/>
                             </button>
                           )}
                           {o.status!=='CANCELLED' && (
                             <button
                               onClick={()=>updateStatus(o._id,'CANCELLED')}
                               className="p-1 text-red-600 hover:text-red-800"
                               title="Cancel order"
                             >
                               <FiXCircle/>
                             </button>
                           )}
                         </div>
                       </td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>
   
             {/* footer pager */}
             <div className="flex justify-between items-center mt-4">
               <span className="text-sm text-gray-600">
                 Showing {(page-1)*limit+1}-{Math.min(page*limit,total)} of {total}
               </span>
               <Pager page={page} pages={pages} setPage={setPage}/>
             </div>
           </>
         )}
       </div>
     );
   }