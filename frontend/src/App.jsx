import { useState } from 'react'
import Sidebar from './components/Sidebar'
import Dashboard from './components/Dashboard'
import GraphView from './components/GraphView'
import PostsList from './components/PostsList'
import AuditView from './components/AuditView'
import PostDetail from './components/PostDetail'
import CrawlModal from './components/CrawlModal'

const VIEWS = {
  dashboard: Dashboard,
  graph:     GraphView,
  posts:     PostsList,
  audit:     AuditView,
}

export default function App() {
  const [view, setView] = useState('graph')
  const [selectedSlug, setSelectedSlug] = useState(null)
  const [showCrawl, setShowCrawl] = useState(false)
  const View = VIEWS[view]

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: 'var(--bg)' }}>
      <Sidebar active={view} onChange={setView} onCrawl={() => setShowCrawl(true)} />
      <main style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <View onSelectPost={setSelectedSlug} />
      </main>
      {selectedSlug && (
        <PostDetail
          slug={selectedSlug}
          onClose={() => setSelectedSlug(null)}
          onNavigate={setSelectedSlug}
        />
      )}
      {showCrawl && (
        <CrawlModal
          onClose={() => setShowCrawl(false)}
          onDone={() => {}}
        />
      )}
    </div>
  )
}
