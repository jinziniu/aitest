# 分离部署检查清单

## 🚀 快速部署步骤

### 第一步：部署后端到 Railway

- [ ] 访问 https://railway.app 并注册
- [ ] 创建新项目，选择 "Deploy from GitHub repo"
- [ ] 选择你的仓库
- [ ] 设置 Root Directory: `backend`
- [ ] 添加环境变量：
  - [ ] `PORT=5001`
  - [ ] `NODE_ENV=production`
  - [ ] `DEEPSEEK_API_KEY=你的API密钥`
  - [ ] `FRONTEND_URL=`（先留空，等前端部署完再填）
- [ ] 等待部署完成
- [ ] 复制后端URL（格式：`https://xxx.up.railway.app`）
- [ ] 测试：访问 `https://后端URL/health` 应该返回 `{"status":"healthy"}`

### 第二步：部署前端到 Vercel

- [ ] 访问 https://vercel.com 并注册
- [ ] 点击 "Add New Project"
- [ ] 导入GitHub仓库
- [ ] 配置项目：
  - [ ] Framework Preset: `Vite`
  - [ ] Root Directory: `frontend`
  - [ ] Build Command: `npm run build`
  - [ ] Output Directory: `dist`
- [ ] 添加环境变量：
  - [ ] `VITE_API_BASE_URL=https://你的后端URL.railway.app`
  - [ ] `VITE_SOCKET_URL=https://你的后端URL.railway.app`
- [ ] 点击 "Deploy"
- [ ] 等待部署完成
- [ ] 复制前端URL（格式：`https://xxx.vercel.app`）

### 第三步：更新后端CORS

- [ ] 回到Railway项目
- [ ] 更新环境变量 `FRONTEND_URL=https://你的前端URL.vercel.app`
- [ ] Railway会自动重新部署

### 第四步：测试

- [ ] 访问前端URL，页面正常加载
- [ ] 打开浏览器开发者工具（F12）
- [ ] 测试用户登录/切换
- [ ] 检查Network标签，API请求是否成功
- [ ] 测试实时聊天功能
- [ ] 检查控制台是否有错误

## ✅ 部署完成检查

- [ ] 前端可以正常访问
- [ ] 后端健康检查通过
- [ ] API请求正常（无CORS错误）
- [ ] WebSocket连接正常
- [ ] 所有功能正常工作

## 📝 需要的信息

部署前准备好：
- [ ] DeepSeek API密钥
- [ ] GitHub仓库已推送最新代码
- [ ] 两个平台的账号（Railway和Vercel）

## 🔗 重要链接

- Railway: https://railway.app
- Vercel: https://vercel.com
- 详细指南: 查看 `DEPLOY_SEPARATE_GUIDE.md`

## ⚠️ 常见问题

**CORS错误**：
- 检查Railway的 `FRONTEND_URL` 是否正确
- 确保包含 `https://` 协议

**WebSocket连接失败**：
- Railway支持WebSocket，无需额外配置
- 确保使用HTTPS（`wss://`）

**环境变量不生效**：
- Vercel：更改后需要重新部署
- Railway：更改后自动重新部署

---

**预计时间**：15-20分钟
**难度**：⭐（简单）



