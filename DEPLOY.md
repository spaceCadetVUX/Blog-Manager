# Deploy Blog Manager lên VPS

**Stack:** FastAPI (Python) + React (Vite build tĩnh) + SQLite  
**Domain ví dụ:** `blog.tungvu.vn`  
**Port nội bộ:** Backend chạy `8000`, Nginx reverse proxy ra ngoài

---

## 1. Chuẩn bị VPS

```bash
# Python 3.11+
python3 --version

# Node.js 20+ (chỉ cần để build, không cần giữ lại)
node --version

# Nginx
sudo apt install nginx -y

# (Tuỳ chọn) PM2 để giữ process sống
npm install -g pm2
```

---

## 2. Clone code

```bash
cd /var/www
git clone <repo-url> blogpost
cd blogpost
```

> Nếu dùng GitHub private repo thì cần SSH key hoặc deploy token.

---

## 3. Tạo file `.env`

Tạo file `/var/www/blogpost/.env`:

```env
APP_PASSWORD=knxstore@2026
ANTHROPIC_API_KEY=sk-ant-...
OPENAI_API_KEY=sk-...
```

> **Lưu ý:** File `.env` KHÔNG được commit lên git. Tạo tay trên server.

---

## 4. Cài Python dependencies

```bash
cd /var/www/blogpost
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

---

## 5. Build frontend

```bash
cd /var/www/blogpost/frontend
npm install
npm run build
# Output: frontend/dist/
```

> Sau khi build xong, `dist/` là static files — không cần Node.js nữa.

---

## 6. Khởi động backend

### Cách A — PM2 (khuyên dùng)

```bash
cd /var/www/blogpost
pm2 start "source .venv/bin/activate && python -m uvicorn backend.main:app --host 127.0.0.1 --port 8000" \
  --name blog-api \
  --interpreter bash
pm2 save
pm2 startup   # chạy lệnh nó in ra để auto-start khi reboot
```

### Cách B — systemd

Tạo `/etc/systemd/system/blog-api.service`:

```ini
[Unit]
Description=Blog Manager API
After=network.target

[Service]
User=www-data
WorkingDirectory=/var/www/blogpost
EnvironmentFile=/var/www/blogpost/.env
ExecStart=/var/www/blogpost/.venv/bin/uvicorn backend.main:app --host 127.0.0.1 --port 8000
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl daemon-reload
sudo systemctl enable blog-api
sudo systemctl start blog-api
sudo systemctl status blog-api
```

> **Quan trọng:** Backend phải chạy từ thư mục `/var/www/blogpost` (không phải `/var/www/blogpost/backend`) vì import dùng `from backend.xxx`.

---

## 7. Cấu hình Nginx

Tạo `/etc/nginx/sites-available/blog`:

```nginx
server {
    listen 80;
    server_name blog.tungvu.vn;

    # Frontend static files
    root /var/www/blogpost/frontend/dist;
    index index.html;

    # SPA fallback — mọi route trả về index.html
    location / {
        try_files $uri $uri/ /index.html;
    }

    # API proxy
    location /api/ {
        proxy_pass http://127.0.0.1:8000/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_read_timeout 300s;   # crawl có thể chạy lâu
        proxy_send_timeout 300s;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/blog /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

---

## 8. HTTPS với Certbot

```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d blog.tungvu.vn
# Certbot tự sửa nginx config, auto-renew qua cron
```

---

## 9. Database & posts

Database SQLite (`blog.db`) được tạo tự động lần đầu. Sau khi app lên:

1. Mở app → **Settings** → nhập API keys
2. **Settings → Crawl bài viết** → nhập sitemap URL → bấm Crawl

> `blog.db` lưu tại `/var/www/blogpost/blog.db` — backup định kỳ file này.

---

## Các điểm cần lưu ý khi cập nhật code

```bash
cd /var/www/blogpost
git pull

# Nếu có thay đổi frontend
cd frontend && npm run build && cd ..

# Nếu có thay đổi requirements.txt
source .venv/bin/activate && pip install -r requirements.txt

# Restart backend
pm2 restart blog-api
# hoặc
sudo systemctl restart blog-api
```

---

## Checklist trước khi go-live

- [ ] `.env` có `APP_PASSWORD`, `ANTHROPIC_API_KEY`
- [ ] Backend chạy ở `127.0.0.1:8000` (không expose ra ngoài)
- [ ] `nginx -t` không lỗi
- [ ] HTTPS hoạt động
- [ ] Crawl thử 1 lần, kiểm tra data trong graph
- [ ] `proxy_read_timeout` đủ lớn (≥ 300s) để crawl không bị timeout
- [ ] Backup `blog.db` định kỳ (cron hoặc tay)
