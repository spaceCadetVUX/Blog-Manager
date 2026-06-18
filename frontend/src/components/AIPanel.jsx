import { X, Loader } from 'lucide-react'

const MODEL_OPTIONS = [
  { value: 'claude-haiku-4-5-20251001', label: 'Haiku (nhanh)' },
  { value: 'claude-sonnet-4-6',         label: 'Sonnet (sâu)' },
]

// Simple markdown renderer — chỉ xử lý ## heading, **bold**, bullet
function Markdown({ text }) {
  const lines = text.split('\n')
  return (
    <div style={{ fontSize: 12, color: 'var(--text)', lineHeight: 1.7 }}>
      {lines.map((line, i) => {
        if (line.startsWith('## ')) {
          return (
            <div key={i} style={{ fontSize: 13, fontWeight: 700, color: 'var(--accent-2)', marginTop: 16, marginBottom: 4 }}>
              {line.slice(3)}
            </div>
          )
        }
        if (line.startsWith('- ') || line.startsWith('* ')) {
          return (
            <div key={i} style={{ paddingLeft: 14, marginBottom: 2 }}>
              <span style={{ color: 'var(--text-subtle)', marginRight: 6 }}>·</span>
              <InlineMarkdown text={line.slice(2)} />
            </div>
          )
        }
        if (/^\d+\./.test(line)) {
          return (
            <div key={i} style={{ paddingLeft: 4, marginBottom: 2 }}>
              <InlineMarkdown text={line} />
            </div>
          )
        }
        if (line.trim() === '') return <div key={i} style={{ height: 6 }} />
        return (
          <div key={i} style={{ marginBottom: 2 }}>
            <InlineMarkdown text={line} />
          </div>
        )
      })}
    </div>
  )
}

function InlineMarkdown({ text }) {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/)
  return (
    <>
      {parts.map((p, i) => {
        if (p.startsWith('**') && p.endsWith('**'))
          return <strong key={i} style={{ color: 'var(--text)', fontWeight: 600 }}>{p.slice(2, -2)}</strong>
        if (p.startsWith('`') && p.endsWith('`'))
          return <code key={i} style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 3, padding: '0 4px', fontSize: 11, fontFamily: 'monospace' }}>{p.slice(1, -1)}</code>
        return p
      })}
    </>
  )
}

export function ModelSelect({ value, onChange, disabled }) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      disabled={disabled}
      style={{
        background: 'var(--surface-2)', border: '1px solid var(--border)',
        color: 'var(--text)', borderRadius: 6, padding: '4px 8px',
        fontSize: 11, cursor: disabled ? 'not-allowed' : 'pointer', outline: 'none',
        opacity: disabled ? 0.6 : 1,
      }}
    >
      {MODEL_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  )
}

export default function AIPanel({ title, content, loading, onClose, style = {} }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      background: 'rgba(13,17,23,0.97)',
      border: '1px solid var(--border)',
      borderRadius: 8,
      boxShadow: '0 8px 32px rgba(0,0,0,0.7)',
      backdropFilter: 'blur(8px)',
      overflow: 'hidden',
      ...style,
    }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '10px 14px', borderBottom: '1px solid var(--border)',
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 14 }}>🤖</span>
          <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)' }}>{title}</span>
          {loading && <Loader size={12} color="var(--accent-2)" style={{ animation: 'spin 1s linear infinite' }} />}
        </div>
        <button
          onClick={onClose}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 2, display: 'flex' }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--text)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
        ><X size={14} /></button>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 14px' }}>
        {loading && !content && (
          <div style={{ color: 'var(--text-muted)', fontSize: 12, textAlign: 'center', padding: 20 }}>
            Đang phân tích...
          </div>
        )}
        {content && <Markdown text={content} />}
        {loading && content && (
          <span style={{ display: 'inline-block', width: 6, height: 12, background: 'var(--accent-2)', animation: 'blink 0.8s step-end infinite', marginLeft: 2, verticalAlign: 'text-bottom' }} />
        )}
      </div>
    </div>
  )
}
