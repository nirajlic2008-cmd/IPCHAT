import React, { useMemo, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { ArrowLeft, ArrowRight, Check, Copy, Hash, LogOut, MessageCircle, Send, Shield, Users } from 'lucide-react'
import './index.css'

const randomRoom = () => String(Math.floor(100000 + Math.random() * 900000))

function App() {
  const [page, setPage] = useState('home')
  const [username, setUsername] = useState('')
  const [roomId, setRoomId] = useState('')
  const [activeRoom, setActiveRoom] = useState('')
  const [copied, setCopied] = useState(false)
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([
    { id: 1, user: 'Alex', text: 'Welcome to IPChat 👋', own: false },
    { id: 2, user: 'You', text: 'This chat is temporary.', own: true }
  ])

  const displayName = username.trim() || 'Guest'

  const enterRoom = (id) => {
    setActiveRoom(id)
    setPage('chat')
  }

  const createRoom = () => {
    if (!username.trim()) return
    const id = randomRoom()
    setRoomId(id)
    enterRoom(id)
  }

  const joinRoom = () => {
    if (!username.trim() || roomId.length !== 6) return
    enterRoom(roomId)
  }

  const sendMessage = () => {
    const text = message.trim()
    if (!text) return
    setMessages(prev => [...prev, { id: Date.now(), user: displayName, text, own: true }])
    setMessage('')
  }

  const copyRoom = async () => {
    try { await navigator.clipboard.writeText(activeRoom) } catch {}
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  if (page === 'chat') return <ChatPage room={activeRoom} username={displayName} messages={messages} message={message} setMessage={setMessage} sendMessage={sendMessage} copyRoom={copyRoom} copied={copied} leave={() => setPage('home')} />
  if (page === 'create') return <RoomForm title="Create a room" subtitle="Start a temporary private conversation." username={username} setUsername={setUsername} action="Create room" onAction={createRoom} back={() => setPage('home')} />
  if (page === 'join') return <JoinForm username={username} setUsername={setUsername} roomId={roomId} setRoomId={setRoomId} onJoin={joinRoom} back={() => setPage('home')} />
  return <Home setPage={setPage} />
}

function Shell({ children, back }) {
  return <main className="min-h-screen bg-[#070707] text-white"><div className="mx-auto flex min-h-screen w-full max-w-5xl flex-col px-5 py-6 sm:px-8">{back && <button onClick={back} className="mb-12 flex w-fit items-center gap-2 text-sm text-zinc-500 transition hover:text-white"><ArrowLeft size={16}/> Back</button>}{children}</div></main>
}

function Logo() {
  return <div className="flex items-center gap-3"><div className="grid h-9 w-9 place-items-center rounded-xl bg-white text-black"><MessageCircle size={19} strokeWidth={2.5}/></div><span className="text-lg font-semibold tracking-tight">IPChat</span></div>
}

function Home({ setPage }) {
  return <Shell><div className="flex items-center justify-between"><Logo/><span className="rounded-full border border-white/10 px-3 py-1 text-xs text-zinc-500">Temporary chat</span></div><section className="flex flex-1 items-center justify-center py-20"><div className="w-full max-w-2xl text-center"><div className="mx-auto mb-7 grid h-16 w-16 place-items-center rounded-2xl border border-white/10 bg-white/[0.04] shadow-2xl shadow-black"><Shield size={27} className="text-zinc-200"/></div><h1 className="text-5xl font-semibold tracking-[-0.04em] sm:text-7xl">Chat. <span className="text-zinc-500">Then disappear.</span></h1><p className="mx-auto mt-6 max-w-xl text-base leading-7 text-zinc-400 sm:text-lg">Private, temporary conversations without accounts or permanent chat history.</p><div className="mx-auto mt-10 flex max-w-md flex-col gap-3 sm:flex-row"><PrimaryButton onClick={() => setPage('create')}>Create room <ArrowRight size={17}/></PrimaryButton><SecondaryButton onClick={() => setPage('join')}>Join room</SecondaryButton></div><div className="mt-10 flex justify-center gap-5 text-xs text-zinc-600"><span>Up to 4 people</span><span>•</span><span>No account</span><span>•</span><span>Temporary</span></div></div></section></Shell>
}

function RoomForm({ title, subtitle, username, setUsername, action, onAction, back }) {
  return <Shell back={back}><div className="mx-auto mt-4 w-full max-w-md"><Logo/><div className="mt-16"><h1 className="text-3xl font-semibold tracking-tight">{title}</h1><p className="mt-2 text-sm leading-6 text-zinc-500">{subtitle}</p><label className="mt-8 block text-sm font-medium text-zinc-300">Your username<input autoFocus value={username} onChange={e => setUsername(e.target.value)} onKeyDown={e => e.key === 'Enter' && onAction()} maxLength={24} placeholder="e.g. Niraj" className="mt-2 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3.5 text-white outline-none transition placeholder:text-zinc-700 focus:border-white/25"/></label><PrimaryButton disabled={!username.trim()} onClick={onAction}>{action}<ArrowRight size={17}/></PrimaryButton><p className="mt-5 text-center text-xs text-zinc-600">No account required. Your username is temporary.</p></div></div></Shell>
}

function JoinForm({ username, setUsername, roomId, setRoomId, onJoin, back }) {
  return <Shell back={back}><div className="mx-auto mt-4 w-full max-w-md"><Logo/><div className="mt-16"><h1 className="text-3xl font-semibold tracking-tight">Join a room</h1><p className="mt-2 text-sm leading-6 text-zinc-500">Enter the 6-digit code shared by the room creator.</p><label className="mt-8 block text-sm font-medium text-zinc-300">Your username<input autoFocus value={username} onChange={e => setUsername(e.target.value)} maxLength={24} placeholder="e.g. Niraj" className="mt-2 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3.5 text-white outline-none transition placeholder:text-zinc-700 focus:border-white/25"/></label><label className="mt-5 block text-sm font-medium text-zinc-300">Room ID<div className="relative mt-2"><Hash size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600"/><input value={roomId} onChange={e => setRoomId(e.target.value.replace(/\D/g, '').slice(0, 6))} inputMode="numeric" placeholder="000000" className="w-full rounded-xl border border-white/10 bg-white/[0.04] py-3.5 pl-11 pr-4 text-xl tracking-[0.25em] text-white outline-none transition placeholder:text-zinc-700 focus:border-white/25"/></div></label><PrimaryButton disabled={!username.trim() || roomId.length !== 6} onClick={onJoin}>Join room <ArrowRight size={17}/></PrimaryButton></div></div></Shell>
}

function ChatPage({ room, username, messages, message, setMessage, sendMessage, copyRoom, copied, leave }) {
  const members = useMemo(() => [username, 'Alex', 'Sam'].slice(0, 3), [username])
  return <main className="min-h-screen bg-[#070707] text-white"><div className="mx-auto flex h-screen max-w-4xl flex-col px-3 py-3 sm:px-5 sm:py-5"><header className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3"><div className="flex items-center gap-3"><div className="grid h-9 w-9 place-items-center rounded-xl bg-white text-black"><MessageCircle size={18}/></div><div><div className="font-semibold">IPChat</div><button onClick={copyRoom} className="flex items-center gap-1 text-xs text-zinc-500 hover:text-white"><Hash size={12}/>{room}{copied ? <Check size={12}/> : <Copy size={12}/>}</button></div></div><div className="flex items-center gap-3"><div className="hidden text-right sm:block"><div className="text-xs text-zinc-400">{members.length} / 4 participants</div><div className="text-[11px] text-zinc-600">Temporary room</div></div><button onClick={leave} className="grid h-9 w-9 place-items-center rounded-xl border border-white/10 text-zinc-500 transition hover:border-red-400/20 hover:text-red-300"><LogOut size={16}/></button></div></header><div className="mt-3 flex-1 overflow-y-auto rounded-2xl border border-white/10 bg-[#0a0a0a] p-4 sm:p-6"><div className="mx-auto mb-7 flex max-w-md items-center justify-center gap-2 text-[11px] text-zinc-600"><span className="h-px flex-1 bg-white/5"/><span>Messages are temporary</span><span className="h-px flex-1 bg-white/5"/></div><div className="mx-auto flex max-w-2xl flex-col gap-3">{messages.map(m => <div key={m.id} className={`flex ${m.own ? 'justify-end' : 'justify-start'}`}><div className={`max-w-[78%] ${m.own ? 'items-end' : 'items-start'} flex flex-col`}><span className="mb-1 px-1 text-[11px] text-zinc-600">{m.own ? 'You' : m.user}</span><div className={`rounded-2xl px-4 py-2.5 text-sm leading-6 ${m.own ? 'rounded-br-md bg-white text-black' : 'rounded-bl-md bg-white/[0.07] text-zinc-200'}`}>{m.text}</div></div></div>)}</div></div><div className="mt-3 rounded-2xl border border-white/10 bg-white/[0.03] p-2"><div className="flex items-end gap-2"><button className="grid h-11 w-11 shrink-0 place-items-center rounded-xl text-xl text-zinc-400 transition hover:bg-white/5 hover:text-white" onClick={() => setMessage(v => v + ' 😊')} aria-label="Add emoji">😊</button><textarea value={message} onChange={e => setMessage(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() } }} rows="1" placeholder="Write a message..." className="max-h-32 min-h-11 flex-1 resize-none bg-transparent px-1 py-3 text-sm text-white outline-none placeholder:text-zinc-600"/><button onClick={sendMessage} disabled={!message.trim()} className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-white text-black transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-30"><Send size={17}/></button></div></div></div></main>
}

function PrimaryButton({ children, onClick, disabled }) { return <button disabled={disabled} onClick={onClick} className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-3.5 text-sm font-semibold text-black transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-30">{children}</button> }
function SecondaryButton({ children, onClick }) { return <button onClick={onClick} className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3.5 text-sm font-semibold text-white transition hover:bg-white/[0.07]">{children}</button> }

createRoot(document.getElementById('root')).render(<React.StrictMode><App /></React.StrictMode>)
