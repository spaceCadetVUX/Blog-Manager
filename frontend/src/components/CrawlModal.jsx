import { useState, useEffect, useRef } from 'react'
import { X, RefreshCw, CheckCircle, AlertCircle, Loader } from 'lucide-react'
import { api } from '../api'
import ProgressBar from './ProgressBar'

// Crawl = hai việc riêng, mỗi việc có 2 kiểu chạy:
//   Bài viết : "Chỉ cập nhật mới" (incremental) | "Ghi đè toàn bộ" (full)   (+ tùy chọn phụ: chỉ làm mới "Bài viết liên quan")
//   Sản phẩm : "Chỉ cập nhật mới" (new)         | "Ghi đè toàn bộ" (full)   (sync từ MCP, job nền có tiến độ)
// Đóng modal KHÔNG dừng job: id job được nhớ trong localStorage, mở lại sẽ nối tiếp tiến độ / hiện kết quả.

const DEFAULT_SITEMAP = 'https://knxstore.vn/sitemaps/posts.xml'
const LS_KEYS = { posts: 'knx_job_posts', products: 'knx_job_products' }

function lsGet(key) {
  try { return localStorage.getItem(key) } catch { return null }
}
function lsSet(key, val) {
  try { if (val == null) localStorage.removeItem(key); else localStorage.setItem(key, val) } catch { /* localStorage không khả dụng */ }
}

const isFinal = j => j?.status === 'done' || j?.status === 'error'

function friendlyErr(e) {
  if (e?.status === 409) return 'Đang có job khác chạy (crawl bài / bundle / đồng bộ sản phẩm) — chờ xong rồi thử lại.'
  return e?.message || 'Lỗi không xác định'
}

// GET /crawl/{id} trả 200 + {"error": "Job not found"} khi backend đã khởi động lại → quy về 404 cho useJob.
async function fetchCrawlStatus(id) {
  const data = await api.crawlStatus(id)
  if (data?.error && !data.status) { const e = new Error('404 job'); e.status = 404; throw e }
  return data
}

// Theo dõi một job nền: nhớ job_id (localStorage), poll 2s tới khi done/error, 404 (backend khởi động lại) → bỏ job.
function useJob(storageKey, fetchStatus, onFinished) {
  const [jobId, setJobId] = useState(() => lsGet(storageKey))
  const [job, setJob] = useState(null)
  const finishedRef = useRef(onFinished)
  useEffect(() => { finishedRef.current = onFinished })

  useEffect(() => {
    if (!jobId) return undefined
    let stop = false
    let timer = null
    const tick = async () => {
      try {
        const data = await fetchStatus(jobId)
        if (stop) return
        setJob(data)
        if (isFinal(data)) { finishedRef.current?.(data); return }
      } catch (e) {
        if (stop) return
        if (e?.status === 404) { lsSet(storageKey, null); setJobId(null); setJob(null); return }
        // lỗi mạng tạm thời: thử lại ở nhịp sau
      }
      timer = setTimeout(tick, 2000)
    }
    tick()
    return () => { stop = true; clearTimeout(timer) }
  }, [jobId, fetchStatus, storageKey])

  const start = id => { lsSet(storageKey, id); setJob(null); setJobId(id) }
  const dismiss = () => { lsSet(storageKey, null); setJob(null); setJobId(null) }
  return { jobId, job, start, dismiss, active: !!jobId && !isFinal(job) }
}

// ── Thành phần dùng chung ───────────────────────────────────────────────────

const labelStyle = { fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: 8 }

function OptionCard({ active, disabled, onClick, label, desc, isMobile }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        flex: 1, padding: isMobile ? '10px 10px' : '10px 12px', borderRadius: 8, cursor: disabled ? 'default' : 'pointer',
        border: active ? '1px solid var(--accent)' : '1px solid var(--border)',
        background: active ? 'var(--accent-dim)' : 'var(--surface-2)',
        textAlign: 'left', opacity: disabled ? 0.6 : 1,
      }}
    >
      <div style={{ fontSize: 12, fontWeight: 500, color: active ? 'var(--accent-2)' : 'var(--text)', marginBottom: 2 }}>{label}</div>
      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{desc}</div>
    </button>
  )
}

function Warn({ children }) {
  return (
    <div style={{
      fontSize: 11, lineHeight: 1.5, color: 'var(--warning)', marginBottom: 14,
      background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 8, padding: '8px 12px',
    }}>{children}</div>
  )
}

function Stat({ label, value, color }) {
  return (
    <span style={{ fontSize: 11, color: 'var(--text-muted)', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 6, padding: '2px 8px', whiteSpace: 'nowrap' }}>
      <span style={{ color: color || 'var(--text)', fontWeight: 600 }}>{value}</span> {label}
    </span>
  )
}

function Detail({ title, color, children }) {
  return (
    <details style={{ marginTop: 8, fontSize: 11 }}>
      <summary style={{ cursor: 'pointer', color: color || 'var(--text-muted)', fontWeight: 500 }}>{title}</summary>
      <div style={{ maxHeight: 110, overflowY: 'auto', color: 'var(--text-muted)', wordBreak: 'break-all', marginTop: 4, display: 'flex', flexDirection: 'column', gap: 2 }}>
        {children}
      </div>
    </details>
  )
}

// Vùng nút dưới cùng: Bắt đầu / xác nhận ghi đè / Đóng
function Actions({ isMobile, active, final, confirming, starting, canStart, startLabel, confirmLabel, onStart, onCancelConfirm, onClose, onAgain }) {
  const base = { padding: isMobile ? '12px 16px' : '8px 20px', borderRadius: 6, cursor: 'pointer', border: 'none', color: '#fff', fontSize: 13, fontWeight: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, flex: isMobile ? 1 : undefined }
  const ghost = { padding: '8px 16px', borderRadius: 6, cursor: 'pointer', border: '1px solid var(--border)', background: 'transparent', color: 'var(--text-muted)', fontSize: 13 }
  return (
    <div style={{ display: 'flex', gap: 8, justifyContent: isMobile ? 'stretch' : 'flex-end' }}>
      {final ? (
        <>
          <button onClick={onAgain} style={ghost}>Chạy lần nữa</button>
          <button onClick={onClose} style={{ ...base, background: 'var(--success)' }}>Đóng</button>
        </>
      ) : active ? (
        <button onClick={onClose} style={ghost}>Đóng (job vẫn chạy)</button>
      ) : (
        <>
          {!isMobile && <button onClick={confirming ? onCancelConfirm : onClose} style={ghost}>{confirming ? 'Quay lại' : 'Hủy'}</button>}
          <button
            onClick={onStart}
            disabled={starting || !canStart}
            style={{ ...base, background: confirming ? 'var(--danger)' : 'var(--accent)', opacity: (starting || !canStart) ? 0.6 : 1 }}
          >
            {starting
              ? <><Loader size={13} style={{ animation: 'spin 1s linear infinite' }} /> Đang khởi động...</>
              : <><RefreshCw size={13} /> {confirming ? confirmLabel : startLabel}</>}
          </button>
        </>
      )}
    </div>
  )
}

// ── Tab Bài viết ────────────────────────────────────────────────────────────

const POST_MODE_LABEL = { incremental: 'Chỉ cập nhật mới', full: 'Ghi đè toàn bộ', related: 'Chỉ làm mới related' }

function PostsTab({ ctl, isMobile, otherBusy, onClose }) {
  const { jobId, job, start, dismiss, active } = ctl
  const [sitemapUrl, setSitemapUrl] = useState(DEFAULT_SITEMAP)
  const [mode, setMode] = useState('incremental')   // 'incremental' | 'full' | 'related'
  const [source, setSource] = useState('mcp')
  const [starting, setStarting] = useState(false)
  const [confirming, setConfirming] = useState(false)
  const [error, setError] = useState(null)

  const locked = !!jobId
  // Khi đã có job (đang chạy / vừa xong / mở lại modal) thì hiển thị đúng kiểu & nguồn của job đó
  const viewMode = locked && job?.mode ? job.mode : mode
  const viewSource = locked && job?.source && job.source !== 'live' ? job.source : source
  const isRelated = viewMode === 'related'   // chỉ làm mới "Bài viết liên quan" từ HTML live — không dùng MCP/sitemap
  const isMcp = viewSource === 'mcp'
  const canStart = !otherBusy && (isRelated || isMcp || !!sitemapUrl.trim())

  const run = async () => {
    setStarting(true)
    setError(null)
    setConfirming(false)
    try {
      const res = isRelated
        ? await api.crawlRelated()
        : await api.crawlStart(isMcp ? '' : sitemapUrl.trim(), mode, source)
      start(res.job_id)
    } catch (e) {
      setError(friendlyErr(e))
    } finally {
      setStarting(false)
    }
  }
  const onStart = () => { if (mode === 'full' && !confirming) setConfirming(true); else run() }
  const pickMode = m => { setMode(m); setConfirming(false) }

  const isError = job?.status === 'error'
  const isDone = job?.status === 'done'
  const pct = job?.total > 0 ? Math.round(((job.crawled + job.skipped + job.failed) / job.total) * 100) : 0
  const statusLabel = !job ? 'Đang kiểm tra job...' : {
    starting:         'Khởi động...',
    fetching_sitemap: 'Đang tải sitemap...',
    fetching_list:    job.mode === 'related' ? 'Đang lấy danh sách bài từ DB...' : 'Đang lấy danh sách bài từ MCP...',
    crawling:         job.importing ? 'Đang import vào database...' : `Crawling... (${pct}%)`,
    done:             'Hoàn tất!',
    error:            'Lỗi',
  }[job.status] ?? ''

  return (
    <div>
      {/* Nguồn crawl — không áp dụng cho "Chỉ làm mới Bài viết liên quan" (luôn tải HTML live) */}
      {!isRelated && (
        <div style={{ marginBottom: 14 }}>
          <label style={labelStyle}>Nguồn</label>
          <div style={{ display: 'flex', gap: 8 }}>
            <OptionCard isMobile={isMobile} active={viewSource === 'mcp'} disabled={locked} onClick={() => setSource('mcp')}
              label="MCP" desc="knxstore MCP server (đủ bài đã publish)" />
            <OptionCard isMobile={isMobile} active={viewSource === 'sitemap'} disabled={locked} onClick={() => setSource('sitemap')}
              label="Sitemap" desc="Fetch HTML từng bài (thiếu bài chưa vào sitemap)" />
          </div>
        </div>
      )}

      {/* Sitemap URL — chỉ dùng khi nguồn là Sitemap */}
      {!isRelated && !isMcp && (
        <div style={{ marginBottom: 14 }}>
          <label style={{ ...labelStyle, marginBottom: 6 }}>Sitemap URL</label>
          <input
            value={sitemapUrl}
            onChange={e => setSitemapUrl(e.target.value)}
            disabled={locked}
            placeholder="https://example.com/sitemap-post.xml"
            style={{
              width: '100%', background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 6,
              padding: '8px 12px', color: 'var(--text)', fontSize: isMobile ? 14 : 13, outline: 'none',
              boxSizing: 'border-box', opacity: locked ? 0.6 : 1,
            }}
            onFocus={e => e.target.style.borderColor = 'var(--accent)'}
            onBlur={e => e.target.style.borderColor = 'var(--border)'}
          />
        </div>
      )}

      {/* Kiểu chạy */}
      <div style={{ marginBottom: 12 }}>
        <label style={labelStyle}>Kiểu chạy</label>
        <div style={{ display: 'flex', gap: 8 }}>
          <OptionCard isMobile={isMobile} active={viewMode === 'incremental'} disabled={locked || isRelated} onClick={() => pickMode('incremental')}
            label="Chỉ cập nhật mới"
            desc={isMcp ? 'Thêm bài mới + cập nhật bài đã sửa (editedAt đổi); bỏ qua bài không đổi' : 'Thêm bài mới + bài có lastmod mới hơn DB; bỏ qua bài không đổi'} />
          <OptionCard isMobile={isMobile} active={viewMode === 'full'} disabled={locked || isRelated} onClick={() => pickMode('full')}
            label="Ghi đè toàn bộ"
            desc="Ghi đè mọi bài (md + DB, cả thân bài lẫn related)" />
        </div>
        {/* Tùy chọn phụ */}
        <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, fontSize: 12, color: 'var(--text-muted)', cursor: locked ? 'default' : 'pointer' }}>
          <input type="checkbox" checked={isRelated} disabled={locked} onChange={e => pickMode(e.target.checked ? 'related' : 'incremental')} />
          Chỉ làm mới "Bài viết liên quan" từ HTML live (~5 phút, không đụng thân bài)
        </label>
      </div>

      {mode === 'full' && !locked && (
        <Warn>
          Ghi đè toàn bộ: ghi đè mọi file md và dòng DB của từng bài, kèm tải HTML live lấy "Bài viết liên quan" — mất vài phút (~7 phút). Không xóa bài. MCP lỗi giữa chừng thì không ghi gì.
          {confirming && <strong> Bấm "Xác nhận ghi đè" để chạy.</strong>}
        </Warn>
      )}
      {otherBusy && !jobId && (
        <Warn>Đang có job đồng bộ sản phẩm chạy — chờ xong rồi crawl bài.</Warn>
      )}

      {/* Progress */}
      {jobId && (
        <div style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 8, padding: '12px 14px', marginBottom: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            {active && <Loader size={14} color="var(--warning)" style={{ animation: 'spin 1s linear infinite' }} />}
            {isDone && <CheckCircle size={14} color="var(--success)" />}
            {isError && <AlertCircle size={14} color="var(--danger)" />}
            <span style={{ fontSize: 12, fontWeight: 500, color: isDone ? 'var(--success)' : isError ? 'var(--danger)' : 'var(--warning)' }}>
              {statusLabel}
            </span>
            {job?.mode && <span style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--text-subtle)', whiteSpace: 'nowrap', flexShrink: 0 }}>{POST_MODE_LABEL[job.mode] || job.mode}</span>}
          </div>

          {job?.total > 0 && !job.importing && (
            <>
              <div style={{ marginBottom: 8 }}>
                <ProgressBar pct={pct} color={isDone ? 'var(--success)' : 'var(--accent)'} />
              </div>
              <div style={{ display: 'flex', gap: 12, fontSize: 11, color: 'var(--text-muted)', flexWrap: 'wrap' }}>
                <span><span style={{ color: 'var(--success)', fontWeight: 500 }}>{job.crawled}</span> crawled</span>
                <span><span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>{job.skipped}</span> skipped</span>
                {job.failed > 0 && <span><span style={{ color: 'var(--danger)', fontWeight: 500 }}>{job.failed}</span> failed</span>}
                <span style={{ marginLeft: 'auto' }}>{pct}% / {job.total}</span>
              </div>
            </>
          )}

          {job?.current && !isDone && (
            <div style={{ marginTop: 8, fontSize: 11, color: 'var(--text-subtle)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              → {job.current}
            </div>
          )}

          {isDone && job.mode !== 'related' && job.crawled === 0 && job.failed === 0 && (
            <div style={{ marginTop: 8, fontSize: 11, color: 'var(--text-muted)' }}>Không có bài mới hoặc bài đã sửa — không ghi gì.</div>
          )}

          {isDone && job.missing_in_mcp?.length > 0 && (
            <Detail title={`${job.missing_in_mcp.length} bài có trong DB nhưng MCP không trả về (đã gỡ/nháp) — chưa xóa`} color="var(--warning)">
              {job.missing_in_mcp.map(s => <div key={s}>{s}</div>)}
            </Detail>
          )}
          {isDone && job.related_failed?.length > 0 && (
            <Detail title={`${job.related_failed.length} bài tải HTML live lỗi — giữ nguyên related cũ`} color="var(--warning)">
              {job.related_failed.map(f => <div key={f.slug}>{f.slug} ({f.error})</div>)}
            </Detail>
          )}
          {isDone && job.no_related?.length > 0 && (
            <div style={{ marginTop: 8, fontSize: 11, color: 'var(--text-muted)' }}>
              {job.no_related.length} bài không có khối "Bài viết liên quan" trên trang live
            </div>
          )}
          {isError && job.error && (
            <div style={{ marginTop: 8, fontSize: 11, color: 'var(--danger)', wordBreak: 'break-all' }}>{job.error}</div>
          )}
        </div>
      )}

      {error && <div style={{ fontSize: 12, color: 'var(--danger)', marginBottom: 12 }}>{error}</div>}

      <Actions
        isMobile={isMobile} active={active} final={isFinal(job)} confirming={confirming} starting={starting} canStart={canStart}
        startLabel={mode === 'full' ? 'Ghi đè toàn bộ…' : isRelated ? 'Làm mới related' : 'Bắt đầu crawl'}
        confirmLabel="Xác nhận ghi đè"
        onStart={onStart} onCancelConfirm={() => setConfirming(false)} onClose={onClose} onAgain={dismiss}
      />
    </div>
  )
}

// ── Tab Sản phẩm ────────────────────────────────────────────────────────────

const PHASE_LABEL = {
  catalog: 'Đang tải danh sách sản phẩm (search_products)...',
  details: 'Làm mới chi tiết từng sản phẩm (get_product_for_edit)...',
  gaps:    'Dò sản phẩm nháp / lưu trữ (site_id trống)...',
  lookup:  'Tra các dòng cũ chưa khớp...',
  writing: 'Đang ghi vào database...',
}

const FIELD_LABELS = { name: 'tên', brand: 'hãng', price: 'giá', category: 'danh mục', url: 'url', slug: 'slug', sku: 'sku', stock_status: 'tồn kho', status: 'trạng thái', site_id: 'ID site' }

function ProductsTab({ ctl, isMobile, otherBusy, onClose }) {
  const { jobId, job, start, dismiss, active } = ctl
  const [mode, setMode] = useState('new')   // 'new' = Chỉ cập nhật mới | 'full' = Ghi đè toàn bộ
  const [starting, setStarting] = useState(false)
  const [confirming, setConfirming] = useState(false)
  const [error, setError] = useState(null)
  const locked = !!jobId
  const viewMode = locked && job?.mode ? job.mode : mode   // có job → hiển thị đúng kiểu của job đó

  const run = async () => {
    setStarting(true)
    setError(null)
    setConfirming(false)
    try {
      const res = await api.syncJobStart(mode)
      start(res.job_id)
    } catch (e) {
      setError(friendlyErr(e))
    } finally {
      setStarting(false)
    }
  }
  const onStart = () => { if (mode === 'full' && !confirming) setConfirming(true); else run() }
  const pickMode = m => { setMode(m); setConfirming(false) }

  const isDone = job?.status === 'done'
  const isError = job?.status === 'error'
  const known = job?.total > 0
  const pct = known ? Math.min(100, Math.round((job.done / job.total) * 100)) : 0
  const statusLabel = !job ? 'Đang kiểm tra job...'
    : isDone ? 'Hoàn tất!'
    : isError ? 'Lỗi'
    : job.status === 'starting' ? 'Khởi động...'
    : (PHASE_LABEL[job.phase] || 'Đang chạy...')
  const r = job?.result

  return (
    <div>
      <div style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.6, background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 8, padding: '10px 12px', marginBottom: 14 }}>
        Đồng bộ bảng sản phẩm từ MCP knxstore.vn (job nền, gọi MCP tuần tự). Giữ nguyên <strong>ID cũ</strong> (dùng trong shortcode{' '}
        <code>{'{products:[...]}'}</code>) và gắn <strong>ID site</strong>; không xóa sản phẩm — sản phẩm không còn trên site chỉ bị đánh dấu.
      </div>

      <div style={{ marginBottom: 12 }}>
        <label style={labelStyle}>Kiểu chạy</label>
        <div style={{ display: 'flex', gap: 8 }}>
          <OptionCard isMobile={isMobile} active={viewMode === 'new'} disabled={locked} onClick={() => pickMode('new')}
            label="Chỉ cập nhật mới"
            desc="Thêm sản phẩm mới, cập nhật dòng đã đổi (tên/hãng/giá/tồn kho/trạng thái/URL...), bỏ qua dòng giống hệt (~1 phút)" />
          <OptionCard isMobile={isMobile} active={viewMode === 'full'} disabled={locked} onClick={() => pickMode('full')}
            label="Ghi đè toàn bộ"
            desc="Làm mới đầy đủ từng sản phẩm (danh mục, trạng thái, ID cũ) và ghi đè mọi trường lấy từ MCP (~7 phút)" />
        </div>
      </div>

      {mode === 'full' && !locked && (
        <Warn>
          Ghi đè toàn bộ: chậm ~7 phút (get_product_for_edit cho từng sản phẩm, MCP gọi tuần tự). Không xóa sản phẩm, giữ nguyên ID cũ. MCP lỗi giữa chừng thì không ghi gì.
          {confirming && <strong> Bấm "Xác nhận ghi đè" để chạy.</strong>}
        </Warn>
      )}
      {otherBusy && !jobId && (
        <Warn>Đang có job crawl bài viết chạy — chờ xong rồi đồng bộ sản phẩm.</Warn>
      )}

      {jobId && (
        <div style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 8, padding: '12px 14px', marginBottom: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            {active && <Loader size={14} color="var(--warning)" style={{ animation: 'spin 1s linear infinite' }} />}
            {isDone && <CheckCircle size={14} color="var(--success)" />}
            {isError && <AlertCircle size={14} color="var(--danger)" />}
            <span style={{ fontSize: 12, fontWeight: 500, color: isDone ? 'var(--success)' : isError ? 'var(--danger)' : 'var(--warning)' }}>
              {statusLabel}
            </span>
            {job?.mode && <span style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--text-subtle)', whiteSpace: 'nowrap', flexShrink: 0 }}>{job.mode === 'full' ? 'Ghi đè toàn bộ' : 'Chỉ cập nhật mới'}</span>}
          </div>

          {job && !isDone && !isError && (
            <>
              <div style={{ marginBottom: 8 }}>
                <ProgressBar pct={pct} indeterminate={!known} />
              </div>
              <div style={{ display: 'flex', fontSize: 11, color: 'var(--text-muted)', gap: 12 }}>
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', minWidth: 0, flex: 1 }}>→ {job.current || '...'}</span>
                {known && <span style={{ flexShrink: 0 }}>{job.done}/{job.total} · {pct}%</span>}
              </div>
            </>
          )}

          {isDone && r && (
            <>
              <div style={{ marginBottom: 8 }}>
                <ProgressBar pct={100} color="var(--success)" />
              </div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                <Stat label="trên MCP" value={r.mcp_total} color="var(--accent-2)" />
                <Stat label="khớp" value={r.linked} color="var(--success)" />
                <Stat label="mới" value={r.new_count} color="var(--success)" />
                <Stat label="đổi" value={r.updated_count} color="var(--accent-2)" />
                <Stat label="không đổi" value={r.unchanged_count} />
                <Stat label="không còn trên site" value={r.not_on_site_count} color={r.not_on_site_count ? 'var(--danger)' : undefined} />
                {r.ambiguous_count > 0 && <Stat label="mơ hồ" value={r.ambiguous_count} color="var(--warning)" />}
                {r.failed_count > 0 && <Stat label="lỗi" value={r.failed_count} color="var(--danger)" />}
                <span style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--text-subtle)', alignSelf: 'center' }}>Tổng DB: {r.total_in_db?.toLocaleString?.() ?? r.total_in_db}</span>
              </div>
              {r.new_count === 0 && r.updated_count === 0 && (
                <div style={{ marginTop: 8, fontSize: 11, color: 'var(--text-muted)' }}>Không có sản phẩm mới hoặc thay đổi.</div>
              )}
              {r.new?.length > 0 && (
                <Detail title={`${r.new_count} sản phẩm mới`} color="var(--success)">
                  {r.new.map(p => <div key={p.id}>#{p.site_id} {p.name}</div>)}
                </Detail>
              )}
              {r.updated?.length > 0 && (
                <Detail title={`${r.updated_count} sản phẩm thay đổi`} color="var(--accent-2)">
                  {r.updated.map(p => (
                    <div key={p.id}>cũ #{p.id} {p.name} — {Object.keys(p.changes).map(k => FIELD_LABELS[k] || k).join(', ')}</div>
                  ))}
                </Detail>
              )}
              {r.not_on_site?.length > 0 && (
                <Detail title={`${r.not_on_site_count} sản phẩm không còn trên site (đã đánh dấu, không xóa)`} color="var(--danger)">
                  {r.not_on_site.map(p => <div key={p.id}>cũ #{p.id} {p.name}</div>)}
                </Detail>
              )}
              {r.ambiguous?.length > 0 && (
                <Detail title={`${r.ambiguous_count} trường hợp mơ hồ (chưa liên kết)`} color="var(--warning)">
                  {r.ambiguous.map(p => <div key={p.site_id}>#{p.site_id} {p.slug} — ID cũ: {p.candidates.join(', ')}</div>)}
                </Detail>
              )}
              {r.failed?.length > 0 && (
                <Detail title={`${r.failed_count} sản phẩm tải chi tiết lỗi — giữ nguyên giá trị cũ`} color="var(--danger)">
                  {r.failed.map(f => <div key={f.site_id}>#{f.site_id} {f.slug} ({f.error})</div>)}
                </Detail>
              )}
              {r.co_mentioned && (
                <div style={{ marginTop: 8, fontSize: 11, color: 'var(--text-muted)' }}>
                  "Hay đi cùng" đã tính lại: {r.co_mentioned.pairs} cặp ({r.co_mentioned.diff ? `+${r.co_mentioned.diff.added} · −${r.co_mentioned.diff.removed} · ~${r.co_mentioned.diff.updated}` : ''})
                </div>
              )}
              {r.co_mentioned_error && (
                <div style={{ marginTop: 8, fontSize: 11, color: 'var(--warning)' }}>Tính lại "hay đi cùng" lỗi: {r.co_mentioned_error}</div>
              )}
            </>
          )}

          {isError && job.error && (
            <div style={{ marginTop: 8, fontSize: 11, color: 'var(--danger)', wordBreak: 'break-all' }}>{job.error} — chưa ghi gì vào DB.</div>
          )}
        </div>
      )}

      {error && <div style={{ fontSize: 12, color: 'var(--danger)', marginBottom: 12 }}>{error}</div>}

      <Actions
        isMobile={isMobile} active={active} final={isFinal(job)} confirming={confirming} starting={starting} canStart={!otherBusy}
        startLabel={mode === 'full' ? 'Ghi đè toàn bộ…' : 'Đồng bộ sản phẩm'}
        confirmLabel="Xác nhận ghi đè"
        onStart={onStart} onCancelConfirm={() => setConfirming(false)} onClose={onClose} onAgain={dismiss}
      />
    </div>
  )
}

// ── Modal ───────────────────────────────────────────────────────────────────

export default function CrawlModal({ onClose, onDone, bp = 'desktop', initialTab = 'posts' }) {
  const [tab, setTab] = useState(initialTab === 'products' ? 'products' : 'posts')
  const isMobile = bp === 'mobile'

  const postsCtl = useJob(LS_KEYS.posts, fetchCrawlStatus, data => { if (data.status === 'done') onDone?.('posts') })
  const productsCtl = useJob(LS_KEYS.products, api.syncJobStatus, data => { if (data.status === 'done') onDone?.('products') })

  // Đóng modal không dừng job; kết quả đã xem (done/error) của tab hiện tại thì bỏ đi để lần mở sau bắt đầu sạch.
  const close = () => {
    const ctl = tab === 'posts' ? postsCtl : productsCtl
    if (isFinal(ctl.job)) ctl.dismiss()
    onClose?.()
  }

  // Mobile: bottom sheet style
  const modalStyle = isMobile ? {
    position: 'fixed',
    bottom: 56,  // above bottom nav
    left: 0,
    right: 0,
    top: 'auto',
    borderRadius: '14px 14px 0 0',
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderBottom: 'none',
    zIndex: 201,
    boxShadow: '0 -8px 40px rgba(0,0,0,0.5)',
    maxHeight: '85vh',
    overflowY: 'auto',
  } : {
    position: 'fixed',
    top: '50%', left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500,
    maxWidth: '94vw',
    maxHeight: '90vh',
    overflowY: 'auto',
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 12,
    zIndex: 201,
    boxShadow: '0 20px 60px rgba(0,0,0,0.7)',
  }

  const bodyPad = isMobile ? 16 : 20
  const tabs = [
    { id: 'posts', label: 'Bài viết', busy: postsCtl.active },
    { id: 'products', label: 'Sản phẩm', busy: productsCtl.active },
  ]

  return (
    <>
      {/* Overlay */}
      <div
        onClick={close}
        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 200, backdropFilter: 'blur(3px)' }}
      />

      {/* Modal / Bottom sheet */}
      <div style={modalStyle}>
        {/* Drag handle — mobile only */}
        {isMobile && (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '10px 0 4px' }}>
            <div style={{ width: 36, height: 4, borderRadius: 2, background: 'var(--border)' }} />
          </div>
        )}

        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: isMobile ? '8px 16px 12px' : '16px 20px',
          borderBottom: '1px solid var(--border)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <RefreshCw size={16} color="var(--accent-2)" />
            <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>Crawl dữ liệu</span>
          </div>
          <button onClick={close} title="Đóng (job đang chạy vẫn tiếp tục)" style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', padding: 4 }}>
            <X size={16} />
          </button>
        </div>

        {/* Tabs: Bài viết | Sản phẩm */}
        <div style={{ display: 'flex', gap: 4, padding: isMobile ? '0 16px' : '0 20px', borderBottom: '1px solid var(--border)' }}>
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              style={{
                padding: '10px 14px', fontSize: 13, cursor: 'pointer', background: 'none', border: 'none',
                borderBottom: tab === t.id ? '2px solid var(--accent)' : '2px solid transparent',
                color: tab === t.id ? 'var(--accent-2)' : 'var(--text-muted)', fontWeight: tab === t.id ? 600 : 400,
                display: 'flex', alignItems: 'center', gap: 6,
              }}
            >
              {t.label}
              {t.busy && <Loader size={11} color="var(--warning)" style={{ animation: 'spin 1s linear infinite' }} />}
            </button>
          ))}
        </div>

        {/* Body — cả hai tab luôn được mount để giữ lựa chọn khi chuyển tab */}
        <div style={{ padding: bodyPad }}>
          <div style={{ display: tab === 'posts' ? 'block' : 'none' }}>
            <PostsTab ctl={postsCtl} isMobile={isMobile} otherBusy={productsCtl.active} onClose={close} />
          </div>
          <div style={{ display: tab === 'products' ? 'block' : 'none' }}>
            <ProductsTab ctl={productsCtl} isMobile={isMobile} otherBusy={postsCtl.active} onClose={close} />
          </div>
        </div>
      </div>

      <style>{`@keyframes spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }`}</style>
    </>
  )
}
