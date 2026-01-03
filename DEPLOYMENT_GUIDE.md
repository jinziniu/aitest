# 项目部署指南

本指南将帮助你将全栈聊天应用部署到生产环境。

## 部署方案选择

### 方案1：分离部署（推荐）
- **前端**：Vercel / Netlify / Cloudflare Pages（免费，自动HTTPS）
- **后端**：Railway / Render / Fly.io（支持Node.js和WebSocket）

### 方案2：云服务器部署
- **服务器**：阿里云 / 腾讯云 / AWS / DigitalOcean
- **需要配置**：Nginx反向代理、PM2进程管理、SSL证书

### 方案3：Docker容器化部署
- **平台**：Docker + Docker Compose
- **适合**：已有服务器或云平台支持Docker

---

## 方案1：分离部署（最简单）

### 步骤1：准备生产环境配置

#### 1.1 更新前端API配置

确保 `frontend/src/config/api.ts` 支持生产环境：

```typescript
// 生产环境使用环境变量，开发环境使用默认值
const isProduction = import.meta.env.PROD;
export const API_BASE = import.meta.env.VITE_API_BASE_URL || 
  (isProduction ? 'https://your-backend-domain.com' : 'http://localhost:5001');
export const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 
  import.meta.env.VITE_API_BASE_URL || API_BASE;
```

#### 1.2 构建前端

```bash
cd frontend
npm install
npm run build
```

构建产物在 `frontend/dist` 目录。

### 步骤2：部署后端

#### 选项A：Railway（推荐，支持WebSocket）

1. **注册账号**：访问 https://railway.app
2. **创建项目**：
   - 点击 "New Project"
   - 选择 "Deploy from GitHub repo"
   - 选择你的仓库
3. **配置服务**：
   - 选择 `backend` 目录作为根目录
   - Railway会自动检测Node.js项目
4. **设置环境变量**：
   ```
   PORT=5001
   FRONTEND_URL=https://your-frontend-domain.vercel.app
   DEEPSEEK_API_KEY=your_api_key_here
   NODE_ENV=production
   ```
5. **部署**：Railway会自动部署，提供URL如：`https://your-app.railway.app`

#### 选项B：Render

1. **注册账号**：访问 https://render.com
2. **创建Web Service**：
   - 连接GitHub仓库
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `npm start`
3. **设置环境变量**（同上）
4. **注意**：免费版有休眠限制，WebSocket可能断开

#### 选项C：Fly.io

1. **安装flyctl**：https://fly.io/docs/getting-started/installing-flyctl/
2. **登录**：`fly auth login`
3. **初始化**：在 `backend` 目录运行 `fly launch`
4. **设置环境变量**：`fly secrets set KEY=value`

### 步骤3：部署前端

#### 选项A：Vercel（推荐）

1. **注册账号**：访问 https://vercel.com
2. **导入项目**：
   - 点击 "Add New Project"
   - 导入GitHub仓库
   - Root Directory: `frontend`
3. **配置构建**：
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. **设置环境变量**：
   ```
   VITE_API_BASE_URL=https://your-backend-domain.railway.app
   VITE_SOCKET_URL=https://your-backend-domain.railway.app
   ```
5. **部署**：Vercel会自动部署并提供URL

#### 选项B：Netlify

1. **注册账号**：访问 https://netlify.com
2. **导入项目**：
   - 连接GitHub仓库
   - Base directory: `frontend`
   - Build command: `npm run build`
   - Publish directory: `frontend/dist`
3. **设置环境变量**（同上）
4. **部署**

#### 选项C：Cloudflare Pages

1. **注册账号**：访问 https://pages.cloudflare.com
2. **连接GitHub仓库**
3. **配置构建**：
   - Framework preset: Vite
   - Build command: `npm run build`
   - Build output directory: `dist`
4. **设置环境变量**（同上）

---

## 方案2：云服务器部署

### 前置要求

- 云服务器（Ubuntu 20.04+ 推荐）
- 域名（可选，但推荐）
- SSH访问权限

### 步骤1：服务器准备

```bash
# 更新系统
sudo apt update && sudo apt upgrade -y

# 安装Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# 安装Nginx
sudo apt install -y nginx

# 安装PM2（进程管理）
sudo npm install -g pm2
```

### 步骤2：部署后端

```bash
# 克隆项目
git clone https://github.com/your-username/your-repo.git
cd your-repo/backend

# 安装依赖
npm install --production

# 创建.env文件
nano .env
```

`.env` 内容：
```env
PORT=5001
FRONTEND_URL=https://your-domain.com
DEEPSEEK_API_KEY=your_api_key_here
NODE_ENV=production
```

```bash
# 使用PM2启动
pm2 start index.js --name "chat-backend"
pm2 save
pm2 startup  # 设置开机自启
```

### 步骤3：配置Nginx反向代理

```bash
sudo nano /etc/nginx/sites-available/chat-backend
```

配置内容：
```nginx
server {
    listen 80;
    server_name api.your-domain.com;  # 或 your-domain.com

    location / {
        proxy_pass http://localhost:5001;
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
```

```bash
# 启用配置
sudo ln -s /etc/nginx/sites-available/chat-backend /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 步骤4：部署前端

```bash
cd ../frontend
npm install
npm run build

# 将dist目录复制到Nginx
sudo cp -r dist/* /var/www/html/
```

或配置Nginx服务前端：

```bash
sudo nano /etc/nginx/sites-available/chat-frontend
```

```nginx
server {
    listen 80;
    server_name your-domain.com;

    root /var/www/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

### 步骤5：配置SSL（Let's Encrypt）

```bash
# 安装Certbot
sudo apt install -y certbot python3-certbot-nginx

# 获取SSL证书
sudo certbot --nginx -d your-domain.com -d api.your-domain.com

# 自动续期
sudo certbot renew --dry-run
```

### 步骤6：配置防火墙

```bash
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

---

## 方案3：Docker部署

### 创建Dockerfile

#### backend/Dockerfile

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

EXPOSE 5001

CMD ["node", "index.js"]
```

#### frontend/Dockerfile

```dockerfile
FROM node:18-alpine as build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

#### frontend/nginx.conf

```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

#### docker-compose.yml（项目根目录）

```yaml
version: '3.8'

services:
  backend:
    build: ./backend
    ports:
      - "5001:5001"
    environment:
      - PORT=5001
      - FRONTEND_URL=http://localhost:3000
      - DEEPSEEK_API_KEY=${DEEPSEEK_API_KEY}
      - NODE_ENV=production
    volumes:
      - ./backend/data.json:/app/data.json
    restart: unless-stopped

  frontend:
    build: ./frontend
    ports:
      - "80:80"
    depends_on:
      - backend
    restart: unless-stopped
```

### 部署

```bash
# 构建和启动
docker-compose up -d

# 查看日志
docker-compose logs -f

# 停止
docker-compose down
```

---

## 环境变量配置清单

### 后端环境变量

```env
# 必需
DEEPSEEK_API_KEY=your_deepseek_api_key_here

# 可选（有默认值）
PORT=5001
FRONTEND_URL=https://your-frontend-domain.com
NODE_ENV=production
DEEPSEEK_API_BASE=https://api.deepseek.com/v1
DEEPSEEK_MODEL=deepseek-chat
```

### 前端环境变量

```env
# 必需（生产环境）
VITE_API_BASE_URL=https://your-backend-domain.com
VITE_SOCKET_URL=https://your-backend-domain.com

# 可选
VITE_PORT=3000
```

---

## 部署后检查清单

- [ ] 后端服务正常运行（访问 `/health` 端点）
- [ ] 前端可以访问
- [ ] API请求正常（检查浏览器Network面板）
- [ ] WebSocket连接正常（实时聊天功能）
- [ ] 环境变量配置正确
- [ ] HTTPS配置完成（生产环境必需）
- [ ] CORS配置正确（允许前端域名）
- [ ] 数据持久化正常（data.json文件可读写）

---

## 常见问题

### Q: WebSocket连接失败

**原因**：某些平台（如Render免费版）不支持WebSocket

**解决**：
1. 使用Railway或Fly.io
2. 或使用云服务器部署

### Q: CORS错误

**解决**：确保后端 `FRONTEND_URL` 环境变量设置为前端实际域名

### Q: 环境变量不生效

**前端**：Vite需要以 `VITE_` 开头，且需要重新构建

**后端**：确保 `.env` 文件在正确位置，或使用平台的环境变量配置

### Q: 数据丢失

**解决**：
- 使用云服务器时，确保 `data.json` 文件有备份
- 考虑迁移到数据库（PostgreSQL/MongoDB）

---

## 生产环境优化建议

1. **数据库迁移**：
   - 将JSON文件迁移到PostgreSQL或MongoDB
   - 使用连接池管理数据库连接

2. **性能优化**：
   - 启用Gzip压缩
   - 使用CDN加速静态资源
   - 配置缓存策略

3. **监控和日志**：
   - 使用PM2监控（云服务器）
   - 配置错误日志收集（Sentry等）
   - 设置健康检查

4. **安全加固**：
   - 使用HTTPS
   - 配置防火墙规则
   - 定期更新依赖
   - 使用环境变量存储敏感信息

5. **备份策略**：
   - 定期备份 `data.json`
   - 使用Git版本控制
   - 考虑数据库自动备份

---

## 快速部署命令（云服务器）

```bash
# 一键部署脚本（需要根据实际情况修改）
#!/bin/bash

# 后端
cd backend
npm install --production
pm2 start index.js --name chat-backend
pm2 save

# 前端
cd ../frontend
npm install
npm run build
sudo cp -r dist/* /var/www/html/
```

---

## 推荐部署方案

**个人项目/小规模**：
- 前端：Vercel（免费，自动HTTPS）
- 后端：Railway（免费额度，支持WebSocket）

**生产环境/商业项目**：
- 云服务器（阿里云/腾讯云/AWS）
- Nginx + PM2
- 数据库迁移（PostgreSQL）

---

## 下一步

部署完成后，记得：
1. 测试所有功能
2. 配置域名DNS
3. 设置监控和告警
4. 定期备份数据
5. 更新文档中的生产环境URL



