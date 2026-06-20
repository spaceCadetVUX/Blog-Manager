"""
Parse tất cả .md trong posts_md/ → SQLite.
Chạy: python backend/import_posts.py
"""

import json
import re
import sys
from pathlib import Path

import frontmatter  # python-frontmatter

sys.path.insert(0, str(Path(__file__).parent.parent))
from backend.db import get_conn, init_db

POSTS_DIR = Path(__file__).parent.parent / "posts_md"


def slug_from_path(p: Path) -> str:
    return p.stem


def to_json(val) -> str:
    if isinstance(val, (list, dict)):
        return json.dumps(val, ensure_ascii=False)
    if isinstance(val, str):
        # Đã là JSON string
        try:
            json.loads(val)
            return val
        except Exception:
            return json.dumps([val], ensure_ascii=False)
    return "[]"


def import_file(path: Path, conn) -> bool:
    try:
        post = frontmatter.load(str(path))
    except Exception as e:
        print(f"  [WARN] Parse lỗi {path.name}: {e}")
        return False

    meta = post.metadata
    slug = slug_from_path(path)

    # Lấy article_body từ content (phần sau frontmatter)
    body_match = re.search(r"## Article Body\n+(.*?)(?:\n## |\Z)", post.content, re.DOTALL)
    article_body = body_match.group(1).strip() if body_match else ""

    conn.execute("""
        INSERT INTO posts
            (slug, url, headline, description, image,
             date_published, date_modified, author, publisher,
             article_section, word_count, keywords, mentions,
             breadcrumb, article_body, robots, products, updated_at)
        VALUES
            (:slug, :url, :headline, :description, :image,
             :date_published, :date_modified, :author, :publisher,
             :article_section, :word_count, :keywords, :mentions,
             :breadcrumb, :article_body, :robots, :products, CURRENT_TIMESTAMP)
        ON CONFLICT(slug) DO UPDATE SET
            url             = excluded.url,
            headline        = excluded.headline,
            description     = excluded.description,
            image           = excluded.image,
            date_published  = excluded.date_published,
            date_modified   = excluded.date_modified,
            author          = excluded.author,
            publisher       = excluded.publisher,
            article_section = excluded.article_section,
            word_count      = excluded.word_count,
            keywords        = excluded.keywords,
            mentions        = excluded.mentions,
            breadcrumb      = excluded.breadcrumb,
            article_body    = excluded.article_body,
            robots          = excluded.robots,
            products        = excluded.products,
            updated_at      = CURRENT_TIMESTAMP
    """, {
        "slug":            slug,
        "url":             meta.get("url", ""),
        "headline":        meta.get("headline", ""),
        "description":     meta.get("description", ""),
        "image":           meta.get("image", ""),
        "date_published":  meta.get("datePublished", ""),
        "date_modified":   meta.get("dateModified", ""),
        "author":          meta.get("author", ""),
        "publisher":       meta.get("publisher", ""),
        "article_section": meta.get("articleSection", ""),
        "word_count":      meta.get("word_count", 0) or 0,
        "keywords":        to_json(meta.get("keywords", [])),
        "mentions":        to_json(meta.get("mentions", [])),
        "breadcrumb":      to_json(meta.get("breadcrumb", [])),
        "article_body":    article_body,
        "robots":          meta.get("robots", ""),
        "products":        to_json(meta.get("products", [])),
    })

    # Internal links
    links = meta.get("internal_links", []) or []
    for lnk in links:
        if not isinstance(lnk, dict):
            continue
        to_slug = lnk.get("slug", "")
        if not to_slug:
            continue
        conn.execute("""
            INSERT INTO internal_links (from_slug, to_slug, anchor)
            VALUES (?, ?, ?)
            ON CONFLICT(from_slug, to_slug) DO UPDATE SET anchor = excluded.anchor
        """, (slug, to_slug, lnk.get("anchor", "")))

    return True


def run(posts_dir: Path = POSTS_DIR):
    init_db()
    files = sorted(posts_dir.glob("*.md"))
    total = len(files)
    print(f"Import {total} files từ {posts_dir}\n")

    ok = fail = 0
    with get_conn() as conn:
        for i, f in enumerate(files, 1):
            success = import_file(f, conn)
            status = "OK" if success else "FAIL"
            if success:
                ok += 1
            else:
                fail += 1
            if i % 50 == 0 or i == total:
                print(f"  [{i}/{total}] {status}  {f.name}")

    print(f"\n=== DONE: {ok} OK | {fail} FAIL ===")


if __name__ == "__main__":
    run()
