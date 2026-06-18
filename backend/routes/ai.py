"""AI analysis endpoints — per-post review và cluster analysis."""

import json
import os
from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from pydantic import BaseModel

from backend.db import get_conn

router = APIRouter(prefix="/ai", tags=["ai"])


def _get_setting(key: str) -> str:
    with get_conn() as conn:
        row = conn.execute("SELECT value FROM settings WHERE key = ?", [key]).fetchone()
    return (row["value"] if row else "").strip()


def stream_text(model: str, prompt, system: str = ""):
    """Unified streaming generator. prompt = str hoặc list[{role,content}]."""
    # Chuẩn hoá về messages list
    if isinstance(prompt, str):
        messages = [{"role": "user", "content": prompt}]
    else:
        messages = prompt

    # ── Anthropic ──────────────────────────────────────────────────────────────
    if model.startswith("claude"):
        import anthropic
        api_key = _get_setting("anthropic_api_key") or os.environ.get("ANTHROPIC_API_KEY", "")
        if not api_key:
            raise ValueError("Anthropic API key chưa được cấu hình")
        client = anthropic.Anthropic(api_key=api_key)
        kwargs = dict(model=model, max_tokens=2000, messages=messages)
        if system:
            kwargs["system"] = system
        with client.messages.stream(**kwargs) as stream:
            for text in stream.text_stream:
                yield text

    # ── OpenAI ─────────────────────────────────────────────────────────────────
    elif model.startswith(("gpt-", "o1", "o3", "o4")):
        from openai import OpenAI
        api_key = _get_setting("openai_api_key") or os.environ.get("OPENAI_API_KEY", "")
        if not api_key:
            raise ValueError("OpenAI API key chưa được cấu hình")
        client = OpenAI(api_key=api_key)
        all_messages = ([{"role": "system", "content": system}] if system else []) + messages
        stream = client.chat.completions.create(model=model, stream=True, messages=all_messages)
        for chunk in stream:
            text = chunk.choices[0].delta.content
            if text:
                yield text

    # ── DeepSeek (OpenAI-compatible) ───────────────────────────────────────────
    elif model.startswith("deepseek"):
        from openai import OpenAI
        api_key = _get_setting("deepseek_api_key") or os.environ.get("DEEPSEEK_API_KEY", "")
        if not api_key:
            raise ValueError("DeepSeek API key chưa được cấu hình")
        client = OpenAI(api_key=api_key, base_url="https://api.deepseek.com")
        all_messages = ([{"role": "system", "content": system}] if system else []) + messages
        stream = client.chat.completions.create(model=model, stream=True, messages=all_messages)
        for chunk in stream:
            text = chunk.choices[0].delta.content
            if text:
                yield text

    # ── Google Gemini ──────────────────────────────────────────────────────────
    elif model.startswith("gemini"):
        from google import genai
        from google.genai import types as gtypes
        api_key = _get_setting("google_api_key") or os.environ.get("GOOGLE_API_KEY", "")
        if not api_key:
            raise ValueError("Google API key chưa được cấu hình")
        client = genai.Client(api_key=api_key)
        # Gemini: ghép system vào message đầu nếu có
        contents = []
        if system:
            contents.append({"role": "user", "parts": [{"text": f"[System] {system}"}]})
            contents.append({"role": "model", "parts": [{"text": "Đã hiểu."}]})
        for m in messages:
            role = "model" if m["role"] == "assistant" else "user"
            contents.append({"role": role, "parts": [{"text": m["content"]}]})
        for chunk in client.models.generate_content_stream(model=model, contents=contents):
            if chunk.text:
                yield chunk.text

    else:
        raise ValueError(f"Model không được hỗ trợ: {model}")


class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    messages: list[ChatMessage]
    model: str = "claude-haiku-4-5-20251001"
    with_context: bool = True
    post_slug: str = ""


@router.post("/chat")
def chat(req: ChatRequest):
    system = ""
    if req.post_slug:
        with get_conn() as conn:
            post = conn.execute("SELECT * FROM posts WHERE slug = ?", [req.post_slug]).fetchone()
            inbound = conn.execute("SELECT COUNT(*) FROM internal_links WHERE to_slug = ?", [req.post_slug]).fetchone()[0]
            outbound = conn.execute("SELECT COUNT(*) FROM internal_links WHERE from_slug = ?", [req.post_slug]).fetchone()[0]
        if post:
            p = dict(post)
            chat_instructions = _get_setting("chat_instructions")
            system = (
                f"Bạn là SEO assistant cho blog knxstore.vn.\n"
                f"Người dùng đang xem bài viết:\n"
                f"- Title: {p.get('headline','')}\n"
                f"- Slug: {p.get('slug','')}\n"
                f"- Section: {p.get('article_section','')}\n"
                f"- Word count: {p.get('word_count',0)} từ\n"
                f"- Description: {p.get('description','')}\n"
                f"- Inbound links: {inbound} | Outbound links: {outbound}\n"
                f"Trả lời bằng tiếng Việt, tập trung vào bài viết này."
                + (f"\n\n---\n{chat_instructions}" if chat_instructions else "")
            )
    elif req.with_context:
        with get_conn() as conn:
            total = conn.execute("SELECT COUNT(*) FROM posts").fetchone()[0]
            total_links = conn.execute("SELECT COUNT(*) FROM internal_links").fetchone()[0]
            sections = conn.execute("""
                SELECT article_section, COUNT(*) as cnt FROM posts
                WHERE article_section != '' AND article_section IS NOT NULL
                GROUP BY article_section ORDER BY cnt DESC
            """).fetchall()
        sec_text = ", ".join(f"{s['article_section']} ({s['cnt']})" for s in sections)
        system = (
            f"Bạn là SEO assistant cho blog knxstore.vn — chuyên về tự động hóa tòa nhà "
            f"(KNX, DALI-2, BACnet, Modbus, Matter Smarthome).\n"
            f"Blog hiện có {total} bài viết, {total_links} internal links.\n"
            f"Sections: {sec_text}.\n"
            f"Trả lời bằng tiếng Việt, ngắn gọn và thực tế."
        )

    messages = [{"role": m.role, "content": m.content} for m in req.messages]

    def generate():
        try:
            for text in stream_text(req.model, messages, system=system):
                yield sse(text)
        except ValueError as e:
            yield sse(f"**Lỗi:** {e}")
        except Exception as e:
            yield sse(f"**Lỗi API:** {e}")
        yield "data: [DONE]\n\n"

    return StreamingResponse(generate(), media_type="text/event-stream",
                             headers={"X-Accel-Buffering": "no", "Cache-Control": "no-cache"})


class SaveHistoryRequest(BaseModel):
    type: str
    section: str = ""
    model: str = ""
    content: str


@router.post("/history")
def save_history(req: SaveHistoryRequest):
    with get_conn() as conn:
        conn.execute(
            "INSERT INTO analysis_history (type, section, model, content) VALUES (?,?,?,?)",
            [req.type, req.section, req.model, req.content],
        )
        row = conn.execute("SELECT last_insert_rowid() as id").fetchone()
    return {"id": row["id"]}


@router.get("/history")
def get_history(limit: int = 50):
    with get_conn() as conn:
        rows = conn.execute("""
            SELECT id, type, section, model, created_at,
                   substr(content, 1, 120) AS preview
            FROM analysis_history
            ORDER BY created_at DESC LIMIT ?
        """, [limit]).fetchall()
    return [dict(r) for r in rows]


@router.get("/history/{id}")
def get_history_item(id: int):
    with get_conn() as conn:
        row = conn.execute("SELECT * FROM analysis_history WHERE id = ?", [id]).fetchone()
    if not row:
        return {"error": "Not found"}
    return dict(row)


@router.delete("/history/{id}")
def delete_history_item(id: int):
    with get_conn() as conn:
        conn.execute("DELETE FROM analysis_history WHERE id = ?", [id])
    return {"ok": True}


class ClusterRequest(BaseModel):
    section: str
    model: str = "claude-haiku-4-5-20251001"
    extra_instructions: str = ""

class ReviewRequest(BaseModel):
    model: str = "claude-haiku-4-5-20251001"
    extra_instructions: str = ""

class OverallRequest(BaseModel):
    model: str = "claude-haiku-4-5-20251001"
    extra_instructions: str = ""


def sse(text: str) -> str:
    return f"data: {json.dumps({'text': text})}\n\n"


@router.post("/cluster")
def analyze_cluster(req: ClusterRequest):
    with get_conn() as conn:
        posts = conn.execute("""
            SELECT p.slug, p.headline, p.description, p.word_count,
                   p.keywords, p.date_modified,
                   COUNT(DISTINCT il_in.from_slug)  AS inbound,
                   COUNT(DISTINCT il_out.to_slug)   AS outbound
            FROM posts p
            LEFT JOIN internal_links il_in  ON il_in.to_slug   = p.slug
            LEFT JOIN internal_links il_out ON il_out.from_slug = p.slug
            WHERE p.article_section = ?
            GROUP BY p.id
            ORDER BY inbound DESC
        """, [req.section]).fetchall()

        links = conn.execute("""
            SELECT il.from_slug, il.to_slug, il.anchor
            FROM internal_links il
            JOIN posts pf ON pf.slug = il.from_slug AND pf.article_section = ?
            JOIN posts pt ON pt.slug = il.to_slug   AND pt.article_section = ?
        """, [req.section, req.section]).fetchall()

    if not posts:
        def empty():
            yield sse(f"Không tìm thấy bài nào trong section **{req.section}**.")
            yield "data: [DONE]\n\n"
        return StreamingResponse(empty(), media_type="text/event-stream")

    posts_text = "\n".join(
        f"- [{p['inbound']}in/{p['outbound']}out] **{p['slug']}**: {(p['headline'] or '')[:80]}"
        f" | {p['word_count'] or 0} từ"
        f"{' | stale: ' + p['date_modified'][:10] if p['date_modified'] else ''}"
        for p in posts
    )

    link_pairs = "\n".join(
        f"  {l['from_slug']} → {l['to_slug']}"
        for l in links[:100]
    )

    prompt = f"""Bạn là SEO specialist phân tích nội dung blog tiếng Việt về tự động hóa tòa nhà (KNX, DALI, BACnet, Modbus, Matter Smarthome).

Đây là cluster section **"{req.section}"** với {len(posts)} bài viết:

{posts_text}

Internal links hiện có trong cluster ({len(links)} links):
{link_pairs if link_pairs else "  (chưa có internal links trong cluster)"}

Hãy phân tích và trả lời bằng tiếng Việt, theo cấu trúc:

## 1. Tổng quan cluster
Nhận xét ngắn về cấu trúc, độ bao phủ topic, điểm mạnh/yếu.

## 2. Pillar vs Supporting
Liệt kê 3-5 bài nên là pillar content (nhiều inbound, topic rộng) và các bài supporting xoay quanh.

## 3. Topic gaps
Những chủ đề quan trọng còn thiếu trong section này mà nên tạo thêm bài.

## 4. Gợi ý internal links cần thêm
Liệt kê 5-10 cặp `bài_nguồn → bài_đích` cụ thể nên link với nhau (chưa có link), giải thích ngắn lý do.

## 5. Ưu tiên cập nhật
Top 3-5 bài nên update sớm nhất và tại sao.

Đi thẳng vào phân tích, không cần mở đầu chung chung."""

    if req.extra_instructions.strip():
        prompt += f"\n\n---\n**Yêu cầu thêm:** {req.extra_instructions.strip()}"

    def generate():
        try:
            for text in stream_text(req.model, prompt):
                yield sse(text)
        except ValueError as e:
            yield sse(f"**Lỗi:** {e}")
        except Exception as e:
            yield sse(f"**Lỗi API:** {e}")
        yield "data: [DONE]\n\n"

    return StreamingResponse(generate(), media_type="text/event-stream",
                             headers={"X-Accel-Buffering": "no", "Cache-Control": "no-cache"})


@router.post("/overall")
def analyze_overall(req: OverallRequest):
    with get_conn() as conn:
        total_posts = conn.execute("SELECT COUNT(*) FROM posts").fetchone()[0]
        total_links = conn.execute("SELECT COUNT(*) FROM internal_links").fetchone()[0]

        sections = conn.execute("""
            SELECT p.article_section AS section,
                   COUNT(DISTINCT p.id) AS posts,
                   COUNT(DISTINCT il_in.from_slug)  AS total_inbound,
                   COUNT(DISTINCT il_out.to_slug)   AS total_outbound,
                   SUM(CASE WHEN NOT EXISTS (
                       SELECT 1 FROM internal_links WHERE to_slug = p.slug
                   ) THEN 1 ELSE 0 END) AS orphans,
                   ROUND(AVG(p.word_count), 0) AS avg_wc
            FROM posts p
            LEFT JOIN internal_links il_in  ON il_in.to_slug   = p.slug
            LEFT JOIN internal_links il_out ON il_out.from_slug = p.slug
            WHERE p.article_section != '' AND p.article_section IS NOT NULL
            GROUP BY p.article_section
            ORDER BY posts DESC
        """).fetchall()

        cross_links = conn.execute("""
            SELECT pf.article_section AS from_sec,
                   pt.article_section AS to_sec,
                   COUNT(*) AS cnt
            FROM internal_links il
            JOIN posts pf ON pf.slug = il.from_slug
            JOIN posts pt ON pt.slug = il.to_slug
            WHERE pf.article_section != pt.article_section
              AND pf.article_section != '' AND pt.article_section != ''
            GROUP BY from_sec, to_sec
            ORDER BY cnt DESC
            LIMIT 20
        """).fetchall()

        top_orphans = conn.execute("""
            SELECT p.slug, p.headline, p.article_section
            FROM posts p
            WHERE NOT EXISTS (SELECT 1 FROM internal_links WHERE to_slug = p.slug)
            ORDER BY p.word_count DESC
            LIMIT 10
        """).fetchall()

        stale_count = conn.execute("""
            SELECT COUNT(*) FROM posts
            WHERE date_modified < date('now', '-6 months')
            AND date_modified != '' AND date_modified IS NOT NULL
        """).fetchone()[0]

    sections_text = "\n".join(
        f"- **{s['section']}**: {s['posts']} bài | orphans: {s['orphans']} | avg {int(s['avg_wc'] or 0)} từ | {s['total_inbound']} inbound links"
        for s in sections
    )

    cross_text = "\n".join(
        f"  {c['from_sec']} → {c['to_sec']}: {c['cnt']} links"
        for c in cross_links
    ) or "  (chưa có cross-section links)"

    orphan_text = "\n".join(
        f"  - {o['slug']} ({o['article_section']}): {(o['headline'] or '')[:60]}"
        for o in top_orphans
    )

    prompt = f"""Bạn là SEO specialist phân tích toàn bộ blog tiếng Việt về tự động hóa tòa nhà (KNX, DALI, BACnet, Modbus, Matter Smarthome).

## Tổng quan
- Tổng số bài: {total_posts}
- Tổng internal links: {total_links}
- Bài chưa cập nhật >6 tháng: {stale_count}

## Phân bổ theo section
{sections_text}

## Cross-section links (top 20)
{cross_text}

## Top 10 orphan posts (bài có nhiều từ nhất nhưng 0 inbound)
{orphan_text}

Phân tích toàn bộ blog và trả lời bằng tiếng Việt theo cấu trúc:

## 1. Tổng quan sức khỏe blog
Đánh giá tổng thể: link density, orphan rate, content distribution.

## 2. Section mạnh / yếu
Section nào đang tốt, section nào cần cải thiện và tại sao.

## 3. Cơ hội cross-section linking
Các cặp section nên link qua lại nhiều hơn, giải thích lý do.

## 4. Top orphans cần xử lý ngay
Trong danh sách trên, bài nào quan trọng nhất cần thêm inbound links sớm nhất.

## 5. Kế hoạch ưu tiên 30 ngày
5 action cụ thể nhất để cải thiện internal linking và SEO toàn blog.

Đi thẳng vào phân tích, số liệu cụ thể."""

    if req.extra_instructions.strip():
        prompt += f"\n\n---\n**Yêu cầu thêm:** {req.extra_instructions.strip()}"

    def generate():
        try:
            for text in stream_text(req.model, prompt):
                yield sse(text)
        except ValueError as e:
            yield sse(f"**Lỗi:** {e}")
        except Exception as e:
            yield sse(f"**Lỗi API:** {e}")
        yield "data: [DONE]\n\n"

    return StreamingResponse(generate(), media_type="text/event-stream",
                             headers={"X-Accel-Buffering": "no", "Cache-Control": "no-cache"})


class LinkSuggestRequest(BaseModel):
    model: str = "claude-haiku-4-5-20251001"


@router.post("/link-suggestions/{slug}")
def link_suggestions(slug: str, req: LinkSuggestRequest):
    with get_conn() as conn:
        post = conn.execute("SELECT * FROM posts WHERE slug = ?", [slug]).fetchone()
        if not post:
            def not_found():
                yield sse(f"Không tìm thấy bài `{slug}`.")
                yield "data: [DONE]\n\n"
            return StreamingResponse(not_found(), media_type="text/event-stream")

        # Lấy danh sách tất cả bài khác (ưu tiên cùng section)
        candidates = conn.execute("""
            SELECT p.slug, p.headline, p.description, p.article_section,
                   p.word_count,
                   (SELECT GROUP_CONCAT(kw.value) FROM json_each(p.keywords) kw LIMIT 5) AS kw_list,
                   COUNT(DISTINCT il_in.from_slug) AS inbound
            FROM posts p
            LEFT JOIN internal_links il_in ON il_in.to_slug = p.slug
            WHERE p.slug != ?
            GROUP BY p.id
            ORDER BY (p.article_section = ?) DESC, inbound DESC
            LIMIT 60
        """, [slug, post["article_section"] or ""]).fetchall()

        # Links hiện có
        existing_out = conn.execute(
            "SELECT to_slug FROM internal_links WHERE from_slug = ?", [slug]
        ).fetchall()
        existing_in = conn.execute(
            "SELECT from_slug FROM internal_links WHERE to_slug = ?", [slug]
        ).fetchall()

    p = dict(post)
    existing_out_slugs = {r["to_slug"] for r in existing_out}
    existing_in_slugs  = {r["from_slug"] for r in existing_in}

    # Format danh sách ứng viên
    candidates_text = "\n".join(
        f"- [{c['article_section']}] **{c['slug']}**: {(c['headline'] or '')[:70]}"
        f" | {c['word_count'] or 0} từ | keywords: {c['kw_list'] or '-'}"
        f"{' ← đã có inbound từ bài target' if c['slug'] in existing_in_slugs else ''}"
        f"{' ← bài target đã link đến' if c['slug'] in existing_out_slugs else ''}"
        for c in candidates
    )

    keywords = json.loads(p.get("keywords") or "[]")

    prompt = f"""Bạn là SEO specialist. Nhiệm vụ: chọn các bài viết cụ thể phù hợp nhất để thêm internal links cho bài target.

## Bài target (cần được link)
- **Slug:** {p['slug']}
- **Title:** {p.get('headline') or '(trống)'}
- **Section:** {p.get('article_section') or '(chưa có)'}
- **Description:** {p.get('description') or '(trống)'}
- **Keywords:** {', '.join(keywords) if keywords else '(không có)'}
- **Word count:** {p.get('word_count') or 0} từ
- **Inbound links hiện tại:** {len(existing_in_slugs)}
- **Outbound links hiện tại:** {len(existing_out_slugs)}

## Danh sách {len(candidates)} bài ứng viên
{candidates_text}

## Yêu cầu phân tích
Dựa trên topic, keywords, section và nội dung, hãy chọn và trả lời bằng tiếng Việt:

### 1. Các bài NÊN link ĐẾN bài target (thêm link trong các bài đó trỏ về bài này)
Liệt kê 3-6 bài cụ thể theo format:
- **slug-bài** — lý do ngắn gọn (anchor text gợi ý: "...")

### 2. Các bài bài target NÊN link ĐẾN (thêm link trong bài target trỏ đến các bài đó)
Liệt kê 3-6 bài cụ thể theo format:
- **slug-bài** — lý do ngắn gọn (anchor text gợi ý: "...")

### 3. Đánh giá nhanh
1-2 câu về mức độ kết nối hiện tại và ưu tiên hành động.

Chỉ chọn các bài THỰC SỰ liên quan về topic, không chọn bừa. Bỏ qua các bài đã có link."""

    def generate():
        try:
            for text in stream_text(req.model, prompt):
                yield sse(text)
        except ValueError as e:
            yield sse(f"**Lỗi:** {e}")
        except Exception as e:
            yield sse(f"**Lỗi API:** {e}")
        yield "data: [DONE]\n\n"

    return StreamingResponse(generate(), media_type="text/event-stream",
                             headers={"X-Accel-Buffering": "no", "Cache-Control": "no-cache"})


@router.post("/review/{slug}")
def review_post(slug: str, req: ReviewRequest):
    with get_conn() as conn:
        post = conn.execute("SELECT * FROM posts WHERE slug = ?", [slug]).fetchone()
        if not post:
            def not_found():
                yield sse(f"Không tìm thấy bài `{slug}`.")
                yield "data: [DONE]\n\n"
            return StreamingResponse(not_found(), media_type="text/event-stream")

        inbound = conn.execute(
            "SELECT COUNT(*) FROM internal_links WHERE to_slug = ?", [slug]
        ).fetchone()[0]
        outbound = conn.execute(
            "SELECT COUNT(*) FROM internal_links WHERE from_slug = ?", [slug]
        ).fetchone()[0]

        related = conn.execute("""
            SELECT slug, headline FROM posts
            WHERE article_section = ? AND slug != ?
            ORDER BY RANDOM() LIMIT 5
        """, [post["article_section"] or "", slug]).fetchall()

    p = dict(post)
    keywords = json.loads(p.get("keywords") or "[]")

    prompt = f"""Bạn là SEO specialist. Phân tích bài viết sau và đưa ra gợi ý cải thiện cụ thể bằng tiếng Việt.

**Slug:** {p['slug']}
**Title:** {p.get('headline') or '(trống)'}
**Description:** {p.get('description') or '(trống)'}
**Section:** {p.get('article_section') or '(chưa có)'}
**Word count:** {p.get('word_count') or 0} từ
**Keywords:** {', '.join(keywords) if keywords else '(không có)'}
**Inbound links:** {inbound}
**Outbound links:** {outbound}
**Date modified:** {p.get('date_modified') or 'chưa rõ'}

Một số bài cùng section: {', '.join(r['slug'] for r in related) if related else 'không có'}

Trả lời theo cấu trúc:

## Đánh giá nhanh
1-2 câu tổng quan.

## Title & Description
Nhận xét + đề xuất viết lại nếu cần (title ≤60 ký tự, description 70-160 ký tự).

## Keywords
Nhận xét + gợi ý 3-5 keyword nên thêm.

## Internal linking
Nhận xét inbound/outbound. Gợi ý bài nào trong section nên link đến bài này.

## Ưu tiên action
3 việc cụ thể nên làm ngay."""

    if req.extra_instructions.strip():
        prompt += f"\n\n---\n**Yêu cầu thêm:** {req.extra_instructions.strip()}"

    def generate():
        try:
            for text in stream_text(req.model, prompt):
                yield sse(text)
        except ValueError as e:
            yield sse(f"**Lỗi:** {e}")
        except Exception as e:
            yield sse(f"**Lỗi API:** {e}")
        yield "data: [DONE]\n\n"

    return StreamingResponse(generate(), media_type="text/event-stream",
                             headers={"X-Accel-Buffering": "no", "Cache-Control": "no-cache"})
