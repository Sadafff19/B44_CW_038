import React, { useState, useEffect, useRef, memo, useCallback } from 'react'
import axios from 'axios'
import {
  FiZap, FiMapPin, FiDroplet, FiCalendar, FiTarget,
  FiLoader, FiAlertCircle, FiSend, FiRefreshCw, FiEdit3, FiX
} from 'react-icons/fi'
import { useAuth } from '../../contexts/AuthContext'

/* ─── field meta ─────────────────────────────────────────────── */
const FIELDS = [
  { name: 'soilType',       label: 'Soil Type *',       icon: FiDroplet, ph: 'Loamy, Sandy' },
  { name: 'location',       label: 'Location *',        icon: FiMapPin,  ph: 'State / District' },
  { name: 'season',         label: 'Season *',          icon: FiCalendar,ph: 'Rabi, Kharif' },
  { name: 'availableWater', label: 'Available Water *', icon: FiDroplet, ph: 'Low, Medium, High' },
  { name: 'cropGoal',       label: 'Crop Goal',         icon: FiTarget,  ph: 'High profit variety (optional)' }
]

/* ─── context form component (memoised) ──────────────────────── */
const ContextForm = memo(({ draft, setDraft, onSubmit, btn, err }) => (
  <form
    onSubmit={e => { e.preventDefault(); onSubmit() }}
    className="space-y-5 bg-white shadow rounded-xl p-6 w-full md:w-2/3 lg:w-1/2"
  >
    {FIELDS.map(({ name, label, icon: Icon, ph }) => (
      <div key={name}>
        <label className="block mb-1 text-sm font-medium flex items-center gap-1">
          <Icon /> {label}
        </label>
        <input
          value={draft[name]}
          onChange={e => setDraft(p => ({ ...p, [name]: e.target.value }))}
          placeholder={ph}
          className="w-full border rounded px-3 py-2 focus:ring-primary-500 focus:outline-none"
        />
      </div>
    ))}
    <button className="w-full bg-primary-600 text-white py-2 rounded hover:bg-primary-700">{btn}</button>
    {err && (
      <p className="flex items-center gap-2 text-red-600 text-sm mt-2">
        <FiAlertCircle /> {err}
      </p>
    )}
  </form>
))

/* ─── util: basic markdown → html (bold / italic / line-break) ─ */
const md = s =>
  s.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
   .replace(/\*(.+?)\*/g, '<em>$1</em>')
   .replace(/\n/g, '<br/>')

/* ─── main component ─────────────────────────────────────────── */
export default function CropAdvisor () {
  const { user } = useAuth()
  const chatRef       = useRef(null)
  const atBottomRef   = useRef(true)        // track user scroll

  /* state */
  const [context, setCtx] = useState(null)
  const [draft,   setDraft] = useState({ soilType:'',location:'',season:'',availableWater:'',cropGoal:'' })
  const [msgs,    setMsgs]  = useState([])   // {role,text,time}
  const [text,    setText]  = useState('')
  const [loading, setLoad]  = useState(false)
  const [error,   setErr]   = useState('')
  const [edit,    setEdit]  = useState(false)

  const ctxValid = d => ['soilType','location','season','availableWater'].every(k=>d[k].trim())

  /* scroll behaviour */
  const scrollToBottom = () => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight
  }
  // maintain "sticky" bottom unless user scrolled up >100px
  const onScroll = () => {
    const el = chatRef.current
    if (!el) return
    atBottomRef.current = el.scrollHeight - el.scrollTop - el.clientHeight < 120
  }
  useEffect(() => {
    if (atBottomRef.current) scrollToBottom()
  }, [msgs, loading])

  /* AI call */
  const ask = async q => {
    try {
      setLoad(true)
      const token = localStorage.getItem('token')
      const { data } = await axios.post(
        'http://localhost:4000/api/ai/chat',
        { context, question: q, history: msgs },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setMsgs(m => [...m, { role: 'assistant', text: data.message || '—', time: new Date() }])
    } catch (e) {
      setErr(e.response?.data?.error || e.message)
    } finally { setLoad(false) }
  }

  /* send turn */
  const send = () => {
    if (!text.trim()) return
    const q = text.trim()
    setMsgs(m => [...m, { role: 'user', text: q, time: new Date() }])
    setText('')
    ask(q)
  }
  const keyHandler = e => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() }
  }

  /* save context */
  const saveCtx = () => { if (ctxValid(draft)) { setCtx(draft); setErr('') } else setErr('Please fill required fields.') }
  const saveEdits = () => {
    if (!ctxValid(draft)) { setErr('Please fill required fields.'); return }
    setCtx(draft)
    setMsgs(m=>[...m,{role:'assistant',text:'_Context updated. Ask new questions._',time:new Date()}])
    setEdit(false)
    setErr('')
  }

  /* clear chat only */
  const clearChat = () => setMsgs([])

  /* render one bubble */
  const Bubble = ({ role, text, time }) => (
    <div className={`mb-6 flex ${role==='user'?'justify-end':'justify-start'}`}>
      <div>
        <div className="text-xs mb-1 text-gray-500 text-right">
          {role === 'user' ? 'You' : 'Advisor'} · {time.toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' })}
        </div>
        <div
          className={`rounded-lg px-4 py-3 shadow-sm max-w-full md:max-w-[60%] text-sm whitespace-pre-wrap leading-relaxed ${
            role === 'user'
              ? 'bg-emerald-600 text-white rounded-br-none'   /* ← here */
              : 'bg-gray-100 text-gray-900 rounded-bl-none'
          }`}
          dangerouslySetInnerHTML={{ __html: md(text) }}
        />
      </div>
    </div>
  )

  /* component markup */
  return (
    <div className="h-full flex flex-col max-w-6xl mx-auto py-10 px-6">
      <h1 className="text-4xl font-bold flex items-center gap-3 mb-8 text-gray-800">
        <FiZap className="text-green-500 text-5xl" /> Crop Advisor
      </h1>

      {/* ── context phase ── */}
      {!context && (
        <ContextForm draft={draft} setDraft={setDraft} onSubmit={saveCtx} btn="Start Chat" err={error}/>
      )}

      {/* ── chat phase ── */}
      {context && (
        <>
          {/* badge row */}
          <div className="mb-4 flex flex-wrap items-center gap-3 text-sm text-gray-700">
            {Object.entries(context).filter(([,v])=>v.trim()).map(([k,v])=>(
              <span key={k} className="bg-gray-100 rounded px-2 py-1">
                {k==='soilType'?'Soil':k==='availableWater'?'Water':k.charAt(0).toUpperCase()+k.slice(1)}: {v}
              </span>
            ))}
            <button className="ml-auto flex items-center gap-1 text-primary-600 hover:underline"
                    onClick={()=>{ setDraft(context); setEdit(true) }}>
              <FiEdit3/> Edit
            </button>
          </div>

          {/* error banner */}
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-100 text-red-700 rounded mb-3">
              <FiAlertCircle/>{error}
            </div>
          )}

          {/* chat box */}
          <div ref={chatRef}
               onScroll={onScroll}
               className="flex-1 min-h-[60vh] bg-white border rounded-xl shadow p-6 overflow-y-auto">
            {msgs.length===0 && !loading && (
              <p className="text-gray-400 text-center mt-10">Ask any crop question…</p>
            )}
            {msgs.map((m,i)=><Bubble key={i} {...m}/>)}
            {loading && (
              <div className="flex mb-6">
                <div className="bg-gray-100 text-gray-800 rounded-lg rounded-bl-none px-4 py-3 text-sm flex items-center gap-2 shadow-sm">
                  <FiLoader className="animate-spin"/> Typing…
                </div>
              </div>
            )}
          </div>

          {/* input row */}
          <div className="mt-4 flex gap-3">
            <textarea
              value={text}
              onChange={e=>setText(e.target.value)}
              onKeyDown={keyHandler}
              rows={1}
              placeholder="Type your question…"
              className="flex-1 border rounded px-3 py-2 resize-y focus:ring-primary-500 focus:outline-none"
            />
            <button
              onClick={send}
              disabled={loading || !text.trim()}
              className="bg-primary-600 text-white px-5 rounded disabled:opacity-50 flex items-center justify-center">
              {loading ? <FiLoader className="animate-spin"/> : <FiSend/>}
            </button>
          </div>

          {/* footer */}
          <div className="flex justify-center mt-6 text-sm text-gray-600">
            <button onClick={clearChat} className="inline-flex items-center gap-2 hover:text-gray-800">
              <FiRefreshCw/> Clear Chat
            </button>
          </div>
        </>
      )}

      {/* ── slide-over edit ── */}
      {edit && (
        <div className="fixed inset-0 z-40 flex">
          <div className="flex-1 bg-black/30" onClick={()=>setEdit(false)}/>
          <div className="w-full max-w-md bg-white shadow-xl p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Edit Context</h2>
              <button onClick={()=>setEdit(false)}><FiX size={20}/></button>
            </div>
            <ContextForm draft={draft} setDraft={setDraft} onSubmit={saveEdits} btn="Save" err={error}/>
          </div>
        </div>
      )}
    </div>
  )
}