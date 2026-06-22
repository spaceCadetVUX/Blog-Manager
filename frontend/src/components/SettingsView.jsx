import { useEffect, useRef, useState } from 'react'
import { RefreshCw, Key, Bot, LogOut, CheckCircle, AlertCircle, Loader, ChevronDown } from 'lucide-react'
import { api } from '../api'

// ── shared primitives ────────────────────────────────────────────────────────

function SectionHeader({ icon: Icon, title, desc }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 12 }}>
      <div style={{
        width: 32, height: 32, borderRadius: 8, flexShrink: 0,
        background: 'var(--accent-dim)', border: '1px solid rgba(6,182,212,0.25)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Icon size={15} color="var(--accent-2)" strokeWidth={1.8} />
      </div>
      <div>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{title}</div>
        {desc && <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{desc}</div>}
      </div>
    </div>
  )
}

function Card({ children, style }) {
  return (
    <div style={{
      background: 'var(--surface)', border: '1px solid var(--border)',
      borderRadius: 10, padding: '16px 18px',
      ...style,
    }}>
      {children}
    </div>
  )
}

function FieldLabel({ children }) {
  return (
    <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>
      {children}
    </div>
  )
}

function inputStyle(disabled) {
  return {
    width: '100%', boxSizing: 'border-box',
    background: 'var(--surface-2)', border: '1px solid var(--border)',
    borderRadius: 6, padding: '8px 12px',
    color: 'var(--text)', fontSize: 13, fontFamily: 'inherit',
    outline: 'none', opacity: disabled ? 0.5 : 1,
    transition: 'border-color 0.15s',
  }
}

function SaveBtn({ onClick, disabled, children = 'Lưu' }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{
      padding: '6px 16px', borderRadius: 6, fontSize: 12, fontWeight: 500,
      cursor: disabled ? 'not-allowed' : 'pointer',
      border: '1px solid rgba(139,92,246,0.5)',
      background: 'rgba(139,92,246,0.12)', color: '#a78bfa',
      opacity: disabled ? 0.6 : 1, transition: 'background 0.1s',
    }}
      onMouseEnter={e => { if (!disabled) e.currentTarget.style.background = 'rgba(139,92,246,0.22)' }}
      onMouseLeave={e => { if (!disabled) e.currentTarget.style.background = 'rgba(139,92,246,0.12)' }}
    >{children}</button>
  )
}

// ── Crawl section ─────────────────────────────────────────────────────────────

const DEFAULT_SITEMAP = 'https://knxstore.vn/sitemap-post.xml'

function CrawlSection({ onDone }) {
  const [sitemapUrl, setSitemapUrl] = useState(DEFAULT_SITEMAP)
  const [mode, setMode]             = useState('incremental')
  const [jobId, setJobId]           = useState(null)
  const [job, setJob]               = useState(null)
  const [starting, setStarting]     = useState(false)
  const [error, setError]           = useState(null)
  const pollRef = useRef(null)

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
      } catch { clearInterval(pollRef.current) }
    }, 2000)
    return () => clearInterval(pollRef.current)
  }, [jobId])

  const handleStart = async () => {
    if (!sitemapUrl.trim()) return
    setStarting(true); setError(null); setJob(null); setJobId(null)
    try {
      const res = await api.crawlStart(sitemapUrl.trim(), mode)
      setJobId(res.job_id)
    } catch (e) { setError(e.message) }
    finally { setStarting(false) }
  }

  const reset = () => { setJobId(null); setJob(null); setError(null) }

  const isRunning = job && (job.status === 'crawling' || job.status === 'fetching_sitemap' || job.importing)
  const isDone    = job?.status === 'done'
  const isError   = job?.status === 'error'
  const pct       = job?.total > 0 ? Math.round(((job.crawled + job.skipped + job.failed) / job.total) * 100) : 0

  const statusLabel = {
    starting:         'Khởi động...',
    fetching_sitemap: 'Đang tải sitemap...',
    crawling:         job?.importing ? 'Đang import vào database...' : `Crawling ${pct}%`,
    done:             `Hoàn tất — ${job?.crawled ?? 0} bài đã crawl`,
    error:            job?.error || 'Lỗi không xác định',
  }[job?.status] ?? ''

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <SectionHeader icon={RefreshCw} title="Crawl bài viết" desc="Kéo danh sách bài từ sitemap XML về database." />

      <Card>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Sitemap URL */}
          <div>
            <FieldLabel>Sitemap URL</FieldLabel>
            <input
              value={sitemapUrl}
              onChange={e => setSitemapUrl(e.target.value)}
              disabled={!!jobId}
              placeholder="https://example.com/sitemap-post.xml"
              style={inputStyle(!!jobId)}
              onFocus={e => e.target.style.borderColor = 'var(--accent)'}
              onBlur={e => e.target.style.borderColor = 'var(--border)'}
            />
          </div>

          {/* Mode */}
          <div>
            <FieldLabel>Chế độ</FieldLabel>
            <div style={{ display: 'flex', gap: 8 }}>
              {[
                { val: 'incremental', label: 'Incremental', desc: 'Chỉ crawl bài chưa có' },
                { val: 'full',        label: 'Full recrawl', desc: 'Ghi đè tất cả (~2 phút)' },
              ].map(opt => (
                <button key={opt.val} onClick={() => !jobId && setMode(opt.val)} disabled={!!jobId} style={{
                  flex: 1, padding: '10px 12px', borderRadius: 8,
                  cursor: jobId ? 'default' : 'pointer',
                  border: mode === opt.val ? '1px solid var(--accent)' : '1px solid var(--border)',
                  background: mode === opt.val ? 'var(--accent-dim)' : 'var(--surface-2)',
                  textAlign: 'left', opacity: jobId ? 0.6 : 1,
                  transition: 'all 0.15s',
                }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: mode === opt.val ? 'var(--accent-2)' : 'var(--text)', marginBottom: 2 }}>{opt.label}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{opt.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Progress */}
          {job && (
            <div style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 8, padding: '12px 14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: job.total > 0 ? 10 : 0 }}>
                {isRunning && <Loader size={13} color="var(--warning)" style={{ animation: 'spin 1s linear infinite', flexShrink: 0 }} />}
                {isDone    && <CheckCircle size={13} color="var(--success)" />}
                {isError   && <AlertCircle size={13} color="var(--danger)" />}
                <span style={{ fontSize: 12, fontWeight: 500, color: isDone ? 'var(--success)' : isError ? 'var(--danger)' : 'var(--warning)' }}>
                  {statusLabel}
                </span>
              </div>
              {job.total > 0 && !job.importing && (
                <>
                  <div style={{ height: 3, background: 'var(--border)', borderRadius: 2, overflow: 'hidden', marginBottom: 8 }}>
                    <div style={{ height: '100%', borderRadius: 2, background: isDone ? 'var(--success)' : 'var(--accent)', width: pct + '%', transition: 'width 0.4s ease' }} />
                  </div>
                  <div style={{ display: 'flex', gap: 14, fontSize: 11, color: 'var(--text-muted)', flexWrap: 'wrap' }}>
                    <span>✓ <b style={{ color: 'var(--success)' }}>{job.crawled}</b> crawled</span>
                    <span>— <b>{job.skipped}</b> skipped</span>
                    {job.failed > 0 && <span>✗ <b style={{ color: 'var(--danger)' }}>{job.failed}</b> failed</span>}
                    <span style={{ marginLeft: 'auto' }}>{pct}% / {job.total}</span>
                  </div>
                </>
              )}
              {job.current && !isDone && (
                <div style={{ marginTop: 8, fontSize: 11, color: 'var(--text-subtle)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>↳ {job.current}</div>
              )}
            </div>
          )}

          {error && <div style={{ fontSize: 12, color: 'var(--danger)' }}>{error}</div>}

          {/* Action */}
          <div style={{ display: 'flex', gap: 8 }}>
            {!isRunning && !isDone && (
              <button onClick={handleStart} disabled={starting || !sitemapUrl.trim()} style={{
                padding: '8px 20px', borderRadius: 6, cursor: (starting || !sitemapUrl.trim()) ? 'not-allowed' : 'pointer',
                border: 'none', background: 'var(--accent)', color: '#fff',
                fontSize: 13, fontWeight: 500,
                opacity: (starting || !sitemapUrl.trim()) ? 0.6 : 1,
                display: 'flex', alignItems: 'center', gap: 6,
              }}>
                {starting
                  ? <><Loader size={13} style={{ animation: 'spin 1s linear infinite' }} /> Đang khởi động...</>
                  : <><RefreshCw size={13} /> Bắt đầu crawl</>}
              </button>
            )}
            {(isDone || isError) && (
              <button onClick={reset} style={{
                padding: '8px 20px', borderRadius: 6, cursor: 'pointer',
                border: '1px solid var(--border)', background: 'transparent',
                color: 'var(--text-muted)', fontSize: 13,
              }}>Crawl lại</button>
            )}
          </div>
        </div>
      </Card>
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )
}

// ── API Keys section ──────────────────────────────────────────────────────────

const API_KEYS = [
  { key: 'anthropic_api_key', label: 'Anthropic',  placeholder: 'sk-ant-...', envVar: 'ANTHROPIC_API_KEY' },
  { key: 'openai_api_key',    label: 'OpenAI',     placeholder: 'sk-...',     envVar: 'OPENAI_API_KEY' },
  { key: 'deepseek_api_key',  label: 'DeepSeek',   placeholder: 'sk-...',     envVar: 'DEEPSEEK_API_KEY' },
  { key: 'google_api_key',    label: 'Google',     placeholder: 'AIza...',    envVar: 'GOOGLE_API_KEY' },
]

function ApiKeyRow({ cfg }) {
  const [input, setInput]     = useState('')
  const [isSet, setIsSet]     = useState(false)
  const [saved, setSaved]     = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.getSetting(cfg.key)
      .then(d => setIsSet(d.is_set || false))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [cfg.key])

  const save = () => {
    if (!input.trim()) return
    api.setSetting(cfg.key, input.trim())
      .then(d => { setIsSet(d.is_set); setInput(''); setSaved(true); setTimeout(() => setSaved(false), 2000) })
      .catch(() => {})
  }
  const clear = () => {
    api.setSetting(cfg.key, '')
      .then(() => { setIsSet(false); setInput('') })
      .catch(() => {})
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr auto auto auto', alignItems: 'center', gap: 10 }}>
      <div>
        <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)' }}>{cfg.label}</div>
        <div style={{ fontSize: 10, color: 'var(--text-subtle)', fontFamily: 'monospace' }}>{cfg.envVar}</div>
      </div>
      <input
        type="password"
        value={input}
        onChange={e => { setInput(e.target.value); setSaved(false) }}
        disabled={loading}
        placeholder={loading ? '...' : isSet ? '••••••••••••' : cfg.placeholder}
        style={{ ...inputStyle(loading), fontFamily: 'monospace', fontSize: 12 }}
        onFocus={e => e.target.style.borderColor = 'var(--accent)'}
        onBlur={e => e.target.style.borderColor = 'var(--border)'}
        onKeyDown={e => e.key === 'Enter' && save()}
      />
      <div style={{
        fontSize: 10, padding: '3px 8px', borderRadius: 20, whiteSpace: 'nowrap', flexShrink: 0,
        background: isSet ? 'rgba(63,185,80,0.12)' : 'rgba(248,81,73,0.08)',
        border: `1px solid ${isSet ? 'rgba(63,185,80,0.35)' : 'rgba(248,81,73,0.3)'}`,
        color: isSet ? 'var(--success)' : 'var(--danger)',
      }}>{isSet ? '✓ Set' : '✗ Unset'}</div>
      <SaveBtn onClick={save} disabled={loading || !input.trim()}>Lưu</SaveBtn>
      {isSet && (
        <button onClick={clear} style={{
          padding: '5px 10px', borderRadius: 6, fontSize: 11, cursor: 'pointer',
          border: '1px solid rgba(248,81,73,0.35)', background: 'rgba(248,81,73,0.08)',
          color: 'var(--danger)', whiteSpace: 'nowrap',
        }}>Xóa</button>
      )}
      {saved && <span style={{ fontSize: 11, color: 'var(--success)', whiteSpace: 'nowrap' }}>✓ Đã lưu</span>}
    </div>
  )
}

function ApiKeysSection() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <SectionHeader icon={Key} title="API Keys" desc="Lưu vào DB — ưu tiên hơn biến môi trường .env." />
      <Card>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {API_KEYS.map(cfg => <ApiKeyRow key={cfg.key} cfg={cfg} />)}
        </div>
      </Card>
    </div>
  )
}

// ── AI Instructions section ───────────────────────────────────────────────────

const AI_SETTINGS = [
  {
    key: 'cluster_instructions',
    label: 'Cluster Analysis',
    desc: 'AI Analysis tab → nút "Phân tích". One-shot toàn bộ section/blog.',
    placeholder: 'VD: Tập trung vào internal link density, bỏ qua phần grammar.',
  },
  {
    key: 'review_instructions',
    label: 'Post Review',
    desc: 'Post Detail → tab "Links & AI" → nút "Review bài viết". One-shot 1 bài.',
    placeholder: 'VD: Đánh giá anchor text và gợi ý bài liên quan trong cùng section.',
  },
  {
    key: 'chat_instructions',
    label: 'AI Chat',
    desc: 'Post Detail → tab "Chat". Conversational nhiều lượt.',
    placeholder: 'VD: Trả lời ngắn gọn, luôn đề xuất ít nhất 1 bài liên quan.',
  },
]

function InstructionRow({ cfg }) {
  const [value, setValue]     = useState('')
  const [saved, setSaved]     = useState(false)
  const [loading, setLoading] = useState(true)
  const [open, setOpen]       = useState(false)

  useEffect(() => {
    api.getSetting(cfg.key)
      .then(d => { setValue(d.value || ''); if (d.value) setOpen(true) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [cfg.key])

  const save = () => {
    api.setSetting(cfg.key, value)
      .then(() => { setSaved(true); setTimeout(() => setSaved(false), 2000) })
      .catch(() => {})
  }

  return (
    <div style={{ borderBottom: '1px solid var(--border-2)', paddingBottom: 14, marginBottom: 14 }}
      className="instruction-row">
      <button
        onClick={() => setOpen(v => !v)}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: 'none', border: 'none', cursor: 'pointer', padding: '0 0 8px', textAlign: 'left',
        }}
      >
        <div>
          <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)' }}>{cfg.label}</div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{cfg.desc}</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0, marginLeft: 12 }}>
          {value && <span style={{ fontSize: 10, color: 'var(--accent-2)', background: 'var(--accent-dim)', padding: '2px 6px', borderRadius: 10 }}>Custom</span>}
          <ChevronDown size={14} color="var(--text-subtle)" style={{ transition: 'transform 0.2s', transform: open ? 'rotate(180deg)' : 'none' }} />
        </div>
      </button>
      {open && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <textarea
            value={loading ? '' : value}
            onChange={e => { setValue(e.target.value); setSaved(false) }}
            disabled={loading}
            rows={3}
            placeholder={loading ? 'Đang tải...' : cfg.placeholder}
            style={{ ...inputStyle(loading), resize: 'vertical', fontSize: 12 }}
            onFocus={e => e.target.style.borderColor = 'var(--accent)'}
            onBlur={e => e.target.style.borderColor = 'var(--border)'}
          />
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <SaveBtn onClick={save} disabled={loading}>Lưu</SaveBtn>
            {saved && <span style={{ fontSize: 11, color: 'var(--success)' }}>✓ Đã lưu</span>}
          </div>
        </div>
      )}
    </div>
  )
}

function AiInstructionsSection() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <SectionHeader icon={Bot} title="AI Instructions" desc="Custom prompt chèn vào mỗi tính năng AI. Để trống = dùng prompt mặc định." />
      <Card>
        {AI_SETTINGS.map((cfg, i) => (
          <div key={cfg.key} style={i === AI_SETTINGS.length - 1 ? { borderBottom: 'none', marginBottom: 0, paddingBottom: 0 } : {}}>
            <InstructionRow cfg={cfg} />
          </div>
        ))}
      </Card>
    </div>
  )
}

// ── Main ──────────────────────────────────────────────────────────────────────

export default function SettingsView({ onDone }) {
  const logout = () => { localStorage.removeItem('app_token'); window.location.reload() }

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '24px 28px', width: '100%', boxSizing: 'border-box' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)' }}>Settings</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 3 }}>Cấu hình crawl, API keys và hành vi AI.</div>
          </div>
          <button onClick={logout} style={{
            padding: '7px 14px', borderRadius: 6, fontSize: 12, fontWeight: 500,
            cursor: 'pointer', border: '1px solid rgba(248,81,73,0.4)',
            background: 'rgba(248,81,73,0.08)', color: 'var(--danger)',
            display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0,
            transition: 'background 0.1s',
          }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(248,81,73,0.16)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(248,81,73,0.08)'}
          >
            <LogOut size={13} /> Đăng xuất
          </button>
        </div>

        <CrawlSection onDone={onDone} />
        <ApiKeysSection />
        <AiInstructionsSection />

      </div>
    </div>
  )
}
