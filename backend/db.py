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
            updated_at      TEXT DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS internal_links (
            id        INTEGER PRIMARY KEY AUTOINCREMENT,
            from_slug TEXT NOT NULL,
            to_slug   TEXT NOT NULL,
            anchor    TEXT DEFAULT '',
            UNIQUE(from_slug, to_slug)
        );

        CREATE INDEX IF NOT EXISTS idx_posts_section ON posts(article_section);
        CREATE INDEX IF NOT EXISTS idx_links_from   ON internal_links(from_slug);
        CREATE INDEX IF NOT EXISTS idx_links_to     ON internal_links(to_slug);
        """)
