import { LayoutDashboard, GitBranch, FileText, ShieldCheck, RefreshCw } from 'lucide-react'

const NAV = [
  { id: 'dashboard', label: 'Dashboard',  icon: LayoutDashboard },
  { id: 'graph',     label: 'Link Graph', icon: GitBranch },
  { id: 'posts',     label: 'Bài viết',   icon: FileText },
  { id: 'audit',     label: 'SEO Audit',  icon: ShieldCheck },
]

export default function Sidebar({ active, onChange, onCrawl }) {
  return (
    <aside style={{
      width: 220,
      minWidth: 220,
      height: '100vh',
      background: 'var(--surface)',
      borderRight: '1px solid var(--border)',
      display: 'flex',
      flexDirection: 'column',
      userSelect: 'none',
    }}>
      {/* Header / Brand */}
      <div style={{
        padding: '20px 16px 16px',
        borderBottom: '1px solid var(--border-2)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 32,
            height: 32,
            background: 'var(--accent)',
            borderRadius: 8,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 14,
            fontWeight: 700,
            color: '#fff',
            flexShrink: 0,
          }}>K</div>
          <div>
            <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--text)' }}>KNX SEO</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Blog Manager</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ padding: '8px 0', flex: 1 }}>
        {NAV.map(({ id, label, icon: Icon }) => {
          const isActive = active === id
          return (
            <button
              key={id}
              onClick={() => onChange(id)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '9px 16px',
                background: isActive ? 'var(--accent-dim)' : 'transparent',
                borderLeft: isActive ? '2px solid var(--accent)' : '2px solid transparent',
                color: isActive ? 'var(--accent-2)' : 'var(--text-muted)',
                border: 'none',
                borderLeft: isActive ? '2px solid var(--accent)' : '2px solid transparent',
                cursor: 'pointer',
                fontSize: 13,
                fontWeight: isActive ? 500 : 400,
                textAlign: 'left',
                transition: 'all 0.15s',
              }}
              onMouseEnter={e => {
                if (!isActive) {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.04)'
                  e.currentTarget.style.color = 'var(--text)'
                }
              }}
              onMouseLeave={e => {
                if (!isActive) {
                  e.currentTarget.style.background = 'transparent'
                  e.currentTarget.style.color = 'var(--text-muted)'
                }
              }}
            >
              <Icon size={16} strokeWidth={1.8} />
              <span>{label}</span>
            </button>
          )
        })}
      </nav>

      {/* Footer */}
      <div style={{ padding: '12px 16px', borderTop: '1px solid var(--border-2)' }}>
        <button
          onClick={onCrawl}
          style={{
            width: '100%',
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '8px 10px', borderRadius: 6,
            border: '1px solid var(--border)',
            background: 'transparent',
            color: 'var(--text-muted)',
            cursor: 'pointer', fontSize: 12,
            transition: 'all 0.15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'var(--accent-dim)'; e.currentTarget.style.color = 'var(--accent-2)'; e.currentTarget.style.borderColor = 'var(--accent)' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.borderColor = 'var(--border)' }}
        >
          <RefreshCw size={13} strokeWidth={2} />
          Crawl bài viết
        </button>
        <div style={{ fontSize: 10, color: 'var(--text-subtle)', marginTop: 8 }}>knxstore.vn · v1.0.0</div>
      </div>
    </aside>
  )
}
