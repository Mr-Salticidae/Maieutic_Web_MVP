#!/bin/bash
# 简单的 Nginx 配置脚本

echo "创建 Maieutic Nginx 配置..."

# 创建独立的配置文件
cat > /etc/nginx/conf.d/maieutic.conf << 'EOF'
# Maieutic API 反向代理
# 注意：如果主配置文件中的 server 块监听 443 端口，
# 这个配置需要合并到主 server 块中，而不是作为独立 server

# 如果 default 配置中已经有监听 443 的 server 块，
# 请将此 location 块手动添加到该 server 块中

# 临时方案：使用独立 server 块（仅用于测试）
server {
    listen 80;
    listen 443 ssl;
    server_name tiaozhuxiansheng.com www.tiaozhuxiansheng.com;
    
    # 如果需要 SSL，请指定证书路径
    # ssl_certificate /path/to/cert.pem;
    # ssl_certificate_key /path/to/key.pem;
    
    location /api/maieutic {
        proxy_pass http://127.0.0.1:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
EOF

echo "配置文件已创建: /etc/nginx/conf.d/maieutic.conf"
echo ""
echo "测试 Nginx 配置..."
nginx -t

echo ""
echo "重载 Nginx..."
nginx -s reload 2>/dev/null || systemctl reload nginx 2>/dev/null || service nginx reload

echo ""
echo "完成！"