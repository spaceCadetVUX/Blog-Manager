# Sprint Plan — Tích hợp Content Intel vào Blog Manager

> Mục tiêu: Gắn toàn bộ content-intel (6 trang, backend riêng) vào blogmanager dưới dạng tab "Content Intel" trong sidebar. Một app, hai backend, không refactor logic business.

---

## Bức tranh kỹ thuật

### Sự khác biệt cần giải quyết

| Điểm | Blog Manager | Content Intel | Cách xử lý |
|---|---|---|---|
| Language | JSX (plain JS) | TSX (TypeScript) | Convert .tsx → .jsx, strip types |
| Routing | State-based (`VIEWS` obj) | React Router v6 | Dùng `MemoryRouter` bọc CI section |
| Data fetching | `fetch` thuần | TanStack React Query v5 | Thêm dep + `QueryClientProvider` |
| Tailwind | v4 (`@tailwindcss/vite`) | v3 (`postcss`) | Classes mostly compatible, v4 parse được |
| Backend port | 8000 → `/api` proxy | 8100 (chưa có proxy) | Thêm proxy `/ci` → `8100` |
| Auth | Bearer token mọi request | Không có auth | CI calls đi `/ci`, không cần auth header |
| Lucide | v1.20.0 | v0.441.0 (= v1.x) | Dùng version của blogmanager, compatible |
| React version | 19 | 18 | React 19 backward compatible với 18 API |

### Kiến trúc sau khi tích hợp

```
blogmanager/
├── frontend/                         ← 1 Vite app duy nhất
│   └── src/
│       ├── App.jsx                   ← thêm view "content_intel"
│       ├── components/
│       │   ├── Sidebar.jsx           ← thêm nav item CI
│       │   └── ContentIntelView.jsx  ← wrapper mới, sub-nav + MemoryRouter
│       └── content-intel/            ← copy từ content-intel/frontend/src/
│           ├── api/                  ← client.js BASE = '/ci'
│           ├── components/
│           └── pages/
└── backend/                          ← port 8000, không đổi

content-intel/
└── backend/                          ← port 8100, chạy song song
    └── main.py                       ← không đổi gì
```

---

## Sprint 0 — Chuẩn bị & kiểm tra môi trường
**Ước tính: 1.5 giờ | Không đụng code chính**

### Mục tiêu
Đảm bảo content-intel backend chạy độc lập được trước khi bắt đầu tích hợp.

### Checklist

- [ ] **0.1** Kiểm tra Python deps của content-intel backend
  ```powershell
  cd "content-intel\backend"
  pip install -r requirements.txt
  playwright install chromium   # bắt buộc — competitor crawler dùng Playwright
  ```

- [ ] **0.2** Tạo `content-intel/data/` và file `.env`

  ```powershell
  mkdir content-intel\data
  ```

  Tạo file `content-intel/backend/.env`:
  ```
  DATABASE_URL=sqlite:///./data/content_intel.db
  ANTHROPIC_API_KEY=sk-ant-...
  GSC_SITE_URL=https://knxstore.vn/
  MCP_GSC_URL=http://localhost:8200/sse
  MCP_KEYWORD_URL=http://localhost:8201/sse
  ```

  > **QUAN TRỌNG:** `database.py` mặc định dùng đường dẫn Docker `/app/data/content_intel.db`. Nếu không set `DATABASE_URL`, backend sẽ cố tạo DB tại `/app/data/` và fail ngay lập tức trên Windows.

  > **MCP servers:** Nếu chưa có GSC và Keyword Planner MCP, các tính năng Sync GSC và Gap Analysis sẽ báo lỗi khi gọi, nhưng 4 tính năng còn lại (Inventory manual, Cannibalization, Competitors, Briefs, Links) vẫn chạy bình thường.

- [ ] **0.3** Khởi động content-intel backend

  > **QUAN TRỌNG:** Backend phải chạy từ trong thư mục `content-intel/backend/`, KHÔNG phải từ `content-intel/`. Lý do: `main.py` import `from db.database import ...` (không có prefix `backend.`), nên Python cần thấy `db/` ngay tại working directory.

  ```powershell
  cd "content-intel\backend"
  python -m uvicorn main:app --port 8100 --reload
  ```

  Test:
  ```powershell
  Invoke-WebRequest -Uri "http://localhost:8100/health" -UseBasicParsing | Select-Object -ExpandProperty Content
  # Kết quả: {"status":"ok","version":"1.0.0"}
  ```

- [ ] **0.4** Verify DB được tạo tự động
  ```powershell
  Test-Path "content-intel\data\content_intel.db"   # phải trả về True
  ```

- [ ] **0.5** Git commit snapshot trước khi bắt đầu
  ```powershell
  git add -A
  git commit -m "snapshot before content-intel integration"
  ```

### Rủi ro Sprint 0
- `playwright install chromium` tải ~150MB, cần internet
- Nếu port 8100 bị chiếm → đổi sang 8101 và cập nhật proxy rule ở Sprint 1 cho nhất quán

---

## Sprint 1 — Vite proxy + Dependencies frontend
**Ước tính: 1 giờ | File thay đổi: `vite.config.js`, `package.json`**

### Mục tiêu
Blogmanager frontend có thể gọi content-intel backend qua prefix `/ci`.

### Checklist

- [ ] **1.1** Thêm proxy rule vào `frontend/vite.config.js`

  **Trước:**
  ```js
  proxy: {
    '/api': { target: 'http://localhost:8000', rewrite: path => path.replace(/^\/api/, '') },
  }
  ```

  **Sau:**
  ```js
  proxy: {
    '/api': { target: 'http://localhost:8000', rewrite: path => path.replace(/^\/api/, '') },
    '/ci':  { target: 'http://localhost:8100', rewrite: path => path.replace(/^\/ci/, '') },
  }
  ```

- [ ] **1.2** Thêm dependencies vào `frontend/package.json`
  ```
  npm install @tanstack/react-query@5 react-router-dom recharts @tanstack/react-table clsx
  ```

  Packages cần thêm:
  - `@tanstack/react-query` v5 → React Query
  - `react-router-dom` v6 → MemoryRouter cho CI section
  - `recharts` → charts trong Gaps/Inventory
  - `@tanstack/react-table` → table sorting/filtering
  - `clsx` → utility ghép className

- [ ] **1.3** Wrap `<App>` với `QueryClientProvider` trong `frontend/src/main.jsx`

  ```jsx
  import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

  const queryClient = new QueryClient({
    defaultOptions: { queries: { staleTime: 30_000, retry: 1 } },
  })

  createRoot(document.getElementById('root')).render(
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  )
  ```

  > `staleTime: 30_000` — tránh refetch liên tục mỗi lần user chuyển tab. Default của React Query v5 là 0 (refetch ngay), không phù hợp với app này.

- [ ] **1.4** Verify `clsx` có thực sự cần không
  Scan toàn bộ content-intel source: không có file nào `import clsx`. Package nằm trong `package.json` nhưng không dùng → **bỏ qua, không install**.
  Chỉ install 4 packages thực sự cần:
  ```
  npm install @tanstack/react-query@^5 react-router-dom recharts @tanstack/react-table
  ```

- [ ] **1.5** Verify: `npm run dev` không báo lỗi dependency

### Rủi ro Sprint 1
- Tailwind v4 của blogmanager dùng `@tailwindcss/vite` plugin, không có `postcss.config.js`. Content-intel dùng Tailwind v3 qua postcss. Sau khi copy files CI vào blogmanager, Tailwind v4 sẽ scan và compile các class trong files CI — điều này tương thích vì các utility class (flex, grid, bg-*, text-*) giống nhau ở v3 và v4.

---

## Sprint 2 — Copy & convert content-intel frontend
**Ước tính: 3-4 giờ | Nhiều file nhưng cơ học**

### Mục tiêu
Copy toàn bộ pages, api, components của content-intel vào blogmanager, convert từ TypeScript sang JavaScript.

### Cấu trúc thư mục đích

```
frontend/src/content-intel/
├── api/
│   ├── client.js          ← BASE = '/ci'
│   ├── inventory.js
│   ├── gaps.js
│   ├── cannibalization.js
│   ├── competitors.js
│   ├── briefs.js
│   └── links.js
├── components/
│   ├── Badge.jsx
│   ├── Button.jsx
│   └── Spinner.jsx
└── pages/
    ├── Inventory.jsx
    ├── Gaps.jsx
    ├── Cannibalization.jsx
    ├── Competitors.jsx
    ├── Briefs.jsx
    └── Links.jsx
```

> **Không copy** `Layout.tsx` — sẽ thay bằng `ContentIntelView.jsx` ở Sprint 3.

### Quy tắc convert TypeScript → JavaScript

1. **Xóa tất cả type annotations trên parameter và return**
   ```ts
   function foo(x: string, y: number): boolean { ... }
   // → function foo(x, y) { ... }
   ```

2. **Xóa `interface` và `type` declarations — kể cả INLINE bên trong function body**
   ```ts
   export interface Page { id: number; url: string }
   export type Tier = 'top' | 'mid' | 'low' | 'zero'
   // → xóa hoàn toàn
   ```

   > **Cạm bẫy thực tế:** `Competitors.tsx` và `Links.tsx` có type declarations BÊN TRONG function body:
   > ```ts
   > // Competitors.tsx — bên trong AnalysisPanel()
   > type KW = { term: string; score: number; page_count?: number }
   > type Gap = { url?: string; title?: string }
   > // Links.tsx — top level
   > type Tab = 'orphans' | 'broken' | 'overlinked'
   > ```
   > Phải xóa cả những dòng này.

3. **Xóa `import type` và `import type` kết hợp**
   ```ts
   import type { Tier } from '../api/inventory'
   import type { ButtonHTMLAttributes } from 'react'
   // → xóa cả dòng
   ```

4. **Generic `<T>` trên function calls và useState**
   ```ts
   apiFetch<Stats>('/inventory/stats')
   useState<number | null>(null)
   useMutation<unknown, Error, number | void>({ ... })
   // → apiFetch('/inventory/stats')
   // → useState(null)
   // → useMutation({ ... })
   ```

5. **React event types trên handler**
   ```ts
   function handleAdd(e: React.FormEvent) { ... }
   function handleCrawl(id: number) { ... }
   (e: React.ChangeEvent<HTMLInputElement>) => ...
   // → function handleAdd(e) { ... }
   // → function handleCrawl(id) { ... }
   // → (e) => ...
   ```

6. **Component props type**
   ```ts
   export default function Layout({ children }: { children: React.ReactNode })
   // → export default function Layout({ children })
   ```

7. **`interface Props extends ...`  trong Button.tsx**
   ```ts
   interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
     variant?: 'primary' | ...
     loading?: boolean
     size?: 'sm' | 'md'
   }
   export default function Button({ variant, size, loading, children, className = '', disabled, ...props }: Props)
   // → xóa interface, giữ destructuring nhưng bỏ `: Props`
   export default function Button({ variant = 'secondary', size = 'md', loading, children, className = '', disabled, ...props })
   ```

### Checklist từng file

**API layer:**
- [ ] **2.1** `client.js` — đổi `BASE = '/ci'` (thay vì `VITE_API_URL` env) để tránh conflict với blogmanager's `/api`
- [ ] **2.2** `inventory.js` — xóa types/interfaces, giữ hooks
- [ ] **2.3** `gaps.js` — xóa `Classification` type, giữ hooks
- [ ] **2.4** `cannibalization.js` — xóa types, giữ hooks
- [ ] **2.5** `competitors.js` — xóa types, giữ hooks
- [ ] **2.6** `briefs.js` — xóa types, giữ hooks
- [ ] **2.7** `links.js` — xóa types, giữ hooks

**Components:**
- [ ] **2.8** `Badge.jsx` — xóa `import type`, xóa `: { tier: Tier }` prop types
- [ ] **2.9** `Button.jsx` — xóa prop types, giữ variant/size logic
- [ ] **2.10** `Spinner.jsx` — đơn giản, chỉ xóa type props

**Pages (phức tạp nhất):**
- [ ] **2.11** `Inventory.jsx` — xóa `Tier`, `SortKey` types; xóa generic trong useState
- [ ] **2.12** `Gaps.jsx` — xóa types; kiểm tra recharts imports
- [ ] **2.13** `Cannibalization.jsx` — xóa types; kiểm tra `@tanstack/react-table` usage
- [ ] **2.14** `Competitors.jsx` — xóa types; giữ polling logic (crawl queue)
- [ ] **2.15** `Briefs.jsx` — xóa types; giữ `BriefDetail` component, export Markdown
- [ ] **2.16** `Links.jsx` — xóa types; kiểm tra internal link graph data

### Verify Sprint 2
Sau mỗi file convert, chạy `npm run dev` → kiểm tra không có lỗi import hay syntax.

---

## Sprint 3 — Tạo ContentIntelView và mount vào App
**Ước tính: 2 giờ | File mới: `ContentIntelView.jsx`; file sửa: `App.jsx`, `Sidebar.jsx`**

### Mục tiêu
Gắn content-intel vào sidebar blogmanager dưới dạng tab "Content Intel", với sub-navigation nội bộ.

### 3.1 Tạo `ContentIntelView.jsx`

Thay thế `Layout.tsx` của content-intel (có own header + router) bằng một view component tích hợp vào layout blogmanager.

```jsx
// frontend/src/components/ContentIntelView.jsx
import { useState } from 'react'
import { MemoryRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import { LayoutDashboard, TrendingUp, GitMerge, Globe, FileText, Link2 } from 'lucide-react'
import Inventory    from '../content-intel/pages/Inventory'
import Gaps         from '../content-intel/pages/Gaps'
import Cannibalization from '../content-intel/pages/Cannibalization'
import Competitors  from '../content-intel/pages/Competitors'
import Briefs       from '../content-intel/pages/Briefs'
import Links        from '../content-intel/pages/Links'

const CI_NAV = [
  { path: '/',                icon: LayoutDashboard, label: 'Inventory' },
  { path: '/gaps',            icon: TrendingUp,      label: 'Gaps' },
  { path: '/cannibalization', icon: GitMerge,        label: 'Cannibalization' },
  { path: '/competitors',     icon: Globe,           label: 'Competitors' },
  { path: '/briefs',          icon: FileText,        label: 'Briefs' },
  { path: '/links',           icon: Link2,           label: 'Internal Links' },
]

function CILayout() {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      {/* Sub-nav bar */}
      <div style={{
        borderBottom: '1px solid var(--border)',
        background: 'var(--surface)',
        padding: '0 16px',
        display: 'flex', gap: 4, overflowX: 'auto', flexShrink: 0,
      }}>
        {CI_NAV.map(({ path, icon: Icon, label }) => {
          const isActive = location.pathname === path
          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '10px 12px',
                background: 'transparent', border: 'none',
                borderBottom: isActive ? '2px solid var(--accent)' : '2px solid transparent',
                color: isActive ? 'var(--accent-2)' : 'var(--text-muted)',
                cursor: 'pointer', fontSize: 13, fontWeight: isActive ? 500 : 400,
                whiteSpace: 'nowrap', transition: 'all 0.15s',
              }}
            >
              <Icon size={14} strokeWidth={1.8} />
              {label}
            </button>
          )
        })}
      </div>

      {/* Page content */}
      <div style={{ flex: 1, overflow: 'auto', padding: 20 }}>
        <Routes>
          <Route path="/"                index element={<Inventory />} />
          <Route path="/gaps"            element={<Gaps />} />
          <Route path="/cannibalization" element={<Cannibalization />} />
          <Route path="/competitors"     element={<Competitors />} />
          <Route path="/briefs"          element={<Briefs />} />
          <Route path="/links"           element={<Links />} />
        </Routes>
      </div>
    </div>
  )
}

export default function ContentIntelView() {
  return (
    <MemoryRouter>
      <CILayout />
    </MemoryRouter>
  )
}
```

> **Tại sao MemoryRouter?** Tránh conflict với URL của blogmanager (vốn không dùng URL routing). MemoryRouter quản lý navigation state trong memory, URL trình duyệt không thay đổi.

### 3.2 Sửa `App.jsx` — thêm view

```jsx
// Thêm import
import ContentIntelView from './components/ContentIntelView'

// Thêm vào VIEWS
const VIEWS = {
  ...
  content_intel: ContentIntelView,   // ← thêm dòng này
}

// Thêm vào BOTTOM_NAV
const BOTTOM_NAV = [
  ...
  { id: 'content_intel', label: 'Content Intel', icon: BarChart2 },  // ← thêm
  { id: 'settings', ... },
]
```

### 3.3 Sửa `Sidebar.jsx` — thêm nav item

```jsx
// Thêm import icon
import { BarChart2 } from 'lucide-react'

// Thêm vào NAV array (trước Settings)
const NAV = [
  ...
  { id: 'content_intel', label: 'Content Intel', icon: BarChart2 },
  { id: 'settings', ... },
]
```

### Checklist Sprint 3
- [ ] **3.1** Tạo `ContentIntelView.jsx` với MemoryRouter + sub-nav
- [ ] **3.2** Thêm `content_intel` vào VIEWS và BOTTOM_NAV trong `App.jsx`
- [ ] **3.3** Thêm nav item vào `Sidebar.jsx`
- [ ] **3.4** Verify: click "Content Intel" trong sidebar → hiển thị Inventory page
- [ ] **3.5** Verify: click từng tab sub-nav → đúng trang render

---

## Sprint 4 — Styling & Dark Mode compatibility
**Ước tính: 2 giờ | Chủ yếu là CSS fixes**

### Bối cảnh vấn đề (đã phân tích kỹ)

Đây là vấn đề **thực và sẽ xảy ra chắc chắn**, không phải giả thuyết:

- Blogmanager dùng **CSS variables** cho dark theme (luôn dark, không có toggle): `var(--bg) = #0d1117`, `var(--surface) = #161b22`…
- `<html>` của blogmanager **KHÔNG có** `class="dark"` → Tailwind `dark:` prefix sẽ không kích hoạt
- Content-intel pages dùng `dark:bg-zinc-900`, `dark:text-zinc-100`… → những class này sẽ bị ignore
- Kết quả: CI pages render với **nền trắng** (`bg-white`, `bg-gray-50`) bên trong app tối của blogmanager → rất dễ thấy, trông xấu

### Fix cụ thể (không phải "kiểm tra xem có cần không")

**Fix duy nhất, 1 dòng:** Thêm `class="dark"` vào `<html>` trong `frontend/index.html`:

```html
<!-- Trước -->
<html lang="vi">

<!-- Sau -->
<html lang="vi" class="dark">
```

Vì blogmanager luôn dark (không có light mode toggle), đây là safe 100%. Sau khi thêm `class="dark"`:
- Tất cả `dark:` utilities của CI pages sẽ kích hoạt → `dark:bg-zinc-900`, `dark:text-zinc-100` có hiệu lực
- Blogmanager hiện tại không dùng `dark:` classes nên không bị ảnh hưởng

### Checklist Sprint 4
- [ ] **4.1** Thêm `class="dark"` vào `<html>` trong `frontend/index.html`
- [ ] **4.2** Reload app → verify CI pages có nền tối, text sáng
- [ ] **4.3** Verify blogmanager pages cũ không bị ảnh hưởng (Dashboard, Graph, Posts…)
- [ ] **4.4** Fix layout: CI pages dùng `max-w-screen-xl mx-auto px-4` trong `Layout.tsx` gốc → sau khi bỏ Layout, content render full-width trong scroll container của `ContentIntelView`. Verify không bị overflow ngang.
- [ ] **4.5** Fix sub-nav scroll trên màn hình nhỏ (`overflow-x: auto`, `white-space: nowrap` trên sub-nav bar)
- [ ] **4.6** Recharts 0-width bug: nếu chart không hiển thị → wrap `<ResponsiveContainer>` bằng div có `style={{ width: '100%', minHeight: 300 }}`

---

## Sprint 5 — Wiring content-intel backend
**Ước tính: 1-2 giờ | Script start + verify từng endpoint**

### Mục tiêu
Content-intel backend chạy ổn định, tất cả 7 router hoạt động qua proxy `/ci`.

### Checklist

- [ ] **5.1** Tạo script start cả 2 backend tiện lợi

  Tạo file `start.ps1` ở root project:
  ```powershell
  # Start blogmanager backend (chạy từ project root)
  Start-Process powershell -ArgumentList '-NoExit', '-Command',
    'cd "C:\Users\vusu3\OneDrive\Desktop\blogpost"; python -m uvicorn backend.main:app --reload --port 8000'

  # Start content-intel backend (PHẢI chạy từ trong backend/)
  Start-Process powershell -ArgumentList '-NoExit', '-Command',
    'cd "C:\Users\vusu3\OneDrive\Desktop\blogpost\content-intel\backend"; python -m uvicorn main:app --reload --port 8100'

  # Start frontend
  Start-Process powershell -ArgumentList '-NoExit', '-Command',
    'cd "C:\Users\vusu3\OneDrive\Desktop\blogpost\frontend"; npm run dev'
  ```

  > **Lưu ý working directory:** blogmanager backend chạy từ root (`python -m uvicorn backend.main:app`), còn content-intel chạy từ `content-intel/backend/` (`python -m uvicorn main:app`). Lý do: import structure khác nhau.

- [ ] **5.2** Test proxy routing từ frontend:
  - `GET /ci/health` → `{"status":"ok"}`
  - `GET /ci/inventory` → danh sách pages (có thể rỗng lần đầu)
  - `GET /ci/inventory/stats` → stats object

- [ ] **5.3** Import data mẫu vào content-intel DB
  - Dùng tính năng Import CSV trong Inventory page (upload file URL list)
  - Hoặc tạo migration script từ `blog.db` sang `content_intel.db`

- [ ] **5.4** Test Briefs generation (cần ANTHROPIC_API_KEY hợp lệ)
  - Nhập topic → Generate → Verify Claude trả về outline

- [ ] **5.5** Test Competitor crawl (chọn 1 domain nhỏ để test nhanh)

---

## Sprint 6 — QA tổng thể & Polish
**Ước tính: 2 giờ**

### Test matrix

| Tính năng | Test case | Pass? |
|---|---|---|
| **Auth** | Reload → login vẫn giữ nguyên | |
| **Sidebar** | Click Content Intel → load được | |
| **Sub-nav** | 6 tab CI hoạt động đúng | |
| **Inventory** | Load danh sách pages | |
| **Inventory** | Sync GSC button | |
| **Inventory** | Import CSV | |
| **Inventory** | Filter by tier, search, keyword | |
| **Gaps** | Load opportunities | |
| **Gaps** | Filter quick win / long shot / defense | |
| **Cannibalization** | Run analysis → hiển thị pairs | |
| **Competitors** | Add domain → crawl queue | |
| **Briefs** | Generate brief → Claude trả về | |
| **Briefs** | Export Markdown → copy clipboard | |
| **Links** | Crawl → hiển thị orphans | |
| **Mobile** | Bottom nav hiển thị "Content Intel" | |
| **Dark mode** | CI pages không bị mất màu | |
| **Blogmanager** | Các tính năng cũ không bị ảnh hưởng | |

### Checklist polish
- [ ] **6.1** Loading states: tất cả trang CI hiển thị Spinner khi fetch
- [ ] **6.2** Error states: khi backend không chạy → hiển thị error message, không crash
- [ ] **6.3** Empty states: khi DB chưa có data → hiển thị "Chưa có data, import để bắt đầu"
- [ ] **6.4** Sidebar icon cho Content Intel trông nhất quán với các icon khác
- [ ] **6.5** Sub-nav trên tablet (collapsed sidebar) → scrollable và không overflow

---

## Tóm tắt timeline

| Sprint | Công việc | Thời gian |
|---|---|---|
| Sprint 0 | Chuẩn bị, verify CI backend chạy được | 1 giờ |
| Sprint 1 | Vite proxy + npm deps + QueryClientProvider | 1 giờ |
| Sprint 2 | Copy & convert 16 files TSX → JSX | 3-4 giờ |
| Sprint 3 | ContentIntelView, mount vào App + Sidebar | 2 giờ |
| Sprint 4 | Styling, dark mode, layout fixes | 2 giờ |
| Sprint 5 | Wiring backend, start scripts, data test | 1-2 giờ |
| Sprint 6 | QA tổng thể | 2 giờ |
| **Tổng** | | **~12-14 giờ** |

---

## Những gì KHÔNG thay đổi

- Toàn bộ logic business của cả 2 backend → **không đụng**
- Database `blog.db` và `content_intel.db` → **độc lập, không merge**
- Auth của blogmanager (Bearer token) → **chỉ áp dụng cho `/api` calls**
- Content-intel backend endpoints → **không đổi gì**

## Điều kiện để bắt đầu

Trước Sprint 1, cần có:
1. Content-intel backend chạy được trên port 8100 (Sprint 0 done)
2. Xác nhận `ANTHROPIC_API_KEY` trong `.env` của content-intel hợp lệ
3. Quyết định về MCP servers (GSC + Keyword Planner): nếu chưa có → các tính năng Sync GSC và Keyword enrichment sẽ bị disabled, nhưng không block các tính năng còn lại
