# 快速参考卡片

## 🚀 部署步骤速查

### 后端部署（Railway）

1. 访问 https://railway.app
2. 登录 → New Project → Deploy from GitHub
3. Root Directory: `backend`
4. 环境变量：
   - `PORT=5001`
   - `NODE_ENV=production`
   - `DEEPSEEK_API_KEY=你的密钥`
   - `FRONTEND_URL=稍后填`
5. 复制后端URL

### 前端部署（Vercel）

1. 访问 https://vercel.com
2. 登录 → Add New Project → Import GitHub repo
3. Root Directory: `frontend`
4. Framework: `Vite`
5. 环境变量：
   - `VITE_API_BASE_URL=后端URL`
   - `VITE_SOCKET_URL=后端URL`
6. 复制前端URL

### 连接前后端

1. 回到Railway
2. 更新 `FRONTEND_URL=前端URL`
3. 等待重新部署

---

## 🔗 重要链接

- Railway: https://railway.app
- Vercel: https://vercel.com
- DeepSeek: https://platform.deepseek.com

---

## ⚙️ 环境变量清单

### Railway（后端）
```
PORT=5001
NODE_ENV=production
DEEPSEEK_API_KEY=你的密钥
FRONTEND_URL=https://你的前端.vercel.app
```

### Vercel（前端）
```
VITE_API_BASE_URL=https://你的后端.railway.app
VITE_SOCKET_URL=https://你的后端.railway.app
```

---

## 🧪 测试检查

- [ ] 后端: `https://后端URL/health` → `{"status":"healthy"}`
- [ ] 前端: 页面正常加载
- [ ] API: 无CORS错误
- [ ] WebSocket: 实时聊天正常

---

## ❗ 常见错误

**CORS错误** → 检查Railway的 `FRONTEND_URL`

**WebSocket失败** → 检查 `VITE_SOCKET_URL` 是否正确

**构建失败** → 检查Root Directory是否为 `frontend` 或 `backend`

