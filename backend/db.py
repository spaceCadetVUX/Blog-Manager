"""SQLite setup — single file DB, zero config."""

import sqlite3
from pathlib import Path

DB_PATH = Path(__file__).parent.parent / "blog.db"


def get_conn() -> sqlite3.Connection:
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA journal_mode=WAL")
    conn.execute("PRAGMA foreign_keys=ON")
    return conn


def init_db():
    with get_conn() as conn:
        conn.executescript("""
        CREATE TABLE IF NOT EXISTS posts (
            id              INTEGER PRIMARY KEY AUTOINCREMENT,
            slug            TEXT UNIQUE NOT NULL,
            url             TEXT,
            headline        TEXT,
            description     TEXT,
            image           TEXT,
            date_published  TEXT,
            date_modified   TEXT,
            author          TEXT,
            publisher       TEXT,
            article_section TEXT,
            word_count      INTEGER DEFAULT 0,
            keywords        TEXT DEFAULT '[]',
            mentions        TEXT DEFAULT '[]',
            breadcrumb      TEXT DEFAULT '[]',
            article_body    TEXT DEFAULT '',
            robots          TEXT,
            products        TEXT DEFAULT '[]',
            updated_at      TEXT DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS internal_links (
            id        INTEGER PRIMARY KEY AUTOINCREMENT,
            from_slug TEXT NOT NULL,
            to_slug   TEXT NOT NULL,
            anchor    TEXT DEFAULT '',
            kind      TEXT NOT NULL DEFAULT 'body' CHECK (kind IN ('body', 'related')),
            position  INTEGER,
            UNIQUE(from_slug, to_slug, kind)
        );

        CREATE TABLE IF NOT EXISTS settings (
            key   TEXT PRIMARY KEY,
            value TEXT NOT NULL DEFAULT ''
        );

        CREATE TABLE IF NOT EXISTS analysis_history (
            id         INTEGER PRIMARY KEY AUTOINCREMENT,
            type       TEXT NOT NULL,
            section    TEXT DEFAULT '',
            model      TEXT DEFAULT '',
            content    TEXT NOT NULL,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP
        );

        CREATE INDEX IF NOT EXISTS idx_posts_section ON posts(article_section);
        CREATE INDEX IF NOT EXISTS idx_history_type ON analysis_history(type, created_at);
        """)
        # Migration: thêm column mới nếu chưa có
        try:
            conn.execute("ALTER TABLE posts ADD COLUMN products TEXT DEFAULT '[]'")
        except Exception:
            pass
        migrate_internal_links(conn)
        migrate_products(conn)
        migrate_product_links(conn)


# product_links: quan hệ sản phẩm ↔ sản phẩm. from_id/to_id = products.id (ID cũ/legacy, KHÔNG phải site_id).
#   kind='bundle'       có hướng: from = sản phẩm chứa bundle, to = sản phẩm trong bundle (MCP get_product.bundles); weight=1.
#   kind='co_mentioned' không hướng, một dòng với from_id < to_id; weight = số bài viết nhắc cả hai sản phẩm.
PRODUCT_LINKS_DDL = """
    CREATE TABLE IF NOT EXISTS product_links (
        id         INTEGER PRIMARY KEY AUTOINCREMENT,
        from_id    INTEGER NOT NULL,
        to_id      INTEGER NOT NULL,
        kind       TEXT    NOT NULL,
        weight     INTEGER NOT NULL DEFAULT 1,
        updated_at TEXT    DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(from_id, to_id, kind)
    )"""


def migrate_product_links(conn: sqlite3.Connection) -> None:
    """Idempotent: tạo bảng product_links + index. Không đụng products/posts/internal_links."""
    conn.execute(PRODUCT_LINKS_DDL)
    conn.execute("CREATE INDEX IF NOT EXISTS idx_plinks_from ON product_links(from_id)")
    conn.execute("CREATE INDEX IF NOT EXISTS idx_plinks_to   ON product_links(to_id)")
    conn.execute("CREATE INDEX IF NOT EXISTS idx_plinks_kind ON product_links(kind)")


# internal_links.kind: 'body' = link trong thân bài (#article-body); 'related' = link trong khối
# "Bài viết liên quan" cuối trang (NGOÀI #article-body). `position` = thứ tự trong khối related (NULL với body).
LINKS_NEW_DDL = """
    CREATE TABLE internal_links_new (
        id        INTEGER PRIMARY KEY AUTOINCREMENT,
        from_slug TEXT NOT NULL,
        to_slug   TEXT NOT NULL,
        anchor    TEXT DEFAULT '',
        kind      TEXT NOT NULL DEFAULT 'body' CHECK (kind IN ('body', 'related')),
        position  INTEGER,
        UNIQUE(from_slug, to_slug, kind)
    )"""


def migrate_internal_links(conn: sqlite3.Connection) -> None:
    """Idempotent: bảng cũ UNIQUE(from_slug,to_slug) không có cột kind → rebuild (tạo bảng mới, copy toàn bộ
    dòng cũ với kind='body', đổi tên) trong MỘT transaction rồi tạo index. Lỗi → rollback, bảng cũ còn nguyên.
    SQLite không sửa được ràng buộc UNIQUE bằng ALTER nên phải rebuild."""
    have = {r[1] for r in conn.execute("PRAGMA table_info(internal_links)")}
    if "kind" not in have:
        if conn.in_transaction:
            conn.commit()
        conn.execute("BEGIN IMMEDIATE")
        try:
            before = conn.execute("SELECT COUNT(*) FROM internal_links").fetchone()[0]
            conn.execute("DROP TABLE IF EXISTS internal_links_new")
            conn.execute(LINKS_NEW_DDL)
            conn.execute("""
                INSERT INTO internal_links_new (id, from_slug, to_slug, anchor, kind, position)
                SELECT id, from_slug, to_slug, anchor, 'body', NULL FROM internal_links
            """)
            copied = conn.execute("SELECT COUNT(*) FROM internal_links_new").fetchone()[0]
            if copied != before:
                raise RuntimeError(f"migrate internal_links: copy {copied}/{before} dòng")
            conn.execute("DROP TABLE internal_links")
            conn.execute("ALTER TABLE internal_links_new RENAME TO internal_links")
            conn.execute("COMMIT")
        except BaseException:
            conn.execute("ROLLBACK")
            raise
    conn.execute("CREATE INDEX IF NOT EXISTS idx_links_from ON internal_links(from_slug)")
    conn.execute("CREATE INDEX IF NOT EXISTS idx_links_to   ON internal_links(to_slug)")
    conn.execute("CREATE INDEX IF NOT EXISTS idx_links_kind_to   ON internal_links(kind, to_slug)")
    conn.execute("CREATE INDEX IF NOT EXISTS idx_links_kind_from ON internal_links(kind, from_slug)")


# Cột đồng bộ từ MCP knxstore.vn. `products.id` giữ nguyên = ID hệ cũ (Admin.html);
# `site_id` = ID hiện tại của site Next.js (khớp MCP search_products/get_product). Hai hệ KHÁC nhau.
PRODUCTS_MCP_COLUMNS = (
    ("site_id",      "INTEGER"),
    ("slug",         "TEXT"),
    ("sku",          "TEXT"),
    ("stock_status", "TEXT"),
    ("status",       "TEXT"),   # PUBLISHED/DRAFT/ARCHIVED từ MCP, hoặc 'not_on_site'
)


def ensure_products_table(conn: sqlite3.Connection) -> None:
    """Tạo bảng products (nếu chưa có — DB mới chưa import Admin.html) rồi áp migration cột MCP."""
    conn.execute("""
        CREATE TABLE IF NOT EXISTS products (
            id         INTEGER PRIMARY KEY,
            name       TEXT    NOT NULL,
            brand      TEXT    DEFAULT '',
            price      INTEGER DEFAULT 0,
            category   TEXT    DEFAULT '',
            url        TEXT    DEFAULT '',
            updated_at TEXT    DEFAULT CURRENT_TIMESTAMP
        )""")
    migrate_products(conn)


def migrate_products(conn: sqlite3.Connection) -> None:
    """Idempotent: thêm cột MCP vào bảng products (nếu bảng đã tồn tại) + UNIQUE index cho site_id.
    SQLite không cho ADD COLUMN ... UNIQUE nên index tách riêng (nhiều NULL vẫn hợp lệ)."""
    if not conn.execute("SELECT 1 FROM sqlite_master WHERE type='table' AND name='products'").fetchone():
        return
    have = {r[1] for r in conn.execute("PRAGMA table_info(products)")}
    for name, decl in PRODUCTS_MCP_COLUMNS:
        if name not in have:
            try:
                conn.execute(f"ALTER TABLE products ADD COLUMN {name} {decl}")
            except sqlite3.OperationalError:
                pass  # tiến trình khác vừa thêm
    conn.execute("CREATE UNIQUE INDEX IF NOT EXISTS idx_products_site_id ON products(site_id)")
    conn.execute("CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug)")
