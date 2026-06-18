import { useEffect, useRef, useState } from 'react'
import { Send, Trash2 } from 'lucide-react'
import { streamChat } from '../api'
import { ModelSelect } from './AIPanel'

function MessageBubble({ msg }) {
  const isUser = msg.role === 'user'
  return (
    <div style={{
      display: 'flex', justifyContent: isUser ? 'flex-end' : 'flex-start',
      marginBottom: 12, gap: 8, alignItems: 'flex-end',
    }}>
      {!isUser && (
        <div style={{
          width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
          background: 'rgba(139,92,246,0.2)', border: '1px solid rgba(139,92,246,0.4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14,
        }}>🤖</div>
      )}
      <div style={{
        maxWidth: '72%', padding: '9px 13px', borderRadius: isUser ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
        background: isUser ? 'rgba(139,92,246,0.18)' : 'var(--surface)',
        border: `1px solid ${isUser ? 'rgba(139,92,246,0.35)' : 'var(--border)'}`,
        fontSize: 13, color: 'var(--text)', lineHeight: 1.6,
        whiteSpace: 'pre-wrap', wordBreak: 'break-word',
      }}>
        {msg.content}
        {msg.streaming && (
          <span style={{
            display: 'inline-block', width: 6, height: 13,
            background: 'var(--accent-2)', marginLeft: 3,
            animation: 'blink 0.8s step-end infinite', verticalAlign: 'text-bottom',
          }} />
        )}
      </div>
    </div>
  )
}

export default function AIChatView() {
  const [messages, setMessages]     = useState([])
  const [input, setInput]           = useState('')
  const [loading, setLoading]       = useState(false)
  const [model, setModel]           = useState('claude-haiku-4-5-20251001')
  const [withContext, setWithContext] = useState(true)
  const bottomRef = useRef(null)
  const textareaRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const send = async () => {
    const text = input.trim()
    if (!text || loading) return
    setInput('')

    const userMsg = { role: 'user', content: text }
    const history = [...messages, userMsg]
    setMessages(history)
    setLoading(true)

    const aiMsg = { role: 'assistant', content: '', streaming: true }
    setMessages([...history, aiMsg])

    try {
      await streamChat(
        history,
        model,
        withContext,
        chunk => setMessages(prev => {
          const next = [...prev]
          next[next.length - 1] = { ...next[next.length - 1], content: next[next.length - 1].content + chunk }
          return next
        }),
        () => {
          setMessages(prev => {
            const next = [...prev]
            next[next.length - 1] = { ...next[next.length - 1], streaming: false }
            return next
          })
          setLoading(false)
        },
      )
    } catch (e) {
      setMessages(prev => {
        const next = [...prev]
        next[next.length - 1] = { role: 'assistant', content: `**Lỗi:** ${e.message}`, streaming: false }
        return next
      })
      setLoading(false)
    }
  }

  const handleKey = e => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() }
  }

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

      {/* Header */}
      <div style={{
        padding: '10px 16px', background: 'var(--surface)',
        borderBottom: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0, flexWrap: 'wrap',
      }}>
        <span style={{ fontSize: 16 }}>💬</span>
        <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>AI Chat</span>
        <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Hỏi bất cứ điều gì về blog</span>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 10 }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: 'var(--text-muted)', cursor: 'pointer' }}>
            <input
              type="checkbox" checked={withContext} onChange={e => setWithContext(e.target.checked)}
              style={{ cursor: 'pointer' }}
            />
            Blog context
          </label>
          <ModelSelect value={model} onChange={setModel} disabled={loading} />
          <button
            onClick={() => setMessages([])}
            disabled={messages.length === 0}
            title="Xóa lịch sử"
            style={{
              background: 'none', border: '1px solid var(--border)', borderRadius: 6,
              color: messages.length === 0 ? 'var(--text-subtle)' : 'var(--text-muted)',
              cursor: messages.length === 0 ? 'not-allowed' : 'pointer',
              padding: '4px 7px', display: 'flex', alignItems: 'center',
            }}
          ><Trash2 size={13} /></button>
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px' }}>
        {messages.length === 0 && (
          <div style={{ textAlign: 'center', marginTop: 60, color: 'var(--text-subtle)' }}>
            <div style={{ fontSize: 40, marginBottom: 12, opacity: 0.4 }}>💬</div>
            <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 8 }}>Hỏi AI về blog của bạn</div>
            <div style={{ fontSize: 11, color: 'var(--text-subtle)', display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'center' }}>
              {['Section nào đang có nhiều orphan nhất?', 'Gợi ý 5 chủ đề bài viết mới cho KNX', 'Tổng kết sức khỏe internal linking'].map(s => (
                <button key={s} onClick={() => { setInput(s); textareaRef.current?.focus() }}
                  style={{
                    background: 'var(--surface)', border: '1px solid var(--border)',
                    borderRadius: 20, padding: '5px 14px', fontSize: 11,
                    color: 'var(--text-muted)', cursor: 'pointer',
                  }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(139,92,246,0.5)'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
                >{s}</button>
              ))}
            </div>
          </div>
        )}
        {messages.map((msg, i) => <MessageBubble key={i} msg={msg} />)}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{
        padding: '12px 16px', borderTop: '1px solid var(--border)',
        background: 'var(--surface)', flexShrink: 0,
        display: 'flex', gap: 8, alignItems: 'flex-end',
      }}>
        <textarea
          ref={textareaRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Nhập câu hỏi... (Enter để gửi, Shift+Enter xuống dòng)"
          rows={1}
          style={{
            flex: 1, resize: 'none', fontSize: 13,
            background: 'var(--surface-2)', border: '1px solid var(--border)',
            borderRadius: 10, padding: '9px 12px', color: 'var(--text)',
            fontFamily: 'inherit', outline: 'none', lineHeight: 1.5,
            maxHeight: 120, overflowY: 'auto',
          }}
          onInput={e => { e.target.style.height = 'auto'; e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px' }}
        />
        <button
          onClick={send} disabled={!input.trim() || loading}
          style={{
            width: 38, height: 38, borderRadius: 10, flexShrink: 0,
            border: '1px solid rgba(139,92,246,0.5)',
            background: (!input.trim() || loading) ? 'rgba(139,92,246,0.06)' : 'rgba(139,92,246,0.18)',
            color: (!input.trim() || loading) ? 'rgba(167,139,250,0.4)' : '#a78bfa',
            cursor: (!input.trim() || loading) ? 'not-allowed' : 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.1s',
          }}
        ><Send size={15} /></button>
      </div>
    </div>
  )
}
