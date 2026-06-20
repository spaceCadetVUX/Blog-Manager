import { useState } from 'react'

export default function LoginView({ onLogin }) {
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)
  const [focused, setFocused]   = useState(false)
  const [showPw, setShowPw]     = useState(false)

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
        setError('Sai mật khẩu, thử lại.')
      }
    } catch {
      setError('Không kết nối được backend.')
    } finally {
      setLoading(false)
    }
  }

  const canSubmit = !loading && password.trim()

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#0d1117',
      fontFamily: 'inherit',
    }}>
      {/* Subtle grid pattern */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none',
        backgroundImage: 'linear-gradient(rgba(6,182,212,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,0.03) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
      }} />

      {/* Glow */}
      <div style={{
        position: 'fixed', top: '30%', left: '50%', transform: 'translateX(-50%)',
        width: 500, height: 300, borderRadius: '50%',
        background: 'radial-gradient(ellipse, rgba(6,182,212,0.07) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <form
        onSubmit={submit}
        style={{
          position: 'relative',
          background: 'rgba(22,27,34,0.95)',
          border: '1px solid rgba(48,54,61,0.8)',
          borderRadius: 16,
          padding: '40px 40px 36px',
          display: 'flex',
          flexDirection: 'column',
          gap: 0,
          width: 360,
          boxShadow: '0 24px 64px rgba(0,0,0,0.5), 0 0 0 1px rgba(6,182,212,0.06)',
          backdropFilter: 'blur(12px)',
        }}
      >
        {/* Logo / brand */}
        <div style={{ marginBottom: 28, textAlign: 'center' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: 52, height: 52, borderRadius: 14,
            background: 'rgba(6,182,212,0.1)',
            border: '1px solid rgba(6,182,212,0.2)',
            marginBottom: 16,
          }}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#06b6d4" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
              <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
              <line x1="12" y1="22.08" x2="12" y2="12"/>
            </svg>
          </div>
          <div style={{ fontSize: 17, fontWeight: 700, color: '#e6edf3', letterSpacing: '-0.3px' }}>
            KNXStore Blog SEO
          </div>
          <div style={{ fontSize: 12, color: '#7d8590', marginTop: 5 }}>
            Nhập mật khẩu để truy cập
          </div>
        </div>

        {/* Password field */}
        <div style={{ marginBottom: 12 }}>
          <label style={{ fontSize: 11, fontWeight: 500, color: '#7d8590', display: 'block', marginBottom: 7, letterSpacing: '0.5px', textTransform: 'uppercase' }}>
            Mật khẩu
          </label>
          <div style={{
            position: 'relative',
            borderRadius: 9,
            border: `1.5px solid ${error ? 'rgba(248,81,73,0.7)' : focused ? 'rgba(6,182,212,0.6)' : 'rgba(48,54,61,0.9)'}`,
            background: error ? 'rgba(248,81,73,0.04)' : focused ? 'rgba(6,182,212,0.04)' : '#161b22',
            transition: 'border-color 0.15s, background 0.15s',
            boxShadow: focused ? '0 0 0 3px rgba(6,182,212,0.1)' : 'none',
          }}>
            <input
              type={showPw ? 'text' : 'password'}
              value={password}
              onChange={e => { setPassword(e.target.value); setError('') }}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              placeholder="••••••••••••"
              autoFocus
              style={{
                width: '100%',
                fontSize: 15,
                background: 'transparent',
                border: 'none',
                borderRadius: 9,
                padding: '11px 40px 11px 14px',
                color: '#e6edf3',
                outline: 'none',
                fontFamily: 'inherit',
                letterSpacing: showPw ? 'normal' : '2px',
                boxSizing: 'border-box',
              }}
            />
            {/* Toggle show/hide */}
            <button
              type="button"
              onClick={() => setShowPw(v => !v)}
              style={{
                position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
                background: 'none', border: 'none', cursor: 'pointer', padding: 4,
                color: '#484f58', lineHeight: 0, transition: 'color 0.1s',
              }}
              onMouseEnter={e => e.currentTarget.style.color = '#7d8590'}
              onMouseLeave={e => e.currentTarget.style.color = '#484f58'}
            >
              {showPw ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                  <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                  <line x1="1" y1="1" x2="23" y2="23"/>
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Error */}
        <div style={{
          height: error ? 'auto' : 0,
          overflow: 'hidden',
          marginBottom: error ? 12 : 0,
          transition: 'all 0.2s',
        }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6,
            background: 'rgba(248,81,73,0.08)',
            border: '1px solid rgba(248,81,73,0.25)',
            borderRadius: 7, padding: '7px 10px',
            fontSize: 12, color: '#f85149',
          }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            {error}
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={!canSubmit}
          style={{
            padding: '11px',
            borderRadius: 9,
            fontSize: 14,
            fontWeight: 600,
            cursor: canSubmit ? 'pointer' : 'not-allowed',
            border: 'none',
            background: canSubmit
              ? 'linear-gradient(135deg, #06b6d4, #0891b2)'
              : 'rgba(48,54,61,0.8)',
            color: canSubmit ? '#fff' : '#484f58',
            transition: 'all 0.15s',
            letterSpacing: '0.2px',
            boxShadow: canSubmit ? '0 4px 14px rgba(6,182,212,0.3)' : 'none',
          }}
          onMouseEnter={e => { if (canSubmit) e.currentTarget.style.boxShadow = '0 6px 20px rgba(6,182,212,0.45)' }}
          onMouseLeave={e => { if (canSubmit) e.currentTarget.style.boxShadow = '0 4px 14px rgba(6,182,212,0.3)' }}
        >
          {loading ? (
            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{ animation: 'spin 0.8s linear infinite' }}>
                <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
              </svg>
              Đang kiểm tra...
            </span>
          ) : 'Đăng nhập'}
        </button>

        <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      </form>
    </div>
  )
}
