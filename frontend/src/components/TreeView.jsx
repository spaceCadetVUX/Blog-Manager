import { useEffect, useState } from 'react'
import { api } from '../api'
import { sectionColor } from '../sectionColors.js'
import { ChevronRight, ChevronDown, AlertTriangle, ExternalLink } from 'lucide-react'

function PostRow({ post, onSelectPost }) {
  const isOrphan = (post.inbound || 0) === 0
  const color = sectionColor(post.article_section || '')

  return (
    <div
      onClick={() => onSelectPost?.(post.slug)}
      style={{
        display: 'flex', alignItems: 'flex-start', gap: 10,
        padding: '8px 14px 8px 36px', cursor: 'pointer',
        borderBottom: '1px solid var(--border-2)',
        transition: 'background 0.1s',
      }}
      onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-2)'}
      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
    >
      {/* dot */}
      <div style={{
        width: 6, height: 6, borderRadius: '50%', marginTop: 5, flexShrink: 0,
        background: isOrphan ? 'var(--danger)' : color,
        opacity: isOrphan ? 1 : 0.7,
      }} />

      <div style={{ flex: 1, minWidth: 0 }}>
        {/* headline */}
        <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)', lineHeight: 1.4, marginBottom: 2 }}>
          {post.headline || post.slug}
        </div>

        {/* meta description */}
        {post.description && (
          <div style={{
            fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.5,
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            maxWidth: '100%', marginBottom: 4,
          }}>
            {post.description}
          </div>
        )}

        {/* meta row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          {post.author && (
            <span style={{ fontSize: 10, color: 'var(--text-subtle)' }}>👤 {post.author}</span>
          )}
          {post.date_modified && (
            <span style={{ fontSize: 10, color: 'var(--text-subtle)' }}>
              ✏️ {new Date(post.date_modified).toLocaleDateString('vi-VN')}
            </span>
          )}
          <span style={{
            fontSize: 10, padding: '0 6px', borderRadius: 8,
            background: isOrphan ? 'rgba(248,81,73,0.1)' : 'rgba(63,185,80,0.08)',
            color: isOrphan ? 'var(--danger)' : 'var(--success)',
          }}>
            {post.inbound || 0} in · {post.outbound || 0} out
          </span>
          {isOrphan && (
            <span style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 10, color: 'var(--danger)' }}>
              <AlertTriangle size={10} /> orphan
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

function SectionGroup({ section, posts, onSelectPost, defaultOpen = true, forceOpen = false }) {
  const [open, setOpen] = useState(defaultOpen)
  const isOpen = forceOpen || open
  const color = sectionColor(section)
  const orphanCount = posts.filter(p => (p.inbound || 0) === 0).length

  return (
    <div style={{ marginBottom: 4 }}>
      {/* Section header */}
      <div
        onClick={() => !forceOpen && setOpen(o => !o)}
        style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '10px 14px', cursor: forceOpen ? 'default' : 'pointer',
          background: isOpen ? color + '0d' : 'transparent',
          borderLeft: `3px solid ${isOpen ? color : 'transparent'}`,
          transition: 'all 0.1s', userSelect: 'none',
        }}
        onMouseEnter={e => { if (!isOpen && !forceOpen) e.currentTarget.style.background = 'rgba(255,255,255,0.04)' }}
        onMouseLeave={e => { if (!isOpen && !forceOpen) e.currentTarget.style.background = 'transparent' }}
      >
        {isOpen
          ? <ChevronDown size={14} color={color} />
          : <ChevronRight size={14} color="var(--text-subtle)" />
        }
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: color, flexShrink: 0 }} />
        <span style={{ fontSize: 13, fontWeight: 600, color: isOpen ? 'var(--text)' : 'var(--text-muted)', flex: 1 }}>
          {section}
        </span>
        <span style={{
          fontSize: 11, color: 'var(--text-subtle)',
          background: 'var(--surface-2)', border: '1px solid var(--border)',
          borderRadius: 10, padding: '1px 8px',
        }}>{posts.length} bài</span>
        {orphanCount > 0 && (
          <span style={{
            fontSize: 10, color: 'var(--danger)',
            background: 'rgba(248,81,73,0.1)', border: '1px solid rgba(248,81,73,0.25)',
            borderRadius: 10, padding: '1px 7px',
          }}>{orphanCount} orphan</span>
        )}
      </div>

      {/* Posts */}
      {isOpen && (
        <div style={{ background: 'var(--bg)' }}>
          {posts.map(post => (
            <PostRow key={post.slug} post={post} onSelectPost={onSelectPost} />
          ))}
        </div>
      )}
    </div>
  )
}

export default function TreeView({ onSelectPost, bp = 'desktop' }) {
  const [posts, setPosts]       = useState([])
  const [loading, setLoading]   = useState(true)
  const [search, setSearch]     = useState('')
  const [sortBy, setSortBy]     = useState('headline')
  const [orphanOnly, setOrphanOnly] = useState(false)

  useEffect(() => {
    setLoading(true)
    api.posts({ limit: 500, sort: 'headline', order: 'asc' })
      .then(res => setPosts(res.items ?? []))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  // Filter + sort
  const filtered = posts.filter(p => {
    if (orphanOnly && (p.inbound || 0) > 0) return false
    if (!search.trim()) return true
    const q = search.toLowerCase()
    return (
      p.headline?.toLowerCase().includes(q) ||
      p.description?.toLowerCase().includes(q) ||
      p.slug?.toLowerCase().includes(q)
    )
  })

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'headline') return (a.headline || '').localeCompare(b.headline || '')
    if (sortBy === 'modified') return (b.date_modified || '') > (a.date_modified || '') ? 1 : -1
    if (sortBy === 'inbound')  return (b.inbound || 0) - (a.inbound || 0)
    return 0
  })

  // Group by section
  const grouped = {}
  const noSection = []
  sorted.forEach(p => {
    const sec = p.article_section || ''
    if (!sec) { noSection.push(p); return }
    if (!grouped[sec]) grouped[sec] = []
    grouped[sec].push(p)
  })

  const totalOrphans = filtered.filter(p => (p.inbound || 0) === 0).length
  const isMobile = bp === 'mobile'

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

      {/* Toolbar */}
      <div style={{
        padding: '8px 14px', background: 'var(--surface)',
        borderBottom: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0, flexWrap: 'wrap',
      }}>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Tìm bài viết..."
          style={{
            background: 'var(--surface-2)', border: '1px solid var(--border)',
            borderRadius: 6, padding: '5px 10px', color: 'var(--text)',
            fontSize: 12, outline: 'none', width: 220,
          }}
          onFocus={e => e.target.style.borderColor = 'var(--accent)'}
          onBlur={e => e.target.style.borderColor = 'var(--border)'}
        />

        <select
          value={sortBy}
          onChange={e => setSortBy(e.target.value)}
          style={{
            background: 'var(--surface-2)', border: '1px solid var(--border)',
            color: 'var(--text)', borderRadius: 6, padding: '5px 10px',
            fontSize: 12, cursor: 'pointer', outline: 'none',
          }}
        >
          <option value="headline">Sắp xếp: Tên A-Z</option>
          <option value="modified">Sắp xếp: Mới nhất</option>
          <option value="inbound">Sắp xếp: Nhiều link nhất</option>
        </select>

        <button
          onClick={() => setOrphanOnly(v => !v)}
          style={{
            padding: '5px 10px', borderRadius: 6, fontSize: 12, cursor: 'pointer',
            border: `1px solid ${orphanOnly ? 'var(--danger)' : 'var(--border)'}`,
            background: orphanOnly ? 'rgba(248,81,73,0.12)' : 'transparent',
            color: orphanOnly ? 'var(--danger)' : 'var(--text-muted)',
            transition: 'all 0.12s',
          }}
        >
          {orphanOnly ? '⚠ Orphans' : 'Orphans'}
        </button>

        <div style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--text-subtle)', display: 'flex', gap: 12 }}>
          <span><b style={{ color: 'var(--text)' }}>{filtered.length}</b> bài</span>
          {totalOrphans > 0 && (
            <span style={{ color: 'var(--danger)' }}><b>{totalOrphans}</b> orphan</span>
          )}
          {loading && <span style={{ color: 'var(--warning)' }}>Đang tải...</span>}
        </div>
      </div>

      {/* Tree */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {Object.entries(grouped).map(([section, sectionPosts]) => (
          <SectionGroup
            key={section}
            section={section}
            posts={sectionPosts}
            onSelectPost={onSelectPost}
            defaultOpen={Object.keys(grouped).length <= 6}
            forceOpen={!!search.trim() || orphanOnly}
          />
        ))}
        {noSection.length > 0 && (
          <SectionGroup
            key="__no_section__"
            section="(Chưa phân loại)"
            posts={noSection}
            onSelectPost={onSelectPost}
            defaultOpen={false}
            forceOpen={!!search.trim() || orphanOnly}
          />
        )}
        {!loading && filtered.length === 0 && (
          <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>
            Không tìm thấy bài nào.
          </div>
        )}
      </div>
    </div>
  )
}
