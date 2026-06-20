import json
import sys
from pathlib import Path
import httpx
from bs4 import BeautifulSoup
from fastapi import APIRouter, Query, HTTPException
from backend.db import get_conn

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

    sql = f"""
        SELECT
            p.*,
            COUNT(DISTINCT li.from_slug) AS inbound,
            COUNT(DISTINCT lo.to_slug)   AS outbound
        FROM posts p
        LEFT JOIN internal_links li ON li.to_slug   = p.slug
        LEFT JOIN internal_links lo ON lo.from_slug = p.slug
        {where_sql}
        GROUP BY p.id
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

        outbound = conn.execute("""
            SELECT il.to_slug, il.anchor, p.headline, p.article_section
            FROM internal_links il
            LEFT JOIN posts p ON p.slug = il.to_slug
            WHERE il.from_slug = ?
        """, (slug,)).fetchall()

        inbound = conn.execute("""
            SELECT il.from_slug, il.anchor, p.headline, p.article_section
            FROM internal_links il
            LEFT JOIN posts p ON p.slug = il.from_slug
            WHERE il.to_slug = ?
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
    with get_conn() as conn:
        row = conn.execute("SELECT url FROM posts WHERE slug = ?", (slug,)).fetchone()
    if not row or not row["url"]:
        raise HTTPException(404, "Post not found")

    url = row["url"]
    try:
        from crawl_posts import (
            fetch_html, extract_jsonld, extract_meta_tags,
            find_article_jsonld, extract_internal_links, extract_product_links,
            jsonld_to_md,
        )
        from backend.import_posts import import_file
    except ImportError as e:
        raise HTTPException(500, f"Import error: {e}")

    html = fetch_html(url)
    if not html:
        raise HTTPException(502, "Fetch failed")

    all_jsonld = extract_jsonld(html)
    meta       = extract_meta_tags(html)
    article, webpage = find_article_jsonld(all_jsonld)
    internal_links   = extract_internal_links(html, url)
    product_links    = extract_product_links(html)

    if not article:
        article = {}

    md = jsonld_to_md(url, "", article, meta, all_jsonld, webpage, internal_links, product_links)
    out_path = PROJECT_ROOT / "posts_md" / f"{slug}.md"
    out_path.write_text(md, encoding="utf-8")

    with get_conn() as conn:
        conn.execute("DELETE FROM internal_links WHERE from_slug = ?", (slug,))
        import_file(out_path, conn)

    return {"ok": True, "slug": slug, "products": len(product_links), "links": len(internal_links)}


@router.get("/{slug}/html")
def get_post_html(slug: str):
    with get_conn() as conn:
        row = conn.execute("SELECT url FROM posts WHERE slug = ?", (slug,)).fetchone()
    if not row or not row["url"]:
        raise HTTPException(404, "URL not found")

    try:
        r = httpx.get(row["url"], timeout=10, follow_redirects=True,
                      headers={"User-Agent": "Mozilla/5.0 (compatible; KNXStoreSEO/1.0)"})
        r.raise_for_status()
    except Exception as e:
        raise HTTPException(502, f"Fetch failed: {e}")

    soup = BeautifulSoup(r.text, "html.parser")

    # Xóa nav, footer, sidebar, script, style khỏi kết quả
    for tag in soup.select("script, style, nav, footer, header, .sidebar, .widget, .related-posts, .comments, [class*='swiper'], [class*='breadcrumb']"):
        tag.decompose()

    content = soup.select_one(".main-content") or soup.select_one("main") or soup.select_one("article")
    if not content:
        raise HTTPException(422, "Không tìm thấy nội dung bài viết")

    return {"html": str(content)}
