import { useEffect, useState } from 'react'
import { api } from '../api'
import { sectionColor } from '../sectionColors.js'

const ISSUE_META = {
  broken_links:      { label: 'Broken links',       color: '#ff6b6b', desc: 'Link trỏ đến slug không tồn tại' },
  orphan_posts:      { label: 'Orphan posts',       color: '#f85149', desc: 'Không có inbound links' },
  no_outbound:       { label: 'No outbound',        color: '#f97316', desc: 'Không có outbound links' },
  long_title:        { label: 'Title quá dài',      color: '#d29922', desc: 'Title > 60 ký tự' },
  short_title:       { label: 'Title quá ngắn',     color: '#d29922', desc: 'Title < 30 ký tự' },
  long_description:  { label: 'Desc quá dài',       color: '#d29922', desc: 'Description > 160 ký tự' },
  short_description: { label: 'Desc quá ngắn',      color: '#d29922', desc: 'Description < 70 ký tự' },
  no_keywords:       { label: 'No keywords',        color: '#58a6ff', desc: 'Không có keywords' },
  low_word_count:    { label: 'Word count thấp',    color: '#58a6ff', desc: 'Dưới 300 từ' },
  missing_section:   { label: 'Missing section',    color: '#7c3aed', desc: 'Chưa gán section' },
  stale_6m:          { label: 'Cũ 6-12 tháng',     color: '#f59e0b', desc: 'Chưa cập nhật 6-12 tháng' },
  stale_1y:          { label: 'Cũ >1 năm',          color: '#ef4444', desc: 'Chưa cập nhật hơn 1 năm' },
}

export default function AuditView({ onSelectPost, bp = 'desktop' }) {
  const [audit, setAudit]     = useState(null)
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)
  const isCompact = bp === 'mobile' || bp === 'tablet'

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
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
      Đang kiểm tra...
    </div>
  )
  if (!audit) return (
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--danger)' }}>
      Không tải được audit
    </div>
  )

  const issues       = audit.issues || {}
  const totalIssues  = Object.values(issues).reduce((a, b) => a + (b?.length || 0), 0)
  const selectedPosts = selected ? (issues[selected] || []) : []
  const meta          = selected ? (ISSUE_META[selected] || { label: selected, color: '#7d8590', desc: '' }) : null

  const allIssueKeys = [
    ...Object.keys(ISSUE_META).filter(k => (issues[k]?.length || 0) > 0),
    ...Object.keys(issues).filter(k => !ISSUE_META[k] && (issues[k]?.length || 0) > 0),
  ]

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: isCompact ? 'column' : 'row', overflow: 'hidden' }}>

      {/* ── Compact: horizontal chips ── */}
      {isCompact ? (
        <div style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)', padding: '10px 12px', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>SEO Audit</span>
            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{totalIssues} issues</span>
          </div>
          <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 2, scrollbarWidth: 'none' }}>
            {allIssueKeys.map(key => {
              const m     = ISSUE_META[key] || { label: key, color: '#7d8590' }
              const count = issues[key]?.length || 0
              const isActive = selected === key
              return (
                <button
                  key={key}
                  onClick={() => setSelected(key)}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 5,
                    padding: '5px 11px', borderRadius: 20, flexShrink: 0,
                    background: isActive ? m.color + '25' : 'var(--surface-2)',
                    border: `1px solid ${isActive ? m.color : 'var(--border)'}`,
                    color: isActive ? m.color : 'var(--text-muted)',
                    cursor: 'pointer', fontSize: 12, fontWeight: isActive ? 600 : 400,
                    transition: 'all 0.1s',
                  }}
                >
                  {m.label}
                  <span style={{
                    background: m.color + '30', color: m.color,
                    borderRadius: 10, padding: '0 5px', fontSize: 10, fontWeight: 700,
                  }}>{count}</span>
                </button>
              )
            })}
          </div>
        </div>
      ) : (
        /* ── Desktop: left sidebar ── */
        <div style={{
          width: 260, minWidth: 260,
          background: 'var(--surface)', borderRight: '1px solid var(--border)',
          overflowY: 'auto', display: 'flex', flexDirection: 'column',
        }}>
          <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border)' }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>SEO Audit</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{totalIssues} issues tìm thấy</div>
          </div>
          <div style={{ padding: '8px 0', flex: 1 }}>
            {allIssueKeys.map(key => {
              const m     = ISSUE_META[key] || { label: key, color: '#7d8590', desc: '' }
              const count = issues[key]?.length || 0
              const isActive = selected === key
              return (
                <button
                  key={key}
                  onClick={() => setSelected(key)}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '9px 16px',
                    background: isActive ? m.color + '18' : 'transparent',
                    borderLeft: `2px solid ${isActive ? m.color : 'transparent'}`,
                    border: 'none', cursor: 'pointer', textAlign: 'left', transition: 'all 0.1s',
                  }}
                  onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.04)' }}
                  onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent' }}
                >
                  <div>
                    <div style={{ fontSize: 12, color: isActive ? 'var(--text)' : 'var(--text-muted)', fontWeight: isActive ? 500 : 400 }}>{m.label}</div>
                    {m.desc && <div style={{ fontSize: 11, color: 'var(--text-subtle)', marginTop: 1 }}>{m.desc}</div>}
                  </div>
                  <span style={{
                    background: m.color + '25', color: m.color,
                    border: '1px solid ' + m.color + '40',
                    borderRadius: 12, padding: '1px 8px', fontSize: 11, fontWeight: 600, flexShrink: 0,
                  }}>{count}</span>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* ── Post list ── */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {selected && meta && (
          <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', background: 'var(--surface)', position: 'sticky', top: 0, zIndex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: meta.color, flexShrink: 0 }} />
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{meta.label}</span>
              {meta.desc && <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>— {meta.desc}</span>}
              <span style={{
                marginLeft: 'auto',
                background: meta.color + '20', color: meta.color,
                borderRadius: 12, padding: '1px 10px', fontSize: 11, fontWeight: 600,
              }}>{selectedPosts.length}</span>
            </div>
          </div>
        )}

        <div>
          {selectedPosts.map((item, i) => {
            const isBrokenLink = selected === 'broken_links'
            const key = isBrokenLink ? `${item.from_slug}__${item.to_slug}` : item.slug
            const sc  = sectionColor(item.article_section)

            if (isBrokenLink) {
              return (
                <div
                  key={key}
                  style={{
                    padding: isCompact ? '10px 12px' : '12px 20px',
                    borderBottom: '1px solid var(--border-2)',
                    background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)',
                    display: 'flex', alignItems: 'flex-start', gap: 10,
                  }}
                >
                  {/* Source post — clickable */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      onClick={() => onSelectPost && onSelectPost(item.from_slug)}
                      style={{ fontSize: 12, color: 'var(--text)', fontWeight: 500, cursor: 'pointer', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                      title="Mở bài nguồn"
                    >
                      {item.from_headline || item.from_slug}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 4 }}>
                      <span style={{ fontSize: 11, color: 'var(--text-subtle)' }}>link đến</span>
                      <span style={{
                        fontSize: 11, fontWeight: 600, color: '#ff6b6b',
                        background: 'rgba(255,107,107,0.1)', border: '1px solid rgba(255,107,107,0.3)',
                        borderRadius: 4, padding: '1px 7px', fontFamily: 'monospace',
                        maxWidth: isCompact ? 160 : 280, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                        display: 'inline-block',
                      }} title={item.to_slug}>
                        /{item.to_slug}
                      </span>
                    </div>
                    {item.anchor && !isCompact && (
                      <div style={{ fontSize: 10, color: 'var(--text-subtle)', marginTop: 2, fontStyle: 'italic' }}>
                        anchor: "{item.anchor.length > 60 ? item.anchor.slice(0, 60) + '…' : item.anchor}"
                      </div>
                    )}
                  </div>
                  <span style={{ fontSize: 10, color: '#ff6b6b', flexShrink: 0, marginTop: 2 }}>404</span>
                </div>
              )
            }

            return (
              <div
                key={key}
                onClick={() => onSelectPost && onSelectPost(item.slug)}
                style={{
                  padding: isCompact ? '10px 12px' : '12px 20px',
                  borderBottom: '1px solid var(--border-2)',
                  cursor: 'pointer',
                  background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)',
                  display: 'flex', alignItems: 'flex-start', gap: 10,
                  transition: 'background 0.1s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-2)'}
                onMouseLeave={e => e.currentTarget.style.background = i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)'}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, color: 'var(--text)', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {item.headline}
                  </div>
                  {!isCompact && (
                    <div style={{ fontSize: 11, color: 'var(--text-subtle)', marginTop: 2 }}>{item.slug}</div>
                  )}
                  {(selected === 'stale_6m' || selected === 'stale_1y') && item.date_modified && (
                    <div style={{ fontSize: 10, color: 'var(--warning)', marginTop: 2 }}>
                      Cập nhật lần cuối: {new Date(item.date_modified).toLocaleDateString('vi-VN')}
                    </div>
                  )}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                  {item.article_section && !isCompact && (
                    <span style={{
                      background: sc + '20', color: sc, border: '1px solid ' + sc + '40',
                      borderRadius: 20, padding: '1px 8px', fontSize: 10, fontWeight: 500,
                    }}>{item.article_section}</span>
                  )}
                  {item.inbound !== undefined && (
                    <span style={{ fontSize: 11, color: (item.inbound || 0) > 0 ? 'var(--success)' : 'var(--danger)', fontWeight: 600 }}>
                      {item.inbound || 0} in
                    </span>
                  )}
                </div>
              </div>
            )
          })}

          {selectedPosts.length === 0 && selected && (
            <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>
              Không có bài viết nào trong nhóm này
            </div>
          )}
          {!selected && (
            <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>
              Chọn loại issue để xem chi tiết
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
