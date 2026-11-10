# PLAN — Liên kết sản phẩm ↔ sản phẩm (handoff cho session khác)

> Tài liệu tự đủ để một session Claude Code mới thực hiện. Đọc hết trước khi làm. Trả lời người dùng bằng tiếng Việt, giữ nguyên thuật ngữ kỹ thuật tiếng Anh.

## 0. Mục tiêu và phạm vi đã duyệt

Lưu và hiển thị quan hệ **sản phẩm ↔ sản phẩm** trong Blog-Manager. Chủ dự án đã duyệt phạm vi **A + B**:

| Kind | Nguồn | Ý nghĩa |
|---|---|---|
| `bundle` (A) | MCP `get_product(slug).bundles` | Combo/mua kèm do người nhập trên CMS, có hướng |
| `co_mentioned` (B) | Tính từ `posts.products` | Hai sản phẩm cùng được nhắc trong một bài; `weight` = số bài chung; không hướng |

**Ngoài phạm vi (để sau, KHÔNG làm):** khối "Sản phẩm liên quan" và "Phụ kiện cho hệ thống" trên trang sản phẩm live (nguồn C); chưa biết có phải khối tự sinh dùng chung hay không.

Chỉ lưu **nội dung text**, KHÔNG lưu HTML (quyết định của chủ dự án).

## 1. Môi trường

- Repo: `/Users/ngochuyen/Desktop/blog-manager/Blog-Manager` (FastAPI `backend/`, React+Vite `frontend/`, SQLite `blog.db`, md trung gian `posts_md/`).
- Python: `.venv/bin/python` (dùng `-I` khi chạy script phân tích dữ liệu tải về).
- Backend: uvicorn `--reload` port **8000** (tự reload khi sửa code). Frontend Vite port **5173**. Nếu chưa chạy: `.venv/bin/python -m uvicorn backend.main:app --reload --port 8000` và `cd frontend && npm run dev`.
- Auth mọi request tới backend: `Authorization: Bearer <APP_PASSWORD>` (đọc từ `.env`).
- MCP: `KNX_MCP_URL`, `KNX_MCP_TOKEN` trong `.env` (đã `load_dotenv`). **KHÔNG in/log/ghi token ở bất kỳ đâu** (code, báo cáo, file tạm, `job["error"]`). Client dùng sẵn: `backend/mcp_client.py` (`call`, `_call_patient` — tự chờ khi MCP trả 429 —, `get_post`, `list_products`, `get_product_edit`, `make_product_resolver`).
- Working tree đang có **nhiều thay đổi chưa commit, chủ ý** (extractor chỉ quét `#article-body`, nguồn MCP, bảng `products` có `site_id`, `internal_links.kind`...). **KHÔNG hoàn tác, KHÔNG commit, KHÔNG push.**
- Backup trước khi ghi DB: `sqlite3 blog.db ".backup '<thư mục ngoài repo>/blog.db.before-product-links'"`.

## 2. Sự thật đã xác minh (đừng làm lại, và đừng giả định khác)

**Hai hệ ID sản phẩm, VA CHẠM nhau:**
- `products.id` = **ID cũ/legacy** (PK hiện tại). Shortcode `{products:[N]}` trong bài dùng hệ này.
- `products.site_id` = **ID mới của site** (MCP trả `id` này, ví dụ DMXcas: `site_id` 79, `id` 683). ID 79 trong hệ cũ lại là sản phẩm khác (`lutron-bo-dieu-khien-rf`).
- 67 sản phẩm không có legacyId có `products.id = 1_000_000 + site_id`.
- `products.slug`, `sku`, `status` (`PUBLISHED` 819, `not_on_site` 6) đã có. Tổng 825 dòng; 741 ID cũ giữ nguyên.
- **`bundles[].id` trong MCP là ID MỚI** (hệ `site_id`). Khớp về `products` theo **slug** (hoặc `site_id`), TUYỆT ĐỐI không coi là `products.id`.

**MCP `get_product(slug)`** trả (trong số các trường khác): `id`, `slug`, `name`, `sku`, `brand`, `status`, `variants`, `related`, `bundles`, `clearances`. Mẫu 60 sản phẩm: `bundles` có dữ liệu ở ~6/60 (~10%), `related` rỗng 0/60, `variants` ~11/60 là tùy chọn màu/xuất xứ của cùng sản phẩm (không phải link giữa sản phẩm, bỏ qua). Mỗi mục bundle có dạng `{id, slug, name, sku, shortDescription, brand{slug,name}, primaryImage, isFeatured, b2c, b2b, stockStatus, ...}` — hãy xem một mẫu đầy đủ để biết có thêm số lượng/giá combo/ghi chú không.

**Giới hạn tốc độ MCP:** gọi song song bị 429; sync trước đó phải chạy tuần tự (819 sản phẩm ≈ 5–7 phút). Chạy như **job nền có tiến độ** (mẫu: `backend/routes/crawl.py` với `_jobs` + `GET /crawl/{job_id}`), KHÔNG nhồi vào một request HTTP.

**`posts.products`** là JSON list `[{"url": "https://knxstore.vn/products/<slug>", "name": ..., ...}]`. Map URL → `products.id` qua `products.url` hoặc slug cuối URL.

**Số liệu nền để đối chiếu (tại thời điểm viết, có thể đổi nhẹ nếu dữ liệu cập nhật):**
- 236 posts; 161/236 bài có sản phẩm; 1300 link bài→sản phẩm; 477/819 sản phẩm đang bán được nhắc ≥1 bài; 343 sản phẩm không bài nào nhắc; 267 sản phẩm được nhắc ≥2 bài.
- `co_mentioned`: ~7943 cặp có weight ≥1; ~426 cặp weight ≥3; cặp mạnh nhất cùng nằm trong 14–15 bài.
- `internal_links`: 476 `body` + 916 `related` (không liên quan việc này, KHÔNG được thay đổi).

## 3. Việc cần làm

### Bước 1 — Schema (idempotent, trong `backend/db.py` `init_db`)
Bảng mới:
```
product_links(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  from_id INTEGER NOT NULL,      -- products.id
  to_id   INTEGER NOT NULL,      -- products.id
  kind    TEXT NOT NULL,         -- 'bundle' | 'co_mentioned'
  weight  INTEGER NOT NULL DEFAULT 1,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(from_id, to_id, kind)
)
```
Index theo `from_id`, `to_id`, `kind`. `bundle`: có hướng (from = sản phẩm chứa bundle, to = sản phẩm trong bundle). `co_mentioned`: không hướng, lưu một dòng với `from_id < to_id`. KHÔNG đụng schema/dữ liệu của `products`, `posts`, `internal_links`.

### Bước 2 — Nạp `bundle` (nguồn A)
- Hàm `sync_product_bundles(conn, progress_cb=None)` (đặt trong `backend/product_sync.py` hoặc module mới `backend/product_links.py`): với mọi `products` có `status='PUBLISHED'` và `slug`, gọi `get_product(slug)` **tuần tự** (qua `_call_patient`), đọc `bundles`, map từng mục về `products.id` theo **slug** (fallback `site_id`). Thay thế **toàn bộ** `kind='bundle'` trong một transaction sau khi lấy xong toàn bộ dữ liệu (lỗi giữa chừng → không ghi dở).
- Báo cáo: số sản phẩm có bundle, tổng cặp, các mục **không khớp** (slug không có trong `products`) — liệt kê, không đoán.
- Endpoint `POST /products/links/sync` (job nền, trả `job_id`) và `GET /products/links/sync/{job_id}` (tiến độ: `total`, `done`, `failed`, `unmatched`, `status`). Không lộ token trong lỗi.

### Bước 3 — Tính `co_mentioned` (nguồn B)
- Hàm `rebuild_co_mentioned(conn)`: đọc `posts.products`, map URL → `products.id`, với mỗi bài lấy tập sản phẩm duy nhất, đếm mọi cặp; thay toàn bộ `kind='co_mentioned'` trong một transaction. Idempotent (chạy 2 lần → kết quả y hệt).
- Gọi tự động ở cuối job crawl bài (sau `import_run`) và cuối `POST /products/sync`; có thể gọi tay qua `POST /products/links/rebuild`.

### Bước 4 — API
- `GET /products/{id}/links` → `{ "bundle": [...], "co_mentioned": [{product, weight, posts:[slug,...]}], "mentioned_in": [{slug, headline}] }` (kèm `name`, `slug`, `url`, `image` nếu có).
- `GET /products` (đã có) thêm `bundle_count`, `co_mentioned_count`, `mentioned_in_count` và tham số lọc kiểu `mentioned=none|any`, `has_bundle=1`.
- `/stats` thêm: sản phẩm chưa bài nào nhắc, số sản phẩm có bundle, tổng cặp theo kind.
- Giữ nguyên hình dạng các trường hiện có để không làm vỡ UI.

### Bước 5 — Giao diện (gọn, theo phong cách hiện tại, không refactor lớn)
- `frontend/src/components/ProductsView.jsx`: chi tiết sản phẩm thêm tab/khối **"Liên kết"** (Bundle, Hay đi cùng kèm weight, Được nhắc ở bài nào); danh sách có thêm 2 cột đếm và bộ lọc "Chưa có bài nhắc".
- Đồ thị (`GraphView.jsx`, `graph.py`): khi bật "Sản phẩm", thêm cạnh sản phẩm–sản phẩm theo bộ chọn loại; **mặc định ẩn cặp `co_mentioned` có weight < 3** (còn ~426 cặp, tránh ~7943 cạnh làm rối) và có thanh/ô chỉnh ngưỡng. Cạnh `bundle` và `co_mentioned` khác màu/nét.
- Thêm hàm API vào `frontend/src/api.js`. Build kiểm tra: `cd frontend && npx vite build --outDir <thư mục tạm ngoài repo> --emptyOutDir` (đừng để lại thư mục build trong repo). ESLint: các lỗi có sẵn ở `GraphView.jsx`/`TreeView.jsx` là baseline, đừng thêm lỗi mới.

### Bước 6 — Chạy và kiểm chứng
1. Thử nhỏ trước (3–5 sản phẩm có bundle) rồi chạy **đúng một** job `bundle` đầy đủ (đợi nếu job khác đang chạy; không chạy song song).
2. Kiểm tra bắt buộc:
   - (a) 25 sản phẩm ngẫu nhiên + toàn bộ sản phẩm có bundle trong mẫu: so `product_links(kind='bundle')` với dữ liệu MCP gốc (gọi lại `get_product`, so theo slug).
   - (b) Tỉ lệ bundle khớp được về `products` (và danh sách không khớp).
   - (c) **Bẫy ID:** chứng minh không có bundle nào bị gán nhầm do va chạm ID (ví dụ bundle trỏ site-id 430 phải ra `led-driver-cc-casambi-15w-6-42v-2-kenh-nfc`, không phải sản phẩm có `products.id = 430`).
   - (d) `co_mentioned`: tính lại độc lập 20 cặp (đếm số bài chung bằng code khác) và so khớp; tổng số cặp ≈ số liệu nền ở mục 2.
   - (e) Chạy `rebuild_co_mentioned` và job `bundle` **hai lần**: kết quả phải giống hệt (idempotent).
   - (f) `internal_links`, `posts`, `products` không đổi (so số dòng/checksum với backup).
   - (g) Các endpoint mới và cũ (`/products`, `/products/{id}/links`, `/stats`, `/graph`) trả OK; `vite build` OK; không rò token (grep repo + file tạm).

## 4. Ràng buộc bắt buộc

- KHÔNG commit/push/sửa lịch sử git. KHÔNG xóa dòng `products`/`posts`/`internal_links`. KHÔNG đổi giá trị `products.id`. KHÔNG hoàn tác thay đổi chưa commit có sẵn.
- KHÔNG in/log/ghi token. KHÔNG lưu HTML bài viết.
- Một job nặng một lúc; MCP tuần tự; tôn trọng rate limit.
- Script tạm đặt ngoài repo (thư mục tạm của session). Khi chạy `git status`/`git diff` lọc `posts_md/` để output ngắn: `git status --short | grep -v posts_md | grep -v pycache`.
- Gặp quyết định ngoài phạm vi hoặc rủi ro mất dữ liệu: **dừng và nêu trong báo cáo**, đừng tự quyết.

## 5. Rủi ro cần nhớ

- `bundles` có thể thưa (~10% theo mẫu) — kết quả ít là bình thường, không phải lỗi.
- `co_mentioned` phản ánh cách viết bài, không phải sự thật thương mại.
- MCP có thể trả 429 giữa chừng: job phải tự chờ và thử lại, thất bại hẳn thì không ghi dở.
- Sau khi dùng `POST /products/import` (Admin.html, legacy) hoặc sync sản phẩm, cần chạy lại bước tính `co_mentioned` vì URL/ID sản phẩm có thể đổi.

## 6. Báo cáo cuối (ngắn, tối đa ~300 từ)

Nêu: file đã tạo/sửa; kết quả kiểm chứng (a)–(g) bằng số cụ thể (tổng cặp mỗi kind, số sản phẩm có bundle, số bundle không khớp, số cặp co_mentioned weight ≥3); điểm lệch so với kế hoạch và lý do; rủi ro/việc còn lại. Không commit.
