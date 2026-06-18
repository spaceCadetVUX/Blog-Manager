from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
load_dotenv()

from backend.db import init_db
from backend.routes.posts import router as posts_router
from backend.routes.graph import router as graph_router
from backend.routes.audit import router as audit_router
from backend.routes.crawl import router as crawl_router
from backend.routes.suggestions import router as suggestions_router
from backend.routes.ai import router as ai_router

app = FastAPI(title="KNXStore Blog SEO API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(posts_router)
app.include_router(graph_router)
app.include_router(audit_router)
app.include_router(crawl_router)
app.include_router(suggestions_router)
app.include_router(ai_router)


@app.on_event("startup")
def startup():
    init_db()


@app.get("/stats")
def stats():
    from backend.db import get_conn
    with get_conn() as conn:
        total_posts   = conn.execute("SELECT COUNT(*) FROM posts").fetchone()[0]
        total_links   = conn.execute("SELECT COUNT(*) FROM internal_links").fetchone()[0]
        sections      = conn.execute("""
            SELECT article_section, COUNT(*) c FROM posts
            WHERE article_section != '' GROUP BY article_section ORDER BY c DESC
        """).fetchall()
        avg_wc        = conn.execute("SELECT AVG(word_count) FROM posts WHERE word_count > 0").fetchone()[0]
        orphans       = conn.execute("""
            SELECT COUNT(*) FROM posts p
            WHERE NOT EXISTS (SELECT 1 FROM internal_links WHERE to_slug = p.slug)
        """).fetchone()[0]
        no_outbound   = conn.execute("""
            SELECT COUNT(*) FROM posts p
            WHERE NOT EXISTS (SELECT 1 FROM internal_links WHERE from_slug = p.slug)
        """).fetchone()[0]
        top_linked    = conn.execute("""
            SELECT p.slug, p.headline, p.article_section,
                   COUNT(il.from_slug) AS inbound
            FROM posts p
            LEFT JOIN internal_links il ON il.to_slug = p.slug
            GROUP BY p.id
            ORDER BY inbound DESC
            LIMIT 10
        """).fetchall()
        avg_inbound   = conn.execute("""
            SELECT AVG(cnt) FROM (
                SELECT COUNT(*) cnt FROM internal_links GROUP BY to_slug
            )
        """).fetchone()[0]

    return {
        "total_posts":    total_posts,
        "total_links":    total_links,
        "avg_word_count": round(avg_wc or 0),
        "orphan_posts":   orphans,
        "no_outbound":    no_outbound,
        "avg_inbound":    round(avg_inbound or 0, 1),
        "sections":       [dict(r) for r in sections],
        "top_linked":     [dict(r) for r in top_linked],
    }
