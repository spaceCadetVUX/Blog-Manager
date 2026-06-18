"""
Graph endpoint — trả data cho React Flow.
Node size = inbound link count (link juice).
Node color = articleSection.
"""

import json
from fastapi import APIRouter, Query
from backend.db import get_conn

router = APIRouter(prefix="/graph", tags=["graph"])

SECTION_COLORS = {
    "Kiến thức":   "#6366f1",
    "Matter":      "#8b5cf6",
    "Casambi":     "#06b6d4",
    "Chiếu sáng":  "#f59e0b",
    "DALI":        "#10b981",
    "KNX":         "#3b82f6",
    "HVAC":        "#ef4444",
    "Smarthome":   "#ec4899",
}
DEFAULT_COLOR = "#94a3b8"


@router.get("")
def get_graph(
    section: str = Query("", description="Filter nodes by section"),
    min_links: int = Query(0, description="Chỉ lấy node có inbound >= min_links"),
):
    with get_conn() as conn:
        # Lấy tất cả posts với inbound/outbound count
        post_rows = conn.execute("""
            SELECT
                p.slug, p.headline, p.article_section, p.url,
                p.word_count, p.date_modified,
                COUNT(DISTINCT li.from_slug) AS inbound,
                COUNT(DISTINCT lo.to_slug)   AS outbound
            FROM posts p
            LEFT JOIN internal_links li ON li.to_slug   = p.slug
            LEFT JOIN internal_links lo ON lo.from_slug = p.slug
            GROUP BY p.slug
        """).fetchall()

        link_rows = conn.execute("""
            SELECT from_slug, to_slug, anchor FROM internal_links
        """).fetchall()

    # Build node set — filter nếu có
    all_slugs = {r["slug"] for r in post_rows}

    nodes = []
    node_slugs = set()
    for r in post_rows:
        sec = r["article_section"] or ""
        if section and sec != section:
            continue
        if r["inbound"] < min_links:
            continue

        node_slugs.add(r["slug"])
        nodes.append({
            "id":   r["slug"],
            "type": "postNode",
            "data": {
                "label":    r["headline"] or r["slug"],
                "section":  sec,
                "url":      r["url"] or "",
                "wordCount": r["word_count"] or 0,
                "inbound":  r["inbound"],
                "outbound": r["outbound"],
                "color":    SECTION_COLORS.get(sec, DEFAULT_COLOR),
                "dateModified": r["date_modified"] or "",
            },
            "position": {"x": 0, "y": 0},  # React Flow layout tự tính
        })

    # Chỉ lấy edges giữa các node trong filter
    edges = []
    for r in link_rows:
        src, tgt = r["from_slug"], r["to_slug"]
        if src not in node_slugs or tgt not in node_slugs:
            continue
        if tgt not in all_slugs:
            continue
        edges.append({
            "id":     f"{src}__{tgt}",
            "source": src,
            "target": tgt,
            "label":  r["anchor"] or "",
            "data":   {"anchor": r["anchor"] or ""},
        })

    return {
        "nodes": nodes,
        "edges": edges,
        "meta": {
            "totalNodes": len(nodes),
            "totalEdges": len(edges),
            "sections": list(SECTION_COLORS.keys()),
        },
    }
