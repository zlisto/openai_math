import { useEffect, useId, useRef, useState, type FormEvent } from 'react'
import { Labubu } from './Labubu'
import './ChatBuddy.css'

type ChatMsg = {
  id: string
  role: 'user' | 'buddy'
  text: string
}

const STARTER: ChatMsg = {
  id: 'hello',
  role: 'buddy',
  text: "hey hey — i'm your paper buddy. chat UI only for now… wire me up later 💅",
}

export function ChatBuddy() {
  const panelId = useId()
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState('')
  const [messages, setMessages] = useState<ChatMsg[]>([STARTER])
  const listRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!open) return
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight })
    inputRef.current?.focus()
  }, [open, messages])

  const send = (e?: FormEvent) => {
    e?.preventDefault()
    const text = draft.trim()
    if (!text) return
    const userMsg: ChatMsg = { id: `u-${Date.now()}`, role: 'user', text }
    // Local stub reply — swap for a real backend later.
    const buddyMsg: ChatMsg = {
      id: `b-${Date.now()}`,
      role: 'buddy',
      text: "got it — no brain plugged in yet. leave a note and i'll pretend i understood ✨",
    }
    setMessages((prev) => [...prev, userMsg, buddyMsg])
    setDraft('')
  }

  return (
    <div className={`chat-buddy ${open ? 'is-open' : ''}`}>
      {open && (
        <section
          className="chat-buddy__panel"
          id={panelId}
          role="dialog"
          aria-label="Chat buddy"
        >
          <header className="chat-buddy__header">
            <div className="chat-buddy__who">
              <Labubu size={44} title="Chat buddy Labubu" />
              <div>
                <p className="chat-buddy__name">Labubu Buddy</p>
                <p className="chat-buddy__status">UI only · backend soon</p>
              </div>
            </div>
            <button
              type="button"
              className="chat-buddy__close"
              onClick={() => setOpen(false)}
              aria-label="Close chat"
            >
              ×
            </button>
          </header>

          <div className="chat-buddy__messages" ref={listRef}>
            {messages.map((m) => (
              <div
                key={m.id}
                className={`chat-buddy__bubble chat-buddy__bubble--${m.role}`}
              >
                {m.text}
              </div>
            ))}
          </div>

          <form className="chat-buddy__composer" onSubmit={send}>
            <input
              ref={inputRef}
              type="text"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="say something…"
              aria-label="Message"
              autoComplete="off"
            />
            <button type="submit" disabled={!draft.trim()}>
              Send
            </button>
          </form>
        </section>
      )}

      <button
        type="button"
        className="chat-buddy__fab"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? 'Close chat buddy' : 'Open chat buddy'}
      >
        <Labubu size={56} title="" />
        {!open && <span className="chat-buddy__fab-dot" aria-hidden />}
      </button>
    </div>
  )
}
