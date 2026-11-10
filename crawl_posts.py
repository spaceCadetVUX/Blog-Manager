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
import unicodedata
from pathlib import Path
from urllib.parse import urlparse, urljoin
from urllib.request import urlopen, Request
from urllib.error import URLError, HTTPError

try:
    from bs4 import BeautifulSoup
    from bs4.element import Comment
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
        # Bỏ /author/*, /blogs/* ... (sitemap mới lẫn trang không phải bài viết)
        if loc and is_post_url(loc):
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

def extract_product_links(html: str) -> list[dict]:
    """Extract Shopify product links embedded trong thân bài (không lấy menu header/footer)."""
    soup = BeautifulSoup(html, "lxml")
    seen: dict[str, bool] = {}
    products: list[dict] = []

    body_el = find_article_body(soup)
    if body_el is None:
        return []

    for a in body_el.find_all("a", href=True):
        href = a["href"].strip()
        if href.startswith("/"):
            href = f"https://{BASE_DOMAIN}{href}"
        elif not href.startswith("http"):
            continue

        parsed = urlparse(href)
        if BASE_DOMAIN not in parsed.netloc:
            continue
        if "/products/" not in parsed.path:
            continue

        clean_url = href.split("?")[0].split("#")[0]
        if clean_url in seen:
            continue
        seen[clean_url] = True

        name = a.get_text(strip=True)[:200]
        img_src = None
        img_tag = a.find("img")
        if img_tag:
            img_src = img_tag.get("src") or img_tag.get("data-src") or img_tag.get("data-lazy-src")
            if img_src and img_src.startswith("//"):
                img_src = "https:" + img_src
            if img_src and not img_src.startswith("http"):
                img_src = None
            if len(name) < 3 and img_tag.get("alt"):
                name = img_tag["alt"].strip()[:200]

        product = {"url": clean_url, "name": name}
        if img_src:
            product["image"] = img_src
        products.append(product)

    return products


POST_PATH_RE = re.compile(r"^/[^/]+\.html$")


def is_post_url(url: str) -> bool:
    """URL bài viết knxstore.vn: https://knxstore.vn/<slug>.html (1 segment).
    Loại /author/*, /blogs/*, /solution/*, /products/*..."""
    p = urlparse(url)
    return p.netloc in (BASE_DOMAIN, f"www.{BASE_DOMAIN}") and bool(POST_PATH_RE.match(p.path))


def find_article_body(soup):
    """Vùng nội dung bài viết thật (template knxstore.vn hiện tại: <div id="article-body">).
    KHÔNG fallback về <body>/<main>/<article>: các vùng đó chứa menu header, footer và
    widget dùng chung toàn site → link nhiễm (đã gặp: 10 link giống hệt nhau ở 160/231 bài)."""
    return (
        soup.find(id="article-body")
        or soup.find(class_="article-body")
        or soup.find(attrs={"itemprop": "articleBody"})
    )


def extract_article_text(html: str) -> str:
    """Text thuần của thân bài từ #article-body (JSON-LD template mới không còn articleBody)."""
    soup = BeautifulSoup(html, "lxml")
    body_el = find_article_body(soup)
    if body_el is None:
        return ""
    for t in body_el.find_all(["script", "style", "noscript"]):
        t.decompose()
    lines = [ln.strip() for ln in body_el.get_text("\n").splitlines()]
    return "\n".join(ln for ln in lines if ln)


def ensure_article_body(article: dict, html: str) -> dict:
    """Trả bản sao của article có articleBody; nếu JSON-LD thiếu thì lấy từ HTML.
    Dùng bản sao để không nhét thân bài vào khối 'Raw JSON-LD' (cùng object với all_jsonld)."""
    article = article or {}
    if article.get("articleBody"):
        return article
    return {**article, "articleBody": extract_article_text(html)}


def extract_internal_links(html: str, current_url: str) -> list[dict]:
    """Extract <a href> trỏ đến bài viết knxstore.vn (*.html) nằm TRONG thân bài.
    Không tìm thấy vùng thân bài → trả [] (không đoán)."""
    soup = BeautifulSoup(html, "lxml")
    body_el = find_article_body(soup)
    if body_el is None:
        return []

    # seen_urls → {clean_url: index trong links list} để update anchor nếu rỗng
    seen: dict[str, int] = {}
    links: list[dict] = []
    cur = urlparse(current_url)
    current_clean = f"https://{BASE_DOMAIN}{cur.path}".rstrip("/")

    for a in body_el.find_all("a", href=True):
        href = urljoin(current_url, a["href"].strip())

        parsed = urlparse(href)
        if parsed.scheme not in ("http", "https"):
            continue
        # Chỉ lấy bài viết: https://knxstore.vn/<slug>.html
        if not is_post_url(href):
            continue
        path = parsed.path

        # Bỏ qua self-link. Chuẩn hoá về https://knxstore.vn (bỏ www/http, query, fragment)
        clean_url = f"https://{BASE_DOMAIN}{path}"
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


# ─── RELATED LINKS ("Bài viết liên quan") ──────────────────────────────────────
# Khối "Bài viết liên quan" của trang live nằm NGOÀI #article-body (div.mt-14 + tiêu đề + 4 card <a>).
# MCP get_post không trả dữ liệu này → phải lấy từ HTML live. Không quét <body>/<main>: menu header
# ("blogs" liệt kê bài mới nhất) và footer chứa link /<slug>.html không phải related.

RELATED_HEADING = "bài viết liên quan"
_NON_TEXT_TAGS = {"script", "style", "title", "noscript", "template"}
_CHROME_TAGS = {"header", "footer", "nav"}                  # menu/footer dùng chung toàn site
_TOO_BROAD_TAGS = {"html", "body", "main", "article", "[document]"}
RELATED_MAX_CLIMB = 4                                       # số cấp tổ tiên tối đa đi lên từ tiêu đề


def _norm_text(s: str) -> str:
    return re.sub(r"\s+", " ", unicodedata.normalize("NFC", s or "")).strip()


def _is_related_heading(text: str) -> bool:
    return _norm_text(text).strip(" :").casefold() == RELATED_HEADING


def _has_ancestor(node, pred) -> bool:
    return any(pred(p) for p in node.parents)


def _card_title(a) -> str:
    """Tiêu đề card: heading (h1-h6) > <p> đầu tiên > alt ảnh > text link. Card có thêm span section + ngày đăng
    nên KHÔNG dùng get_text() cả link làm anchor nếu còn lựa chọn khác."""
    for sel in (a.find(["h1", "h2", "h3", "h4", "h5", "h6"]), a.find("p")):
        if sel is not None and _norm_text(sel.get_text(" ")):
            return _norm_text(sel.get_text(" "))[:200]
    img = a.find("img", alt=True)
    if img is not None and _norm_text(img["alt"]):
        return _norm_text(img["alt"])[:200]
    return _norm_text(a.get_text(" "))[:200]


def _post_links_in(block, current_url: str) -> list[dict]:
    cur_path = urlparse(current_url).path.rstrip("/")
    seen: dict[str, int] = {}
    links: list[dict] = []
    for a in block.find_all("a", href=True):
        if _has_ancestor(a, lambda p: p is not block and p.name in _CHROME_TAGS):
            continue
        href = urljoin(current_url, a["href"].strip())
        if not is_post_url(href):                           # chỉ https://knxstore.vn/<slug>.html
            continue
        path = urlparse(href).path
        if path.rstrip("/") == cur_path:                    # self-link
            continue
        clean_url = f"https://{BASE_DOMAIN}{path}"
        anchor = _card_title(a)
        if clean_url in seen:
            if not links[seen[clean_url]]["anchor"] and anchor:
                links[seen[clean_url]]["anchor"] = anchor
            continue
        seen[clean_url] = len(links)
        links.append({"url": clean_url, "slug": slug_from_url(clean_url), "anchor": anchor})
    return links


def extract_related_links(html: str, current_url: str) -> list[dict]:
    """Link trong khối "Bài viết liên quan" → [{url, slug, anchor, position(từ 1)}].
    Tìm phần tử có text đúng "Bài viết liên quan" (không phân biệt hoa thường; bỏ qua script/style/title và mọi
    phần tử trong <header>/<footer>/<nav> hoặc trong #article-body), rồi đi lên tổ tiên gần nhất chứa ≥1 link bài
    (tối đa RELATED_MAX_CLIMB cấp; dừng nếu chạm <main>/<body>/... hoặc tổ tiên chứa cả #article-body).
    Không thấy khối → [] (không đoán)."""
    soup = BeautifulSoup(html, "lxml")
    body_el = find_article_body(soup)

    for s in soup.find_all(string=True):
        if isinstance(s, Comment) or s.parent is None or s.parent.name in _NON_TEXT_TAGS:
            continue
        if not _is_related_heading(str(s)):
            continue
        heading = s.parent
        if _has_ancestor(heading, lambda p: p.name in _CHROME_TAGS):
            continue
        if body_el is not None and (heading is body_el or _has_ancestor(heading, lambda p: p is body_el)):
            continue                                        # tiêu đề do tác giả gõ trong thân bài, không phải khối site

        node = heading
        for _ in range(RELATED_MAX_CLIMB):
            node = node.parent
            if node is None or node.name in _TOO_BROAD_TAGS or node.name in _CHROME_TAGS:
                break
            if body_el is not None and _has_ancestor(body_el, lambda p: p is node):
                break                                       # đã leo quá cao: chứa luôn thân bài
            links = _post_links_in(node, current_url)
            if links:
                for i, lnk in enumerate(links, 1):
                    lnk["position"] = i
                return links
    return []


def related_from_html(html: str, current_url: str) -> list[dict] | None:
    """extract_related_links + kiểm tra trang hợp lệ: HTML không có #article-body (template lạ, trang lỗi,
    bị chặn bot) → None (KHÔNG kết luận được là "không có related" → giữ dữ liệu cũ)."""
    if find_article_body(BeautifulSoup(html, "lxml")) is None:
        return None
    return extract_related_links(html, current_url)


def fetch_html_retry(url: str, attempts: int = 3, timeout: int = 20) -> tuple[str | None, str]:
    """Tải HTML live (User-Agent trình duyệt), retry khi lỗi mạng/5xx/429 với backoff 1s,2s.
    404/410/4xx khác → dừng ngay. Trả (html, '') hoặc (None, lý do)."""
    err = ""
    for i in range(attempts):
        try:
            with urlopen(Request(url, headers=HEADERS), timeout=timeout) as resp:
                raw = resp.read()
                try:
                    return raw.decode("utf-8"), ""
                except UnicodeDecodeError:
                    return raw.decode("latin-1"), ""
        except HTTPError as e:
            err = f"HTTP {e.code}"
            if e.code not in (429, 500, 502, 503, 504):
                break
        except (URLError, TimeoutError, OSError) as e:
            err = f"{type(e).__name__}: {str(getattr(e, 'reason', e))[:100]}"
        if i < attempts - 1:
            time.sleep(1.0 * (2 ** i))
    return None, err


def live_related(url: str) -> dict:
    """Tải trang live + trích related. status: 'ok' (có link) | 'no_related' (trang hợp lệ, không có khối)
    | 'failed' (tải lỗi / trang không hợp lệ → links=None: người gọi phải GIỮ related cũ)."""
    html, err = fetch_html_retry(url)
    if html is None:
        return {"status": "failed", "links": None, "error": err}
    links = related_from_html(html, url)
    if links is None:
        return {"status": "failed", "links": None, "error": "trang live không có #article-body (template lạ / bị chặn)"}
    return {"status": "ok" if links else "no_related", "links": links, "error": ""}


def related_links_md_lines(related: list[dict] | None) -> list[str]:
    """Dòng frontmatter cho khóa related_links. None → [] (không ghi khóa: chưa biết → import giữ nguyên DB);
    [] → 'related_links: []' (đã kiểm tra: trang không có khối → import thay bằng rỗng)."""
    if related is None:
        return []
    if not related:
        return ["related_links: []"]
    lines = ["related_links:"]
    for i, lnk in enumerate(related, 1):
        lines.append(f"  - url: {_yq(lnk['url'])}")
        lines.append(f"    slug: {_yq(lnk['slug'])}")
        if lnk.get("anchor"):
            lines.append(f"    anchor: {_yq(lnk['anchor'])}")
        lines.append(f"    position: {int(lnk.get('position') or i)}")
    return lines


def set_md_related_links(md: str, related: list[dict] | None) -> str | None:
    """Thay/ghi khối related_links trong frontmatter của md, KHÔNG đụng phần còn lại. related=None (chưa biết) →
    trả md nguyên vẹn. None nếu md không có frontmatter."""
    if related is None:
        return md
    lines = md.split("\n")
    if not lines or lines[0].rstrip("\r") != "---":
        return None
    end = next((i for i in range(1, len(lines)) if lines[i].rstrip("\r") == "---"), None)
    if end is None:
        return None
    front, out, skipping = lines[1:end], [], False
    for ln in front:
        if ln.startswith("related_links:"):
            skipping = True
            continue
        if skipping and (ln.startswith((" ", "\t", "- ")) or not ln.strip()):
            continue
        skipping = False
        out.append(ln)
    out += related_links_md_lines(related)
    return "\n".join([lines[0]] + out + lines[end:])


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
                 webpage: dict | None = None, internal_links: list[dict] | None = None,
                 product_links: list[dict] | None = None,
                 related_links: list[dict] | None = None) -> str:
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

    # Author / Publisher — template mới chỉ ghi tham chiếu {"@id": ...} tới node Person/Organization
    nodes_by_id = {n["@id"]: n for n in flatten_jsonld(all_jsonld) if isinstance(n, dict) and "@id" in n}

    def resolve(x):
        if isinstance(x, dict) and "name" not in x and x.get("@id") in nodes_by_id:
            return nodes_by_id[x["@id"]]
        return x

    author_raw = resolve(article.get("author", ""))
    if isinstance(author_raw, dict):
        author = author_raw.get("name", "")
    elif isinstance(author_raw, list):
        names = []
        for a in author_raw:
            a = resolve(a)
            names.append(a.get("name", "") if isinstance(a, dict) else a)
        author = ", ".join(n for n in names if n)
    else:
        author = author_raw or ""

    publisher_raw = resolve(article.get("publisher", ""))
    publisher = (publisher_raw.get("name") or publisher_raw.get("legalName") or "") if isinstance(publisher_raw, dict) else (publisher_raw or "")

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

    if product_links:
        lines.append(f'products: {json.dumps(product_links, ensure_ascii=False)}')

    if internal_links:
        lines.append("internal_links:")
        for lnk in internal_links:
            lines.append(f'  - url: "{lnk["url"]}"')
            lines.append(f'    slug: "{lnk["slug"]}"')
            if lnk["anchor"]:
                lines.append(f'    anchor: "{safe_str(lnk["anchor"])}"')

    lines.extend(related_links_md_lines(related_links))

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


# ─── MCP → MARKDOWN ────────────────────────────────────────────────────────────
# Nguồn MCP (get_post) thay cho crawl HTML/sitemap. Cùng định dạng frontmatter để
# backend/import_posts.py đọc y như file md từ jsonld_to_md.

MCP_SITE_URL = f"https://{BASE_DOMAIN}"
MCP_MEDIA_BASE = MCP_SITE_URL          # coverImage tương đối (/media/...) → ghép base này
MCP_PUBLISHER = "KNXStore.vn"
MCP_BREADCRUMB_BLOG = "Tin tức"        # khớp breadcrumb hiện có trong DB (JSON-LD live)


def _yq(s) -> str:
    """Chuỗi YAML double-quoted an toàn (giữ nguyên dấu nháy kép, xuống dòng, backslash)."""
    out = json.dumps("" if s is None else str(s), ensure_ascii=False)
    # NEL / LS / PS là line-break trong YAML → escape để scalar không bị gập dòng
    return out.replace("\u0085", "\\u0085").replace("\u2028", "\\u2028").replace("\u2029", "\\u2029")


# Shortcode sản phẩm trong contentHtml: <p>{products:[2640,3426]}</p> hoặc {products:[slug-a,slug-b]}
# (trang live render thành card sản phẩm; get_post không trả sẵn link /products/...)
MCP_PRODUCTS_SHORTCODE = re.compile(r"\{products\s*:\s*\[([^\]]*)\]\s*\}")


def build_product_lookup(rows) -> dict:
    """rows: iterable (id, name, url) từ bảng products (chỉ đọc) → {id:int | slug:str → {url,name}}.
    `id` PHẢI là ID cũ/legacy (products.id): id số trong shortcode {products:[...]} thuộc hệ này (đã đối chiếu với
    trang live: 1138/1148 lượt khớp), KHÔNG phải ID mới của site (products.site_id / MCP id — va chạm, vd 79).
    Dùng backend.product_sync.load_product_lookup(conn) để dựng đúng (lọc sản phẩm đang bán)."""
    lookup: dict = {}
    for pid, name, url in rows:
        if not url:
            continue
        entry = {"url": url, "name": name or ""}
        if pid is not None:
            lookup[int(pid)] = entry
        if "/products/" in url:
            lookup[url.rsplit("/products/", 1)[-1].strip("/")] = entry
    return lookup


def _expand_products_shortcode(html: str, lookup: dict, unresolved: list, resolver=None) -> str:
    """Thay shortcode bằng <a href="/products/..."> để extract_product_links giữ đúng thứ tự xuất hiện."""
    def repl(m):
        anchors = []
        for tok in (t.strip().strip("\"'") for t in m.group(1).split(",")):
            if not tok:
                continue
            entry = lookup.get(int(tok) if tok.isdigit() else tok) or (resolver(tok) if resolver else None)
            if entry:
                anchors.append(f'<a href="{entry["url"]}">{entry["name"] or entry["url"]}</a>')
            else:
                unresolved.append(tok)
        return "<div>" + "".join(anchors) + "</div>"
    return MCP_PRODUCTS_SHORTCODE.sub(repl, html)


def mcp_post_parts(post: dict, product_lookup: dict | None = None,
                   fallback_products: list | None = None, product_resolver=None) -> dict:
    """Trích internal_links / products / article_body / word_count từ get_post.
    contentHtml là fragment thân bài → bọc <div id="article-body"> để dùng lại extractor của trang live.
    product_lookup: kết quả build_product_lookup() để giải shortcode {products:[...]}.
    product_resolver: callable(token) -> {"url","name"} | None cho token không có trong lookup
    (vd. sản phẩm mới chưa có trong bảng products — mcp_client.make_product_resolver()).
    fallback_products: products đang có trong DB — chỉ dùng bổ sung khi shortcode có id/slug không giải được
    (tránh mất dữ liệu cũ); token không giải được trả về trong 'unresolved_products'."""
    url = post.get("url") or f"{MCP_SITE_URL}/{post['slug']}.html"
    content = post.get("contentHtml") or ""
    html = '<div id="article-body">' + MCP_PRODUCTS_SHORTCODE.sub("", content) + "</div>"

    text = extract_article_text(html)
    faq_blocks = []
    for f in sorted(post.get("faqs") or [], key=lambda x: (x or {}).get("position") or 0):
        q = " ".join(str((f or {}).get("question") or "").split())
        a = " ".join(str((f or {}).get("answer") or "").split())
        if q or a:
            faq_blocks.append("\n".join(x for x in (q, a) if x))
    article_body = "\n".join(x for x in [text, "\n\n".join(faq_blocks)] if x)
    # import_posts cắt Article Body tại dòng "## " tiếp theo → chặn dòng thân bài bắt đầu bằng "## "
    article_body = re.sub(r"(?m)^(## )", r"\\\1", article_body)

    unresolved: list = []
    prod_html = '<div id="article-body">' + _expand_products_shortcode(content, product_lookup or {}, unresolved, product_resolver) + "</div>"
    products = extract_product_links(prod_html)
    if unresolved and fallback_products:
        have = {p["url"] for p in products}
        products += [p for p in fallback_products if isinstance(p, dict) and p.get("url") and p["url"] not in have]

    return {
        "internal_links":      extract_internal_links(html, url),
        "products":            products,
        "article_body":        article_body,
        "word_count":          len(article_body.split()),
        "unresolved_products": unresolved,
    }


def mcp_post_to_md(post: dict, parts: dict | None = None) -> str:
    """Dựng markdown frontmatter từ kết quả MCP get_post."""
    parts = parts or mcp_post_parts(post)
    slug = post["slug"]
    url = post.get("url") or f"{MCP_SITE_URL}/{slug}.html"
    headline = post.get("title") or ""
    description = post.get("seoDescription") or post.get("excerpt") or ""
    seo_title = post.get("seoTitle") or ""

    image = post.get("coverImage") or ""
    if image and not image.startswith("http"):
        image = MCP_MEDIA_BASE + (image if image.startswith("/") else "/" + image)

    date_pub = post.get("publishedAt") or ""
    date_mod = post.get("editedAt") or date_pub
    author = ((post.get("author") or {}).get("name") or "")

    cats = [c for c in (post.get("categories") or []) if isinstance(c, dict) and c.get("name")]
    article_section = cats[0]["name"] if cats else ""
    keywords = [c["name"] for c in cats]

    breadcrumb = [
        {"name": "Trang chủ", "url": f"{MCP_SITE_URL}/"},
        {"name": MCP_BREADCRUMB_BLOG, "url": f"{MCP_SITE_URL}/blogs"},
    ]
    if cats and cats[0].get("slug"):
        breadcrumb.append({"name": cats[0]["name"], "url": f"{MCP_SITE_URL}/blogs/{cats[0]['slug']}"})
    breadcrumb.append({"name": headline, "url": url})

    article_body = parts["article_body"]
    word_count = parts["word_count"]

    lines = ["---", f"url: {_yq(url)}"]
    if headline:
        lines.append(f"headline: {_yq(headline)}")
    if description:
        lines.append(f"description: {_yq(description)}")
    if seo_title and seo_title != headline:
        lines.append(f"title: {_yq(seo_title)}")
    if image:
        lines.append(f"image: {_yq(image)}")
    if date_pub:
        lines.append(f"datePublished: {_yq(date_pub)}")
    if date_mod:
        lines.append(f"dateModified: {_yq(date_mod)}")
    if author:
        lines.append(f"author: {_yq(author)}")
    lines.append(f"publisher: {_yq(MCP_PUBLISHER)}")
    if article_section:
        lines.append(f"articleSection: {_yq(article_section)}")
    if word_count:
        lines.append(f"word_count: {word_count}")
    if keywords:
        lines.append(f"keywords: {json.dumps(keywords, ensure_ascii=False)}")
    lines.append('source: "mcp"')

    lines.append("breadcrumb:")
    for bc_item in breadcrumb:
        lines.append(f"  - name: {_yq(bc_item['name'])}")
        lines.append(f"    url: {_yq(bc_item['url'])}")

    if parts["products"]:
        lines.append(f"products: {json.dumps(parts['products'], ensure_ascii=False)}")

    if parts["internal_links"]:
        lines.append("internal_links:")
        for lnk in parts["internal_links"]:
            lines.append(f"  - url: {_yq(lnk['url'])}")
            lines.append(f"    slug: {_yq(lnk['slug'])}")
            if lnk["anchor"]:
                lines.append(f"    anchor: {_yq(lnk['anchor'])}")

    # related_links do pipeline gắn vào parts sau khi tải HTML live (MCP không có dữ liệu này); thiếu → không ghi khóa
    lines.extend(related_links_md_lines(parts.get("related_links")))

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

    # Metadata MCP gốc (không gồm contentHtml) — thay cho khối Raw JSON-LD
    raw = {k: v for k, v in post.items() if k != "contentHtml"}
    lines.append("## Raw MCP")
    lines.append("")
    lines.append("```json")
    lines.append(json.dumps(raw, ensure_ascii=False, indent=2))
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
    product_links  = extract_product_links(html)
    related_links  = related_from_html(html, url)

    if not article:
        article = {}
        print(f"  [WARN] Không tìm thấy Article JSON-LD")
    article = ensure_article_body(article, html)

    link_count = len(internal_links)
    wc = len(article.get("articleBody", "").split()) if article else 0
    print(f"  -> {slug}.md | {wc} words | {link_count} internal links | {len(product_links)} products | {len(related_links or [])} related")

    md_content = jsonld_to_md(url, lastmod, article, meta, all_jsonld, webpage, internal_links, product_links, related_links)
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

    related = extract_related_links(html, url)
    print(f"\nRelated links: {len(related)}")
    for lnk in related:
        print(f"  #{lnk['position']} [{lnk['anchor'][:60]}] -> {lnk['slug']}")

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
    mode = "FORCE RECRAWL" if force else "INCREMENTAL (lastmod)"
    print(f"Sitemap: {total} URLs | Mode: {mode}\nOutput: {output_dir.resolve()}\n")

    # Load DB dates để so lastmod
    db_dates: dict[str, str] = {}
    if not force:
        try:
            import sqlite3
            db_path = Path(__file__).parent / "blog.db"
            conn = sqlite3.connect(db_path)
            db_dates = dict(conn.execute("SELECT slug, updated_at FROM posts").fetchall())
            conn.close()
        except Exception:
            pass

    ok = fail = skip = 0
    for i, entry in enumerate(entries, 1):
        url   = entry["url"]
        slug  = slug_from_url(url)
        out_path = output_dir / f"{slug}.md"

        if not force:
            lastmod    = entry.get("lastmod", "")
            db_updated = db_dates.get(slug, "")
            if db_updated and (not lastmod or lastmod <= db_updated[:10]):
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
