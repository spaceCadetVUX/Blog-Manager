import { useEffect, useState, useCallback, useRef } from 'react'
import { Search, ExternalLink, ChevronUp, ChevronDown, Upload, X, CheckCircle, AlertCircle, Loader, Package, LayoutGrid, List } from 'lucide-react'
import { api } from '../api'

function ImportModal({ onClose, onRefresh }) {
  const [file, setFile]       = useState(null)
  const [status, setStatus]   = useState('idle') // idle | uploading | done | error
  const [result, setResult]   = useState(null)
  const [error, setError]     = useState('')
  const inputRef              = useRef(null)

  const handleFile = (f) => {
    if (!f) return
    if (!f.name.match(/\.html?$/i)) { setError('Chỉ chấp nhận file .html'); return }
    setFile(f); setError('')
  }

  const handleDrop = (e) => {
    e.preventDefault()
    handleFile(e.dataTransfer.files[0])
  }

  const handleImport = async () => {
    if (!file) return
    setStatus('uploading'); setError('')
    try {
      const res = await api.importProducts(file)
      setResult(res); setStatus('done')
      onRefresh?.()
    } catch (e) {
      setError(e?.detail || e?.message || 'Lỗi không xác định')
      setStatus('error')
    }
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 200,
      background: 'rgba(0,0,0,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center',
    }} onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div style={{
        background: 'var(--surface)', border: '1px solid var(--border)',
        borderRadius: 14, width: 420, maxWidth: '92vw', padding: 24,
        display: 'flex', flexDirection: 'column', gap: 16,
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--text)' }}>Cập nhật database sản phẩm</div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-subtle)', display: 'flex', padding: 4 }}>
            <X size={16} />
          </button>
        </div>

        {/* Hướng dẫn */}
        <div style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.6, background: 'var(--bg)', borderRadius: 8, padding: '10px 12px' }}>
          Vào trang Admin knxstore.vn → bỏ hết filter, chọn hiển thị <strong>All</strong> → <kbd style={{ background: 'var(--border)', borderRadius: 3, padding: '1px 4px' }}>Ctrl+S</kbd> lưu file HTML → upload vào đây.
        </div>

        {/* Drop zone */}
        <div
          onDrop={handleDrop}
          onDragOver={e => e.preventDefault()}
          onClick={() => inputRef.current?.click()}
          style={{
            border: `2px dashed ${file ? 'var(--accent)' : 'var(--border)'}`,
            borderRadius: 10, padding: '28px 20px',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
            cursor: 'pointer', transition: 'border-color 0.2s',
            background: file ? 'var(--accent-dim)' : 'var(--bg)',
          }}
        >
          <Upload size={24} color={file ? 'var(--accent-2)' : 'var(--text-subtle)'} strokeWidth={1.5} />
          {file
            ? <span style={{ fontSize: 13, color: 'var(--accent-2)', fontWeight: 500 }}>{file.name}</span>
            : <span style={{ fontSize: 13, color: 'var(--text-subtle)' }}>Kéo thả file HTML hoặc click để chọn</span>
          }
          {file && <span style={{ fontSize: 11, color: 'var(--text-subtle)' }}>{(file.size / 1024).toFixed(0)} KB</span>}
          <input ref={inputRef} type="file" accept=".html,.htm" style={{ display: 'none' }}
            onChange={e => handleFile(e.target.files[0])} />
        </div>

        {/* Result */}
        {status === 'done' && result && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {/* Summary badges */}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <Badge color="#4ade80" label="Mới" count={result.new_count} />
              <Badge color="var(--accent-2)" label="Cập nhật" count={result.updated_count} />
              <Badge color="var(--text-subtle)" label="Không đổi" count={result.unchanged_count} />
              <span style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--text-subtle)', alignSelf: 'center' }}>
                Tổng DB: {result.total_in_db.toLocaleString()}
              </span>
            </div>

            {/* New products */}
            {result.new_count > 0 && (
              <DetailSection title={`${result.new_count} sản phẩm mới`} color="#4ade80">
                {result.new.map(p => (
                  <div key={p.id} style={detailRow}>
                    <span style={{ color: 'var(--accent-2)', fontWeight: 600, flexShrink: 0 }}>#{p.id}</span>
                    <span style={{ color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</span>
                    {p.brand && <span style={{ color: 'var(--text-subtle)', flexShrink: 0 }}>{p.brand}</span>}
                  </div>
                ))}
                {result.new_count > result.new.length && (
                  <div style={{ fontSize: 11, color: 'var(--text-subtle)', padding: '2px 0' }}>...và {result.new_count - result.new.length} sản phẩm khác</div>
                )}
              </DetailSection>
            )}

            {/* Updated products */}
            {result.updated_count > 0 && (
              <DetailSection title={`${result.updated_count} sản phẩm thay đổi`} color="var(--accent-2)">
                {result.updated.map(p => (
                  <div key={p.id} style={{ ...detailRow, flexDirection: 'column', alignItems: 'flex-start', gap: 3 }}>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <span style={{ color: 'var(--accent-2)', fontWeight: 600 }}>#{p.id}</span>
                      <span style={{ color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</span>
                    </div>
                    {Object.entries(p.changes).map(([field, {old: o, new: n}]) => (
                      <div key={field} style={{ fontSize: 10, paddingLeft: 12, color: 'var(--text-muted)', display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                        <span style={{ color: 'var(--text-subtle)' }}>{FIELD_LABELS[field] || field}:</span>
                        <span style={{ textDecoration: 'line-through', color: '#f87171' }}>{String(o || '—')}</span>
                        <span>→</span>
                        <span style={{ color: '#4ade80' }}>{String(n || '—')}</span>
                      </div>
                    ))}
                  </div>
                ))}
                {result.updated_count > result.updated.length && (
                  <div style={{ fontSize: 11, color: 'var(--text-subtle)', padding: '2px 0' }}>...và {result.updated_count - result.updated.length} sản phẩm khác</div>
                )}
              </DetailSection>
            )}

            {result.new_count === 0 && result.updated_count === 0 && (
              <div style={{ fontSize: 12, color: 'var(--text-muted)', textAlign: 'center', padding: '6px 0' }}>
                Không có thay đổi nào — database đã là mới nhất.
              </div>
            )}
          </div>
        )}

        {(status === 'error' || error) && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#f87171', fontSize: 13 }}>
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        {/* Actions */}
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <button onClick={onClose} style={{ ...btnBase, background: 'var(--bg)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}>
            {status === 'done' ? 'Đóng' : 'Hủy'}
          </button>
          {status !== 'done' && (
            <button onClick={handleImport} disabled={!file || status === 'uploading'}
              style={{ ...btnBase, background: 'var(--accent)', color: '#fff', opacity: (!file || status === 'uploading') ? 0.5 : 1, cursor: (!file || status === 'uploading') ? 'not-allowed' : 'pointer' }}>
              {status === 'uploading'
                ? <><Loader size={13} style={{ animation: 'spin 1s linear infinite' }} /> Đang xử lý...</>
                : <><Upload size={13} /> Import</>}
            </button>
          )}
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )
}

const btnBase = {
  display: 'flex', alignItems: 'center', gap: 6,
  padding: '7px 16px', borderRadius: 7, border: 'none',
  fontSize: 12, fontWeight: 500, cursor: 'pointer',
}

const FIELD_LABELS = { name: 'Tên', brand: 'Hãng', price: 'Giá', category: 'Danh mục', url: 'URL' }

const detailRow = {
  display: 'flex', gap: 8, alignItems: 'center', fontSize: 11,
  padding: '3px 0', borderBottom: '1px solid var(--border-2)',
}

function Badge({ color, label, count }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '4px 10px', borderRadius: 20, background: color + '18', border: `1px solid ${color}40` }}>
      <span style={{ fontSize: 13, fontWeight: 700, color }}>{count}</span>
      <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{label}</span>
    </div>
  )
}

function DetailSection({ title, color, children }) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{ border: `1px solid ${color}30`, borderRadius: 8, overflow: 'hidden' }}>
      <button onClick={() => setOpen(v => !v)} style={{
        width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '7px 12px', background: color + '10', border: 'none', cursor: 'pointer',
        fontSize: 12, fontWeight: 600, color,
      }}>
        {title}
        <span style={{ fontSize: 11, fontWeight: 400, color: 'var(--text-subtle)' }}>{open ? '▲ Ẩn' : '▼ Xem'}</span>
      </button>
      {open && (
        <div style={{ padding: '6px 12px', maxHeight: 200, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 2 }}>
          {children}
        </div>
      )}
    </div>
  )
}

function imgCandidates(productUrl) {
  if (!productUrl) return []
  const slug = productUrl.replace(/\/$/, '').split('/products/')[1]
  if (!slug) return []
  const base = `https://knxstore.vn/assets/image/product/${slug}`
  return [`${base}.jpg`, `${base}_1.jpg`]
}

function ProductThumb({ url, size = 36 }) {
  const candidates = imgCandidates(url)
  const [idx, setIdx] = useState(0)
  if (!candidates.length || idx >= candidates.length) return (
    <div style={{ width: size, height: size, borderRadius: 6, background: 'var(--bg)', border: '1px solid var(--border-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <Package size={size * 0.45} color="var(--text-subtle)" strokeWidth={1.5} />
    </div>
  )
  return (
    <img src={candidates[idx]} alt="" loading="lazy" onError={() => setIdx(i => i + 1)}
      style={{ width: size, height: size, objectFit: 'contain', borderRadius: 6, background: 'var(--bg)', border: '1px solid var(--border-2)', flexShrink: 0 }} />
  )
}

function ProductCard({ item, isMobile }) {
  const candidates = imgCandidates(item.url)
  const [idx, setIdx] = useState(0)
  const hasImg = candidates.length > 0 && idx < candidates.length
  return (
    <a href={item.url || '#'} target="_blank" rel="noopener noreferrer"
      style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden', transition: 'border-color 0.15s, transform 0.15s, box-shadow 0.15s', cursor: 'pointer' }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.25)' }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none' }}
    >
      {/* Image area */}
      <div style={{ width: '100%', paddingBottom: '75%', position: 'relative', background: 'var(--bg)', borderBottom: '1px solid var(--border-2)' }}>
        {hasImg
          ? <img src={candidates[idx]} alt={item.name} loading="lazy" onError={() => setIdx(i => i + 1)}
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'contain', padding: 10 }} />
          : <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Package size={36} color="var(--border)" strokeWidth={1.2} />
            </div>
        }
        {/* ID badge */}
        <span style={{ position: 'absolute', top: 7, left: 7, background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)', color: 'var(--accent-2)', fontSize: 9, fontWeight: 700, padding: '2px 6px', borderRadius: 4 }}>
          #{item.id}
        </span>
      </div>

      {/* Info */}
      <div style={{ padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: 5, flex: 1 }}>
        <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--text)', lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {item.name}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6, marginTop: 'auto' }}>
          {item.brand
            ? <span style={{ background: 'var(--accent-dim)', color: 'var(--accent-2)', borderRadius: 4, padding: '2px 7px', fontSize: 10, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '55%' }}>{item.brand}</span>
            : <span />}
          {item.price > 0
            ? <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--accent-2)', whiteSpace: 'nowrap' }}>{item.price.toLocaleString('vi-VN')}₫</span>
            : <span style={{ fontSize: 11, color: 'var(--text-subtle)' }}>Liên hệ</span>}
        </div>
        {item.category && (
          <div style={{ fontSize: 10, color: 'var(--text-subtle)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.category}</div>
        )}
      </div>
    </a>
  )
}

function PriceTag({ price }) {
  if (!price) return <span style={{ color: 'var(--text-subtle)', fontSize: 11 }}>—</span>
  return (
    <span style={{ fontVariantNumeric: 'tabular-nums', fontSize: 12, color: 'var(--accent-2)', fontWeight: 500 }}>
      {price.toLocaleString('vi-VN')}₫
    </span>
  )
}

function SortBtn({ col, current, dir, onSort }) {
  const active = current === col
  return (
    <button onClick={() => onSort(col)} style={{
      background: 'none', border: 'none', cursor: 'pointer', padding: 0,
      display: 'inline-flex', alignItems: 'center', gap: 3,
      color: active ? 'var(--accent-2)' : 'var(--text-muted)', fontSize: 11, fontWeight: active ? 600 : 400,
    }}>
      {col === 'name' ? 'Tên' : col === 'brand' ? 'Hãng' : col === 'price' ? 'Giá' : col === 'category' ? 'Danh mục' : col}
      {active
        ? (dir === 'asc' ? <ChevronUp size={11} /> : <ChevronDown size={11} />)
        : <ChevronDown size={11} style={{ opacity: 0.3 }} />}
    </button>
  )
}

export default function ProductsView({ bp = 'desktop' }) {
  const isMobile = bp === 'mobile'

  const [items, setItems]       = useState([])
  const [total, setTotal]       = useState(0)
  const [loading, setLoading]   = useState(true)
  const [search, setSearch]     = useState('')
  const [brand, setBrand]       = useState('')
  const [category, setCategory] = useState('')
  const [sortKey, setSortKey]   = useState('id')
  const [sortDir, setSortDir]   = useState('desc')
  const [page, setPage]         = useState(0)
  const [brands, setBrands]     = useState([])
  const [categories, setCategories] = useState([])
  const [showImport, setShowImport] = useState(false)
  const [viewMode, setViewMode]     = useState('card') // 'card' | 'table'

  const PAGE_SIZE = 50

  useEffect(() => {
    api.productBrands().then(setBrands).catch(console.error)
    api.productCategories().then(setCategories).catch(console.error)
  }, [])

  const fetch = useCallback(() => {
    setLoading(true)
    api.products({ search, brand, category, sort: sortKey, dir: sortDir, page, limit: PAGE_SIZE })
      .then(r => { setItems(r.items); setTotal(r.total) })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [search, brand, category, sortKey, sortDir, page])

  useEffect(() => { fetch() }, [fetch])
  useEffect(() => { setPage(0) }, [search, brand, category, sortKey, sortDir])

  const handleSort = (col) => {
    if (col === sortKey) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortKey(col); setSortDir('asc') }
  }

  const totalPages = Math.ceil(total / PAGE_SIZE)

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: 'var(--bg)' }}>

      {/* Toolbar */}
      <div style={{
        padding: isMobile ? '10px 12px' : '12px 20px',
        borderBottom: '1px solid var(--border)',
        background: 'var(--surface)',
        display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center',
        flexShrink: 0,
      }}>
        {/* Search */}
        <div style={{ position: 'relative', flexGrow: 1, minWidth: 160, maxWidth: 300 }}>
          <Search size={13} style={{ position: 'absolute', left: 9, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-subtle)', pointerEvents: 'none' }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Tìm tên / hãng..."
            style={{
              width: '100%', boxSizing: 'border-box',
              background: 'var(--bg)', border: '1px solid var(--border)',
              borderRadius: 7, padding: '6px 10px 6px 28px',
              fontSize: 12, color: 'var(--text)', outline: 'none',
            }}
          />
        </div>

        {/* Brand filter */}
        <select value={brand} onChange={e => setBrand(e.target.value)} style={selectStyle}>
          <option value="">Tất cả hãng</option>
          {brands.map(b => <option key={b} value={b}>{b}</option>)}
        </select>

        {/* Category filter */}
        <select value={category} onChange={e => setCategory(e.target.value)} style={selectStyle}>
          <option value="">Tất cả danh mục</option>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>

        <span style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--text-subtle)', whiteSpace: 'nowrap' }}>
          {loading ? '...' : `${total.toLocaleString()} sản phẩm`}
        </span>

        {/* View toggle */}
        <div style={{ display: 'flex', border: '1px solid var(--border)', borderRadius: 7, overflow: 'hidden', flexShrink: 0 }}>
          {[['card', LayoutGrid], ['table', List]].map(([mode, Icon]) => (
            <button key={mode} onClick={() => setViewMode(mode)} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: 30, height: 28, background: viewMode === mode ? 'var(--accent-dim)' : 'transparent',
              border: 'none', cursor: 'pointer',
              color: viewMode === mode ? 'var(--accent-2)' : 'var(--text-subtle)',
              transition: 'background 0.15s, color 0.15s',
            }}>
              <Icon size={13} />
            </button>
          ))}
        </div>

        <button onClick={() => setShowImport(true)} style={{
          display: 'flex', alignItems: 'center', gap: 5,
          padding: '5px 12px', borderRadius: 7, border: '1px solid var(--border)',
          background: 'var(--bg)', color: 'var(--text-muted)', fontSize: 12, cursor: 'pointer',
          flexShrink: 0,
        }}
          onMouseEnter={e => { e.currentTarget.style.color = 'var(--accent-2)'; e.currentTarget.style.borderColor = 'var(--accent)' }}
          onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.borderColor = 'var(--border)' }}
        >
          <Upload size={12} />
          {!isMobile && 'Cập nhật DB'}
        </button>
      </div>

      {showImport && (
        <ImportModal
          onClose={() => setShowImport(false)}
          onRefresh={() => {
            api.productBrands().then(setBrands).catch(console.error)
            api.productCategories().then(setCategories).catch(console.error)
            fetch()
          }}
        />
      )}

      {/* Card grid */}
      {viewMode === 'card' && (
        <div style={{ flex: 1, overflow: 'auto', padding: isMobile ? 10 : 16 }}>
          {loading && (
            <div style={{ textAlign: 'center', padding: 60, color: 'var(--text-subtle)' }}>Đang tải...</div>
          )}
          {!loading && items.length === 0 && (
            <div style={{ textAlign: 'center', padding: 60, color: 'var(--text-subtle)' }}>Không tìm thấy sản phẩm</div>
          )}
          <div style={{ display: 'grid', gridTemplateColumns: `repeat(auto-fill, minmax(${isMobile ? 140 : 180}px, 1fr))`, gap: isMobile ? 10 : 14 }}>
            {items.map(item => <ProductCard key={item.id} item={item} isMobile={isMobile} />)}
          </div>
        </div>
      )}

      {/* Table */}
      {viewMode === 'table' && <div style={{ flex: 1, overflow: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
          <thead>
            <tr style={{ background: 'var(--surface)', position: 'sticky', top: 0, zIndex: 1 }}>
              <th style={{ ...th, width: 44 }}></th>
              {!isMobile && <th style={th}><SortBtn col="id" current={sortKey} dir={sortDir} onSort={handleSort} /></th>}
              <th style={{ ...th, textAlign: 'left', minWidth: 200 }}><SortBtn col="name" current={sortKey} dir={sortDir} onSort={handleSort} /></th>
              <th style={th}><SortBtn col="brand" current={sortKey} dir={sortDir} onSort={handleSort} /></th>
              {!isMobile && <th style={th}><SortBtn col="category" current={sortKey} dir={sortDir} onSort={handleSort} /></th>}
              <th style={th}><SortBtn col="price" current={sortKey} dir={sortDir} onSort={handleSort} /></th>
              <th style={th}>Link</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr><td colSpan={isMobile ? 5 : 7} style={{ textAlign: 'center', padding: 40, color: 'var(--text-subtle)' }}>Đang tải...</td></tr>
            )}
            {!loading && items.length === 0 && (
              <tr><td colSpan={isMobile ? 5 : 7} style={{ textAlign: 'center', padding: 40, color: 'var(--text-subtle)' }}>Không tìm thấy sản phẩm</td></tr>
            )}
            {items.map((item, i) => (
              <tr key={item.id}
                style={{ borderBottom: '1px solid var(--border)', background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)' }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--accent-dim)'}
                onMouseLeave={e => e.currentTarget.style.background = i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)'}
              >
                <td style={{ ...td, width: 44, padding: '5px 6px 5px 10px' }}>
                  <ProductThumb url={item.url} size={34} />
                </td>
                {!isMobile && <td style={{ ...td, color: 'var(--text-subtle)', width: 48 }}>{item.id}</td>}
                <td style={{ ...td, maxWidth: isMobile ? 160 : 340 }}>
                  <span style={{ display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: 'var(--text)' }} title={item.name}>
                    {item.name}
                  </span>
                </td>
                <td style={{ ...td, textAlign: 'center' }}>
                  {item.brand
                    ? <span style={{ background: 'var(--accent-dim)', color: 'var(--accent-2)', borderRadius: 4, padding: '1px 6px', fontSize: 10, fontWeight: 500, whiteSpace: 'nowrap' }}>{item.brand}</span>
                    : <span style={{ color: 'var(--text-subtle)' }}>—</span>}
                </td>
                {!isMobile && (
                  <td style={{ ...td, maxWidth: 180 }}>
                    <span style={{ display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: 'var(--text-muted)', fontSize: 11 }} title={item.category}>
                      {item.category || '—'}
                    </span>
                  </td>
                )}
                <td style={{ ...td, textAlign: 'right', whiteSpace: 'nowrap' }}>
                  <PriceTag price={item.price} />
                </td>
                <td style={{ ...td, textAlign: 'center', width: 36 }}>
                  {item.url && (
                    <a href={item.url} target="_blank" rel="noopener noreferrer"
                      style={{ color: 'var(--text-subtle)', display: 'inline-flex', alignItems: 'center' }}
                      onMouseEnter={e => e.currentTarget.style.color = 'var(--accent-2)'}
                      onMouseLeave={e => e.currentTarget.style.color = 'var(--text-subtle)'}
                    >
                      <ExternalLink size={13} />
                    </a>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>}

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{
          padding: '8px 20px', borderTop: '1px solid var(--border)',
          background: 'var(--surface)', display: 'flex', alignItems: 'center',
          gap: 8, flexShrink: 0,
        }}>
          <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0} style={pageBtn}>‹ Trước</button>
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
            Trang {page + 1} / {totalPages}
          </span>
          <button onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1} style={pageBtn}>Sau ›</button>
        </div>
      )}
    </div>
  )
}

const selectStyle = {
  background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 7,
  padding: '5px 8px', fontSize: 12, color: 'var(--text)', cursor: 'pointer', outline: 'none',
}

const th = {
  padding: '8px 10px', textAlign: 'center', borderBottom: '1px solid var(--border)',
  color: 'var(--text-subtle)', fontWeight: 500,
}

const td = {
  padding: '7px 10px', verticalAlign: 'middle',
}

const pageBtn = {
  background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 6,
  padding: '4px 12px', fontSize: 12, color: 'var(--text-muted)', cursor: 'pointer',
}
