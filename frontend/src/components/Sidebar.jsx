import { LayoutDashboard, GitBranch, FileText, ShieldCheck, RefreshCw, Lightbulb, BrainCircuit } from 'lucide-react'

const NAV = [
  { id: 'dashboard',   label: 'Dashboard',     icon: LayoutDashboard },
  { id: 'graph',       label: 'Link Graph',    icon: GitBranch },
  { id: 'posts',       label: 'Bài viết',      icon: FileText },
  { id: 'audit',       label: 'SEO Audit',     icon: ShieldCheck },
  { id: 'suggestions', label: 'Gợi ý links',   icon: Lightbulb },
  { id: 'ai',          label: 'AI Analysis',   icon: BrainCircuit },
]

export default function Sidebar({ active, onChange, onCrawl, collapsed = false }) {
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
        <div style={{
          width: 32, height: 32,
          background: 'var(--accent)',
          borderRadius: 8,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 14, fontWeight: 700, color: '#fff', flexShrink: 0,
        }}>K</div>
        {!collapsed && (
          <div>
            <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--text)' }}>KNX SEO</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Blog Manager</div>
          </div>
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
                border: 'none',
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
        <button
          onClick={onCrawl}
          title={collapsed ? 'Crawl bài viết' : undefined}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: collapsed ? 'center' : 'flex-start',
            gap: collapsed ? 0 : 8,
            padding: collapsed ? '8px' : '8px 10px',
            borderRadius: 6,
            border: '1px solid var(--border)',
            background: 'transparent',
            color: 'var(--text-muted)',
            cursor: 'pointer', fontSize: 12,
            transition: 'all 0.15s',
            width: collapsed ? 36 : '100%',
            height: collapsed ? 36 : undefined,
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'var(--accent-dim)'; e.currentTarget.style.color = 'var(--accent-2)'; e.currentTarget.style.borderColor = 'var(--accent)' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.borderColor = 'var(--border)' }}
        >
          <RefreshCw size={13} strokeWidth={2} />
          {!collapsed && 'Crawl bài viết'}
        </button>
        {!collapsed && <div style={{ fontSize: 10, color: 'var(--text-subtle)' }}>knxstore.vn · v1.0.0</div>}
      </div>
    </aside>
  )
}
