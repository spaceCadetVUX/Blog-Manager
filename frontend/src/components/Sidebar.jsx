import { useEffect, useState } from 'react'
import { LayoutDashboard, GitBranch, FileText, ShieldCheck, BrainCircuit, MessageSquare, Settings, BarChart2, BookOpen, LogOut, RefreshCw } from 'lucide-react'

const NAV = [
  { id: 'dashboard',      label: 'Dashboard',     icon: LayoutDashboard },
  { id: 'graph',          label: 'Link Graph',     icon: GitBranch },
  { id: 'posts',          label: 'Bài viết',       icon: FileText },
  { id: 'audit',          label: 'SEO Audit',      icon: ShieldCheck },
  { id: 'ai',             label: 'AI Analysis',    icon: BrainCircuit },
  { id: 'chat',           label: 'AI Chat',        icon: MessageSquare },
  { id: 'content-intel',  label: 'Content Intel',  icon: BarChart2 },
  { id: 'help',           label: 'Hướng dẫn',     icon: BookOpen },
]

const EASING   = 'cubic-bezier(0.4, 0, 0.2, 1)'
const DURATION = '0.28s'

export default function Sidebar({ active, onChange, onCrawl, collapsed = false, onToggleCollapse, onLogout, onOpenCrawl }) {
  // mounted flag — prevent animation on first paint
  const [ready, setReady] = useState(false)
  useEffect(() => { const t = setTimeout(() => setReady(true), 50); return () => clearTimeout(t) }, [])

  const transition = ready ? `${DURATION} ${EASING}` : 'none'

  return (
    <aside style={{
      width: collapsed ? 56 : 220,
      minWidth: collapsed ? 56 : 220,
      height: '100vh',
      background: 'var(--surface)',
      borderRight: '1px solid var(--border)',
      display: 'flex',
      flexDirection: 'column',
      userSelect: 'none',
      overflow: 'hidden',
      transition: `width ${transition}, min-width ${transition}`,
      willChange: 'width',
    }}>

      {/* ── Header ── */}
      <div style={{
        height: 52,
        padding: '0 12px',
        borderBottom: '1px solid var(--border-2)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        flexShrink: 0,
      }}>
        <img
          src="/logo.png" alt="KNXStore"
          style={{
            height: collapsed ? 22 : 20,
            maxWidth: collapsed ? 32 : 120,
            objectFit: 'contain',
            transition: `height ${transition}, max-width ${transition}`,
          }}
        />
      </div>

      {/* ── Nav ── */}
      <nav style={{ padding: '6px 0', flex: 1, overflow: 'hidden' }}>
        {NAV.map(({ id, label, icon: Icon }, idx) => {
          const isActive = active === id
          return (
            <button
              key={id}
              onClick={() => onChange(id)}
              title={collapsed ? label : undefined}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '9px 16px',
                position: 'relative',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                fontSize: 13,
                fontWeight: isActive ? 500 : 400,
                textAlign: 'left',
                overflow: 'hidden',
                transition: `color ${DURATION} ${EASING}`,
                color: isActive ? 'var(--accent-2)' : 'var(--text-muted)',
              }}
              onMouseEnter={e => { if (!isActive) e.currentTarget.style.color = 'var(--text)' }}
              onMouseLeave={e => { if (!isActive) e.currentTarget.style.color = 'var(--text-muted)' }}
            >
              {/* Active pill background */}
              <span style={{
                position: 'absolute', inset: '2px 6px',
                borderRadius: 7,
                background: 'var(--accent-dim)',
                opacity: isActive ? 1 : 0,
                transform: isActive ? 'scaleX(1)' : 'scaleX(0.88)',
                transformOrigin: 'left center',
                transition: `opacity ${DURATION} ${EASING}, transform ${DURATION} ${EASING}`,
                pointerEvents: 'none',
              }} />

              {/* Active left bar */}
              <span style={{
                position: 'absolute', left: 0, top: '18%', bottom: '18%',
                width: 3, borderRadius: '0 3px 3px 0',
                background: 'var(--accent)',
                opacity: isActive ? 1 : 0,
                transform: isActive ? 'scaleY(1)' : 'scaleY(0)',
                transition: `opacity ${DURATION} ${EASING}, transform ${DURATION} ${EASING}`,
                pointerEvents: 'none',
              }} />

              {/* Hover background */}
              <span
                className="nav-hover-bg"
                style={{
                  position: 'absolute', inset: '2px 6px',
                  borderRadius: 7,
                  background: 'rgba(255,255,255,0.05)',
                  opacity: 0,
                  transition: `opacity 0.15s ${EASING}`,
                  pointerEvents: 'none',
                }}
                onMouseEnter={e => { if (!isActive) e.currentTarget.style.opacity = '1' }}
                onMouseLeave={e => { e.currentTarget.style.opacity = '0' }}
              />

              {/* Icon — always centered when collapsed */}
              <span style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
                width: 20, height: 20,
                position: 'relative', zIndex: 1,
                transition: `transform ${DURATION} ${EASING}`,
                transform: collapsed ? 'translateX(4px)' : 'translateX(0)',
              }}>
                <Icon size={16} strokeWidth={isActive ? 2.2 : 1.8} />
              </span>

              {/* Label — fade + slide */}
              <span style={{
                position: 'relative', zIndex: 1,
                whiteSpace: 'nowrap',
                opacity: collapsed ? 0 : 1,
                transform: collapsed ? 'translateX(-8px)' : 'translateX(0)',
                transition: `opacity ${transition}, transform ${transition}`,
                // stagger per item when expanding
                transitionDelay: collapsed ? '0s' : `${idx * 0.018}s`,
                pointerEvents: 'none',
              }}>
                {label}
              </span>
            </button>
          )
        })}
      </nav>

      {/* ── Footer ── */}
      <div style={{
        padding: '8px 6px',
        borderTop: '1px solid var(--border-2)',
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        flexShrink: 0,
        overflow: 'hidden',
      }}>
        {/* Crawl */}
        <button onClick={onOpenCrawl} title={collapsed ? 'Crawl' : undefined}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: 10,
            padding: '8px 10px', background: 'transparent', border: 'none',
            cursor: 'pointer', fontSize: 13, textAlign: 'left', borderRadius: 7,
            color: 'var(--text-muted)', transition: `color 0.15s, background 0.15s`,
          }}
          onMouseEnter={e => { e.currentTarget.style.color = 'var(--accent-2)'; e.currentTarget.style.background = 'rgba(6,182,212,0.07)' }}
          onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.background = 'transparent' }}
        >
          <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 20, height: 20, flexShrink: 0, transition: `transform ${DURATION} ${EASING}`, transform: collapsed ? 'translateX(4px)' : 'none' }}>
            <RefreshCw size={16} strokeWidth={1.8} />
          </span>
          <span style={{ whiteSpace: 'nowrap', opacity: collapsed ? 0 : 1, transform: collapsed ? 'translateX(-8px)' : 'none', transition: `opacity ${transition}, transform ${transition}`, pointerEvents: 'none' }}>
            Crawl
          </span>
        </button>

        {/* Settings */}
        {[
          { id: 'settings', label: 'Settings', icon: Settings, onClick: () => onChange('settings') },
        ].map(({ id, label, icon: Icon, onClick }) => {
          const isActive = active === id
          return (
            <button key={id} onClick={onClick} title={collapsed ? label : undefined}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                padding: '8px 10px', position: 'relative',
                background: 'transparent', border: 'none', cursor: 'pointer',
                fontSize: 13, fontWeight: isActive ? 500 : 400, textAlign: 'left',
                color: isActive ? 'var(--accent-2)' : 'var(--text-muted)',
                borderRadius: 7, overflow: 'hidden',
                transition: `color ${DURATION} ${EASING}`,
              }}
              onMouseEnter={e => { if (!isActive) e.currentTarget.style.color = 'var(--text)' }}
              onMouseLeave={e => { if (!isActive) e.currentTarget.style.color = 'var(--text-muted)' }}
            >
              <span style={{
                position: 'absolute', inset: '2px',
                borderRadius: 6, background: 'var(--accent-dim)',
                opacity: isActive ? 1 : 0,
                transition: `opacity ${DURATION} ${EASING}`,
                pointerEvents: 'none',
              }} />
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 20, height: 20, flexShrink: 0, position: 'relative', zIndex: 1, transition: `transform ${DURATION} ${EASING}`, transform: collapsed ? 'translateX(4px)' : 'none' }}>
                <Icon size={16} strokeWidth={isActive ? 2.2 : 1.8} />
              </span>
              <span style={{ position: 'relative', zIndex: 1, whiteSpace: 'nowrap', opacity: collapsed ? 0 : 1, transform: collapsed ? 'translateX(-8px)' : 'none', transition: `opacity ${transition}, transform ${transition}`, pointerEvents: 'none' }}>
                {label}
              </span>
            </button>
          )
        })}

        {/* Logout */}
        {onLogout && (
          <button onClick={onLogout} title={collapsed ? 'Đăng xuất' : undefined}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: 10,
              padding: '8px 10px',
              background: 'transparent', border: 'none', cursor: 'pointer',
              fontSize: 13, textAlign: 'left', borderRadius: 7,
              color: 'var(--text-muted)',
              transition: `color 0.15s, background 0.15s`,
            }}
            onMouseEnter={e => { e.currentTarget.style.color = '#f87171'; e.currentTarget.style.background = 'rgba(248,71,71,0.06)' }}
            onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.background = 'transparent' }}
          >
            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 20, height: 20, flexShrink: 0, transition: `transform ${DURATION} ${EASING}`, transform: collapsed ? 'translateX(4px)' : 'none' }}>
              <LogOut size={16} strokeWidth={1.8} />
            </span>
            <span style={{ whiteSpace: 'nowrap', opacity: collapsed ? 0 : 1, transform: collapsed ? 'translateX(-8px)' : 'none', transition: `opacity ${transition}, transform ${transition}`, pointerEvents: 'none' }}>
              Đăng xuất
            </span>
          </button>
        )}

        {/* Collapse toggle */}
        {onToggleCollapse && (
          <div style={{ display: 'flex', justifyContent: collapsed ? 'center' : 'flex-end', paddingTop: 4 }}>
            <button
              onClick={onToggleCollapse}
              title={collapsed ? 'Mở rộng' : 'Thu gọn'}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                width: 28, height: 28, flexShrink: 0, borderRadius: 7,
                border: '1px solid var(--border-2)', background: 'transparent',
                color: 'var(--text-subtle)', cursor: 'pointer',
                transition: `background 0.15s, color 0.15s`,
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = 'var(--text-muted)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-subtle)' }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"
                style={{ transition: `transform ${DURATION} ${EASING}`, transform: collapsed ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                <polyline points="15 18 9 12 15 6"/>
              </svg>
            </button>
          </div>
        )}
      </div>
    </aside>

    </aside>
  )
}
