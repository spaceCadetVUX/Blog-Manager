"""
Crawl knxstore.vn posts từ sitemap-post.xml
Mỗi URL → extract JSON-LD → lưu thành file .md
"""

import xml.etree.ElementTree as ET
import json
import re
import time
import os
from pathlib import Path
from urllib.parse import urlparse
from urllib.request import urlopen, Request
from urllib.error import URLError, HTTPError

SITEMAP_FILE = "sitemap-post.xml"
OUTPUT_DIR = "posts_md"
DELAY_SECONDS = 1.0  # delay giữa các request để không bị block

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml",
    "Accept-Language": "vi-VN,vi;q=0.9,en;q=0.8",
}


def parse_sitemap(filepath: str) -> list[dict]:
    tree = ET.parse(filepath)
    root = tree.getroot()
    ns = {"sm": "http://www.sitemaps.org/schemas/sitemap/0.9"}
    urls = []
    for url_el in root.findall("sm:url", ns):
        loc = url_el.findtext("sm:loc", namespaces=ns)
        lastmod = url_el.findtext("sm:lastmod", namespaces=ns)
        if loc:
            urls.append({"url": loc, "lastmod": lastmod})
    return urls


def fetch_html(url: str) -> str | None:
    req = Request(url, headers=HEADERS)
    try:
        with urlopen(req, timeout=15) as resp:
            raw = resp.read()
            # thử decode utf-8, fallback sang latin-1
            try:
                return raw.decode("utf-8")
            except UnicodeDecodeError:
                return raw.decode("latin-1")
    except (URLError, HTTPError) as e:
        print(f"  [ERROR] Fetch failed: {e}")
        return None


def extract_jsonld(html: str) -> list[dict]:
    """Lấy tất cả JSON-LD block trong trang."""
    pattern = re.compile(
        r'<script[^>]+type=["\']application/ld\+json["\'][^>]*>(.*?)</script>',
        re.DOTALL | re.IGNORECASE,
    )
    results = []
    for m in pattern.finditer(html):
        try:
            data = json.loads(m.group(1).strip())
            if isinstance(data, list):
                results.extend(data)
            else:
                results.append(data)
        except json.JSONDecodeError:
            pass
    return results


def extract_meta_tags(html: str) -> dict:
    """Lấy meta SEO từ <meta> tags làm fallback."""
    meta = {}
    og_patterns = {
        "og_title": r'<meta[^>]+property=["\']og:title["\'][^>]+content=["\']([^"\']+)["\']',
        "og_description": r'<meta[^>]+property=["\']og:description["\'][^>]+content=["\']([^"\']+)["\']',
        "og_image": r'<meta[^>]+property=["\']og:image["\'][^>]+content=["\']([^"\']+)["\']',
        "og_url": r'<meta[^>]+property=["\']og:url["\'][^>]+content=["\']([^"\']+)["\']',
        "og_type": r'<meta[^>]+property=["\']og:type["\'][^>]+content=["\']([^"\']+)["\']',
        "og_site_name": r'<meta[^>]+property=["\']og:site_name["\'][^>]+content=["\']([^"\']+)["\']',
        "meta_title": r'<title[^>]*>([^<]+)</title>',
        "meta_description": r'<meta[^>]+name=["\']description["\'][^>]+content=["\']([^"\']+)["\']',
        "canonical": r'<link[^>]+rel=["\']canonical["\'][^>]+href=["\']([^"\']+)["\']',
        "robots": r'<meta[^>]+name=["\']robots["\'][^>]+content=["\']([^"\']+)["\']',
    }
    for key, pat in og_patterns.items():
        m = re.search(pat, html, re.IGNORECASE)
        if m:
            meta[key] = m.group(1).strip()
    return meta


def flatten_jsonld(blocks: list[dict]) -> list[dict]:
    """Mở rộng @graph nếu có, trả về flat list tất cả nodes."""
    flat = []
    for block in blocks:
        if "@graph" in block:
            flat.extend(block["@graph"])
        else:
            flat.append(block)
    return flat


def find_article_jsonld(blocks: list[dict]) -> tuple[dict | None, dict | None]:
    """
    Tìm BlogPosting/Article trong blocks (kể cả trong @graph).
    Trả về (article_node, webpage_node) để dùng image từ WebPage nếu cần.
    """
    article_types = {"Article", "BlogPosting", "NewsArticle", "TechArticle"}
    webpage_types = {"WebPage", "ItemPage", "AboutPage", "ContactPage"}

    flat = flatten_jsonld(blocks)
    article = None
    webpage = None

    for node in flat:
        t = node.get("@type", "")
        types = t if isinstance(t, list) else [t]
        if any(x in article_types for x in types) and article is None:
            article = node
        if any(x in webpage_types for x in types) and webpage is None:
            webpage = node

    # fallback: node đầu tiên có headline
    if not article:
        for node in flat:
            if "headline" in node:
                article = node
                break

    return article, webpage


def slug_from_url(url: str) -> str:
    path = urlparse(url).path.rstrip("/")
    name = path.split("/")[-1]
    name = re.sub(r"\.html?$", "", name)
    name = re.sub(r"[^\w\-]", "_", name)
    return name or "post"


def jsonld_to_md(url: str, lastmod: str, article: dict, meta: dict, all_jsonld: list[dict], webpage: dict | None = None) -> str:
    def g(obj, *keys):
        """Get nested value, trả về '' nếu không có."""
        for k in keys:
            if not isinstance(obj, dict):
                return ""
            obj = obj.get(k, "")
        return obj or ""

    headline = g(article, "headline") or meta.get("og_title") or meta.get("meta_title") or ""
    description = g(article, "description") or meta.get("og_description") or meta.get("meta_description") or ""
    date_published = g(article, "datePublished") or ""
    date_modified = g(article, "dateModified") or lastmod or ""
    canonical_url = g(article, "url") or meta.get("canonical") or meta.get("og_url") or url
    image_raw = article.get("image", "")
    if isinstance(image_raw, dict):
        image = image_raw.get("url", "") or image_raw.get("contentUrl", "")
    elif isinstance(image_raw, list):
        first = image_raw[0] if image_raw else ""
        image = first.get("url", "") if isinstance(first, dict) else first
    else:
        image = image_raw or ""
    # Nếu image chỉ là @id reference → lấy từ WebPage.primaryImageOfPage
    if not image or image.startswith("http") is False:
        if webpage:
            pri = webpage.get("primaryImageOfPage", {})
            image = pri.get("url", "") or pri.get("contentUrl", "") if isinstance(pri, dict) else ""
    if not image:
        image = meta.get("og_image", "")

    author_raw = article.get("author", "")
    if isinstance(author_raw, dict):
        author = author_raw.get("name", "")
    elif isinstance(author_raw, list):
        author = ", ".join(a.get("name", "") if isinstance(a, dict) else a for a in author_raw)
    else:
        author = author_raw or ""

    publisher_raw = article.get("publisher", "")
    publisher = g(publisher_raw, "name") if isinstance(publisher_raw, dict) else (publisher_raw or "")

    keywords_raw = article.get("keywords", "")
    if isinstance(keywords_raw, list):
        keywords = ", ".join(keywords_raw)
    else:
        keywords = keywords_raw or ""

    og_type = meta.get("og_type", "")
    og_site_name = meta.get("og_site_name", "")
    meta_title = meta.get("meta_title", "")
    robots = meta.get("robots", "")

    # build frontmatter YAML-style
    lines = ["---"]
    lines.append(f'url: "{canonical_url}"')
    if headline:
        lines.append(f'headline: "{headline.replace(chr(34), chr(39))}"')
    if description:
        lines.append(f'description: "{description.replace(chr(34), chr(39))}"')
    if meta_title and meta_title != headline:
        lines.append(f'title: "{meta_title.replace(chr(34), chr(39))}"')
    if og_type:
        lines.append(f'og_type: "{og_type}"')
    if og_site_name:
        lines.append(f'og_site_name: "{og_site_name}"')
    if image:
        lines.append(f'image: "{image}"')
    if date_published:
        lines.append(f'datePublished: "{date_published}"')
    if date_modified:
        lines.append(f'dateModified: "{date_modified}"')
    if author:
        lines.append(f'author: "{author}"')
    if publisher:
        lines.append(f'publisher: "{publisher}"')
    if keywords:
        lines.append(f'keywords: "{keywords}"')
    if robots:
        lines.append(f'robots: "{robots}"')
    lines.append("---")
    lines.append("")
    lines.append(f"# {headline}")
    lines.append("")
    if description:
        lines.append(f"> {description}")
        lines.append("")

    # Dump toàn bộ JSON-LD blocks vào cuối để tham khảo
    lines.append("## Raw JSON-LD")
    lines.append("")
    lines.append("```json")
    lines.append(json.dumps(all_jsonld, ensure_ascii=False, indent=2))
    lines.append("```")
    lines.append("")

    return "\n".join(lines)


def process_url(entry: dict, output_dir: Path) -> bool:
    url = entry["url"]
    lastmod = entry.get("lastmod", "")
    slug = slug_from_url(url)
    out_path = output_dir / f"{slug}.md"

    print(f"  -> {slug}.md")

    html = fetch_html(url)
    if not html:
        return False

    all_jsonld = extract_jsonld(html)
    meta = extract_meta_tags(html)
    article, webpage = find_article_jsonld(all_jsonld)

    if not article:
        article = {}
        print(f"  [WARN] Không tìm thấy Article JSON-LD, dùng meta tags")

    md_content = jsonld_to_md(url, lastmod, article, meta, all_jsonld, webpage)
    out_path.write_text(md_content, encoding="utf-8")
    return True


# ─── TEST 1 URL ────────────────────────────────────────────────────────────────

def test_single(url: str):
    print(f"\n=== TEST URL ===")
    print(f"URL: {url}\n")

    html = fetch_html(url)
    if not html:
        print("Fetch thất bại.")
        return

    all_jsonld = extract_jsonld(html)
    meta = extract_meta_tags(html)

    flat = flatten_jsonld(all_jsonld)
    print(f"Tìm thấy {len(all_jsonld)} JSON-LD block(s), {len(flat)} node(s) sau khi flatten")

    article, webpage = find_article_jsonld(all_jsonld)
    print(f"Article type: {article.get('@type') if article else 'None'}")
    print(f"WebPage type: {webpage.get('@type') if webpage else 'None'}")

    print("\n--- Meta tags ---")
    print(json.dumps(meta, ensure_ascii=False, indent=2))

    if article:
        md = jsonld_to_md(url, "", article, meta, all_jsonld, webpage)
        print("\n--- Output .md preview ---")
        print(md[:3000])
    else:
        print("\n[WARN] Không có Article JSON-LD block.")
        print("\n--- Raw JSON-LD ---")
        print(json.dumps(all_jsonld, ensure_ascii=False, indent=2))


# ─── CRAWL TOÀN BỘ ─────────────────────────────────────────────────────────────

def crawl_all():
    output_dir = Path(OUTPUT_DIR)
    output_dir.mkdir(exist_ok=True)

    entries = parse_sitemap(SITEMAP_FILE)
    total = len(entries)
    print(f"Sitemap: {total} URLs\nOutput: {output_dir.resolve()}\n")

    ok = fail = skip = 0
    for i, entry in enumerate(entries, 1):
        url = entry["url"]
        slug = slug_from_url(url)
        out_path = output_dir / f"{slug}.md"

        if out_path.exists():
            print(f"[{i}/{total}] SKIP (exists) {slug}.md")
            skip += 1
            continue

        print(f"[{i}/{total}] {url}")
        success = process_url(entry, output_dir)
        if success:
            ok += 1
        else:
            fail += 1

        if i < total:
            time.sleep(DELAY_SECONDS)

    print(f"\n=== DONE: {ok} OK | {fail} FAIL | {skip} SKIP ===")


# ─── ENTRY POINT ───────────────────────────────────────────────────────────────

if __name__ == "__main__":
    import sys

    if len(sys.argv) > 1 and sys.argv[1] == "test":
        # python crawl_posts.py test [url]
        test_url = sys.argv[2] if len(sys.argv) > 2 else "https://knxstore.vn/huong-dan-cap-nhat-firmware-va-main-program-kanonbus-kac005-moi-nhat-2026.html"
        test_single(test_url)
    else:
        # python crawl_posts.py  → crawl toàn bộ
        crawl_all()
