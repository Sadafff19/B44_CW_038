// ──────────────────────────────────────────────────────────
// src/contexts/AuthContext.jsx
// ──────────────────────────────────────────────────────────
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import {
  onAuthStateChanged,
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
} from 'firebase/auth';
import { initializeApp } from 'firebase/app';

/* ╭────────────────────────────────────────────────────────╮
   │ 1.  Axios interceptor — silent-refresh on 401          │
   ╰────────────────────────────────────────────────────────╯ */
const API_BASE = 'http://localhost:4000/api/';

let isRefreshing = false;         // ensure single refresh attempt
let queue        = [];            // hold requests while refreshing

axios.interceptors.response.use(
  (res) => res,
  async (err) => {
    const cfg      = err.config;
    const ownAPI   = cfg?.url?.startsWith(API_BASE);
    const unauth   = err.response?.status === 401;

    if (!ownAPI || !unauth) return Promise.reject(err);

    /* If a refresh is already running, queue the request ------------- */
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        queue.push({ resolve, reject });
      })
        .then((token) => {
          cfg.headers.Authorization = `Bearer ${token}`;
          return axios(cfg);
        })
        .catch(Promise.reject);
    }

    /* First 401 • try a single forced-refresh ------------------------ */
    isRefreshing = true;
    const auth = getAuth();

    try {
      const fresh = await auth.currentUser?.getIdToken(true); // ☆ force refresh
      localStorage.setItem('token', fresh);

      /* replay the queued requests */
      queue.forEach(p => p.resolve(fresh));
      queue = [];

      /* retry the original */
      cfg.headers.Authorization = `Bearer ${fresh}`;
      return axios(cfg);
    } catch (e) {
      /* refresh failed  → sign-out + redirect ------------------------ */
      localStorage.removeItem('token');
      await auth.signOut().catch(() => {});
      queue.forEach(p => p.reject(e));
      queue = [];
      window.location.replace('/login');
      return Promise.reject(e);
    } finally {
      isRefreshing = false;
    }
  }
);

/* ╭─────────────────────────────────────────╮
   │ 2.  Firebase initialisation             │
   ╰─────────────────────────────────────────╯ */
const firebaseConfig = {
  apiKey:             import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain:         import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId:          import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket:      import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId:  import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId:              import.meta.env.VITE_FIREBASE_APP_ID,
};

const firebaseApp    = initializeApp(firebaseConfig);
const firebaseAuth   = getAuth(firebaseApp);
const googleProvider = new GoogleAuthProvider();

/* ╭─────────────────────────────────────────╮
   │ 3.  Context skeleton                    │
   ╰─────────────────────────────────────────╯ */
const AuthContext = createContext({
  user:         null,
  loading:      true,
  loginWithGoogle: async () => {},
  logout:          async () => {},
  refreshUser:     async () => {},
});

/* ╭─────────────────────────────────────────╮
   │ 4.  Provider                            │
   ╰─────────────────────────────────────────╯ */
export const AuthProvider = ({ children }) => {
  const [user,    setUser]    = useState(null);
  const [loading, setLoading] = useState(true);

  /* ── helper: fetch profile from backend ─────────────────────────── */
  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) { setUser(null); return; }

      const { data } = await axios.get(`${API_BASE}users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(data);
    } catch (err) {
      console.error('[Auth] profile fetch error', err);
      setUser(null);   // triggers interceptor next call
    }
  };

  const refreshUser = () => fetchProfile();

  /* ── Firebase auth listener ─────────────────────────────────────── */
  useEffect(() => {
    const unsub = onAuthStateChanged(firebaseAuth, async (fbUser) => {
      if (fbUser) {
        const idToken = await fbUser.getIdToken();
        localStorage.setItem('token', idToken);
        await fetchProfile();
      } else {
        localStorage.removeItem('token');
        setUser(null);
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  /* ── Google sign-in ─────────────────────────────────────────────── */
  const loginWithGoogle = async () => {
    setLoading(true);
    try {
      const { user: fbUser } = await signInWithPopup(firebaseAuth, googleProvider);
      const idToken = await fbUser.getIdToken();
      localStorage.setItem('token', idToken);
      await fetchProfile();
    } finally {
      setLoading(false);
    }
  };

  /* ── Logout ─────────────────────────────────────────────────────── */
  const logout = async () => {
    await signOut(firebaseAuth).catch(() => {});
    localStorage.removeItem('token');
    setUser(null);
    window.location.replace('/login');
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, loginWithGoogle, logout, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

/* ╭─────────────────────────────────────────╮
   │ 5.  Hook                                │
   ╰─────────────────────────────────────────╯ */
export const useAuth = () => useContext(AuthContext);