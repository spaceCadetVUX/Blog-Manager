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
