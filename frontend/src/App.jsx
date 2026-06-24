import { useState, useEffect } from 'react'
import { LayoutDashboard, GitBranch, FileText, ShieldCheck, Lightbulb, BrainCircuit, MessageSquare, Settings, BarChart2, BookOpen } from 'lucide-react'

function ContentIntelView() {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
      <BarChart2 size={40} color="var(--accent-2)" strokeWidth={1.2} />
      <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)' }}>Content Intelligence</div>
      <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>content.tungvu.vn</div>
      <a
        href="https://content.tungvu.vn/"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          marginTop: 8, padding: '9px 24px', borderRadius: 8,
          background: 'var(--accent)', color: '#fff',
          fontSize: 13, fontWeight: 500, textDecoration: 'none',
          display: 'flex', alignItems: 'center', gap: 8,
        }}
      >
        Mở Content Intel ↗
      </a>
    </div>
  )
}
import Sidebar from './components/Sidebar'
import Dashboard from './components/Dashboard'
import GraphView from './components/GraphView'
import PostsList from './components/PostsList'
import AuditView from './components/AuditView'
import PostDetail from './components/PostDetail'
import SuggestionsView from './components/SuggestionsView'
import AIView from './components/AIView'
import AIChatView from './components/AIChatView'
import SettingsView from './components/SettingsView'
import HelpView from './components/HelpView'
import CrawlModal from './components/CrawlModal'
import useBreakpoint from './hooks/useBreakpoint'
import LoginView from './components/LoginView'

const VIEWS = {
  dashboard:      Dashboard,
  graph:          GraphView,
  posts:          PostsList,
  audit:          AuditView,
  suggestions:    SuggestionsView,
  ai:             AIView,
  chat:           AIChatView,
  'content-intel': ContentIntelView,
  settings:       SettingsView,
  help:           HelpView,
}

const BOTTOM_NAV = [
  { id: 'dashboard',     label: 'Dashboard',   icon: LayoutDashboard },
  { id: 'graph',         label: 'Graph',       icon: GitBranch },
  { id: 'posts',         label: 'Bài viết',    icon: FileText },
  { id: 'audit',         label: 'Audit',       icon: ShieldCheck },
  { id: 'suggestions',   label: 'Gợi ý',       icon: Lightbulb },
  { id: 'ai',            label: 'AI Analysis', icon: BrainCircuit },
  { id: 'chat',          label: 'AI Chat',     icon: MessageSquare },
  { id: 'settings',      label: 'Settings',    icon: Settings },
  { id: 'help',          label: 'Hướng dẫn',  icon: BookOpen },
]

function AppShell() {
  const [view, setView]           = useState('graph')
  const [selectedSlug, setSelectedSlug] = useState(null)
  const [navList, setNavList]     = useState([])
  const [refreshKey, setRefreshKey] = useState(0)
  const refresh = () => setRefreshKey(k => k + 1)

  const handleSelectPost = (slug, list) => {
    setSelectedSlug(slug)
    if (list) setNavList(list)
  }
  const bp      = useBreakpoint()
  const isMobile = bp === 'mobile'
  const isTablet = bp === 'tablet'
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [showCrawl, setShowCrawl] = useState(false)
  const View    = VIEWS[view]

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: 'var(--bg)' }}>
      {/* Sidebar: hidden on mobile */}
      {!isMobile && (
        <Sidebar
          active={view}
          onChange={setView}
          onCrawl={() => setView('settings')}
          collapsed={isTablet || sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(v => !v)}
          onLogout={() => { localStorage.removeItem('app_token'); setToken('') }}
          onOpenCrawl={() => setShowCrawl(true)}
        />
      )}
      {showCrawl && (
        <CrawlModal onClose={() => setShowCrawl(false)} onDone={() => setShowCrawl(false)} bp={bp} />
      )}

      {/* Main content */}
      <main style={{
        flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column',
        paddingBottom: isMobile ? 56 : 0,
      }}>
        {/* Mobile top bar */}
        {isMobile && (
          <div style={{
            height: 44, flexShrink: 0,
            background: 'var(--surface)', borderBottom: '1px solid var(--border)',
            display: 'flex', alignItems: 'center', padding: '0 14px', gap: 10,
          }}>
            {(() => {
              const nav = BOTTOM_NAV.find(n => n.id === view)
              const Icon = nav?.icon
              return <>
                {Icon && <Icon size={16} color="var(--accent-2)" strokeWidth={1.8} />}
                <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>{nav?.label || view}</span>
              </>
            })()}
          </div>
        )}
        <View onSelectPost={handleSelectPost} bp={bp} refreshKey={refreshKey} onDone={refresh} />
      </main>

      {/* Bottom nav — mobile only */}
      {isMobile && (
        <nav style={{
          position: 'fixed', bottom: 0, left: 0, right: 0, height: 52,
          background: 'var(--surface)',
          borderTop: '1px solid var(--border)',
          zIndex: 50,
          overflowX: 'auto',
          overflowY: 'hidden',
          scrollbarWidth: 'none',
          WebkitOverflowScrolling: 'touch',
        }}>
          <div style={{
            display: 'flex', alignItems: 'stretch',
            height: '100%', width: 'max-content', minWidth: '100%',
          }}>
            {BOTTOM_NAV.map(({ id, label, icon: Icon }) => {
              const isActive = view === id
              return (
                <button
                  key={id}
                  onClick={() => setView(id)}
                  style={{
                    width: 64, flexShrink: 0,
                    display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center', gap: 3,
                    background: 'transparent', border: 'none', cursor: 'pointer',
                    color: isActive ? 'var(--accent-2)' : 'var(--text-subtle)',
                    borderTop: isActive ? '2px solid var(--accent)' : '2px solid transparent',
                    transition: 'color 0.15s',
                    padding: '4px 0 6px',
                  }}
                >
                  {Icon ? <Icon size={18} strokeWidth={1.8} /> : <span style={{ width: 18, display: 'inline-block' }} />}
                  <span style={{ fontSize: 9 }}>{label}</span>
                </button>
              )
            })}
          </div>
        </nav>
      )}

      {selectedSlug && (
        <PostDetail
          slug={selectedSlug}
          onClose={() => { setSelectedSlug(null); setNavList([]) }}
          onNavigate={slug => handleSelectPost(slug)}
          navList={navList}
          bp={bp}
        />
      )}

    </div>
  )
}

export default function App() {
  const [token, setToken] = useState(() => localStorage.getItem('app_token') || '')

  useEffect(() => {
    const onStorage = () => setToken(localStorage.getItem('app_token') || '')
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  if (!token) return <LoginView onLogin={t => setToken(t)} />
  return <AppShell />
}
