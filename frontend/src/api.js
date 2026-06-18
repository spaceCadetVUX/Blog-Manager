const BASE = '/api'

async function get(path) {
  const res = await fetch(BASE + path)
  if (!res.ok) throw new Error(`${res.status} ${path}`)
  return res.json()
}

async function post(path, body) {
  const res = await fetch(BASE + path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
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
}

// AI streaming — trả về ReadableStream, caller tự đọc chunks
export async function streamAI(path, body, onChunk, onDone) {
  const res = await fetch(BASE + path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
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
