# 小规模项目分离部署指南

本指南专门针对小规模项目的分离部署方案，使用免费或低成本服务。

## 推荐组合

**最佳选择**：
- **前端**：Vercel（免费，自动HTTPS，全球CDN）
- **后端**：Railway（免费额度，支持WebSocket，简单易用）

**备选方案**：
- **前端**：Netlify 或 Cloudflare Pages
- **后端**：Render（免费但有休眠限制）或 Fly.io

---

## 第一步：部署后端到 Railway

### 1.1 注册和准备

1. 访问 https://railway.app
2. 点击 "Start a New Project"
3. 选择 "Deploy from GitHub repo"
4. 授权GitHub访问，选择你的仓库

### 1.2 配置项目

1. **设置根目录**：
   - 在项目设置中找到 "Root Directory"
   - 设置为：`backend`

2. **配置环境变量**：
   点击 "Variables" 标签，添加以下环境变量：

   ```
   PORT=5001
   NODE_ENV=production
   DEEPSEEK_API_KEY=your_deepseek_api_key_here
   FRONTEND_URL=https://your-frontend.vercel.app
   ```
   
   ⚠️ **注意**：`FRONTEND_URL` 先留空，等前端部署完成后再填写

3. **Railway会自动**：
   - 检测到Node.js项目
   - 运行 `npm install`
   - 运行 `npm start`（使用package.json中的start脚本）

### 1.3 获取后端URL

1. 部署完成后，Railway会提供一个URL
2. 格式类似：`https://your-app-name.up.railway.app`
3. **复制这个URL**，稍后配置前端时需要

### 1.4 测试后端

访问：`https://your-backend-url.railway.app/health`

应该返回：`{"status":"healthy"}`

---

## 第二步：部署前端到 Vercel

### 2.1 注册和准备

1. 访问 https://vercel.com
2. 点击 "Sign Up" 使用GitHub账号登录
3. 点击 "Add New Project"

### 2.2 导入项目

1. 选择你的GitHub仓库
2. 配置项目设置：

   **Framework Preset**: `Vite`
   
   **Root Directory**: `frontend`
   
   **Build Command**: `npm run build`
   
   **Output Directory**: `dist`
   
   **Install Command**: `npm install`

### 2.3 配置环境变量

在 "Environment Variables" 部分添加：

```
VITE_API_BASE_URL=https://your-backend-url.railway.app
VITE_SOCKET_URL=https://your-backend-url.railway.app
```

⚠️ **重要**：将 `your-backend-url.railway.app` 替换为第一步获取的实际URL

### 2.4 部署

1. 点击 "Deploy"
2. Vercel会自动：
   - 安装依赖
   - 构建项目
   - 部署到全球CDN
3. 部署完成后会提供一个URL，格式：`https://your-project.vercel.app`

### 2.5 获取前端URL

**复制前端URL**，格式：`https://your-project.vercel.app`

---

## 第三步：更新后端CORS配置

### 3.1 回到Railway

1. 进入你的Railway项目
2. 点击 "Variables" 标签
3. 更新 `FRONTEND_URL` 环境变量：

   ```
   FRONTEND_URL=https://your-project.vercel.app
   ```
   
   将 `your-project.vercel.app` 替换为第二步获取的实际前端URL

### 3.2 重新部署

Railway会自动检测环境变量变化并重新部署（或手动点击 "Redeploy"）

---

## 第四步：测试部署

### 4.1 测试清单

- [ ] 访问前端URL，页面正常加载
- [ ] 打开浏览器开发者工具（F12）→ Network标签
- [ ] 尝试登录/切换用户，检查API请求是否成功
- [ ] 测试实时聊天功能，检查WebSocket连接
- [ ] 检查控制台是否有错误

### 4.2 常见问题排查

**问题1：API请求失败（CORS错误）**
- 检查Railway的 `FRONTEND_URL` 是否正确
- 确保URL包含 `https://` 协议
- 重新部署后端

**问题2：WebSocket连接失败**
- 确保使用 `wss://`（HTTPS的WebSocket）
- 检查Railway是否支持WebSocket（Railway支持）
- 查看浏览器控制台的错误信息

**问题3：环境变量不生效**
- Vercel：环境变量更改后需要重新部署
- Railway：环境变量更改后会自动重新部署

---

## 成本说明

### 免费额度

**Vercel**：
- ✅ 无限带宽
- ✅ 自动HTTPS
- ✅ 全球CDN
- ✅ 自动部署（GitHub推送）
- 限制：个人项目完全免费

**Railway**：
- ✅ $5 免费额度/月
- ✅ 支持WebSocket
- ✅ 自动部署
- 小规模项目通常不会超出免费额度

### 超出免费额度后

如果Railway超出免费额度（通常需要大量流量）：
- 考虑迁移到Render（免费但有休眠限制）
- 或使用云服务器（约$5-10/月）

---

## 持续部署（CI/CD）

### 自动部署已配置

一旦完成初始部署：

1. **前端（Vercel）**：
   - 每次推送到GitHub main分支
   - Vercel自动检测并重新部署
   - 环境变量保持不变

2. **后端（Railway）**：
   - 每次推送到GitHub main分支
   - Railway自动检测并重新部署
   - 环境变量保持不变

### 手动触发部署

如果需要手动触发：

- **Vercel**：在项目页面点击 "Redeploy"
- **Railway**：在项目页面点击 "Redeploy"

---

## 环境变量管理

### 生产环境变量清单

**Railway（后端）**：
```
PORT=5001
NODE_ENV=production
DEEPSEEK_API_KEY=your_api_key_here
FRONTEND_URL=https://your-frontend.vercel.app
```

**Vercel（前端）**：
```
VITE_API_BASE_URL=https://your-backend.railway.app
VITE_SOCKET_URL=https://your-backend.railway.app
```

### 安全提示

⚠️ **重要**：
- 不要将 `.env` 文件提交到Git
- API密钥等敏感信息只存储在平台的环境变量中
- 定期轮换API密钥

---

## 监控和维护

### 查看日志

**Railway**：
- 在项目页面点击 "View Logs"
- 可以看到实时日志和错误信息

**Vercel**：
- 在项目页面点击 "Functions" → "View Logs"
- 可以看到构建和运行时日志

### 性能监控

**Vercel Analytics**（可选）：
- 在Vercel项目设置中启用Analytics
- 查看页面访问统计和性能指标

---

## 故障排除

### 后端无法访问

1. 检查Railway项目状态是否为 "Active"
2. 查看Railway日志是否有错误
3. 确认环境变量配置正确
4. 测试健康检查端点：`/health`

### 前端构建失败

1. 检查Vercel构建日志
2. 确认 `Root Directory` 设置为 `frontend`
3. 检查 `package.json` 中的构建脚本
4. 确保所有依赖都已安装

### WebSocket连接问题

1. 确认使用HTTPS（`wss://`）
2. 检查Railway是否支持WebSocket（Railway支持）
3. 查看浏览器控制台的WebSocket错误
4. 确认 `VITE_SOCKET_URL` 环境变量正确

---

## 下一步优化

部署成功后，可以考虑：

1. **自定义域名**：
   - Vercel和Railway都支持自定义域名
   - 在项目设置中配置DNS

2. **数据库迁移**：
   - 当前使用JSON文件存储
   - 考虑迁移到PostgreSQL（Railway提供免费PostgreSQL）

3. **监控和告警**：
   - 设置Uptime监控
   - 配置错误告警

---

## 快速参考

### 部署检查清单

- [ ] Railway后端部署成功
- [ ] 后端健康检查通过
- [ ] Vercel前端部署成功
- [ ] 前端环境变量配置正确
- [ ] 后端CORS配置正确（FRONTEND_URL）
- [ ] API请求正常
- [ ] WebSocket连接正常
- [ ] 所有功能测试通过

### 常用命令

```bash
# 本地测试构建
cd frontend
npm run build
npm run preview

# 本地测试后端
cd backend
npm start
```

---

## 需要帮助？

如果遇到问题：
1. 查看平台文档
2. 检查部署日志
3. 查看浏览器控制台错误
4. 确认环境变量配置

祝你部署顺利！🚀



