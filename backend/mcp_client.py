"""
Client MCP server của knxstore.vn (JSON-RPC 2.0 over HTTP, stateless).

Cấu hình qua .env:
  KNX_MCP_URL    endpoint MCP
  KNX_MCP_TOKEN  Bearer token (KHÔNG log/in ra ở bất kỳ đâu)

API:
  call(tool, args)  -> dữ liệu đã parse từ result.content[0].text
  list_posts()      -> list[dict] toàn bộ bài (phân trang search_posts)
  get_post(slug)    -> dict chi tiết bài (kèm contentHtml, faqs, editedAt...)
  get_product(slug) -> dict chi tiết sản phẩm đang bán (kèm bundles, related, variants...)
  list_products()   -> list[dict] toàn bộ sản phẩm đang bán (phân trang search_products)
  get_product_edit(site_id=|slug=) -> dict sản phẩm ở mọi trạng thái (nháp/đang bán/lưu trữ) | None

LƯU Ý ID SẢN PHẨM: `id` trong MCP search_products/get_product/get_product_for_edit là ID MỚI của site Next.js
(= cột `products.site_id` trong blog.db). Id số trong shortcode `{products:[...]}` của bài là ID CŨ/legacy
(= `products.id` = `legacyId` của get_product_for_edit). Hai hệ KHÁC nhau và va chạm.
"""

import json
import os
import time
from itertools import count

import httpx

PAGE_LIMIT = 30          # search_posts limit tối đa
MAX_ATTEMPTS = 3
BACKOFF_BASE = 1.5       # giây: 1.5, 3.0, ...
TIMEOUT = httpx.Timeout(30.0, connect=10.0)

_ids = count(1)


class MCPError(RuntimeError):
    """Lỗi MCP. Thông điệp không bao giờ chứa token."""


class MCPAuthError(MCPError):
    """401/403 — token sai hoặc hết hạn (không retry)."""


class MCPToolError(MCPError):
    """Tool trả isError / JSON-RPC error (không retry)."""


def _config() -> tuple[str, str]:
    url = os.getenv("KNX_MCP_URL", "").strip()
    token = os.getenv("KNX_MCP_TOKEN", "").strip()
    if not url or not token:
        raise MCPError("Thiếu KNX_MCP_URL / KNX_MCP_TOKEN trong .env")
    return url, token


def _parse_body(resp: httpx.Response) -> dict:
    """Server trả application/json; vẫn chấp nhận text/event-stream (lấy event `data:` cuối)."""
    ctype = resp.headers.get("content-type", "")
    text = resp.text
    if "text/event-stream" in ctype:
        datas = [ln[5:].strip() for ln in text.splitlines() if ln.startswith("data:")]
        if not datas:
            raise MCPError("Phản hồi SSE rỗng")
        text = datas[-1]
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        raise MCPError(f"Phản hồi MCP không phải JSON (HTTP {resp.status_code})")


def call(tool: str, args: dict | None = None):
    """Gọi 1 tool MCP, trả dữ liệu JSON đã parse từ content[0].text.
    Retry có backoff với lỗi mạng/5xx/429; 401/403 và isError ném lỗi ngay."""
    url, token = _config()
    payload = {
        "jsonrpc": "2.0",
        "id": next(_ids),
        "method": "tools/call",
        "params": {"name": tool, "arguments": args or {}},
    }
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json",
        "Accept": "application/json, text/event-stream",
    }

    last_err = "unknown"
    for attempt in range(1, MAX_ATTEMPTS + 1):
        try:
            resp = httpx.post(url, json=payload, headers=headers, timeout=TIMEOUT)
        except httpx.HTTPError as e:
            # Chỉ ghi tên lớp lỗi: str(e) của httpx có thể chứa URL
            last_err = f"lỗi mạng ({type(e).__name__})"
        else:
            if resp.status_code in (401, 403):
                raise MCPAuthError(f"MCP từ chối xác thực (HTTP {resp.status_code}) — kiểm tra KNX_MCP_TOKEN")
            if resp.status_code == 429 or resp.status_code >= 500:
                last_err = f"HTTP {resp.status_code}"
            elif resp.status_code >= 400:
                raise MCPError(f"MCP trả HTTP {resp.status_code} cho tool '{tool}'")
            else:
                return _unwrap(tool, _parse_body(resp))
        if attempt < MAX_ATTEMPTS:
            time.sleep(BACKOFF_BASE * (2 ** (attempt - 1)))
    raise MCPError(f"MCP '{tool}' thất bại sau {MAX_ATTEMPTS} lần: {last_err}")


def _unwrap(tool: str, body: dict):
    if "error" in body:
        msg = (body["error"] or {}).get("message", "") if isinstance(body["error"], dict) else str(body["error"])
        raise MCPToolError(f"MCP '{tool}' lỗi JSON-RPC: {msg[:300]}")
    result = body.get("result") or {}
    content = result.get("content") or []
    text = content[0].get("text", "") if content and isinstance(content[0], dict) else ""
    if result.get("isError"):
        raise MCPToolError(f"MCP '{tool}' trả isError: {text[:300]}")
    try:
        return json.loads(text)
    except (json.JSONDecodeError, TypeError):
        raise MCPToolError(f"MCP '{tool}' trả nội dung không phải JSON: {text[:200]}")


def list_posts() -> list[dict]:
    """Toàn bộ bài đã publish (phân trang limit=30 tới hết totalPages)."""
    items: list[dict] = []
    page, total_pages = 1, 1
    while page <= total_pages:
        data = _call_patient("search_posts", {"page": page, "limit": PAGE_LIMIT})
        items.extend(data.get("items") or [])
        total_pages = int((data.get("meta") or {}).get("totalPages") or 1)
        page += 1
    # Dedupe theo slug (phòng trường hợp bài dịch trang giữa 2 request)
    seen: dict[str, dict] = {}
    for it in items:
        if it.get("slug"):
            seen[it["slug"]] = it
    return list(seen.values())


def get_post(slug: str) -> dict:
    data = _call_patient("get_post", {"slug": slug})
    if not isinstance(data, dict) or not data.get("slug"):
        raise MCPToolError(f"get_post('{slug}') không trả bài hợp lệ")
    return data


def _call_patient(tool: str, args: dict, tries: int = 5):
    """call() + chờ thêm khi MCP rate-limit (HTTP 429): server giới hạn khá chặt khi gọi song song/dồn dập."""
    for attempt in range(1, tries + 1):
        try:
            return call(tool, args)
        except (MCPAuthError, MCPToolError):
            raise
        except MCPError as e:
            if "429" not in str(e) or attempt == tries:
                raise
            time.sleep(3 * attempt)


def get_product(slug: str) -> dict:
    """get_product theo slug (sản phẩm đang bán): id (ID MỚI của site), slug, name, sku, status, bundles, related, variants...
    Ném MCPToolError nếu không tìm thấy / dữ liệu không hợp lệ."""
    data = _call_patient("get_product", {"slug": slug})
    if not isinstance(data, dict) or not data.get("slug"):
        raise MCPToolError(f"get_product('{slug}') không trả sản phẩm hợp lệ")
    return data


def list_products() -> list[dict]:
    """Toàn bộ sản phẩm đang bán (phân trang search_products limit=30). Mỗi item có id (ID MỚI của site), slug, name,
    sku, brand{slug,name}, stockStatus, price (int|None), url. Dedupe theo id."""
    items: dict[int, dict] = {}
    page, total_pages = 1, 1
    while page <= total_pages:
        data = _call_patient("search_products", {"page": page, "limit": PAGE_LIMIT})
        for it in data.get("items") or []:
            if isinstance(it, dict) and it.get("id") is not None:
                items[int(it["id"])] = it
        total_pages = int((data.get("meta") or {}).get("totalPages") or 1)
        page += 1
    return list(items.values())


def get_product_edit(*, site_id: int | None = None, slug: str | None = None) -> dict | None:
    """get_product_for_edit: đọc sản phẩm ở MỌI trạng thái (PUBLISHED/DRAFT/ARCHIVED), theo ID mới của site hoặc slug.
    Trả dict `product` (có status, legacyId = ID cũ Admin.html, categories[{isPrimary, category}]...) hoặc None nếu không có."""
    if (site_id is None) == (slug is None):
        raise ValueError("cần đúng một trong site_id / slug")
    ref = {"id": int(site_id)} if site_id is not None else {"slug": slug}
    try:
        data = _call_patient("get_product_for_edit", {"product": ref})
    except MCPToolError as e:
        if "Không tìm thấy" in str(e):
            return None
        raise
    p = data.get("product") if isinstance(data, dict) else None
    return p if isinstance(p, dict) and p.get("id") is not None else None


def make_product_resolver():
    """Resolver token shortcode {products:[...]} → {"url","name"} | None, có cache trong phạm vi 1 lần dùng.
    Dùng cho token KHÔNG có trong lookup từ bảng products (xem backend.product_sync.load_product_lookup).
      - token slug → get_product (sản phẩm đang bán).
      - token số   → luôn None: id số trong shortcode là ID CŨ/legacy (= products.id = legacyId của MCP), mà MCP không có
        tool tra theo legacyId; get_product_for_edit/search_products nhận ID MỚI của site (hệ khác, VA CHẠM với ID cũ)
        nên TUYỆT ĐỐI không dùng để giải id số. Muốn giải thêm id số: chạy POST /products/sync để nạp legacyId vào bảng."""
    cache: dict[str, dict | None] = {}

    def resolve(token: str):
        if token.isdigit():
            return None
        if token not in cache:
            try:
                p = call("get_product", {"slug": token})
                cache[token] = {"url": p["url"], "name": p.get("name") or ""} if isinstance(p, dict) and p.get("url") else None
            except MCPToolError:
                cache[token] = None
        return cache[token]

    return resolve
