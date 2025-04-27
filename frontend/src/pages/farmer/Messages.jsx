import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import {
  FiMessageSquare,
  FiUser,
  FiLoader,
  FiSend,
  FiArrowLeft,
  FiAlertCircle,
  FiRefreshCw
} from 'react-icons/fi'
import { useAuth } from '../../contexts/AuthContext'

/* ------------------------------------------------------------------ */
/* Helpers                                                            */
/* ------------------------------------------------------------------ */
const time = (iso) =>
  new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

const bubbleCls = (mine) =>
  `max-w-md px-4 py-2 rounded-lg whitespace-pre-wrap shadow ${
    mine
      ? 'self-end bg-primary-600 text-white rounded-br-none'
      : 'self-start bg-gray-100 text-gray-800 rounded-bl-none'
  }`

/* ------------------------------------------------------------------ */
/* Component                                                          */
/* ------------------------------------------------------------------ */
export default function Messages () {
  const { user, loading: authLoading } = useAuth()
  const navigate                        = useNavigate()

  /* state ---------------------------------------------------------- */
  const [inbox, setInbox]           = useState([])          // list of convs
  const [active, setActive]         = useState(null)        // { user, … }
  const [msgs,  setMsgs]            = useState([])
  const [text,  setText]            = useState('')
  const [busy,  setBusy]            = useState(false)
  const [err,   setErr]             = useState('')
  const [msgsBusy, setMsgsBusy]     = useState(false)
  const endRef                      = useRef(null)

  const token = localStorage.getItem('token')

  /* redirect if unauth --------------------------------------------- */
  useEffect(() => { if (!authLoading && !user) navigate('/login') }, [authLoading])

  /* fetch inbox ---------------------------------------------------- */
  const loadInbox = useCallback(async () => {
    try {
      setBusy(true); setErr('')
      const { data } = await axios.get('http://localhost:4000/api/chat', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setInbox(data)
    } catch (e) {
      setErr(e.response?.data?.error || e.message)
    } finally { setBusy(false) }
  }, [token])

  /* fetch thread --------------------------------------------------- */
  const loadThread = useCallback(async (partnerId) => {
    try {
      setMsgsBusy(true); setErr('')
      const { data } = await axios.get(`http://localhost:4000/api/chat/${partnerId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setMsgs(data)
    } catch (e) {
      setErr(e.response?.data?.error || e.message)
    } finally { setMsgsBusy(false) }
  }, [token])

  /* initial inbox load -------------------------------------------- */
  useEffect(() => { if (!authLoading) loadInbox() }, [authLoading])

  /* scroll to bottom on new msgs ---------------------------------- */
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [msgs])

  /* send ----------------------------------------------------------- */
  const send = async () => {
    if (!text.trim() || !active) return
    const draft = {
      _id:    Date.now().toString(),        // temp id
      senderId: user._id,
      text:   text.trim(),
      createdAt: new Date().toISOString()
    }
    setMsgs((m) => [...m, draft])
    setText('')

    try {
      const { data } = await axios.post(
        `http://localhost:4000/api/chat/${active.user._id}`,
        { text: draft.text },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      // replace temp bubble with server copy
      setMsgs((m) => m.map((b) => (b._id === draft._id ? data.data : b)))
      // refresh inbox preview
      loadInbox()
    } catch (e) {
      setErr('Message not sent – please try again.')
      // remove optimistic bubble
      setMsgs((m) => m.filter((b) => b._id !== draft._id))
    }
  }

  /* keyboard submit */
  const enterKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() }
  }

  /* render --------------------------------------------------------- */
  if (busy || authLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <FiLoader className="animate-spin text-4xl text-primary-500" />
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* ─── Inbox list ──────────────────────────────────────────── */}
      <aside className="w-full sm:w-1/3 lg:w-1/4 bg-white border-r overflow-y-auto">
        <h2 className="p-4 text-lg font-semibold flex items-center gap-2 border-b">
          <FiMessageSquare /> Conversations
        </h2>
        {inbox.length === 0 && (
          <p className="p-4 text-gray-500">No conversations yet.</p>
        )}
        {inbox.map((c) => (
          <button
            key={c.user._id}
            onClick={() => { setActive(c); loadThread(c.user._id) }}
            className={`w-full text-left px-4 py-3 flex items-center gap-3 border-b hover:bg-gray-100 transition-colors ${
              active?.user._id === c.user._id ? 'bg-primary-50' : ''
            }`}
          >
            <FiUser className="text-xl text-gray-600" />
            <div className="flex-1">
              <p className="font-medium text-gray-800">{c.user.name}</p>
              <p className="text-sm text-gray-500 truncate">
                {c.lastMessage || 'No messages yet.'}
              </p>
            </div>
            <span className="text-xs text-gray-400">{time(c.updatedAt)}</span>
          </button>
        ))}
      </aside>

      {/* ─── Chat window ─────────────────────────────────────────── */}
      <section className="flex-1 flex flex-col">
        {active ? (
          <>
            {/* header */}
            <header className="flex items-center px-4 py-3 border-b bg-white">
              <button
                onClick={() => setActive(null)}
                className="mr-4 text-gray-600 hover:text-gray-800 sm:hidden"
              >
                <FiArrowLeft />
              </button>
              <h3 className="text-lg font-medium text-gray-800">
                {active.user.name}
              </h3>
              <button
                onClick={() => loadThread(active.user._id)}
                className="ml-auto text-gray-600 hover:text-gray-800"
              >
                <FiRefreshCw />
              </button>
            </header>

            {/* thread */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-4 relative">
              {msgsBusy && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/70 z-10">
                  <FiLoader className="animate-spin text-2xl text-primary-500" />
                </div>
              )}
              {msgs.length === 0 && !msgsBusy && (
                <p className="text-center text-gray-500">
                  No messages yet. Say hello!
                </p>
              )}
              {msgs.map((m) => (
                <div key={m._id} className={bubbleCls(m.senderId === user._id)}>
                  <p>{m.text}</p>
                  <span className="text-xs text-gray-400 float-right">
                    {time(m.createdAt)}
                  </span>
                </div>
              ))}
              <div ref={endRef} />
            </div>

            {/* composer */}
            <footer className="flex items-center p-4 bg-white border-t">
              <textarea
                rows={1}
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={enterKey}
                placeholder="Type a message…"
                className="flex-1 border rounded px-3 py-2 resize-none focus:ring-primary-500 focus:outline-none"
              />
              <button
                onClick={send}
                disabled={!text.trim()}
                className="ml-2 bg-primary-600 text-white px-4 py-2 rounded flex items-center gap-2 disabled:opacity-50"
              >
                <FiSend /> Send
              </button>
            </footer>
          </>
        ) : (
          <div className="flex flex-1 items-center justify-center text-gray-500">
            Select a conversation on the left to start chatting.
          </div>
        )}
      </section>

      {/* global error banner */}
      {err && (
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-red-100 text-red-700 text-center flex items-center justify-center gap-2">
          <FiAlertCircle /> {err}
        </div>
      )}
    </div>
  )
}