import { useEffect, useState, useCallback, useRef, useMemo } from 'react'
import ForceGraph2D from 'react-force-graph-2d'
import { api, streamAI } from '../api'
import SECTION_COLORS, { sectionColor } from '../sectionColors.js'
import AIPanel, { ModelSelect } from './AIPanel.jsx'
import TreeView from './TreeView.jsx'

const MIN_LINK_OPTIONS = [
  { value: '0', label: 'Tất cả' },
  { value: '1', label: '1+' },
  { value: '2', label: '2+' },
  { value: '3', label: '3+' },
  { value: '5', label: '5+' },
]

function hex2rgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `${r},${g},${b}`
}

function ToolbarBtn({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '4px 12px',
        borderRadius: 6,
        border: active ? '1px solid var(--accent)' : '1px solid var(--border)',
        background: active ? 'var(--accent-dim)' : 'transparent',
        color: active ? 'var(--accent-2)' : 'var(--text-muted)',
        fontSize: 12, cursor: 'pointer',
        transition: 'all 0.12s',
        fontWeight: active ? 500 : 400,
      }}
    >{children}</button>
  )
}

export default function GraphView({ onSelectPost, bp = 'desktop' }) {
  const [activeTab, setActiveTab] = useState('graph')
  const containerRef = useRef(null)
  const fgRef = useRef(null)
  const [dimensions, setDimensions] = useState({ w: 900, h: 600 })
  const [graphData, setGraphData] = useState({ nodes: [], links: [] })
  const hoveredRef = useRef(null)         // dùng ref để tránh stale closure trong paintNode
  const [hoveredNode, setHoveredNode] = useState(null)

  const [sections, setSections] = useState([])
  const [minLinks, setMinLinks] = useState('0')
  const [filterSection, setFilterSection] = useState('')
  const [showOrphansOnly, setShowOrphansOnly] = useState(false)
  const [loading, setLoading] = useState(true)
  const [statsInfo, setStatsInfo] = useState({ nodes: 0, edges: 0 })
  const [search, setSearch] = useState('')
  const [showResults, setShowResults] = useState(false)
  const searchRef = useRef('')
  const rawGraphData  = useRef({ nodes: [], links: [] })
  const [rawDataVersion, setRawDataVersion] = useState(0)

  const [showProducts, setShowProducts] = useState(false)
  const [productFilter, setProductFilter] = useState('all') // 'all' | 'has' | 'none'
  const [showLegend, setShowLegend] = useState(true)
  const [showFilters, setShowFilters] = useState(true)
  const [aiModel, setAiModel]     = useState('claude-haiku-4-5-20251001')
  const [aiContent, setAiContent] = useState('')
  const [aiLoading, setAiLoading] = useState(false)
  const [showAI, setShowAI]       = useState(false)

  // Theo dõi kích thước container
  useEffect(() => {
    if (!containerRef.current) return
    const ro = new ResizeObserver(entries => {
      const { width, height } = entries[0].contentRect
      if (width > 0 && height > 0) setDimensions({ w: width, h: height })
    })
    ro.observe(containerRef.current)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    api.sections()
      .then(rows => setSections(rows.map(r => r.article_section)))
      .catch(console.error)
  }, [])

  useEffect(() => {
    setLoading(true)
    const params = {}
    if (minLinks !== '0') params.min_links = minLinks
    if (filterSection) params.section = filterSection

    if (showProducts) params.show_products = true

    api.graph(params).then(data => {
      const nodes = (data.nodes || []).map(n => ({
        id: n.id,
        label: n.data?.label || n.id,
        section: n.data?.section || '',
        color: n.data?.color || '#6b7280',
        inbound: n.data?.inbound || 0,
        outbound: n.data?.outbound || 0,
        url: n.data?.url || '',
        nodeType: n.type || 'postNode',
        hasProducts: n.data?.hasProducts || false,
        productsCount: n.data?.productsCount || 0,
      }))
      const links = (data.edges || []).map(e => ({
        source: e.source,
        target: e.target,
      }))
      rawGraphData.current = { nodes, links }
      setRawDataVersion(v => v + 1)  // trigger orphan effect khi data mới về
    }).catch(console.error).finally(() => setLoading(false))
  }, [minLinks, filterSection, showProducts])

  // Áp dụng orphan filter mỗi khi data thay đổi HOẶC toggle thay đổi
  useEffect(() => {
    const { nodes, links } = rawGraphData.current
    if (!nodes.length) return

    // Normalize source/target về string ID (ForceGraph mutate chúng thành objects)
    const norm = links.map(l => ({
      source: typeof l.source === 'object' ? l.source.id : l.source,
      target: typeof l.target === 'object' ? l.target.id : l.target,
    }))

    let filtered = nodes

    if (showOrphansOnly) {
      const hasInbound = new Set(norm.map(l => l.target))
      filtered = filtered.filter(n => n.nodeType === 'productNode' || !hasInbound.has(n.id))
    }

    if (productFilter === 'has') {
      filtered = filtered.filter(n => n.nodeType === 'productNode' || n.hasProducts)
    } else if (productFilter === 'none') {
      filtered = filtered.filter(n => n.nodeType !== 'productNode' && !n.hasProducts)
    }

    const nodeIds   = new Set(filtered.map(n => n.id))
    const filtLinks = norm.filter(l => nodeIds.has(l.source) && nodeIds.has(l.target))
    setGraphData({ nodes: filtered, links: filtLinks })
    setStatsInfo({ nodes: filtered.length, edges: filtLinks.length })
  }, [showOrphansOnly, productFilter, rawDataVersion])

  // Tăng lực đẩy sau khi data load để nodes xa nhau hơn
  useEffect(() => {
    if (!fgRef.current || graphData.nodes.length === 0) return
    const fg = fgRef.current
    fg.d3Force('charge').strength(-600)
    fg.d3Force('link').distance(140)

    // Clustering force: kéo nodes cùng section về centroid
    const nodes = graphData.nodes
    fg.d3Force('cluster', alpha => {
      const centroids = {}
      nodes.forEach(n => {
        if (!n.section) return
        if (!centroids[n.section]) centroids[n.section] = { x: 0, y: 0, count: 0 }
        centroids[n.section].x     += n.x || 0
        centroids[n.section].y     += n.y || 0
        centroids[n.section].count += 1
      })
      Object.values(centroids).forEach(c => { c.x /= c.count; c.y /= c.count })

      const clusterStrength = 0.14
      nodes.forEach(n => {
        const c = centroids[n.section]
        if (!c) return
        n.vx = (n.vx || 0) + (c.x - (n.x || 0)) * clusterStrength * alpha
        n.vy = (n.vy || 0) + (c.y - (n.y || 0)) * clusterStrength * alpha
      })
    })

    // Galaxy repulsion: đẩy các section ra xa nhau
    fg.d3Force('galaxyRepulsion', alpha => {
      const centroids = {}
      nodes.forEach(n => {
        if (!n.section) return
        if (!centroids[n.section]) centroids[n.section] = { x: 0, y: 0, count: 0, nodes: [] }
        centroids[n.section].x += n.x || 0
        centroids[n.section].y += n.y || 0
        centroids[n.section].count += 1
        centroids[n.section].nodes.push(n)
      })
      Object.values(centroids).forEach(c => { c.x /= c.count; c.y /= c.count })

      const secList = Object.values(centroids)
      for (let i = 0; i < secList.length; i++) {
        for (let j = i + 1; j < secList.length; j++) {
          const a = secList[i], b = secList[j]
          const dx = b.x - a.x, dy = b.y - a.y
          const dist = Math.max(1, Math.hypot(dx, dy))
          const minDist = 320
          if (dist < minDist) {
            const force = (minDist - dist) / minDist * alpha * 1.2
            const fx = (dx / dist) * force, fy = (dy / dist) * force
            a.nodes.forEach(n => { n.vx = (n.vx||0) - fx; n.vy = (n.vy||0) - fy })
            b.nodes.forEach(n => { n.vx = (n.vx||0) + fx; n.vy = (n.vy||0) + fy })
          }
        }
      }
    })

    fg.d3ReheatSimulation()
  }, [graphData])

  // Sync searchRef để dùng trong canvas callback (tránh stale closure)
  useEffect(() => { searchRef.current = search }, [search])

  // Kết quả tìm kiếm
  const searchResults = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return []
    return graphData.nodes
      .filter(n => n.label.toLowerCase().includes(q))
      .slice(0, 8)
  }, [search, graphData.nodes])

  const zoomToNode = useCallback((node) => {
    if (!fgRef.current || node.x == null) return
    fgRef.current.centerAt(node.x, node.y, 600)
    fgRef.current.zoom(6, 600)
    setShowResults(false)
  }, [])

  // Tính neighbor set khi hover
  const onNodeHover = useCallback((node) => {
    if (node) {
      const neighbors = new Set()
      graphData.links.forEach(l => {
        const s = typeof l.source === 'object' ? l.source.id : l.source
        const t = typeof l.target === 'object' ? l.target.id : l.target
        if (s === node.id) neighbors.add(t)
        if (t === node.id) neighbors.add(s)
      })
      node.__neighbors = neighbors
    }
    hoveredRef.current = node || null
    setHoveredNode(node || null)
  }, [graphData.links])

  const onNodeClick = useCallback((node) => {
    if (node.nodeType === 'productNode') {
      if (node.url) window.open(node.url, '_blank', 'noopener')
    } else {
      if (onSelectPost) onSelectPost(node.id)
    }
  }, [onSelectPost])

  // Size: sqrt scaling — hub pages rõ rệt to hơn
  const nodeRadius = (node) => Math.max(4, Math.min(30, 4 + Math.sqrt(node.inbound || 0) * 5))

  // Canvas custom rendering
  const paintNode = useCallback((node, ctx, globalScale) => {
    const h          = hoveredRef.current
    const isHovered  = h?.id === node.id
    const isNeighbor = h?.__neighbors?.has(node.id)
    const q          = searchRef.current.trim().toLowerCase()
    const matchSearch = q ? node.label.toLowerCase().includes(q) : false
    const isDimmed   = (h && !isHovered && !isNeighbor) || (q && !matchSearch)

    // Node chưa có vị trí (frame đầu simulation) — skip
    if (node.x == null || !isFinite(node.x) || !isFinite(node.y)) return

    // Product node — vẽ diamond nhỏ màu cam
    if (node.nodeType === 'productNode') {
      const s = isDimmed ? 3 : (isHovered ? 7 : 5)
      const rgb = '249,115,22'
      if (isDimmed) {
        ctx.beginPath()
        ctx.rect(node.x - s, node.y - s, s * 2, s * 2)
        ctx.fillStyle = `rgba(${rgb},0.08)`
        ctx.fill()
        return
      }
      if (isHovered) {
        const grd = ctx.createRadialGradient(node.x, node.y, s, node.x, node.y, s + 10)
        grd.addColorStop(0, `rgba(${rgb},0.28)`)
        grd.addColorStop(1, `rgba(${rgb},0)`)
        ctx.beginPath(); ctx.arc(node.x, node.y, s + 10, 0, 2 * Math.PI)
        ctx.fillStyle = grd; ctx.fill()
      }
      ctx.save()
      ctx.translate(node.x, node.y)
      ctx.rotate(Math.PI / 4)
      ctx.beginPath()
      ctx.rect(-s, -s, s * 2, s * 2)
      ctx.fillStyle   = `rgba(${rgb},${isHovered ? 0.9 : isNeighbor ? 0.6 : 0.4})`
      ctx.strokeStyle = `rgba(${rgb},${isHovered ? 1 : 0.7})`
      ctx.lineWidth   = isHovered ? 2 : 1
      ctx.fill(); ctx.stroke()
      ctx.restore()
      if (isHovered || globalScale > 2) {
        const label = node.label.length > 22 ? node.label.slice(0, 22) + '…' : node.label
        ctx.font = `${isHovered ? 10 : 8}px sans-serif`
        ctx.fillStyle = `rgba(${rgb},${isHovered ? 0.95 : 0.7})`
        ctx.textAlign = 'center'
        ctx.fillText(label, node.x, node.y + s + 10)
      }
      return
    }

    const r   = nodeRadius(node)
    const isHub = r >= 13   // nodes có ≥4 inbound
    const rgb = hex2rgb(node.color)

    // Dimmed: chỉ chấm mờ, skip rest
    if (isDimmed) {
      ctx.beginPath()
      ctx.arc(node.x, node.y, Math.max(2, r * 0.5), 0, 2 * Math.PI)
      ctx.fillStyle = `rgba(${rgb},0.05)`
      ctx.fill()
      return
    }

    // Radial glow — hub nodes + hovered
    if (isHub || isHovered) {
      const glowR = r + (isHovered ? 14 : isHub ? Math.min(10, r * 0.7) : 6)
      const grd   = ctx.createRadialGradient(node.x, node.y, r * 0.4, node.x, node.y, glowR)
      grd.addColorStop(0, `rgba(${rgb},${isHovered ? 0.3 : 0.14})`)
      grd.addColorStop(1, `rgba(${rgb},0)`)
      ctx.beginPath()
      ctx.arc(node.x, node.y, glowR, 0, 2 * Math.PI)
      ctx.fillStyle = grd
      ctx.fill()
    }

    // Main circle
    ctx.beginPath()
    ctx.arc(node.x, node.y, r, 0, 2 * Math.PI)
    const fillOp   = isHovered ? 0.85 : isNeighbor ? 0.68 : isHub ? 0.58 : 0.44
    const strokeOp = isHovered ? 1    : isNeighbor ? 0.95 : 0.75
    const lw       = isHovered ? 2.5  : r > 12 ? 2 : 1.5
    ctx.fillStyle   = `rgba(${rgb},${fillOp})`
    ctx.strokeStyle = `rgba(${rgb},${strokeOp})`
    ctx.lineWidth   = lw
    ctx.fill()
    ctx.stroke()

    // Bright inner core cho hub nodes
    if (isHub) {
      ctx.beginPath()
      ctx.arc(node.x, node.y, r * 0.32, 0, 2 * Math.PI)
      ctx.fillStyle = `rgba(${rgb},0.92)`
      ctx.fill()
    }

    // Label: luôn hiện cho hub, còn lại cần zoom hoặc hover
    const showLabel = isHub || globalScale > 1.4 || isHovered || isNeighbor
    if (showLabel) {
      const label  = node.label || node.id
      const maxCh  = isHub ? 28 : 22
      const short  = label.length > maxCh ? label.slice(0, maxCh) + '…' : label
      const fsize  = isHovered
        ? Math.min(13, 12 / globalScale)
        : isHub
          ? Math.min(12, 10 / globalScale)
          : Math.min(11, 9  / globalScale)

      ctx.font          = `${isHovered || isHub ? 600 : 400} ${fsize}px system-ui,sans-serif`
      ctx.textAlign     = 'center'
      ctx.textBaseline  = 'top'

      const labelY = node.y + r + 5
      const tw     = ctx.measureText(short).width
      const pad    = 3

      // Background pill
      if (isHovered || isHub) {
        ctx.fillStyle = 'rgba(13,17,23,0.84)'
        ctx.beginPath()
        ctx.roundRect(node.x - tw / 2 - pad, labelY - 1, tw + pad * 2, fsize + 5, 3)
        ctx.fill()
      }

      ctx.fillStyle = isHovered
        ? 'rgba(230,237,243,1)'
        : isHub
          ? 'rgba(230,237,243,0.92)'
          : isNeighbor
            ? 'rgba(230,237,243,0.78)'
            : 'rgba(230,237,243,0.5)'
      ctx.fillText(short, node.x, labelY)
    }
  }, [])

  // Galaxy halos — vẽ trước nodes
  const drawGalaxyHalos = useCallback((ctx) => {
    const nodes = graphData.nodes
    if (!nodes.length) return

    // Tính centroid + spread từng section
    const bySection = {}
    nodes.forEach(n => {
      if (!n.section || n.x == null || !isFinite(n.x)) return
      if (!bySection[n.section]) bySection[n.section] = []
      bySection[n.section].push(n)
    })

    Object.entries(bySection).forEach(([section, sNodes]) => {
      if (sNodes.length < 2) return
      const cx = sNodes.reduce((s, n) => s + n.x, 0) / sNodes.length
      const cy = sNodes.reduce((s, n) => s + n.y, 0) / sNodes.length
      const spread = Math.max(
        60,
        sNodes.reduce((max, n) => Math.max(max, Math.hypot(n.x - cx, n.y - cy)), 0)
      )
      const r = spread + 40

      const color = sectionColor(section)
      const rgb = hex2rgb(color)

      // Outer nebula glow
      const grd = ctx.createRadialGradient(cx, cy, spread * 0.1, cx, cy, r)
      grd.addColorStop(0, `rgba(${rgb},0.07)`)
      grd.addColorStop(0.5, `rgba(${rgb},0.04)`)
      grd.addColorStop(1, `rgba(${rgb},0)`)
      ctx.beginPath()
      ctx.arc(cx, cy, r, 0, 2 * Math.PI)
      ctx.fillStyle = grd
      ctx.fill()

      // Subtle border ring
      ctx.beginPath()
      ctx.arc(cx, cy, r * 0.88, 0, 2 * Math.PI)
      ctx.strokeStyle = `rgba(${rgb},0.08)`
      ctx.lineWidth = 1
      ctx.setLineDash([4, 8])
      ctx.stroke()
      ctx.setLineDash([])

      // Section label ở centroid
      const label = section.length > 20 ? section.slice(0, 20) + '…' : section
      const fsize = Math.max(10, Math.min(16, spread * 0.12))
      ctx.font = `600 ${fsize}px system-ui,sans-serif`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      const tw = ctx.measureText(label).width
      ctx.fillStyle = 'rgba(13,17,23,0.6)'
      ctx.beginPath()
      ctx.roundRect(cx - tw / 2 - 6, cy - fsize / 2 - 3, tw + 12, fsize + 6, 4)
      ctx.fill()
      ctx.fillStyle = `rgba(${rgb},0.75)`
      ctx.fillText(label, cx, cy)
    })
  }, [graphData.nodes])

  // Vùng click khớp với node radius
  const paintNodePointerArea = useCallback((node, color, ctx) => {
    const r = nodeRadius(node)
    ctx.beginPath()
    ctx.arc(node.x, node.y, r + 4, 0, 2 * Math.PI)
    ctx.fillStyle = color
    ctx.fill()
  }, [])

  const getLinkColor = useCallback((link) => {
    const h = hoveredRef.current
    if (!h) return 'rgba(255,255,255,0.07)'
    const s = typeof link.source === 'object' ? link.source.id : link.source
    const t = typeof link.target === 'object' ? link.target.id : link.target
    if (s === h.id) return 'rgba(34,211,238,0.9)'   // outbound → cyan
    if (t === h.id) return 'rgba(52,211,153,0.9)'   // inbound  → green
    return 'rgba(255,255,255,0.02)'
  }, [hoveredNode])

  const getLinkWidth = useCallback((link) => {
    const h = hoveredRef.current
    if (!h) return 0.8
    const s = typeof link.source === 'object' ? link.source.id : link.source
    const t = typeof link.target === 'object' ? link.target.id : link.target
    return (s === h.id || t === h.id) ? 2 : 0.5
  }, [hoveredNode])

  const runClusterAI = useCallback(async () => {
    if (!filterSection || aiLoading) return
    setAiContent('')
    setAiLoading(true)
    setShowAI(true)
    try {
      await streamAI(
        '/ai/cluster',
        { section: filterSection, model: aiModel },
        chunk => setAiContent(prev => prev + chunk),
        () => setAiLoading(false),
      )
    } catch (e) {
      setAiContent(`**Lỗi:** ${e.message}`)
      setAiLoading(false)
    }
  }, [filterSection, aiModel, aiLoading])

  // Sections hiện tại để vẽ legend
  const presentSections = [...new Set(graphData.nodes.map(n => n.section).filter(Boolean))]

  if (activeTab === 'tree') {
    return (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{
          display: 'flex', borderBottom: '1px solid var(--border)',
          background: 'var(--surface)', flexShrink: 0,
        }}>
          {[['graph', '🕸 Link Graph'], ['tree', '🌲 Tree View']].map(([id, label]) => (
            <button key={id} onClick={() => setActiveTab(id)} style={{
              padding: '9px 20px', fontSize: 12, fontWeight: activeTab === id ? 600 : 400,
              background: 'none', border: 'none', cursor: 'pointer',
              color: activeTab === id ? 'var(--accent-2)' : 'var(--text-muted)',
              borderBottom: `2px solid ${activeTab === id ? 'var(--accent)' : 'transparent'}`,
              transition: 'all 0.15s',
            }}>{label}</button>
          ))}
        </div>
        <TreeView onSelectPost={onSelectPost} bp={bp} />
      </div>
    )
  }

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Tab bar */}
      <div style={{
        display: 'flex', borderBottom: '1px solid var(--border)',
        background: 'var(--surface)', flexShrink: 0,
      }}>
        {[['graph', '🕸 Link Graph'], ['tree', '🌲 Tree View']].map(([id, label]) => (
          <button key={id} onClick={() => setActiveTab(id)} style={{
            padding: '9px 20px', fontSize: 12, fontWeight: activeTab === id ? 600 : 400,
            background: 'none', border: 'none', cursor: 'pointer',
            color: activeTab === id ? 'var(--accent-2)' : 'var(--text-muted)',
            borderBottom: `2px solid ${activeTab === id ? 'var(--accent)' : 'transparent'}`,
            transition: 'all 0.15s',
          }}>{label}</button>
        ))}
      </div>
      {/* Toolbar */}
      <div style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)', flexShrink: 0 }}>

        {/* Row 1: Search + Recenter + Stats */}
        <div style={{ padding: '7px 12px', display: 'flex', alignItems: 'center', gap: 8 }}>
          {/* Search */}
          <div style={{ position: 'relative', flex: 1, maxWidth: bp === 'mobile' ? '100%' : 220 }}>
            <input
              value={search}
              onChange={e => { setSearch(e.target.value); setShowResults(true) }}
              onFocus={() => setShowResults(true)}
              onBlur={() => setTimeout(() => setShowResults(false), 150)}
              onKeyDown={e => {
                if (e.key === 'Escape') { setSearch(''); setShowResults(false) }
                if (e.key === 'Enter' && searchResults.length > 0) zoomToNode(searchResults[0])
              }}
              placeholder="Tìm node..."
              style={{
                width: '100%', boxSizing: 'border-box',
                background: 'var(--surface-2)', border: '1px solid var(--border)',
                borderRadius: 6, padding: '5px 28px 5px 10px',
                color: 'var(--text)', fontSize: 12, outline: 'none',
              }}
              onFocusCapture={e => e.target.style.borderColor = 'var(--accent)'}
              onBlurCapture={e => e.target.style.borderColor = 'var(--border)'}
            />
            {search && (
              <button onMouseDown={() => { setSearch(''); setShowResults(false) }}
                style={{ position: 'absolute', right: 6, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: 14, lineHeight: 1, padding: 0 }}
              >×</button>
            )}
            {showResults && searchResults.length > 0 && (
              <div style={{
                position: 'absolute', top: '100%', left: 0, marginTop: 4,
                background: 'var(--surface)', border: '1px solid var(--border)',
                borderRadius: 8, zIndex: 50, minWidth: 260, maxWidth: '90vw',
                boxShadow: '0 8px 24px rgba(0,0,0,0.5)', overflow: 'hidden',
              }}>
                {searchResults.map(node => (
                  <div key={node.id} onMouseDown={() => zoomToNode(node)}
                    style={{ padding: '8px 12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, borderBottom: '1px solid var(--border-2)' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-2)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: node.color, flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 12, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{node.label}</div>
                      <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 1 }}>{node.section} · {node.inbound} inbound</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section select — desktop only */}
          {bp !== 'mobile' && (
            <select value={filterSection} onChange={e => setFilterSection(e.target.value)}
              style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', color: 'var(--text)', borderRadius: 6, padding: '5px 10px', fontSize: 12, cursor: 'pointer', outline: 'none' }}
            >
              <option value="">Tất cả sections</option>
              {sections.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          )}

          {/* Recenter */}
          <button onClick={() => fgRef.current?.zoomToFit(400)}
            title="Recenter"
            style={{ padding: '5px 10px', borderRadius: 6, border: '1px solid var(--border)', background: 'transparent', color: 'var(--text-muted)', fontSize: 12, cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0 }}
          >⊡{bp !== 'mobile' && ' Recenter'}</button>

          {/* Stats */}
          <div style={{ fontSize: 11, color: 'var(--text-subtle)', whiteSpace: 'nowrap', flexShrink: 0 }}>
            {loading ? <span style={{ color: 'var(--warning)' }}>…</span> : <>{statsInfo.nodes}N · {statsInfo.edges}E</>}
          </div>

          {/* Toggle filters */}
          <button
            onClick={() => setShowFilters(v => !v)}
            title={showFilters ? 'Ẩn filters' : 'Hiện filters'}
            style={{
              padding: '4px 8px', borderRadius: 6, fontSize: 11, flexShrink: 0,
              border: `1px solid ${showFilters ? 'var(--accent)' : 'var(--border)'}`,
              background: showFilters ? 'var(--accent-dim)' : 'transparent',
              color: showFilters ? 'var(--accent-2)' : 'var(--text-subtle)',
              cursor: 'pointer', transition: 'all 0.12s',
            }}
          >{showFilters ? '▲' : '▼ Filters'}{showFilters && bp !== 'mobile' ? ' Filters' : ''}</button>
        </div>

        {/* Row 2: Filters */}
        {showFilters && <div style={{ padding: '0 12px 7px', display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
          {/* Min links chips */}
          <span style={{ fontSize: 10, color: 'var(--text-subtle)', flexShrink: 0 }}>Min:</span>
          <div style={{ display: 'flex', gap: 3 }}>
            {MIN_LINK_OPTIONS.map(opt => (
              <ToolbarBtn key={opt.value} active={minLinks === opt.value} onClick={() => setMinLinks(opt.value)}>
                {opt.label}
              </ToolbarBtn>
            ))}
          </div>

          {/* Section select — mobile only */}
          {bp === 'mobile' && (
            <select value={filterSection} onChange={e => setFilterSection(e.target.value)}
              style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', color: 'var(--text)', borderRadius: 6, padding: '4px 8px', fontSize: 11, cursor: 'pointer', outline: 'none', maxWidth: 130 }}
            >
              <option value="">All sections</option>
              {sections.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          )}

          {/* Orphans */}
          <button onClick={() => setShowOrphansOnly(v => !v)}
            style={{ padding: '4px 9px', borderRadius: 6, fontSize: 11, cursor: 'pointer', border: `1px solid ${showOrphansOnly ? 'var(--danger)' : 'var(--border)'}`, background: showOrphansOnly ? 'rgba(248,81,73,0.12)' : 'transparent', color: showOrphansOnly ? 'var(--danger)' : 'var(--text-muted)', transition: 'all 0.15s', whiteSpace: 'nowrap' }}
          >{showOrphansOnly ? '⚠ Orphans' : 'Orphans'}</button>

          {/* Products toggle */}
          <button onClick={() => setShowProducts(v => !v)}
            style={{ padding: '4px 9px', borderRadius: 6, fontSize: 11, cursor: 'pointer', border: `1px solid ${showProducts ? 'rgba(249,115,22,0.6)' : 'var(--border)'}`, background: showProducts ? 'rgba(249,115,22,0.12)' : 'transparent', color: showProducts ? '#f97316' : 'var(--text-muted)', transition: 'all 0.15s', whiteSpace: 'nowrap' }}
          >◆ Sản phẩm</button>

          {/* Product filter */}
          <div style={{ display: 'flex', gap: 2, border: '1px solid var(--border)', borderRadius: 6, overflow: 'hidden' }}>
            {[['all', 'Tất cả'], ['has', 'Có SP'], ['none', 'Không SP']].map(([val, label]) => (
              <button key={val} onClick={() => setProductFilter(val)} style={{
                padding: '4px 8px', fontSize: 11, border: 'none', cursor: 'pointer',
                background: productFilter === val ? 'rgba(249,115,22,0.15)' : 'transparent',
                color: productFilter === val ? '#f97316' : 'var(--text-muted)',
                fontWeight: productFilter === val ? 600 : 400,
                transition: 'all 0.15s', whiteSpace: 'nowrap',
              }}>{label}</button>
            ))}
          </div>

          {/* AI — khi filter section */}
          {filterSection && (
            <>
              {bp !== 'mobile' && <ModelSelect value={aiModel} onChange={setAiModel} disabled={aiLoading} />}
              <button onClick={runClusterAI} disabled={aiLoading}
                style={{ padding: '4px 10px', borderRadius: 6, fontSize: 11, cursor: aiLoading ? 'not-allowed' : 'pointer', border: '1px solid rgba(139,92,246,0.6)', background: aiLoading ? 'rgba(139,92,246,0.08)' : 'rgba(139,92,246,0.12)', color: aiLoading ? 'rgba(167,139,250,0.5)' : '#a78bfa', whiteSpace: 'nowrap' }}
              >🤖 {aiLoading ? '…' : bp === 'mobile' ? 'AI' : `Phân tích "${filterSection}"`}</button>
            </>
          )}
        </div>}
      </div>

      {/* Graph canvas */}
      <div ref={containerRef} style={{ flex: 1, position: 'relative', overflow: 'hidden', background: '#0d1117' }}>
        {!loading && graphData.nodes.length === 0 && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: 13 }}>
            Không có dữ liệu. Thử giảm min links filter.
          </div>
        )}

        {graphData.nodes.length > 0 && (
          <ForceGraph2D
            ref={fgRef}
            width={dimensions.w}
            height={dimensions.h}
            graphData={graphData}
            backgroundColor="#0d1117"
            onRenderFramePre={drawGalaxyHalos}
            nodeCanvasObject={paintNode}
            nodePointerAreaPaint={paintNodePointerArea}
            onNodeHover={onNodeHover}
            onNodeClick={onNodeClick}
            linkColor={getLinkColor}
            linkWidth={getLinkWidth}
            linkDirectionalParticles={link => {
              const h = hoveredRef.current
              if (!h) return 0
              const s = typeof link.source === 'object' ? link.source.id : link.source
              const t = typeof link.target === 'object' ? link.target.id : link.target
              return (s === h.id || t === h.id) ? 2 : 0
            }}
            linkDirectionalParticleWidth={2}
            linkDirectionalParticleColor={link => {
              const s = typeof link.source === 'object' ? link.source.id : link.source
              const t = typeof link.target === 'object' ? link.target.id : link.target
              const h = hoveredRef.current
              if (h && s === h.id) return 'rgba(34,211,238,0.9)'
              if (h && t === h.id) return 'rgba(52,211,153,0.9)'
              return 'rgba(255,255,255,0.4)'
            }}
            linkDirectionalParticleSpeed={0.006}
            cooldownTicks={150}
            d3AlphaDecay={0.022}
            d3VelocityDecay={0.28}
            enableNodeDrag={true}
            enableZoomInteraction={true}
            enablePanInteraction={true}
          />
        )}

        {/* Hint */}
        <div style={{
          position: 'absolute', bottom: 12, left: '50%', transform: 'translateX(-50%)',
          background: 'rgba(22,27,34,0.9)', border: '1px solid rgba(48,54,61,0.8)',
          borderRadius: 20, padding: '4px 14px',
          fontSize: 11, color: 'rgba(125,133,144,0.8)',
          pointerEvents: 'none', whiteSpace: 'nowrap',
          backdropFilter: 'blur(4px)',
        }}>
          <span style={{ color: '#22d3ee' }}>━</span> Outbound &nbsp;·&nbsp; <span style={{ color: '#34d399' }}>━</span> Inbound &nbsp;·&nbsp; Hover node · Click để xem chi tiết
        </div>

        {/* Legend */}
        {presentSections.length > 0 && !showAI && (
          <div style={{
            position: 'absolute', top: 12, right: 12,
            background: 'rgba(22,27,34,0.92)',
            border: '1px solid rgba(48,54,61,0.8)',
            borderRadius: 8, padding: '10px 14px',
            zIndex: 10, minWidth: 130,
            boxShadow: '0 4px 16px rgba(0,0,0,0.6)',
            backdropFilter: 'blur(4px)',
          }}>
            <div style={{
              fontSize: 10, fontWeight: 600, color: 'var(--text-muted)',
              textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8,
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8,
            }}>
              <span>Sections (click để lọc)</span>
              <button
                onClick={() => setShowLegend(v => !v)}
                style={{ background: 'none', border: 'none', color: 'var(--text-subtle)', cursor: 'pointer', fontSize: 12, lineHeight: 1, padding: 0 }}
              >{showLegend ? '▲' : '▼'}</button>
            </div>
            {showLegend && (
              <>
                {presentSections.map(name => {
                  const color = sectionColor(name)
                  const isActive = filterSection === name
                  return (
                    <div
                      key={name}
                      onClick={() => setFilterSection(isActive ? '' : name)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 7, marginBottom: 5,
                        cursor: 'pointer', borderRadius: 4, padding: '2px 4px', margin: '0 -4px 3px',
                        background: isActive ? color + '20' : 'transparent',
                        transition: 'background 0.1s',
                      }}
                      onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.06)' }}
                      onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent' }}
                    >
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: color, flexShrink: 0, opacity: isActive ? 1 : 0.7 }} />
                      <span style={{ fontSize: 11, color: isActive ? 'var(--text)' : 'var(--text-muted)', fontWeight: isActive ? 600 : 400 }}>{name}</span>
                      {isActive && <span style={{ fontSize: 9, color, marginLeft: 'auto' }}>✕</span>}
                    </div>
                  )
                })}
                <div style={{ borderTop: '1px solid rgba(48,54,61,0.6)', marginTop: 8, paddingTop: 8 }}>
                  <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>Links</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 5 }}>
                    <div style={{ width: 16, height: 2, background: '#22d3ee', borderRadius: 1, flexShrink: 0 }} />
                    <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Outbound</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                    <div style={{ width: 16, height: 2, background: '#34d399', borderRadius: 1, flexShrink: 0 }} />
                    <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Inbound</span>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* AI Panel */}
        {showAI && (
          <AIPanel
            title={`Cluster: ${filterSection}`}
            content={aiContent}
            loading={aiLoading}
            onClose={() => { setShowAI(false); setAiContent('') }}
            style={{
              position: 'absolute', top: 12, right: 12,
              width: 340, maxHeight: 'calc(100% - 24px)',
              zIndex: 20,
            }}
          />
        )}

        {/* Hover tooltip */}
        {hoveredNode && (
          <div style={{
            position: 'absolute', top: 12, left: 12,
            background: 'rgba(22,27,34,0.95)',
            border: `1px solid ${hoveredNode.color}40`,
            borderRadius: 8, padding: '10px 14px',
            maxWidth: 260, zIndex: 10,
            boxShadow: '0 4px 16px rgba(0,0,0,0.6)',
            backdropFilter: 'blur(4px)',
          }}>
            <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--text)', lineHeight: 1.4, marginBottom: 6 }}>
              {hoveredNode.label}
            </div>
            <div style={{ display: 'flex', gap: 10, fontSize: 11, color: 'var(--text-muted)' }}>
              {hoveredNode.section && (
                <span style={{ color: hoveredNode.color }}>{hoveredNode.section}</span>
              )}
              <span>{hoveredNode.inbound} inbound</span>
              <span>{hoveredNode.outbound} outbound</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
