import { useEffect, useState, useCallback, useRef } from 'react'
import { Search, ExternalLink, ChevronUp, ChevronDown, Upload, X, CheckCircle, AlertCircle, Loader, Package, LayoutGrid, List, RefreshCw, Network } from 'lucide-react'
import { api } from '../api'
import CrawlModal from './CrawlModal'

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

// ── Đồng bộ liên kết sản phẩm: nạp bundle từ MCP (job nền, ~5-7 phút) + tính lại "hay đi cùng" (nhanh) ──
function LinksSyncModal({ onClose, onRefresh }) {
  const [status, setStatus] = useState('idle') // idle | running | done | error
  const [job, setJob]       = useState(null)
  const [error, setError]   = useState('')
  const [co, setCo]         = useState(null)
  const [coBusy, setCoBusy] = useState(false)
  const timer = useRef(null)
  const alive = useRef(true)

  useEffect(() => () => { alive.current = false; clearTimeout(timer.current) }, [])

  const friendly = e => {
    const m = e?.message || ''
    if (m.startsWith('409')) return 'Đang có job khác chạy — chờ xong rồi thử lại.'
    return m || 'Lỗi không xác định'
  }

  const poll = async (jobId) => {
    try {
      const j = await api.linksSyncStatus(jobId)
      if (!alive.current) return
      setJob(j)
      if (j.status === 'done') { setStatus('done'); onRefresh?.(); return }
      if (j.status === 'error') { setStatus('error'); setError(j.error || 'Job lỗi'); return }
      timer.current = setTimeout(() => poll(jobId), 2000)
    } catch (e) {
      if (!alive.current) return
      setStatus('error'); setError(friendly(e))
    }
  }

  const run = async () => {
    setStatus('running'); setError(''); setJob(null)
    try {
      const { job_id } = await api.linksSyncStart()
      poll(job_id)
    } catch (e) {
      setStatus('error'); setError(friendly(e))
    }
  }

  const rebuild = async () => {
    setCoBusy(true); setError('')
    try { setCo(await api.linksRebuild()); onRefresh?.() }
    catch (e) { setError(friendly(e)) }
    finally { setCoBusy(false) }
  }

  const running = status === 'running'
  const pct = job && job.total > 0 ? Math.min(100, Math.round((job.done / job.total) * 100)) : 0
  const r = job?.result

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 200,
      background: 'rgba(0,0,0,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center',
    }} onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div style={{
        background: 'var(--surface)', border: '1px solid var(--border)',
        borderRadius: 14, width: 480, maxWidth: '92vw', padding: 24,
        display: 'flex', flexDirection: 'column', gap: 16,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--text)' }}>Đồng bộ liên kết sản phẩm</div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-subtle)', display: 'flex', padding: 4 }}>
            <X size={16} />
          </button>
        </div>

        <div style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.6, background: 'var(--bg)', borderRadius: 8, padding: '10px 12px' }}>
          <strong style={{ color: '#e879f9' }}>Bundle</strong>: lấy combo/mua kèm từ MCP cho từng sản phẩm đang bán (gọi tuần tự, khoảng 5–7 phút).
          Job chạy nền — đóng cửa sổ này không dừng job. Lỗi giữa chừng thì không ghi dở.
          <br />
          <strong style={{ color: '#2dd4bf' }}>Hay đi cùng</strong>: tính từ các bài viết (không gọi MCP, tính nhanh) — tự chạy lại sau mỗi lần đồng bộ sản phẩm.
        </div>

        {(running || (job && status !== 'idle')) && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div style={{ height: 6, borderRadius: 3, background: 'var(--bg)', overflow: 'hidden' }}>
              <div style={{ width: `${status === 'done' ? 100 : pct}%`, height: '100%', background: '#e879f9', transition: 'width 0.4s' }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--text-subtle)' }}>
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '70%' }}>
                {status === 'done' ? 'Hoàn tất' : job?.status === 'writing' ? 'Đang ghi vào DB…' : (job?.current || 'Đang khởi động…')}
              </span>
              <span>{job ? `${job.done}/${job.total}` : ''}{job?.failed > 0 ? ` · lỗi ${job.failed}` : ''}</span>
            </div>
          </div>
        )}

        {status === 'done' && r && (
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <Badge color="#e879f9" label="Sản phẩm có bundle" count={r.products_with_bundle} />
            <Badge color="#e879f9" label="Cặp bundle" count={r.pairs} />
            <Badge color="#fbbf24" label="Không khớp" count={r.unmatched_count} />
            <Badge color="#f87171" label="Lỗi tải" count={r.failed} />
            {r.diff && <span style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--text-subtle)', alignSelf: 'center' }}>
              +{r.diff.added} · −{r.diff.removed} · ~{r.diff.updated}
            </span>}
          </div>
        )}

        {co && (
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
            <Badge color="#2dd4bf" label="Cặp hay đi cùng" count={co.pairs} />
            <Badge color="#2dd4bf" label="Sản phẩm được nhắc" count={co.products_mentioned} />
            <span style={{ fontSize: 11, color: 'var(--text-subtle)' }}>
              {co.diff ? `+${co.diff.added} · −${co.diff.removed} · ~${co.diff.updated}` : ''}{co.max_weight ? ` · weight tối đa ${co.max_weight}` : ''}
            </span>
          </div>
        )}

        {error && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#f87171', fontSize: 13 }}>
            <AlertCircle size={16} /> {error}
          </div>
        )}

        <div style={{ display: 'flex', gap: 8, justifyContent: 'space-between', flexWrap: 'wrap' }}>
          <button onClick={rebuild} disabled={coBusy || running}
            style={{ ...btnBase, background: 'var(--bg)', color: '#2dd4bf', border: '1px solid var(--border)', opacity: (coBusy || running) ? 0.5 : 1, cursor: (coBusy || running) ? 'not-allowed' : 'pointer' }}>
            {coBusy ? <><Loader size={13} style={{ animation: 'spin 1s linear infinite' }} /> Đang tính…</> : <><RefreshCw size={13} /> Tính lại "hay đi cùng"</>}
          </button>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={onClose} style={{ ...btnBase, background: 'var(--bg)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}>
              {status === 'done' ? 'Đóng' : running ? 'Đóng (job vẫn chạy)' : 'Hủy'}
            </button>
            {!running && (
              <button onClick={run} style={{ ...btnBase, background: 'var(--accent)', color: '#fff', cursor: 'pointer' }}>
                <RefreshCw size={13} /> {status === 'done' ? 'Chạy lại bundle' : 'Đồng bộ bundle'}
              </button>
            )}
            {running && (
              <button disabled style={{ ...btnBase, background: 'var(--accent)', color: '#fff', opacity: 0.5, cursor: 'not-allowed' }}>
                <Loader size={13} style={{ animation: 'spin 1s linear infinite' }} /> Đang chạy…
              </button>
            )}
          </div>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )
}

// ── Liên kết sản phẩm ↔ sản phẩm: bundle (MCP) + hay đi cùng (cùng được nhắc trong một bài) + bài nhắc ──
function LinkSection({ title, color, count, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, fontWeight: 600, color }}>
        {title}
        <span style={{ fontSize: 11, fontWeight: 400, color: 'var(--text-subtle)' }}>{count}</span>
      </div>
      {children}
    </div>
  )
}

function LinkProductRow({ p, onOpen, right }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '5px 0', borderBottom: '1px solid var(--border-2)' }}>
      <ProductThumb url={p.url} size={30} />
      <button onClick={() => onOpen(p.id)} title="Xem liên kết của sản phẩm này"
        style={{ flex: 1, minWidth: 0, background: 'none', border: 'none', padding: 0, textAlign: 'left', cursor: 'pointer' }}>
        <div style={{ fontSize: 12, color: p.status === 'not_on_site' ? 'var(--text-subtle)' : 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</div>
        <div style={{ fontSize: 10, color: 'var(--text-subtle)' }}>
          {[p.brand, p.sku, p.status === 'not_on_site' ? 'không còn trên site' : ''].filter(Boolean).join(' · ')}
        </div>
      </button>
      {right}
    </div>
  )
}

function CoMentionedRow({ item, onOpen }) {
  const [open, setOpen] = useState(false)
  return (
    <div>
      <LinkProductRow p={item.product} onOpen={onOpen} right={
        <button onClick={() => setOpen(v => !v)} title="Các bài cùng nhắc hai sản phẩm"
          style={{ flexShrink: 0, background: 'rgba(45,212,191,0.12)', border: '1px solid rgba(45,212,191,0.35)', color: '#2dd4bf', borderRadius: 12, padding: '1px 8px', fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>
          {item.weight} bài {open ? '▲' : '▼'}
        </button>
      } />
      {open && (
        <div style={{ padding: '4px 0 6px 40px', display: 'flex', flexDirection: 'column', gap: 2 }}>
          {item.posts.map(sl => (
            <a key={sl} href={`https://knxstore.vn/${sl}.html`} target="_blank" rel="noopener noreferrer"
              style={{ fontSize: 11, color: 'var(--text-muted)', textDecoration: 'none', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{sl}</a>
          ))}
        </div>
      )}
    </div>
  )
}

function LinksModal({ productId, onClose, onOpen }) {
  const [data, setData]         = useState(null)
  const [error, setError]       = useState('')
  const [minWeight, setMinWeight] = useState(1)

  // Parent đặt key={productId} nên đổi sản phẩm = mount mới (state sạch); đổi ngưỡng weight thì giữ dữ liệu cũ tới khi có mới
  useEffect(() => {
    let alive = true
    api.productLinks(productId, { min_weight: minWeight, limit: 200 })
      .then(d => { if (alive) { setData(d); setError('') } })
      .catch(e => { if (alive) setError(e?.message || 'Lỗi không xác định') })
    return () => { alive = false }
  }, [productId, minWeight])

  const p = data?.product
  const empty = <div style={{ fontSize: 11, color: 'var(--text-subtle)', padding: '2px 0' }}>Không có.</div>

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(0,0,0,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, width: 560, maxWidth: '94vw', maxHeight: '88vh', padding: 22, display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 }}>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 10, color: 'var(--text-subtle)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Liên kết sản phẩm</div>
            <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--text)', lineHeight: 1.4 }}>{p ? p.name : '...'}</div>
            {p && (
              <div style={{ fontSize: 11, color: 'var(--text-subtle)', marginTop: 2 }}>
                {p.id < 1000000 ? `ID cũ ${p.id}` : 'không có ID cũ'}{p.site_id ? ` · ID site ${p.site_id}` : ''}{p.sku ? ` · ${p.sku}` : ''}
                {p.url && <> · <a href={p.url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-2)', textDecoration: 'none' }}>Mở trang ↗</a></>}
              </div>
            )}
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-subtle)', display: 'flex', padding: 4, flexShrink: 0 }}>
            <X size={16} />
          </button>
        </div>

        <div style={{ overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 16, paddingRight: 2 }}>
          {!data && !error && <div style={{ textAlign: 'center', padding: 30, color: 'var(--text-subtle)', fontSize: 12 }}>Đang tải...</div>}
          {error && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#f87171', fontSize: 13 }}><AlertCircle size={16} />{error}</div>
          )}
          {data && <>
            <LinkSection title="Bundle (mua kèm)" color="#e879f9" count={data.bundle.length}>
              {data.bundle.length ? data.bundle.map(b => <LinkProductRow key={b.id} p={b} onOpen={onOpen} />) : empty}
            </LinkSection>

            {data.bundled_in.length > 0 && (
              <LinkSection title="Nằm trong bundle của" color="#e879f9" count={data.bundled_in.length}>
                {data.bundled_in.map(b => <LinkProductRow key={b.id} p={b} onOpen={onOpen} />)}
              </LinkSection>
            )}

            <LinkSection title="Hay đi cùng (cùng được nhắc trong bài)" color="#2dd4bf"
              count={data.co_mentioned_total > data.co_mentioned.length ? `${data.co_mentioned.length}/${data.co_mentioned_total}` : data.co_mentioned_total}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--text-subtle)' }}>
                Chỉ hiện cặp từ
                <select value={minWeight} onChange={e => setMinWeight(parseInt(e.target.value))} style={{ ...selectStyle, padding: '2px 6px', fontSize: 11 }}>
                  {[1, 2, 3, 5, 8].map(n => <option key={n} value={n}>{n}</option>)}
                </select>
                bài chung trở lên
              </div>
              {data.co_mentioned.length ? data.co_mentioned.map(c => <CoMentionedRow key={c.product.id} item={c} onOpen={onOpen} />) : empty}
            </LinkSection>

            <LinkSection title="Được nhắc ở bài" color="#f97316" count={data.mentioned_in.length}>
              {data.mentioned_in.length ? data.mentioned_in.map(post => (
                <a key={post.slug} href={post.url || `https://knxstore.vn/${post.slug}.html`} target="_blank" rel="noopener noreferrer"
                  style={{ fontSize: 12, color: 'var(--text)', textDecoration: 'none', padding: '4px 0', borderBottom: '1px solid var(--border-2)', display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{post.headline}</span>
                  <ExternalLink size={11} color="var(--text-subtle)" style={{ flexShrink: 0, marginTop: 2 }} />
                </a>
              )) : <div style={{ fontSize: 11, color: '#fbbf24', padding: '2px 0' }}>Chưa có bài nào nhắc sản phẩm này.</div>}
            </LinkSection>
          </>}
        </div>
      </div>
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

function ProductCard({ item, isMobile, onLinks }) {
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
        <span title={item.site_id ? `ID cũ ${item.id} · ID site ${item.site_id}` : `ID cũ ${item.id}`} style={{ position: 'absolute', top: 7, left: 7, background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)', color: 'var(--accent-2)', fontSize: 9, fontWeight: 700, padding: '2px 6px', borderRadius: 4 }}>
          #{item.id < 1000000 ? item.id : `s${item.site_id}`}
        </span>
        {item.status === 'not_on_site' && (
          <span style={{ position: 'absolute', top: 7, right: 7, background: 'rgba(248,113,113,0.85)', color: '#fff', fontSize: 9, fontWeight: 600, padding: '2px 6px', borderRadius: 4 }}>không còn trên site</span>
        )}
        <button onClick={e => { e.preventDefault(); e.stopPropagation(); onLinks?.(item.id) }} title="Liên kết sản phẩm: bundle, hay đi cùng, bài nhắc"
          style={{ position: 'absolute', right: 7, bottom: 7, width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)', border: 'none', borderRadius: 5, color: 'var(--accent-2)', cursor: 'pointer' }}>
          <Network size={13} />
        </button>
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
        <div style={{ fontSize: 10, color: item.mentioned_in_count ? 'var(--text-subtle)' : '#fbbf24', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
          title="Số bài nhắc · số sản phẩm trong bundle · số sản phẩm hay đi cùng">
          {item.mentioned_in_count || 0} bài{item.bundle_count > 0 ? ` · ${item.bundle_count} bundle` : ''}{item.co_mentioned_count > 0 ? ` · ${item.co_mentioned_count} cùng bài` : ''}
        </div>
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
  const [showSync, setShowSync]     = useState(false)
  const [showLinksSync, setShowLinksSync] = useState(false)
  const [viewMode, setViewMode]     = useState('card') // 'card' | 'table'
  const [unmentioned, setUnmentioned] = useState(false)   // chỉ sản phẩm đang bán mà chưa bài nào nhắc
  const [hasBundle, setHasBundle]     = useState(false)   // chỉ sản phẩm có bundle
  const [linksId, setLinksId]         = useState(null)    // sản phẩm đang xem ở LinksModal

  const PAGE_SIZE = 50

  useEffect(() => {
    api.productBrands().then(setBrands).catch(console.error)
    api.productCategories().then(setCategories).catch(console.error)
  }, [])

  const fetch = useCallback(() => {
    setLoading(true)
    const params = { search, brand, category, sort: sortKey, dir: sortDir, page, limit: PAGE_SIZE }
    if (unmentioned) params.mentioned = 'none'
    if (hasBundle) params.has_bundle = 1
    api.products(params)
      .then(r => { setItems(r.items); setTotal(r.total) })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [search, brand, category, sortKey, sortDir, page, unmentioned, hasBundle])

  useEffect(() => { fetch() }, [fetch])
  useEffect(() => { setPage(0) }, [search, brand, category, sortKey, sortDir, unmentioned, hasBundle])

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

        {/* Liên kết sản phẩm: lọc nhanh */}
        {[[unmentioned, setUnmentioned, 'Chưa có bài nhắc', 'Sản phẩm đang bán mà chưa bài viết nào nhắc'],
          [hasBundle, setHasBundle, 'Có bundle', 'Sản phẩm có bundle (mua kèm) trên CMS']].map(([on, set, label, tip]) => (
          <button key={label} onClick={() => set(v => !v)} title={tip} style={{
            padding: '5px 10px', borderRadius: 7, fontSize: 12, cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0,
            border: `1px solid ${on ? 'var(--accent)' : 'var(--border)'}`,
            background: on ? 'var(--accent-dim)' : 'var(--bg)',
            color: on ? 'var(--accent-2)' : 'var(--text-muted)', fontWeight: on ? 600 : 400,
          }}>{label}</button>
        ))}

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

        <button onClick={() => setShowSync(true)} title="Crawl sản phẩm từ MCP knxstore.vn (chỉ cập nhật mới / ghi đè toàn bộ)" style={{
          display: 'flex', alignItems: 'center', gap: 5,
          padding: '5px 12px', borderRadius: 7, border: '1px solid var(--border)',
          background: 'var(--bg)', color: 'var(--text-muted)', fontSize: 12, cursor: 'pointer',
          flexShrink: 0,
        }}
          onMouseEnter={e => { e.currentTarget.style.color = 'var(--accent-2)'; e.currentTarget.style.borderColor = 'var(--accent)' }}
          onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.borderColor = 'var(--border)' }}
        >
          <RefreshCw size={12} />
          {!isMobile && 'Đồng bộ MCP'}
        </button>

        <button onClick={() => setShowLinksSync(true)} title="Đồng bộ liên kết sản phẩm: bundle (MCP) + hay đi cùng" style={{
          display: 'flex', alignItems: 'center', gap: 5,
          padding: '5px 12px', borderRadius: 7, border: '1px solid var(--border)',
          background: 'var(--bg)', color: 'var(--text-muted)', fontSize: 12, cursor: 'pointer',
          flexShrink: 0,
        }}
          onMouseEnter={e => { e.currentTarget.style.color = '#e879f9'; e.currentTarget.style.borderColor = '#e879f9' }}
          onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.borderColor = 'var(--border)' }}
        >
          <Network size={12} />
          {!isMobile && 'Đồng bộ liên kết'}
        </button>

        <button onClick={() => setShowImport(true)} title="Legacy: import file Admin.html (ID cũ)" style={{
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

      {showSync && (
        // Đồng bộ MCP = crawl sản phẩm (tab "Sản phẩm" của modal Crawl): 2 kiểu "Chỉ cập nhật mới" | "Ghi đè toàn bộ", job nền có tiến độ
        <CrawlModal
          initialTab="products"
          bp={bp}
          onClose={() => setShowSync(false)}
          onDone={kind => {
            if (kind !== 'products') return
            api.productBrands().then(setBrands).catch(console.error)
            api.productCategories().then(setCategories).catch(console.error)
            fetch()
          }}
        />
      )}

      {showLinksSync && (
        <LinksSyncModal
          onClose={() => setShowLinksSync(false)}
          onRefresh={() => fetch()}
        />
      )}

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

      {linksId != null && (
        <LinksModal key={linksId} productId={linksId} onClose={() => setLinksId(null)} onOpen={setLinksId} />
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
            {items.map(item => <ProductCard key={item.id} item={item} isMobile={isMobile} onLinks={setLinksId} />)}
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
              {!isMobile && <th style={th} title="Số bài viết nhắc sản phẩm này">Bài nhắc</th>}
              {!isMobile && <th style={th} title="Số sản phẩm trong bundle · số sản phẩm hay đi cùng (cùng được nhắc trong một bài)">Bundle · Cùng bài</th>}
              <th style={th}>Link</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr><td colSpan={isMobile ? 5 : 9} style={{ textAlign: 'center', padding: 40, color: 'var(--text-subtle)' }}>Đang tải...</td></tr>
            )}
            {!loading && items.length === 0 && (
              <tr><td colSpan={isMobile ? 5 : 9} style={{ textAlign: 'center', padding: 40, color: 'var(--text-subtle)' }}>Không tìm thấy sản phẩm</td></tr>
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
                {!isMobile && <td style={{ ...td, color: 'var(--text-subtle)', width: 48 }} title={item.site_id ? `ID site ${item.site_id}` : ''}>{item.id < 1000000 ? item.id : `s${item.site_id}`}</td>}
                <td style={{ ...td, maxWidth: isMobile ? 160 : 340 }}>
                  <span style={{ display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: item.status === 'not_on_site' ? 'var(--text-subtle)' : 'var(--text)' }} title={item.status === 'not_on_site' ? `${item.name} — không còn trên site` : item.name}>
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
                {!isMobile && (
                  <td style={{ ...td, textAlign: 'center', fontVariantNumeric: 'tabular-nums', color: item.mentioned_in_count ? 'var(--text-muted)' : '#fbbf24' }}>
                    {item.mentioned_in_count || 0}
                  </td>
                )}
                {!isMobile && (
                  <td style={{ ...td, textAlign: 'center', fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' }}>
                    <button onClick={() => setLinksId(item.id)} title="Xem liên kết sản phẩm"
                      style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, color: (item.bundle_count || item.co_mentioned_count) ? '#2dd4bf' : 'var(--text-subtle)' }}>
                      {item.bundle_count || 0} · {item.co_mentioned_count || 0}
                    </button>
                  </td>
                )}
                <td style={{ ...td, textAlign: 'center', width: isMobile ? 62 : 36, whiteSpace: 'nowrap' }}>
                  {isMobile && (
                    <button onClick={() => setLinksId(item.id)} title="Liên kết sản phẩm"
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-subtle)', padding: '0 6px 0 0', verticalAlign: 'middle' }}>
                      <Network size={13} />
                    </button>
                  )}
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
