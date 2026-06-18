import { useEffect, useState } from 'react'
import { api } from '../api'
import { sectionColor } from '../sectionColors.js'

const ISSUE_META = {
  orphan_posts:      { label: 'Orphan posts',     color: '#f85149', desc: 'Không có inbound links' },
  no_outbound:       { label: 'No outbound',       color: '#f97316', desc: 'Khong co outbound links' },
  long_title:        { label: 'Title qua dai',     color: '#d29922', desc: 'Title > 60 ky tu' },
  short_title:       { label: 'Title qua ngan',    color: '#d29922', desc: 'Title < 30 ky tu' },
  long_description:  { label: 'Desc qua dai',      color: '#d29922', desc: 'Description > 160 ky tu' },
  short_description: { label: 'Desc qua ngan',     color: '#d29922', desc: 'Description < 70 ky tu' },
  no_keywords:       { label: 'No keywords',       color: '#58a6ff', desc: 'Khong co keywords' },
  low_word_count:    { label: 'Word count thap',   color: '#58a6ff', desc: 'Duoi 300 tu' },
  missing_section:   { label: 'Missing section',   color: '#7c3aed', desc: 'Chua gan section' },
}

export default function AuditView({ onSelectPost }) {
  const [audit, setAudit] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    api.audit()
      .then(data => {
        setAudit(data)
        const firstKey = Object.keys(data?.issues || {})[0]
        if (firstKey) setSelected(firstKey)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>Loading audit...</div>
  )

  if (!audit) return (
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--danger)' }}>Failed to load audit</div>
  )

  const issues = audit.issues || {}
  const totalIssues = Object.values(issues).reduce((a, b) => a + (b?.length || 0), 0)
  const selectedPosts = selected ? (issues[selected] || []) : []
  const meta = selected ? (ISSUE_META[selected] || { label: selected, color: '#7d8590', desc: '' }) : null

  return (
    <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
      {/* Left column: issue types */}
      <div style={{
        width: 260,
        minWidth: 260,
        background: 'var(--surface)',
        borderRight: '1px solid var(--border)',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
      }}>
        <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>SEO Audit</div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
            {totalIssues} issues tim thay
          </div>
        </div>

        <div style={{ padding: '8px 0', flex: 1 }}>
          {Object.entries(ISSUE_META).map(([key, m]) => {
            const count = issues[key]?.length || 0
            if (count === 0) return null
            const isActive = selected === key
            return (
              <button
                key={key}
                onClick={() => setSelected(key)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '9px 16px',
                  background: isActive ? m.color + '18' : 'transparent',
                  borderLeft: `2px solid ${isActive ? m.color : 'transparent'}`,
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.1s',
                }}
                onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.04)' }}
                onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent' }}
              >
                <div>
                  <div style={{ fontSize: 12, color: isActive ? 'var(--text)' : 'var(--text-muted)', fontWeight: isActive ? 500 : 400 }}>
                    {m.label}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-subtle)', marginTop: 1 }}>{m.desc}</div>
                </div>
                <span style={{
                  background: m.color + '25',
                  color: m.color,
                  border: '1px solid ' + m.color + '40',
                  borderRadius: 12,
                  padding: '1px 8px',
                  fontSize: 11,
                  fontWeight: 600,
                  flexShrink: 0,
                }}>{count}</span>
              </button>
            )
          })}

          {/* Issues without meta */}
          {Object.entries(issues)
            .filter(([key]) => !ISSUE_META[key])
            .map(([key, posts]) => {
              const count = posts?.length || 0
              if (count === 0) return null
              const isActive = selected === key
              return (
                <button
                  key={key}
                  onClick={() => setSelected(key)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '9px 16px',
                    background: isActive ? 'rgba(124,58,237,0.12)' : 'transparent',
                    borderLeft: `2px solid ${isActive ? 'var(--accent)' : 'transparent'}`,
                    border: 'none',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.1s',
                  }}
                >
                  <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{key}</span>
                  <span style={{
                    background: 'var(--border)',
                    color: 'var(--text)',
                    borderRadius: 12,
                    padding: '1px 8px',
                    fontSize: 11,
                    fontWeight: 600,
                  }}>{count}</span>
                </button>
              )
            })}
        </div>
      </div>

      {/* Right column: posts */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {selected && meta && (
          <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)', background: 'var(--surface)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                background: meta.color,
                flexShrink: 0,
              }} />
              <div>
                <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>{meta.label}</span>
                <span style={{ fontSize: 12, color: 'var(--text-muted)', marginLeft: 10 }}>{meta.desc}</span>
              </div>
              <span style={{
                marginLeft: 'auto',
                background: meta.color + '20',
                color: meta.color,
                borderRadius: 12,
                padding: '2px 10px',
                fontSize: 12,
                fontWeight: 600,
              }}>{selectedPosts.length} posts</span>
            </div>
          </div>
        )}

        <div>
          {selectedPosts.map((post, i) => {
            const postSectionColor = sectionColor(post.article_section)
            return (
              <div
                key={post.slug}
                onClick={() => onSelectPost && onSelectPost(post.slug)}
                style={{
                  padding: '12px 20px',
                  borderBottom: '1px solid var(--border-2)',
                  cursor: 'pointer',
                  background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 12,
                  transition: 'background 0.1s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-2)'}
                onMouseLeave={e => e.currentTarget.style.background = i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)'}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, color: 'var(--text)', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {post.headline}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-subtle)', marginTop: 2 }}>{post.slug}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                  {post.article_section && (
                    <span style={{
                      background: postSectionColor + '20',
                      color: postSectionColor,
                      border: '1px solid ' + postSectionColor + '40',
                      borderRadius: 20,
                      padding: '1px 8px',
                      fontSize: 10,
                      fontWeight: 500,
                    }}>{post.article_section}</span>
                  )}
                  {post.inbound !== undefined && (
                    <span style={{
                      fontSize: 11,
                      color: (post.inbound || 0) > 0 ? 'var(--success)' : 'var(--danger)',
                      fontWeight: 600,
                    }}>{post.inbound || 0} in</span>
                  )}
                </div>
              </div>
            )
          })}

          {selectedPosts.length === 0 && selected && (
            <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>
              Khong co bai viet nao trong nhom nay
            </div>
          )}

          {!selected && (
            <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>
              Chon loai issue de xem chi tiet
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
