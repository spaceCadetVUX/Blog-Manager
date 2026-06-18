from crawl_posts import fetch_html, BASE_DOMAIN
from bs4 import BeautifulSoup
import re

url = "https://knxstore.vn/matter-la-gi-cam-nang-toan-tap-ve-giao-thuc-matter.html"
html = fetch_html(url)
soup = BeautifulSoup(html, "lxml")

# Tất cả <a> trỏ về knxstore.vn
all_links = [
    (a.get("href", ""), a.get_text(strip=True)[:80])
    for a in soup.find_all("a", href=True)
    if BASE_DOMAIN in a.get("href", "")
]
print(f"Total internal <a> tags: {len(all_links)}")
for href, txt in all_links:
    print(f"  [{txt}] -> {href}")

# Body candidates
print("\n=== Tag structure ===")
for tag in ["article", "main"]:
    el = soup.find(tag)
    print(f"<{tag}>: {'FOUND' if el else 'not found'}")

print("\n=== Classes có keyword content/article/post/body ===")
seen = set()
for el in soup.find_all(class_=True):
    classes = " ".join(el.get("class", []))
    key = (el.name, classes)
    if key in seen:
        continue
    if any(k in classes.lower() for k in ["content", "article", "post", "body", "blog", "detail"]):
        seen.add(key)
        print(f"  <{el.name} class='{classes}'>")

# Save HTML để inspect thủ công
with open("debug_page.html", "w", encoding="utf-8") as f:
    f.write(html)
print("\nHTML saved to debug_page.html")
