#!/bin/bash
# 配置 Nginx 反向代理的脚本

# 1. 查找 Nginx 配置文件
echo "查找 Nginx 配置文件..."
if [ -f /etc/nginx/sites-enabled/default ]; then
    NGINX_CONF="/etc/nginx/sites-enabled/default"
elif [ -f /etc/nginx/nginx.conf ]; then
    NGINX_CONF="/etc/nginx/nginx.conf"
else
    echo "错误：找不到 Nginx 配置文件"
    exit 1
fi

echo "使用配置文件: $NGINX_CONF"

# 2. 检查是否已经配置了 maieutic
if grep -q "/api/maieutic" "$NGINX_CONF"; then
    echo "Nginx 已配置 /api/maieutic，跳过"
else
    echo "添加 /api/maieutic 反向代理配置..."
    
    # 创建备份
    cp "$NGINX_CONF" "${NGINX_CONF}.backup.$(date +%s)"
    
    # 在 server 块的最后一个 } 之前插入配置
    # 使用 sed 查找最后一个 server { 块并插入配置
    sed -i '/^[[:space:]]*server[[:space:]]*{/,${
        /^[[:space:]]*}/{
            i\
    # Maieutic API 反向代理\
    location /api/maieutic {\
        proxy_pass http://127.0.0.1:3001;\
        proxy_http_version 1.1;\
        proxy_set_header Upgrade $http_upgrade;\
        proxy_set_header Connection '"'"'upgrade'"'"';\
        proxy_set_header Host $host;\
        proxy_set_header X-Real-IP $remote_addr;\
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;\
        proxy_set_header X-Forwarded-Proto $scheme;\
        proxy_cache_bypass $http_upgrade;\
    }\

        }
    }' "$NGINX_CONF" 2>/dev/null || {
        echo "sed 插入失败，使用追加方式..."
        # 如果 sed 失败，创建独立配置文件
        cat > /etc/nginx/conf.d/maieutic.conf << 'EOF'
server {
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
    }
fi

# 3. 测试 Nginx 配置
echo "测试 Nginx 配置..."
nginx -t

# 4. 重载 Nginx
echo "重载 Nginx..."
nginx -s reload || systemctl reload nginx

echo "Nginx 配置完成！"