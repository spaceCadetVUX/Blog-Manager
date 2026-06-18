"""AI analysis endpoints — per-post review và cluster analysis."""

import json
import os
from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
import anthropic

from backend.db import get_conn

router = APIRouter(prefix="/ai", tags=["ai"])

def get_client():
    api_key = os.environ.get("ANTHROPIC_API_KEY", "")
    if not api_key or api_key == "sk-ant-your-key-here":
        raise ValueError("ANTHROPIC_API_KEY chưa được cấu hình trong .env")
    return anthropic.Anthropic(api_key=api_key)


class ClusterRequest(BaseModel):
    section: str
    model: str = "claude-haiku-4-5-20251001"


class ReviewRequest(BaseModel):
    model: str = "claude-haiku-4-5-20251001"

class OverallRequest(BaseModel):
    model: str = "claude-haiku-4-5-20251001"


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

    def generate():
        try:
            client = get_client()
            with client.messages.stream(
                model=req.model,
                max_tokens=1500,
                messages=[{"role": "user", "content": prompt}],
            ) as stream:
                for text in stream.text_stream:
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

    def generate():
        try:
            client = get_client()
            with client.messages.stream(
                model=req.model,
                max_tokens=2000,
                messages=[{"role": "user", "content": prompt}],
            ) as stream:
                for text in stream.text_stream:
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

    def generate():
        try:
            client = get_client()
            with client.messages.stream(
                model=req.model,
                max_tokens=800,
                messages=[{"role": "user", "content": prompt}],
            ) as stream:
                for text in stream.text_stream:
                    yield sse(text)
        except ValueError as e:
            yield sse(f"**Lỗi:** {e}")
        except Exception as e:
            yield sse(f"**Lỗi API:** {e}")
        yield "data: [DONE]\n\n"

    return StreamingResponse(generate(), media_type="text/event-stream",
                             headers={"X-Accel-Buffering": "no", "Cache-Control": "no-cache"})
