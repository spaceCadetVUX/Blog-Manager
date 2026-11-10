# Internal link bài viết, sản phẩm và hai tính năng cập nhật

Tài liệu mô tả: (1) cách tool phân tích **internal link giữa các bài viết**, (2) cách quản lý **sản phẩm và liên kết giữa các sản phẩm**, (3) **hai tính năng cập nhật** (crawl bài viết, crawl sản phẩm), mỗi tính năng có hai kiểu chạy.

Số liệu trong tài liệu là ảnh chụp ngày 10/11/2026 (236 bài, 825 dòng `products`), dùng để đối chiếu khi kiểm tra, không phải hằng số.

---

## 0. Bắt buộc: điền API của KNXStore

Mọi luồng lấy dữ liệu bài viết và sản phẩm đều đi qua **MCP server của KNXStore**. Nếu chưa điền, crawl bài, đồng bộ sản phẩm, đồng bộ bundle và trang xem toàn văn bài (`/posts/{slug}/html`) đều **không chạy** (lỗi 401 hoặc 502).

Tạo file `.env` ở thư mục gốc project (file này **không được commit**; đã có trong `.gitignore`) theo mẫu `.env.example`:

```env
APP_PASSWORD=<mật khẩu đăng nhập giao diện, tự đặt>
KNX_MCP_URL=https://api.knxstore.vn/api/mcp
KNX_MCP_TOKEN=<token Bearer của KNXStore, dạng knx_...>
# Tuỳ chọn, cho tính năng AI:
ANTHROPIC_API_KEY=
```

| Biến | Bắt buộc | Dùng để |
|---|---|---|
| `KNX_MCP_URL` | **Có** | Endpoint MCP của KNXStore |
| `KNX_MCP_TOKEN` | **Có** | Xác thực `Authorization: Bearer ...` khi gọi MCP |
| `APP_PASSWORD` | Có | Mật khẩu đăng nhập giao diện và API của tool |
| `ANTHROPIC_API_KEY` | Không | Chỉ cho các màn hình AI |

Lưu ý:
- Token chỉ được nằm trong `.env`. Không ghi vào code, log, ảnh chụp hay tin nhắn. Nếu lộ, nhờ người quản lý API cấp lại token.
- Code che token thành `***` trong thông báo lỗi của job, nhưng đừng dựa vào điều đó để chia sẻ log.
- Sau khi sửa `.env`, khởi động lại backend (`uvicorn`) để đọc giá trị mới.
- Chạy thử: `curl -s -X POST "$KNX_MCP_URL" -H "Authorization: Bearer $KNX_MCP_TOKEN" -H "Content-Type: application/json" -H "Accept: application/json, text/event-stream" -d '{"jsonrpc":"2.0","id":1,"method":"tools/list","params":{}}'` phải trả danh sách tool (có `search_posts`, `get_post`, `search_products`, `get_product`).

Nguồn dự phòng: có thể crawl bài bằng **Sitemap** (không cần token) nhưng thiếu các bài chưa vào sitemap và không dùng được các tính năng sản phẩm.

---

## 1. Internal link giữa các bài viết

### 1.1. Hai loại link

Mỗi dòng trong bảng `internal_links` có cột `kind`:

| `kind` | Ý nghĩa | Nguồn dữ liệu |
|---|---|---|
| `body` | Link nằm **trong thân bài**, do người viết đặt | `contentHtml` của MCP `get_post` |
| `related` | Link trong khối **"Bài viết liên quan"** cuối trang, do template tự sinh (tối đa 4 bài/trang, chọn theo chung danh mục) | HTML trang live (MCP không có dữ liệu này) |

Hai loại trả lời hai câu hỏi khác nhau:
- `body`: người viết đã chủ động nối bài nào với bài nào (độ phủ link biên tập).
- `related`: Googlebot đi tới bài này bằng những đường nào (khả năng khám phá).

Ràng buộc duy nhất: `UNIQUE(from_slug, to_slug, kind)`. Một cặp có thể vừa là `body` vừa là `related`. Cột `position` là thứ tự trong khối liên quan.

### 1.2. Quy tắc trích link

- Chỉ quét vùng thân bài (`#article-body` / nội dung `contentHtml`). **Không** quét `<body>`, `<main>`, `<article>` vì chứa menu header, footer và card sản phẩm dùng chung, gây nhiễm link.
- Chỉ nhận URL bài dạng `https://knxstore.vn/<slug>.html` (một segment). Loại `/author/*`, `/blogs/*`, `/solution/*`, `/products/*`.
- Loại link tự trỏ về chính bài, loại trùng.
- Khối `related`: tìm tiêu đề "Bài viết liên quan", lấy các link bài trong khối đó (ngoài thân bài). Nếu không thấy khối (bài không có danh mục) thì trả rỗng và ghi nhận `no_related` trong job.
- Chỉ lưu **nội dung text** của bài, không lưu HTML.

### 1.3. Chỉ số trên giao diện và API

| Chỉ số | Định nghĩa | Ảnh chụp 10/11/2026 |
|---|---|---|
| Link `body` | Tổng link thân bài | 476 |
| Link `related` | Tổng link khối liên quan | 916 (226 bài có 4 link, 4 bài có 3, 6 bài có 0) |
| Orphan theo `body` | Bài chưa ai link trong thân bài | 85 |
| **Orphan thật** | Không có link `body` lẫn `related` | **67** |
| Chỉ vào qua `related` | Orphan theo `body` nhưng có link liên quan | 18 |

- Các trường cũ của API (`inbound`, `outbound`, `orphan_posts`...) vẫn tính theo `body`. Trường mới: `inbound_related`, `outbound_related`, `orphan_true`, `links_body`, `links_related`, `orphans_any`.
- `GET /graph?kind=body|related|all` (mặc định `body`). Cạnh có `data.kind`.
- `GET /audit/link-check`: gửi HTTP thật tới từng link đích, trả các đích không phải 200 (3xx chuyển hướng, 4xx/5xx chết). Chậm hơn `/audit`, gọi chủ động.
- Giao diện: **Link Graph** (bộ chọn Thân bài | Liên quan | Cả hai; link liên quan màu vàng nét đứt), **Tree View** (nhãn body và liên quan riêng; bài chỉ vào qua `related` hiện màu vàng, orphan thật màu đỏ), **SEO Audit** (issue "Orphan thật"), trang chi tiết bài (tách hai nhóm link).

### 1.4. Giới hạn cần biết

- Khối `related` do site tự chọn và gần như cố định theo danh mục (chỉ khoảng 42 tập khác nhau cho 230 bài). Không điều khiển được bằng cách viết bài; muốn đổi phải đổi danh mục hoặc cách site chọn.
- Nếu site đổi template, khối `related` có thể trả rỗng. Job báo `no_related`; tool không tự sửa.
- `/audit/link-check` chỉ kiểm link giữa các bài. Link từ bài sang `/solution/*` hoặc `/products/*` không được lưu trong `internal_links`.

---

## 2. Sản phẩm

### 2.1. Bảng `products` và hai hệ ID

Có **hai hệ ID sản phẩm khác nhau và va chạm nhau**. Đây là điểm dễ nhầm nhất.

| Cột | Là gì | Dùng ở đâu |
|---|---|---|
| `id` (PK) | **ID cũ (legacy)** | Shortcode `{products:[N]}` trong bài viết dùng hệ này. **Không bao giờ bị đổi** |
| `site_id` | **ID mới của site** (MCP trả `id` này) | Đối chiếu với MCP |
| `slug`, `sku`, `stock_status`, `status` | Lấy từ MCP | `status`: `PUBLISHED` hoặc `not_on_site` |

Ví dụ: DMXcas có `id` 683 (cũ) và `site_id` 79 (mới), trong khi `id` 79 ở hệ cũ lại là sản phẩm khác. Vì vậy mọi phép khớp từ MCP (kể cả `bundles[].id`) phải theo **slug hoặc `site_id`**, tuyệt đối không dùng làm `products.id`.

- Sản phẩm mới không có ID cũ nhận `id = 1_000_000 + site_id`. Trong shortcode chúng chỉ tham chiếu được bằng slug.
- Sản phẩm không còn trên site chỉ bị đánh dấu `not_on_site`, **không bị xóa**.
- Ảnh chụp: 825 dòng (819 đang bán, 6 `not_on_site`).

### 2.2. Sản phẩm trong bài viết

`contentHtml` không chứa link `/products/...` mà chứa shortcode `<p>{products:[id hoặc slug, ...]}</p>`. Tool giải shortcode qua bảng `products` (id số tra theo ID cũ, token chữ tra theo slug), rồi lưu danh sách vào `posts.products` (JSON: url, name).

- 161/236 bài có sản phẩm; 1300 link bài → sản phẩm; 477/819 sản phẩm đang bán được ít nhất một bài nhắc.
- 6 bài còn shortcode trỏ tới sản phẩm đã bị xóa khỏi site (id 429, 857, 1044, 1045, 1284, 1290). Trang live cũng không hiển thị gì cho các id này; cần sửa nội dung bài trên CMS.

### 2.3. Liên kết sản phẩm ↔ sản phẩm

Bảng `product_links(from_id, to_id, kind, weight)`, khóa theo `products.id`:

| `kind` | Nguồn | Hướng | Ảnh chụp |
|---|---|---|---|
| `bundle` | MCP `get_product(slug).bundles` (combo/mua kèm do người nhập) | Có hướng | 119 cặp / 73 sản phẩm (khoảng 9% sản phẩm có bundle) |
| `co_mentioned` | Hai sản phẩm cùng được nhắc trong một bài; `weight` = số bài chung | Không hướng (`from_id < to_id`) | 7916 cặp; 426 cặp có weight ≥ 3; max 15 |

- 331/819 sản phẩm đang bán không có liên kết nào (không bundle, không bài nào nhắc chung với sản phẩm khác). Muốn lấp chỗ này cần nguồn khác (ví dụ khối "Sản phẩm liên quan" trên trang sản phẩm, chưa làm).
- Cập nhật `bundle`: **Đồng bộ liên kết** → "Đồng bộ bundle" (job nền, khoảng 5–7 phút vì gọi MCP tuần tự cho từng sản phẩm). Ghi theo diff; sản phẩm bị lỗi giữ bundle cũ; lỗi giữa chừng thì không ghi dở.
- Cập nhật `co_mentioned`: nút "Tính lại hay đi cùng" (nhanh, không gọi MCP). Cũng tự chạy lại sau mỗi lần đồng bộ sản phẩm.
- Giao diện:
  - Trang **Sản phẩm**: khối "Liên kết" của từng sản phẩm (Bundle, Nằm trong bundle của, Hay đi cùng kèm weight, Bài nhắc tới), cột đếm, bộ lọc "chưa có bài nhắc".
  - **Link Graph**: bật "Sản phẩm" rồi chọn "Liên kết SP" (Không | Bundle | Cùng bài | Cả hai; mặc định Cả hai; ô "Cùng bài ≥ N" mặc định 3). Nút **"Ẩn bài viết"** chỉ giữ mạng sản phẩm ↔ sản phẩm (vẽ đủ cả bundle trỏ tới sản phẩm chưa bài nào nhắc); nút **"Cả SP chưa liên kết"** thêm các sản phẩm không có liên kết (tổng 819 nút).
- API: `GET /products/{id}/links?min_weight=&limit=` trả `{bundle, bundled_in, co_mentioned, mentioned_in}`. `GET /graph` nhận thêm `show_products`, `product_links` (`none|bundle|co_mentioned|both`), `min_co_weight`, `hide_posts`, `include_isolated`.

---

## 3. Hai tính năng cập nhật

Crawl **bài viết** và crawl **sản phẩm** là hai việc riêng. Mở bằng nút **Crawl** ở thanh bên (modal có hai tab **Bài viết** | **Sản phẩm**); ở trang Sản phẩm, nút "Đồng bộ MCP" mở thẳng tab Sản phẩm. Mỗi tab có hai kiểu chạy:

| | **Chỉ cập nhật mới** | **Ghi đè toàn bộ** |
|---|---|---|
| **Bài viết** (`mode`) | `incremental`: thêm bài mới và cập nhật bài có `editedAt` thay đổi; bài không đổi bị bỏ qua. Bài ghi lại sẽ được tải thêm khối liên quan và tính lại `co_mentioned`. Khoảng 1–2 phút | `full`: ghi đè mọi bài (md và DB, cả thân bài lẫn khối liên quan). Khoảng 6–7 phút |
| **Sản phẩm** (`mode`) | `new`: dùng danh sách `search_products`; thêm sản phẩm mới, cập nhật dòng có thay đổi, đánh dấu `not_on_site`. Khoảng 20 giây | `full`: như trên và làm mới đầy đủ mọi sản phẩm qua `get_product_for_edit` (danh mục, ID cũ, trạng thái...). Khoảng 7 phút |

Chọn "Ghi đè toàn bộ" sẽ có cảnh báo và phải bấm xác nhận. Không kiểu nào xóa bài, xóa sản phẩm hay đổi `products.id`.

Ngoài ra bài viết có thêm kiểu phụ `related`: chỉ làm mới khối "Bài viết liên quan" cho mọi bài (tải HTML live, không gọi `get_post`), khoảng 5 phút.

### 3.1. Gọi bằng API

Mọi request cần `Authorization: Bearer <APP_PASSWORD>`.

```bash
# Crawl bài viết (source: mcp | sitemap; mode: incremental | full | related)
curl -X POST http://127.0.0.1:8000/crawl \
  -H "Authorization: Bearer $APP_PASSWORD" -H "Content-Type: application/json" \
  -d '{"source":"mcp","mode":"incremental"}'          # trả {"job_id":"..."}
curl -H "Authorization: Bearer $APP_PASSWORD" http://127.0.0.1:8000/crawl/<job_id>

# Crawl sản phẩm (mode: new | full)
curl -X POST http://127.0.0.1:8000/products/sync/jobs \
  -H "Authorization: Bearer $APP_PASSWORD" -H "Content-Type: application/json" \
  -d '{"mode":"new"}'
curl -H "Authorization: Bearer $APP_PASSWORD" http://127.0.0.1:8000/products/sync/jobs/<job_id>

# Một bài lẻ (sau khi sửa bài trên CMS)
curl -X POST -H "Authorization: Bearer $APP_PASSWORD" http://127.0.0.1:8000/posts/<slug>/recrawl

# Liên kết sản phẩm: nạp bundle (job nền) và tính lại hay-đi-cùng
curl -X POST -H "Authorization: Bearer $APP_PASSWORD" http://127.0.0.1:8000/products/links/sync
curl -X POST -H "Authorization: Bearer $APP_PASSWORD" http://127.0.0.1:8000/products/links/rebuild
```

`POST /products/sync` (đồng bộ, `deep` true/false) vẫn còn để tương thích, nhưng nên dùng job nền vì kiểu đầy đủ chạy khoảng 7 phút trong một request HTTP rất dễ timeout.

### 3.2. Quy tắc job

- **Một job nặng một lúc.** Crawl bài, đồng bộ sản phẩm và đồng bộ bundle chặn lẫn nhau: bấm khi đang có job khác chạy sẽ nhận **409**. Đợi xong rồi chạy lại.
- Job chạy nền; đóng modal không dừng job, mở lại sẽ nối tiếp tiến độ hoặc hiện kết quả.
- MCP giới hạn tốc độ (429) khi gọi song song, nên mọi job gọi **tuần tự** và tự chờ thử lại. Tránh chạy hai job cùng lúc.
- **Lỗi giữa chừng (token sai, MCP lỗi) thì job báo `error` và không ghi dở** vào DB. Chạy lại là xong.
- Khởi động lại backend (`uvicorn --reload` tự reload khi sửa code) sẽ làm mất job đang chạy; đừng sửa code backend khi có job chạy.
- Trường kết quả bài viết có `skipped`, `crawled`, `failed`, `ignored` (URL không phải bài), `no_body` (không tìm thấy thân bài), `missing_in_mcp` (bài có trong DB nhưng MCP không còn trả về; chỉ báo cáo, **không tự xóa**).

### 3.3. Khi nào chạy cái nào

| Tình huống | Chạy |
|---|---|
| Vừa đăng/sửa vài bài | Bài viết → **Chỉ cập nhật mới** (hoặc `POST /posts/<slug>/recrawl` cho một bài) |
| Thêm sản phẩm mới hoặc đổi giá trên site | Sản phẩm → **Chỉ cập nhật mới**, **rồi** mới crawl bài (để shortcode sản phẩm mới giải được) |
| Nghi dữ liệu lệch, hoặc site đổi template | Bài viết → **Ghi đè toàn bộ** |
| Muốn làm mới danh mục và ID cũ của mọi sản phẩm | Sản phẩm → **Ghi đè toàn bộ** |
| Chỉ muốn cập nhật khối "Bài viết liên quan" | Bài viết → kiểu phụ `related` |
| Vừa có bài mới hoặc sản phẩm mới và muốn cập nhật bundle | Đồng bộ liên kết → "Đồng bộ bundle" |

Đã kiểm chứng trên dữ liệu thật (10/11/2026): chạy cả bốn kiểu (sản phẩm `new`/`full`, bài `incremental`/`full`) không làm đổi `products` (825, `id` giữ nguyên), `posts` (236), `internal_links` (476 body / 916 related), `product_links` (119 bundle / 7916 co_mentioned) so với bản trước khi chạy.

---

## 4. Xử lý sự cố

| Triệu chứng | Nguyên nhân thường gặp | Cách xử lý |
|---|---|---|
| 401 / "Không lấy được bài từ MCP (...)" / job `error` ngay khi bắt đầu | Thiếu hoặc sai `KNX_MCP_TOKEN` / `KNX_MCP_URL` | Điền lại `.env` (mục 0), khởi động lại backend |
| 409 khi bấm crawl | Đang có job khác chạy | Đợi job xong |
| 429 trong log | MCP giới hạn tốc độ | Job tự chờ; không chạy song song |
| Khối "Bài viết liên quan" trống hàng loạt, `no_related` tăng | Site đổi template | Cập nhật hàm `extract_related_links` trong `crawl_posts.py` |
| Bài mới thiếu sản phẩm / báo `unresolved` | Sản phẩm mới chưa có trong bảng `products` | Chạy crawl sản phẩm trước rồi crawl lại bài |
| Link báo "chuyển hướng" (308) | Bài trỏ tới URL cũ đã đổi | Sửa link trên CMS (ví dụ `/dieu-khien-chieu-sang-dali.html` → `/solution/dali`) |
| `internal_links` lỗi `ON CONFLICT(from_slug,to_slug)` ở code ngoài project | Ràng buộc đã đổi thành `(from_slug, to_slug, kind)` | Sửa câu lệnh upsert theo ràng buộc mới |

---

## 5. Bản đồ mã nguồn

| File | Vai trò |
|---|---|
| `backend/mcp_client.py` | Client MCP (JSON-RPC qua HTTP; retry, chờ khi 429; che token trong lỗi) |
| `crawl_posts.py` | Trích link/sản phẩm/thân bài, dựng md; hàm khối liên quan |
| `backend/routes/crawl.py` | `POST /crawl`, job crawl bài, khóa 409 |
| `backend/import_posts.py` | Đọc `posts_md/*.md` → SQLite (thay `body` và `related` theo từng loại) |
| `backend/product_sync.py` | Đồng bộ `products` từ MCP (`new` / `full`) |
| `backend/product_links.py` | `bundle` và `co_mentioned` |
| `backend/routes/products.py` | API sản phẩm, job đồng bộ sản phẩm và bundle |
| `backend/routes/graph.py` | `/graph` (loại link bài, liên kết SP, ẩn bài viết) |
| `backend/routes/audit.py` | `/audit`, `/audit/link-check` |
| `frontend/src/components/CrawlModal.jsx` | Modal crawl hai tab, hai kiểu mỗi tab |
| `frontend/src/components/GraphView.jsx`, `TreeView.jsx`, `ProductsView.jsx`, `PostDetail.jsx`, `AuditView.jsx` | Giao diện liên quan |
| `posts_md/` | md trung gian (frontmatter + text thuần), đọc bởi `import_posts.py` |
| `blog.db` | SQLite: `posts`, `internal_links`, `products`, `product_links`, `settings` |

Chi tiết kế hoạch triển khai tính năng liên kết sản phẩm: `PLAN_product_links.md`.
