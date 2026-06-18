import { useEffect, useState } from 'react'
import { X, ExternalLink, AlertTriangle, ChevronLeft, ChevronRight } from 'lucide-react'
import { api, streamAI } from '../api'
import { sectionColor } from '../sectionColors.js'
import AIPanel, { ModelSelect } from './AIPanel.jsx'

function SectionBadge({ section }) {
  const color = sectionColor(section)
  return (
    <span style={{
      background: color + '20', color, border: '1px solid ' + color + '40',
      borderRadius: 20, padding: '2px 10px', fontSize: 11, fontWeight: 500,
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
        padding: '6px 10px', borderRadius: 6, cursor: 'pointer', marginBottom: 2,
        transition: 'background 0.1s', borderLeft: `2px solid ${color}40`,
      }}
      onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-2)'}
      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: anchor ? 2 : 0 }}>
        <span style={{ fontSize: 12, color: 'var(--text)', lineHeight: 1.4, flex: 1 }}>{title}</span>
        {section && (
          <span style={{
            fontSize: 9, color, background: color + '18', border: '1px solid ' + color + '35',
            borderRadius: 10, padding: '1px 6px', whiteSpace: 'nowrap', flexShrink: 0,
          }}>{section}</span>
        )}
      </div>
      {anchor && (
        <div style={{ fontSize: 10, color: 'var(--text-subtle)', fontStyle: 'italic' }}>
          "{anchor.length > 50 ? anchor.slice(0, 50) + '…' : anchor}"
        </div>
      )}
    </div>
  )
}

function ArticleBody({ text }) {
  if (!text) return (
    <div style={{ color: 'var(--text-subtle)', fontSize: 12, fontStyle: 'italic', padding: '20px 0' }}>
      Không có nội dung bài viết trong database
    </div>
  )
  const paragraphs = text.split(/\n{2,}/).filter(Boolean)
  return (
    <div style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.8 }}>
      {paragraphs.map((p, i) => (
        <p key={i} style={{ marginBottom: 14 }}>{p.trim()}</p>
      ))}
    </div>
  )
}

function SectionLabel({ children }) {
  return (
    <div style={{
      fontSize: 10, fontWeight: 600, color: 'var(--text-subtle)',
      textTransform: 'uppercase', letterSpacing: '0.06em',
      marginBottom: 6, marginTop: 20,
    }}>{children}</div>
  )
}

export default function PostDetail({ slug, onClose, onNavigate, navList = [], bp = 'desktop' }) {
  const isMobile  = bp === 'mobile'
  const isTablet  = bp === 'tablet'
  const twoCol    = !isMobile && !isTablet   // desktop only

  const navIdx  = navList.indexOf(slug)
  const hasPrev = navIdx > 0
  const hasNext = navIdx >= 0 && navIdx < navList.length - 1
  const goToPrev = () => hasPrev && onNavigate(navList[navIdx - 1])
  const goToNext = () => hasNext && onNavigate(navList[navIdx + 1])

  const [post, setPost]         = useState(null)
  const [loading, setLoading]   = useState(true)
  const [visible, setVisible]   = useState(false)
  const [activeTab, setActiveTab] = useState('content') // mobile tabs

  const [aiModel, setAiModel]     = useState('claude-haiku-4-5-20251001')
  const [aiContent, setAiContent] = useState('')
  const [aiLoading, setAiLoading] = useState(false)
  const [showAI, setShowAI]       = useState(false)

  const runReview = async () => {
    if (aiLoading) return
    setAiContent('')
    setAiLoading(true)
    setShowAI(true)
    try {
      await streamAI(
        `/ai/review/${slug}`,
        { model: aiModel },
        chunk => setAiContent(prev => prev + chunk),
        () => setAiLoading(false),
      )
    } catch (e) {
      setAiContent(`**Lỗi:** ${e.message}`)
      setAiLoading(false)
    }
  }

  useEffect(() => {
    if (!slug) return
    setLoading(true)
    setPost(null)
    setShowAI(false)
    setAiContent('')
    setActiveTab('content')
    api.post(slug).then(setPost).catch(console.error).finally(() => setLoading(false))
    requestAnimationFrame(() => setVisible(true))
    return () => setVisible(false)
  }, [slug])

  useEffect(() => {
    const handler = e => {
      if (e.key === 'Escape')                       handleClose()
      if (e.key === 'ArrowLeft'  || e.key === 'h')  goToPrev()
      if (e.key === 'ArrowRight' || e.key === 'l')  goToNext()
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
    setTimeout(() => { onNavigate(newSlug); requestAnimationFrame(() => setVisible(true)) }, 100)
  }

  const panelW = '100vw'
  const maxW   = undefined

  const Header = () => (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '12px 16px', borderBottom: '1px solid var(--border)',
      position: 'sticky', top: 0, background: 'var(--surface)', zIndex: 2, flexShrink: 0,
    }}>
      {/* Prev / Next */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <button onClick={goToPrev} disabled={!hasPrev} title="← hoặc H"
          style={{ background: 'none', border: 'none', cursor: hasPrev ? 'pointer' : 'default', color: hasPrev ? 'var(--text-muted)' : 'var(--border)', padding: '3px 5px', borderRadius: 4, display: 'flex' }}
          onMouseEnter={e => { if (hasPrev) e.currentTarget.style.color = 'var(--text)' }}
          onMouseLeave={e => { if (hasPrev) e.currentTarget.style.color = 'var(--text-muted)' }}
        ><ChevronLeft size={16} /></button>
        {navList.length > 0 && (
          <span style={{ fontSize: 10, color: 'var(--text-subtle)', minWidth: 36, textAlign: 'center' }}>
            {navIdx + 1}/{navList.length}
          </span>
        )}
        <button onClick={goToNext} disabled={!hasNext} title="→ hoặc L"
          style={{ background: 'none', border: 'none', cursor: hasNext ? 'pointer' : 'default', color: hasNext ? 'var(--text-muted)' : 'var(--border)', padding: '3px 5px', borderRadius: 4, display: 'flex' }}
          onMouseEnter={e => { if (hasNext) e.currentTarget.style.color = 'var(--text)' }}
          onMouseLeave={e => { if (hasNext) e.currentTarget.style.color = 'var(--text-muted)' }}
        ><ChevronRight size={16} /></button>
      </div>

      <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', flex: 1, textAlign: 'center', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', padding: '0 12px' }}>
        {post?.headline || 'Post Detail'}
      </span>

      <button onClick={handleClose}
        style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 4, borderRadius: 4, display: 'flex' }}
        onMouseEnter={e => e.currentTarget.style.color = 'var(--text)'}
        onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
      ><X size={18} /></button>
    </div>
  )

  // Right panel: metadata + links + AI
  const RightPanel = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0, padding: '16px 16px 24px' }}>
      {/* Orphan warning */}
      {(!post.inbound_links || post.inbound_links.length === 0) && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          background: 'rgba(248,81,73,0.08)', border: '1px solid rgba(248,81,73,0.25)',
          borderRadius: 6, padding: '7px 10px', marginBottom: 14,
          color: 'var(--danger)', fontSize: 11,
        }}>
          <AlertTriangle size={13} />
          Orphan post — chưa có bài nào link đến
        </div>
      )}

      {/* Meta badges */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12, alignItems: 'center' }}>
        {post.article_section && <SectionBadge section={post.article_section} />}
        {post.word_count > 0 && (
          <span style={{ fontSize: 11, color: 'var(--text-muted)', background: 'var(--border)', padding: '2px 8px', borderRadius: 10 }}>
            {post.word_count.toLocaleString()} từ
          </span>
        )}
        <span style={{
          fontSize: 11, padding: '2px 8px', borderRadius: 10,
          background: (post.inbound_links?.length || 0) > 0 ? 'rgba(63,185,80,0.12)' : 'rgba(248,81,73,0.1)',
          color: (post.inbound_links?.length || 0) > 0 ? 'var(--success)' : 'var(--danger)',
        }}>
          {post.inbound_links?.length || 0} in · {post.outbound_links?.length || 0} out
        </span>
      </div>

      {/* Description */}
      {post.description && (
        <>
          <SectionLabel>Description</SectionLabel>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: 4 }}>
            {post.description}
          </p>
          <div style={{ fontSize: 10, color: post.description.length > 160 ? 'var(--danger)' : post.description.length < 70 ? 'var(--warning)' : 'var(--success)', marginBottom: 4 }}>
            {post.description.length} ký tự {post.description.length > 160 ? '(quá dài)' : post.description.length < 70 ? '(quá ngắn)' : '(OK)'}
          </div>
        </>
      )}

      {/* Author + Dates */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 4, fontSize: 11, color: 'var(--text-subtle)', alignItems: 'center', marginTop: 8 }}>
        {post.author && <span>👤 {post.author}</span>}
        {post.date_published && <span>📅 {new Date(post.date_published).toLocaleDateString('vi-VN')}</span>}
        {post.date_modified && post.date_modified !== post.date_published && (
          <span>✏️ {new Date(post.date_modified).toLocaleDateString('vi-VN')}</span>
        )}
      </div>

      {/* External link */}
      {post.url && (
        <a href={post.url} target="_blank" rel="noopener noreferrer" style={{
          display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 11,
          color: 'var(--accent-2)', textDecoration: 'none', marginTop: 10, marginBottom: 4,
          padding: '5px 10px', background: 'var(--accent-dim)', borderRadius: 6,
          border: '1px solid rgba(6,182,212,0.3)', transition: 'background 0.1s', alignSelf: 'flex-start',
        }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(6,182,212,0.15)'}
          onMouseLeave={e => e.currentTarget.style.background = 'var(--accent-dim)'}
        >
          <ExternalLink size={12} /> Mở trên website
        </a>
      )}

      {/* Keywords */}
      {post.keywords?.length > 0 && (
        <>
          <SectionLabel>Keywords</SectionLabel>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 4 }}>
            {post.keywords.map(kw => (
              <span key={kw} style={{
                fontSize: 11, color: 'var(--text-muted)', background: 'var(--surface-2)',
                border: '1px solid var(--border)', borderRadius: 4, padding: '2px 7px',
              }}>{kw}</span>
            ))}
          </div>
        </>
      )}

      {/* Outbound links */}
      <SectionLabel>Outbound Links ({post.outbound_links?.length || 0}) ↗</SectionLabel>
      <div style={{ fontSize: 10, color: 'var(--text-subtle)', marginBottom: 6 }}>
        Bài này link <strong style={{ color: 'var(--text-muted)' }}>đến</strong> các bài khác
      </div>
      {post.outbound_links?.length > 0 ? (
        post.outbound_links.map(link => <LinkItem key={link.to_slug} link={link} onNavigate={handleNavigate} />)
      ) : (
        <p style={{ fontSize: 11, color: 'var(--danger)', padding: '4px 10px', background: 'rgba(248,81,73,0.06)', borderRadius: 6 }}>
          ⚠ Không có outbound links
        </p>
      )}

      {/* Inbound links */}
      <SectionLabel>Inbound Links ({post.inbound_links?.length || 0}) ↙</SectionLabel>
      <div style={{ fontSize: 10, color: 'var(--text-subtle)', marginBottom: 6 }}>
        Các bài khác link <strong style={{ color: 'var(--text-muted)' }}>đến</strong> bài này
      </div>
      {post.inbound_links?.length > 0 ? (
        post.inbound_links.map(link => <LinkItem key={link.from_slug} link={link} onNavigate={handleNavigate} />)
      ) : (
        <p style={{ fontSize: 11, color: 'var(--danger)', padding: '4px 10px', background: 'rgba(248,81,73,0.06)', borderRadius: 6 }}>
          ⚠ Orphan post — Google khó tìm thấy
        </p>
      )}

      {/* AI Review */}
      <SectionLabel>AI Review</SectionLabel>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10, flexWrap: 'wrap' }}>
        <ModelSelect value={aiModel} onChange={setAiModel} disabled={aiLoading} />
        <button
          onClick={runReview} disabled={aiLoading}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 11,
            cursor: aiLoading ? 'not-allowed' : 'pointer', padding: '5px 12px', borderRadius: 6,
            border: '1px solid rgba(139,92,246,0.5)',
            background: aiLoading ? 'rgba(139,92,246,0.06)' : 'rgba(139,92,246,0.1)',
            color: aiLoading ? 'rgba(167,139,250,0.5)' : '#a78bfa',
            transition: 'background 0.1s', opacity: aiLoading ? 0.7 : 1,
          }}
          onMouseEnter={e => { if (!aiLoading) e.currentTarget.style.background = 'rgba(139,92,246,0.18)' }}
          onMouseLeave={e => { if (!aiLoading) e.currentTarget.style.background = 'rgba(139,92,246,0.1)' }}
        >
          🤖 {aiLoading ? 'Đang phân tích...' : 'AI Review'}
        </button>
      </div>
      {showAI && (
        <AIPanel
          title="AI SEO Review"
          content={aiContent}
          loading={aiLoading}
          onClose={() => { setShowAI(false); setAiContent('') }}
          style={{ maxHeight: twoCol ? 500 : 360 }}
        />
      )}
    </div>
  )

  return (
    <>
      <div onClick={handleClose} style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)',
        zIndex: 100, backdropFilter: 'blur(2px)',
        opacity: visible ? 1 : 0, transition: 'opacity 0.25s',
      }} />

      <div style={{
        position: 'fixed', top: 0, right: 0, height: '100vh',
        width: panelW, maxWidth: maxW,
        background: 'var(--surface)', borderLeft: '1px solid var(--border)',
        zIndex: 101, display: 'flex', flexDirection: 'column',
        transform: visible ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.25s cubic-bezier(0.4,0,0.2,1)',
      }}>
        <Header />

        {loading && (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
            Loading...
          </div>
        )}
        {!loading && !post && (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--danger)' }}>
            Failed to load post
          </div>
        )}

        {!loading && post && (
          <>
            {/* Desktop: 2-column */}
            {twoCol && (
              <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
                {/* LEFT — article content */}
                <div style={{
                  flex: '1 1 0', overflowY: 'auto', borderRight: '1px solid var(--border)',
                  padding: '20px 24px',
                }}>
                  {post.image && (
                    <div style={{ marginBottom: 16, borderRadius: 8, overflow: 'hidden', border: '1px solid var(--border)' }}>
                      <img src={post.image} alt="" style={{ width: '100%', height: 'auto', display: 'block' }} />
                    </div>
                  )}
                  <h2 style={{ fontSize: 17, fontWeight: 700, color: 'var(--text)', lineHeight: 1.4, marginBottom: 16 }}>
                    {post.headline}
                  </h2>
                  <ArticleBody text={post.article_body} />
                </div>

                {/* RIGHT — metadata */}
                <div style={{ width: 340, minWidth: 300, overflowY: 'auto', flexShrink: 0 }}>
                  <RightPanel />
                </div>
              </div>
            )}

            {/* Mobile/Tablet: tabs */}
            {!twoCol && (
              <>
                <div style={{
                  display: 'flex', borderBottom: '1px solid var(--border)',
                  background: 'var(--surface)', flexShrink: 0,
                }}>
                  {[['content', 'Bài viết'], ['stats', 'Thống kê']].map(([id, label]) => (
                    <button key={id} onClick={() => setActiveTab(id)} style={{
                      flex: 1, padding: '9px 0', fontSize: 12, fontWeight: activeTab === id ? 600 : 400,
                      background: 'none', border: 'none', cursor: 'pointer',
                      color: activeTab === id ? 'var(--accent-2)' : 'var(--text-muted)',
                      borderBottom: `2px solid ${activeTab === id ? 'var(--accent)' : 'transparent'}`,
                      transition: 'all 0.15s',
                    }}>{label}</button>
                  ))}
                </div>

                <div style={{ flex: 1, overflowY: 'auto' }}>
                  {activeTab === 'content' && (
                    <div style={{ padding: '16px 16px 24px' }}>
                      {post.image && (
                        <div style={{ marginBottom: 14, borderRadius: 8, overflow: 'hidden', border: '1px solid var(--border)' }}>
                          <img src={post.image} alt="" style={{ width: '100%', height: 'auto', display: 'block' }} />
                        </div>
                      )}
                      <h2 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', lineHeight: 1.4, marginBottom: 14 }}>
                        {post.headline}
                      </h2>
                      <ArticleBody text={post.article_body} />
                    </div>
                  )}
                  {activeTab === 'stats' && <RightPanel />}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </>
  )
}
