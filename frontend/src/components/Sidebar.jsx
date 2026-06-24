import { useEffect, useState } from 'react'
import { LayoutDashboard, GitBranch, FileText, ShieldCheck, BrainCircuit, MessageSquare, Settings, BarChart2, BookOpen } from 'lucide-react'

const NAV = [
  { id: 'dashboard',      label: 'Dashboard',     icon: LayoutDashboard },
  { id: 'graph',          label: 'Link Graph',     icon: GitBranch },
  { id: 'posts',          label: 'Bài viết',       icon: FileText },
  { id: 'audit',          label: 'SEO Audit',      icon: ShieldCheck },
  { id: 'ai',             label: 'AI Analysis',    icon: BrainCircuit },
  { id: 'chat',           label: 'AI Chat',        icon: MessageSquare },
  { id: 'content-intel',  label: 'Content Intel',  icon: BarChart2 },
  { id: 'settings',       label: 'Settings',       icon: Settings },
  { id: 'help',           label: 'Hướng dẫn',     icon: BookOpen },
]

const EASING   = 'cubic-bezier(0.4, 0, 0.2, 1)'
const DURATION = '0.28s'

export default function Sidebar({ active, onChange, onCrawl, collapsed = false, onToggleCollapse }) {
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
        height: 56,
        padding: '0 16px',
        borderBottom: '1px solid var(--border-2)',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        overflow: 'hidden',
        flexShrink: 0,
      }}>
        {/* Icon-only logo — always rendered, fade in/out */}
        <img
          src="/logo.png" alt="KNXStore"
          style={{
            height: 22, objectFit: 'contain', flexShrink: 0,
            transition: `opacity ${transition}, transform ${transition}`,
            opacity: 1,
          }}
        />
        {/* Text block — slides + fades */}
        <div style={{
          overflow: 'hidden',
          opacity: collapsed ? 0 : 1,
          transform: collapsed ? 'translateX(-6px)' : 'translateX(0)',
          transition: `opacity ${transition}, transform ${transition}`,
          pointerEvents: collapsed ? 'none' : 'auto',
          whiteSpace: 'nowrap',
        }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)', lineHeight: 1.3 }}>Blog Manager</div>
          <div style={{ fontSize: 10, color: 'var(--text-subtle)' }}>knxstore.vn</div>
        </div>
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
        padding: '10px 10px',
        borderTop: '1px solid var(--border-2)',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
        flexShrink: 0,
        gap: 8,
      }}>
        {/* Version — fade */}
        <span style={{
          fontSize: 10, color: 'var(--text-subtle)',
          flex: 1, whiteSpace: 'nowrap',
          opacity: collapsed ? 0 : 1,
          transform: collapsed ? 'translateX(-6px)' : 'translateX(0)',
          transition: `opacity ${transition}, transform ${transition}`,
          pointerEvents: collapsed ? 'none' : 'auto',
        }}>v1.0.0</span>

        {/* Collapse button */}
        {onToggleCollapse && (
          <button
            onClick={onToggleCollapse}
            title={collapsed ? 'Mở rộng' : 'Thu gọn'}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: 28, height: 28, flexShrink: 0,
              borderRadius: 7,
              border: '1px solid var(--border-2)',
              background: 'transparent',
              color: 'var(--text-subtle)',
              cursor: 'pointer',
              transition: `background 0.15s, color 0.15s, transform ${DURATION} ${EASING}`,
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = 'var(--text-muted)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-subtle)' }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"
              style={{
                transition: `transform ${DURATION} ${EASING}`,
                transform: collapsed ? 'rotate(180deg)' : 'rotate(0deg)',
              }}>
              <polyline points="15 18 9 12 15 6"/>
            </svg>
          </button>
        )}
      </div>
    </aside>
  )
}
