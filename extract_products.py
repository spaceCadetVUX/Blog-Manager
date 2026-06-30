"""Parse Admin.html → extract products → upsert vào blog.db."""

import sqlite3
import sys
from pathlib import Path

try:
    from bs4 import BeautifulSoup
except ImportError:
    sys.exit("Cần cài: pip install beautifulsoup4")

HTML_FILE = Path(__file__).parent / "Admin.html"
DB_PATH   = Path(__file__).parent / "blog.db"

CREATE_TABLE = """
CREATE TABLE IF NOT EXISTS products (
    id          INTEGER PRIMARY KEY,   -- ID gốc từ knxstore.vn
    name        TEXT    NOT NULL,
    brand       TEXT    DEFAULT '',    -- TH (Thương hiệu)
    price       INTEGER DEFAULT 0,     -- Giá (VND)
    category    TEXT    DEFAULT '',    -- Danh mục
    url         TEXT    DEFAULT '',
    updated_at  TEXT    DEFAULT CURRENT_TIMESTAMP
);
"""

UPSERT = """
INSERT INTO products (id, name, brand, price, category, url)
VALUES (?, ?, ?, ?, ?, ?)
ON CONFLICT(id) DO UPDATE SET
    name     = excluded.name,
    brand    = excluded.brand,
    price    = excluded.price,
    category = excluded.category,
    url      = excluded.url,
    updated_at = CURRENT_TIMESTAMP;
"""


def parse_products(html: str) -> list[dict]:
    soup = BeautifulSoup(html, "html.parser")
    table = soup.find("table", {"id": "DataTables_Table_0"})
    if not table:
        sys.exit("Không tìm thấy bảng DataTables_Table_0 trong HTML.")

    products = []
    for row in table.select("tbody tr"):
        cells = row.find_all("td")
        if len(cells) < 9:
            continue

        # col 0: ID
        product_id = cells[0].get_text(strip=True)
        # col 1: Tên (lấy text từ <a>)
        a_tag = cells[1].find("a")
        name  = a_tag.get_text(strip=True) if a_tag else cells[1].get_text(strip=True)
        url   = a_tag.get("href", "") if a_tag else ""
        # col 3: TH (Thương hiệu)
        brand = cells[3].get_text(strip=True)
        # col 4: Price
        price_str = cells[4].get_text(strip=True).replace(",", "").replace(".", "")
        price = int(price_str) if price_str.isdigit() else 0
        # col 8: Danh mục
        category = cells[8].get_text(strip=True)

        if not product_id.isdigit():
            continue

        products.append({
            "id":       int(product_id),
            "name":     name,
            "brand":    brand,
            "price":    price,
            "category": category,
            "url":      url,
        })

    return products


def main():
    print(f"Đọc {HTML_FILE} ...")
    html = HTML_FILE.read_text(encoding="utf-8", errors="ignore")

    products = parse_products(html)
    print(f"Tìm thấy {len(products)} sản phẩm.")

    conn = sqlite3.connect(DB_PATH)
    conn.execute("PRAGMA journal_mode=WAL")
    conn.execute(CREATE_TABLE)
    conn.commit()

    with conn:
        conn.executemany(
            UPSERT,
            [(p["id"], p["name"], p["brand"], p["price"], p["category"], p["url"]) for p in products],
        )

    # Kiểm tra
    total = conn.execute("SELECT COUNT(*) FROM products").fetchone()[0]
    print(f"Done. Bảng products hiện có {total} dòng trong {DB_PATH}.")

    # Preview 5 dòng đầu
    print("\nPreview:")
    print(f"{'ID':>6}  {'Giá':>12}  {'TH':<15}  {'Danh mục':<30}  Tên")
    print("-" * 100)
    for row in conn.execute("SELECT id, price, brand, category, name FROM products ORDER BY id DESC LIMIT 5"):
        print(f"{row[0]:>6}  {row[1]:>12,}  {row[2]:<15}  {row[3]:<30}  {row[4][:50]}")

    conn.close()


if __name__ == "__main__":
    main()
