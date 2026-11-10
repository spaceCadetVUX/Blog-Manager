"""
Graph endpoint — trả data cho React Flow.
Node size = inbound link count (link juice).
Node color = articleSection.
"""

import json
from fastapi import APIRouter, HTTPException, Query
from backend.db import get_conn

router = APIRouter(prefix="/graph", tags=["graph"])

SECTION_COLORS = {
    "Kiến thức":  "#a78bfa",  # violet-400
    "Matter":     "#e879f9",  # fuchsia-400
    "Casambi":    "#38bdf8",  # sky-400
    "Chiếu sáng": "#fbbf24",  # amber-400
    "DALI":       "#34d399",  # emerald-400
    "KNX":        "#60a5fa",  # blue-400
    "HVAC":       "#f87171",  # red-400
    "Smarthome":  "#f472b6",  # pink-400
    "An ninh":    "#fb923c",  # orange-400
    "Cảm biến":   "#22d3ee",  # cyan-400
    "Driver LED": "#a3e635",  # lime-400
    "Tin tức":    "#94a3b8",  # slate-400
    "Hướng dẫn":  "#c084fc",  # purple-400
    "News":       "#9ca3af",  # gray-400
    "Dự án":      "#2dd4bf",  # teal-400
}
DEFAULT_COLOR = "#94a3b8"


@router.get("")
def get_graph(
    section: str = Query("", description="Filter nodes by section"),
    min_links: int = Query(0, description="Chỉ lấy node có inbound >= min_links"),
    show_products: bool = Query(False, description="Hiện product nodes"),
    kind: str = Query("body", description="Loại link: body (thân bài, mặc định) | related (khối Bài viết liên quan) | all"),
):
    if kind not in ("body", "related", "all"):
        raise HTTPException(422, "kind phải là 'body', 'related' hoặc 'all'")
    # inbound/outbound của node và min_links tính theo `kind` đã chọn (all = cả hai loại, đếm distinct bài)
    kind_sql = "" if kind == "all" else "AND kind = :kind"
    with get_conn() as conn:
        post_rows = conn.execute(f"""
            SELECT
                p.slug, p.headline, p.article_section, p.url,
                p.word_count, p.date_modified, p.author, p.products,
                (SELECT COUNT(DISTINCT from_slug) FROM internal_links WHERE to_slug   = p.slug {kind_sql}) AS inbound,
                (SELECT COUNT(DISTINCT to_slug)   FROM internal_links WHERE from_slug = p.slug {kind_sql}) AS outbound
            FROM posts p
        """, {"kind": kind}).fetchall()

        link_rows = conn.execute(f"""
            SELECT from_slug, to_slug, anchor, kind, position FROM internal_links
            WHERE 1 = 1 {kind_sql}
            ORDER BY from_slug, kind, position, id
        """, {"kind": kind}).fetchall()

    all_slugs = {r["slug"] for r in post_rows}

    nodes = []
    node_slugs = set()
    for r in post_rows:
        sec = r["article_section"] or ""
        if section and sec != section:
            continue
        if r["inbound"] < min_links:
            continue

        try:
            import json as _j
            _prods = _j.loads(r["products"] or "[]")
            has_products = len(_prods) > 0
            products_count = len(_prods)
        except Exception:
            has_products = False
            products_count = 0

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
                "author": r["author"] or "",
                "hasProducts": has_products,
                "productsCount": products_count,
            },
            "position": {"x": 0, "y": 0},
        })

    edges = []
    for r in link_rows:
        src, tgt = r["from_slug"], r["to_slug"]
        if src not in node_slugs or tgt not in node_slugs:
            continue
        if tgt not in all_slugs:
            continue
        edges.append({
            # id có kind để cặp (src,tgt) vừa body vừa related cho 2 edge khác nhau (kind=all)
            "id":     f"{src}__{tgt}" if r["kind"] == "body" else f"{src}__{tgt}__{r['kind']}",
            "source": src,
            "target": tgt,
            "label":  r["anchor"] or "",
            "data":   {"anchor": r["anchor"] or "", "kind": r["kind"]},
        })

    # Product nodes
    if show_products:
        import json as _json
        product_map: dict[str, dict] = {}  # handle → {name, url, posts_count}
        post_product_edges = []

        for r in post_rows:
            if r["slug"] not in node_slugs:
                continue
            try:
                products = _json.loads(r["products"] or "[]")
            except Exception:
                continue
            for p in products:
                purl = p.get("url", "")
                if not purl or "/products/" not in purl:
                    continue
                handle = "prod__" + purl.split("/products/")[-1]
                if handle not in product_map:
                    product_map[handle] = {
                        "name":  p.get("name", handle),
                        "url":   purl,
                        "image": p.get("image", ""),
                        "count": 0,
                    }
                product_map[handle]["count"] += 1
                post_product_edges.append({
                    "id":     f"{r['slug']}__{handle}",
                    "source": r["slug"],
                    "target": handle,
                    "data":   {"anchor": "", "isProduct": True},
                })

        for handle, info in product_map.items():
            nodes.append({
                "id":   handle,
                "type": "productNode",
                "data": {
                    "label":   info["name"],
                    "url":     info["url"],
                    "image":   info["image"],
                    "inbound": info["count"],
                    "color":   "#f97316",
                },
                "position": {"x": 0, "y": 0},
            })
        edges.extend(post_product_edges)

    return {
        "nodes": nodes,
        "edges": edges,
        "meta": {
            "totalNodes": len(nodes),
            "totalEdges": len(edges),
            "kind": kind,
            "sections": list(SECTION_COLORS.keys()),
        },
    }
