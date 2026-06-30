import { useState, useEffect, useRef } from 'react'
import { Search, X, Copy, Check, Package } from 'lucide-react'
import { api } from '../api'

function imgCandidates(productUrl) {
  if (!productUrl) return []
  const slug = productUrl.replace(/\/$/, '').split('/products/')[1]
  if (!slug) return []
  const base = `https://knxstore.vn/assets/image/product/${slug}`
  return [`${base}.jpg`, `${base}_1.jpg`]
}

function Thumb({ url, size }) {
  const candidates = imgCandidates(url)
  const [idx, setIdx] = useState(0)
  if (!candidates.length || idx >= candidates.length) return (
    <div style={{ width: size, height: size, borderRadius: 8, background: 'var(--bg)', border: '1px solid var(--border-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <Package size={size * 0.38} color="var(--border)" strokeWidth={1.3} />
    </div>
  )
  return <img src={candidates[idx]} alt="" loading="lazy" onError={() => setIdx(i => i + 1)}
    style={{ width: size, height: size, objectFit: 'contain', borderRadius: 8, background: 'var(--bg)', border: '1px solid var(--border-2)', flexShrink: 0 }} />
}

function SelectedCard({ item, index, onRemove }) {
  const candidates = imgCandidates(item.url)
  const [idx, setIdx] = useState(0)
  const hasImg = candidates.length > 0 && idx < candidates.length
  return (
    <div style={{ position: 'relative', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      {/* Image */}
      <div style={{ width: '100%', paddingBottom: '80%', position: 'relative', background: 'var(--bg)', borderBottom: '1px solid var(--border-2)' }}>
        {hasImg
          ? <img src={candidates[idx]} alt={item.name} loading="lazy" onError={() => setIdx(i => i + 1)}
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'contain', padding: 8 }} />
          : <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Package size={32} color="var(--border)" strokeWidth={1.2} />
            </div>
        }
        {/* Index badge */}
        <span style={{ position: 'absolute', top: 6, left: 6, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', color: '#fff', fontSize: 9, fontWeight: 700, padding: '2px 5px', borderRadius: 4 }}>
          {index + 1}
        </span>
        {/* Remove btn */}
        <button onClick={() => onRemove(item.id)}
          style={{ position: 'absolute', top: 5, right: 5, width: 20, height: 20, borderRadius: 5, background: 'rgba(248,71,71,0.85)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
          <X size={11} />
        </button>
      </div>
      {/* Info */}
      <div style={{ padding: '7px 8px', flex: 1 }}>
        <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--accent-2)', marginBottom: 2 }}>#{item.id}</div>
        <div style={{ fontSize: 11, color: 'var(--text)', lineHeight: 1.35, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{item.name}</div>
        {item.brand && <div style={{ fontSize: 10, color: 'var(--text-subtle)', marginTop: 3 }}>{item.brand}</div>}
      </div>
    </div>
  )
}

function Highlight({ text, query }) {
  if (!query.trim() || !text) return <>{text}</>
  const tokens = query.trim().split(/\s+/).filter(Boolean)
  const pattern = tokens.map(t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')
  const regex = new RegExp(`(${pattern})`, 'gi')
  const parts = text.split(regex)
  return (
    <>
      {parts.map((part, i) =>
        regex.test(part)
          ? <mark key={i} style={{ background: 'rgba(6,182,212,0.28)', color: 'var(--accent-2)', borderRadius: 2, padding: '0 1px' }}>{part}</mark>
          : part
      )}
    </>
  )
}

function useDebounce(value, delay = 280) {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(t)
  }, [value, delay])
  return debounced
}

export default function ProductPickerView({ bp = 'desktop' }) {
  const isMobile = bp === 'mobile'

  const [query, setQuery]         = useState('')
  const [results, setResults]     = useState([])
  const [searching, setSearching] = useState(false)
  const [selected, setSelected]   = useState([])
  const [copied, setCopied]       = useState(false)
  const inputRef = useRef(null)

  const debounced = useDebounce(query)

  useEffect(() => {
    if (!debounced.trim()) { setResults([]); return }
    setSearching(true)
    api.products({ search: debounced, limit: 12, sort: 'name', dir: 'asc' })
      .then(r => setResults(r.items))
      .catch(console.error)
      .finally(() => setSearching(false))
  }, [debounced])

  const addProduct = (item) => {
    if (selected.find(s => s.id === item.id)) return
    setSelected(prev => [...prev, { id: item.id, name: item.name, brand: item.brand, url: item.url, price: item.price }])
  }
  const removeProduct = (id) => setSelected(prev => prev.filter(s => s.id !== id))

  const output = JSON.stringify({ products: selected.map(s => s.id) })
  const copyOutput = () => {
    navigator.clipboard.writeText(output).then(() => {
      setCopied(true); setTimeout(() => setCopied(false), 1800)
    })
  }

  const selectedIds = new Set(selected.map(s => s.id))

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: isMobile ? 'column' : 'row', overflow: 'hidden', background: 'var(--bg)' }}>

      {/* ── Left: Search ── */}
      <div style={{
        width: isMobile ? '100%' : 320,
        minWidth: isMobile ? 0 : 280,
        maxHeight: isMobile ? '45%' : undefined,
        borderRight: isMobile ? 'none' : '1px solid var(--border)',
        borderBottom: isMobile ? '1px solid var(--border)' : 'none',
        display: 'flex', flexDirection: 'column',
        background: 'var(--surface)', flexShrink: 0,
      }}>
        <div style={{ padding: '12px 12px 8px', borderBottom: '1px solid var(--border-2)' }}>
          <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--text)', marginBottom: 8 }}>Tìm sản phẩm</div>
          <div style={{ position: 'relative' }}>
            <Search size={13} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-subtle)', pointerEvents: 'none' }} />
            <input ref={inputRef} value={query} onChange={e => setQuery(e.target.value)}
              placeholder="Nhập tên sản phẩm..." autoFocus
              style={{ width: '100%', boxSizing: 'border-box', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 8, padding: '7px 28px 7px 30px', fontSize: 13, color: 'var(--text)', outline: 'none' }} />
            {query && (
              <button onClick={() => { setQuery(''); setResults([]); inputRef.current?.focus() }}
                style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-subtle)', display: 'flex', padding: 2 }}>
                <X size={12} />
              </button>
            )}
          </div>
        </div>

        {/* Token chips */}
        {query.trim().split(/\s+/).filter(Boolean).length > 1 && (
          <div style={{ padding: '5px 12px 4px', display: 'flex', gap: 4, flexWrap: 'wrap', borderBottom: '1px solid var(--border-2)' }}>
            {query.trim().split(/\s+/).filter(Boolean).map((tok, i) => (
              <span key={i} style={{ background: 'rgba(6,182,212,0.15)', color: 'var(--accent-2)', border: '1px solid rgba(6,182,212,0.3)', borderRadius: 4, padding: '1px 6px', fontSize: 10, fontWeight: 600 }}>
                {tok}
              </span>
            ))}
          </div>
        )}

        {/* Results */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {searching && <div style={{ padding: '20px', color: 'var(--text-subtle)', fontSize: 12, textAlign: 'center' }}>Đang tìm...</div>}
          {!searching && query && results.length === 0 && <div style={{ padding: '20px', color: 'var(--text-subtle)', fontSize: 12, textAlign: 'center' }}>Không tìm thấy</div>}
          {!query && <div style={{ padding: '30px 16px', color: 'var(--text-subtle)', fontSize: 12, textAlign: 'center', lineHeight: 1.7 }}>Nhập tên sản phẩm<br/>để tìm kiếm</div>}

          {results.map(item => {
            const already = selectedIds.has(item.id)
            return (
              <button key={item.id} onClick={() => addProduct(item)} disabled={already}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                  padding: '9px 12px', background: 'transparent', border: 'none',
                  borderLeft: already ? '3px solid var(--accent)' : '3px solid transparent',
                  cursor: already ? 'default' : 'pointer', textAlign: 'left',
                  opacity: already ? 0.5 : 1, transition: 'background 0.1s',
                }}
                onMouseEnter={e => { if (!already) e.currentTarget.style.background = 'var(--accent-dim)' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
              >
                <Thumb url={item.url} size={56} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--text)', lineHeight: 1.35, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    <Highlight text={item.name} query={query} />
                  </div>
                  <div style={{ fontSize: 10, color: 'var(--text-subtle)', marginTop: 3, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    <span style={{ color: 'var(--accent-2)', fontWeight: 600 }}>#{item.id}</span>
                    {item.brand && <span><Highlight text={item.brand} query={query} /></span>}
                    {item.price > 0 && <span style={{ color: 'var(--text-muted)' }}>{item.price.toLocaleString('vi-VN')}₫</span>}
                  </div>
                </div>
                {already && <Check size={13} color="var(--accent)" style={{ flexShrink: 0 }} />}
              </button>
            )
          })}
        </div>
      </div>

      {/* ── Right: Selected + Output ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>

        {/* Header */}
        <div style={{ padding: '10px 14px', borderBottom: '1px solid var(--border-2)', background: 'var(--surface)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
          <span style={{ fontWeight: 600, fontSize: 13, color: 'var(--text)' }}>Đã chọn ({selected.length})</span>
          {selected.length > 0 && (
            <button onClick={() => setSelected([])}
              style={{ fontSize: 11, color: 'var(--text-subtle)', background: 'none', border: 'none', cursor: 'pointer', padding: '2px 6px', borderRadius: 4 }}
              onMouseEnter={e => e.currentTarget.style.color = '#f87171'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--text-subtle)'}
            >Xóa tất cả</button>
          )}
        </div>

        {/* Card grid */}
        <div style={{ flex: 1, overflowY: 'auto', padding: 12 }}>
          {selected.length === 0 ? (
            <div style={{ height: '100%', minHeight: 140, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10, border: '1px dashed var(--border)', borderRadius: 12, color: 'var(--text-subtle)', fontSize: 12 }}>
              <Package size={28} strokeWidth={1.2} />
              Chọn sản phẩm từ ô tìm kiếm bên trái
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: `repeat(auto-fill, minmax(${isMobile ? 120 : 150}px, 1fr))`, gap: 10 }}>
              {selected.map((s, i) => (
                <SelectedCard key={s.id} item={s} index={i} onRemove={removeProduct} />
              ))}
            </div>
          )}
        </div>

        {/* Output JSON */}
        <div style={{ padding: '10px 14px', borderTop: '1px solid var(--border)', background: 'var(--surface)', flexShrink: 0 }}>
          <div style={{ fontSize: 10, color: 'var(--text-subtle)', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Output JSON</div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'stretch' }}>
            <code style={{
              flex: 1, display: 'block', padding: '8px 12px',
              background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 8,
              fontSize: 12, color: selected.length ? 'var(--accent-2)' : 'var(--text-subtle)',
              fontFamily: 'monospace', wordBreak: 'break-all', lineHeight: 1.5,
            }}>{output}</code>
            <button onClick={copyOutput} disabled={selected.length === 0} style={{
              display: 'flex', alignItems: 'center', gap: 6, padding: '0 16px', borderRadius: 8, border: 'none',
              cursor: selected.length ? 'pointer' : 'not-allowed',
              background: copied ? 'rgba(34,197,94,0.15)' : 'var(--accent-dim)',
              color: copied ? '#4ade80' : 'var(--accent-2)',
              fontSize: 12, fontWeight: 500, flexShrink: 0,
              transition: 'background 0.2s, color 0.2s',
              opacity: selected.length === 0 ? 0.4 : 1,
            }}>
              {copied ? <Check size={14} /> : <Copy size={14} />}
              {copied ? 'Đã copy' : 'Copy'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
