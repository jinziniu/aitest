# 快速部署指南

## 最简单的方式：Vercel + Railway

### 1. 部署后端到 Railway（5分钟）

1. 访问 https://railway.app 并注册
2. 点击 "New Project" → "Deploy from GitHub repo"
3. 选择你的仓库
4. 在设置中：
   - Root Directory: `backend`
   - 添加环境变量：
     ```
     PORT=5001
     DEEPSEEK_API_KEY=your_api_key_here
     NODE_ENV=production
     ```
5. Railway会自动部署，记下生成的URL（如：`https://your-app.railway.app`）

### 2. 部署前端到 Vercel（5分钟）

1. 访问 https://vercel.com 并注册
2. 点击 "Add New Project" → 导入GitHub仓库
3. 配置：
   - Root Directory: `frontend`
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. 添加环境变量：
   ```
   VITE_API_BASE_URL=https://your-app.railway.app
   VITE_SOCKET_URL=https://your-app.railway.app
   ```
5. 点击 "Deploy"

### 3. 更新后端CORS配置

在Railway的环境变量中添加：
```
FRONTEND_URL=https://your-vercel-app.vercel.app
```

### 完成！

访问你的Vercel URL即可使用应用。

---

## 使用Docker本地部署

### 前置要求
- Docker Desktop 已安装

### 步骤

1. **设置环境变量**
   ```bash
   # 创建 .env 文件（在项目根目录）
   echo "DEEPSEEK_API_KEY=your_api_key_here" > .env
   ```

2. **启动服务**
   ```bash
   docker-compose up -d
   ```

3. **访问应用**
   - 前端：http://localhost
   - 后端：http://localhost:5001

4. **查看日志**
   ```bash
   docker-compose logs -f
   ```

5. **停止服务**
   ```bash
   docker-compose down
   ```

---

## 云服务器部署（Ubuntu）

### 一键部署脚本

```bash
#!/bin/bash

# 更新系统
sudo apt update && sudo apt upgrade -y

# 安装Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# 安装PM2
sudo npm install -g pm2

# 安装Nginx
sudo apt install -y nginx

# 克隆项目（替换为你的仓库URL）
git clone https://github.com/your-username/your-repo.git
cd your-repo

# 部署后端
cd backend
npm install --production
echo "PORT=5001
FRONTEND_URL=https://your-domain.com
DEEPSEEK_API_KEY=your_api_key_here
NODE_ENV=production" > .env
pm2 start index.js --name chat-backend
pm2 save
pm2 startup

# 部署前端
cd ../frontend
npm install
npm run build
sudo cp -r dist/* /var/www/html/

# 配置Nginx
sudo tee /etc/nginx/sites-available/chat-backend > /dev/null <<EOF
server {
    listen 80;
    server_name api.your-domain.com;

    location / {
        proxy_pass http://localhost:5001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

sudo ln -s /etc/nginx/sites-available/chat-backend /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# 配置SSL
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com -d api.your-domain.com

echo "部署完成！"
```

---

## 部署检查清单

部署后请检查：

- [ ] 后端健康检查：访问 `https://your-backend.com/health`
- [ ] 前端可以正常访问
- [ ] API请求正常（打开浏览器开发者工具检查Network）
- [ ] WebSocket连接正常（测试实时聊天功能）
- [ ] 环境变量配置正确
- [ ] HTTPS已配置（生产环境必需）
- [ ] CORS配置正确

---

## 常见问题

### Q: Railway部署后无法访问？

**解决**：检查环境变量 `PORT` 是否设置，Railway会自动分配端口，但我们的代码使用固定端口5001。

### Q: Vercel部署后API请求失败？

**解决**：
1. 检查 `VITE_API_BASE_URL` 环境变量是否正确
2. 确保后端CORS允许Vercel域名
3. 重新构建前端（环境变量更改后需要重新构建）

### Q: WebSocket连接失败？

**解决**：
- Railway支持WebSocket，但Render免费版不支持
- 确保使用 `wss://`（HTTPS）而不是 `ws://`
- 检查防火墙和代理设置

---

## 推荐配置

**个人项目/测试**：
- 前端：Vercel（免费）
- 后端：Railway（免费额度）

**生产环境**：
- 云服务器 + Nginx + PM2
- 或使用专业托管服务（AWS、Azure等）



