import json
import sys
from pathlib import Path
from bs4 import BeautifulSoup
from fastapi import APIRouter, Query, HTTPException
from backend.db import get_conn
from backend.product_sync import load_product_lookup
from backend.routes.crawl import _db_related, _apply_live_related

PROJECT_ROOT = Path(__file__).parent.parent.parent
sys.path.insert(0, str(PROJECT_ROOT))

router = APIRouter(prefix="/posts", tags=["posts"])


def row_to_dict(row) -> dict:
    d = dict(row)
    for field in ("keywords", "mentions", "breadcrumb", "products"):
        try:
            d[field] = json.loads(d.get(field) or "[]")
        except Exception:
            d[field] = []
    return d


@router.get("")
def list_posts(
    q: str = Query("", description="Search headline/description"),
    section: str = Query("", description="Filter by articleSection"),
    sort: str = Query("date_modified", description="date_modified|word_count|headline|inbound_links"),
    order: str = Query("desc"),
    limit: int = Query(500, le=500),
    offset: int = Query(0),
):
    order_sql = "DESC" if order.lower() == "desc" else "ASC"

    sort_map = {
        "date_modified": "p.date_modified",
        "date_published": "p.date_published",
        "word_count": "p.word_count",
        "headline": "p.headline",
        "inbound_links": "inbound",
    }
    sort_col = sort_map.get(sort, "p.date_modified")

    params: list = []
    where_clauses = []

    if q:
        where_clauses.append("(p.headline LIKE ? OR p.description LIKE ?)")
        params += [f"%{q}%", f"%{q}%"]
    if section:
        where_clauses.append("p.article_section = ?")
        params.append(section)

    where_sql = ("WHERE " + " AND ".join(where_clauses)) if where_clauses else ""

    # inbound/outbound = link THÂN BÀI (kind='body'); *_related = khối "Bài viết liên quan" (kind='related').
    # Subquery tương quan (không JOIN) để 4 bộ đếm không nhân chéo hàng.
    sql = f"""
        SELECT
            p.*,
            (SELECT COUNT(DISTINCT from_slug) FROM internal_links WHERE to_slug   = p.slug AND kind = 'body')    AS inbound,
            (SELECT COUNT(DISTINCT to_slug)   FROM internal_links WHERE from_slug = p.slug AND kind = 'body')    AS outbound,
            (SELECT COUNT(DISTINCT from_slug) FROM internal_links WHERE to_slug   = p.slug AND kind = 'related') AS inbound_related,
            (SELECT COUNT(DISTINCT to_slug)   FROM internal_links WHERE from_slug = p.slug AND kind = 'related') AS outbound_related
        FROM posts p
        {where_sql}
        ORDER BY {sort_col} {order_sql}
        LIMIT ? OFFSET ?
    """
    params += [limit, offset]

    with get_conn() as conn:
        rows = conn.execute(sql, params).fetchall()
        total = conn.execute(
            f"SELECT COUNT(*) FROM posts p {where_sql}",
            params[:-2]
        ).fetchone()[0]

    posts = []
    for row in rows:
        d = row_to_dict(row)
        d.pop("article_body", None)  # không trả body trong list
        posts.append(d)

    return {"total": total, "items": posts}


@router.get("/sections")
def list_sections():
    with get_conn() as conn:
        rows = conn.execute("""
            SELECT article_section, COUNT(*) as count
            FROM posts
            WHERE article_section != ''
            GROUP BY article_section
            ORDER BY count DESC
        """).fetchall()
    return [dict(r) for r in rows]


@router.get("/{slug}")
def get_post(slug: str):
    with get_conn() as conn:
        row = conn.execute("SELECT * FROM posts WHERE slug = ?", (slug,)).fetchone()
        if not row:
            raise HTTPException(404, f"Post '{slug}' not found")

        # kind: 'body' (thân bài) | 'related' (khối "Bài viết liên quan"); position chỉ có ở related
        outbound = conn.execute("""
            SELECT il.to_slug, il.anchor, il.kind, il.position, p.headline, p.article_section
            FROM internal_links il
            LEFT JOIN posts p ON p.slug = il.to_slug
            WHERE il.from_slug = ?
            ORDER BY il.kind, il.position, il.id
        """, (slug,)).fetchall()

        inbound = conn.execute("""
            SELECT il.from_slug, il.anchor, il.kind, il.position, p.headline, p.article_section
            FROM internal_links il
            LEFT JOIN posts p ON p.slug = il.from_slug
            WHERE il.to_slug = ?
            ORDER BY il.kind, il.id
        """, (slug,)).fetchall()

    post = row_to_dict(row)
    post["outbound_links"] = [dict(r) for r in outbound]
    post["inbound_links"]  = [dict(r) for r in inbound]
    # Explicit parse in case row_to_dict didn't run on this field
    if isinstance(post.get("products"), str):
        try:
            post["products"] = json.loads(post["products"])
        except Exception:
            post["products"] = []
    return post


@router.post("/{slug}/recrawl")
def recrawl_post(slug: str):
    """Nạp lại 1 bài từ MCP server (get_post) → posts_md → DB."""
    with get_conn() as conn:
        row = conn.execute("SELECT products FROM posts WHERE slug = ?", (slug,)).fetchone()
        lookup = load_product_lookup(conn)   # khóa theo site_id (ID MỚI của site) + slug
        old_related = _db_related(conn)
    if not row:
        raise HTTPException(404, "Post not found")

    try:
        from crawl_posts import mcp_post_parts, mcp_post_to_md, BASE_DOMAIN
        from backend import mcp_client
        from backend.import_posts import import_file
    except ImportError as e:
        raise HTTPException(500, f"Import error: {e}")

    try:
        post = mcp_client.get_post(slug)
    except mcp_client.MCPToolError:
        raise HTTPException(404, "Bài không còn trên MCP (đã gỡ hoặc chuyển nháp)")
    except mcp_client.MCPError as e:
        raise HTTPException(502, f"MCP error: {e}")

    try:
        old_products = json.loads(row["products"] or "[]")
    except Exception:
        old_products = None
    parts = mcp_post_parts(post, lookup, old_products, mcp_client.make_product_resolver())
    # MCP không trả khối "Bài viết liên quan" → tải HTML live; lỗi tải → giữ related cũ (không làm hỏng bài)
    rel_job = {"related_failed": [], "no_related": []}
    parts["related_links"] = _apply_live_related(rel_job, slug, f"https://{BASE_DOMAIN}/{slug}.html", old_related)
    md = mcp_post_to_md(post, parts)
    out_path = PROJECT_ROOT / "posts_md" / f"{slug}.md"
    out_path.write_text(md, encoding="utf-8")

    with get_conn() as conn:
        import_file(out_path, conn)   # thay body + related theo từng loại; md không có related_links thì giữ related hiện có

    related_status = "failed" if rel_job["related_failed"] else ("no_related" if rel_job["no_related"] else "ok")
    return {"ok": True, "slug": slug, "products": len(parts["products"]), "links": len(parts["internal_links"]),
            "related": len(parts["related_links"] or []), "related_status": related_status,
            **({"related_error": rel_job["related_failed"][0]["error"]} if rel_job["related_failed"] else {})}


_SITE = "https://knxstore.vn"


def _abs_url(u: str) -> str:
    u = (u or "").strip()
    if u.startswith("//"):
        return "https:" + u
    if u.startswith("/"):
        return _SITE + u
    return u


def _absolutize(soup: BeautifulSoup) -> None:
    """contentHtml dùng đường dẫn tương đối (/media/..., /<slug>.html): UI chạy ở localhost nên phải tuyệt đối hoá."""
    for tag in soup.find_all(True):
        for attr in ("src", "href", "poster", "data-src"):
            if tag.get(attr):
                tag[attr] = _abs_url(tag[attr])
        if tag.get("srcset"):
            parts = []
            for cand in tag["srcset"].split(","):
                bits = cand.strip().split(None, 1)
                if bits:
                    parts.append(" ".join([_abs_url(bits[0])] + bits[1:]))
            tag["srcset"] = ", ".join(parts)
        if tag.name == "a" and tag.get("href", "").startswith("http"):
            tag["target"] = "_blank"
            tag["rel"] = "noopener"


@router.get("/{slug}/html")
def get_post_html(slug: str):
    """Toàn văn bài viết để hiển thị: contentHtml (MCP get_post) + card sản phẩm (giải shortcode) + FAQ.
    Trước đây tải trang live rồi chọn .main-content/main/article — template mới trả nhầm card sản phẩm."""
    import html as _html
    from crawl_posts import MCP_PRODUCTS_SHORTCODE
    from backend.mcp_client import get_post as mcp_get_post, make_product_resolver

    with get_conn() as conn:
        row = conn.execute("SELECT slug FROM posts WHERE slug = ?", (slug,)).fetchone()
        lookup = load_product_lookup(conn)
    if not row:
        raise HTTPException(404, f"Post '{slug}' not found")

    try:
        post = mcp_get_post(slug)
    except Exception as e:  # không đưa chi tiết lỗi gốc ra ngoài (tránh lộ cấu hình/token)
        raise HTTPException(502, f"Không lấy được bài từ MCP ({type(e).__name__})")

    resolver = make_product_resolver()

    def expand(m):
        chips = []
        for tok in (t.strip().strip("\"'") for t in m.group(1).split(",")):
            if not tok:
                continue
            entry = lookup.get(int(tok) if tok.isdigit() else tok) or resolver(tok)
            if entry:
                label = _html.escape(entry.get("name") or entry["url"])
                chips.append(f'<a href="{_html.escape(entry["url"])}" style="display:inline-block;margin:2px 6px 2px 0;'
                             f'padding:3px 9px;border:1px solid var(--border);border-radius:12px;font-size:12px;'
                             f'color:#f97316;text-decoration:none">◆ {label}</a>')
            else:
                chips.append(f'<span style="display:inline-block;margin:2px 6px 2px 0;font-size:11px;color:var(--text-subtle)" '
                             f'title="Sản phẩm không còn trên site">(không có SP: {_html.escape(tok)})</span>')
        return '<div class="product-chips" style="margin:10px 0">' + "".join(chips) + "</div>"

    body = MCP_PRODUCTS_SHORTCODE.sub(expand, post.get("contentHtml") or "")

    faq_html = ""
    faqs = sorted([f for f in (post.get("faqs") or []) if isinstance(f, dict)], key=lambda f: f.get("position") or 0)
    if faqs:
        items = []
        for f in faqs:
            q = _html.escape(" ".join(str(f.get("question") or "").split()))
            a = str(f.get("answer") or "")
            a = a if "<" in a else f"<p>{_html.escape(a)}</p>"
            items.append(f"<h3>{q}</h3>{a}")
        faq_html = "<h2>Câu hỏi thường gặp</h2>" + "".join(items)

    soup = BeautifulSoup(body + faq_html, "html.parser")
    for tag in soup.find_all(["script", "style", "iframe", "object", "embed"]):
        tag.decompose()
    _absolutize(soup)

    return {"html": str(soup), "source": "mcp", "edited_at": post.get("editedAt")}
