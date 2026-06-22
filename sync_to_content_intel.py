"""
Đọc toàn bộ bài viết từ blog.db → POST vào content-intel /ci/inventory/import
Chạy: python sync_to_content_intel.py
"""
import sqlite3, json, requests, sys

BLOG_DB   = "blog.db"
CI_URL    = "http://localhost:5173/ci/inventory/import"  # qua Vite proxy
BATCH     = 500  # gửi 1 lần (API nhận file, nên gom hết)

def main():
    conn = sqlite3.connect(BLOG_DB)
    conn.row_factory = sqlite3.Row
    cur = conn.cursor()

    cur.execute("""
        SELECT
            url,
            slug,
            headline        AS title,
            description     AS meta_desc,
            date_modified   AS lastmod,
            article_section AS category,
            keywords        AS tags,
            'published'     AS status
        FROM posts
        WHERE url IS NOT NULL AND url != ''
        ORDER BY date_modified DESC
    """)

    rows = []
    for r in cur.fetchall():
        d = dict(r)
        # tags: blog.db lưu JSON array string hoặc plain text
        tags = d.get("tags") or "[]"
        try:
            parsed = json.loads(tags)
            d["tags"] = json.dumps(parsed if isinstance(parsed, list) else [str(parsed)])
        except Exception:
            d["tags"] = json.dumps([t.strip() for t in str(tags).split(",") if t.strip()])
        rows.append(d)

    conn.close()

    if not rows:
        print("Không có bài viết nào trong blog.db")
        sys.exit(0)

    print(f"Tìm thấy {len(rows)} bài viết → gửi lên content-intel...")

    payload = json.dumps(rows, ensure_ascii=False).encode("utf-8")
    resp = requests.post(
        CI_URL,
        files={"file": ("posts.json", payload, "application/json")},
        timeout=30,
    )

    if resp.ok:
        data = resp.json()
        print(f"✓ Imported: {data.get('upserted')} bài")
        if data.get("errors"):
            print(f"  Lỗi: {data['errors'][:5]}")
    else:
        print(f"✕ Lỗi {resp.status_code}: {resp.text[:300]}")

if __name__ == "__main__":
    main()
