import json
import threading
import uuid

from fastapi import APIRouter, Query, UploadFile, File, HTTPException
from pydantic import BaseModel
from backend.db import get_conn, migrate_products

router = APIRouter(prefix="/products", tags=["products"])


def _parse_html(html: str) -> list[dict]:
    try:
        from bs4 import BeautifulSoup
    except ImportError:
        raise HTTPException(500, "beautifulsoup4 chưa được cài")

    soup = BeautifulSoup(html, "html.parser")
    table = soup.find("table", {"id": "DataTables_Table_0"})
    if not table:
        raise HTTPException(400, "Không tìm thấy bảng DataTables_Table_0 trong file HTML")

    products = []
    for row in table.select("tbody tr"):
        cells = row.find_all("td")
        if len(cells) < 9:
            continue
        product_id = cells[0].get_text(strip=True)
        if not product_id.isdigit():
            continue
        a_tag = cells[1].find("a")
        name  = a_tag.get_text(strip=True) if a_tag else cells[1].get_text(strip=True)
        url   = a_tag.get("href", "") if a_tag else ""
        brand = cells[3].get_text(strip=True)
        price_str = cells[4].get_text(strip=True).replace(",", "").replace(".", "")
        price = int(price_str) if price_str.isdigit() else 0
        category = cells[8].get_text(strip=True)
        products.append({"id": int(product_id), "name": name, "brand": brand,
                          "price": price, "category": category, "url": url})
    return products


UPSERT_SQL = """
INSERT INTO products (id, name, brand, price, category, url)
VALUES (?, ?, ?, ?, ?, ?)
ON CONFLICT(id) DO UPDATE SET
    name=excluded.name, brand=excluded.brand, price=excluded.price,
    category=excluded.category, url=excluded.url,
    updated_at=CURRENT_TIMESTAMP
"""

CREATE_TABLE_SQL = """
CREATE TABLE IF NOT EXISTS products (
    id         INTEGER PRIMARY KEY,
    name       TEXT    NOT NULL,
    brand      TEXT    DEFAULT '',
    price      INTEGER DEFAULT 0,
    category   TEXT    DEFAULT '',
    url        TEXT    DEFAULT '',
    updated_at TEXT    DEFAULT CURRENT_TIMESTAMP
)
"""


@router.post("/import")
async def import_products(file: UploadFile = File(...)):
    """LEGACY: import bảng sản phẩm từ file Admin.html (ID hệ cũ). Giữ lại để tương thích — nguồn chuẩn nay là
    POST /products/sync (MCP). Lưu ý: import này ghi đè name/brand/price/category/url theo ID cũ; sau khi dùng nên
    chạy lại /products/sync để khôi phục dữ liệu MCP."""
    if not file.filename.endswith((".html", ".htm")):
        raise HTTPException(400, "Chỉ chấp nhận file .html hoặc .htm")

    raw = await file.read()
    html = raw.decode("utf-8", errors="ignore")

    incoming = _parse_html(html)
    if not incoming:
        raise HTTPException(400, "Không tìm thấy sản phẩm nào trong file")

    FIELDS = ("name", "brand", "price", "category", "url")

    with get_conn() as conn:
        conn.execute(CREATE_TABLE_SQL)
        migrate_products(conn)

        # Snapshot hiện tại
        existing = {
            r["id"]: dict(r)
            for r in conn.execute("SELECT id, name, brand, price, category, url FROM products").fetchall()
        }

        new_items      = []
        updated_items  = []
        unchanged_ids  = []

        for p in incoming:
            pid = p["id"]
            if pid not in existing:
                new_items.append({"id": pid, "name": p["name"], "brand": p["brand"]})
            else:
                old = existing[pid]
                changes = [f for f in FIELDS if str(p.get(f, "")) != str(old.get(f, ""))]
                if changes:
                    diff = {}
                    for f in changes:
                        diff[f] = {"old": old.get(f), "new": p.get(f)}
                    updated_items.append({"id": pid, "name": p["name"], "changes": diff})
                else:
                    unchanged_ids.append(pid)

        conn.executemany(
            UPSERT_SQL,
            [(p["id"], p["name"], p["brand"], p["price"], p["category"], p["url"]) for p in incoming],
        )
        total = conn.execute("SELECT COUNT(*) FROM products").fetchone()[0]

    return {
        "total_in_db":  total,
        "parsed":       len(incoming),
        "new_count":    len(new_items),
        "updated_count": len(updated_items),
        "unchanged_count": len(unchanged_ids),
        "new":          new_items[:50],
        "updated":      updated_items[:50],
    }


class SyncRequest(BaseModel):
    deep: bool = False    # True: get_product_for_edit cho mọi sản phẩm (~7 phút) -> refresh category/status/legacyId


@router.post("/sync")
def sync_products_from_mcp(req: SyncRequest | None = None):
    """Đồng bộ bảng products từ MCP knxstore.vn (search_products + get_product_for_edit) — ĐỒNG BỘ trong một request HTTP.
    GIỮ cho tương thích; UI dùng POST /products/sync/jobs (job nền có tiến độ). deep=false ~ mode "new", deep=true ~ mode "full".
    Giữ nguyên products.id (ID cũ/legacy — chính là id số trong shortcode {products:[...]}); gán products.site_id =
    ID mới của site (khớp MCP); sản phẩm mới trên site nhận id = legacyId (nếu có) hoặc 1_000_000 + site_id;
    sản phẩm không còn trên site -> status='not_on_site' (không xóa dòng).
    Trả số liệu: tổng MCP, khớp, mới, không còn trên site, mơ hồ. 409 nếu đang có job nặng khác."""
    from backend import mcp_client
    req = req or SyncRequest()
    job_id = _new_sync_job("full" if req.deep else "new")   # đăng ký như job để các job khác bị chặn (409) trong lúc chạy
    try:
        return _run_sync(job_id)
    except mcp_client.MCPError as e:
        _sync_jobs[job_id].update(status="error", error=_safe_err(e))
        raise HTTPException(502, f"MCP error: {_safe_err(e)[:300]}")
    except Exception as e:
        _sync_jobs[job_id].update(status="error", error=_safe_err(e))
        raise


def _refresh_co_mentioned() -> dict:
    from backend.product_links import rebuild_co_mentioned, safe_err
    try:
        with get_conn() as conn:
            return {"co_mentioned": rebuild_co_mentioned(conn)}
    except Exception as e:
        return {"co_mentioned_error": safe_err(e)}


# ── Đồng bộ sản phẩm từ MCP dạng job nền: 2 kiểu chạy ───────────────────────
#   mode="new"  (Chỉ cập nhật mới) : thêm sản phẩm mới, cập nhật dòng có thay đổi, bỏ qua dòng giống hệt, đánh dấu
#                                    not_on_site cho sản phẩm biến mất. Nhanh (~1 phút). = sync_products(deep=False)
#   mode="full" (Ghi đè toàn bộ)   : như "new" nhưng get_product_for_edit cho MỌI sản phẩm → làm mới category/status/legacyId
#                                    và ghi đè mọi trường lấy từ MCP. Chậm (~7 phút). = sync_products(deep=True)
# Cả hai: KHÔNG xóa dòng, KHÔNG đổi products.id. MCP gọi tuần tự; lỗi giữa chừng → job 'error', chưa ghi gì (một transaction cuối).

SYNC_MODES = ("new", "full")
_sync_jobs: dict[str, dict] = {}
_START_LOCK = threading.Lock()   # check-busy + tạo job phải nguyên tử, tránh 2 request cùng lọt qua _busy_job_id()


class SyncJobRequest(BaseModel):
    mode: str = "new"   # "new" = Chỉ cập nhật mới | "full" = Ghi đè toàn bộ


def _safe_err(e: BaseException) -> str:
    from backend.product_links import safe_err
    return safe_err(e)


def _new_sync_job(mode: str) -> str:
    """Tạo job sản phẩm. 409 nếu đang có job nặng khác (crawl bài / bundle / sản phẩm) — chỉ một job nặng một lúc."""
    with _START_LOCK:
        busy = _busy_job_id()
        if busy:
            raise HTTPException(409, f"Đang có job khác chạy ({busy}) — chờ xong rồi thử lại")
        job_id = uuid.uuid4().hex[:8]
        _sync_jobs[job_id] = {
            "status": "starting", "mode": mode, "phase": "", "total": 0, "done": 0, "current": "",
            "result": None, "error": None,
        }
    return job_id


def _run_sync(job_id: str) -> dict:
    """Chạy sync_products theo job['mode'], cập nhật tiến độ vào job, rồi rebuild co_mentioned. Ném lỗi lên caller.
    Ghi DB nằm trong MỘT transaction ở cuối sync_products (commit khi thoát `with`): lỗi trước đó → chưa ghi gì."""
    from backend.product_sync import sync_products
    job = _sync_jobs[job_id]

    def progress(phase: str, done: int, total: int, current: str):
        job["phase"], job["done"], job["total"], job["current"] = phase, done, total, current
        job["status"] = "writing" if phase == "writing" else "running"

    job["status"] = "running"
    with get_conn() as conn:
        result = sync_products(conn, deep=(job["mode"] == "full"), progress_cb=progress)
    # URL/ID sản phẩm có thể đổi → tính lại co_mentioned (transaction riêng; lỗi không làm hỏng kết quả sync)
    result.update(_refresh_co_mentioned())
    job["result"] = result
    job["current"] = ""
    job["status"] = "done"
    return result


def _run_sync_thread(job_id: str):
    try:
        _run_sync(job_id)
    except Exception as e:   # gồm mcp_client.MCPError: with get_conn() đã rollback → không ghi dở
        _sync_jobs[job_id].update(status="error", error=_safe_err(e))


@router.post("/sync/jobs")
def start_sync_job(req: SyncJobRequest | None = None):
    """Đồng bộ sản phẩm từ MCP như job nền → {job_id}; theo dõi bằng GET /products/sync/jobs/{job_id}.
    mode="new": chỉ cập nhật mới (~1 phút); mode="full": ghi đè toàn bộ (~7 phút). 409 nếu đang có job nặng khác."""
    req = req or SyncJobRequest()
    if req.mode not in SYNC_MODES:
        raise HTTPException(422, "mode phải là 'new' hoặc 'full'")
    job_id = _new_sync_job(req.mode)
    threading.Thread(target=_run_sync_thread, args=(job_id,), daemon=True).start()
    return {"job_id": job_id}


@router.get("/sync/jobs/{job_id}")
def get_sync_job(job_id: str):
    """{status: starting|running|writing|done|error, mode, phase, total, done, current, result|null, error|null}"""
    if job_id not in _sync_jobs:
        raise HTTPException(404, "Job not found")
    return _sync_jobs[job_id]


# ── Liên kết sản phẩm ↔ sản phẩm (product_links) ────────────────────────────

_link_jobs: dict[str, dict] = {}
_ACTIVE = ("starting", "running", "writing")


class LinksSyncRequest(BaseModel):
    slugs: list[str] | None = None   # chạy thử trên một số sản phẩm (dòng ngoài phạm vi không bị đụng); None = toàn bộ


def _busy_job_id() -> str | None:
    """Có job nặng khác (đồng bộ sản phẩm / bundle / crawl bài) đang chạy không — chỉ một job nặng một lúc, MCP gọi tuần tự."""
    for jobs in (_link_jobs, _sync_jobs):
        for jid, j in jobs.items():
            if j["status"] in _ACTIVE:
                return jid
    from backend.routes.crawl import _jobs as crawl_jobs
    for jid, j in crawl_jobs.items():
        if j.get("status") not in ("done", "error"):
            return jid
    return None


def _run_links_sync(job_id: str, slugs: list[str] | None):
    from backend.product_links import sync_product_bundles, safe_err
    job = _link_jobs[job_id]

    def progress(done: int, total: int, current: str):
        job["done"], job["total"], job["current"] = done, total, current

    try:
        job["status"] = "running"
        with get_conn() as conn:
            result = sync_product_bundles(conn, progress_cb=progress, only_slugs=slugs)
            job["status"] = "writing"
        job["failed"] = result["failed"]
        job["failed_slugs"] = result["failed_slugs"]
        job["unmatched"] = result["unmatched"]
        job["unmatched_count"] = result["unmatched_count"]
        job["result"] = result
        job["current"] = ""
        job["status"] = "done"
    except Exception as e:   # gồm mcp_client.MCPError: with get_conn() đã rollback → không ghi dở
        job["status"], job["error"] = "error", safe_err(e)


@router.post("/links/sync")
def start_links_sync(req: LinksSyncRequest | None = None):
    """Nạp kind='bundle' từ MCP get_product(slug).bundles (job nền, gọi MCP tuần tự ~5-7 phút cho ~820 sản phẩm).
    Trả {job_id}; theo dõi bằng GET /products/links/sync/{job_id}. MCP lỗi giữa chừng → job 'error', không ghi dở."""
    req = req or LinksSyncRequest()
    with _START_LOCK:
        busy = _busy_job_id()
        if busy:
            raise HTTPException(409, f"Đang có job khác chạy ({busy}) — chờ xong rồi thử lại")
        job_id = uuid.uuid4().hex[:8]
        _link_jobs[job_id] = {
            "status": "starting", "total": 0, "done": 0, "failed": 0, "failed_slugs": [],
            "unmatched": [], "unmatched_count": 0, "current": "", "scoped": req.slugs is not None,
            "result": None, "error": None,
        }
    threading.Thread(target=_run_links_sync, args=(job_id, req.slugs), daemon=True).start()
    return {"job_id": job_id}


@router.get("/links/sync/{job_id}")
def get_links_sync_status(job_id: str):
    if job_id not in _link_jobs:
        raise HTTPException(404, "Job not found")
    return _link_jobs[job_id]


@router.post("/links/rebuild")
def rebuild_links():
    """Tính lại kind='co_mentioned' từ posts.products (nhanh, không gọi MCP). Idempotent."""
    from backend.product_links import rebuild_co_mentioned
    with get_conn() as conn:
        return rebuild_co_mentioned(conn)


@router.get("/{product_id}/links")
def get_product_links(product_id: int, min_weight: int = Query(1, ge=1), limit: int = Query(100, ge=1, le=1000)):
    """{bundle, bundled_in, co_mentioned:[{product, weight, posts:[slug]}], co_mentioned_total, mentioned_in:[{slug, headline, url}]}
    bundle = sản phẩm nằm trong bundle của nó; bundled_in = sản phẩm khác có nó trong bundle."""
    from backend.product_links import get_links
    with get_conn() as conn:
        res = get_links(conn, product_id, min_weight=min_weight, limit=limit)
    if res is None:
        raise HTTPException(404, "Product not found")
    return res


@router.get("")
def list_products(
    search:   str = Query("", alias="search"),
    brand:    str = Query("", alias="brand"),
    category: str = Query("", alias="category"),
    sort:     str = Query("id", alias="sort"),
    dir:      str = Query("desc", alias="dir"),
    page:     int = Query(0, alias="page"),
    limit:    int = Query(50, alias="limit"),
    mentioned:  str = Query("", description="none = đang bán nhưng chưa bài nào nhắc | any = có ít nhất 1 bài nhắc"),
    has_bundle: int = Query(0, description="1 = chỉ sản phẩm có bundle"),
):
    from backend.product_links import load_mentions, link_counts, SELLABLE_SQL
    if mentioned not in ("", "none", "any"):
        raise HTTPException(422, "mentioned phải là 'none' hoặc 'any'")
    SORT_COLS = {"id", "name", "brand", "price", "category"}
    sort_col = sort if sort in SORT_COLS else "id"
    sort_dir = "DESC" if dir == "desc" else "ASC"

    where, params = [], []
    if search:
        for token in search.split():
            where.append("(name LIKE ? OR brand LIKE ? OR category LIKE ?)")
            params += [f"%{token}%", f"%{token}%", f"%{token}%"]
    if brand:
        where.append("brand = ?")
        params.append(brand)
    if category:
        where.append("category = ?")
        params.append(category)

    with get_conn() as conn:
        mentions = load_mentions(conn)
        if mentioned == "none":
            where.append(f"{SELLABLE_SQL} AND id NOT IN (SELECT value FROM json_each(?))")
            params.append(json.dumps(sorted(mentions["by_product"])))
        elif mentioned == "any":
            where.append("id IN (SELECT value FROM json_each(?))")
            params.append(json.dumps(sorted(mentions["by_product"])))
        if has_bundle:
            where.append("EXISTS (SELECT 1 FROM product_links pl WHERE pl.kind = 'bundle' AND pl.from_id = products.id)")

        where_sql = ("WHERE " + " AND ".join(where)) if where else ""

        total = conn.execute(
            f"SELECT COUNT(*) FROM products {where_sql}", params
        ).fetchone()[0]

        rows = conn.execute(
            f"""SELECT id, name, brand, price, category, url, site_id, slug, sku, stock_status, status
                FROM products {where_sql}
                ORDER BY {sort_col} {sort_dir}
                LIMIT ? OFFSET ?""",
            params + [limit, page * limit],
        ).fetchall()
        counts = link_counts(conn, [r["id"] for r in rows], mentions)

    return {
        "total": total,
        "page":  page,
        "items": [{**dict(r), **counts[r["id"]]} for r in rows],
    }


@router.get("/brands")
def list_brands():
    with get_conn() as conn:
        rows = conn.execute(
            "SELECT DISTINCT brand FROM products WHERE brand != '' ORDER BY brand"
        ).fetchall()
    return [r["brand"] for r in rows]


@router.get("/categories")
def list_categories():
    with get_conn() as conn:
        rows = conn.execute(
            "SELECT DISTINCT category FROM products WHERE category != '' ORDER BY category"
        ).fetchall()
    return [r["category"] for r in rows]
