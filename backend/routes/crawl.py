"""
Crawl endpoint — trigger crawl, track progress qua polling.
Nguồn: "mcp" (MCP server knxstore, mặc định) hoặc "sitemap" (fetch HTML từng bài).
POST /crawl        → { job_id }   (409 nếu đang có job nặng khác: crawl bài / bundle / đồng bộ sản phẩm)
GET  /crawl/{job_id} → job status
Crawl BÀI VIẾT có 2 kiểu: mode="incremental" (chỉ cập nhật mới) | mode="full" (ghi đè toàn bộ); "related" là tùy chọn phụ.
Crawl SẢN PHẨM là việc riêng: POST /products/sync/jobs (backend/routes/products.py).
"""

import json
import os
import sys
import time
import uuid
import threading
import xml.etree.ElementTree as ET
from pathlib import Path
from urllib.request import urlopen, Request
from urllib.error import URLError, HTTPError

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

# Đảm bảo project root trong path để import crawl_posts
PROJECT_ROOT = Path(__file__).parent.parent.parent
sys.path.insert(0, str(PROJECT_ROOT))

router = APIRouter(prefix="/crawl", tags=["crawl"])

# ── In-memory job store ─────────────────────────────────────────────────────
_jobs: dict[str, dict] = {}


class CrawlRequest(BaseModel):
    """Crawl BÀI VIẾT (crawl sản phẩm là việc riêng: POST /products/sync/jobs). Hai kiểu chạy:
      mode="incremental" (Chỉ cập nhật mới): thêm bài mới + cập nhật bài có editedAt (MCP) / lastmod (sitemap) thay đổi;
                         bài không đổi bị bỏ qua. Bài mới/được cập nhật có đủ body + related (tải HTML live); co_mentioned tính lại ở cuối.
      mode="full"        (Ghi đè toàn bộ): ghi đè mọi bài (md + DB, cả body lẫn related). Chậm (~7 phút).
    Tùy chọn phụ: mode="related" chỉ làm mới khối "Bài viết liên quan" từ HTML live cho mọi bài (không đụng body)."""
    sitemap_url: str = ""          # chỉ cần khi source="sitemap"
    mode: str = "incremental"      # "incremental" | "full" | "related" (chỉ làm mới khối "Bài viết liên quan" từ HTML live)
    source: str = "mcp"            # "mcp" | "sitemap" (bỏ qua khi mode="related": luôn lấy HTML live)


@router.post("")
def start_crawl(req: CrawlRequest):
    if req.source not in ("mcp", "sitemap"):
        raise HTTPException(422, "source phải là 'mcp' hoặc 'sitemap'")
    if req.mode not in ("incremental", "full", "related"):
        raise HTTPException(422, "mode phải là 'incremental', 'full' hoặc 'related'")
    if req.source == "sitemap" and req.mode != "related" and not req.sitemap_url.strip():
        raise HTTPException(422, "Thiếu sitemap_url cho source='sitemap'")

    # Chỉ một job nặng một lúc (crawl bài / bundle / đồng bộ sản phẩm): MCP gọi tuần tự, tránh 429 và ghi chồng.
    from backend.routes.products import _busy_job_id, _START_LOCK
    with _START_LOCK:
        busy = _busy_job_id()
        if busy:
            raise HTTPException(409, f"Đang có job khác chạy ({busy}) — chờ xong rồi thử lại")
        job_id = uuid.uuid4().hex[:8]
        _jobs[job_id] = {
            "status":      "starting",
            "source":      req.source,
            "sitemap_url": req.sitemap_url if (req.source == "sitemap" and req.mode != "related") else "",
            "mode":        req.mode,
            "total":       0,
            "crawled":     0,
            "failed":      0,
            "skipped":     0,
            "ignored":     0,
            "no_body":     [],
            "no_related":  [],   # trang live hợp lệ nhưng không có khối "Bài viết liên quan"
            "related_failed": [],  # tải HTML live lỗi → GIỮ related cũ trong DB: [{slug, error}]
            "importing":   False,
            "current":     "",
            "error":       None,
        }
    if req.mode == "related":
        _jobs[job_id]["source"] = "live"
        target, args = _run_related_crawl, (job_id,)
    elif req.source == "mcp":
        _jobs[job_id].update({
            "missing_in_mcp":      [],   # có trong DB nhưng MCP không trả về — chỉ báo cáo, không xóa
            "failed_slugs":        [],   # get_post báo không tìm thấy bài
            "unresolved_products": {},   # slug → id/slug sản phẩm trong shortcode không tra được
        })
        target, args = _run_mcp_crawl, (job_id, req.mode)
    else:
        target, args = _run_crawl, (job_id, req.sitemap_url, req.mode)
    threading.Thread(target=target, args=args, daemon=True).start()
    return {"job_id": job_id}


@router.get("/{job_id}")
def get_status(job_id: str):
    if job_id not in _jobs:
        return {"error": "Job not found"}
    return _jobs[job_id]


# ── Background worker ───────────────────────────────────────────────────────

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    "Accept": "text/html,application/xhtml+xml",
    "Accept-Language": "vi-VN,vi;q=0.9,en;q=0.8",
}


def _fetch(url: str) -> str | None:
    req = Request(url, headers=HEADERS)
    try:
        with urlopen(req, timeout=15) as r:
            raw = r.read()
            try:
                return raw.decode("utf-8")
            except UnicodeDecodeError:
                return raw.decode("latin-1")
    except (URLError, HTTPError):
        return None


def _parse_sitemap_url(sitemap_url: str) -> list[dict]:
    xml_data = _fetch(sitemap_url)
    if not xml_data:
        raise RuntimeError(f"Không fetch được sitemap: {sitemap_url}")
    from crawl_posts import is_post_url
    root = ET.fromstring(xml_data)
    ns = {"sm": "http://www.sitemaps.org/schemas/sitemap/0.9"}
    entries = []
    ignored = []
    for el in root.findall("sm:url", ns):
        loc = el.findtext("sm:loc", namespaces=ns)
        lastmod = el.findtext("sm:lastmod", namespaces=ns)
        if not loc:
            continue
        # Chỉ lấy bài viết https://knxstore.vn/<slug>.html — bỏ /author/*, /blogs/*...
        if is_post_url(loc):
            entries.append({"url": loc, "lastmod": lastmod or ""})
        else:
            ignored.append(loc)
    return entries, ignored


def _run_crawl(job_id: str, sitemap_url: str, mode: str):
    job = _jobs[job_id]
    try:
        # Import crawler functions (at project root)
        from crawl_posts import (
            fetch_html, extract_jsonld, extract_meta_tags,
            find_article_jsonld, extract_internal_links, extract_product_links,
            jsonld_to_md, slug_from_url, ensure_article_body, related_from_html,
        )

        # 1. Fetch sitemap
        job["status"] = "fetching_sitemap"
        job["current"] = sitemap_url
        entries, ignored = _parse_sitemap_url(sitemap_url)
        job["ignored"] = len(ignored)   # URL sitemap không phải bài viết (author/blogs...)
        job["total"] = len(entries)
        job["status"] = "crawling"

        output_dir = PROJECT_ROOT / "posts_md"
        output_dir.mkdir(exist_ok=True)

        # Load updated_at từ DB để so sánh lastmod
        from backend.db import get_conn as _get_conn
        with _get_conn() as _conn:
            db_dates = dict(_conn.execute("SELECT slug, updated_at FROM posts").fetchall())
            old_related = _db_related(_conn)

        for i, entry in enumerate(entries):
            url = entry["url"]
            slug = slug_from_url(url)
            out_path = output_dir / f"{slug}.md"

            job["current"] = slug

            if mode == "incremental":
                lastmod = entry.get("lastmod", "")
                db_updated = db_dates.get(slug, "")
                # Skip nếu đã có trong DB và sitemap không mới hơn
                if db_updated and (not lastmod or lastmod <= db_updated[:10]):
                    job["skipped"] += 1
                    continue

            try:
                html = fetch_html(url)
                if not html:
                    job["failed"] += 1
                    continue

                if 'article-body' not in html:
                    # Template đổi / trang không phải bài → không trích được link thân bài
                    job["no_body"].append(slug)

                all_jsonld = extract_jsonld(html)
                meta       = extract_meta_tags(html)
                article, webpage = find_article_jsonld(all_jsonld)
                internal_links   = extract_internal_links(html, url)
                product_links    = extract_product_links(html)
                related_links    = related_from_html(html, url)   # None = trang không hợp lệ → giữ related cũ
                if related_links is None:
                    job["related_failed"].append({"slug": slug, "error": "trang không có #article-body"})
                    related_links = old_related.get(slug) or None
                elif not related_links:
                    job["no_related"].append(slug)

                article = ensure_article_body(article or {}, html)

                md = jsonld_to_md(url, entry["lastmod"], article, meta, all_jsonld, webpage, internal_links, product_links, related_links)
                out_path.write_text(md, encoding="utf-8")
                job["crawled"] += 1

            except Exception as e:
                job["failed"] += 1

            if i < len(entries) - 1:
                time.sleep(0.5)

        # 2. Import vào DB
        job["importing"] = True
        job["current"]   = "Importing to database…"
        from backend.import_posts import run as import_run
        import_run(output_dir)
        _refresh_co_mentioned(job)

        job["status"]    = "done"
        job["importing"] = False
        job["current"]   = ""

    except Exception as e:
        job["status"] = "error"
        job["error"]  = str(e)


# ── Related links ("Bài viết liên quan") ────────────────────────────────────

def _db_related(conn) -> dict[str, list[dict]]:
    """related hiện có trong DB: slug → [{url, slug, anchor, position}] (để giữ nguyên khi tải live lỗi)."""
    out: dict[str, list[dict]] = {}
    for r in conn.execute("""SELECT from_slug, to_slug, anchor, position FROM internal_links
                             WHERE kind = 'related' ORDER BY from_slug, position, id"""):
        out.setdefault(r["from_slug"], []).append({
            "url": f"https://knxstore.vn/{r['to_slug']}.html", "slug": r["to_slug"],
            "anchor": r["anchor"] or "", "position": r["position"],
        })
    return out


def _apply_live_related(job: dict, slug: str, live_url: str, old_related: dict) -> list[dict] | None:
    """Tải HTML live của 1 bài → danh sách related để ghi vào md (frontmatter `related_links`).
    Lỗi tải → ghi job['related_failed'] và trả related cũ trong DB (None nếu chưa có → không ghi khóa → import giữ nguyên)."""
    from crawl_posts import live_related
    rel = live_related(live_url)
    if rel["status"] == "failed":
        job["related_failed"].append({"slug": slug, "error": rel["error"]})
        return old_related.get(slug) or None
    if rel["status"] == "no_related":
        job["no_related"].append(slug)
    return rel["links"]


def _run_related_crawl(job_id: str):
    """mode="related": với mọi bài trong DB, tải HTML live → khối "Bài viết liên quan" → cập nhật frontmatter md
    (khóa related_links) + internal_links kind='related'. KHÔNG gọi MCP, KHÔNG đụng body/products/article_body/posts.
    Từng bài độc lập (ghi ngay); tải lỗi → giữ nguyên related cũ, ghi vào job['related_failed']."""
    job = _jobs[job_id]
    try:
        from backend.db import get_conn
        from backend.import_posts import replace_links
        from crawl_posts import is_post_url, set_md_related_links, live_related, BASE_DOMAIN

        job["status"] = "fetching_list"
        job["current"] = "DB: posts"
        with get_conn() as conn:
            rows = [(r["slug"], r["url"] or "") for r in conn.execute("SELECT slug, url FROM posts ORDER BY slug")]
        job["total"] = len(rows)
        job["status"] = "crawling"

        output_dir = PROJECT_ROOT / "posts_md"
        for i, (slug, url) in enumerate(rows):
            job["current"] = slug
            live_url = url if is_post_url(url) else f"https://{BASE_DOMAIN}/{slug}.html"
            rel = live_related(live_url)
            if rel["status"] == "failed":
                job["failed"] += 1
                job["related_failed"].append({"slug": slug, "error": rel["error"]})
            else:
                if rel["status"] == "no_related":
                    job["no_related"].append(slug)
                links = rel["links"]
                md_path = output_dir / f"{slug}.md"
                if md_path.exists():
                    old_md = md_path.read_text(encoding="utf-8")
                    new_md = set_md_related_links(old_md, links)
                    if new_md is not None and new_md != old_md:
                        md_path.write_text(new_md, encoding="utf-8")
                with get_conn() as conn:
                    replace_links(conn, slug, "related", links)
                job["crawled"] += 1
            if i < len(rows) - 1:
                time.sleep(0.5)

        job["status"]  = "done"
        job["current"] = ""

    except Exception as e:
        job["status"] = "error"
        job["error"]  = _safe_err(e)


# ── MCP worker ──────────────────────────────────────────────────────────────

def _safe_err(e: Exception) -> str:
    """Thông điệp lỗi cho job — không bao giờ để lộ token MCP."""
    msg = str(e)
    token = os.getenv("KNX_MCP_TOKEN", "").strip()
    if token:
        msg = msg.replace(token, "***")
    return msg[:500]


def _refresh_co_mentioned(job: dict) -> None:
    """Sau import_run: tính lại product_links kind='co_mentioned' (posts.products đã đổi). Lỗi không làm hỏng job crawl."""
    try:
        from backend.db import get_conn
        from backend.product_links import rebuild_co_mentioned
        with get_conn() as conn:
            job["co_mentioned"] = rebuild_co_mentioned(conn)
    except Exception as e:
        job["co_mentioned_error"] = _safe_err(e)


def _run_mcp_crawl(job_id: str, mode: str):
    """list_posts → get_post từng bài → (gom md trong RAM) → ghi posts_md → import vào DB.
    MCP lỗi giữa chừng → job error, KHÔNG ghi md và KHÔNG import (không để DB dở dang).
    Bài có trong DB mà MCP không trả về → chỉ báo cáo ở job['missing_in_mcp']."""
    job = _jobs[job_id]
    try:
        from backend import mcp_client
        from backend.db import get_conn
        from backend.product_sync import load_product_lookup
        from crawl_posts import mcp_post_parts, mcp_post_to_md, slug_from_url, BASE_DOMAIN

        job["status"] = "fetching_list"
        job["current"] = "MCP: search_posts"
        items = mcp_client.list_posts()
        job["total"] = len(items)

        with get_conn() as conn:
            db_rows = {r["slug"]: (r["date_modified"] or "", r["products"]) for r in
                       conn.execute("SELECT slug, date_modified, products FROM posts").fetchall()}
            lookup = load_product_lookup(conn)   # khóa theo site_id (ID MỚI của site) + slug
            old_related = _db_related(conn)

        mcp_slugs = {slug_from_url(it.get("url") or f"/{it['slug']}.html") for it in items}
        job["missing_in_mcp"] = sorted(set(db_rows) - mcp_slugs)
        job["status"] = "crawling"

        resolver = mcp_client.make_product_resolver()
        pending: dict[str, str] = {}   # slug → nội dung md (chỉ ghi ra đĩa khi toàn bộ MCP call thành công)
        for it in items:
            mcp_slug = it["slug"]
            job["current"] = mcp_slug
            try:
                post = mcp_client.get_post(mcp_slug)
            except mcp_client.MCPToolError:
                job["failed"] += 1
                job["failed_slugs"].append(mcp_slug)
                continue
            # Lỗi khác (401, mạng, 5xx hết retry) → MCPError bay lên outer except → job error

            slug = slug_from_url(post.get("url") or f"/{mcp_slug}.html")
            date_mod = post.get("editedAt") or post.get("publishedAt") or ""
            if mode == "incremental" and slug in db_rows and db_rows[slug][0] == date_mod:
                job["skipped"] += 1
                continue

            if not (post.get("contentHtml") or "").strip():
                job["no_body"].append(slug)
            try:
                old_products = json.loads(db_rows[slug][1]) if slug in db_rows else None
            except Exception:
                old_products = None
            parts = mcp_post_parts(post, lookup, old_products, resolver)
            if parts["unresolved_products"]:
                job["unresolved_products"][slug] = parts["unresolved_products"]
            # MCP không trả khối "Bài viết liên quan" → tải HTML live (tuần tự, delay 0.5s). Lỗi: giữ related cũ.
            parts["related_links"] = _apply_live_related(job, slug, f"https://{BASE_DOMAIN}/{slug}.html", old_related)
            pending[slug] = mcp_post_to_md(post, parts)
            job["crawled"] += 1
            time.sleep(0.5)

        # Toàn bộ MCP call đã thành công → ghi md rồi import
        output_dir = PROJECT_ROOT / "posts_md"
        output_dir.mkdir(exist_ok=True)
        for slug, md in pending.items():
            (output_dir / f"{slug}.md").write_text(md, encoding="utf-8")

        if pending:
            job["importing"] = True
            job["current"]   = "Importing to database…"
            from backend.import_posts import run as import_run
            import_run(output_dir)
            _refresh_co_mentioned(job)

        job["status"]    = "done"
        job["importing"] = False
        job["current"]   = ""

    except Exception as e:
        job["status"]    = "error"
        job["importing"] = False
        job["error"]     = _safe_err(e)
