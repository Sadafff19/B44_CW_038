/* src/pages/Profile.jsx */
import React, { useState, useEffect } from 'react';
import { useNavigate }            from 'react-router-dom';
import axios                       from 'axios';
import {
  FiUser, FiMail, FiMapPin, FiSave, FiEdit2,
  FiLoader, FiCheckCircle, FiAlertTriangle
} from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';

/* ─── toast helper ─────────────────────────────────────────── */
const Toast = ({ kind, msg }) => (
  <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2
                   px-4 py-3 rounded-lg shadow-lg text-sm
      ${kind === 'ok' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>
    {kind === 'ok' ? <FiCheckCircle /> : <FiAlertTriangle />}
    <span>{msg}</span>
  </div>
);

/* ─── component ────────────────────────────────────────────── */
export default function Profile() {
  const nav = useNavigate();
  const { user, loading: authBusy, refreshUser } = useAuth();

  /* state */
  const [form, setForm]   = useState({ name:'', address:'', lat:'', lng:'' });
  const [viewOnly, setRO] = useState(true);          // read-only flag
  const [busy, setBusy]   = useState(false);
  const [toast, setToast] = useState(null);

  /* initialise when user appears */
  useEffect(() => {
    if (!authBusy && !user) nav('/login');
    if (user) {
      setForm({
        name    : user.name    ?? '',
        address : user.address ?? '',
        lat     : user.location?.coordinates?.[1]?.toString() ?? '',
        lng     : user.location?.coordinates?.[0]?.toString() ?? '',
      });
    }
  }, [authBusy, user, nav]);

  /* helpers */
  const pop = (m,k='err') => { setToast({m,k}); setTimeout(()=>setToast(null),4e3); };
  const upd = e => setForm(f=>({...f,[e.target.name]:e.target.value}));
  const hasName = () => !!form.name.trim();

  const geolocate = () => {
    if (viewOnly) return;                    // blocked when not editing
    if (!navigator.geolocation) return pop('Geolocation unavailable');
    setBusy(true);
    navigator.geolocation.getCurrentPosition(
      ({coords})=>{
        setForm(f=>({...f,
          lat: coords.latitude.toFixed(6),
          lng: coords.longitude.toFixed(6)
        }));
        setBusy(false);
      },
      err=>{ pop(err.code===1 ? 'Location permission denied' : 'Location failed'); setBusy(false); },
      { timeout: 8000 }
    );
  };

  const save = async e => {
    e.preventDefault();
    if (!hasName()) return pop('Name is required');
    setBusy(true);
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        'http://localhost:4000/api/users/me',
        {
          name : form.name.trim(),
          address : form.address.trim(),
          ...(form.lat && form.lng && {
            coordinates:[parseFloat(form.lng), parseFloat(form.lat)],
          })
        },
        { headers:{Authorization:`Bearer ${token}`} }
      );
      await refreshUser?.();
      pop('Profile updated','ok');
      setRO(true);               // return to view mode
    } catch(err) {
      pop(err.response?.data?.error || err.message);
    } finally { setBusy(false); }
  };

  /* loader */
  if (authBusy)
    return <div className="h-screen flex items-center justify-center">
             <FiLoader className="text-primary-500 animate-spin text-4xl"/>
           </div>;

  /* ————————————————— render ————————————————— */
  return (
    <main className="flex justify-center py-10 px-4">
      <form onSubmit={save}
            className="w-full max-w-xl bg-white rounded-2xl shadow px-8 py-10 space-y-10">

        {/* avatar / heading ------------------------------------------------- */}
        <div className="flex flex-col items-center gap-3">
          {user?.avatar
            ? <img src={user.avatar} alt="avatar"
                   className="w-24 h-24 rounded-full object-cover shadow"/>
            : <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center
                              justify-center text-gray-400 text-3xl shadow">
                <FiUser/>
              </div>}
          <div className="flex items-center gap-2">
            <FiUser className="text-primary-500"/>
            <h1 className="text-2xl font-bold">My Profile</h1>
          </div>
          <p className="text-gray-500 flex items-center gap-1">
            <FiMail/>{user?.email ?? '—'}
          </p>
        </div>

        {/* edit toggle (view mode only) ------------------------------------ */}
        {viewOnly && (
          <button
            type="button"
            onClick={()=>setRO(false)}
            className="absolute top-6 right-8 flex items-center gap-1 text-primary-600 hover:underline"
          >
            <FiEdit2/> Edit
          </button>
        )}

        {/* input grid ------------------------------------------------------ */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* name */}
          <div className="md:col-span-2">
            <label className="lbl">Name&nbsp;<span className="text-red-500">*</span></label>
            <input
              name="name" required value={form.name} onChange={upd}
              readOnly={viewOnly} className="inp"
            />
          </div>

          {/* address */}
          <div className="md:col-span-2">
            <label className="lbl">Address</label>
            <textarea
              name="address" rows={3} value={form.address} onChange={upd}
              readOnly={viewOnly} className="inp resize-y"
            />
          </div>

          {/* lat / lng */}
          <div>
            <label className="lbl">Latitude</label>
            <input
              name="lat" type="number" step="0.000001"
              value={form.lat} onChange={upd}
              readOnly={viewOnly} className="inp"
            />
          </div>
          <div>
            <label className="lbl">Longitude</label>
            <input
              name="lng" type="number" step="0.000001"
              value={form.lng} onChange={upd}
              readOnly={viewOnly} className="inp"
            />
          </div>

          {/* geo button */}
          <button
            type="button" onClick={geolocate} disabled={busy || viewOnly}
            className="btn-sec md:col-span-2 flex items-center justify-center gap-2"
          >
            {busy ? <FiLoader className="animate-spin"/> : <FiMapPin/>}
            Use my location
          </button>
        </section>

        {/* save button (edit mode only) ------------------------------------ */}
        {!viewOnly && (
          <button
            disabled={busy}
            className="btn-pri w-full flex items-center justify-center gap-2 mt-4"
          >
            {busy ? <FiLoader className="animate-spin"/> : <FiSave/>}
            {busy ? 'Saving…' : 'Save profile'}
          </button>
        )}
      </form>

      {toast && <Toast kind={toast.k} msg={toast.m}/>}

      {/* tailwind atoms (keep in globals.css or @layer base)  -------------- */}
      {/*
      .lbl      {@apply block mb-1 text-sm font-medium text-gray-700;}
      .inp      {@apply w-full rounded-md border border-gray-300 px-3 py-2
                         focus:outline-none focus:ring-2 focus:ring-primary-500
                         disabled:bg-white disabled:text-gray-500;}
      .btn-pri  {@apply bg-primary-600 hover:bg-primary-700 text-white py-2 rounded-md
                         transition disabled:opacity-50;}
      .btn-sec  {@apply bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 rounded-md
                         transition disabled:opacity-50;}
      */}
    </main>
  );
}