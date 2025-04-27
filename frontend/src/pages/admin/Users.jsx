import React, { useEffect, useState, useMemo } from 'react';
import axios                     from 'axios';
import {
  FiUsers, FiSearch, FiChevronLeft, FiChevronRight, FiTrash2,
  FiEdit3, FiLoader, FiCheckCircle, FiXCircle
} from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';

/* reusable ---------------------------------------------------------------- */
const PER_PAGE_OPTIONS = [10, 20, 50];
const ROLES            = ['ALL', 'FARMER', 'CONSUMER', 'ADMIN'];

const Btn = ({ children, ...p }) =>
  <button
    {...p}
    className={'inline-flex items-center gap-1 px-3 py-1.5 rounded-md text-sm font-medium ' +
      (p.disabled
        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
        : 'bg-green-600 hover:bg-green-700 text-white transition')}
  >{children}</button>;

const IconBtn = ({ title, className='', ...p }) =>
  <button
    {...p}
    title={title}
    className={'p-2 rounded hover:bg-gray-100 text-gray-600 ' + className}
  />;

/* toast ------------------------------------------------------------------- */
const Toast = ({ type, msg }) => (
  <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-3 rounded-lg shadow-lg
                   flex items-center gap-2 text-sm
                   ${type==='error' ? 'bg-red-600'   : 'bg-green-600'}
                   text-white`}>
    {type==='error' ? <FiXCircle/> : <FiCheckCircle/>}{msg}
  </div>
);

/* main component ---------------------------------------------------------- */
export default function AdminUsers() {
  const { user }            = useAuth();              // guarantees admin
  const [busy, setBusy]     = useState(false);
  const [err , setErr]      = useState('');
  const [toast, setToast]   = useState(null);

  /* query state */
  const [q,     setQ]       = useState('');
  const [role,  setRole]    = useState('ALL');
  const [page,  setPage]    = useState(1);
  const [limit, setLimit]   = useState(PER_PAGE_OPTIONS[0]);

  /* results */
  const [total, setTotal]   = useState(0);
  const [items, setItems]   = useState([]);

  /* helper: debounced query-string */
  const query = useMemo(() => {
    const p = new URLSearchParams({
      page, limit,
      ...(role!=='ALL' && { role }),
      ...(q.trim() && { q: q.trim() })
    });
    return p.toString();
  }, [page, limit, role, q]);

  /* effect: fetch list */
  useEffect(() => {
    let alive = true;
    const load = async () => {
      try {
        setBusy(true); setErr('');
        const { data } = await axios.get(`http://localhost:4000/api/admin/users?${query}`);
        if (!alive) return;
        setItems(data.items ?? data);          // backward compat
        setTotal(data.total ?? data.length);
      } catch (e) {
        if (!alive) return;
        console.error(e);
        setErr(e.response?.data?.error || e.message);
      } finally { if (alive) setBusy(false); }
    };
    load();
    return () => { alive = false; };
  }, [query]);

  /* mutate: change role */
  const changeRole = async (id, newRole) => {
    const original = items.find(u => u._id===id)?.role;
    setItems(ls => ls.map(u => u._id===id ? ({...u, role:newRole}) : u));
    try {
      await axios.patch(`http://localhost:4000/api/admin/user/${id}`, { role:newRole });
      toastSuccess('Role updated');
    } catch (e) {
      setItems(ls => ls.map(u => u._id===id ? ({...u, role:original}) : u));
      toastError(e.response?.data?.error || 'Update failed');
    }
  };

  /* mutate: delete user */
  const deleteUser = async (id) => {
    if (!window.confirm('Delete this user permanently?')) return;
    try {
      await axios.delete(`http://localhost:4000/api/admin/user/${id}`);
      setItems(ls => ls.filter(u => u._id!==id));
      toastSuccess('User removed');
    } catch (e) { toastError(e.response?.data?.error || 'Delete failed'); }
  };

  /* toast helpers */
  const toastSuccess = m => { setToast({type:'success',msg:m}); setTimeout(()=>setToast(null),3000); };
  const toastError   = m => { setToast({type:'error'  ,msg:m}); setTimeout(()=>setToast(null),4000); };

  /* render ---------------------------------------------------------------- */
  const pages = Math.ceil(total/limit) || 1;

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <header className="flex items-center gap-2">
        <FiUsers className="text-3xl text-green-600"/> 
        <h1 className="text-3xl font-bold text-gray-800">Users</h1>
      </header>

      {/* toolbar */}
      <div className="flex flex-wrap items-center gap-4 bg-white shadow rounded-lg p-4">
        <label className="relative flex-1 max-w-xs">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
          <input
            value={q}
            onChange={e=>{ setQ(e.target.value); setPage(1); }}
            placeholder="Search name / email…"
            className="pl-9 pr-3 py-2 w-full border rounded-md focus:ring-2 focus:ring-green-500"
          />
        </label>

        <select
          value={role} onChange={e=>{setRole(e.target.value); setPage(1);} }
          className="border rounded-md px-3 py-2 focus:ring-2 focus:ring-green-500"
        >
          {ROLES.map(r=><option key={r}>{r}</option>)}
        </select>

        <select
          value={limit} onChange={e=>{setLimit(+e.target.value); setPage(1);} }
          className="border rounded-md px-3 py-2 focus:ring-2 focus:ring-green-500"
        >
          {PER_PAGE_OPTIONS.map(o=><option key={o} value={o}>{o} / page</option>)}
        </select>
      </div>

      {/* table */}
      <div className="bg-white shadow rounded-lg overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-left">
            <tr className="[&>th]:px-4 [&>th]:py-3 [&>th]:font-semibold [&>th]:text-gray-600">
              <th>Name</th><th>Email</th><th>Role</th><th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="[&>tr]:border-b">
            {busy && (
              <tr><td colSpan={4} className="text-center p-6">
                <FiLoader className="animate-spin inline text-green-600 text-xl"/>
              </td></tr>
            )}

            {!busy && items.length===0 && (
              <tr><td colSpan={4} className="text-center p-6 text-gray-500">No users found.</td></tr>
            )}

            {items.map(u=>(
              <tr key={u._id} className="[&>td]:px-4 [&>td]:py-3">
                <td className="whitespace-nowrap">{u.name}</td>
                <td className="text-gray-600">{u.email}</td>
                <td>
                  <select
                    value={u.role}
                    onChange={e=>changeRole(u._id,e.target.value)}
                    className="border rounded-md px-2 py-1 text-xs"
                  >
                    {['CONSUMER','FARMER','ADMIN'].map(r=>
                      <option key={r}>{r}</option>
                    )}
                  </select>
                </td>
                <td className="text-center">
                  {u._id!==user._id && (
                    <IconBtn title="Delete user" onClick={()=>deleteUser(u._id)}>
                      <FiTrash2 className="text-red-600"/>
                    </IconBtn>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* pagination */}
      {pages>1 && (
        <div className="flex items-center justify-center gap-4 mt-4">
          <IconBtn
            title="Prev"
            onClick={()=>setPage(p=>Math.max(1,p-1))}
            disabled={page===1}
            className={page===1?'opacity-20 pointer-events-none':''}
          ><FiChevronLeft/></IconBtn>

          <span className="text-sm text-gray-600">{page} / {pages}</span>

          <IconBtn
            title="Next"
            onClick={()=>setPage(p=>Math.min(pages,p+1))}
            disabled={page===pages}
            className={page===pages?'opacity-20 pointer-events-none':''}
          ><FiChevronRight/></IconBtn>
        </div>
      )}

      {/* error */}
      {err && (
        <div className="flex items-center gap-2 text-red-600 mt-4">
          <FiAlertCircle/>{err}
        </div>
      )}

      {toast && <Toast {...toast}/>}
    </div>
  );
}