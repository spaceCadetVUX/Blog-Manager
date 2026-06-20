import { useEffect, useState } from 'react'
import { api } from '../api'
import { FileText, Link2, AlertTriangle, TrendingUp, ExternalLink } from 'lucide-react'
import { sectionColor } from '../sectionColors.js'

function ScoreRing({ score, size = 72 }) {
  const stroke = size >= 90 ? 9 : 7
  const r = (size - stroke) / 2
  const circ = 2 * Math.PI * r
  const fill = (score / 100) * circ
  const color = score >= 85 ? '#3fb950' : score >= 68 ? '#d29922' : score >= 50 ? '#f97316' : '#f85149'
  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--border)" strokeWidth={stroke} />
      <circle
        cx={size / 2} cy={size / 2} r={r} fill="none"
        stroke={color} strokeWidth={stroke}
        strokeDasharray={`${fill} ${circ}`}
        strokeLinecap="round"
        style={{ transition: 'stroke-dasharray 1.2s cubic-bezier(0.4,0,0.2,1)' }}
      />
    </svg>
  )
}

function StatCard({ label, value, sub, icon: Icon, color = 'var(--accent)', warn }) {
  return (
    <div style={{
      background: 'var(--surface)',
      border: `1px solid ${warn ? 'rgba(248,81,73,0.35)' : 'var(--border)'}`,
      borderRadius: 'var(--radius)',
      padding: '16px 18px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 2,
        background: `linear-gradient(90deg, ${color}, transparent)`,
      }} />
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 26, fontWeight: 700, color: 'var(--text)', lineHeight: 1 }}>{value}</div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 5 }}>{label}</div>
          {sub && (
            <div style={{ fontSize: 10, color: warn ? 'var(--danger)' : 'var(--text-subtle)', marginTop: 4, lineHeight: 1.4 }}>{sub}</div>
          )}
        </div>
        <div style={{
          width: 38, height: 38, borderRadius: 10,
          background: color + '18',
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <Icon size={17} color={color} strokeWidth={1.8} />
        </div>
      </div>
    </div>
  )
}

function SectionBar({ name, count, total, max }) {
  const pct    = max > 0 ? (count / max) * 100 : 0
  const pctAll = total > 0 ? Math.round((count / total) * 100) : 0
  const color  = sectionColor(name)
  return (
    <div style={{ marginBottom: 9 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, minWidth: 0, flex: 1 }}>
          <div style={{ width: 8, height: 8, borderRadius: 2, background: color, flexShrink: 0 }} />
          <span style={{ fontSize: 12, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{name}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0, marginLeft: 8 }}>
          <span style={{ fontSize: 10, color: 'var(--text-subtle)' }}>{pctAll}%</span>
          <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)', minWidth: 22, textAlign: 'right' }}>{count}</span>
        </div>
      </div>
      <div style={{ height: 5, background: 'var(--border)', borderRadius: 3, overflow: 'hidden' }}>
        <div style={{
          height: '100%', width: pct + '%',
          background: `linear-gradient(90deg, ${color}99, ${color})`,
          borderRadius: 3,
          transition: 'width 0.9s cubic-bezier(0.4,0,0.2,1)',
        }} />
      </div>
    </div>
  )
}

function HubRow({ rank, post, maxInbound, onSelectPost }) {
  const color  = sectionColor(post.article_section)
  const barPct = maxInbound > 0 ? (post.inbound / maxInbound) * 100 : 0
  const medal  = rank === 1 ? '#ffd700' : rank === 2 ? '#c0c0c0' : rank === 3 ? '#cd7f32' : null
  return (
    <div
      onClick={() => onSelectPost && onSelectPost(post.slug)}
      style={{
        padding: '8px 10px', borderRadius: 6, cursor: 'pointer',
        marginBottom: 2, transition: 'background 0.12s',
        position: 'relative', overflow: 'hidden',
      }}
      onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-2)'}
      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
    >
      <div style={{
        position: 'absolute', left: 0, top: 0, bottom: 0,
        width: barPct + '%',
        background: 'rgba(6,182,212,0.07)',
        pointerEvents: 'none',
        transition: 'width 0.9s cubic-bezier(0.4,0,0.2,1)',
      }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, position: 'relative' }}>
        <span style={{
          fontSize: 11, fontWeight: 700,
          color: medal || 'var(--text-subtle)',
          minWidth: 16, textAlign: 'center', flexShrink: 0,
        }}>{rank}</span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 12, color: 'var(--text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {post.headline || post.slug}
          </div>
          {post.article_section && (
            <span style={{ fontSize: 9, color, display: 'block', marginTop: 1 }}>{post.article_section}</span>
          )}
        </div>
        <div style={{
          fontSize: 11, fontWeight: 600, flexShrink: 0,
          padding: '1px 7px', borderRadius: 10,
          color: post.inbound >= 5 ? 'var(--success)' : 'var(--text-muted)',
          background: post.inbound >= 5 ? 'rgba(63,185,80,0.12)' : 'var(--surface-2)',
        }}>{post.inbound} ↙</div>
      </div>
    </div>
  )
}

export default function Dashboard({ onSelectPost, bp = 'desktop' }) {
  const isMobile = bp === 'mobile'
  const isTablet = bp === 'tablet'
  const [stats, setStats]     = useState(null)
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
  const maxCount   = sectionEntries.length > 0 ? sectionEntries[0][1] : 1
  const topLinked  = stats.top_linked || []
  const maxInbound = topLinked.length > 0 ? topLinked[0].inbound : 1
  const orphanPct  = stats.total_posts > 0 ? Math.round((stats.orphan_posts / stats.total_posts) * 100) : 0
  const noOutPct   = stats.total_posts > 0 ? Math.round((stats.no_outbound  / stats.total_posts) * 100) : 0
  const avgLinks   = stats.total_posts > 0 ? (stats.total_links / stats.total_posts).toFixed(1) : '0'

  // Orphan dùng penalty mũ: 42% → 22đ, 20% → 36đ, 0% → 50đ
  const healthScore = Math.round(
    Math.pow(1 - orphanPct / 100, 1.5) * 50 +
    Math.min((stats.avg_word_count || 0) / 800, 1) * 25 +
    Math.min(parseFloat(avgLinks) / 3, 1) * 25
  )
  const healthColor = healthScore >= 85 ? '#3fb950' : healthScore >= 68 ? '#d29922' : healthScore >= 50 ? '#f97316' : '#f85149'
  const healthLabel = healthScore >= 85 ? 'Tốt' : healthScore >= 68 ? 'Khá' : healthScore >= 50 ? 'Trung bình' : 'Cần cải thiện'

  const pad = isMobile ? '12px 12px 16px' : '20px 24px 28px'

  const wcPct  = Math.min((stats.avg_word_count || 0) / 800, 1)
  const lkPct  = Math.min(parseFloat(avgLinks) / 3, 1)

  return (
    <div style={{ flex: 1, overflow: 'auto', padding: pad }}>

      {/* Title */}
      <div style={{ marginBottom: 14 }}>
        <h1 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text)', lineHeight: 1 }}>Dashboard</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: 12, marginTop: 4 }}>SEO overview · knxstore.vn</p>
      </div>

      {/* Health Score banner */}
      <div style={{
        background: 'var(--surface)',
        border: `1px solid ${healthColor}40`,
        borderRadius: 'var(--radius-lg)',
        padding: isMobile ? '18px 16px' : '22px 32px',
        marginBottom: 14,
        display: 'flex',
        alignItems: 'center',
        gap: isMobile ? 20 : 40,
        flexWrap: 'wrap',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* subtle glow bg */}
        <div style={{
          position: 'absolute', top: -40, left: -40,
          width: 180, height: 180, borderRadius: '50%',
          background: healthColor + '10',
          pointerEvents: 'none',
        }} />

        {/* Ring */}
        <div style={{ position: 'relative', width: 100, height: 100, flexShrink: 0 }}>
          <ScoreRing score={healthScore} size={100} />
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{ fontSize: 26, fontWeight: 800, color: healthColor, lineHeight: 1 }}>{healthScore}</span>
            <span style={{ fontSize: 9, color: 'var(--text-subtle)', marginTop: 2 }}>/100</span>
          </div>
        </div>

        {/* Label */}
        <div style={{ flexShrink: 0 }}>
          <div style={{ fontSize: 22, fontWeight: 700, color: healthColor }}>{healthLabel}</div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>SEO Health Score</div>
          <div style={{ fontSize: 11, color: 'var(--text-subtle)', marginTop: 3 }}>
            knxstore.vn · {stats.total_posts} bài viết
          </div>
        </div>

        {/* Divider */}
        {!isMobile && (
          <div style={{ width: 1, height: 64, background: 'var(--border)', flexShrink: 0 }} />
        )}

        {/* Sub-metrics */}
        <div style={{ flex: 1, minWidth: 200, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[
            {
              label: 'Orphan rate',
              value: orphanPct + '%',
              pct: orphanPct / 100,
              invert: true,
              note: orphanPct > 30 ? 'Cần thêm internal links đến các bài này' : 'Trong ngưỡng chấp nhận',
              color: orphanPct > 40 ? '#f85149' : orphanPct > 20 ? '#d29922' : '#3fb950',
            },
            {
              label: 'Avg word count',
              value: (stats.avg_word_count || 0).toLocaleString() + ' từ',
              pct: wcPct,
              note: stats.avg_word_count >= 800 ? 'Đạt chuẩn SEO ≥800 từ' : 'Nên tăng lên ≥800 từ',
              color: wcPct >= 1 ? '#3fb950' : wcPct >= 0.6 ? '#d29922' : '#f85149',
            },
            {
              label: 'Avg links / bài',
              value: avgLinks,
              pct: lkPct,
              note: parseFloat(avgLinks) >= 3 ? 'Link density tốt' : 'Nên tăng internal linking',
              color: lkPct >= 1 ? '#3fb950' : lkPct >= 0.5 ? '#d29922' : '#f85149',
            },
          ].map(({ label, value, pct, invert, note, color: c }) => (
            <div key={label}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4 }}>
                <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{label}</span>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                  <span style={{ fontSize: 11, color: 'var(--text-subtle)' }}>{note}</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: c }}>{value}</span>
                </div>
              </div>
              <div style={{ height: 5, background: 'var(--border)', borderRadius: 3, overflow: 'hidden' }}>
                <div style={{
                  height: '100%',
                  width: (invert ? (1 - pct) : pct) * 100 + '%',
                  background: c,
                  borderRadius: 3,
                  transition: 'width 1s cubic-bezier(0.4,0,0.2,1)',
                }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stat cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? 'repeat(2,1fr)' : 'repeat(4,1fr)',
        gap: 10,
        marginBottom: 14,
      }}>
        <StatCard
          label="Tổng bài viết"
          value={stats.total_posts?.toLocaleString() || 0}
          sub={`${sectionEntries.length} danh mục`}
          icon={FileText} color="var(--accent)"
        />
        <StatCard
          label="Internal links"
          value={stats.total_links?.toLocaleString() || 0}
          sub={`~${avgLinks} link/bài`}
          icon={Link2} color="var(--info)"
        />
        <StatCard
          label="Orphan posts"
          value={stats.orphan_posts || 0}
          sub={`${orphanPct}% chưa được link đến`}
          icon={AlertTriangle} color="var(--danger)"
          warn={(stats.orphan_posts || 0) > 5}
        />
        <StatCard
          label="Avg word count"
          value={(stats.avg_word_count || 0).toLocaleString()}
          sub={stats.avg_word_count >= 800 ? 'Đạt chuẩn SEO ≥800 từ' : 'Nên tăng lên ≥800 từ'}
          icon={TrendingUp} color="var(--success)"
        />
      </div>

      {/* Panels */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : isTablet ? '1fr 1fr' : '1.15fr 1fr 1fr',
        gap: 12,
        alignItems: 'start',
      }}>

        {/* Section distribution */}
        <div style={{
          background: 'var(--surface)', border: '1px solid var(--border)',
          borderRadius: 'var(--radius)', padding: '18px 20px',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h2 style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>Phân bố danh mục</h2>
            <span style={{
              fontSize: 10, color: 'var(--text-subtle)',
              background: 'var(--surface-2)', border: '1px solid var(--border)',
              borderRadius: 10, padding: '2px 8px',
            }}>{sectionEntries.length} mục</span>
          </div>
          {sectionEntries.map(([name, count]) => (
            <SectionBar key={name} name={name} count={count} total={stats.total_posts} max={maxCount} />
          ))}
          {sectionEntries.length === 0 && (
            <p style={{ color: 'var(--text-muted)', fontSize: 12 }}>Không có dữ liệu</p>
          )}
        </div>

        {/* Hub pages */}
        <div style={{
          background: 'var(--surface)', border: '1px solid var(--border)',
          borderRadius: 'var(--radius)', padding: '18px 20px',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h2 style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>Hub pages</h2>
            <span style={{ fontSize: 10, color: 'var(--text-subtle)' }}>inbound nhiều nhất</span>
          </div>
          {topLinked.map((post, i) => (
            <HubRow key={post.slug} rank={i + 1} post={post} maxInbound={maxInbound} onSelectPost={onSelectPost} />
          ))}
          {topLinked.length === 0 && (
            <p style={{ color: 'var(--text-muted)', fontSize: 12 }}>Không có dữ liệu</p>
          )}
        </div>

        {/* Orphan posts */}
        <div style={{
          background: 'var(--surface)', border: '1px solid var(--border)',
          borderRadius: 'var(--radius)', padding: '18px 20px',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h2 style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>Orphan posts</h2>
            <span style={{
              background: orphans.length > 0 ? 'rgba(248,81,73,0.14)' : 'rgba(63,185,80,0.14)',
              color: orphans.length > 0 ? 'var(--danger)' : 'var(--success)',
              border: `1px solid ${orphans.length > 0 ? 'rgba(248,81,73,0.3)' : 'rgba(63,185,80,0.3)'}`,
              borderRadius: 10, padding: '2px 9px', fontSize: 11, fontWeight: 600,
            }}>{orphans.length}</span>
          </div>

          {orphans.length === 0 ? (
            <div style={{ padding: '28px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 48, height: 48, borderRadius: '50%',
                background: 'rgba(63,185,80,0.12)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 22, color: 'var(--success)',
              }}>✓</div>
              <div style={{ fontSize: 13, color: 'var(--success)', fontWeight: 500 }}>Không có orphan!</div>
              <div style={{ fontSize: 11, color: 'var(--text-subtle)', textAlign: 'center', lineHeight: 1.5 }}>
                Tất cả bài viết đều được link đến
              </div>
            </div>
          ) : (
            <>
              <div style={{
                background: 'rgba(248,81,73,0.07)',
                border: '1px solid rgba(248,81,73,0.18)',
                borderRadius: 6, padding: '7px 10px', marginBottom: 10,
                fontSize: 11, color: 'rgba(248,81,73,0.9)',
              }}>
                {orphans.length} bài chưa được link đến — Google khó crawl
              </div>
              <div style={{ maxHeight: isMobile ? 220 : 340, overflow: 'auto' }}>
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
                    <div style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--danger)', flexShrink: 0 }} />
                    <span style={{
                      fontSize: 12, color: 'var(--text)',
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1,
                    }}>{post.headline || post.slug}</span>
                    <ExternalLink size={10} color="var(--text-subtle)" style={{ flexShrink: 0 }} />
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
