import json
import httpx
from bs4 import BeautifulSoup
from fastapi import APIRouter, Query, HTTPException
from backend.db import get_conn

router = APIRouter(prefix="/posts", tags=["posts"])


def row_to_dict(row) -> dict:
    d = dict(row)
    for field in ("keywords", "mentions", "breadcrumb"):
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
    return post


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
