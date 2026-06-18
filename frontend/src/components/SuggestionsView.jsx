import { useEffect, useState } from 'react'
import { api } from '../api'
import { sectionColor } from '../sectionColors.js'
import { Lightbulb, ArrowRight } from 'lucide-react'

export default function SuggestionsView({ onSelectPost, bp = 'desktop', refreshKey = 0 }) {
  const [data, setData]       = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch]   = useState('')

  useEffect(() => {
    setLoading(true)
    api.suggestions()
      .then(rows => setData(rows))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [refreshKey])

  // Group by orphan (to_slug)
  const groups = {}
  data.forEach(row => {
    if (!groups[row.to_slug]) {
      groups[row.to_slug] = {
        to_slug: row.to_slug,
        to_headline: row.to_headline,
        section: row.section,
        linkers: [],
      }
    }
    groups[row.to_slug].linkers.push({ slug: row.from_slug, headline: row.from_headline })
  })

  const filtered = Object.values(groups).filter(g => {
    if (!search) return true
    const q = search.toLowerCase()
    return g.to_headline?.toLowerCase().includes(q) || g.section?.toLowerCase().includes(q)
  })

  const isMobile = bp === 'mobile'

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{
        padding: '12px 16px', background: 'var(--surface)',
        borderBottom: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0,
      }}>
        <Lightbulb size={16} color="var(--warning)" strokeWidth={1.8} />
        <div>
          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>Gợi ý Internal Links</span>
          <span style={{ fontSize: 11, color: 'var(--text-muted)', marginLeft: 10 }}>
            Các bài orphan — nên được link từ bài cùng section
          </span>
        </div>
        <span style={{
          marginLeft: 'auto', background: 'rgba(210,153,34,0.15)',
          color: 'var(--warning)', borderRadius: 10, padding: '1px 10px',
          fontSize: 11, fontWeight: 600,
        }}>{filtered.length} bài cần xử lý</span>
      </div>

      {/* Search */}
      <div style={{ padding: '10px 16px', borderBottom: '1px solid var(--border-2)', background: 'var(--surface)', flexShrink: 0 }}>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Tìm bài viết..."
          style={{
            width: '100%', maxWidth: 320,
            background: 'var(--surface-2)', border: '1px solid var(--border)',
            borderRadius: 6, padding: '6px 10px', color: 'var(--text)',
            fontSize: 12, outline: 'none',
          }}
          onFocus={e => e.target.style.borderColor = 'var(--accent)'}
          onBlur={e => e.target.style.borderColor = 'var(--border)'}
        />
      </div>

      {/* List */}
      <div style={{ flex: 1, overflowY: 'auto', padding: isMobile ? 8 : 16 }}>
        {loading && (
          <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>Đang tải...</div>
        )}
        {!loading && filtered.length === 0 && (
          <div style={{ padding: 40, textAlign: 'center' }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>✓</div>
            <div style={{ color: 'var(--success)', fontWeight: 500, marginBottom: 4 }}>Không còn orphan posts!</div>
            <div style={{ color: 'var(--text-subtle)', fontSize: 12 }}>Tất cả bài đã được link đến</div>
          </div>
        )}
        {!loading && filtered.map(group => {
          const sc = sectionColor(group.section)
          return (
            <div key={group.to_slug} style={{
              background: 'var(--surface)', border: '1px solid var(--border)',
              borderRadius: 8, marginBottom: 10, overflow: 'hidden',
            }}>
              {/* Orphan post header */}
              <div style={{
                padding: '10px 14px',
                background: 'rgba(248,81,73,0.06)',
                borderBottom: '1px solid var(--border-2)',
                display: 'flex', alignItems: 'center', gap: 8,
              }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--danger)', flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <span
                    onClick={() => onSelectPost && onSelectPost(group.to_slug)}
                    style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', cursor: 'pointer' }}
                    onMouseEnter={e => e.target.style.color = 'var(--accent-2)'}
                    onMouseLeave={e => e.target.style.color = 'var(--text)'}
                  >{group.to_headline || group.to_slug}</span>
                </div>
                <span style={{
                  fontSize: 9, color: sc, background: sc + '18',
                  border: '1px solid ' + sc + '35', borderRadius: 10,
                  padding: '1px 7px', whiteSpace: 'nowrap', flexShrink: 0,
                }}>{group.section}</span>
                <span style={{
                  fontSize: 10, color: 'var(--danger)', background: 'rgba(248,81,73,0.12)',
                  borderRadius: 4, padding: '1px 7px', flexShrink: 0,
                }}>0 inbound</span>
              </div>

              {/* Suggested linkers */}
              <div style={{ padding: '6px 0' }}>
                <div style={{ padding: '4px 14px 6px', fontSize: 10, color: 'var(--text-subtle)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Các bài nên link đến bài này:
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
            </div>
          )
        })}
      </div>
    </div>
  )
}
