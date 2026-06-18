import { useState } from 'react'

export default function LoginView({ onLogin }) {
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    if (!password.trim()) return
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/stats', {
        headers: { Authorization: `Bearer ${password.trim()}` },
      })
      if (res.ok) {
        localStorage.setItem('app_token', password.trim())
        onLogin(password.trim())
      } else {
        setError('Sai mật khẩu.')
      }
    } catch {
      setError('Không kết nối được backend.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--bg)',
    }}>
      <form
        onSubmit={submit}
        style={{
          background: 'var(--surface)', border: '1px solid var(--border)',
          borderRadius: 12, padding: '32px 36px', display: 'flex',
          flexDirection: 'column', gap: 16, minWidth: 320,
        }}
      >
        <div>
          <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>
            KNXStore Blog SEO
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Nhập mật khẩu để tiếp tục</div>
        </div>

        <input
          type="password"
          value={password}
          onChange={e => { setPassword(e.target.value); setError('') }}
          placeholder="Mật khẩu..."
          autoFocus
          style={{
            fontSize: 14, background: 'var(--surface-2)', border: `1px solid ${error ? 'var(--danger)' : 'var(--border)'}`,
            borderRadius: 7, padding: '9px 12px', color: 'var(--text)',
            outline: 'none', fontFamily: 'inherit',
          }}
        />

        {error && (
          <div style={{ fontSize: 12, color: 'var(--danger)' }}>{error}</div>
        )}

        <button
          type="submit"
          disabled={loading || !password.trim()}
          style={{
            padding: '9px', borderRadius: 7, fontSize: 13, fontWeight: 600,
            cursor: (loading || !password.trim()) ? 'not-allowed' : 'pointer',
            border: '1px solid rgba(139,92,246,0.5)',
            background: 'rgba(139,92,246,0.16)', color: '#a78bfa',
            opacity: (loading || !password.trim()) ? 0.6 : 1,
            transition: 'background 0.1s',
          }}
        >
          {loading ? 'Đang kiểm tra...' : 'Đăng nhập'}
        </button>
      </form>
    </div>
  )
}
