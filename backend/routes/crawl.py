"""
Crawl endpoint — trigger crawl từ sitemap URL, track progress qua polling.
POST /crawl        → { job_id }
GET  /crawl/{job_id} → job status
"""

import sys
import time
import uuid
import threading
import xml.etree.ElementTree as ET
from pathlib import Path
from urllib.request import urlopen, Request
from urllib.error import URLError, HTTPError

from fastapi import APIRouter
from pydantic import BaseModel

# Đảm bảo project root trong path để import crawl_posts
PROJECT_ROOT = Path(__file__).parent.parent.parent
sys.path.insert(0, str(PROJECT_ROOT))

router = APIRouter(prefix="/crawl", tags=["crawl"])

# ── In-memory job store ─────────────────────────────────────────────────────
_jobs: dict[str, dict] = {}


class CrawlRequest(BaseModel):
    sitemap_url: str
    mode: str = "incremental"  # "incremental" | "full"


@router.post("")
def start_crawl(req: CrawlRequest):
    job_id = uuid.uuid4().hex[:8]
    _jobs[job_id] = {
        "status":      "starting",
        "sitemap_url": req.sitemap_url,
        "mode":        req.mode,
        "total":       0,
        "crawled":     0,
        "failed":      0,
        "skipped":     0,
        "importing":   False,
        "current":     "",
        "error":       None,
    }
    t = threading.Thread(target=_run_crawl, args=(job_id, req.sitemap_url, req.mode), daemon=True)
    t.start()
    return {"job_id": job_id}


@router.get("/{job_id}")
def get_status(job_id: str):
    if job_id not in _jobs:
        return {"error": "Job not found"}
    return _jobs[job_id]


# ── Background worker ───────────────────────────────────────────────────────

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    "Accept": "text/html,application/xhtml+xml",
    "Accept-Language": "vi-VN,vi;q=0.9,en;q=0.8",
}


def _fetch(url: str) -> str | None:
    req = Request(url, headers=HEADERS)
    try:
        with urlopen(req, timeout=15) as r:
            raw = r.read()
            try:
                return raw.decode("utf-8")
            except UnicodeDecodeError:
                return raw.decode("latin-1")
    except (URLError, HTTPError):
        return None


def _parse_sitemap_url(sitemap_url: str) -> list[dict]:
    xml_data = _fetch(sitemap_url)
    if not xml_data:
        raise RuntimeError(f"Không fetch được sitemap: {sitemap_url}")
    root = ET.fromstring(xml_data)
    ns = {"sm": "http://www.sitemaps.org/schemas/sitemap/0.9"}
    entries = []
    for el in root.findall("sm:url", ns):
        loc = el.findtext("sm:loc", namespaces=ns)
        lastmod = el.findtext("sm:lastmod", namespaces=ns)
        if loc:
            entries.append({"url": loc, "lastmod": lastmod or ""})
    return entries


def _run_crawl(job_id: str, sitemap_url: str, mode: str):
    job = _jobs[job_id]
    try:
        # Import crawler functions (at project root)
        from crawl_posts import (
            fetch_html, extract_jsonld, extract_meta_tags,
            find_article_jsonld, extract_internal_links,
            jsonld_to_md, slug_from_url,
        )

        # 1. Fetch sitemap
        job["status"] = "fetching_sitemap"
        job["current"] = sitemap_url
        entries = _parse_sitemap_url(sitemap_url)
        job["total"] = len(entries)
        job["status"] = "crawling"

        output_dir = PROJECT_ROOT / "posts_md"
        output_dir.mkdir(exist_ok=True)

        for i, entry in enumerate(entries):
            url = entry["url"]
            slug = slug_from_url(url)
            out_path = output_dir / f"{slug}.md"

            job["current"] = slug

            # Incremental: bỏ qua nếu file đã có
            if out_path.exists() and mode == "incremental":
                job["skipped"] += 1
                continue

            try:
                html = fetch_html(url)
                if not html:
                    job["failed"] += 1
                    continue

                all_jsonld = extract_jsonld(html)
                meta       = extract_meta_tags(html)
                article, webpage = find_article_jsonld(all_jsonld)
                internal_links   = extract_internal_links(html, url)

                if not article:
                    article = {}

                md = jsonld_to_md(url, entry["lastmod"], article, meta, all_jsonld, webpage, internal_links)
                out_path.write_text(md, encoding="utf-8")
                job["crawled"] += 1

            except Exception as e:
                job["failed"] += 1

            if i < len(entries) - 1:
                time.sleep(0.5)

        # 2. Import vào DB
        job["importing"] = True
        job["current"]   = "Importing to database…"
        from backend.import_posts import run as import_run
        import_run(output_dir)

        job["status"]    = "done"
        job["importing"] = False
        job["current"]   = ""

    except Exception as e:
        job["status"] = "error"
        job["error"]  = str(e)
