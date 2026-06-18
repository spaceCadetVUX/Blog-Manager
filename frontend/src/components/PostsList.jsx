import { useEffect, useState } from 'react'
import { Search, ChevronUp, ChevronDown } from 'lucide-react'
import { api } from '../api'
import { sectionColor } from '../sectionColors.js'

function SectionBadge({ section }) {
  const color = sectionColor(section)
  return (
    <span style={{
      background: color + '20',
      color: color,
      border: '1px solid ' + color + '40',
      borderRadius: 20,
      padding: '1px 8px',
      fontSize: 10,
      fontWeight: 500,
      whiteSpace: 'nowrap',
    }}>{section}</span>
  )
}

export default function PostsList({ onSelectPost }) {
  const [posts, setPosts] = useState([])
  const [sections, setSections] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterSection, setFilterSection] = useState('')
  const [sortKey, setSortKey] = useState('date_modified')
  const [sortDir, setSortDir] = useState('desc')
  const [total, setTotal] = useState(0)

  useEffect(() => {
    api.sections().then(rows => setSections(rows.map(r => r.article_section))).catch(console.error)
  }, [])

  useEffect(() => {
    setLoading(true)
    const params = { sort: sortKey, order: sortDir }
    if (filterSection) params.section = filterSection
    api.posts(params)
      .then(data => { setPosts(data.items || []); setTotal(data.total ?? (data.items || []).length) })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [filterSection, sortKey, sortDir])

  const filtered = posts.filter(p => {
    if (!search) return true
    const q = search.toLowerCase()
    return (p.headline || '').toLowerCase().includes(q) || (p.slug || '').toLowerCase().includes(q)
  })

  const handleSort = key => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortKey(key); setSortDir('desc') }
  }

  const SortIcon = ({ k }) => {
    if (sortKey !== k) return <ChevronUp size={12} style={{ opacity: 0.3 }} />
    return sortDir === 'asc'
      ? <ChevronUp size={12} style={{ color: 'var(--accent-2)' }} />
      : <ChevronDown size={12} style={{ color: 'var(--accent-2)' }} />
  }

  const SortBtn = ({ k, label }) => (
    <button
      onClick={() => handleSort(k)}
      style={{
        background: 'transparent',
        border: 'none',
        color: sortKey === k ? 'var(--accent-2)' : 'var(--text-muted)',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: 3,
        fontSize: 11,
        fontWeight: 500,
        padding: 0,
      }}
    >{label} <SortIcon k={k} /></button>
  )

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Toolbar */}
      <div style={{
        padding: '12px 16px',
        background: 'var(--surface)',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        flexWrap: 'wrap',
      }}>
        {/* Search */}
        <div style={{ position: 'relative', flex: '1 1 200px', maxWidth: 320 }}>
          <Search size={14} style={{
            position: 'absolute',
            left: 10,
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'var(--text-muted)',
            pointerEvents: 'none',
          }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Tim kiem bai viet..."
            style={{
              width: '100%',
              background: 'var(--surface-2)',
              border: '1px solid var(--border)',
              borderRadius: 6,
              padding: '6px 10px 6px 30px',
              color: 'var(--text)',
              fontSize: 12,
              outline: 'none',
            }}
            onFocus={e => e.target.style.borderColor = 'var(--accent)'}
            onBlur={e => e.target.style.borderColor = 'var(--border)'}
          />
        </div>

        {/* Section filter */}
        <select
          value={filterSection}
          onChange={e => setFilterSection(e.target.value)}
          style={{
            background: 'var(--surface-2)',
            border: '1px solid var(--border)',
            color: 'var(--text)',
            borderRadius: 6,
            padding: '6px 10px',
            fontSize: 12,
            cursor: 'pointer',
            outline: 'none',
          }}
        >
          <option value="">Tat ca</option>
          {sections.map(s => <option key={s} value={s}>{s}</option>)}
        </select>

        <div style={{ marginLeft: 'auto', fontSize: 12, color: 'var(--text-muted)' }}>
          {search ? `${filtered.length} / ${total}` : total} bài viết
        </div>
      </div>

      {/* Table */}
      <div style={{ flex: 1, overflow: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{
              background: 'var(--surface)',
              borderBottom: '1px solid var(--border)',
              position: 'sticky',
              top: 0,
              zIndex: 1,
            }}>
              <th style={{ padding: '10px 16px', textAlign: 'left', fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Tieu de</th>
              <th style={{ padding: '10px 12px', textAlign: 'left', fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>Section</th>
              <th style={{ padding: '10px 12px', textAlign: 'right' }}>
                <SortBtn k="word_count" label="Tu" />
              </th>
              <th style={{ padding: '10px 12px', textAlign: 'right' }}>
                <SortBtn k="inbound_links" label="Inbound" />
              </th>
              <th style={{ padding: '10px 12px', textAlign: 'right', fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Out</th>
              <th style={{ padding: '10px 16px', textAlign: 'right' }}>
                <SortBtn k="date_modified" label="Ngay" />
              </th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr><td colSpan={6} style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>Loading...</td></tr>
            )}
            {!loading && filtered.map((post, i) => (
              <tr
                key={post.slug}
                onClick={() => onSelectPost && onSelectPost(post.slug)}
                style={{
                  background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)',
                  borderBottom: '1px solid var(--border-2)',
                  cursor: 'pointer',
                  transition: 'background 0.1s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-2)'}
                onMouseLeave={e => e.currentTarget.style.background = i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)'}
              >
                <td style={{ padding: '9px 16px', maxWidth: 340 }}>
                  <div style={{
                    fontSize: 12,
                    color: 'var(--text)',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}>{post.headline}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-subtle)', marginTop: 1 }}>{post.slug}</div>
                </td>
                <td style={{ padding: '9px 12px' }}>
                  {post.article_section && <SectionBadge section={post.article_section} />}
                </td>
                <td style={{ padding: '9px 12px', textAlign: 'right', fontSize: 12, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                  {post.word_count ? post.word_count.toLocaleString() : '-'}
                </td>
                <td style={{ padding: '9px 12px', textAlign: 'right' }}>
                  <span style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: (post.inbound || 0) > 0 ? 'var(--success)' : 'var(--danger)',
                  }}>{post.inbound || 0}</span>
                </td>
                <td style={{ padding: '9px 12px', textAlign: 'right', fontSize: 12, color: 'var(--text-muted)' }}>
                  {post.outbound || 0}
                </td>
                <td style={{ padding: '9px 16px', textAlign: 'right', fontSize: 11, color: 'var(--text-subtle)', whiteSpace: 'nowrap' }}>
                  {post.date_modified ? new Date(post.date_modified).toLocaleDateString('vi-VN') : '-'}
                </td>
              </tr>
            ))}
            {!loading && filtered.length === 0 && (
              <tr><td colSpan={6} style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>Khong tim thay bai viet</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
