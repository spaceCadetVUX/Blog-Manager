"""SEO audit — phát hiện issues trên toàn bộ corpus."""

import json
from fastapi import APIRouter
from backend.db import get_conn

router = APIRouter(prefix="/audit", tags=["audit"])


@router.get("")
def get_audit():
    with get_conn() as conn:
        posts = conn.execute("SELECT * FROM posts").fetchall()
        link_counts = {
            r["slug"]: r["cnt"]
            for r in conn.execute("""
                SELECT to_slug AS slug, COUNT(*) AS cnt
                FROM internal_links GROUP BY to_slug
            """).fetchall()
        }
        outbound_counts = {
            r["slug"]: r["cnt"]
            for r in conn.execute("""
                SELECT from_slug AS slug, COUNT(*) AS cnt
                FROM internal_links GROUP BY from_slug
            """).fetchall()
        }

    issues = {
        "orphan_posts":         [],  # 0 inbound links
        "no_outbound":          [],  # 0 outbound links
        "short_description":    [],  # description < 50 chars
        "long_description":     [],  # description > 160 chars
        "short_title":          [],  # headline < 30 chars
        "long_title":           [],  # headline > 70 chars
        "no_keywords":          [],  # keywords rỗng
        "low_word_count":       [],  # < 300 words
        "missing_section":      [],  # articleSection rỗng
    }

    for row in posts:
        p = dict(row)
        slug = p["slug"]
        headline = p.get("headline") or ""
        description = p.get("description") or ""
        keywords = json.loads(p.get("keywords") or "[]")
        word_count = p.get("word_count") or 0
        section = p.get("article_section") or ""

        item = {"slug": slug, "headline": headline[:80]}

        if link_counts.get(slug, 0) == 0:
            issues["orphan_posts"].append(item)
        if outbound_counts.get(slug, 0) == 0:
            issues["no_outbound"].append(item)
        if description and len(description) < 50:
            issues["short_description"].append({**item, "len": len(description)})
        if len(description) > 160:
            issues["long_description"].append({**item, "len": len(description)})
        if headline and len(headline) < 30:
            issues["short_title"].append({**item, "len": len(headline)})
        if len(headline) > 70:
            issues["long_title"].append({**item, "len": len(headline)})
        if not keywords:
            issues["no_keywords"].append(item)
        if word_count < 300:
            issues["low_word_count"].append({**item, "word_count": word_count})
        if not section:
            issues["missing_section"].append(item)

    return {
        "summary": {k: len(v) for k, v in issues.items()},
        "issues": issues,
    }
