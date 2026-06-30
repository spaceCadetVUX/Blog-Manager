from fastapi import APIRouter, Query, UploadFile, File, HTTPException
from backend.db import get_conn

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


@router.get("")
def list_products(
    search:   str = Query("", alias="search"),
    brand:    str = Query("", alias="brand"),
    category: str = Query("", alias="category"),
    sort:     str = Query("id", alias="sort"),
    dir:      str = Query("desc", alias="dir"),
    page:     int = Query(0, alias="page"),
    limit:    int = Query(50, alias="limit"),
):
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

    where_sql = ("WHERE " + " AND ".join(where)) if where else ""

    with get_conn() as conn:
        total = conn.execute(
            f"SELECT COUNT(*) FROM products {where_sql}", params
        ).fetchone()[0]

        rows = conn.execute(
            f"""SELECT id, name, brand, price, category, url
                FROM products {where_sql}
                ORDER BY {sort_col} {sort_dir}
                LIMIT ? OFFSET ?""",
            params + [limit, page * limit],
        ).fetchall()

    return {
        "total": total,
        "page":  page,
        "items": [dict(r) for r in rows],
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
