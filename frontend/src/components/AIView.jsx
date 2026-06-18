import { useEffect, useState } from 'react'
import { api, streamAI } from '../api'
import { sectionColor } from '../sectionColors.js'
import AIPanel, { ModelSelect } from './AIPanel.jsx'

export default function AIView({ bp = 'desktop' }) {
  const [sections, setSections]       = useState([])
  const [selected, setSelected]       = useState(null)
  const [aiModel, setAiModel]         = useState('claude-haiku-4-5-20251001')
  const [aiContent, setAiContent]     = useState('')
  const [aiLoading, setAiLoading]     = useState(false)
  const isMobile = bp === 'mobile'
  const isCompact = bp === 'mobile' || bp === 'tablet'

  const ALL_KEY = '__all__'

  useEffect(() => {
    api.sections().then(rows => {
      setSections(rows)
      setSelected(ALL_KEY)
    }).catch(console.error)
  }, [])

  const runAnalysis = async (section = selected) => {
    if (!section || aiLoading) return
    setAiContent('')
    setAiLoading(true)
    try {
      const isAll = section === ALL_KEY

      await streamAI(
        isAll ? '/ai/overall' : '/ai/cluster',
        isAll ? { model: aiModel } : { section, model: aiModel },
        chunk => setAiContent(prev => prev + chunk),
        () => setAiLoading(false),
      )
    } catch (e) {
      setAiContent(`**Lỗi:** ${e.message}`)
      setAiLoading(false)
    }
  }

  const handleSelect = (name) => {
    setSelected(name)
    setAiContent('')
  }

  const selectedInfo = sections.find(s => s.article_section === selected)

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

      {/* Header */}
      <div style={{
        padding: '12px 16px', background: 'var(--surface)',
        borderBottom: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0, flexWrap: 'wrap',
      }}>
        <span style={{ fontSize: 16 }}>🤖</span>
        <div>
          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>AI Cluster Analysis</span>
          <span style={{ fontSize: 11, color: 'var(--text-muted)', marginLeft: 10 }}>
            Phân tích cấu trúc nội dung theo section
          </span>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
          <ModelSelect value={aiModel} onChange={setAiModel} disabled={aiLoading} />
          <button
            onClick={() => runAnalysis()}
            disabled={!selected || aiLoading}
            style={{
              padding: '5px 14px', borderRadius: 6, fontSize: 12,
              cursor: (!selected || aiLoading) ? 'not-allowed' : 'pointer',
              border: '1px solid rgba(139,92,246,0.6)',
              background: aiLoading ? 'rgba(139,92,246,0.06)' : 'rgba(139,92,246,0.14)',
              color: aiLoading ? 'rgba(167,139,250,0.5)' : '#a78bfa',
              fontWeight: 500, transition: 'background 0.1s',
              opacity: (!selected || aiLoading) ? 0.7 : 1,
            }}
            onMouseEnter={e => { if (selected && !aiLoading) e.currentTarget.style.background = 'rgba(139,92,246,0.22)' }}
            onMouseLeave={e => { if (selected && !aiLoading) e.currentTarget.style.background = 'rgba(139,92,246,0.14)' }}
          >
            {aiLoading ? '⏳ Đang phân tích...' : selected === ALL_KEY ? '🔍 Phân tích toàn bộ' : `🔍 Phân tích "${selected}"`}
          </button>
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

        {/* Section list — left sidebar hoặc top chips */}
        {isCompact ? (
          <div style={{
            borderBottom: '1px solid var(--border)', background: 'var(--surface)',
            padding: '8px 12px', flexShrink: 0,
            display: 'flex', gap: 6, overflowX: 'auto', scrollbarWidth: 'none',
          }}>
            {/* Toàn bộ chip */}
            {(() => {
              const isActive = selected === ALL_KEY
              return (
                <button
                  onClick={() => handleSelect(ALL_KEY)}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 5,
                    padding: '4px 10px', borderRadius: 20, flexShrink: 0,
                    background: isActive ? 'rgba(139,92,246,0.18)' : 'var(--surface-2)',
                    border: `1px solid ${isActive ? '#a78bfa' : 'var(--border)'}`,
                    color: isActive ? '#a78bfa' : 'var(--text-muted)',
                    cursor: 'pointer', fontSize: 12, fontWeight: isActive ? 600 : 400,
                    transition: 'all 0.1s',
                  }}
                >🌐 Toàn bộ</button>
              )
            })()}
            {sections.map(s => {
              const color = sectionColor(s.article_section)
              const isActive = selected === s.article_section
              return (
                <button
                  key={s.article_section}
                  onClick={() => handleSelect(s.article_section)}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 5,
                    padding: '4px 10px', borderRadius: 20, flexShrink: 0,
                    background: isActive ? color + '22' : 'var(--surface-2)',
                    border: `1px solid ${isActive ? color : 'var(--border)'}`,
                    color: isActive ? color : 'var(--text-muted)',
                    cursor: 'pointer', fontSize: 12, fontWeight: isActive ? 600 : 400,
                    transition: 'all 0.1s',
                  }}
                >
                  {s.article_section}
                  <span style={{
                    fontSize: 10, color: isActive ? color : 'var(--text-subtle)',
                    background: isActive ? color + '20' : 'transparent',
                    borderRadius: 8, padding: '0 4px',
                  }}>{s.count}</span>
                </button>
              )
            })}
          </div>
        ) : (
          <div style={{
            width: 220, minWidth: 220, background: 'var(--surface)',
            borderRight: '1px solid var(--border)', overflowY: 'auto', flexShrink: 0,
          }}>
            <div style={{ padding: '10px 14px 6px', fontSize: 10, fontWeight: 600, color: 'var(--text-subtle)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Phân tích
            </div>
            {/* Toàn bộ item */}
            {(() => {
              const isActive = selected === ALL_KEY
              return (
                <button
                  onClick={() => handleSelect(ALL_KEY)}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center',
                    justifyContent: 'space-between', padding: '9px 14px',
                    background: isActive ? 'rgba(139,92,246,0.14)' : 'transparent',
                    borderLeft: `2px solid ${isActive ? '#a78bfa' : 'transparent'}`,
                    border: 'none', cursor: 'pointer', textAlign: 'left',
                    transition: 'all 0.1s',
                  }}
                  onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.04)' }}
                  onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 13 }}>🌐</span>
                    <span style={{ fontSize: 12, color: isActive ? '#a78bfa' : 'var(--text-muted)', fontWeight: isActive ? 600 : 400 }}>
                      Toàn bộ blog
                    </span>
                  </div>
                  <span style={{
                    fontSize: 9, color: isActive ? '#a78bfa' : 'var(--text-subtle)',
                    background: isActive ? 'rgba(139,92,246,0.18)' : 'var(--surface-2)',
                    border: `1px solid ${isActive ? 'rgba(139,92,246,0.4)' : 'var(--border)'}`,
                    borderRadius: 10, padding: '0 6px',
                  }}>ALL</span>
                </button>
              )
            })()}
            <div style={{ padding: '8px 14px 4px', fontSize: 10, fontWeight: 600, color: 'var(--text-subtle)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Sections
            </div>
            {sections.map(s => {
              const color = sectionColor(s.article_section)
              const isActive = selected === s.article_section
              return (
                <button
                  key={s.article_section}
                  onClick={() => handleSelect(s.article_section)}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center',
                    justifyContent: 'space-between', padding: '9px 14px',
                    background: isActive ? color + '16' : 'transparent',
                    borderLeft: `2px solid ${isActive ? color : 'transparent'}`,
                    border: 'none', cursor: 'pointer', textAlign: 'left',
                    transition: 'all 0.1s',
                  }}
                  onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.04)' }}
                  onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 7, height: 7, borderRadius: '50%', background: color, flexShrink: 0, opacity: isActive ? 1 : 0.6 }} />
                    <span style={{ fontSize: 12, color: isActive ? 'var(--text)' : 'var(--text-muted)', fontWeight: isActive ? 500 : 400 }}>
                      {s.article_section}
                    </span>
                  </div>
                  <span style={{
                    fontSize: 10, background: isActive ? color + '22' : 'var(--surface-2)',
                    color: isActive ? color : 'var(--text-subtle)',
                    border: `1px solid ${isActive ? color + '40' : 'var(--border)'}`,
                    borderRadius: 10, padding: '0 6px', fontWeight: isActive ? 600 : 400,
                  }}>{s.count}</span>
                </button>
              )
            })}
          </div>
        )}

        {/* Main content */}
        <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          {!aiContent && !aiLoading && selected && (
            <div style={{
              flex: 1, display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center', gap: 16,
              color: 'var(--text-muted)',
            }}>
              <div style={{ fontSize: 48, opacity: 0.3 }}>🤖</div>
              <div style={{ textAlign: 'center' }}>
                {selected === ALL_KEY ? (
                  <>
                    <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--text)', marginBottom: 6 }}>
                      🌐 Phân tích toàn bộ blog
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>
                      Tất cả sections · {sections.reduce((a, s) => a + (s.count || 0), 0)} bài
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--text-subtle)' }}>
                      Đánh giá tổng thể: link density, orphans, cross-section opportunities
                    </div>
                  </>
                ) : (
                  <>
                    <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--text)', marginBottom: 6 }}>
                      Section: <span style={{ color: sectionColor(selected) }}>{selected}</span>
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>
                      {selectedInfo?.count || 0} bài viết
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--text-subtle)' }}>
                      Phân tích pillar/supporting, topic gaps, gợi ý links
                    </div>
                  </>
                )}
              </div>
              <button
                onClick={() => runAnalysis()}
                style={{
                  padding: '8px 20px', borderRadius: 8, fontSize: 13,
                  border: '1px solid rgba(139,92,246,0.5)',
                  background: 'rgba(139,92,246,0.12)', color: '#a78bfa',
                  cursor: 'pointer', fontWeight: 500, transition: 'background 0.1s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(139,92,246,0.2)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(139,92,246,0.12)'}
              >
                🔍 Phân tích ngay
              </button>
            </div>
          )}

          {(aiContent || aiLoading) && (
            <div style={{ flex: 1, overflowY: 'auto', padding: isCompact ? 12 : 24 }}>
              <AIPanel
                title={selected === ALL_KEY ? 'Phân tích toàn bộ blog' : `Cluster: ${selected}`}
                content={aiContent}
                loading={aiLoading}
                onClose={() => { setAiContent('') }}
                style={{ maxWidth: 760 }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
