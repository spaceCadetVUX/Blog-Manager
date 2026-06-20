import { useEffect, useState } from 'react'
import { Search, ChevronUp, ChevronDown, Download } from 'lucide-react'
import { api } from '../api'
import { sectionColor } from '../sectionColors.js'

function SectionBadge({ section }) {
  const color = sectionColor(section)
  return (
    <span style={{
      background: color + '20', color, border: '1px solid ' + color + '40',
      borderRadius: 20, padding: '1px 8px', fontSize: 10, fontWeight: 500, whiteSpace: 'nowrap',
    }}>{section}</span>
  )
}

export default function PostsList({ onSelectPost, bp = 'desktop' }) {
  const [posts, setPosts]               = useState([])
  const [sections, setSections]         = useState([])
  const [loading, setLoading]           = useState(true)
  const [search, setSearch]             = useState('')
  const [filterSection, setFilterSection] = useState('')
  const [sortKey, setSortKey]           = useState('date_modified')
  const [sortDir, setSortDir]           = useState('desc')
  const [total, setTotal]               = useState(0)
  const [page, setPage]                 = useState(0)
  const [dateFrom, setDateFrom]         = useState('')
  const [dateTo, setDateTo]             = useState('')
  const PAGE_SIZE = 20

  const isMobile = bp === 'mobile'
  const isTablet = bp === 'tablet'

  const exportCSV = () => {
    const headers = ['Tiêu đề', 'Slug', 'Section', 'Từ', 'Inbound', 'Outbound', 'Ngày cập nhật']
    const rows = filtered.map(p => [
      `"${(p.headline || '').replace(/"/g, '""')}"`,
      p.slug || '',
      p.article_section || '',
      p.word_count || 0,
      p.inbound || 0,
      p.outbound || 0,
      p.date_modified ? new Date(p.date_modified).toLocaleDateString('vi-VN') : '',
    ])
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n')
    const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href     = url
    a.download = `knxstore-posts-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  useEffect(() => {
    api.sections().then(rows => setSections(rows.map(r => r.article_section))).catch(console.error)
  }, [])

  useEffect(() => { setPage(0) }, [filterSection, sortKey, sortDir, search, dateFrom, dateTo])

  useEffect(() => {
    setLoading(true)
    const params = { sort: sortKey, order: sortDir, limit: PAGE_SIZE, offset: page * PAGE_SIZE }
    if (filterSection) params.section = filterSection
    api.posts(params)
      .then(data => { setPosts(data.items || []); setTotal(data.total ?? (data.items || []).length) })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [filterSection, sortKey, sortDir, page])

  const filtered = posts.filter(p => {
    if (search) {
      const q = search.toLowerCase()
      if (!(p.headline || '').toLowerCase().includes(q) && !(p.slug || '').toLowerCase().includes(q)) return false
    }
    if (dateFrom || dateTo) {
      const iso = (p.date_modified || '').slice(0, 10)
      if (!iso) return false
      if (dateFrom && iso < dateFrom) return false
      if (dateTo   && iso > dateTo)   return false
    }
    return true
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
        background: 'transparent', border: 'none',
        color: sortKey === k ? 'var(--accent-2)' : 'var(--text-muted)',
        cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 3,
        fontSize: 11, fontWeight: 500, padding: 0,
      }}
    >{label} <SortIcon k={k} /></button>
  )

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Toolbar */}
      <div style={{
        padding: '10px 12px',
        background: 'var(--surface)',
        borderBottom: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap',
      }}>
        <div style={{ position: 'relative', flex: '1 1 160px', maxWidth: 320 }}>
          <Search size={13} style={{
            position: 'absolute', left: 9, top: '50%',
            transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none',
          }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Tìm kiếm bài viết..."
            style={{
              width: '100%', background: 'var(--surface-2)', border: '1px solid var(--border)',
              borderRadius: 6, padding: '6px 10px 6px 28px', color: 'var(--text)',
              fontSize: 12, outline: 'none',
            }}
            onFocus={e => e.target.style.borderColor = 'var(--accent)'}
            onBlur={e => e.target.style.borderColor = 'var(--border)'}
          />
        </div>

        {!isMobile && (
          <select
            value={filterSection}
            onChange={e => setFilterSection(e.target.value)}
            style={{
              background: 'var(--surface-2)', border: '1px solid var(--border)',
              color: 'var(--text)', borderRadius: 6, padding: '6px 10px',
              fontSize: 12, cursor: 'pointer', outline: 'none',
            }}
          >
            <option value="">Tất cả</option>
            {sections.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        )}

        {/* Date range */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <span style={{ fontSize: 10, color: 'var(--text-subtle)', whiteSpace: 'nowrap' }}>Sửa:</span>
          {[['from', dateFrom, setDateFrom], ['to', dateTo, setDateTo]].map(([which, val, setVal]) => (
            <input
              key={which}
              type="date"
              value={val}
              onChange={e => setVal(e.target.value)}
              style={{
                padding: '4px 6px', fontSize: 11, borderRadius: 6,
                border: `1px solid ${val ? 'var(--accent)' : 'var(--border)'}`,
                background: val ? 'rgba(6,182,212,0.06)' : 'var(--surface-2)',
                color: val ? 'var(--accent-2)' : 'var(--text-muted)',
                outline: 'none', colorScheme: 'dark', cursor: 'pointer',
              }}
            />
          ))}
          {(dateFrom || dateTo) && (
            <button onClick={() => { setDateFrom(''); setDateTo('') }}
              style={{ fontSize: 13, padding: '1px 5px', borderRadius: 4, border: '1px solid var(--border)', background: 'transparent', color: 'var(--text-muted)', cursor: 'pointer', lineHeight: 1 }}
            >×</button>
          )}
        </div>

        <div style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
          {(search || dateFrom || dateTo) ? `${filtered.length} / ${total}` : total} bài
        </div>

        <button
          onClick={exportCSV}
          title="Xuất CSV"
          style={{
            display: 'flex', alignItems: 'center', gap: 5,
            padding: '5px 10px', borderRadius: 6,
            border: '1px solid var(--border)', background: 'transparent',
            color: 'var(--text-muted)', fontSize: 11, cursor: 'pointer',
            transition: 'all 0.15s', whiteSpace: 'nowrap',
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent-2)' }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-muted)' }}
        >
          <Download size={12} />
          {!isMobile && 'CSV'}
        </button>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflow: 'auto' }}>
        {isMobile ? (
          /* Card view on mobile */
          <div style={{ padding: 8 }}>
            {loading && (
              <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>Đang tải...</div>
            )}
            {!loading && filtered.map(post => (
              <div
                key={post.slug}
                onClick={() => onSelectPost && onSelectPost(post.slug, filtered.map(p => p.slug))}
                style={{
                  background: 'var(--surface)', border: '1px solid var(--border)',
                  borderRadius: 8, padding: '12px 14px', marginBottom: 8,
                  cursor: 'pointer', transition: 'border-color 0.1s',
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
              >
                <div style={{ fontSize: 13, color: 'var(--text)', fontWeight: 500, marginBottom: 6, lineHeight: 1.4 }}>
                  {post.headline}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                  {post.article_section && <SectionBadge section={post.article_section} />}
                  <span style={{ fontSize: 11, color: (post.inbound || 0) > 0 ? 'var(--success)' : 'var(--danger)', fontWeight: 600 }}>
                    {post.inbound || 0} inbound
                  </span>
                  {post.word_count > 0 && (
                    <span style={{ fontSize: 11, color: 'var(--text-subtle)' }}>{post.word_count.toLocaleString()} từ</span>
                  )}
                </div>
              </div>
            ))}
            {!loading && filtered.length === 0 && (
              <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>Không tìm thấy bài viết</div>
            )}
          </div>
        ) : (
          /* Table view on desktop/tablet */
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)', position: 'sticky', top: 0, zIndex: 1 }}>
                {[
                  { label: 'Tiêu đề',  align: 'left',  pad: '10px 16px', sortKey: null },
                  { label: 'Section',  align: 'left',  pad: '10px 12px', sortKey: null },
                  ...(!isTablet ? [{ label: 'Từ',      align: 'right', pad: '10px 12px', sortKey: 'word_count' }] : []),
                  { label: 'Inbound',  align: 'right', pad: '10px 12px', sortKey: 'inbound_links' },
                  { label: 'Out',      align: 'right', pad: '10px 12px', sortKey: null },
                  ...(!isTablet ? [{ label: 'Ngày',    align: 'right', pad: '10px 16px', sortKey: 'date_modified' }] : []),
                ].map(({ label, align, pad, sortKey: sk }) => (
                  <th key={label} style={{ padding: pad, textAlign: align, fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>
                    {sk ? (
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: align === 'right' ? 'flex-end' : 'flex-start' }}>
                        <SortBtn k={sk} label={label} />
                      </div>
                    ) : label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr><td colSpan={isTablet ? 4 : 6} style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>Đang tải...</td></tr>
              )}
              {!loading && filtered.map((post, i) => (
                <tr
                  key={post.slug}
                  onClick={() => onSelectPost && onSelectPost(post.slug, filtered.map(p => p.slug))}
                  style={{
                    background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)',
                    borderBottom: '1px solid var(--border-2)',
                    cursor: 'pointer', transition: 'background 0.1s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-2)'}
                  onMouseLeave={e => e.currentTarget.style.background = i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)'}
                >
                  <td style={{ padding: '12px 16px', maxWidth: isTablet ? 260 : 480 }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                      {/* Thumbnail */}
                      <div style={{
                        width: 90, height: 68, borderRadius: 6, flexShrink: 0, overflow: 'hidden',
                        background: 'var(--surface-2)', border: '1px solid var(--border-2)',
                      }}>
                        {post.image
                          ? <img src={post.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} onError={e => { e.target.style.display = 'none' }} />
                          : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, color: 'var(--border)' }}>✦</div>
                        }
                      </div>
                      <div style={{ minWidth: 0, flex: 1 }}>
                        {/* Headline / Meta title */}
                        <div style={{ fontSize: 12, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: 600, lineHeight: 1.4 }}>
                          {post.headline || '—'}
                        </div>
                        {/* URL */}
                        {post.url && (
                          <div style={{ fontSize: 10, color: 'var(--accent-2)', marginTop: 3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', opacity: 0.75 }}>
                            {post.url}
                          </div>
                        )}
                        {/* Meta description */}
                        {post.description && !isTablet && (
                          <div style={{
                            fontSize: 11, color: 'var(--text-muted)', marginTop: 4,
                            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                            overflow: 'hidden', lineHeight: 1.45,
                          }}>
                            {post.description}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '12px 12px', verticalAlign: 'middle' }}>
                    {post.article_section && <SectionBadge section={post.article_section} />}
                  </td>
                  {!isTablet && (
                    <td style={{ padding: '12px 12px', textAlign: 'right', fontSize: 12, color: 'var(--text-muted)', whiteSpace: 'nowrap', verticalAlign: 'middle' }}>
                      {post.word_count ? post.word_count.toLocaleString() : '-'}
                    </td>
                  )}
                  <td style={{ padding: '12px 12px', textAlign: 'right', verticalAlign: 'middle' }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: (post.inbound || 0) > 0 ? 'var(--success)' : 'var(--danger)' }}>
                      {post.inbound || 0}
                    </span>
                  </td>
                  <td style={{ padding: '12px 12px', textAlign: 'right', fontSize: 12, color: 'var(--text-muted)', verticalAlign: 'middle' }}>
                    {post.outbound || 0}
                  </td>
                  {!isTablet && (
                    <td style={{ padding: '12px 16px', textAlign: 'right', fontSize: 11, color: 'var(--text-subtle)', whiteSpace: 'nowrap', verticalAlign: 'middle' }}>
                      {post.date_modified ? new Date(post.date_modified).toLocaleDateString('vi-VN') : '-'}
                    </td>
                  )}
                </tr>
              ))}
              {!loading && filtered.length === 0 && (
                <tr><td colSpan={isTablet ? 4 : 6} style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>Không tìm thấy bài viết</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {(() => {
        const totalPages = Math.ceil(total / PAGE_SIZE)
        if (totalPages <= 1) return null
        return (
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4,
            padding: '10px 16px', borderTop: '1px solid var(--border)',
            background: 'var(--surface)', flexShrink: 0,
          }}>
            <button
              onClick={() => setPage(0)} disabled={page === 0}
              style={{ padding: '4px 8px', borderRadius: 5, border: '1px solid var(--border)', background: 'transparent', color: page === 0 ? 'var(--text-subtle)' : 'var(--text-muted)', cursor: page === 0 ? 'default' : 'pointer', fontSize: 12 }}
            >«</button>
            <button
              onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}
              style={{ padding: '4px 8px', borderRadius: 5, border: '1px solid var(--border)', background: 'transparent', color: page === 0 ? 'var(--text-subtle)' : 'var(--text-muted)', cursor: page === 0 ? 'default' : 'pointer', fontSize: 12 }}
            >‹</button>

            {Array.from({ length: totalPages }, (_, i) => i)
              .filter(i => Math.abs(i - page) <= 2)
              .map(i => (
                <button key={i} onClick={() => setPage(i)}
                  style={{
                    padding: '4px 9px', borderRadius: 5, fontSize: 12, cursor: 'pointer',
                    border: `1px solid ${i === page ? 'var(--accent)' : 'var(--border)'}`,
                    background: i === page ? 'rgba(6,182,212,0.12)' : 'transparent',
                    color: i === page ? 'var(--accent-2)' : 'var(--text-muted)',
                    fontWeight: i === page ? 600 : 400,
                  }}
                >{i + 1}</button>
              ))}

            <button
              onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1}
              style={{ padding: '4px 8px', borderRadius: 5, border: '1px solid var(--border)', background: 'transparent', color: page >= totalPages - 1 ? 'var(--text-subtle)' : 'var(--text-muted)', cursor: page >= totalPages - 1 ? 'default' : 'pointer', fontSize: 12 }}
            >›</button>
            <button
              onClick={() => setPage(totalPages - 1)} disabled={page >= totalPages - 1}
              style={{ padding: '4px 8px', borderRadius: 5, border: '1px solid var(--border)', background: 'transparent', color: page >= totalPages - 1 ? 'var(--text-subtle)' : 'var(--text-muted)', cursor: page >= totalPages - 1 ? 'default' : 'pointer', fontSize: 12 }}
            >»</button>

            <span style={{ fontSize: 11, color: 'var(--text-subtle)', marginLeft: 4 }}>
              Trang {page + 1} / {totalPages}
            </span>
          </div>
        )
      })()}
    </div>
  )
}
