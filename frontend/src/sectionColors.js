const COLORS = {
  'Kiến thức':  '#a78bfa',
  'Matter':     '#e879f9',
  'Casambi':    '#38bdf8',
  'Chiếu sáng': '#fbbf24',
  'DALI':       '#34d399',
  'KNX':        '#60a5fa',
  'HVAC':       '#f87171',
  'Smarthome':  '#f472b6',
  'An ninh':    '#fb923c',
  'Cảm biến':   '#22d3ee',
  'Driver LED': '#a3e635',
  'Tin tức':    '#94a3b8',
  'Hướng dẫn':  '#c084fc',
  'News':       '#9ca3af',
  'Dự án':      '#2dd4bf',
}

// Danh mục mới chưa có trong list → tự sinh màu từ tên
function hashColor(str) {
  let h = 0
  for (let i = 0; i < str.length; i++) {
    h = str.charCodeAt(i) + ((h << 5) - h)
  }
  const hue = Math.abs(h) % 360
  return `hsl(${hue}, 70%, 65%)`
}

export function sectionColor(section) {
  return COLORS[section] || hashColor(section || 'default')
}

export default COLORS
