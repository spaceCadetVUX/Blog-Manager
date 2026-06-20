import { useState, useEffect } from 'react'
import { LayoutDashboard, GitBranch, FileText, ShieldCheck, Lightbulb, BrainCircuit, MessageSquare, Settings } from 'lucide-react'
import Sidebar from './components/Sidebar'
import Dashboard from './components/Dashboard'
import GraphView from './components/GraphView'
import PostsList from './components/PostsList'
import AuditView from './components/AuditView'
import PostDetail from './components/PostDetail'
import CrawlModal from './components/CrawlModal'
import SuggestionsView from './components/SuggestionsView'
import AIView from './components/AIView'
import AIChatView from './components/AIChatView'
import SettingsView from './components/SettingsView'
import useBreakpoint from './hooks/useBreakpoint'
import LoginView from './components/LoginView'

const VIEWS = {
  dashboard:   Dashboard,
  graph:       GraphView,
  posts:       PostsList,
  audit:       AuditView,
  suggestions: SuggestionsView,
  ai:          AIView,
  chat:        AIChatView,
  settings:    SettingsView,
}

const BOTTOM_NAV = [
  { id: 'dashboard',   label: 'Dashboard', icon: LayoutDashboard },
  { id: 'graph',       label: 'Graph',     icon: GitBranch },
  { id: 'posts',       label: 'Bài viết',  icon: FileText },
  { id: 'audit',       label: 'Audit',     icon: ShieldCheck },
  { id: 'suggestions', label: 'Gợi ý',     icon: Lightbulb },
  { id: 'ai',          label: 'AI Analysis', icon: BrainCircuit },
  { id: 'chat',        label: 'AI Chat',    icon: MessageSquare },
  { id: 'settings',   label: 'Settings',   icon: Settings },
]

function AppShell() {
  const [view, setView]           = useState('graph')
  const [selectedSlug, setSelectedSlug] = useState(null)
  const [navList, setNavList]     = useState([])
  const [showCrawl, setShowCrawl] = useState(false)
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
  const View    = VIEWS[view]

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: 'var(--bg)' }}>
      {/* Sidebar: hidden on mobile */}
      {!isMobile && (
        <Sidebar
          active={view}
          onChange={setView}
          onCrawl={() => setShowCrawl(true)}
          collapsed={isTablet || sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(v => !v)}
        />
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
        <View onSelectPost={handleSelectPost} bp={bp} refreshKey={refreshKey} />
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
            {[...BOTTOM_NAV, { id: '__crawl__', label: 'Crawl', icon: null }].map(({ id, label, icon: Icon }) => {
              const isActive = view === id
              const isCrawl = id === '__crawl__'
              return (
                <button
                  key={id}
                  onClick={() => isCrawl ? setShowCrawl(true) : setView(id)}
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
                  {isCrawl
                    ? <span style={{ fontSize: 18, lineHeight: 1 }}>↻</span>
                    : <Icon size={18} strokeWidth={1.8} />
                  }
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
      {showCrawl && (
        <CrawlModal
          onClose={() => setShowCrawl(false)}
          onDone={refresh}
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
