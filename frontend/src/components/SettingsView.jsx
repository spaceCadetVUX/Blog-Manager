import { useEffect, useState } from 'react'
import { api } from '../api'

const SETTINGS = [
  {
    key: 'cluster_instructions',
    label: 'AI Cluster Analysis — Extra Instructions',
    description: 'Dùng trong tab "AI Analysis" → nút "Phân tích". One-shot: AI đọc toàn bộ section hoặc cả blog và trả về báo cáo một lần. Ví dụ: "Tập trung vào internal link density, bỏ qua phần grammar."',
    rows: 4,
  },
  {
    key: 'review_instructions',
    label: 'AI Post Review — Extra Instructions',
    description: 'Dùng trong Post Detail → tab "Links & AI" → nút "Review bài viết". One-shot: AI đọc nội dung 1 bài cụ thể và trả về phân tích một lần. Ví dụ: "Đánh giá anchor text và gợi ý bài liên quan trong cùng section."',
    rows: 4,
  },
  {
    key: 'chat_instructions',
    label: 'AI Chat (Post Detail) — Extra Instructions',
    description: 'Dùng trong Post Detail → tab "Chat". Conversational: người dùng hỏi đáp nhiều lượt với AI về bài viết đó. Ví dụ: "Trả lời ngắn gọn, luôn đề xuất ít nhất 1 bài liên quan khi trả lời."',
    rows: 4,
  },
]

function SettingRow({ setting }) {
  const [value, setValue]     = useState('')
  const [saved, setSaved]     = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.getSetting(setting.key)
      .then(d => setValue(d.value || ''))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [setting.key])

  const save = () => {
    api.setSetting(setting.key, value)
      .then(() => { setSaved(true); setTimeout(() => setSaved(false), 2000) })
      .catch(() => {})
  }

  return (
    <div style={{
      background: 'var(--surface)', border: '1px solid var(--border)',
      borderRadius: 10, padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: 8,
    }}>
      <div>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', marginBottom: 3 }}>
          {setting.label}
        </div>
        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{setting.description}</div>
      </div>
      <textarea
        value={loading ? '' : value}
        onChange={e => { setValue(e.target.value); setSaved(false) }}
        disabled={loading}
        rows={setting.rows}
        placeholder={loading ? 'Đang tải...' : 'Để trống = dùng prompt mặc định'}
        style={{
          width: '100%', resize: 'vertical', fontSize: 12,
          background: 'var(--surface-2)', border: '1px solid var(--border)',
          borderRadius: 6, padding: '8px 10px', color: 'var(--text)',
          fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box',
          opacity: loading ? 0.5 : 1,
        }}
      />
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <button
          onClick={save}
          disabled={loading}
          style={{
            padding: '6px 16px', borderRadius: 6, fontSize: 12, fontWeight: 500,
            cursor: loading ? 'not-allowed' : 'pointer',
            border: '1px solid rgba(139,92,246,0.5)',
            background: 'rgba(139,92,246,0.12)', color: '#a78bfa',
            transition: 'background 0.1s',
          }}
          onMouseEnter={e => { if (!loading) e.currentTarget.style.background = 'rgba(139,92,246,0.22)' }}
          onMouseLeave={e => { if (!loading) e.currentTarget.style.background = 'rgba(139,92,246,0.12)' }}
        >
          Lưu
        </button>
        {saved && (
          <span style={{ fontSize: 11, color: 'var(--success)' }}>✓ Đã lưu</span>
        )}
        <span style={{ fontSize: 10, color: 'var(--text-subtle)', marginLeft: 'auto' }}>
          key: <code style={{ fontFamily: 'monospace' }}>{setting.key}</code>
        </span>
      </div>
    </div>
  )
}

const API_KEYS = [
  { key: 'anthropic_api_key', label: 'Anthropic API Key', placeholder: 'sk-ant-...',  envVar: 'ANTHROPIC_API_KEY' },
  { key: 'openai_api_key',    label: 'OpenAI API Key',    placeholder: 'sk-...',       envVar: 'OPENAI_API_KEY' },
  { key: 'deepseek_api_key',  label: 'DeepSeek API Key',  placeholder: 'sk-...',       envVar: 'DEEPSEEK_API_KEY' },
  { key: 'google_api_key',    label: 'Google API Key',    placeholder: 'AIza...',      envVar: 'GOOGLE_API_KEY' },
]

function ApiKeyRow({ cfg }) {
  const [input, setInput]     = useState('')
  const [isSet, setIsSet]     = useState(false)
  const [saved, setSaved]     = useState(false)
  const [cleared, setCleared] = useState(false)
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
      .then(() => { setIsSet(false); setInput(''); setCleared(true); setTimeout(() => setCleared(false), 2000) })
      .catch(() => {})
  }

  return (
    <div style={{
      background: 'var(--surface)', border: '1px solid var(--border)',
      borderRadius: 10, padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: 8,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', marginBottom: 3 }}>{cfg.label}</div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
            Nếu để trống, fallback sang <code style={{ fontFamily: 'monospace' }}>{cfg.envVar}</code> trong .env
          </div>
        </div>
        {!loading && (
          <span style={{
            fontSize: 11, padding: '3px 10px', borderRadius: 20, flexShrink: 0,
            background: isSet ? 'rgba(63,185,80,0.12)' : 'rgba(248,81,73,0.08)',
            border: `1px solid ${isSet ? 'rgba(63,185,80,0.35)' : 'rgba(248,81,73,0.3)'}`,
            color: isSet ? 'var(--success)' : 'var(--danger)',
          }}>
            {isSet ? '✓ Đã có key' : '✗ Chưa có key'}
          </span>
        )}
      </div>
      <input
        type="password"
        value={input}
        onChange={e => { setInput(e.target.value); setSaved(false) }}
        disabled={loading}
        placeholder={loading ? 'Đang tải...' : isSet ? 'Nhập key mới để thay thế...' : cfg.placeholder}
        style={{
          fontSize: 12, background: 'var(--surface-2)', border: '1px solid var(--border)',
          borderRadius: 6, padding: '8px 10px', color: 'var(--text)',
          fontFamily: 'monospace', outline: 'none', opacity: loading ? 0.5 : 1,
        }}
      />
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <button onClick={save} disabled={loading || !input.trim()}
          style={{ padding: '6px 16px', borderRadius: 6, fontSize: 12, fontWeight: 500, cursor: (loading || !input.trim()) ? 'not-allowed' : 'pointer', border: '1px solid rgba(139,92,246,0.5)', background: 'rgba(139,92,246,0.12)', color: '#a78bfa', transition: 'background 0.1s', opacity: (loading || !input.trim()) ? 0.6 : 1 }}
          onMouseEnter={e => { if (!loading && input.trim()) e.currentTarget.style.background = 'rgba(139,92,246,0.22)' }}
          onMouseLeave={e => { if (!loading && input.trim()) e.currentTarget.style.background = 'rgba(139,92,246,0.12)' }}
        >Lưu key</button>
        <button onClick={clear} disabled={loading || !isSet}
          style={{ padding: '6px 16px', borderRadius: 6, fontSize: 12, fontWeight: 500, cursor: (loading || !isSet) ? 'not-allowed' : 'pointer', border: '1px solid rgba(248,81,73,0.4)', background: 'rgba(248,81,73,0.08)', color: 'var(--danger)', transition: 'background 0.1s', opacity: (loading || !isSet) ? 0.5 : 1 }}
          onMouseEnter={e => { if (!loading && isSet) e.currentTarget.style.background = 'rgba(248,81,73,0.16)' }}
          onMouseLeave={e => { if (!loading && isSet) e.currentTarget.style.background = 'rgba(248,81,73,0.08)' }}
        >Xóa key</button>
        {saved   && <span style={{ fontSize: 11, color: 'var(--success)' }}>✓ Đã lưu</span>}
        {cleared && <span style={{ fontSize: 11, color: 'var(--danger)' }}>✓ Đã xóa</span>}
      </div>
    </div>
  )
}

export default function SettingsView() {
  const logout = () => {
    localStorage.removeItem('app_token')
    window.location.reload()
  }

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '24px 28px', maxWidth: 720 }}>
      <div style={{ marginBottom: 24, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>Settings</div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
            Cấu hình hành vi của các tính năng AI trong ứng dụng.
          </div>
        </div>
        <button
          onClick={logout}
          style={{
            padding: '6px 14px', borderRadius: 6, fontSize: 12, fontWeight: 500,
            cursor: 'pointer', border: '1px solid rgba(248,81,73,0.4)',
            background: 'rgba(248,81,73,0.08)', color: 'var(--danger)',
            transition: 'background 0.1s', flexShrink: 0,
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(248,81,73,0.16)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(248,81,73,0.08)'}
        >
          Đăng xuất
        </button>
      </div>

      <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-subtle)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>API Keys</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 28 }}>
        {API_KEYS.map(cfg => <ApiKeyRow key={cfg.key} cfg={cfg} />)}
      </div>

      <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-subtle)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>AI Instructions</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {SETTINGS.map(s => <SettingRow key={s.key} setting={s} />)}
      </div>
    </div>
  )
}
