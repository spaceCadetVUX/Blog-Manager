import { useEffect, useState, useCallback, useRef, useMemo } from 'react'
import ForceGraph2D from 'react-force-graph-2d'
import { api, streamAI } from '../api'
import SECTION_COLORS, { sectionColor } from '../sectionColors.js'
import AIPanel, { ModelSelect } from './AIPanel.jsx'
import TreeView from './TreeView.jsx'


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
  const hoveredRef = useRef(null)
  const pinnedRef  = useRef(null)
  const danceRafRef = useRef(null)
  const [hoveredNode, setHoveredNode] = useState(null)
  const [pinnedNode, setPinnedNode]   = useState(null)

  const [sections, setSections] = useState([])
  const [minLinks, setMinLinks] = useState('0')
  const [filterSection, setFilterSection] = useState('')
  const [showOrphansOnly, setShowOrphansOnly] = useState(false)
  const [loading, setLoading] = useState(true)
  const [statsInfo, setStatsInfo] = useState({ nodes: 0, edges: 0 })
  const [search, setSearch] = useState('')
  const [showResults, setShowResults] = useState(false)
  const [searchType, setSearchType] = useState('all') // 'all' | 'post' | 'product'
  const [searchCursor, setSearchCursor] = useState(0)
  const searchRef = useRef('')
  const rawGraphData  = useRef({ nodes: [], links: [] })
  const [rawDataVersion, setRawDataVersion] = useState(0)

  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo]     = useState('')
  const dateFromRef = useRef('')
  const dateToRef   = useRef('')
  const nodeMapRef  = useRef({})
  const [hideLinks, setHideLinks] = useState(false)
  const [showSectionDrop, setShowSectionDrop] = useState(false)
  const [danceMode, setDanceMode] = useState(false)
  const danceModeRef = useRef(false)
  const [showProducts, setShowProducts] = useState(true)
  const [productFilter, setProductFilter] = useState('all') // 'all' | 'has' | 'none'
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
        dateModified: n.data?.dateModified || '',
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
    fg.d3Force('charge').strength(-1400)
    fg.d3Force('link').distance(200)

    const nodes = graphData.nodes

    // Clustering force: kéo nodes cùng section về centroid
    fg.d3Force('cluster', alpha => {
      const centroids = {}
      const sectionCounts = {}
      nodes.forEach(n => {
        if (!n.section) return
        if (!centroids[n.section]) centroids[n.section] = { x: 0, y: 0, count: 0 }
        centroids[n.section].x += n.x || 0
        centroids[n.section].y += n.y || 0
        centroids[n.section].count += 1
        sectionCounts[n.section] = (sectionCounts[n.section] || 0) + 1
      })
      Object.values(centroids).forEach(c => { c.x /= c.count; c.y /= c.count })
      nodes.forEach(n => {
        const c = centroids[n.section]
        if (!c) return
        const cnt = sectionCounts[n.section] || 1
        const strength = Math.max(0.015, 0.10 - cnt * 0.003)
        n.vx = (n.vx || 0) + (c.x - (n.x || 0)) * strength * alpha
        n.vy = (n.vy || 0) + (c.y - (n.y || 0)) * strength * alpha
      })
    })

    // Label zone repulsion: đẩy nodes ra khỏi centroid để label không bị đè
    fg.d3Force('labelRepulsion', alpha => {
      const centroids = {}
      nodes.forEach(n => {
        if (!n.section) return
        if (!centroids[n.section]) centroids[n.section] = { x: 0, y: 0, count: 0 }
        centroids[n.section].x += n.x || 0
        centroids[n.section].y += n.y || 0
        centroids[n.section].count += 1
      })
      Object.values(centroids).forEach(c => { c.x /= c.count; c.y /= c.count })
      const clearR = 55 // bán kính vùng trống quanh label
      nodes.forEach(n => {
        const c = centroids[n.section]
        if (!c || n.x == null) return
        const dx = (n.x || 0) - c.x
        const dy = (n.y || 0) - c.y
        const dist = Math.max(1, Math.hypot(dx, dy))
        if (dist < clearR) {
          const force = ((clearR - dist) / clearR) * alpha * 1.5
          n.vx = (n.vx || 0) + (dx / dist) * force
          n.vy = (n.vy || 0) + (dy / dist) * force
        }
      })
    })

    // Galaxy repulsion: đẩy các section ra xa nhau (O(s²) — s nhỏ nên ổn)
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
          const minDist = 360 + (a.nodes.length + b.nodes.length) * 5
          if (dist < minDist) {
            const force = (minDist - dist) / minDist * alpha * 1.4
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
  useEffect(() => { dateFromRef.current = dateFrom }, [dateFrom])
  useEffect(() => { dateToRef.current = dateTo }, [dateTo])
  // Giữ render loop chạy liên tục khi date filter active
  useEffect(() => {
    if (!dateFrom && !dateTo) return
    const kick = () => fgRef.current?.resumeAnimation()
    kick()
    const id = setInterval(kick, 500)
    return () => clearInterval(id)
  }, [dateFrom, dateTo])

  useEffect(() => { danceModeRef.current = danceMode }, [danceMode])

  // Tắt dance khi số node thay đổi (toggle products) — tránh lỗi node chưa có tọa độ
  useEffect(() => {
    if (danceMode) setDanceMode(false)
  }, [graphData.nodes.length])

  useEffect(() => {
    const nodes = graphData.nodes
    if (!danceMode) {
      if (danceRafRef.current) { cancelAnimationFrame(danceRafRef.current); danceRafRef.current = null }
      nodes.forEach(n => { delete n.fx; delete n.fy; delete n._hx; delete n._hy })
      fgRef.current?.d3ReheatSimulation()
      return
    }
    if (!fgRef.current || !nodes.length) return

    // Chụp home position + gán phase riêng cho mỗi node (golden ratio)
    nodes.forEach((n, i) => {
      n._hx     = n.x || 0
      n._hy     = n.y || 0
      n._phase  = i * 2.399  // golden angle ~137.5° in radians
    })

    // Tính centroids từ home
    const centroids = {}
    nodes.forEach(n => {
      if (!n.section) return
      if (!centroids[n.section]) centroids[n.section] = { x: 0, y: 0, count: 0 }
      centroids[n.section].x += n._hx; centroids[n.section].y += n._hy; centroids[n.section].count++
    })
    Object.values(centroids).forEach(c => { c.x /= c.count; c.y /= c.count })

    // Tâm toàn cục = trung bình tất cả home positions
    const globalCx = nodes.reduce((s, n) => s + n._hx, 0) / nodes.length
    const globalCy = nodes.reduce((s, n) => s + n._hy, 0) / nodes.length

    // Mỗi galaxy orbit quanh tâm toàn cục
    const galaxyOrbits = {}
    Object.entries(centroids).forEach(([sec, c]) => {
      const dx = c.x - globalCx, dy = c.y - globalCy
      galaxyOrbits[sec] = {
        angle0: Math.atan2(dy, dx),
        dist:   Math.max(Math.hypot(dx, dy), 20),
        hx: c.x, hy: c.y,   // home position của centroid
      }
    })

    // Lưu góc + khoảng cách ban đầu của mỗi node so với centroid HOME
    nodes.forEach(n => {
      const c = centroids[n.section]
      if (!c) return
      const dx = n._hx - c.x, dy = n._hy - c.y
      n._angle0 = Math.atan2(dy, dx)
      n._dist   = Math.hypot(dx, dy)
    })

    // Assign product nodes → galaxy gần nhất, orbit outer ring
    const centroidList = Object.entries(centroids)
    nodes.forEach(n => {
      if (n.nodeType !== 'productNode' || !centroidList.length) return
      let bestSec = null, bestD = Infinity
      centroidList.forEach(([sec, c]) => {
        const d = Math.hypot(n._hx - c.x, n._hy - c.y)
        if (d < bestD) { bestD = d; bestSec = sec }
      })
      if (!bestSec) return
      n._galaxySec = bestSec
      const c = centroids[bestSec]
      const dx = n._hx - c.x, dy = n._hy - c.y
      n._angle0 = Math.atan2(dy, dx)
      n._dist   = Math.max(bestD, 80) + 30
    })

    const animate = () => {
      if (!danceModeRef.current) return
      const t = performance.now() / 1000

      // Bước 1: tính vị trí hiện tại của từng centroid (đang orbit quanh global center)
      const movingCentroids = {}
      Object.entries(galaxyOrbits).forEach(([sec, g]) => {
        const gSpeed = 45 / Math.max(g.dist, 10)
        const a = g.angle0 + t * gSpeed
        movingCentroids[sec] = {
          x: globalCx + Math.cos(a) * g.dist,
          y: globalCy + Math.sin(a) * g.dist,
        }
      })

      // Bước 2: mỗi node orbit quanh centroid đang chuyển động
      nodes.forEach(n => {
        const p = n._phase
        const sec = n.nodeType === 'productNode' ? n._galaxySec : n.section
        const c = movingCentroids[sec]
        if (c && n._dist != null) {
          const speed = 45 / Math.max(n._dist, 10)
          const angle = n._angle0 + t * speed
          const bx = c.x + Math.cos(angle) * n._dist
          const by = c.y + Math.sin(angle) * n._dist
          n.fx = bx + Math.sin(t * 0.28 + p) * 10 + Math.sin(t * 0.17 + p * 1.3) * 5
          n.fy = by + Math.cos(t * 0.23 + p * 0.9) * 8  + Math.cos(t * 0.13 + p * 1.7) * 4
        } else {
          n.fx = n._hx + Math.sin(t * 0.2 + p) * 12
          n.fy = n._hy + Math.cos(t * 0.17 + p) * 10
        }
      })

      fgRef.current?.resumeAnimation()
      danceRafRef.current = requestAnimationFrame(animate)
    }

    danceRafRef.current = requestAnimationFrame(animate)

    // d3ReheatSimulation reset cooldownTicks counter để render loop không dừng
    // nodes không bị di chuyển vì đã pin bằng fx/fy
    const keepAlive = setInterval(() => {
      if (danceModeRef.current) fgRef.current?.d3ReheatSimulation()
    }, 1500)

    return () => {
      cancelAnimationFrame(danceRafRef.current)
      danceRafRef.current = null
      clearInterval(keepAlive)
      nodes.forEach(n => { delete n.fx; delete n.fy; delete n._hx; delete n._hy; delete n._angle0; delete n._dist; delete n._phase; delete n._galaxy; delete n._galaxySec })
    }
  }, [danceMode, graphData.nodes])
  useEffect(() => {
    const m = {}
    graphData.nodes.forEach(n => { m[n.id] = n })
    nodeMapRef.current = m
  }, [graphData.nodes])

  // Kết quả tìm kiếm
  const searchResults = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return []
    const filtered = graphData.nodes.filter(n => {
      if (searchType === 'post' && n.nodeType === 'productNode') return false
      if (searchType === 'product' && n.nodeType !== 'productNode') return false
      return n.label.toLowerCase().includes(q)
    })
    // Sort: starts-with trước, contains sau; cùng loại thì sort by inbound
    filtered.sort((a, b) => {
      const aStart = a.label.toLowerCase().startsWith(q) ? 0 : 1
      const bStart = b.label.toLowerCase().startsWith(q) ? 0 : 1
      if (aStart !== bStart) return aStart - bStart
      return (b.inbound || 0) - (a.inbound || 0)
    })
    return filtered.slice(0, 10)
  }, [search, searchType, graphData.nodes])

  // Tính neighbor set khi hover
  const buildNeighbors = useCallback((node) => {
    const neighbors = new Set()
    graphData.links.forEach(l => {
      const s = typeof l.source === 'object' ? l.source.id : l.source
      const t = typeof l.target === 'object' ? l.target.id : l.target
      if (s === node.id) neighbors.add(t)
      if (t === node.id) neighbors.add(s)
    })
    node.__neighbors = neighbors
  }, [graphData.links])

  const zoomToNode = useCallback((node) => {
    if (!fgRef.current || node.x == null) return
    fgRef.current.centerAt(node.x, node.y, 600)
    fgRef.current.zoom(5, 600)
    setShowResults(false)
    buildNeighbors(node)
    pinnedRef.current = node
    setPinnedNode(node)
    setTimeout(() => fgRef.current?.d3ReheatSimulation(), 50)
  }, [graphData.links, buildNeighbors])

  const onNodeHover = useCallback((node) => {
    if (node) buildNeighbors(node)
    hoveredRef.current = node || null
    setHoveredNode(node || null)
  }, [buildNeighbors])

  const clickTimerRef = useRef(null)

  const onNodeClick = useCallback((node) => {
    if (clickTimerRef.current) {
      // Double click → clear pin + thực hiện action
      clearTimeout(clickTimerRef.current)
      clickTimerRef.current = null
      pinnedRef.current = null
      setPinnedNode(null)
      if (node.nodeType === 'productNode') {
        if (node.url) window.open(node.url, '_blank', 'noopener')
      } else {
        if (onSelectPost) onSelectPost(node.id)
      }
      return
    }
    clickTimerRef.current = setTimeout(() => {
      clickTimerRef.current = null
      // Single click: toggle pin connections
      if (pinnedRef.current?.id === node.id) {
        pinnedRef.current = null
        setPinnedNode(null)
      } else {
        buildNeighbors(node)
        pinnedRef.current = node
        setPinnedNode(node)
      }
    }, 250)
  }, [onSelectPost, buildNeighbors])

  // Size: sqrt scaling — hub pages rõ rệt to hơn
  const nodeRadius = (node) => Math.max(3, Math.min(18, 3 + Math.sqrt(node.inbound || 0) * 3))

  // Canvas custom rendering
  const paintNode = useCallback((node, ctx, globalScale) => {
    const h          = pinnedRef.current || hoveredRef.current
    const isHovered  = h?.id === node.id
    const isNeighbor = h?.__neighbors?.has(node.id)
    const q          = searchRef.current.trim().toLowerCase()
    const matchSearch = q ? node.label.toLowerCase().includes(q) : false

    const df = dateFromRef.current, dt = dateToRef.current
    const dateActive = df || dt
    const inDateRange = !dateActive || (() => {
      if (!node.dateModified) return false
      const iso = node.dateModified.slice(0, 10)
      if (df && iso < df) return false
      if (dt && iso > dt) return false
      return true
    })()

    const isDimmed   = (h && !isHovered && !isNeighbor) || (q && !matchSearch) || (dateActive && !inDateRange)

    // Node chưa có vị trí (frame đầu simulation) — skip
    if (node.x == null || !isFinite(node.x) || !isFinite(node.y)) return

    // Product node — vẽ diamond nhỏ màu cam
    if (node.nodeType === 'productNode') {
      const s = isDimmed ? 3 : (isHovered ? 8 : 6)
      const rgb = '249,115,22'
      if (isDimmed) {
        ctx.beginPath()
        ctx.rect(node.x - s, node.y - s, s * 2, s * 2)
        ctx.fillStyle = `rgba(${rgb},0.15)`
        ctx.fill()
        return
      }
      // Glow halo
      const glowS = isHovered ? s + 14 : s + 8
      const grd = ctx.createRadialGradient(node.x, node.y, s * 0.5, node.x, node.y, glowS)
      grd.addColorStop(0, `rgba(${rgb},${isHovered ? 0.45 : 0.25})`)
      grd.addColorStop(1, `rgba(${rgb},0)`)
      ctx.beginPath(); ctx.arc(node.x, node.y, glowS, 0, 2 * Math.PI)
      ctx.fillStyle = grd; ctx.fill()

      ctx.save()
      ctx.translate(node.x, node.y)
      ctx.rotate(Math.PI / 4)
      ctx.beginPath()
      ctx.rect(-s, -s, s * 2, s * 2)
      ctx.fillStyle   = `rgba(${rgb},${isHovered ? 0.95 : isNeighbor ? 0.78 : 0.62})`
      ctx.strokeStyle = `rgba(${rgb},1)`
      ctx.lineWidth   = isHovered ? 2.5 : 1.5
      ctx.fill(); ctx.stroke()
      ctx.restore()
      if (isHovered || globalScale > 2) {
        const label = node.label.length > 22 ? node.label.slice(0, 22) + '…' : node.label
        ctx.font = `${isHovered ? 10 : 8}px sans-serif`
        ctx.fillStyle = `rgba(${rgb},${isHovered ? 1 : 0.8})`
        ctx.textAlign = 'center'
        ctx.fillText(label, node.x, node.y + s + 11)
      }
      return
    }

    const r   = nodeRadius(node)
    const isHub = r >= 9
    const rgb = hex2rgb(node.color)

    // Dimmed: chấm mờ nhưng vẫn nhìn thấy
    if (isDimmed) {
      ctx.beginPath()
      ctx.arc(node.x, node.y, Math.max(2.5, r * 0.55), 0, 2 * Math.PI)
      ctx.fillStyle = `rgba(${rgb},0.15)`
      ctx.fill()
      return
    }

    // Wave ripple: date-filtered nodes hoặc hovered/neighbor
    if ((dateActive && inDateRange) || isHovered || isNeighbor) {
      const period = 1800 // ms mỗi vòng
      const maxExpand = 28
      for (let i = 0; i < 2; i++) {
        const t = ((performance.now() + i * period * 0.5) % period) / period
        const wr = r + t * maxExpand
        const op = (1 - t) * 0.6
        ctx.beginPath()
        ctx.arc(node.x, node.y, wr, 0, 2 * Math.PI)
        ctx.strokeStyle = `rgba(${rgb},${op})`
        ctx.lineWidth = 1.5
        ctx.stroke()
      }
    }

    // Outer radial glow — tất cả nodes đều có, hub + hovered mạnh hơn
    const glowR   = r + (isHovered ? 22 : isHub ? r * 1.2 : r * 0.8)
    const glowOp0 = isHovered ? 0.55 : isHub ? 0.32 : 0.18
    const grd     = ctx.createRadialGradient(node.x, node.y, r * 0.3, node.x, node.y, glowR)
    grd.addColorStop(0, `rgba(${rgb},${glowOp0})`)
    grd.addColorStop(0.5, `rgba(${rgb},${glowOp0 * 0.4})`)
    grd.addColorStop(1, `rgba(${rgb},0)`)
    ctx.beginPath()
    ctx.arc(node.x, node.y, glowR, 0, 2 * Math.PI)
    ctx.fillStyle = grd
    ctx.fill()

    // Main circle
    ctx.beginPath()
    ctx.arc(node.x, node.y, r, 0, 2 * Math.PI)
    const fillOp   = isHovered ? 0.95 : isNeighbor ? 0.82 : isHub ? 0.78 : 0.68
    const strokeOp = isHovered ? 1    : isNeighbor ? 1    : isHub ? 0.95 : 0.85
    const lw       = isHovered ? 2.5  : isHub ? 2 : 1.5
    ctx.fillStyle   = `rgba(${rgb},${fillOp})`
    ctx.strokeStyle = `rgba(${rgb},${strokeOp})`
    ctx.lineWidth   = lw
    ctx.fill()
    ctx.stroke()

    // Bright inner core
    if (isHub || isHovered) {
      ctx.beginPath()
      ctx.arc(node.x, node.y, r * (isHovered ? 0.45 : 0.38), 0, 2 * Math.PI)
      ctx.fillStyle = `rgba(${rgb},1)`
      ctx.fill()
    }

    // Specular highlight — white dot góc trên trái cho cảm giác 3D
    if (r >= 6) {
      const hx = node.x - r * 0.3
      const hy = node.y - r * 0.3
      const hr = Math.max(1, r * 0.22)
      const hgrd = ctx.createRadialGradient(hx, hy, 0, hx, hy, hr)
      hgrd.addColorStop(0, `rgba(255,255,255,${isHovered ? 0.55 : 0.3})`)
      hgrd.addColorStop(1, `rgba(255,255,255,0)`)
      ctx.beginPath()
      ctx.arc(hx, hy, hr, 0, 2 * Math.PI)
      ctx.fillStyle = hgrd
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
  }, [hoveredNode, pinnedNode, dateFrom, dateTo])

  // Tính centroid + spread một lần, dùng chung cho halos và labels
  const getSectionGeometry = useCallback(() => {
    const bySection = {}
    graphData.nodes.forEach(n => {
      if (!n.section || n.x == null || !isFinite(n.x)) return
      if (!bySection[n.section]) bySection[n.section] = []
      bySection[n.section].push(n)
    })
    const result = {}
    Object.entries(bySection).forEach(([section, sNodes]) => {
      if (sNodes.length < 2) return
      const cx = sNodes.reduce((s, n) => s + n.x, 0) / sNodes.length
      const cy = sNodes.reduce((s, n) => s + n.y, 0) / sNodes.length
      const spread = Math.max(60, sNodes.reduce((max, n) => Math.max(max, Math.hypot(n.x - cx, n.y - cy)), 0))
      result[section] = { cx, cy, spread, color: sectionColor(section) }
    })
    return result
  }, [graphData.nodes])

  // Vẽ halos trước nodes (background)
  const drawGalaxyHalos = useCallback((ctx) => {
    if (!graphData.nodes.length) return
    const geo = getSectionGeometry()
    Object.entries(geo).forEach(([section, { cx, cy, spread, color }]) => {
      const rgb = hex2rgb(color)
      const r = spread + 40

      const grdOuter = ctx.createRadialGradient(cx, cy, spread * 0.2, cx, cy, r)
      grdOuter.addColorStop(0, `rgba(${rgb},0.14)`)
      grdOuter.addColorStop(0.45, `rgba(${rgb},0.07)`)
      grdOuter.addColorStop(1, `rgba(${rgb},0)`)
      ctx.beginPath(); ctx.arc(cx, cy, r, 0, 2 * Math.PI)
      ctx.fillStyle = grdOuter; ctx.fill()

      const grdInner = ctx.createRadialGradient(cx, cy, 0, cx, cy, spread * 0.55)
      grdInner.addColorStop(0, `rgba(${rgb},0.22)`)
      grdInner.addColorStop(1, `rgba(${rgb},0)`)
      ctx.beginPath(); ctx.arc(cx, cy, spread * 0.55, 0, 2 * Math.PI)
      ctx.fillStyle = grdInner; ctx.fill()

      ctx.beginPath(); ctx.arc(cx, cy, r * 0.88, 0, 2 * Math.PI)
      ctx.strokeStyle = `rgba(${rgb},0.55)`; ctx.lineWidth = 1.5
      ctx.setLineDash([5, 9]); ctx.stroke(); ctx.setLineDash([])

      ctx.beginPath(); ctx.arc(cx, cy, spread + 10, 0, 2 * Math.PI)
      ctx.strokeStyle = `rgba(${rgb},0.35)`; ctx.lineWidth = 1.2; ctx.stroke()
    })
  }, [graphData.nodes, getSectionGeometry])

  // Vẽ labels SAU nodes — không bị đè
  const drawGalaxyLabels = useCallback((ctx) => {
    if (!graphData.nodes.length) return
    const geo = getSectionGeometry()
    Object.entries(geo).forEach(([section, { cx, cy, spread, color }]) => {
      const rgb = hex2rgb(color)

      const labelY = cy

      const label = section.length > 20 ? section.slice(0, 20) + '…' : section
      const fsize = Math.max(13, Math.min(18, spread * 0.15))
      ctx.font = `800 ${fsize}px system-ui,sans-serif`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      const tw = ctx.measureText(label).width
      const ph = fsize + 12  // pill height
      const pw = tw + 28     // pill width
      const px = cx - pw / 2
      const py = labelY - ph / 2

      // Drop shadow
      ctx.shadowColor = `rgba(${rgb},0.5)`
      ctx.shadowBlur = 12

      // Pill background
      ctx.fillStyle = 'rgba(10,14,20,0.95)'
      ctx.beginPath(); ctx.roundRect(px, py, pw, ph, 7); ctx.fill()
      ctx.shadowBlur = 0

      // Colored top accent bar
      ctx.fillStyle = `rgba(${rgb},0.9)`
      ctx.beginPath(); ctx.roundRect(px, py, pw, 3, [7, 7, 0, 0]); ctx.fill()

      // Border
      ctx.strokeStyle = `rgba(${rgb},0.55)`
      ctx.lineWidth = 1.5
      ctx.beginPath(); ctx.roundRect(px, py, pw, ph, 7); ctx.stroke()

      // Dot + text
      const dotX = cx - tw / 2 - 6
      ctx.beginPath(); ctx.arc(dotX, labelY, 3.5, 0, 2 * Math.PI)
      ctx.fillStyle = `rgba(${rgb},1)`; ctx.fill()

      ctx.fillStyle = '#e6edf3'
      ctx.fillText(label, cx + 4, labelY)
    })
  }, [graphData.nodes, getSectionGeometry])

  // Vùng click khớp với node radius
  const paintNodePointerArea = useCallback((node, color, ctx) => {
    const r = nodeRadius(node)
    ctx.beginPath()
    ctx.arc(node.x, node.y, r + 4, 0, 2 * Math.PI)
    ctx.fillStyle = color
    ctx.fill()
  }, [])

  const isNodeInDateRange = (nodeId) => {
    const df = dateFromRef.current, dt = dateToRef.current
    if (!df && !dt) return true
    const n = nodeMapRef.current[nodeId]
    if (!n) return false
    if (!n.dateModified) return false
    const iso = n.dateModified.slice(0, 10)
    if (df && iso < df) return false
    if (dt && iso > dt) return false
    return true
  }

  const getLinkColor = useCallback((link) => {
    const s = typeof link.source === 'object' ? link.source.id : link.source
    const t = typeof link.target === 'object' ? link.target.id : link.target
    const df = dateFromRef.current, dt = dateToRef.current
    const dateDimmed = (df || dt) && !isNodeInDateRange(s) && !isNodeInDateRange(t)
    if (dateDimmed) return 'rgba(255,255,255,0.03)'
    const h = pinnedRef.current || hoveredRef.current
    if (!h) return hideLinks ? 'rgba(255,255,255,0)' : 'rgba(255,255,255,0.13)'
    if (s === h.id) return 'rgba(34,211,238,0.9)'
    if (t === h.id) return 'rgba(52,211,153,0.9)'
    return hideLinks ? 'rgba(255,255,255,0)' : 'rgba(255,255,255,0.04)'
  }, [hoveredNode, pinnedNode, dateFrom, dateTo, hideLinks])

  const getLinkWidth = useCallback((link) => {
    const s = typeof link.source === 'object' ? link.source.id : link.source
    const t = typeof link.target === 'object' ? link.target.id : link.target
    const df = dateFromRef.current, dt = dateToRef.current
    const dateDimmed = (df || dt) && !isNodeInDateRange(s) && !isNodeInDateRange(t)
    if (dateDimmed) return 0.3
    const h = pinnedRef.current || hoveredRef.current
    if (!h) return hideLinks ? 0 : 0.8
    return (s === h.id || t === h.id) ? 2 : (hideLinks ? 0 : 0.5)
  }, [hoveredNode, pinnedNode, dateFrom, dateTo, hideLinks])

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
          <div style={{ position: 'relative', flex: 1, maxWidth: bp === 'mobile' ? '100%' : 260 }}>
            <input
              value={search}
              onChange={e => { setSearch(e.target.value); setShowResults(true); setSearchCursor(0) }}
              onFocus={() => setShowResults(true)}
              onBlur={() => setTimeout(() => setShowResults(false), 180)}
              onKeyDown={e => {
                if (e.key === 'Escape') { setSearch(''); setShowResults(false) }
                if (e.key === 'ArrowDown') { e.preventDefault(); setSearchCursor(c => Math.min(c + 1, searchResults.length - 1)) }
                if (e.key === 'ArrowUp')   { e.preventDefault(); setSearchCursor(c => Math.max(c - 1, 0)) }
                if (e.key === 'Enter' && searchResults.length > 0) {
                  zoomToNode(searchResults[searchCursor])
                }
              }}
              placeholder="Tìm bài viết, sản phẩm..."
              style={{
                width: '100%', boxSizing: 'border-box',
                background: 'var(--surface-2)', border: '1px solid var(--border)',
                borderRadius: 6, padding: '5px 28px 5px 10px',
                color: 'var(--text)', fontSize: 12, outline: 'none',
              }}
              onFocusCapture={e => e.target.style.borderColor = 'var(--accent)'}
              onBlurCapture={e => e.target.style.borderColor = 'var(--border)'}
            />
            {search
              ? <button onMouseDown={() => { setSearch(''); setShowResults(false) }}
                  style={{ position: 'absolute', right: 6, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: 14, lineHeight: 1, padding: 0 }}
                >×</button>
              : <svg style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--text-subtle)" strokeWidth="2.5" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            }

            {showResults && search.trim() && (
              <div style={{
                position: 'absolute', top: '100%', left: 0, marginTop: 4,
                background: '#161b22', border: '1px solid var(--border)',
                borderRadius: 10, zIndex: 50, width: 340, maxWidth: '90vw',
                boxShadow: '0 12px 32px rgba(0,0,0,0.6)',
                overflow: 'hidden',
              }}>
                {/* Type filter tabs */}
                <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', background: 'var(--surface)' }}>
                  {[['all','Tất cả'], ['post','Bài viết'], ['product','◆ Sản phẩm']].map(([val, lbl]) => (
                    <button key={val} onMouseDown={e => { e.preventDefault(); setSearchType(val); setSearchCursor(0) }}
                      style={{
                        flex: 1, padding: '6px 4px', fontSize: 11, border: 'none', cursor: 'pointer',
                        background: searchType === val ? 'var(--accent-dim)' : 'transparent',
                        color: searchType === val ? 'var(--accent-2)' : 'var(--text-muted)',
                        borderBottom: `2px solid ${searchType === val ? 'var(--accent)' : 'transparent'}`,
                        fontWeight: searchType === val ? 600 : 400,
                        transition: 'all 0.12s',
                      }}
                    >{lbl}</button>
                  ))}
                </div>

                {/* Result count */}
                {searchResults.length > 0 && (
                  <div style={{ padding: '5px 12px', fontSize: 10, color: 'var(--text-subtle)', borderBottom: '1px solid var(--border-2)' }}>
                    {searchResults.length} kết quả{searchResults.length === 10 ? ' (top 10)' : ''}
                  </div>
                )}

                {/* Results */}
                <div style={{ maxHeight: 360, overflow: 'auto' }}>
                  {searchResults.length === 0 ? (
                    <div style={{ padding: '16px 12px', fontSize: 12, color: 'var(--text-muted)', textAlign: 'center' }}>
                      Không tìm thấy kết quả
                    </div>
                  ) : searchResults.map((node, i) => {
                    const isProduct = node.nodeType === 'productNode'
                    const isCursor  = i === searchCursor
                    const q = search.trim().toLowerCase()
                    const lbl = node.label
                    const idx = lbl.toLowerCase().indexOf(q)
                    // Highlight match
                    const before = idx >= 0 ? lbl.slice(0, idx) : lbl
                    const match  = idx >= 0 ? lbl.slice(idx, idx + q.length) : ''
                    const after  = idx >= 0 ? lbl.slice(idx + q.length) : ''

                    return (
                      <div key={node.id}
                        onMouseDown={() => zoomToNode(node)}
                        onMouseEnter={() => setSearchCursor(i)}
                        style={{
                          padding: '8px 12px', cursor: 'pointer',
                          display: 'flex', alignItems: 'center', gap: 10,
                          borderBottom: '1px solid var(--border-2)',
                          background: isCursor ? 'var(--surface-2)' : 'transparent',
                          transition: 'background 0.08s',
                        }}
                      >
                        {/* Icon / thumbnail */}
                        {isProduct ? (
                          <div style={{
                            width: 36, height: 36, borderRadius: 6, flexShrink: 0, overflow: 'hidden',
                            background: 'rgba(249,115,22,0.1)', border: '1px solid rgba(249,115,22,0.3)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                          }}>
                            {node.image
                              ? <img src={node.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { e.target.style.display='none' }} />
                              : <span style={{ fontSize: 14, color: '#f97316' }}>◆</span>
                            }
                          </div>
                        ) : (
                          <div style={{
                            width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                            background: node.color + '22', border: `1.5px solid ${node.color}88`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                          }}>
                            <div style={{ width: 8, height: 8, borderRadius: '50%', background: node.color }} />
                          </div>
                        )}

                        {/* Label + meta */}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 12, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {before}<span style={{ color: 'var(--accent-2)', fontWeight: 700 }}>{match}</span>{after}
                          </div>
                          <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2, display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                            {isProduct ? (
                              <><span style={{ color: '#f97316' }}>Sản phẩm</span><span>·</span><span>{node.inbound} bài link đến</span></>
                            ) : (
                              <><span style={{ color: node.color }}>{node.section || '—'}</span><span>·</span>
                              <span style={{ color: '#22d3ee' }}>↙{node.inbound}</span>
                              <span style={{ color: '#34d399' }}>↗{node.outbound}</span></>
                            )}
                          </div>
                        </div>

                        {/* Open URL button */}
                        {node.url && (
                          <button
                            onMouseDown={e => { e.stopPropagation(); window.open(node.url, '_blank', 'noopener') }}
                            title="Mở trang"
                            style={{ background: 'none', border: '1px solid var(--border)', borderRadius: 4, padding: '3px 5px', cursor: 'pointer', lineHeight: 0, flexShrink: 0, color: 'var(--text-subtle)', transition: 'all 0.1s' }}
                            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent-2)' }}
                            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-subtle)' }}
                          >
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
                            </svg>
                          </button>
                        )}
                      </div>
                    )
                  })}
                </div>

                {/* Footer hint */}
                <div style={{ padding: '5px 12px', fontSize: 10, color: 'var(--text-subtle)', borderTop: '1px solid var(--border-2)', display: 'flex', gap: 10 }}>
                  <span>↑↓ chọn</span><span>Enter zoom</span><span>Esc đóng</span>
                </div>
              </div>
            )}
          </div>

          {/* Section dropdown */}
          {(() => {
            const SECTION_COLORS = { 'Kiến thức':'#a78bfa','Matter':'#e879f9','Casambi':'#38bdf8','Chiếu sáng':'#fbbf24','DALI':'#34d399','KNX':'#60a5fa','HVAC':'#f87171','Smarthome':'#f472b6','An ninh':'#fb923c','Cảm biến':'#22d3ee','Driver LED':'#a3e635','Tin tức':'#94a3b8','Hướng dẫn':'#c084fc','News':'#9ca3af','Dự án':'#2dd4bf' }
            const dotColor = filterSection ? (SECTION_COLORS[filterSection] || '#94a3b8') : null
            return (
              <div style={{ position: 'relative', flexShrink: 0 }}>
                <button
                  onClick={() => setShowSectionDrop(v => !v)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    padding: '5px 10px', borderRadius: 6, fontSize: 12, cursor: 'pointer', whiteSpace: 'nowrap',
                    border: `1px solid ${filterSection ? 'rgba(255,255,255,0.25)' : 'var(--border)'}`,
                    background: filterSection ? 'rgba(255,255,255,0.07)' : 'transparent',
                    color: filterSection ? 'var(--text)' : 'var(--text-muted)',
                    transition: 'all 0.15s',
                  }}
                >
                  {dotColor && <span style={{ width: 8, height: 8, borderRadius: '50%', background: dotColor, flexShrink: 0, display: 'inline-block' }} />}
                  {filterSection || 'Sections'}
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ transform: showSectionDrop ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }}><polyline points="6 9 12 15 18 9"/></svg>
                </button>

                {showSectionDrop && (
                  <div
                    onMouseLeave={() => setShowSectionDrop(false)}
                    style={{
                      position: 'absolute', top: 'calc(100% + 4px)', left: 0, zIndex: 60,
                      background: '#161b22', border: '1px solid var(--border)',
                      borderRadius: 10, boxShadow: '0 12px 32px rgba(0,0,0,0.6)',
                      minWidth: 180, overflow: 'hidden',
                    }}
                  >
                    {[{ name: '', label: 'Tất cả sections', color: '#6b7280' }, ...sections.map(s => ({ name: s, label: s, color: SECTION_COLORS[s] || '#94a3b8' }))].map(({ name, label, color }) => {
                      const isActive = filterSection === name
                      return (
                        <button key={name}
                          onClick={() => { setFilterSection(name); setShowSectionDrop(false) }}
                          style={{
                            width: '100%', display: 'flex', alignItems: 'center', gap: 8,
                            padding: '7px 12px', fontSize: 12, border: 'none', cursor: 'pointer', textAlign: 'left',
                            background: isActive ? 'rgba(255,255,255,0.07)' : 'transparent',
                            color: isActive ? 'var(--text)' : 'var(--text-muted)',
                            transition: 'background 0.1s',
                          }}
                          onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                          onMouseLeave={e => e.currentTarget.style.background = isActive ? 'rgba(255,255,255,0.07)' : 'transparent'}
                        >
                          <span style={{ width: 8, height: 8, borderRadius: '50%', background: color, flexShrink: 0 }} />
                          {label}
                          {isActive && <span style={{ marginLeft: 'auto', color: 'var(--accent-2)', fontSize: 10 }}>✓</span>}
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })()}

          {/* Recenter */}
          <button onClick={() => fgRef.current?.zoomToFit(400)}
            title="Recenter"
            style={{ padding: '5px 10px', borderRadius: 6, border: '1px solid var(--border)', background: 'transparent', color: 'var(--text-muted)', fontSize: 12, cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0 }}
          >⊡{bp !== 'mobile' && ' Recenter'}</button>

          {/* Hide links */}
          <button
            onClick={() => setHideLinks(v => !v)}
            title={hideLinks ? 'Hiện đường nối' : 'Ẩn đường nối'}
            style={{
              padding: '5px 10px', borderRadius: 6, fontSize: 12, cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0,
              border: `1px solid ${hideLinks ? 'rgba(251,191,36,0.6)' : 'var(--border)'}`,
              background: hideLinks ? 'rgba(251,191,36,0.1)' : 'transparent',
              color: hideLinks ? '#fbbf24' : 'var(--text-muted)',
              transition: 'all 0.15s',
            }}
          >{hideLinks ? '⋯' : '—'}{bp !== 'mobile' && (hideLinks ? ' Ẩn link' : ' Links')}</button>

          {/* Dance mode */}
          <button
            onClick={() => { setDanceMode(v => { if (!v) setHideLinks(true); return !v }) }}
            title="Dance mode"
            style={{
              padding: '5px 10px', borderRadius: 6, fontSize: 12, cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0,
              border: `1px solid ${danceMode ? 'rgba(167,139,250,0.7)' : 'var(--border)'}`,
              background: danceMode ? 'rgba(139,92,246,0.15)' : 'transparent',
              color: danceMode ? '#c4b5fd' : 'var(--text-muted)',
              transition: 'all 0.15s',
              animation: danceMode ? 'dancePulse 1.2s ease-in-out infinite' : 'none',
            }}
          >
            <span style={{ display:'inline-block', animation: danceMode ? 'starFloat 2.4s ease-in-out infinite' : 'none' }}>✦</span>
            {bp !== 'mobile' && (danceMode ? ' Dancing…' : ' Dance')}
          </button>
          <style>{`
            @keyframes dancePulse {
              0%,100% { box-shadow: 0 0 0 0 rgba(139,92,246,0); }
              50%      { box-shadow: 0 0 14px 3px rgba(139,92,246,0.45); }
            }
            @keyframes starFloat {
              0%,100% { transform: translateY(0)   rotate(0deg)   scale(1);    }
              25%     { transform: translateY(-3px) rotate(18deg)  scale(1.15); }
              75%     { transform: translateY(2px)  rotate(-12deg) scale(0.92); }
            }
          `}</style>

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
          {/* Min links */}
          <span style={{ fontSize: 10, color: 'var(--text-subtle)', flexShrink: 0 }}>Min:</span>
          <div style={{ display: 'flex', gap: 3, alignItems: 'center' }}>
            <ToolbarBtn active={minLinks === '0'} onClick={() => setMinLinks('0')}>Tất cả</ToolbarBtn>
            <input
              type="number"
              min="1"
              value={minLinks === '0' ? '' : minLinks}
              onChange={e => {
                const v = e.target.value
                if (v === '' || v === '0') { setMinLinks('0'); return }
                const n = parseInt(v)
                if (!isNaN(n) && n > 0) setMinLinks(String(n))
              }}
              placeholder="≥ N"
              style={{
                width: 54, padding: '3px 7px', fontSize: 11, borderRadius: 6,
                border: `1px solid ${minLinks !== '0' ? 'var(--accent)' : 'var(--border)'}`,
                background: minLinks !== '0' ? 'rgba(6,182,212,0.06)' : 'var(--surface-2)',
                color: minLinks !== '0' ? 'var(--accent-2)' : 'var(--text-muted)',
                outline: 'none', fontFamily: 'inherit',
              }}
            />
          </div>

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

          {/* Date range filter — calendar picker */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
            <span style={{ fontSize: 10, color: 'var(--text-subtle)', whiteSpace: 'nowrap' }}>Sửa:</span>
            {[['from', dateFrom, setDateFrom], ['to', dateTo, setDateTo]].map(([which, val, setVal]) => (
              <input
                key={which}
                type="date"
                value={val}
                onChange={e => setVal(e.target.value)}
                style={{
                  padding: '3px 6px', fontSize: 11, borderRadius: 6,
                  border: `1px solid ${val ? 'var(--accent)' : 'var(--border)'}`,
                  background: val ? 'rgba(6,182,212,0.06)' : 'var(--surface-2)',
                  color: val ? 'var(--accent-2)' : 'var(--text-muted)',
                  outline: 'none', colorScheme: 'dark', cursor: 'pointer',
                }}
              />
            ))}
            {(dateFrom || dateTo) && (
              <button onClick={() => { setDateFrom(''); setDateTo('') }}
                style={{ fontSize: 12, padding: '2px 6px', borderRadius: 4, border: '1px solid var(--border)', background: 'transparent', color: 'var(--text-muted)', cursor: 'pointer' }}
              >×</button>
            )}
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
            onRenderFramePost={drawGalaxyLabels}
            nodeCanvasObject={paintNode}
            nodePointerAreaPaint={paintNodePointerArea}
            onNodeHover={onNodeHover}
            onNodeClick={onNodeClick}
            onBackgroundClick={() => { pinnedRef.current = null; setPinnedNode(null) }}
            onNodeRightClick={node => {
              if (node.nodeType === 'productNode') { if (node.url) window.open(node.url, '_blank', 'noopener') }
              else { if (onSelectPost) onSelectPost(node.id) }
            }}
            linkColor={getLinkColor}
            linkWidth={getLinkWidth}
            linkDirectionalParticles={link => {
              const h = pinnedRef.current || hoveredRef.current
              if (!h) return 0
              const s = typeof link.source === 'object' ? link.source.id : link.source
              const t = typeof link.target === 'object' ? link.target.id : link.target
              return (s === h.id || t === h.id) ? 2 : 0
            }}
            linkDirectionalParticleWidth={2}
            linkDirectionalParticleColor={link => {
              const s = typeof link.source === 'object' ? link.source.id : link.source
              const t = typeof link.target === 'object' ? link.target.id : link.target
              const h = pinnedRef.current || hoveredRef.current
              if (h && s === h.id) return 'rgba(34,211,238,0.9)'
              if (h && t === h.id) return 'rgba(52,211,153,0.9)'
              return 'rgba(255,255,255,0.4)'
            }}
            linkDirectionalParticleSpeed={0.006}
            warmupTicks={100}
            cooldownTicks={120}
            d3AlphaDecay={0.025}
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
