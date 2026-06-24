const Section = ({ title, children }) => (
  <div style={{ marginBottom: 32 }}>
    <div style={{
      fontSize: 13, fontWeight: 700, color: 'var(--accent-2)',
      letterSpacing: '0.06em', textTransform: 'uppercase',
      marginBottom: 12, paddingBottom: 6,
      borderBottom: '1px solid var(--border)',
    }}>{title}</div>
    {children}
  </div>
)

const Row = ({ label, color, children }) => (
  <div style={{ display: 'flex', gap: 12, marginBottom: 10, alignItems: 'flex-start' }}>
    <div style={{
      minWidth: 130, fontSize: 12, fontWeight: 600,
      color: color || 'var(--text)',
      paddingTop: 1,
    }}>{label}</div>
    <div style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.6, flex: 1 }}>
      {children}
    </div>
  </div>
)

const Chip = ({ color, label }) => (
  <span style={{
    display: 'inline-block', padding: '1px 8px', borderRadius: 10, fontSize: 11,
    background: (color || '#94a3b8') + '22',
    border: `1px solid ${color || '#94a3b8'}55`,
    color: color || '#94a3b8', marginRight: 5, marginBottom: 4,
  }}>{label}</span>
)

export default function HelpView() {
  return (
    <div style={{
      flex: 1, overflowY: 'auto',
      background: 'var(--bg)',
      padding: '32px 0',
    }}>
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '0 24px' }}>

        {/* Header */}
        <div style={{ marginBottom: 36 }}>
          <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--text)', marginBottom: 6 }}>
            📖 Hướng dẫn sử dụng
          </div>
          <div style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.7 }}>
            Blog Manager — công cụ phân tích nội dung nội bộ cho knxstore.vn.
            Dưới đây là giải thích các tính năng và nhãn hiển thị trong từng tab.
          </div>
        </div>

        {/* Link Graph */}
        <Section title="🕸 Link Graph">
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 14, lineHeight: 1.7 }}>
            Đồ thị hiển thị toàn bộ bài viết dưới dạng node và các liên kết nội bộ dưới dạng cạnh.
            Kích thước node tỉ lệ thuận với số <b style={{ color: 'var(--text)' }}>inbound link</b>.
          </div>

          <Row label="Node (chấm tròn)">
            Mỗi node là 1 bài viết. Node càng to = càng nhiều bài khác trỏ đến. Màu theo Section.
          </Row>
          <Row label="Cạnh (đường nối)">
            Đường nối từ A → B nghĩa là bài A có link nội bộ dẫn đến bài B.
            <br />
            <span style={{ color: '#22d3ee' }}>━ Xanh cyan</span> = outbound từ node đang chọn &nbsp;·&nbsp;
            <span style={{ color: '#34d399' }}>━ Xanh lá</span> = inbound vào node đang chọn
          </Row>
          <Row label="Hover node">Hiện bảng thông tin: tiêu đề, section, inbound/outbound, tác giả, ngày sửa.</Row>
          <Row label="Click node">Ghim (pin) node — bảng thông tin giữ nguyên kể cả khi di chuột đi chỗ khác. Click lại node đang ghim để bỏ ghim.</Row>
          <Row label="Double-click node">Mở chi tiết bài viết trong panel bên phải. Với node sản phẩm (◆ cam): mở URL sản phẩm trong tab mới.</Row>
          <Row label="Click nền">Bỏ ghim, ẩn bảng thông tin.</Row>
          <Row label="Scroll / pinch">Zoom in/out trên graph.</Row>
          <Row label="Kéo nền">Pan — di chuyển toàn bộ graph.</Row>
          <Row label="Kéo node">Di chuyển 1 node đến vị trí mong muốn.</Row>

          <div style={{ marginTop: 16, marginBottom: 8, fontSize: 12, fontWeight: 600, color: 'var(--text)' }}>Bộ lọc & công cụ</div>
          <Row label="Tìm kiếm">Tìm theo tên bài hoặc sản phẩm. Kết quả match highlight + ripple, còn lại mờ đi. Dùng ↑↓ chọn, Enter để zoom đến node, Esc đóng.</Row>
          <Row label="Loại tìm kiếm">Tab <b style={{color:'var(--text)'}}>Tất cả / Bài viết / ◆ Sản phẩm</b> trong ô search — lọc kết quả search chỉ theo loại node.</Row>
          <Row label="Section">Lọc chỉ hiện node thuộc 1 section. Kết hợp được với các bộ lọc khác.</Row>
          <Row label="Min links">Chỉ hiện node có ít nhất X inbound link. Dùng để lọc ra hub page.</Row>
          <Row label="Sửa (date)">
            Lọc node theo ngày <b style={{ color: 'var(--text)' }}>date_modified</b>. Node ngoài khoảng bị mờ (ghost xám),
            node trong khoảng nổi bật hơn với ripple và kích thước lớn hơn. Đặt ngược from/to vẫn hoạt động đúng.
          </Row>
          <Row label="Recenter">Zoom fit toàn bộ graph vào khung hình. Dùng khi bị lạc sau khi zoom/pan.</Row>
          <Row label="Orphans">Lọc chỉ hiện bài viết chưa có inbound link nào (cần bổ sung internal link).</Row>
          <Row label="— Links (slider)">Điều chỉnh độ trong suốt của đường nối. Kéo về 0 = ẩn hoàn toàn. Giá trị được lưu lại sau khi reload.</Row>
          <Row label="Products">Bật/tắt hiển thị node sản phẩm (hình thoi ◆ cam). Khi bật, có thêm filter: Tất cả / Có SP / Không SP để lọc bài viết.</Row>
          <Row label="Label node">Node lớn (hub page) luôn hiện tên. Node nhỏ chỉ hiện tên khi zoom vào đủ gần hoặc hover.</Row>
          <Row label="Dance mode">Bật vật lý — các node liên tục chuyển động. Link tự ẩn khi bật.</Row>
          <Row label="✕ Clear">Xóa toàn bộ bộ lọc đang active (search, date, section, min links) về mặc định.</Row>

          <div style={{ marginTop: 16, marginBottom: 8, fontSize: 12, fontWeight: 600, color: 'var(--text)' }}>Tree View (tab con)</div>
          <Row label="Tree View">Hiển thị bài viết dạng danh sách, nhóm theo Section. Có date filter, sort, orphan filter, thumbnail.</Row>
        </Section>

        {/* Labels */}
        <Section title="🏷 Nhãn & chỉ số">
          <Row label="Inbound links" color="#34d399">
            Số bài viết khác có link nội bộ dẫn đến bài này. Chỉ số quan trọng nhất — bài có nhiều inbound = hub page, được Google đánh giá cao hơn.
          </Row>
          <Row label="Outbound links" color="#22d3ee">
            Số bài viết mà bài này đang trỏ đến thông qua link nội bộ.
          </Row>
          <Row label="Orphan" color="#f87171">
            Bài không có bài nào khác link đến (inbound = 0). Cần bổ sung link nội bộ để Google có thể crawl và đánh giá bài.
          </Row>
          <Row label="Word count">Số từ của bài viết. Bài dưới 300 từ thường bị coi là thin content.</Row>
          <Row label="Date modified">Ngày bài viết được cập nhật lần cuối trên Shopify.</Row>
          <Row label="Author">Tác giả bài viết (field author trong schema.org của bài).</Row>
          <Row label="🛒 X sp">Số sản phẩm được bài viết đó link đến (product node trên graph).</Row>
        </Section>

        {/* Sections / màu */}
        <Section title="🎨 Màu Section">
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 12 }}>
            Mỗi section (chủ đề bài viết) được gán 1 màu cố định trên toàn bộ công cụ.
          </div>
          <div>
            {[
              ['#a78bfa', 'Kiến thức'], ['#e879f9', 'Matter'],   ['#38bdf8', 'Casambi'],
              ['#fbbf24', 'Chiếu sáng'], ['#34d399', 'DALI'],    ['#60a5fa', 'KNX'],
              ['#f87171', 'HVAC'],       ['#f472b6', 'Smarthome'],['#fb923c', 'An ninh'],
              ['#22d3ee', 'Cảm biến'],   ['#a3e635', 'Driver LED'],['#94a3b8', 'Tin tức'],
              ['#c084fc', 'Hướng dẫn'], ['#9ca3af', 'News'],     ['#2dd4bf', 'Dự án'],
            ].map(([color, label]) => <Chip key={label} color={color} label={label} />)}
          </div>
        </Section>

        {/* Tabs khác */}
        <Section title="📋 Các tab khác">
          <Row label="Dashboard">Tổng quan nhanh: tổng bài, tổng link, orphan, avg inbound, top hub pages.</Row>
          <Row label="Bài viết">Danh sách toàn bộ bài dạng bảng, sort/filter theo section, date, search. Khi search thì bỏ phân trang, hiện tất cả kết quả.</Row>
          <Row label="SEO Audit">Kiểm tra các vấn đề SEO: thiếu meta description, title quá dài/ngắn, thin content, duplicate, v.v.</Row>
          <Row label="AI Analysis">Phân tích cluster nội dung bằng AI — chọn section rồi nhấn 🤖 trên Link Graph.</Row>
          <Row label="AI Chat">Chat trực tiếp với AI về nội dung blog, SEO, gợi ý cải thiện.</Row>
          <Row label="Content Intel">Phân tích chuyên sâu nội dung: keyword gaps, cơ hội internal linking, v.v.</Row>
          <Row label="Settings">Cấu hình URL crawl, re-crawl toàn bộ hoặc từng bài.</Row>
        </Section>

        {/* Tips */}
        <Section title="💡 Tips nhanh">
          {[
            ['Tìm hub page', 'Link Graph → tăng Min links lên 3–5 → chỉ còn các bài được link nhiều nhất.'],
            ['Tìm orphan page', 'Tree View → bật Orphans → danh sách bài cần thêm link nội bộ.'],
            ['Audit content cũ', 'Link Graph → đặt date "đến" = 6 tháng trước → node sáng lên = bài lâu chưa cập nhật.'],
            ['Xem bài liên quan', 'Click 1 node trên graph → các đường nối highlight = toàn bộ bài có liên kết trực tiếp.'],
            ['Tìm bài thiếu sản phẩm', 'Link Graph → bật Products → bài không có cạnh cam = chưa link sản phẩm nào.'],
          ].map(([tip, desc]) => (
            <div key={tip} style={{ display: 'flex', gap: 10, marginBottom: 10, alignItems: 'flex-start' }}>
              <div style={{
                fontSize: 11, color: 'var(--accent-2)', background: 'rgba(6,182,212,0.1)',
                border: '1px solid rgba(6,182,212,0.25)', borderRadius: 6,
                padding: '2px 8px', whiteSpace: 'nowrap', marginTop: 1,
              }}>{tip}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.6 }}>{desc}</div>
            </div>
          ))}
        </Section>

      </div>
    </div>
  )
}
