import { useEffect, useState, useRef } from 'react'
import { X, ExternalLink, AlertTriangle, ChevronLeft, ChevronRight } from 'lucide-react'
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
      padding: '2px 10px',
      fontSize: 11,
      fontWeight: 500,
    }}>{section}</span>
  )
}

function LinkItem({ link, onNavigate }) {
  const slug    = link.to_slug || link.from_slug || ''
  const title   = link.headline || slug
  const section = link.article_section || ''
  const anchor  = link.anchor || ''
  const color   = sectionColor(section)

  return (
    <div
      onClick={() => onNavigate(slug)}
      style={{
        padding: '7px 10px',
        borderRadius: 6,
        cursor: 'pointer',
        marginBottom: 2,
        transition: 'background 0.1s',
        borderLeft: `2px solid ${color}40`,
      }}
      onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-2)'}
      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: anchor ? 3 : 0 }}>
        <span style={{ fontSize: 12, color: 'var(--text)', lineHeight: 1.4, flex: 1 }}>{title}</span>
        {section && (
          <span style={{
            fontSize: 9, color: color,
            background: color + '18', border: '1px solid ' + color + '35',
            borderRadius: 10, padding: '1px 6px', whiteSpace: 'nowrap', flexShrink: 0,
          }}>{section}</span>
        )}
      </div>
      {anchor && (
        <div style={{ fontSize: 10, color: 'var(--text-subtle)', fontStyle: 'italic', marginTop: 1 }}>
          anchor: "{anchor.length > 60 ? anchor.slice(0, 60) + '…' : anchor}"
        </div>
      )}
    </div>
  )
}

export default function PostDetail({ slug, onClose, onNavigate, navList = [], bp = 'desktop' }) {
  const panelWidth  = bp === 'mobile' ? '100vw' : bp === 'tablet' ? 420 : 480
  const navIdx      = navList.indexOf(slug)
  const hasPrev     = navIdx > 0
  const hasNext     = navIdx >= 0 && navIdx < navList.length - 1
  const goToPrev    = () => hasPrev  && onNavigate(navList[navIdx - 1])
  const goToNext    = () => hasNext  && onNavigate(navList[navIdx + 1])
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!slug) return
    setLoading(true)
    setPost(null)
    api.post(slug).then(setPost).catch(console.error).finally(() => setLoading(false))
    requestAnimationFrame(() => setVisible(true))
    return () => setVisible(false)
  }, [slug])

  useEffect(() => {
    const handler = e => {
      if (e.key === 'Escape')                        handleClose()
      if (e.key === 'ArrowLeft'  || e.key === 'h')   goToPrev()
      if (e.key === 'ArrowRight' || e.key === 'l')   goToNext()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  })

  const handleClose = () => {
    setVisible(false)
    setTimeout(onClose, 260)
  }

  const handleNavigate = (newSlug) => {
    setVisible(false)
    setTimeout(() => {
      onNavigate(newSlug)
      requestAnimationFrame(() => setVisible(true))
    }, 100)
  }

  return (
    <>
      {/* Overlay */}
      <div
        onClick={handleClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.5)',
          zIndex: 100,
          backdropFilter: 'blur(2px)',
          opacity: visible ? 1 : 0,
          transition: 'opacity 0.25s',
        }}
      />

      {/* Panel */}
      <div style={{
        position: 'fixed',
        top: 0,
        right: 0,
        height: '100vh',
        width: panelWidth,
        background: 'var(--surface)',
        borderLeft: '1px solid var(--border)',
        zIndex: 101,
        overflowY: 'auto',
        transform: visible ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.25s cubic-bezier(0.4,0,0.2,1)',
        display: 'flex',
        flexDirection: 'column',
      }}>
        {/* Panel header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '14px 16px',
          borderBottom: '1px solid var(--border)',
          position: 'sticky',
          top: 0,
          background: 'var(--surface)',
          zIndex: 1,
        }}>
          {/* Prev / Next */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <button
              onClick={goToPrev}
              disabled={!hasPrev}
              title="Bài trước (← hoặc H)"
              style={{
                background: 'transparent', border: 'none', cursor: hasPrev ? 'pointer' : 'default',
                color: hasPrev ? 'var(--text-muted)' : 'var(--border)',
                padding: '3px 5px', borderRadius: 4, display: 'flex', alignItems: 'center',
                transition: 'color 0.1s',
              }}
              onMouseEnter={e => { if (hasPrev) e.currentTarget.style.color = 'var(--text)' }}
              onMouseLeave={e => { if (hasPrev) e.currentTarget.style.color = 'var(--text-muted)' }}
            ><ChevronLeft size={16} /></button>
            {navList.length > 0 && (
              <span style={{ fontSize: 10, color: 'var(--text-subtle)', minWidth: 36, textAlign: 'center' }}>
                {navIdx + 1}/{navList.length}
              </span>
            )}
            <button
              onClick={goToNext}
              disabled={!hasNext}
              title="Bài sau (→ hoặc L)"
              style={{
                background: 'transparent', border: 'none', cursor: hasNext ? 'pointer' : 'default',
                color: hasNext ? 'var(--text-muted)' : 'var(--border)',
                padding: '3px 5px', borderRadius: 4, display: 'flex', alignItems: 'center',
                transition: 'color 0.1s',
              }}
              onMouseEnter={e => { if (hasNext) e.currentTarget.style.color = 'var(--text)' }}
              onMouseLeave={e => { if (hasNext) e.currentTarget.style.color = 'var(--text-muted)' }}
            ><ChevronRight size={16} /></button>
          </div>

          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', flex: 1, textAlign: 'center' }}>Post Detail</span>
          <button
            onClick={handleClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: 4,
              borderRadius: 4,
              display: 'flex',
              alignItems: 'center',
              transition: 'color 0.1s',
            }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--text)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div style={{ flex: 1, padding: 16 }}>
          {loading && (
            <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: 40 }}>Loading...</div>
          )}

          {!loading && !post && (
            <div style={{ color: 'var(--danger)', textAlign: 'center', padding: 40 }}>Failed to load post</div>
          )}

          {!loading && post && (
            <>
              {/* Thumbnail */}
              {post.image && (
                <div style={{ marginBottom: 16, borderRadius: 8, overflow: 'hidden', border: '1px solid var(--border)' }}>
                  <img src={post.image} alt="" style={{ width: '100%', height: 180, objectFit: 'cover', display: 'block' }} />
                </div>
              )}

              {/* Orphan warning */}
              {(!post.inbound_links || post.inbound_links.length === 0) && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  background: 'rgba(248,81,73,0.1)',
                  border: '1px solid rgba(248,81,73,0.3)',
                  borderRadius: 6,
                  padding: '8px 12px',
                  marginBottom: 16,
                  color: 'var(--danger)',
                  fontSize: 12,
                }}>
                  <AlertTriangle size={14} />
                  <span>Orphan post — khong co bai nao link den</span>
                </div>
              )}

              {/* Meta badges */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12, alignItems: 'center' }}>
                {post.article_section && <SectionBadge section={post.article_section} />}
                {post.word_count && (
                  <span style={{ fontSize: 11, color: 'var(--text-muted)', background: 'var(--border)', padding: '2px 8px', borderRadius: 10 }}>
                    {post.word_count.toLocaleString()} từ
                  </span>
                )}
              </div>

              {/* Title */}
              <h2 style={{ fontSize: 16, fontWeight: 600, color: 'var(--text)', lineHeight: 1.4, marginBottom: 10 }}>
                {post.headline}
              </h2>

              {/* Description */}
              {post.description && (
                <p style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: 16 }}>
                  {post.description}
                </p>
              )}

              {/* Author + Dates */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 16, fontSize: 11, color: 'var(--text-subtle)', alignItems: 'center' }}>
                {post.author && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <span style={{ width: 18, height: 18, borderRadius: '50%', background: 'var(--accent-dim)', border: '1px solid var(--accent)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, color: 'var(--accent-2)', fontWeight: 700, flexShrink: 0 }}>
                      {post.author.charAt(0)}
                    </span>
                    <span style={{ color: 'var(--text-muted)' }}>{post.author}</span>
                  </span>
                )}
                {post.date_published && <span>📅 {new Date(post.date_published).toLocaleDateString('vi-VN')}</span>}
                {post.date_modified && post.date_modified !== post.date_published && (
                  <span>✏️ {new Date(post.date_modified).toLocaleDateString('vi-VN')}</span>
                )}
              </div>

              {/* External link */}
              {post.url && (
                <a
                  href={post.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    fontSize: 12,
                    color: 'var(--accent-2)',
                    textDecoration: 'none',
                    marginBottom: 20,
                    padding: '6px 12px',
                    background: 'var(--accent-dim)',
                    borderRadius: 6,
                    border: '1px solid rgba(6,182,212,0.3)',
                    transition: 'background 0.1s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(6,182,212,0.15)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'var(--accent-dim)'}
                >
                  <ExternalLink size={13} />
                  Mo tren website
                </a>
              )}

              {/* Keywords */}
              {post.keywords && post.keywords.length > 0 && (
                <div style={{ marginBottom: 20 }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>
                    Keywords
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                    {post.keywords.map(kw => (
                      <span key={kw} style={{
                        fontSize: 11,
                        color: 'var(--text-muted)',
                        background: 'var(--surface-2)',
                        border: '1px solid var(--border)',
                        borderRadius: 4,
                        padding: '2px 7px',
                      }}>{kw}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Outbound links */}
              <div style={{ marginBottom: 20 }}>
                <div style={{ marginBottom: 6 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Outbound Links
                    </span>
                    <span style={{
                      background: 'var(--border)', color: 'var(--text)',
                      borderRadius: 10, padding: '0px 6px', fontWeight: 400, fontSize: 10,
                    }}>{post.outbound_links?.length || 0}</span>
                    <span style={{ fontSize: 10, color: 'var(--accent-2)', marginLeft: 2 }}>↗</span>
                  </div>
                  <div style={{ fontSize: 10, color: 'var(--text-subtle)', marginTop: 2 }}>
                    Bài này đang link <strong style={{ color: 'var(--text-muted)' }}>đến</strong> các bài khác — truyền link juice đi
                  </div>
                </div>
                {post.outbound_links && post.outbound_links.length > 0 ? (
                  post.outbound_links.map(link => (
                    <LinkItem key={link.to_slug} link={link} onNavigate={handleNavigate} />
                  ))
                ) : (
                  <p style={{ fontSize: 11, color: 'var(--danger)', padding: '4px 10px', background: 'rgba(248,81,73,0.06)', borderRadius: 6 }}>
                    ⚠ Không có outbound — bài này chưa link sang bài nào
                  </p>
                )}
              </div>

              {/* Inbound links */}
              <div style={{ marginBottom: 16 }}>
                <div style={{ marginBottom: 6 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Inbound Links
                    </span>
                    <span style={{
                      background: (post.inbound_links?.length || 0) > 0 ? 'rgba(63,185,80,0.15)' : 'var(--border)',
                      color: (post.inbound_links?.length || 0) > 0 ? 'var(--success)' : 'var(--text)',
                      borderRadius: 10, padding: '0px 6px', fontWeight: 600, fontSize: 10,
                    }}>{post.inbound_links?.length || 0}</span>
                    <span style={{ fontSize: 10, color: 'var(--success)', marginLeft: 2 }}>↙</span>
                  </div>
                  <div style={{ fontSize: 10, color: 'var(--text-subtle)', marginTop: 2 }}>
                    Các bài khác đang link <strong style={{ color: 'var(--text-muted)' }}>đến</strong> bài này — càng nhiều càng tốt cho SEO
                  </div>
                </div>
                {post.inbound_links && post.inbound_links.length > 0 ? (
                  post.inbound_links.map(link => (
                    <LinkItem key={link.from_slug} link={link} onNavigate={handleNavigate} />
                  ))
                ) : (
                  <p style={{ fontSize: 11, color: 'var(--danger)', padding: '4px 10px', background: 'rgba(248,81,73,0.06)', borderRadius: 6 }}>
                    ⚠ Orphan post — không có bài nào link đến, Google khó tìm thấy
                  </p>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  )
}
