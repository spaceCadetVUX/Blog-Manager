"""
Enhanced crawler knxstore.vn
- JSON-LD: headline, description, articleBody, articleSection, keywords, mentions, breadcrumb
- HTML: internal links từ <a href> trong body bài viết
- Yêu cầu: pip install beautifulsoup4 lxml
"""

import xml.etree.ElementTree as ET
import json
import re
import time
from pathlib import Path
from urllib.parse import urlparse
from urllib.request import urlopen, Request
from urllib.error import URLError, HTTPError

try:
    from bs4 import BeautifulSoup
except ImportError:
    raise SystemExit("[ERROR] Thiếu thư viện: pip install beautifulsoup4 lxml")

SITEMAP_FILE = "sitemap-post.xml"
OUTPUT_DIR = "posts_md"
DELAY_SECONDS = 1.0
BASE_DOMAIN = "knxstore.vn"

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml",
    "Accept-Language": "vi-VN,vi;q=0.9,en;q=0.8",
}

# Các path không phải bài viết — bỏ qua khi extract internal links
SKIP_PATHS = {"/", "/blogs", "/blogs/kien-thuc", "/blogs/matter", "/blogs/casambi",
              "/blogs/dali", "/blogs/knx", "/blogs/chieu-sang", "/blogs/smarthome"}


# ─── FETCH ─────────────────────────────────────────────────────────────────────

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
            try:
                return raw.decode("utf-8")
            except UnicodeDecodeError:
                return raw.decode("latin-1")
    except (URLError, HTTPError) as e:
        print(f"  [ERROR] Fetch failed: {e}")
        return None


# ─── JSON-LD ────────────────────────────────────────────────────────────────────

def extract_jsonld(html: str) -> list[dict]:
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
    meta = {}
    og_patterns = {
        "og_title":       r'<meta[^>]+property=["\']og:title["\'][^>]+content=["\']([^"\']+)["\']',
        "og_description": r'<meta[^>]+property=["\']og:description["\'][^>]+content=["\']([^"\']+)["\']',
        "og_image":       r'<meta[^>]+property=["\']og:image["\'][^>]+content=["\']([^"\']+)["\']',
        "og_url":         r'<meta[^>]+property=["\']og:url["\'][^>]+content=["\']([^"\']+)["\']',
        "og_type":        r'<meta[^>]+property=["\']og:type["\'][^>]+content=["\']([^"\']+)["\']',
        "og_site_name":   r'<meta[^>]+property=["\']og:site_name["\'][^>]+content=["\']([^"\']+)["\']',
        "meta_title":     r'<title[^>]*>([^<]+)</title>',
        "meta_description": r'<meta[^>]+name=["\']description["\'][^>]+content=["\']([^"\']+)["\']',
        "canonical":      r'<link[^>]+rel=["\']canonical["\'][^>]+href=["\']([^"\']+)["\']',
        "robots":         r'<meta[^>]+name=["\']robots["\'][^>]+content=["\']([^"\']+)["\']',
    }
    for key, pat in og_patterns.items():
        m = re.search(pat, html, re.IGNORECASE)
        if m:
            meta[key] = m.group(1).strip()
    return meta


def flatten_jsonld(blocks: list[dict]) -> list[dict]:
    flat = []
    for block in blocks:
        if "@graph" in block:
            flat.extend(block["@graph"])
        else:
            flat.append(block)
    return flat


def find_article_jsonld(blocks: list[dict]) -> tuple[dict | None, dict | None]:
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

    if not article:
        for node in flat:
            if "headline" in node:
                article = node
                break

    return article, webpage


# ─── HTML PARSING ───────────────────────────────────────────────────────────────

def extract_internal_links(html: str, current_url: str) -> list[dict]:
    """Extract tất cả <a href> trỏ đến bài viết knxstore.vn (*.html)."""
    soup = BeautifulSoup(html, "lxml")

    # Dùng <main> để bao gồm cả article body lẫn related posts section.
    # Fallback theo thứ tự nếu không có <main>.
    body_el = (
        soup.find("main") or
        soup.find(class_=re.compile(r"main[-_]content|content[-_]wrapper", re.I)) or
        soup.find("article") or
        soup.body or
        soup
    )

    # seen_urls → {clean_url: index trong links list} để update anchor nếu rỗng
    seen: dict[str, int] = {}
    links: list[dict] = []
    current_clean = current_url.split("#")[0].split("?")[0].rstrip("/")

    for a in body_el.find_all("a", href=True):
        href = a["href"].strip()

        # Normalize relative URLs
        if href.startswith("/"):
            href = f"https://{BASE_DOMAIN}{href}"
        elif not href.startswith("http"):
            continue

        parsed = urlparse(href)
        if BASE_DOMAIN not in parsed.netloc:
            continue

        # Chỉ lấy link bài viết — blog post URL kết thúc bằng .html
        path = parsed.path.rstrip("/")
        if not path.endswith(".html"):
            continue

        # Bỏ qua self-link
        clean_url = href.split("#")[0].split("?")[0].rstrip("/")
        if clean_url == current_clean:
            continue

        anchor_text = a.get_text(strip=True)[:200]
        slug = re.sub(r"\.html?$", "", path.split("/")[-1])
        slug = re.sub(r"[^\w\-]", "_", slug)

        if clean_url in seen:
            # URL đã có — update anchor nếu entry cũ rỗng
            if not links[seen[clean_url]]["anchor"] and anchor_text:
                links[seen[clean_url]]["anchor"] = anchor_text
        else:
            seen[clean_url] = len(links)
            links.append({"url": clean_url, "slug": slug, "anchor": anchor_text})

    return links


# ─── SERIALIZE ─────────────────────────────────────────────────────────────────

def slug_from_url(url: str) -> str:
    path = urlparse(url).path.rstrip("/")
    name = path.split("/")[-1]
    name = re.sub(r"\.html?$", "", name)
    name = re.sub(r"[^\w\-]", "_", name)
    return name or "post"


def safe_str(s: str) -> str:
    """Escape dấu nháy kép trong YAML string."""
    return s.replace('"', "'") if s else ""


def jsonld_to_md(url: str, lastmod: str, article: dict, meta: dict, all_jsonld: list[dict],
                 webpage: dict | None = None, internal_links: list[dict] | None = None) -> str:
    def g(obj, *keys):
        for k in keys:
            if not isinstance(obj, dict):
                return ""
            obj = obj.get(k, "")
        return obj or ""

    # Core fields
    headline     = g(article, "headline") or meta.get("og_title") or meta.get("meta_title") or ""
    description  = g(article, "description") or meta.get("og_description") or meta.get("meta_description") or ""
    date_pub     = g(article, "datePublished") or ""
    date_mod     = g(article, "dateModified") or lastmod or ""
    canonical    = g(article, "url") or meta.get("canonical") or meta.get("og_url") or url

    # Image
    image_raw = article.get("image", "")
    if isinstance(image_raw, dict):
        image = image_raw.get("url", "") or image_raw.get("contentUrl", "")
    elif isinstance(image_raw, list):
        first = image_raw[0] if image_raw else ""
        image = first.get("url", "") if isinstance(first, dict) else first
    else:
        image = image_raw or ""
    if not image or not image.startswith("http"):
        if webpage:
            pri = webpage.get("primaryImageOfPage", {})
            image = (pri.get("url", "") or pri.get("contentUrl", "")) if isinstance(pri, dict) else ""
    if not image:
        image = meta.get("og_image", "")

    # Author / Publisher
    author_raw = article.get("author", "")
    if isinstance(author_raw, dict):
        author = author_raw.get("name", "")
    elif isinstance(author_raw, list):
        author = ", ".join(a.get("name", "") if isinstance(a, dict) else a for a in author_raw)
    else:
        author = author_raw or ""

    publisher_raw = article.get("publisher", "")
    publisher = g(publisher_raw, "name") if isinstance(publisher_raw, dict) else (publisher_raw or "")

    # Keywords — normalize thành list
    kw_raw = article.get("keywords", "")
    if isinstance(kw_raw, list):
        keywords = [k for k in kw_raw if k]
    elif kw_raw:
        keywords = [k.strip() for k in kw_raw.split(",") if k.strip()]
    else:
        keywords = []

    # Article section & body
    article_section = article.get("articleSection", "")
    article_body    = article.get("articleBody", "")
    word_count      = len(article_body.split()) if article_body else 0

    # Mentions
    mentions_raw = article.get("mentions", [])
    if isinstance(mentions_raw, list):
        mentions = [m.get("name", "") if isinstance(m, dict) else str(m) for m in mentions_raw]
        mentions = [m for m in mentions if m]
    else:
        mentions = []

    # Breadcrumb từ WebPage node
    breadcrumb = []
    if webpage:
        bc = webpage.get("breadcrumb", {})
        items = bc.get("itemListElement", []) if isinstance(bc, dict) else []
        for item in items:
            if isinstance(item, dict) and item.get("name"):
                breadcrumb.append({"name": item["name"], "url": item.get("item", "")})

    # ─── Build frontmatter ───────────────────────────────────────────────────
    lines = ["---"]
    lines.append(f'url: "{canonical}"')
    if headline:
        lines.append(f'headline: "{safe_str(headline)}"')
    if description:
        lines.append(f'description: "{safe_str(description)}"')
    meta_title = meta.get("meta_title", "")
    if meta_title and meta_title != headline:
        lines.append(f'title: "{safe_str(meta_title)}"')
    og_site_name = meta.get("og_site_name", "")
    if og_site_name:
        lines.append(f'og_site_name: "{og_site_name}"')
    if image:
        lines.append(f'image: "{image}"')
    if date_pub:
        lines.append(f'datePublished: "{date_pub}"')
    if date_mod:
        lines.append(f'dateModified: "{date_mod}"')
    if author:
        lines.append(f'author: "{author}"')
    if publisher:
        lines.append(f'publisher: "{publisher}"')
    if article_section:
        lines.append(f'articleSection: "{article_section}"')
    if word_count:
        lines.append(f'word_count: {word_count}')
    if keywords:
        lines.append(f'keywords: {json.dumps(keywords, ensure_ascii=False)}')
    if mentions:
        lines.append(f'mentions: {json.dumps(mentions, ensure_ascii=False)}')
    robots = meta.get("robots", "")
    if robots:
        lines.append(f'robots: "{robots}"')

    if breadcrumb:
        lines.append("breadcrumb:")
        for bc_item in breadcrumb:
            lines.append(f'  - name: "{safe_str(bc_item["name"])}"')
            if bc_item["url"]:
                lines.append(f'    url: "{bc_item["url"]}"')

    if internal_links:
        lines.append("internal_links:")
        for lnk in internal_links:
            lines.append(f'  - url: "{lnk["url"]}"')
            lines.append(f'    slug: "{lnk["slug"]}"')
            if lnk["anchor"]:
                lines.append(f'    anchor: "{safe_str(lnk["anchor"])}"')

    lines.append("---")
    lines.append("")
    lines.append(f"# {headline}")
    lines.append("")
    if description:
        lines.append(f"> {description}")
        lines.append("")

    if article_body:
        lines.append("## Article Body")
        lines.append("")
        lines.append(article_body.strip())
        lines.append("")

    lines.append("## Raw JSON-LD")
    lines.append("")
    lines.append("```json")
    lines.append(json.dumps(all_jsonld, ensure_ascii=False, indent=2))
    lines.append("```")
    lines.append("")

    return "\n".join(lines)


# ─── PROCESS ────────────────────────────────────────────────────────────────────

def process_url(entry: dict, output_dir: Path) -> bool:
    url = entry["url"]
    lastmod = entry.get("lastmod", "")
    slug = slug_from_url(url)
    out_path = output_dir / f"{slug}.md"

    html = fetch_html(url)
    if not html:
        return False

    all_jsonld     = extract_jsonld(html)
    meta           = extract_meta_tags(html)
    article, webpage = find_article_jsonld(all_jsonld)
    internal_links = extract_internal_links(html, url)

    if not article:
        article = {}
        print(f"  [WARN] Không tìm thấy Article JSON-LD")

    link_count = len(internal_links)
    wc = len(article.get("articleBody", "").split()) if article else 0
    print(f"  -> {slug}.md | {wc} words | {link_count} internal links")

    md_content = jsonld_to_md(url, lastmod, article, meta, all_jsonld, webpage, internal_links)
    out_path.write_text(md_content, encoding="utf-8")
    return True


# ─── TEST ────────────────────────────────────────────────────────────────────────

def test_single(url: str):
    print(f"\n=== TEST: {url} ===\n")

    html = fetch_html(url)
    if not html:
        print("Fetch thất bại.")
        return

    all_jsonld = extract_jsonld(html)
    meta       = extract_meta_tags(html)
    flat       = flatten_jsonld(all_jsonld)
    print(f"JSON-LD: {len(all_jsonld)} block(s), {len(flat)} node(s)")

    article, webpage = find_article_jsonld(all_jsonld)
    print(f"Article type : {article.get('@type') if article else 'None'}")
    print(f"WebPage type : {webpage.get('@type') if webpage else 'None'}")

    internal_links = extract_internal_links(html, url)
    print(f"\nInternal links: {len(internal_links)}")
    for lnk in internal_links[:15]:
        print(f"  [{lnk['anchor'][:60]}] -> {lnk['slug']}")

    if article:
        wc = len(article.get("articleBody", "").split())
        print(f"\nWord count    : {wc}")
        print(f"Section       : {article.get('articleSection', 'N/A')}")
        print(f"Keywords      : {article.get('keywords', [])}")
        mentions = [m.get("name", "") if isinstance(m, dict) else m for m in article.get("mentions", [])]
        print(f"Mentions      : {mentions}")

        md = jsonld_to_md(url, "", article, meta, all_jsonld, webpage, internal_links)
        print("\n--- Frontmatter preview ---")
        end = md.find("---", 4)
        print(md[:end + 3] if end > 0 else md[:1500])


# ─── CRAWL ALL ──────────────────────────────────────────────────────────────────

def crawl_all(force: bool = False):
    output_dir = Path(OUTPUT_DIR)
    output_dir.mkdir(exist_ok=True)

    entries = parse_sitemap(SITEMAP_FILE)
    total = len(entries)
    mode = "FORCE RECRAWL" if force else "INCREMENTAL"
    print(f"Sitemap: {total} URLs | Mode: {mode}\nOutput: {output_dir.resolve()}\n")

    ok = fail = skip = 0
    for i, entry in enumerate(entries, 1):
        url   = entry["url"]
        slug  = slug_from_url(url)
        out_path = output_dir / f"{slug}.md"

        if out_path.exists() and not force:
            print(f"[{i}/{total}] SKIP  {slug}")
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


# ─── ENTRY POINT ────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    import sys

    cmd = sys.argv[1] if len(sys.argv) > 1 else ""

    if cmd == "test":
        url = sys.argv[2] if len(sys.argv) > 2 else \
            "https://knxstore.vn/6-loai-cam-bien-quan-trong-trong-he-thong-chieu-sang-thong-minh.html"
        test_single(url)

    elif cmd == "recrawl":
        # Force overwrite tất cả file đã có
        crawl_all(force=True)

    else:
        # Chỉ crawl file chưa có (incremental)
        crawl_all(force=False)
