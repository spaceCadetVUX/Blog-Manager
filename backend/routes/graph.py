"""
Graph endpoint — trả data cho React Flow.
Node size = inbound link count (link juice).
Node color = articleSection.
"""

import json
from fastapi import APIRouter, HTTPException, Query
from backend.db import get_conn
from backend.product_links import make_url_resolver

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


def _product_only_graph(product_links: str, min_co_weight: int, include_isolated: bool = False):
    """Node = sản phẩm (products.id) có ≥1 cạnh product_links đã lọc; edge = cạnh đó. Không phụ thuộc bài viết
    nên các bundle trỏ tới sản phẩm chưa bài nào nhắc vẫn được vẽ. inbound = số bài nhắc sản phẩm (0 nếu chưa có)."""
    import json as _json
    from backend.product_links import load_mentions
    kinds = ("bundle", "co_mentioned") if product_links in ("both", "none") else (product_links,)
    counts = {"bundle": 0, "co_mentioned": 0}
    with get_conn() as c:
        rows = c.execute(
            "SELECT from_id, to_id, kind, weight FROM product_links "
            "WHERE kind IN (SELECT value FROM json_each(?)) ORDER BY kind, from_id, to_id",
            (_json.dumps(list(kinds)),)).fetchall()
        rows = [r for r in rows if r["from_id"] != r["to_id"]
                and not (r["kind"] == "co_mentioned" and r["weight"] < min_co_weight)]
        ids = sorted({r["from_id"] for r in rows} | {r["to_id"] for r in rows})
        prods = {r["id"]: r for r in c.execute(
            "SELECT id, name, url, slug FROM products WHERE id IN (SELECT value FROM json_each(?))",
            (_json.dumps(ids),)).fetchall()}
        mentions = load_mentions(c)["by_product"]
        if include_isolated:  # thêm sản phẩm đang bán chưa có cạnh nào (nút trơ)
            for r in c.execute("SELECT id, name, url, slug FROM products WHERE status IS NULL OR status = 'PUBLISHED'"):
                prods.setdefault(r["id"], r)
            all_ids = [r["id"] for r in c.execute("SELECT id FROM products WHERE status IS NULL OR status = 'PUBLISHED'")]
        else:
            all_ids = []

    def handle(pid: int) -> str | None:
        pr = prods.get(pid)
        if not pr:
            return None
        slug = pr["slug"] or ((pr["url"] or "").split("/products/")[-1].strip("/") if pr["url"] else "")
        return f"prod__{slug}" if slug else None

    nodes, edges, seen = [], [], set()
    for r in rows:
        src, tgt = handle(r["from_id"]), handle(r["to_id"])
        if not src or not tgt or src == tgt:
            continue
        counts[r["kind"]] += 1
        edges.append({
            "id":     f"plink__{r['kind']}__{src}__{tgt}",
            "source": src,
            "target": tgt,
            "data":   {"anchor": "", "kind": r["kind"], "weight": r["weight"], "isProductLink": True},
        })
        for pid, h in ((r["from_id"], src), (r["to_id"], tgt)):
            if h in seen:
                continue
            seen.add(h)
            pr = prods[pid]
            nodes.append({
                "id":   h,
                "type": "productNode",
                "data": {
                    "label":   pr["name"] or h,
                    "url":     pr["url"] or "",
                    "image":   "",
                    "inbound": len(mentions.get(pid, [])),
                    "color":   "#f97316",
                },
                "position": {"x": 0, "y": 0},
            })
    for pid in all_ids:
        h = handle(pid)
        if not h or h in seen:
            continue
        seen.add(h)
        pr = prods[pid]
        nodes.append({
            "id":   h,
            "type": "productNode",
            "data": {"label": pr["name"] or h, "url": pr["url"] or "", "image": "",
                     "inbound": len(mentions.get(pid, [])), "color": "#f97316"},
            "position": {"x": 0, "y": 0},
        })
    return nodes, edges, counts


@router.get("")
def get_graph(
    section: str = Query("", description="Filter nodes by section"),
    min_links: int = Query(0, description="Chỉ lấy node có inbound >= min_links"),
    show_products: bool = Query(False, description="Hiện product nodes"),
    kind: str = Query("body", description="Loại link: body (thân bài, mặc định) | related (khối Bài viết liên quan) | all"),
    product_links: str = Query("none", description="Cạnh sản phẩm–sản phẩm (chỉ khi show_products): none | bundle | co_mentioned | both"),
    min_co_weight: int = Query(3, ge=1, description="Chỉ lấy cặp co_mentioned có weight (số bài chung) >= ngưỡng này"),
    include_isolated: bool = Query(False, description="Chỉ dùng cùng hide_posts: thêm cả sản phẩm đang bán chưa có liên kết nào"),
    hide_posts: bool = Query(False, description="Ẩn bài viết: chỉ trả mạng sản phẩm–sản phẩm (cần show_products; product_links=none thì coi như both)"),
):
    if kind not in ("body", "related", "all"):
        raise HTTPException(422, "kind phải là 'body', 'related' hoặc 'all'")
    if product_links not in ("none", "bundle", "co_mentioned", "both"):
        raise HTTPException(422, "product_links phải là 'none', 'bundle', 'co_mentioned' hoặc 'both'")
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

    link_counts = {"bundle": 0, "co_mentioned": 0}
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
        handle_pid: dict[str, int] = {}    # handle → products.id (để nối cạnh sản phẩm–sản phẩm)
        with get_conn() as pconn:
            resolve_pid = make_url_resolver(pconn) if product_links != "none" else None

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
                    if resolve_pid:
                        pid = resolve_pid(purl)
                        if pid is not None:
                            handle_pid[handle] = pid
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

        # Cạnh sản phẩm–sản phẩm (product_links): chỉ giữa hai product node đang hiện
        if product_links != "none" and handle_pid:
            kinds = ("bundle", "co_mentioned") if product_links == "both" else (product_links,)
            pid_handle = {pid: h for h, pid in handle_pid.items()}
            with get_conn() as pconn:
                rows = pconn.execute(
                    "SELECT from_id, to_id, kind, weight FROM product_links "
                    "WHERE kind IN (SELECT value FROM json_each(?)) ORDER BY kind, from_id, to_id",
                    (_json.dumps(list(kinds)),)).fetchall()
            for r in rows:
                if r["kind"] == "co_mentioned" and r["weight"] < min_co_weight:
                    continue
                src, tgt = pid_handle.get(r["from_id"]), pid_handle.get(r["to_id"])
                if not src or not tgt or src == tgt:
                    continue
                link_counts[r["kind"]] += 1
                edges.append({
                    "id":     f"plink__{r['kind']}__{src}__{tgt}",
                    "source": src,
                    "target": tgt,
                    "data":   {"anchor": "", "kind": r["kind"], "weight": r["weight"], "isProductLink": True},
                })

    if show_products and hide_posts:
        # Mạng sản phẩm–sản phẩm thuần: mọi sản phẩm có ít nhất một liên kết (kể cả sản phẩm chưa bài nào nhắc)
        nodes, edges, link_counts = _product_only_graph(product_links, min_co_weight, include_isolated)

    return {
        "nodes": nodes,
        "edges": edges,
        "meta": {
            "totalNodes": len(nodes),
            "totalEdges": len(edges),
            "hidePosts": bool(show_products and hide_posts),
            "kind": kind,
            "productLinks": {"mode": product_links if show_products else "none", "minCoWeight": min_co_weight,
                             "bundle": link_counts["bundle"], "co_mentioned": link_counts["co_mentioned"]},
            "sections": list(SECTION_COLORS.keys()),
        },
    }
