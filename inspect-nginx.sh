#!/bin/bash
# Maieutic Nginx 配置脚本

set -e

echo "=== 步骤1：查看当前 Nginx 配置结构 ==="
ls -la /etc/nginx/
ls -la /etc/nginx/conf.d/ 2>/dev/null || echo "conf.d 目录不存在"
ls -la /etc/nginx/sites-enabled/ 2>/dev/null || echo "sites-enabled 目录不存在"

echo ""
echo "=== 步骤2：查找 tiaozhuxiansheng.com 的配置 ==="
grep -r "tiaozhuxiansheng.com" /etc/nginx/ 2>/dev/null | head -5

echo ""
echo "=== 步骤3：创建配置片段 ==="
cat > /tmp/maieutic-location.conf << 'EOF'
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
EOF
cat /tmp/maieutic-location.conf

echo ""
echo "配置片段已创建在 /tmp/maieutic-location.conf"
echo "请手动将此配置添加到 Nginx 的 server 块中"