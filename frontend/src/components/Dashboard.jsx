import { useEffect, useState } from 'react'
import { api } from '../api'
import { FileText, Link2, AlertTriangle, TrendingUp, ArrowUpRight, ExternalLink } from 'lucide-react'
import { sectionColor } from '../sectionColors.js'

function StatCard({ label, value, sub, icon: Icon, color = 'var(--accent)', warn, compact }) {
  return (
    <div style={{
      background: 'var(--surface)',
      border: `1px solid ${warn ? 'rgba(248,81,73,0.3)' : 'var(--border)'}`,
      borderRadius: 'var(--radius)',
      padding: compact ? '10px 12px' : '18px 20px',
      display: 'flex',
      alignItems: 'flex-start',
      gap: compact ? 10 : 14,
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 2,
        background: `linear-gradient(90deg, ${color}, transparent)`,
        opacity: 0.7,
      }} />
      <div style={{
        width: compact ? 32 : 40, height: compact ? 32 : 40, borderRadius: compact ? 8 : 10,
        background: color + '18',
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}>
        <Icon size={compact ? 15 : 18} color={color} strokeWidth={1.8} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: compact ? 18 : 22, fontWeight: 700, color: 'var(--text)', lineHeight: 1.2 }}>{value}</div>
        <div style={{ fontSize: compact ? 10 : 11, color: 'var(--text-muted)', marginTop: 2 }}>{label}</div>
        {sub && (
          <div style={{ fontSize: 9, color: warn ? 'var(--danger)' : 'var(--text-subtle)', marginTop: 3, lineHeight: 1.3 }}>{sub}</div>
        )}
      </div>
    </div>
  )
}

function SectionBar({ name, count, total, max }) {
  const pct    = max > 0 ? (count / max) * 100 : 0
  const pctAll = total > 0 ? Math.round((count / total) * 100) : 0
  const color  = sectionColor(name)
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, minWidth: 0, flex: 1 }}>
          <div style={{ width: 7, height: 7, borderRadius: '50%', background: color, flexShrink: 0 }} />
          <span style={{ fontSize: 11, color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{name}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          <span style={{ fontSize: 10, color: 'var(--text-subtle)' }}>{pctAll}%</span>
          <span style={{ fontSize: 12, color: 'var(--text)', fontWeight: 500, minWidth: 20, textAlign: 'right' }}>{count}</span>
        </div>
      </div>
      <div style={{ height: 4, background: 'var(--border)', borderRadius: 3, overflow: 'hidden' }}>
        <div style={{
          height: '100%', width: pct + '%', background: color, borderRadius: 3,
          transition: 'width 0.7s cubic-bezier(0.4,0,0.2,1)',
        }} />
      </div>
    </div>
  )
}

function TopLinkedRow({ rank, post, onSelectPost }) {
  const color = sectionColor(post.article_section)
  return (
    <div
      onClick={() => onSelectPost && onSelectPost(post.slug)}
      style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '7px 8px', borderRadius: 6, cursor: 'pointer',
        marginBottom: 2, transition: 'background 0.1s',
      }}
      onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-2)'}
      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
    >
      <span style={{
        fontSize: 10, fontWeight: 700, color: rank <= 3 ? 'var(--accent-2)' : 'var(--text-subtle)',
        minWidth: 16, textAlign: 'right', flexShrink: 0,
      }}>{rank}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: 12, color: 'var(--text)',
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>{post.headline || post.slug}</div>
        {post.article_section && (
          <span style={{ fontSize: 9, color, marginTop: 1, display: 'block' }}>{post.article_section}</span>
        )}
      </div>
      <div style={{
        fontSize: 11, fontWeight: 600,
        color: post.inbound >= 5 ? 'var(--success)' : 'var(--text-muted)',
        background: post.inbound >= 5 ? 'rgba(63,185,80,0.12)' : 'var(--surface-2)',
        borderRadius: 10, padding: '1px 8px', flexShrink: 0,
      }}>
        {post.inbound} ↙
      </div>
    </div>
  )
}

export default function Dashboard({ onSelectPost, bp = 'desktop' }) {
  const isMobile = bp === 'mobile'
  const isTablet = bp === 'tablet'
  const [stats, setStats]   = useState(null)
  const [orphans, setOrphans] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([api.stats(), api.audit()])
      .then(([s, a]) => { setStats(s); setOrphans(a.issues?.orphan_posts || []) })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
      Đang tải...
    </div>
  )
  if (!stats) return (
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--danger)' }}>
      Không tải được dữ liệu
    </div>
  )

  const sectionEntries = (stats.sections || []).map(s => [s.article_section, s.c]).sort((a, b) => b[1] - a[1])
  const maxCount  = sectionEntries.length > 0 ? sectionEntries[0][1] : 1
  const topLinked = stats.top_linked || []
  const orphanPct = stats.total_posts > 0 ? Math.round((stats.orphan_posts / stats.total_posts) * 100) : 0
  const noOutPct  = stats.total_posts > 0 ? Math.round((stats.no_outbound  / stats.total_posts) * 100) : 0
  const avgLinks  = stats.total_posts > 0 ? (stats.total_links / stats.total_posts).toFixed(1) : 0

  const pad = isMobile ? '12px 12px 16px' : 24
  const panelPad = isMobile ? 12 : 18

  return (
    <div style={{ flex: 1, overflow: 'auto', padding: pad }}>
      {/* Header */}
      <div style={{ marginBottom: isMobile ? 14 : 22 }}>
        <h1 style={{ fontSize: isMobile ? 16 : 18, fontWeight: 600, color: 'var(--text)' }}>Dashboard</h1>
        {!isMobile && (
          <p style={{ color: 'var(--text-muted)', fontSize: 12, marginTop: 3 }}>Tổng quan SEO nội dung knxstore.vn</p>
        )}
      </div>

      {/* Stat cards — 2 col mobile, 3 col tablet, 5 col desktop */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : isTablet ? 'repeat(3, 1fr)' : 'repeat(5, 1fr)',
        gap: isMobile ? 8 : 12,
        marginBottom: isMobile ? 12 : 20,
      }}>
        <StatCard
          label="Tổng bài viết"
          value={stats.total_posts?.toLocaleString() || 0}
          sub={`${sectionEntries.length} danh mục`}
          icon={FileText}
          color="var(--accent)"
          compact={isMobile}
        />
        <StatCard
          label="Internal links"
          value={stats.total_links?.toLocaleString() || 0}
          sub={`~${avgLinks} link/bài`}
          icon={Link2}
          color="var(--info)"
          compact={isMobile}
        />
        <StatCard
          label="Orphan posts"
          value={stats.orphan_posts || 0}
          sub={`${orphanPct}% — cần thêm link`}
          icon={AlertTriangle}
          color="var(--danger)"
          warn={stats.orphan_posts > 0}
          compact={isMobile}
        />
        <StatCard
          label="Không outbound"
          value={stats.no_outbound || 0}
          sub={`${noOutPct}% — chưa link đi`}
          icon={ArrowUpRight}
          color="var(--warning)"
          warn={stats.no_outbound > 0}
          compact={isMobile}
        />
        {/* 5th card: span full width on mobile so it doesn't sit alone */}
        <div style={isMobile ? { gridColumn: 'span 2' } : {}}>
          <StatCard
            label="Avg word count"
            value={(stats.avg_word_count || 0).toLocaleString()}
            sub={stats.avg_word_count >= 800 ? 'Đạt chuẩn SEO' : 'Nên tăng ≥800 từ'}
            icon={TrendingUp}
            color="var(--success)"
            compact={isMobile}
          />
        </div>
      </div>

      {/* Main panels */}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : isTablet ? '1fr 1fr' : '1fr 1fr 1fr', gap: isMobile ? 10 : 14 }}>

        {/* Section distribution */}
        <div style={{
          background: 'var(--surface)', border: '1px solid var(--border)',
          borderRadius: 'var(--radius)', padding: panelPad,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <h2 style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>Phân bố danh mục</h2>
            <span style={{ fontSize: 11, color: 'var(--text-subtle)' }}>{sectionEntries.length} mục</span>
          </div>
          {sectionEntries.map(([name, count]) => (
            <SectionBar key={name} name={name} count={count} total={stats.total_posts} max={maxCount} />
          ))}
          {sectionEntries.length === 0 && (
            <p style={{ color: 'var(--text-muted)', fontSize: 12 }}>Không có dữ liệu</p>
          )}
        </div>

        {/* Top linked posts */}
        <div style={{
          background: 'var(--surface)', border: '1px solid var(--border)',
          borderRadius: 'var(--radius)', padding: panelPad,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <h2 style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>Hub pages</h2>
            <span style={{ fontSize: 10, color: 'var(--text-subtle)' }}>nhiều inbound nhất</span>
          </div>
          <div>
            {topLinked.map((post, i) => (
              <TopLinkedRow key={post.slug} rank={i + 1} post={post} onSelectPost={onSelectPost} />
            ))}
            {topLinked.length === 0 && (
              <p style={{ color: 'var(--text-muted)', fontSize: 12 }}>Không có dữ liệu</p>
            )}
          </div>
        </div>

        {/* Orphan posts */}
        <div style={{
          background: 'var(--surface)', border: '1px solid var(--border)',
          borderRadius: 'var(--radius)', padding: panelPad,
          display: 'flex', flexDirection: 'column',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <h2 style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>Orphan posts</h2>
            <span style={{
              background: orphans.length > 0 ? 'rgba(248,81,73,0.15)' : 'rgba(63,185,80,0.15)',
              color: orphans.length > 0 ? 'var(--danger)' : 'var(--success)',
              borderRadius: 10, padding: '1px 9px', fontSize: 11, fontWeight: 600,
            }}>{orphans.length}</span>
          </div>

          {orphans.length === 0 ? (
            <div style={{
              flex: 1, display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center', gap: 8, padding: '12px 0',
            }}>
              <div style={{ fontSize: 28 }}>✓</div>
              <p style={{ color: 'var(--success)', fontSize: 13, fontWeight: 500 }}>Không có orphan posts!</p>
              <p style={{ color: 'var(--text-subtle)', fontSize: 11, textAlign: 'center' }}>Tất cả bài viết đều được link đến</p>
            </div>
          ) : (
            <>
              <div style={{
                background: 'rgba(248,81,73,0.07)', border: '1px solid rgba(248,81,73,0.2)',
                borderRadius: 6, padding: '7px 10px', marginBottom: 10, fontSize: 11, color: 'var(--danger)',
              }}>
                {orphans.length} bài chưa được bài nào link đến — Google khó crawl
              </div>
              <div style={{ maxHeight: isMobile ? 240 : undefined, overflow: 'auto' }}>
                {orphans.map(post => (
                  <div
                    key={post.slug}
                    onClick={() => onSelectPost && onSelectPost(post.slug)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 8,
                      padding: '7px 8px', borderRadius: 6, cursor: 'pointer',
                      marginBottom: 2, transition: 'background 0.1s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-2)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <div style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--danger)', flexShrink: 0 }} />
                    <span style={{
                      fontSize: 12, color: 'var(--text)',
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1,
                    }}>{post.headline || post.slug}</span>
                    <ExternalLink size={11} color="var(--text-subtle)" style={{ flexShrink: 0 }} />
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

      </div>
    </div>
  )
}
