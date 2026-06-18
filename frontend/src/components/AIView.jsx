import { useEffect, useState } from 'react'
import { Trash2, Clock } from 'lucide-react'
import { api, streamAI } from '../api'
import { sectionColor } from '../sectionColors.js'
import AIPanel, { ModelSelect } from './AIPanel.jsx'

function HistoryItem({ item, onView, onDelete, compact }) {
  const label = item.type === 'overall' ? '🌐 Toàn bộ blog' : `📂 ${item.section || item.type}`
  const date = item.created_at ? new Date(item.created_at).toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' }) : ''
  const preview = item.content ? item.content.slice(0, compact ? 80 : 120).replace(/#+\s*/g, '').replace(/\*\*/g, '') + '...' : ''
  return (
    <div style={{
      background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8,
      padding: compact ? '8px 12px' : '10px 14px', display: 'flex', flexDirection: 'column', gap: 4,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, minWidth: 0, flex: 1 }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)', whiteSpace: 'nowrap' }}>{label}</span>
          <span style={{ fontSize: 10, color: 'var(--text-subtle)', background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 4, padding: '1px 5px', whiteSpace: 'nowrap' }}>{item.model?.split('-').slice(-1)[0]}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
          {!compact && <span style={{ fontSize: 10, color: 'var(--text-subtle)' }}>{date}</span>}
          <button
            onClick={onView}
            style={{ fontSize: 11, padding: '2px 8px', borderRadius: 5, border: '1px solid rgba(139,92,246,0.4)', background: 'rgba(139,92,246,0.1)', color: '#a78bfa', cursor: 'pointer' }}
          >Xem</button>
          <button
            onClick={onDelete}
            style={{ padding: '2px 5px', borderRadius: 5, border: '1px solid rgba(248,81,73,0.3)', background: 'transparent', color: 'var(--danger)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
          ><Trash2 size={11} /></button>
        </div>
      </div>
      {compact && date && <div style={{ fontSize: 10, color: 'var(--text-subtle)' }}>{date}</div>}
      <div style={{ fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.4 }}>{preview}</div>
    </div>
  )
}

export default function AIView({ bp = 'desktop' }) {
  const [sections, setSections]           = useState([])
  const [selected, setSelected]           = useState(null)
  const [aiModel, setAiModel]             = useState('claude-haiku-4-5-20251001')
  const [aiContent, setAiContent]         = useState('')
  const [aiLoading, setAiLoading]         = useState(false)
  const [instructions, setInstructions]   = useState('')
  const [showHistory, setShowHistory]     = useState(false)
  const [history, setHistory]             = useState([])
  const [historyLoading, setHistoryLoading] = useState(false)
  const isMobile = bp === 'mobile'
  const isCompact = bp === 'mobile' || bp === 'tablet'

  const ALL_KEY = '__all__'

  useEffect(() => {
    api.sections().then(rows => {
      setSections(rows)
      setSelected(ALL_KEY)
    }).catch(console.error)
    api.getSetting('cluster_instructions').then(d => setInstructions(d.value || '')).catch(() => {})
  }, [])

  const loadHistory = () => {
    setHistoryLoading(true)
    api.getHistory(50).then(rows => setHistory(rows)).catch(() => {}).finally(() => setHistoryLoading(false))
  }

  const toggleHistory = () => {
    if (!showHistory) loadHistory()
    setShowHistory(h => !h)
    setAiContent('')
  }

  const saveInstructions = (val) => {
    api.setSetting('cluster_instructions', val).catch(() => {})
  }

  const runAnalysis = async (section = selected) => {
    if (!section || aiLoading) return
    setAiContent('')
    setShowHistory(false)
    setAiLoading(true)
    let fullContent = ''
    const isAll = section === ALL_KEY
    try {
      await streamAI(
        isAll ? '/ai/overall' : '/ai/cluster',
        isAll
          ? { model: aiModel, extra_instructions: instructions }
          : { section, model: aiModel, extra_instructions: instructions },
        chunk => { fullContent += chunk; setAiContent(prev => prev + chunk) },
        () => {
          setAiLoading(false)
          if (fullContent && !fullContent.startsWith('**Lỗi')) {
            api.saveHistory({
              type: isAll ? 'overall' : 'cluster',
              section: isAll ? '' : section,
              model: aiModel,
              content: fullContent,
            }).catch(() => {})
          }
        },
      )
    } catch (e) {
      setAiContent(`**Lỗi:** ${e.message}`)
      setAiLoading(false)
    }
  }

  const handleSelect = (name) => {
    setSelected(name)
    setAiContent('')
    setShowHistory(false)
  }

  const selectedInfo = sections.find(s => s.article_section === selected)

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

      {/* Header */}
      {isMobile ? (
        /* Mobile: 2-row header */
        <div style={{
          background: 'var(--surface)', borderBottom: '1px solid var(--border)', flexShrink: 0,
        }}>
          {/* Row 1: title + history */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px 6px' }}>
            <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', flex: 1 }}>AI Cluster Analysis</span>
            <button
              onClick={toggleHistory}
              title="Lịch sử phân tích"
              style={{
                padding: '5px 10px', borderRadius: 6, fontSize: 12, display: 'flex', alignItems: 'center', gap: 5,
                cursor: 'pointer', border: `1px solid ${showHistory ? 'rgba(6,182,212,0.6)' : 'var(--border)'}`,
                background: showHistory ? 'rgba(6,182,212,0.12)' : 'transparent',
                color: showHistory ? 'var(--accent-2)' : 'var(--text-muted)', transition: 'all 0.1s',
              }}
            ><Clock size={13} /></button>
          </div>
          {/* Row 2: instructions + model + run */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '0 12px 10px' }}>
            <textarea
              value={instructions}
              onChange={e => setInstructions(e.target.value)}
              onBlur={e => saveInstructions(e.target.value)}
              placeholder="Yêu cầu thêm cho AI..."
              rows={1}
              style={{
                flex: 1, resize: 'none', fontSize: 11,
                background: 'var(--surface-2)', border: '1px solid var(--border)',
                borderRadius: 6, padding: '5px 8px', color: 'var(--text)',
                fontFamily: 'inherit', outline: 'none',
              }}
            />
            <ModelSelect value={aiModel} onChange={setAiModel} disabled={aiLoading} />
            <button
              onClick={() => runAnalysis()}
              disabled={!selected || aiLoading}
              style={{
                padding: '5px 12px', borderRadius: 6, fontSize: 12, whiteSpace: 'nowrap',
                cursor: (!selected || aiLoading) ? 'not-allowed' : 'pointer',
                border: '1px solid rgba(139,92,246,0.6)',
                background: aiLoading ? 'rgba(139,92,246,0.06)' : 'rgba(139,92,246,0.14)',
                color: aiLoading ? 'rgba(167,139,250,0.5)' : '#a78bfa',
                fontWeight: 500, transition: 'background 0.1s',
                opacity: (!selected || aiLoading) ? 0.7 : 1,
              }}
            >
              {aiLoading ? '⏳' : '🔍 Phân tích'}
            </button>
          </div>
        </div>
      ) : (
        /* Desktop / Tablet header */
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
          <textarea
            value={instructions}
            onChange={e => setInstructions(e.target.value)}
            onBlur={e => saveInstructions(e.target.value)}
            placeholder="Yêu cầu thêm cho AI (tùy chọn)..."
            rows={1}
            style={{
              flex: 1, minWidth: 160, maxWidth: 320, resize: 'none', fontSize: 11,
              background: 'var(--surface-2)', border: '1px solid var(--border)',
              borderRadius: 6, padding: '5px 8px', color: 'var(--text)',
              fontFamily: 'inherit', outline: 'none',
            }}
          />
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
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
            <button
              onClick={toggleHistory}
              title="Lịch sử phân tích"
              style={{
                padding: '5px 10px', borderRadius: 6, fontSize: 12, display: 'flex', alignItems: 'center', gap: 5,
                cursor: 'pointer', border: `1px solid ${showHistory ? 'rgba(6,182,212,0.6)' : 'var(--border)'}`,
                background: showHistory ? 'rgba(6,182,212,0.12)' : 'transparent',
                color: showHistory ? 'var(--accent-2)' : 'var(--text-muted)', transition: 'all 0.1s',
              }}
            ><Clock size={13} /> Lịch sử</button>
          </div>
        </div>
      )}

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

        {/* Section selector — chips on mobile/tablet, sidebar on desktop */}
        {isCompact ? (
          <div style={{
            borderBottom: '1px solid var(--border)', background: 'var(--surface)',
            padding: '8px 12px', flexShrink: 0,
            display: 'flex', gap: 6, overflowX: 'auto', scrollbarWidth: 'none',
          }}>
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
        ) : null}

        <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

          {/* Desktop sidebar */}
          {!isCompact && (
            <div style={{
              width: 220, minWidth: 220, background: 'var(--surface)',
              borderRight: '1px solid var(--border)', overflowY: 'auto', flexShrink: 0,
            }}>
              <div style={{ padding: '10px 14px 6px', fontSize: 10, fontWeight: 600, color: 'var(--text-subtle)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Phân tích
              </div>
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

          {/* Main content area */}
          <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>

            {/* History panel */}
            {showHistory && (
              <div style={{ flex: 1, overflowY: 'auto', padding: isMobile ? 10 : 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>
                    <Clock size={13} style={{ marginRight: 6, verticalAlign: 'middle' }} />
                    Lịch sử phân tích
                  </span>
                  <button
                    onClick={loadHistory}
                    style={{ fontSize: 11, color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer', padding: '2px 6px' }}
                  >↻ Tải lại</button>
                </div>
                {historyLoading && (
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', textAlign: 'center', padding: 32 }}>Đang tải...</div>
                )}
                {!historyLoading && history.length === 0 && (
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', textAlign: 'center', padding: 32 }}>Chưa có lịch sử nào.</div>
                )}
                {!historyLoading && history.length > 0 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {history.map(item => (
                      <HistoryItem
                        key={item.id}
                        item={item}
                        compact={isMobile}
                        onView={() => {
                          setAiContent(item.content)
                          setShowHistory(false)
                        }}
                        onDelete={() => {
                          api.deleteHistory(item.id).then(() => setHistory(h => h.filter(x => x.id !== item.id))).catch(() => {})
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Empty state */}
            {!showHistory && !aiContent && !aiLoading && selected && (
              <div style={{
                flex: 1, display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center', gap: 12,
                color: 'var(--text-muted)', padding: isMobile ? 16 : 24,
              }}>
                <div style={{ fontSize: isMobile ? 36 : 48, opacity: 0.3 }}>🤖</div>
                <div style={{ textAlign: 'center' }}>
                  {selected === ALL_KEY ? (
                    <>
                      <div style={{ fontSize: isMobile ? 13 : 14, fontWeight: 500, color: 'var(--text)', marginBottom: 6 }}>
                        🌐 Phân tích toàn bộ blog
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>
                        Tất cả sections · {sections.reduce((a, s) => a + (s.count || 0), 0)} bài
                      </div>
                      {!isMobile && (
                        <div style={{ fontSize: 11, color: 'var(--text-subtle)' }}>
                          Đánh giá tổng thể: link density, orphans, cross-section opportunities
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      <div style={{ fontSize: isMobile ? 13 : 14, fontWeight: 500, color: 'var(--text)', marginBottom: 6 }}>
                        Section: <span style={{ color: sectionColor(selected) }}>{selected}</span>
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>
                        {selectedInfo?.count || 0} bài viết
                      </div>
                      {!isMobile && (
                        <div style={{ fontSize: 11, color: 'var(--text-subtle)' }}>
                          Phân tích pillar/supporting, topic gaps, gợi ý links
                        </div>
                      )}
                    </>
                  )}
                </div>
                <button
                  onClick={() => runAnalysis()}
                  style={{
                    padding: isMobile ? '9px 24px' : '8px 20px', borderRadius: 8, fontSize: 13,
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

            {!showHistory && (aiContent || aiLoading) && (
              <div style={{ flex: 1, overflowY: 'auto', padding: isMobile ? 10 : 24 }}>
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
    </div>
  )
}
