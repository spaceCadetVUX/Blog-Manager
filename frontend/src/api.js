const BASE = '/api'

function authHeader() {
  const token = localStorage.getItem('app_token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

async function get(path) {
  const res = await fetch(BASE + path, { headers: authHeader() })
  if (res.status === 401) { localStorage.removeItem('app_token'); window.location.reload() }
  if (!res.ok) throw new Error(`${res.status} ${path}`)
  return res.json()
}

async function post(path, body) {
  const res = await fetch(BASE + path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeader() },
    body: JSON.stringify(body),
  })
  if (res.status === 401) { localStorage.removeItem('app_token'); window.location.reload() }
  if (!res.ok) throw new Error(`${res.status} ${path}`)
  return res.json()
}

export const api = {
  stats:       ()                    => get('/stats'),
  sections:    ()                    => get('/posts/sections'),
  posts:       (params = {})         => get('/posts?' + new URLSearchParams(params)),
  post:        (slug)                => get(`/posts/${slug}`),
  graph:       (params = {})         => get('/graph?' + new URLSearchParams(params)),
  audit:       ()                    => get('/audit'),
  crawlStart:  (sitemap_url, mode)   => post('/crawl', { sitemap_url, mode }),
  crawlStatus: (job_id)              => get(`/crawl/${job_id}`),
  suggestions: ()                    => get('/suggestions'),
  postHtml:    (slug)                => get(`/posts/${slug}/html`),
  getSetting:      (key)             => get(`/settings/${key}`),
  setSetting:      (key, value)      => post(`/settings/${key}`, { value }),
  saveHistory:     (body)            => post('/ai/history', body),
  getHistory:      (limit = 50)      => get(`/ai/history?limit=${limit}`),
  getHistoryItem:  (id)              => get(`/ai/history/${id}`),
  deleteHistory:   (id)              => fetch('/api/ai/history/' + id, { method: 'DELETE' }).then(r => r.json()),
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
