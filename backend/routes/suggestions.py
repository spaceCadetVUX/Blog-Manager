from fastapi import APIRouter
from backend.db import get_conn

router = APIRouter(prefix="/suggestions", tags=["suggestions"])

@router.get("")
def get_suggestions():
    with get_conn() as conn:
        # Posts that have no inbound BODY links (orphans, kind='body') grouped with same-section posts that could link to them
        # (link ở khối "Bài viết liên quan" là kind='related', tách riêng, không tính ở đây)
        rows = conn.execute("""
            SELECT
                linker.slug        AS from_slug,
                linker.headline    AS from_headline,
                orphan.slug        AS to_slug,
                orphan.headline    AS to_headline,
                orphan.article_section AS section
            FROM posts orphan
            JOIN posts linker
                ON  linker.article_section = orphan.article_section
                AND linker.slug != orphan.slug
            WHERE orphan.article_section != ''
            AND NOT EXISTS (
                SELECT 1 FROM internal_links WHERE to_slug = orphan.slug AND kind = 'body'
            )
            AND NOT EXISTS (
                SELECT 1 FROM internal_links
                WHERE from_slug = linker.slug AND to_slug = orphan.slug AND kind = 'body'
            )
            ORDER BY orphan.article_section, orphan.slug
            LIMIT 200
        """).fetchall()
    return [dict(r) for r in rows]
