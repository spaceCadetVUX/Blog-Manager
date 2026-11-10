"""SEO audit — phát hiện issues trên toàn bộ corpus."""

import json
import urllib.error
import urllib.request
from concurrent.futures import ThreadPoolExecutor
from fastapi import APIRouter
from backend.db import get_conn

router = APIRouter(prefix="/audit", tags=["audit"])


class _NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, *a, **kw):
        return None  # giữ nguyên 3xx để đọc Location


_opener = urllib.request.build_opener(_NoRedirect)
_UA = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"}


def _probe(url: str) -> dict:
    """HEAD (fallback GET) không follow redirect → {status, redirect_to}."""
    for method in ("HEAD", "GET"):
        try:
            req = urllib.request.Request(url, headers=_UA, method=method)
            with _opener.open(req, timeout=15) as r:
                return {"status": r.status, "redirect_to": ""}
        except urllib.error.HTTPError as e:
            if e.code == 405 and method == "HEAD":
                continue
            return {"status": e.code, "redirect_to": e.headers.get("Location", "") or ""}
        except Exception as e:  # timeout, DNS...
            return {"status": 0, "redirect_to": "", "error": str(e)[:120]}
    return {"status": 0, "redirect_to": ""}


@router.get("/link-check")
def link_check():
    """Kiểm tra HTTP thật cho mọi link đích trong internal_links (live knxstore.vn), CẢ HAI loại: kind='body'
    (thân bài) và 'related' (khối "Bài viết liên quan") — mỗi mục linked_from ghi rõ `kind`.
    Trả các link đích không phải 200: 3xx (redirect), 4xx/5xx (chết), 0 (lỗi mạng).
    Chậm (~hàng trăm request, song song 8) — gọi chủ động, không nằm trong /audit."""
    with get_conn() as conn:
        urls = {r["slug"]: r["url"] for r in conn.execute("SELECT slug, url FROM posts")}
        rows = conn.execute("""
            SELECT to_slug, from_slug, anchor, kind FROM internal_links ORDER BY to_slug, kind, from_slug
        """).fetchall()

    by_target: dict[str, list[dict]] = {}
    for r in rows:
        by_target.setdefault(r["to_slug"], []).append(
            {"from_slug": r["from_slug"], "anchor": r["anchor"] or "", "kind": r["kind"]}
        )

    def target_url(slug: str) -> str:
        return urls.get(slug) or f"https://knxstore.vn/{slug}.html"

    with ThreadPoolExecutor(max_workers=8) as ex:
        results = dict(zip(by_target, ex.map(lambda s: _probe(target_url(s)), by_target)))

    bad = []
    for slug, res in results.items():
        if res["status"] == 200:
            continue
        bad.append({
            "to_slug": slug,
            "url": target_url(slug),
            "status": res["status"],
            "redirect_to": res.get("redirect_to", ""),
            "in_posts_db": slug in urls,
            "linked_from": by_target[slug],
        })
    bad.sort(key=lambda x: (-len(x["linked_from"]), x["to_slug"]))
    return {"checked": len(results), "problems": len(bad), "items": bad}


@router.get("")
def get_audit():
    with get_conn() as conn:
        posts = conn.execute("SELECT * FROM posts").fetchall()
        # inbound/outbound mặc định = chỉ link thân bài (kind='body'); related đếm riêng
        link_counts = {
            r["slug"]: r["cnt"]
            for r in conn.execute("""
                SELECT to_slug AS slug, COUNT(*) AS cnt
                FROM internal_links WHERE kind = 'body' GROUP BY to_slug
            """).fetchall()
        }
        related_in_counts = {
            r["slug"]: r["cnt"]
            for r in conn.execute("""
                SELECT to_slug AS slug, COUNT(*) AS cnt
                FROM internal_links WHERE kind = 'related' GROUP BY to_slug
            """).fetchall()
        }
        outbound_counts = {
            r["slug"]: r["cnt"]
            for r in conn.execute("""
                SELECT from_slug AS slug, COUNT(*) AS cnt
                FROM internal_links WHERE kind = 'body' GROUP BY from_slug
            """).fetchall()
        }
        # Broken internal links (cả body lẫn related, ghi rõ kind): to_slug không tồn tại trong posts
        broken_rows = conn.execute("""
            SELECT il.from_slug, il.to_slug, il.anchor, il.kind,
                   p.headline AS from_headline
            FROM internal_links il
            LEFT JOIN posts p ON p.slug = il.from_slug
            WHERE il.to_slug NOT IN (SELECT slug FROM posts)
            ORDER BY il.from_slug, il.kind
        """).fetchall()

        stale_6m = conn.execute("""
            SELECT slug, headline, date_modified, url, image, description FROM posts
            WHERE date_modified != '' AND date_modified IS NOT NULL
            AND date_modified < date('now', '-6 months')
            ORDER BY date_modified ASC
        """).fetchall()

        stale_1y = conn.execute("""
            SELECT slug, headline, date_modified, url, image, description FROM posts
            WHERE date_modified != '' AND date_modified IS NOT NULL
            AND date_modified < date('now', '-12 months')
            ORDER BY date_modified ASC
        """).fetchall()

    broken_links = [dict(r) for r in broken_rows]

    issues = {
        "broken_links":         broken_links,
        "orphan_posts":         [],  # 0 inbound link THÂN BÀI (kind='body'); vẫn có thể được link từ khối related
        "orphan_true":          [],  # 0 inbound body VÀ 0 inbound related (không bài nào trỏ tới)
        "no_outbound":          [],  # 0 outbound link thân bài
        "short_description":    [],  # description < 50 chars
        "long_description":     [],  # description > 160 chars
        "short_title":          [],  # headline < 30 chars
        "long_title":           [],  # headline > 70 chars
        "no_keywords":          [],  # keywords rỗng
        "low_word_count":       [],  # < 300 words
        "missing_section":      [],  # articleSection rỗng
        "stale_6m":             [{"slug": r["slug"], "headline": (r["headline"] or "")[:80], "date_modified": r["date_modified"], "url": r["url"] or "", "image": r["image"] or "", "description": (r["description"] or "")[:200]} for r in stale_6m],
        "stale_1y":             [{"slug": r["slug"], "headline": (r["headline"] or "")[:80], "date_modified": r["date_modified"], "url": r["url"] or "", "image": r["image"] or "", "description": (r["description"] or "")[:200]} for r in stale_1y],
    }

    for row in posts:
        p = dict(row)
        slug = p["slug"]
        headline = p.get("headline") or ""
        description = p.get("description") or ""
        keywords = json.loads(p.get("keywords") or "[]")
        word_count = p.get("word_count") or 0
        section = p.get("article_section") or ""

        item = {
            "slug": slug,
            "headline": headline[:80],
            "url": p.get("url") or "",
            "image": p.get("image") or "",
            "description": description[:200] if description else "",
            "article_section": section,
            "inbound": link_counts.get(slug, 0),
            "inbound_related": related_in_counts.get(slug, 0),
        }

        if link_counts.get(slug, 0) == 0:
            issues["orphan_posts"].append(item)
            if related_in_counts.get(slug, 0) == 0:
                issues["orphan_true"].append(item)
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
