cd /www/wwwroot/blogpost && git pull && chattr -i frontend/dist/.user.ini && rm frontend/dist/.user.ini && cd frontend && npm run build && cd .. && systemctl restart blogpost


cd frontend && npm run build && cd .. && systemctl restart blogpost
