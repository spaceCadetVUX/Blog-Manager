import { useEffect, useState } from 'react'
import { api, streamLinkSuggestions } from '../api'
import { sectionColor } from '../sectionColors.js'
import { Lightbulb, ArrowRight, BrainCircuit, X } from 'lucide-react'
import AIPanel, { ModelSelect } from './AIPanel.jsx'

function OrphanCard({ group, onSelectPost, isMobile, aiModel }) {
  const [aiContent, setAiContent] = useState('')
  const [aiLoading, setAiLoading] = useState(false)
  const [showAI, setShowAI]       = useState(false)
  const sc = sectionColor(group.section)

  const runAI = async () => {
    if (aiLoading) return
    setAiContent('')
    setShowAI(true)
    setAiLoading(true)
    try {
      await streamLinkSuggestions(
        group.to_slug,
        aiModel,
        chunk => setAiContent(prev => prev + chunk),
        () => setAiLoading(false),
      )
    } catch (e) {
      setAiContent(`**Lỗi:** ${e.message}`)
      setAiLoading(false)
    }
  }

  return (
    <div style={{
      background: 'var(--surface)', border: '1px solid var(--border)',
      borderRadius: 8, marginBottom: 10, overflow: 'hidden',
    }}>
      {/* Orphan header */}
      <div style={{
        padding: '10px 14px',
        background: 'rgba(248,81,73,0.06)',
        borderBottom: '1px solid var(--border-2)',
        display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap',
      }}>
        <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--danger)', flexShrink: 0 }} />
        <span
          onClick={() => onSelectPost && onSelectPost(group.to_slug)}
          style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', cursor: 'pointer', flex: 1, minWidth: 0 }}
          onMouseEnter={e => e.target.style.color = 'var(--accent-2)'}
          onMouseLeave={e => e.target.style.color = 'var(--text)'}
        >{group.to_headline || group.to_slug}</span>
        <span style={{
          fontSize: 9, color: sc, background: sc + '18',
          border: '1px solid ' + sc + '35', borderRadius: 10,
          padding: '1px 7px', whiteSpace: 'nowrap', flexShrink: 0,
        }}>{group.section}</span>
        <span style={{
          fontSize: 10, color: 'var(--danger)', background: 'rgba(248,81,73,0.12)',
          borderRadius: 4, padding: '1px 7px', flexShrink: 0,
        }}>0 inbound</span>
        <button
          onClick={runAI}
          disabled={aiLoading}
          title="AI phân tích và gợi ý link cụ thể"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11,
            padding: '3px 9px', borderRadius: 5, flexShrink: 0,
            border: `1px solid ${showAI ? 'rgba(139,92,246,0.6)' : 'rgba(139,92,246,0.35)'}`,
            background: showAI ? 'rgba(139,92,246,0.14)' : 'rgba(139,92,246,0.06)',
            color: aiLoading ? 'rgba(167,139,250,0.5)' : '#a78bfa',
            cursor: aiLoading ? 'not-allowed' : 'pointer',
          }}
        >
          <BrainCircuit size={11} />
          {aiLoading ? 'Đang phân tích...' : 'AI gợi ý'}
        </button>
        {showAI && !aiLoading && (
          <button
            onClick={() => { setShowAI(false); setAiContent('') }}
            style={{ background: 'none', border: 'none', color: 'var(--text-subtle)', cursor: 'pointer', padding: 2, display: 'flex' }}
          ><X size={13} /></button>
        )}
      </div>

      {/* AI result */}
      {showAI && (
        <div style={{ padding: '10px 14px', borderBottom: aiContent ? '1px solid var(--border-2)' : 'none' }}>
          <AIPanel
            title={`AI gợi ý links — ${group.to_headline || group.to_slug}`}
            content={aiContent}
            loading={aiLoading}
            onClose={() => { setShowAI(false); setAiContent('') }}
            style={{ maxHeight: 400 }}
          />
        </div>
      )}

      {/* SQL-based linkers */}
      {group.linkers.length > 0 && (
        <div style={{ padding: '6px 0' }}>
          <div style={{ padding: '4px 14px 6px', fontSize: 10, color: 'var(--text-subtle)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Bài cùng section có thể link:
          </div>
          {group.linkers.slice(0, isMobile ? 3 : 5).map(linker => (
            <div
              key={linker.slug}
              onClick={() => onSelectPost && onSelectPost(linker.slug)}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '6px 14px', cursor: 'pointer', transition: 'background 0.1s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-2)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <ArrowRight size={11} color="var(--text-subtle)" style={{ flexShrink: 0 }} />
              <span style={{ fontSize: 12, color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {linker.headline || linker.slug}
              </span>
            </div>
          ))}
          {group.linkers.length > (isMobile ? 3 : 5) && (
            <div style={{ padding: '4px 14px', fontSize: 11, color: 'var(--text-subtle)' }}>
              +{group.linkers.length - (isMobile ? 3 : 5)} bài khác...
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default function SuggestionsView({ onSelectPost, bp = 'desktop', refreshKey = 0 }) {
  const [data, setData]               = useState([])
  const [loading, setLoading]         = useState(true)
  const [search, setSearch]           = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [searchLoading, setSearchLoading] = useState(false)
  const [aiModel, setAiModel]         = useState('claude-haiku-4-5-20251001')

  useEffect(() => {
    setLoading(true)
    api.suggestions()
      .then(rows => setData(rows))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [refreshKey])

  // Debounced search all posts
  useEffect(() => {
    if (!search.trim()) { setSearchResults([]); return }
    const t = setTimeout(() => {
      setSearchLoading(true)
      api.posts({ q: search.trim(), limit: 20, sort: 'inbound_links', order: 'asc' })
        .then(res => setSearchResults(res.items ?? res.posts ?? []))
        .catch(() => setSearchResults([]))
        .finally(() => setSearchLoading(false))
    }, 300)
    return () => clearTimeout(t)
  }, [search])

  const groups = {}
  data.forEach(row => {
    if (!groups[row.to_slug]) {
      groups[row.to_slug] = { to_slug: row.to_slug, to_headline: row.to_headline, section: row.section, linkers: [] }
    }
    groups[row.to_slug].linkers.push({ slug: row.from_slug, headline: row.from_headline })
  })

  const orphanGroups = Object.values(groups)
  const isMobile = bp === 'mobile'
  const isSearching = search.trim().length > 0

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{
        padding: '12px 16px', background: 'var(--surface)',
        borderBottom: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0, flexWrap: 'wrap',
      }}>
        <Lightbulb size={16} color="var(--warning)" strokeWidth={1.8} />
        <div style={{ flex: 1 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>Gợi ý Internal Links</span>
          <span style={{ fontSize: 11, color: 'var(--text-muted)', marginLeft: 10 }}>
            Tìm bất kỳ bài nào để AI gợi ý links, hoặc xem orphan posts bên dưới
          </span>
        </div>
        <ModelSelect value={aiModel} onChange={setAiModel} />
        {!isSearching && (
          <span style={{
            background: 'rgba(210,153,34,0.15)', color: 'var(--warning)',
            borderRadius: 10, padding: '1px 10px', fontSize: 11, fontWeight: 600,
          }}>{orphanGroups.length} orphan</span>
        )}
      </div>

      {/* Search */}
      <div style={{ padding: '10px 16px', borderBottom: '1px solid var(--border-2)', background: 'var(--surface)', flexShrink: 0 }}>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Tìm bất kỳ bài viết nào để AI phân tích links..."
          style={{
            width: '100%', maxWidth: 480,
            background: 'var(--surface-2)', border: '1px solid var(--border)',
            borderRadius: 6, padding: '7px 12px', color: 'var(--text)',
            fontSize: 12, outline: 'none',
          }}
          onFocus={e => e.target.style.borderColor = 'var(--accent)'}
          onBlur={e => e.target.style.borderColor = 'var(--border)'}
        />
        {isSearching && (
          <span style={{ fontSize: 11, color: 'var(--text-subtle)', marginLeft: 10 }}>
            {searchLoading ? 'Đang tìm...' : `${searchResults.length} kết quả`}
          </span>
        )}
      </div>

      {/* List */}
      <div style={{ flex: 1, overflowY: 'auto', padding: isMobile ? 8 : 16 }}>

        {/* Search results */}
        {isSearching && (
          <>
            {searchLoading && (
              <div style={{ padding: 24, textAlign: 'center', color: 'var(--text-muted)', fontSize: 12 }}>Đang tìm kiếm...</div>
            )}
            {!searchLoading && searchResults.length === 0 && (
              <div style={{ padding: 24, textAlign: 'center', color: 'var(--text-muted)', fontSize: 12 }}>Không tìm thấy bài nào.</div>
            )}
            {!searchLoading && searchResults.map(post => (
              <OrphanCard
                key={post.slug}
                group={{
                  to_slug: post.slug,
                  to_headline: post.headline,
                  section: post.article_section || '',
                  linkers: [],
                }}
                onSelectPost={onSelectPost}
                isMobile={isMobile}
                aiModel={aiModel}
              />
            ))}
          </>
        )}

        {/* Orphan list (when not searching) */}
        {!isSearching && (
          <>
            {loading && (
              <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>Đang tải...</div>
            )}
            {!loading && orphanGroups.length === 0 && (
              <div style={{ padding: 40, textAlign: 'center' }}>
                <div style={{ fontSize: 32, marginBottom: 12 }}>✓</div>
                <div style={{ color: 'var(--success)', fontWeight: 500, marginBottom: 4 }}>Không còn orphan posts!</div>
                <div style={{ color: 'var(--text-subtle)', fontSize: 12 }}>Tất cả bài đã được link đến</div>
              </div>
            )}
            {!loading && orphanGroups.map(group => (
              <OrphanCard
                key={group.to_slug}
                group={group}
                onSelectPost={onSelectPost}
                isMobile={isMobile}
                aiModel={aiModel}
              />
            ))}
          </>
        )}
      </div>
    </div>
  )
}
