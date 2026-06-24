import { LayoutDashboard, GitBranch, FileText, ShieldCheck, BrainCircuit, MessageSquare, Settings, BarChart2, BookOpen } from 'lucide-react'

const NAV = [
  { id: 'dashboard',      label: 'Dashboard',       icon: LayoutDashboard },
  { id: 'graph',          label: 'Link Graph',      icon: GitBranch },
  { id: 'posts',          label: 'Bài viết',        icon: FileText },
  { id: 'audit',          label: 'SEO Audit',       icon: ShieldCheck },
  { id: 'ai',             label: 'AI Analysis',     icon: BrainCircuit },
  { id: 'chat',           label: 'AI Chat',         icon: MessageSquare },
  { id: 'content-intel',  label: 'Content Intel',   icon: BarChart2 },
  { id: 'settings',       label: 'Settings',        icon: Settings },
  { id: 'help',           label: 'Hướng dẫn',      icon: BookOpen },
]

export default function Sidebar({ active, onChange, onCrawl, collapsed = false, onToggleCollapse }) {
  const w = collapsed ? 56 : 220

  return (
    <aside style={{
      width: w, minWidth: w,
      height: '100vh',
      background: 'var(--surface)',
      borderRight: '1px solid var(--border)',
      display: 'flex',
      flexDirection: 'column',
      userSelect: 'none',
      transition: 'width 0.2s',
      overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{
        padding: collapsed ? '16px 0' : '20px 16px 16px',
        borderBottom: '1px solid var(--border-2)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: collapsed ? 'center' : 'flex-start',
        gap: 10,
      }}>
        {!collapsed && (
          <div>
            <img src="/logo.png" alt="KNXStore" style={{ height: 20, objectFit: 'contain', display: 'block' }} />
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Blog Manager</div>
          </div>
        )}
        {collapsed && (
          <img src="/logo.png" alt="KNXStore" style={{ height: 24, objectFit: 'contain' }} />
        )}
      </div>

      {/* Nav */}
      <nav style={{ padding: '8px 0', flex: 1 }}>
        {NAV.map(({ id, label, icon: Icon }) => {
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
                justifyContent: collapsed ? 'center' : 'flex-start',
                gap: collapsed ? 0 : 10,
                padding: collapsed ? '11px 0' : '9px 16px',
                background: isActive ? 'var(--accent-dim)' : 'transparent',
                borderLeft: isActive ? '2px solid var(--accent)' : '2px solid transparent',
                borderTop: 'none', borderRight: 'none', borderBottom: 'none',
                color: isActive ? 'var(--accent-2)' : 'var(--text-muted)',
                cursor: 'pointer',
                fontSize: 13,
                fontWeight: isActive ? 500 : 400,
                textAlign: 'left',
                transition: 'all 0.15s',
              }}
              onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = 'var(--text)' } }}
              onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-muted)' } }}
            >
              <Icon size={16} strokeWidth={1.8} />
              {!collapsed && <span>{label}</span>}
            </button>
          )
        })}
      </nav>

      {/* Footer */}
      <div style={{ padding: collapsed ? '12px 0' : '12px 16px', borderTop: '1px solid var(--border-2)', display: 'flex', flexDirection: 'column', alignItems: collapsed ? 'center' : 'stretch', gap: 8 }}>
        {!collapsed && <div style={{ fontSize: 10, color: 'var(--text-subtle)' }}>knxstore.vn · v1.0.0</div>}

        {/* Collapse toggle */}
        {onToggleCollapse && (
          <button
            onClick={onToggleCollapse}
            title={collapsed ? 'Mở rộng sidebar' : 'Thu gọn sidebar'}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: collapsed ? 'center' : 'flex-start',
              gap: 6, padding: collapsed ? '7px' : '7px 10px',
              borderRadius: 6, border: '1px solid var(--border-2)',
              background: 'transparent', color: 'var(--text-subtle)',
              cursor: 'pointer', fontSize: 11,
              width: collapsed ? 32 : '100%', height: collapsed ? 32 : undefined,
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = 'var(--text-muted)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-subtle)' }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
              style={{ transform: collapsed ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', flexShrink: 0 }}>
              <polyline points="15 18 9 12 15 6"/>
            </svg>
            {!collapsed && 'Thu gọn'}
          </button>
        )}
      </div>
    </aside>
  )
}
