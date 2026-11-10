"""
Đồng bộ bảng `products` từ MCP knxstore.vn (search_products + get_product_for_edit).

HAI HỆ ID SẢN PHẨM (đã kiểm chứng với trang live, Giai đoạn 5):
  ID cũ / legacy  = cột products.id (Admin.html) = `legacyId` trong MCP get_product_for_edit.
                    ĐÂY là ID mà shortcode {products:[...]} trong bài dùng: 1138/1148 lượt (id, bài) khớp link
                    /products/ thật trên trang live theo ID cũ/legacy, 0 lượt chỉ khớp theo ID mới.
  site_id         = ID mới của site Next.js (khớp MCP search_products/get_product). KHÔNG dùng được trong shortcode;
                    chỉ để liên kết với MCP. Hai hệ va chạm (vd id 79: cũ = lutron-bo-dieu-khien-rf, mới = dmxcas).

Ghi vào bảng:
  - products.id GIỮ NGUYÊN cho mọi dòng đã có. Dòng chưa có trong bảng cũ (sản phẩm mới trên site):
      * có legacyId trong MCP (sản phẩm thêm sau lần export Admin.html) -> id = legacyId: đúng ID mà shortcode
        trong bài đang dùng, không va chạm ID cũ (chỉ nhận khi chưa có dòng nào giữ id đó);
      * không có legacyId -> id = NEW_ID_OFFSET + site_id (1_000_000+): không thể va chạm ID cũ (tối đa ~4.3k) kể cả khi
        import Admin.html sau này, và idempotent. Shortcode của loại này phải dùng token slug (số thì site không giải được).
  - site_id (UNIQUE), slug, sku, stock_status, status (PUBLISHED/DRAFT/ARCHIVED từ MCP hoặc 'not_on_site').

Khớp dòng cũ <-> sản phẩm MCP theo thứ tự ưu tiên (mỗi bước chỉ nhận khớp DUY NHẤT; mơ hồ -> báo cáo, không đoán):
  1. site_id đã gán từ lần sync trước
  2. legacyId (get_product_for_edit) == products.id
  3. slug trích từ url (https://knxstore.vn/products/<slug>)
  4. SKU nằm trong tên dòng cũ (cùng hãng nếu cả hai có hãng)
Dòng cũ không khớp gì: thử get_product_for_edit theo slug cũ; vẫn không có -> status='not_on_site'
(KHÔNG xóa dòng nào). Quét thêm các site_id "hở" trong dải 1..max+5 để bắt sản phẩm nháp/lưu trữ.

Mọi lời gọi MCP chạy TRƯỚC, ghi DB sau trong một transaction: MCP lỗi giữa chừng -> không ghi gì.
Server MCP rate-limit chặt (429 khi gọi song song) nên gọi tuần tự (~0.4s/call).
  deep=True : get_product_for_edit cho mọi sản phẩm (~6-7 phút với ~800 sp) -> refresh category/status/legacyId toàn bộ.
  deep=False: chỉ gọi cho sản phẩm chưa liên kết (lần đầu ~ như deep; các lần sau ~15-30s).

HAI KIỂU CHẠY (UI/API job nền: POST /products/sync/jobs {"mode": ...}):
  mode="new"  (Chỉ cập nhật mới) = deep=False. search_products (~28 trang) -> thêm sản phẩm mới, cập nhật dòng có thay đổi,
              bỏ qua dòng giống hệt, đánh dấu not_on_site cho sản phẩm biến mất. get_product_for_edit CHỈ gọi cho: sản phẩm
              mới/chưa liên kết (cần legacyId), dò site_id nháp/lưu trữ, dòng cũ chưa khớp. Nhanh (~1 phút).
  mode="full" (Ghi đè toàn bộ)   = deep=True. Như "new" NHƯNG get_product_for_edit cho MỌI sản phẩm để làm mới
              category/status/legacyId... rồi ghi đè mọi trường lấy từ MCP. Chậm (~7 phút).
  Cả hai: KHÔNG xóa dòng, KHÔNG đổi products.id; trường MCP không có giá trị (None/rỗng với name/brand/category/url) thì giữ giá trị cũ.
"""

import re
import sqlite3
from collections import defaultdict

from backend import mcp_client
from backend.db import ensure_products_table

SITE_BASE = "https://knxstore.vn"
NEW_ID_OFFSET = 1_000_000
GAP_SCAN_SLACK = 5            # quét site_id trống tới max(site_id đang bán) + slack
LIST_CAP = 50                 # số phần tử tối đa trong các danh sách chi tiết của kết quả

_FIELDS = ("site_id", "name", "brand", "price", "category", "url", "slug", "sku", "stock_status", "status")
_KEEP_IF_EMPTY = ("name", "brand", "category", "url")


def slug_from_url(url: str | None) -> str | None:
    if not url or "/products/" not in url:
        return None
    return url.rsplit("/products/", 1)[-1].split("?")[0].split("#")[0].strip("/") or None


def _norm(s: str | None) -> str:
    return re.sub(r"[^0-9a-z]", "", (s or "").casefold())


def _primary_category(edit: dict | None) -> str | None:
    cats = [c for c in ((edit or {}).get("categories") or []) if isinstance(c, dict) and isinstance(c.get("category"), dict)]
    if not cats:
        return None
    primary = next((c for c in cats if c.get("isPrimary")), cats[0])
    return primary["category"].get("name") or None


def _price(v) -> int:
    try:
        return int(float(v)) if v not in (None, "") else 0
    except (TypeError, ValueError):
        return 0


def _legacy_id(edit: dict | None) -> int | None:
    try:
        v = (edit or {}).get("legacyId")
        return int(v) if v is not None else None
    except (TypeError, ValueError):
        return None


def _entry_from_catalog(it: dict, edit: dict | None) -> dict:
    """Bản ghi products từ item search_products (đang bán) + product edit nếu đã gọi."""
    brand = it.get("brand")
    slug = it.get("slug") or (edit or {}).get("slug")
    return {
        "site_id":      int(it["id"]),
        "legacy":       _legacy_id(edit),
        "name":         it.get("name") or (edit or {}).get("name") or "",
        "brand":        (brand.get("name") if isinstance(brand, dict) else brand) or "",
        "price":        _price(it.get("price")),
        "category":     _primary_category(edit),          # None = không có nguồn -> giữ giá trị cũ
        "url":          it.get("url") or f"{SITE_BASE}/products/{slug}",
        "slug":         slug,
        "sku":          it.get("sku") or (edit or {}).get("sku"),
        "stock_status": it.get("stockStatus"),
        "status":       (edit or {}).get("status") or "PUBLISHED",   # search_products chỉ trả sản phẩm đang bán
    }


def _entry_from_edit(e: dict) -> dict:
    """Bản ghi products từ get_product_for_edit (nháp/lưu trữ — không có trong search_products)."""
    slug = e.get("slug")
    return {
        "site_id":      int(e["id"]),
        "legacy":       _legacy_id(e),
        "name":         e.get("name") or "",
        "brand":        "",                                  # edit chỉ có brandId; không đoán tên hãng
        "price":        _price(e.get("price")),
        "category":     _primary_category(e),
        "url":          f"{SITE_BASE}/products/{slug}" if slug else "",
        "slug":         slug,
        "sku":          e.get("sku"),
        "stock_status": e.get("availability"),
        "status":       e.get("status") or "UNKNOWN",
    }


def sync_products(conn: sqlite3.Connection, deep: bool = False, progress=None, progress_cb=None) -> dict:
    """Đồng bộ products từ MCP. `conn` do caller quản lý (commit khi thoát `with get_conn()`).
    progress(msg) tùy chọn. Ném mcp_client.MCPError nếu MCP lỗi (khi đó chưa ghi gì).
    progress_cb(phase, done, total, current) tùy chọn — tiến độ có cấu trúc cho job nền. phase: catalog (đang tải
    search_products, total=0 vì chưa biết) | details (get_product_for_edit cho sản phẩm cần làm mới) | gaps (dò site_id trống)
    | lookup (tra slug dòng cũ chưa khớp) | writing (ghi DB). done/total đếm số lời gọi get_product_for_edit."""
    say = progress or (lambda m: None)
    ensure_products_table(conn)
    prog = {"done": 0, "total": 0}

    def report(phase: str, current: str, add_total: int = 0, step: int = 0) -> None:
        prog["total"] += add_total
        prog["done"] += step
        say(current)
        if progress_cb:
            progress_cb(phase, prog["done"], prog["total"], current)

    # ── 1. MCP (không ghi DB) ───────────────────────────────────────────────
    report("catalog", "MCP: search_products")
    catalog = {int(it["id"]): it for it in mcp_client.list_products(
        on_page=lambda p, tp: report("catalog", f"search_products trang {p}/{tp}"))}
    if not catalog:
        raise mcp_client.MCPError("search_products trả 0 sản phẩm — dừng, không ghi DB")

    rows = {r["id"]: dict(r) for r in conn.execute(
        "SELECT id, name, brand, price, category, url, site_id, slug, sku, stock_status, status FROM products")}
    by_site = {r["site_id"]: i for i, r in rows.items() if r["site_id"] is not None}

    # get_product_for_edit: sản phẩm chưa liên kết (cần legacyId) + toàn bộ nếu deep
    need_edit = sorted(sid for sid in catalog if deep or sid not in by_site)
    # Sản phẩm không đang bán (nháp/lưu trữ): quét site_id trống + site_id đã gán mà không còn trong catalog
    probe = [i for i in range(1, max(catalog) + GAP_SCAN_SLACK + 1) if i not in catalog]
    probe += [sid for sid in by_site if sid not in catalog and sid not in probe]
    report("details", "get_product_for_edit", add_total=len(need_edit) + len(probe))

    edits: dict[int, dict | None] = {}
    failed: list[dict] = []
    for sid in need_edit:
        slug = catalog[sid].get("slug") or str(sid)
        try:
            edits[sid] = mcp_client.get_product_edit(site_id=sid)
        except mcp_client.MCPToolError as e:
            # Sản phẩm CHƯA liên kết mà thiếu legacyId có thể bị chèn trùng dòng cũ -> dừng hẳn, không đoán.
            # Sản phẩm đã liên kết (site_id) chỉ mất phần làm mới từ edit: giữ giá trị cũ, báo trong `failed`.
            if sid not in by_site:
                raise
            edits[sid] = None
            failed.append({"site_id": sid, "slug": slug, "error": str(e)[:200]})
        report("details", slug, step=1)

    entries: dict[int, dict] = {sid: _entry_from_catalog(it, edits.get(sid)) for sid, it in catalog.items()}
    published = set(entries)

    for sid in probe:
        e = mcp_client.get_product_edit(site_id=sid)
        if e:
            entries[sid] = _entry_from_edit(e)
        report("gaps", f"dò site_id trống #{sid}", step=1)

    # ── 2. Khớp dòng cũ <-> MCP ─────────────────────────────────────────────
    old_slug = {i: slug_from_url(r["url"]) or r["slug"] for i, r in rows.items()}
    link: dict[int, int] = {}       # site_id -> id dòng hiện có
    how: dict[int, str] = {}
    claimed: set[int] = set()
    ambiguous: list[dict] = []
    slug_changed: list[dict] = []

    def take(sid, oid, method):
        link[sid] = oid; how[sid] = method; claimed.add(oid)

    free = lambda i: i not in claimed and rows[i]["site_id"] is None   # noqa: E731

    for sid in entries:                                           # (1) đã liên kết
        if sid in by_site:
            take(sid, by_site[sid], "site_id")

    for sid, en in entries.items():                               # (2) legacyId == products.id
        if sid in link:
            continue
        leg = en["legacy"]
        if leg in rows and free(leg):
            take(sid, leg, "legacy_id")
            if old_slug[leg] and old_slug[leg] != en["slug"]:
                slug_changed.append({"site_id": sid, "id": leg, "old_slug": old_slug[leg], "slug": en["slug"]})

    slug_index: dict[str, list[int]] = defaultdict(list)
    for i, s in old_slug.items():
        if s:
            slug_index[s].append(i)
    for sid, en in entries.items():                               # (3) slug
        if sid in link:
            continue
        cands = [i for i in slug_index.get(en["slug"], []) if free(i)]
        if len(cands) == 1:
            take(sid, cands[0], "slug")
        elif len(cands) > 1:
            ambiguous.append({"site_id": sid, "slug": en["slug"], "candidates": cands, "reason": "nhiều dòng cũ cùng slug"})

    amb_sids = {a["site_id"] for a in ambiguous}
    for sid, en in entries.items():                               # (4) SKU trong tên + cùng hãng
        if sid in link or sid in amb_sids:
            continue
        sku = _norm(en["sku"])
        if len(sku) < 4:
            continue
        brand = _norm(en["brand"])
        cands = [i for i, r in rows.items() if free(i) and sku in _norm(r["name"])
                 and (not brand or not _norm(r["brand"]) or brand == _norm(r["brand"]))]
        if len(cands) == 1:
            take(sid, cands[0], "sku_name")
        elif len(cands) > 1:
            ambiguous.append({"site_id": sid, "slug": en["slug"], "candidates": cands, "reason": "SKU khớp nhiều dòng cũ"})

    # Dòng cũ vẫn chưa khớp: tra theo slug cũ trước khi kết luận không còn trên site
    unmatched_old = [i for i in rows if i not in claimed and rows[i]["site_id"] is None and old_slug[i]]
    report("lookup", "tra slug dòng cũ chưa khớp", add_total=len(unmatched_old))
    for oid in unmatched_old:
        e = mcp_client.get_product_edit(slug=old_slug[oid])
        if e and int(e["id"]) not in link and int(e["id"]) not in by_site:
            sid = int(e["id"])
            entries.setdefault(sid, _entry_from_edit(e))
            take(sid, oid, "slug_lookup")
        report("lookup", old_slug[oid], step=1)

    # ── 3. Ghi DB (một transaction) ─────────────────────────────────────────
    report("writing", "Ghi DB")
    stats = {"updated": 0, "unchanged": 0, "new": 0, "not_on_site": 0}
    new_items: list[dict] = []
    updated_items: list[dict] = []
    gone_items: list[dict] = []
    nonpub_items: list[dict] = []
    inserted: set[int] = set()

    def apply(oid: int, rec: dict):
        cur = rows[oid]
        diff = {}
        for k in _FIELDS:
            v = rec[k]
            if v is None or (v == "" and k in _KEEP_IF_EMPTY):
                continue          # nguồn MCP không có giá trị -> giữ giá trị hiện có
            if cur.get(k) != v:
                diff[k] = v
        if not diff:
            stats["unchanged"] += 1
            return
        sets = ", ".join(f"{k}=?" for k in diff)
        conn.execute(f"UPDATE products SET {sets}, updated_at=CURRENT_TIMESTAMP WHERE id=?", [*diff.values(), oid])
        stats["updated"] += 1
        if len(updated_items) < LIST_CAP:
            updated_items.append({"id": oid, "site_id": rec["site_id"], "name": rec["name"] or cur.get("name"),
                                  "changes": {k: {"old": cur.get(k), "new": v} for k, v in diff.items()}})

    def insert(rec: dict):
        leg = rec["legacy"]
        new_id = leg if (leg is not None and 0 < leg < NEW_ID_OFFSET and leg not in rows) else NEW_ID_OFFSET + rec["site_id"]
        conn.execute(
            "INSERT INTO products (id, name, brand, price, category, url, site_id, slug, sku, stock_status, status) "
            "VALUES (?,?,?,?,?,?,?,?,?,?,?)",
            (new_id, rec["name"], rec["brand"], rec["price"], rec["category"] or "", rec["url"],
             rec["site_id"], rec["slug"], rec["sku"], rec["stock_status"], rec["status"]))
        stats["new"] += 1
        if len(new_items) < LIST_CAP:
            new_items.append({"id": new_id, "site_id": rec["site_id"], "name": rec["name"], "brand": rec["brand"], "status": rec["status"]})
        rows[new_id] = {**rec, "id": new_id}
        inserted.add(new_id)

    for sid, en in entries.items():
        if sid in link:
            apply(link[sid], en)
        else:
            insert(en)
        if en["status"] != "PUBLISHED" and len(nonpub_items) < LIST_CAP:
            nonpub_items.append({"site_id": sid, "slug": en["slug"], "status": en["status"]})

    for oid, r in list(rows.items()):                  # còn lại: không còn trên site
        if oid in claimed or oid in inserted:
            continue
        if r["status"] != "not_on_site":
            conn.execute("UPDATE products SET status='not_on_site', updated_at=CURRENT_TIMESTAMP WHERE id=?", (oid,))
        stats["not_on_site"] += 1
        if len(gone_items) < LIST_CAP:
            gone_items.append({"id": oid, "name": r["name"], "url": r["url"]})

    by_method: dict[str, int] = defaultdict(int)
    for m in how.values():
        by_method[m] += 1
    total = conn.execute("SELECT COUNT(*) FROM products").fetchone()[0]
    return {
        "mcp_total":           len(published),
        "linked":              len(link),
        "matched_by":          dict(by_method),
        "new_count":           stats["new"],
        "updated_count":       stats["updated"],
        "unchanged_count":     stats["unchanged"],
        "not_on_site_count":   stats["not_on_site"],
        "non_published_count": len(entries) - len(published),
        "ambiguous_count":     len(ambiguous),
        "slug_changed_count":  len(slug_changed),
        "total_in_db":         total,
        "deep":                deep,
        "mode":                "full" if deep else "new",
        "failed_count":        len(failed),
        "failed":              failed[:LIST_CAP],
        "new":                 new_items,
        "updated":             updated_items,
        "not_on_site":         gone_items,
        "non_published":       nonpub_items,
        "ambiguous":           ambiguous[:LIST_CAP],
        "slug_changed":        slug_changed[:LIST_CAP],
    }


def load_product_lookup(conn: sqlite3.Connection) -> dict:
    """Lookup cho shortcode {products:[...]}: {id số | slug -> {url,name}} từ bảng products.
    Id số trong shortcode là ID CŨ/legacy = products.id (KHÔNG phải site_id). Dòng sinh bởi sync không có legacyId
    (id >= NEW_ID_OFFSET) không có ID số hợp lệ trong shortcode -> chỉ tra bằng slug.
    Chỉ lấy sản phẩm đang bán trên site (status NULL = chưa sync, hoặc PUBLISHED): sản phẩm not_on_site/nháp
    không được trang live render nên không đưa vào products của bài."""
    from crawl_posts import build_product_lookup
    rows = conn.execute(
        "SELECT id, name, url FROM products WHERE status IS NULL OR status = 'PUBLISHED'").fetchall()
    lookup = build_product_lookup([(r[0], r[1], r[2]) for r in rows])
    for k in [k for k in lookup if isinstance(k, int) and k >= NEW_ID_OFFSET]:
        del lookup[k]
    return lookup
