const BASE = '/api'

function authHeader() {
  const token = localStorage.getItem('app_token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

// Lỗi HTTP: message giữ dạng `${status} ${path}` (nơi khác kiểm tra startsWith('409')); thêm .status để phân loại (404/409...).
function httpError(res, path) {
  const err = new Error(`${res.status} ${path}`)
  err.status = res.status
  return err
}

async function get(path) {
  const res = await fetch(BASE + path, { headers: authHeader() })
  if (res.status === 401) { localStorage.removeItem('app_token'); window.location.reload() }
  if (!res.ok) throw httpError(res, path)
  return res.json()
}

async function post(path, body) {
  const res = await fetch(BASE + path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeader() },
    body: JSON.stringify(body),
  })
  if (res.status === 401) { localStorage.removeItem('app_token'); window.location.reload() }
  if (!res.ok) throw httpError(res, path)
  return res.json()
}

export const api = {
  stats:       ()                    => get('/stats'),
  sections:    ()                    => get('/posts/sections'),
  posts:       (params = {})         => get('/posts?' + new URLSearchParams(params)),
  post:        (slug)                => get(`/posts/${slug}`),
  graph:       (params = {})         => get('/graph?' + new URLSearchParams(params)),
  audit:       ()                    => get('/audit'),
  crawlStart:  (sitemap_url, mode, source = 'mcp') => post('/crawl', { sitemap_url, mode, source }),
  crawlRelated: ()                   => post('/crawl', { sitemap_url: '', mode: 'related', source: 'mcp' }),  // chỉ làm mới khối "Bài viết liên quan" (HTML live)
  crawlStatus: (job_id)              => get(`/crawl/${job_id}`),
  suggestions: ()                    => get('/suggestions'),
  postHtml:    (slug)                => get(`/posts/${slug}/html`),
  recrawlPost: (slug)                => post(`/posts/${slug}/recrawl`, {}),
  getSetting:      (key)             => get(`/settings/${key}`),
  setSetting:      (key, value)      => post(`/settings/${key}`, { value }),
  saveHistory:     (body)            => post('/ai/history', body),
  getHistory:      (limit = 50)      => get(`/ai/history?limit=${limit}`),
  getHistoryItem:  (id)              => get(`/ai/history/${id}`),
  deleteHistory:   (id)              => fetch('/api/ai/history/' + id, { method: 'DELETE' }).then(r => r.json()),
  products:          (params = {})   => get('/products?' + new URLSearchParams(params)),
  productBrands:     ()              => get('/products/brands'),
  productCategories: ()              => get('/products/categories'),
  productLinks:      (id, params = {}) => get(`/products/${id}/links?` + new URLSearchParams(params)),   // {bundle, bundled_in, co_mentioned, mentioned_in}
  linksSyncStart:    (slugs)         => post('/products/links/sync', slugs ? { slugs } : {}),            // job nền nạp bundle từ MCP → {job_id}
  linksSyncStatus:   (job_id)        => get(`/products/links/sync/${job_id}`),
  linksRebuild:      ()              => post('/products/links/rebuild', {}),                              // tính lại co_mentioned (nhanh)
  syncJobStart:      (mode)          => post('/products/sync/jobs', { mode }),                            // job nền sync sản phẩm từ MCP: mode 'new' (chỉ cập nhật mới) | 'full' (ghi đè toàn bộ) → {job_id}
  syncJobStatus:     (job_id)        => get(`/products/sync/jobs/${job_id}`),                             // {status, mode, phase, total, done, current, result, error}
  syncProducts: (body = {}) => fetch('/api/products/sync', {   // LEGACY: sync đồng bộ trong 1 request (không còn dùng ở UI)
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeader() },
    body: JSON.stringify(body),
  }).then(r => { if (!r.ok) return r.json().then(e => Promise.reject(e)); return r.json() }),
  importProducts: (file) => {   // legacy: import Admin.html (ID cũ)
    const form = new FormData()
    form.append('file', file)
    return fetch('/api/products/import', {
      method: 'POST',
      headers: authHeader(),
      body: form,
    }).then(r => { if (!r.ok) return r.json().then(e => Promise.reject(e)); return r.json() })
  },
}

export function streamLinkSuggestions(slug, model, onChunk, onDone) {
  return streamAI(`/ai/link-suggestions/${slug}`, { model }, onChunk, onDone)
}

export function streamChat(messages, model, withContext, onChunk, onDone, postSlug = '') {
  return streamAI('/ai/chat', { messages, model, with_context: withContext, post_slug: postSlug }, onChunk, onDone)
}

// AI streaming — trả về ReadableStream, caller tự đọc chunks
export async function streamAI(path, body, onChunk, onDone) {
  const res = await fetch(BASE + path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeader() },
    body: JSON.stringify(body),
  })
  if (res.status === 401) { localStorage.removeItem('app_token'); window.location.reload(); return }
  if (!res.ok) throw new Error(`${res.status} ${path}`)
  const reader = res.body.getReader()
  const decoder = new TextDecoder()
  let buf = ''
  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    buf += decoder.decode(value, { stream: true })
    const lines = buf.split('\n')
    buf = lines.pop()
    for (const line of lines) {
      if (!line.startsWith('data: ')) continue
      const raw = line.slice(6).trim()
      if (raw === '[DONE]') { onDone?.(); return }
      try { onChunk(JSON.parse(raw).text) } catch {}
    }
  }
  onDone?.()
}
