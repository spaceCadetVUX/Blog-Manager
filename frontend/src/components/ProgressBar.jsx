// Thanh tiến độ dùng chung cho các job nền (crawl bài viết, đồng bộ sản phẩm).
// pct: 0-100. indeterminate: chưa biết tổng (vd. đang tải danh sách) → thanh mờ đầy.
export default function ProgressBar({ pct = 0, color = 'var(--accent)', indeterminate = false, height = 4 }) {
  const w = indeterminate ? 100 : Math.max(0, Math.min(100, pct))
  return (
    <div style={{ height, background: 'var(--border)', borderRadius: height / 2, overflow: 'hidden' }}>
      <div style={{
        height: '100%', borderRadius: height / 2, background: color,
        width: w + '%', opacity: indeterminate ? 0.35 : 1, transition: 'width 0.4s ease',
      }} />
    </div>
  )
}
