"""
Liên kết sản phẩm ↔ sản phẩm (bảng `product_links`). Chỉ lưu dữ liệu quan hệ dạng text, KHÔNG lưu HTML.

  kind='bundle'        (A) có hướng. Nguồn: MCP get_product(slug).bundles — combo/mua kèm do người nhập trên CMS.
                           from_id = sản phẩm chứa bundle, to_id = sản phẩm trong bundle, weight = 1.
  kind='co_mentioned'  (B) không hướng (một dòng, from_id < to_id). Nguồn: posts.products — hai sản phẩm cùng được
                           nhắc trong một bài; weight = số bài chung. Phản ánh cách viết bài, không phải sự thật thương mại.

ID: from_id/to_id luôn là `products.id` (ID cũ/legacy). `bundles[].id` của MCP là ID MỚI của site (= products.site_id,
hệ khác và VA CHẠM với ID cũ) nên bundle được khớp về products theo SLUG (fallback site_id), TUYỆT ĐỐI không coi là products.id.

Ghi DB: các hàm ở đây KHÔNG commit — caller dùng `with get_conn() as conn:` (commit khi thoát, rollback nếu lỗi), nên mọi
thay đổi của một lần gọi nằm trong một transaction. Thay thế dạng diff (chèn/sửa/xóa đúng phần khác biệt) để chạy lại không
làm đổi id dòng hay updated_at của dòng không đổi.
"""

import json
import os
import sqlite3
from collections import Counter, defaultdict
from itertools import combinations
from typing import Callable

from backend import mcp_client
from backend.db import migrate_product_links
from backend.product_sync import slug_from_url

KIND_BUNDLE = "bundle"
KIND_CO = "co_mentioned"
LIST_CAP = 200          # số phần tử tối đa trong các danh sách chi tiết của kết quả/báo cáo
SELLABLE_SQL = "(status IS NULL OR status = 'PUBLISHED')"   # đang bán (cùng định nghĩa với load_product_lookup)


def safe_err(e: BaseException) -> str:
    """Thông điệp lỗi cho job/response — không bao giờ để lộ token MCP hay mật khẩu app."""
    msg = str(e)
    for var in ("KNX_MCP_TOKEN", "APP_PASSWORD"):
        secret = os.getenv(var, "").strip()
        if secret:
            msg = msg.replace(secret, "***")
    return msg[:500]


def _has_table(conn: sqlite3.Connection, name: str) -> bool:
    return conn.execute("SELECT 1 FROM sqlite_master WHERE type='table' AND name=?", (name,)).fetchone() is not None


# ── Khớp sản phẩm ─────────────────────────────────────────────────────────────

def make_url_resolver(conn: sqlite3.Connection) -> Callable[[str], int | None]:
    """URL sản phẩm (https://knxstore.vn/products/<slug>) → products.id. Ưu tiên cột slug, sau đó slug trích từ products.url."""
    by_slug: dict[str, int] = {}
    by_url_slug: dict[str, int] = {}
    for r in conn.execute("SELECT id, slug, url FROM products ORDER BY id"):
        if r["slug"]:
            by_slug.setdefault(r["slug"], r["id"])
        us = slug_from_url(r["url"])
        if us:
            by_url_slug.setdefault(us, r["id"])

    def resolve(url: str) -> int | None:
        s = slug_from_url(url)
        if not s:
            return None
        pid = by_slug.get(s)
        return pid if pid is not None else by_url_slug.get(s)

    return resolve


def load_mentions(conn: sqlite3.Connection) -> dict:
    """Đọc posts.products → quan hệ bài ↔ sản phẩm (mỗi bài chỉ tính một lần cho mỗi sản phẩm).
    Trả: per_post {post_slug: [products.id...]}, by_product {products.id: [post_slug...]},
         unmapped {url: [post_slug...]} (URL không khớp dòng nào trong products), entries (số mục thô), bad_json."""
    resolve = make_url_resolver(conn)
    per_post: dict[str, list[int]] = {}
    by_product: dict[int, list[str]] = defaultdict(list)
    unmapped: dict[str, list[str]] = defaultdict(list)
    entries = bad_json = 0
    for r in conn.execute("SELECT slug, products FROM posts ORDER BY slug"):
        try:
            items = json.loads(r["products"] or "[]")
        except (TypeError, ValueError):
            bad_json += 1
            continue
        pids: list[int] = []
        for it in items if isinstance(items, list) else []:
            if not isinstance(it, dict):
                continue
            entries += 1
            url = it.get("url") or ""
            pid = resolve(url)
            if pid is None:
                if r["slug"] not in unmapped[url]:
                    unmapped[url].append(r["slug"])
            elif pid not in pids:
                pids.append(pid)
        if pids:
            per_post[r["slug"]] = pids
            for pid in pids:
                by_product[pid].append(r["slug"])
    return {"per_post": per_post, "by_product": dict(by_product), "unmapped": dict(unmapped),
            "entries": entries, "bad_json": bad_json}


# ── Thay thế theo kind (diff) ─────────────────────────────────────────────────

def _replace_kind(conn: sqlite3.Connection, kind: str, desired: dict[tuple[int, int], int],
                  protect_from: frozenset[int] | set[int] = frozenset()) -> dict:
    """Đưa các dòng product_links(kind) về đúng `desired` {(from_id, to_id): weight}.
    Dòng có from_id trong `protect_from` được giữ nguyên (không xóa/sửa) — dùng khi không lấy được dữ liệu mới của sản phẩm đó.
    KHÔNG commit. Trả số dòng thêm/xóa/sửa/không đổi."""
    cur = {(r["from_id"], r["to_id"]): (r["id"], r["weight"]) for r in conn.execute(
        "SELECT id, from_id, to_id, weight FROM product_links WHERE kind = ?", (kind,))}
    to_delete = [(rid,) for key, (rid, _w) in cur.items() if key not in desired and key[0] not in protect_from]
    to_update = [(w, cur[key][0]) for key, w in desired.items() if key in cur and cur[key][1] != w]
    to_insert = [(a, b, kind, w) for (a, b), w in sorted(desired.items()) if (a, b) not in cur]
    if to_delete:
        conn.executemany("DELETE FROM product_links WHERE id = ?", to_delete)
    if to_update:
        conn.executemany("UPDATE product_links SET weight = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?", to_update)
    if to_insert:
        conn.executemany("INSERT INTO product_links (from_id, to_id, kind, weight) VALUES (?, ?, ?, ?)", to_insert)
    kept = len(cur) - len(to_delete)
    return {"added": len(to_insert), "removed": len(to_delete), "updated": len(to_update),
            "unchanged": kept - len(to_update), "total": len(cur) - len(to_delete) + len(to_insert)}


# ── (B) co_mentioned ──────────────────────────────────────────────────────────

def rebuild_co_mentioned(conn: sqlite3.Connection) -> dict:
    """Tính lại toàn bộ kind='co_mentioned' từ posts.products. Idempotent (chạy lại → diff toàn 0). KHÔNG commit."""
    migrate_product_links(conn)
    m = load_mentions(conn)
    counts: Counter = Counter()
    for pids in m["per_post"].values():
        for a, b in combinations(sorted(set(pids)), 2):
            counts[(a, b)] += 1
    diff = _replace_kind(conn, KIND_CO, dict(counts))
    total_posts = conn.execute("SELECT COUNT(*) FROM posts").fetchone()[0]
    return {
        "posts":               total_posts,
        "posts_with_products": len(m["per_post"]),
        "post_product_links":  sum(len(v) for v in m["per_post"].values()),
        "products_mentioned":  len(m["by_product"]),
        "pairs":               len(counts),
        "pairs_w2":            sum(1 for w in counts.values() if w >= 2),
        "pairs_w3":            sum(1 for w in counts.values() if w >= 3),
        "max_weight":          max(counts.values(), default=0),
        "unmapped_count":      len(m["unmapped"]),
        "unmapped":            [{"url": u, "posts": p} for u, p in list(m["unmapped"].items())[:LIST_CAP]],
        "bad_json":            m["bad_json"],
        "diff":                diff,
    }


# ── (A) bundle ────────────────────────────────────────────────────────────────

def sync_product_bundles(conn: sqlite3.Connection, progress_cb: Callable[[int, int, str], None] | None = None,
                         only_slugs: list[str] | None = None) -> dict:
    """Lấy MCP get_product(slug).bundles của mọi sản phẩm đang bán (status='PUBLISHED', có slug) — TUẦN TỰ (MCP trả 429
    khi gọi song song; mcp_client._call_patient tự chờ khi 429) — rồi thay thế kind='bundle' trong MỘT transaction sau khi
    đã lấy xong dữ liệu. Lỗi MCP (xác thực/mạng/429 hết lượt thử) giữa chừng → ném MCPError, chưa ghi gì.
    get_product báo lỗi cho 1 sản phẩm (MCPToolError, vd không tìm thấy) → ghi vào `failed_slugs`, GIỮ NGUYÊN bundle cũ
    của sản phẩm đó, các sản phẩm còn lại vẫn được cập nhật.

    only_slugs: chỉ xử lý các slug này (chạy thử); dòng của sản phẩm ngoài phạm vi không bị đụng.
    progress_cb(done, total, current_slug). KHÔNG commit — caller commit khi thoát `with get_conn()`.

    Bundle → products.id khớp theo slug (fallback site_id). Không khớp / mâu thuẫn (slug và site_id trỏ hai dòng khác nhau)
    → liệt kê ở `unmatched`, không ghi, không đoán."""
    migrate_product_links(conn)
    by_slug: dict[str, int] = {}
    by_site: dict[int, int] = {}
    for r in conn.execute("SELECT id, slug, site_id FROM products ORDER BY id"):
        if r["slug"]:
            by_slug.setdefault(r["slug"], r["id"])
        if r["site_id"] is not None:
            by_site.setdefault(int(r["site_id"]), r["id"])

    eligible = [(r["id"], r["slug"]) for r in conn.execute(
        "SELECT id, slug FROM products WHERE status = 'PUBLISHED' AND slug IS NOT NULL AND slug != '' ORDER BY id")]
    scoped = only_slugs is not None
    if scoped:
        wanted = set(only_slugs)
        eligible = [(i, s) for i, s in eligible if s in wanted]
    total = len(eligible)

    desired: dict[tuple[int, int], int] = {}
    fetched_ok: set[int] = set()
    failed_ids: set[int] = set()
    failed_slugs: list[dict] = []
    unmatched: list[dict] = []
    stats = {"items_raw": 0, "matched_slug": 0, "matched_site_id": 0, "self_refs": 0, "duplicates": 0, "unmatched": 0}
    with_bundle = 0

    for n, (pid, slug) in enumerate(eligible, 1):
        if progress_cb:
            progress_cb(n - 1, total, slug)
        try:
            prod = mcp_client.get_product(slug)
        except mcp_client.MCPToolError as e:
            failed_ids.add(pid)
            if len(failed_slugs) < LIST_CAP:
                failed_slugs.append({"slug": slug, "error": safe_err(e)[:200]})
            continue
        # Lỗi khác (MCPAuthError, mạng, 429 hết lượt thử) → MCPError bay lên: chưa ghi gì.
        fetched_ok.add(pid)
        bundles = prod.get("bundles")
        if not isinstance(bundles, list) or not bundles:
            continue
        with_bundle += 1
        for item in bundles:
            if not isinstance(item, dict):
                continue
            stats["items_raw"] += 1
            b_slug, b_id = item.get("slug"), item.get("id")
            try:
                b_site = int(b_id) if b_id is not None else None
            except (TypeError, ValueError):
                b_site = None
            via_slug = by_slug.get(b_slug) if b_slug else None
            via_site = by_site.get(b_site) if b_site is not None else None
            reason = None
            if via_slug is not None and via_site is not None and via_slug != via_site:
                to_id, reason = None, "slug và site_id trỏ hai dòng products khác nhau"
            elif via_slug is not None:
                to_id = via_slug
            elif via_site is not None:
                to_id = via_site
            else:
                to_id, reason = None, "không có trong products (slug/site_id)"
            if to_id is None:
                stats["unmatched"] += 1
                if len(unmatched) < LIST_CAP:
                    unmatched.append({"from_slug": slug, "bundle_slug": b_slug, "bundle_site_id": b_site,
                                      "bundle_name": item.get("name"), "reason": reason})
                continue
            if to_id == pid:
                stats["self_refs"] += 1
                continue
            if (pid, to_id) in desired:
                stats["duplicates"] += 1
                continue
            stats["matched_slug" if via_slug is not None else "matched_site_id"] += 1
            desired[(pid, to_id)] = 1
    if progress_cb:
        progress_cb(total, total, "")

    if total and not fetched_ok:
        raise mcp_client.MCPError("get_product thất bại với mọi sản phẩm — dừng, không ghi DB")

    # Ghi (một transaction do caller commit). Dòng của sản phẩm lấy lỗi / ngoài phạm vi chạy thử được giữ nguyên.
    if scoped:
        existing_from = {r[0] for r in conn.execute("SELECT DISTINCT from_id FROM product_links WHERE kind = ?", (KIND_BUNDLE,))}
        protect = frozenset(existing_from - fetched_ok)
    else:
        protect = frozenset(failed_ids)
    diff = _replace_kind(conn, KIND_BUNDLE, desired, protect)

    return {
        "scoped":               scoped,
        "eligible":             total,
        "fetched":              len(fetched_ok),
        "failed":               len(failed_ids),
        "failed_slugs":         failed_slugs,
        "products_with_bundle": with_bundle,
        "bundle_items":         stats["items_raw"],
        "pairs":                len(desired),
        "matched_by_slug":      stats["matched_slug"],
        "matched_by_site_id":   stats["matched_site_id"],
        "self_refs":            stats["self_refs"],
        "duplicates":           stats["duplicates"],
        "unmatched_count":      stats["unmatched"],
        "unmatched":            unmatched,
        "diff":                 diff,
    }


# ── Đọc cho API ───────────────────────────────────────────────────────────────

def _brief(r: sqlite3.Row) -> dict:
    return {"id": r["id"], "name": r["name"], "slug": r["slug"], "url": r["url"] or "",
            "brand": r["brand"] or "", "sku": r["sku"], "status": r["status"], "site_id": r["site_id"]}


_BRIEF_COLS = "p.id, p.name, p.slug, p.url, p.brand, p.sku, p.status, p.site_id"


def get_links(conn: sqlite3.Connection, product_id: int, min_weight: int = 1, limit: int = 100) -> dict | None:
    """Liên kết của một sản phẩm. None nếu không có sản phẩm. `weight` lấy từ bảng product_links (lần rebuild gần nhất);
    `posts` và `mentioned_in` lấy từ posts hiện tại."""
    row = conn.execute(f"SELECT {_BRIEF_COLS} FROM products p WHERE p.id = ?", (product_id,)).fetchone()
    if not row:
        return None
    bundle = [_brief(r) for r in conn.execute(
        f"""SELECT {_BRIEF_COLS} FROM product_links pl JOIN products p ON p.id = pl.to_id
            WHERE pl.kind = 'bundle' AND pl.from_id = ? ORDER BY p.name, p.id""", (product_id,))]
    bundled_in = [_brief(r) for r in conn.execute(
        f"""SELECT {_BRIEF_COLS} FROM product_links pl JOIN products p ON p.id = pl.from_id
            WHERE pl.kind = 'bundle' AND pl.to_id = ? ORDER BY p.name, p.id""", (product_id,))]

    m = load_mentions(conn)
    mine = set(m["by_product"].get(product_id, []))
    co_rows = conn.execute(
        f"""SELECT {_BRIEF_COLS}, pl.weight FROM product_links pl
            JOIN products p ON p.id = CASE WHEN pl.from_id = :pid THEN pl.to_id ELSE pl.from_id END
            WHERE pl.kind = 'co_mentioned' AND (pl.from_id = :pid OR pl.to_id = :pid) AND pl.weight >= :minw
            ORDER BY pl.weight DESC, p.name, p.id""", {"pid": product_id, "minw": max(1, min_weight)}).fetchall()
    co = [{"product": _brief(r), "weight": r["weight"],
           "posts": sorted(mine & set(m["by_product"].get(r["id"], [])))} for r in co_rows[:limit]]

    posts = []
    if mine:
        posts = [{"slug": r["slug"], "headline": r["headline"] or r["slug"], "url": r["url"] or ""} for r in conn.execute(
            "SELECT slug, headline, url FROM posts WHERE slug IN (SELECT value FROM json_each(?)) ORDER BY headline, slug",
            (json.dumps(sorted(mine)),))]
    return {"product": _brief(row), "bundle": bundle, "bundled_in": bundled_in,
            "co_mentioned": co, "co_mentioned_total": len(co_rows), "mentioned_in": posts}


def link_counts(conn: sqlite3.Connection, ids: list[int], mentions: dict | None = None) -> dict[int, dict]:
    """Số liên kết cho danh sách sản phẩm: bundle_count (số sản phẩm trong bundle của nó), co_mentioned_count (số cặp,
    mọi weight), mentioned_in_count (số bài nhắc)."""
    out = {i: {"bundle_count": 0, "co_mentioned_count": 0, "mentioned_in_count": 0} for i in ids}
    if not ids:
        return out
    arg = json.dumps(list(ids))
    for r in conn.execute("""SELECT from_id AS pid, COUNT(*) AS c FROM product_links
                             WHERE kind = 'bundle' AND from_id IN (SELECT value FROM json_each(?)) GROUP BY from_id""", (arg,)):
        out[r["pid"]]["bundle_count"] = r["c"]
    for r in conn.execute("""SELECT pid, COUNT(*) AS c FROM (
                                 SELECT from_id AS pid FROM product_links
                                   WHERE kind = 'co_mentioned' AND from_id IN (SELECT value FROM json_each(?))
                                 UNION ALL
                                 SELECT to_id AS pid FROM product_links
                                   WHERE kind = 'co_mentioned' AND to_id IN (SELECT value FROM json_each(?))
                             ) GROUP BY pid""", (arg, arg)):
        out[r["pid"]]["co_mentioned_count"] = r["c"]
    by_product = (mentions or load_mentions(conn))["by_product"]
    for i in ids:
        out[i]["mentioned_in_count"] = len(by_product.get(i, []))
    return out


def link_stats(conn: sqlite3.Connection) -> dict:
    """Số liệu tổng cho /stats. Bảng products/product_links chưa có → toàn 0."""
    empty = {"products_unmentioned": 0, "products_with_bundle": 0,
             "product_links": {"bundle": 0, "co_mentioned": 0, "co_mentioned_w3": 0}}
    if not _has_table(conn, "products") or not _has_table(conn, "product_links"):
        return empty
    mentioned = set(load_mentions(conn)["by_product"])
    sellable = [r[0] for r in conn.execute(f"SELECT id FROM products WHERE {SELLABLE_SQL}")]
    by_kind = dict(conn.execute("SELECT kind, COUNT(*) FROM product_links GROUP BY kind").fetchall())
    return {
        "products_unmentioned": sum(1 for i in sellable if i not in mentioned),
        "products_with_bundle": conn.execute(
            "SELECT COUNT(DISTINCT from_id) FROM product_links WHERE kind = 'bundle'").fetchone()[0],
        "product_links": {
            "bundle":          by_kind.get(KIND_BUNDLE, 0),
            "co_mentioned":    by_kind.get(KIND_CO, 0),
            "co_mentioned_w3": conn.execute(
                "SELECT COUNT(*) FROM product_links WHERE kind = 'co_mentioned' AND weight >= 3").fetchone()[0],
        },
    }
