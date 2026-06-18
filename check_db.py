from backend.db import get_conn
with get_conn() as conn:
    posts = conn.execute("SELECT COUNT(*) FROM posts").fetchone()[0]
    links = conn.execute("SELECT COUNT(*) FROM internal_links").fetchone()[0]
    sections = conn.execute(
        "SELECT article_section, COUNT(*) c FROM posts WHERE article_section != '' GROUP BY article_section ORDER BY c DESC"
    ).fetchall()
    print(f"Posts: {posts} | Internal links: {links}")
    print("Sections:")
    for r in sections:
        print(f"  {r[0]}: {r[1]}")
