import { useState, useEffect, useRef } from 'react'
import { X, RefreshCw, CheckCircle, AlertCircle, Loader } from 'lucide-react'
import { api } from '../api'

const DEFAULT_SITEMAP = 'https://knxstore.vn/sitemap-post.xml'

export default function CrawlModal({ onClose, onDone }) {
  const [sitemapUrl, setSitemapUrl] = useState(DEFAULT_SITEMAP)
  const [mode, setMode] = useState('incremental')
  const [jobId, setJobId] = useState(null)
  const [job, setJob] = useState(null)
  const [starting, setStarting] = useState(false)
  const [error, setError] = useState(null)
  const pollRef = useRef(null)

  // Poll status mỗi 2s khi job đang chạy
  useEffect(() => {
    if (!jobId) return
    pollRef.current = setInterval(async () => {
      try {
        const data = await api.crawlStatus(jobId)
        setJob(data)
        if (data.status === 'done' || data.status === 'error') {
          clearInterval(pollRef.current)
          if (data.status === 'done' && onDone) onDone()
        }
      } catch (e) {
        clearInterval(pollRef.current)
      }
    }, 2000)
    return () => clearInterval(pollRef.current)
  }, [jobId])

  const handleStart = async () => {
    if (!sitemapUrl.trim()) return
    setStarting(true)
    setError(null)
    try {
      const res = await api.crawlStart(sitemapUrl.trim(), mode)
      setJobId(res.job_id)
    } catch (e) {
      setError(e.message)
    } finally {
      setStarting(false)
    }
  }

  const isRunning = job && (job.status === 'crawling' || job.status === 'fetching_sitemap' || job.importing)
  const isDone    = job?.status === 'done'
  const isError   = job?.status === 'error'

  const pct = job?.total > 0
    ? Math.round(((job.crawled + job.skipped + job.failed) / job.total) * 100)
    : 0

  const statusLabel = {
    starting:        'Khởi động...',
    fetching_sitemap:'Đang tải sitemap...',
    crawling:        job?.importing ? 'Đang import vào database...' : `Crawling... (${pct}%)`,
    done:            'Hoàn tất!',
    error:           'Lỗi',
  }[job?.status] ?? ''

  return (
    <>
      {/* Overlay */}
      <div
        onClick={!isRunning ? onClose : undefined}
        style={{
          position: 'fixed', inset: 0,
          background: 'rgba(0,0,0,0.6)',
          zIndex: 200,
          backdropFilter: 'blur(3px)',
        }}
      />

      {/* Modal */}
      <div style={{
        position: 'fixed',
        top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 480,
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 12,
        zIndex: 201,
        boxShadow: '0 20px 60px rgba(0,0,0,0.7)',
        overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '16px 20px',
          borderBottom: '1px solid var(--border)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <RefreshCw size={16} color="var(--accent-2)" />
            <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>Crawl bài viết</span>
          </div>
          {!isRunning && (
            <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', padding: 4 }}>
              <X size={16} />
            </button>
          )}
        </div>

        {/* Body */}
        <div style={{ padding: '20px' }}>
          {/* Sitemap URL */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: 6 }}>
              Sitemap URL
            </label>
            <input
              value={sitemapUrl}
              onChange={e => setSitemapUrl(e.target.value)}
              disabled={!!jobId}
              placeholder="https://example.com/sitemap-post.xml"
              style={{
                width: '100%',
                background: 'var(--surface-2)',
                border: '1px solid var(--border)',
                borderRadius: 6,
                padding: '8px 12px',
                color: 'var(--text)',
                fontSize: 13,
                outline: 'none',
                boxSizing: 'border-box',
                opacity: jobId ? 0.6 : 1,
              }}
              onFocus={e => e.target.style.borderColor = 'var(--accent)'}
              onBlur={e => e.target.style.borderColor = 'var(--border)'}
            />
          </div>

          {/* Mode toggle */}
          <div style={{ marginBottom: 20 }}>
            <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: 8 }}>
              Chế độ
            </label>
            <div style={{ display: 'flex', gap: 8 }}>
              {[
                { val: 'incremental', label: 'Incremental', desc: 'Chỉ crawl bài chưa có' },
                { val: 'full',        label: 'Full recrawl', desc: 'Ghi đè tất cả (~2 phút)' },
              ].map(opt => (
                <button
                  key={opt.val}
                  onClick={() => !jobId && setMode(opt.val)}
                  disabled={!!jobId}
                  style={{
                    flex: 1, padding: '10px 12px', borderRadius: 8, cursor: jobId ? 'default' : 'pointer',
                    border: mode === opt.val ? '1px solid var(--accent)' : '1px solid var(--border)',
                    background: mode === opt.val ? 'var(--accent-dim)' : 'var(--surface-2)',
                    textAlign: 'left', opacity: jobId ? 0.6 : 1,
                  }}
                >
                  <div style={{ fontSize: 12, fontWeight: 500, color: mode === opt.val ? 'var(--accent-2)' : 'var(--text)', marginBottom: 2 }}>{opt.label}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{opt.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Progress */}
          {job && (
            <div style={{
              background: 'var(--surface-2)',
              border: '1px solid var(--border)',
              borderRadius: 8, padding: '14px 16px',
              marginBottom: 16,
            }}>
              {/* Status header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                {isRunning && <Loader size={14} color="var(--warning)" style={{ animation: 'spin 1s linear infinite' }} />}
                {isDone    && <CheckCircle size={14} color="var(--success)" />}
                {isError   && <AlertCircle size={14} color="var(--danger)" />}
                <span style={{ fontSize: 12, fontWeight: 500, color: isDone ? 'var(--success)' : isError ? 'var(--danger)' : 'var(--warning)' }}>
                  {statusLabel}
                </span>
              </div>

              {/* Progress bar */}
              {job.total > 0 && !job.importing && (
                <>
                  <div style={{ height: 4, background: 'var(--border)', borderRadius: 2, overflow: 'hidden', marginBottom: 8 }}>
                    <div style={{
                      height: '100%', borderRadius: 2,
                      background: isDone ? 'var(--success)' : 'var(--accent)',
                      width: pct + '%',
                      transition: 'width 0.4s ease',
                    }} />
                  </div>
                  <div style={{ display: 'flex', gap: 16, fontSize: 11, color: 'var(--text-muted)' }}>
                    <span><span style={{ color: 'var(--success)', fontWeight: 500 }}>{job.crawled}</span> crawled</span>
                    <span><span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>{job.skipped}</span> skipped</span>
                    {job.failed > 0 && <span><span style={{ color: 'var(--danger)', fontWeight: 500 }}>{job.failed}</span> failed</span>}
                    <span style={{ marginLeft: 'auto' }}>{pct}% / {job.total}</span>
                  </div>
                </>
              )}

              {/* Current URL */}
              {job.current && !isDone && (
                <div style={{ marginTop: 8, fontSize: 11, color: 'var(--text-subtle)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  → {job.current}
                </div>
              )}

              {/* Error */}
              {isError && job.error && (
                <div style={{ marginTop: 8, fontSize: 11, color: 'var(--danger)', wordBreak: 'break-all' }}>
                  {job.error}
                </div>
              )}
            </div>
          )}

          {error && (
            <div style={{ fontSize: 12, color: 'var(--danger)', marginBottom: 12 }}>{error}</div>
          )}

          {/* Buttons */}
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            {!isRunning && !isDone && (
              <>
                <button
                  onClick={onClose}
                  style={{
                    padding: '8px 16px', borderRadius: 6, cursor: 'pointer',
                    border: '1px solid var(--border)', background: 'transparent',
                    color: 'var(--text-muted)', fontSize: 13,
                  }}
                >Hủy</button>
                <button
                  onClick={handleStart}
                  disabled={starting || !sitemapUrl.trim()}
                  style={{
                    padding: '8px 20px', borderRadius: 6, cursor: 'pointer',
                    border: 'none', background: 'var(--accent)',
                    color: '#fff', fontSize: 13, fontWeight: 500,
                    opacity: (starting || !sitemapUrl.trim()) ? 0.6 : 1,
                    display: 'flex', alignItems: 'center', gap: 6,
                  }}
                >
                  {starting
                    ? <><Loader size={13} style={{ animation: 'spin 1s linear infinite' }} /> Đang khởi động...</>
                    : <><RefreshCw size={13} /> Bắt đầu crawl</>
                  }
                </button>
              </>
            )}
            {isDone && (
              <button
                onClick={onClose}
                style={{
                  padding: '8px 20px', borderRadius: 6, cursor: 'pointer',
                  border: 'none', background: 'var(--success)',
                  color: '#fff', fontSize: 13, fontWeight: 500,
                }}
              >Đóng</button>
            )}
          </div>
        </div>
      </div>

      <style>{`@keyframes spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }`}</style>
    </>
  )
}
