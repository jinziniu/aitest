# 端口配置说明

本项目已支持通过环境变量配置端口，方便 Windows 和 Mac 用户协作开发。

## 前端配置

### 1. 创建 `.env` 文件

在 `frontend` 目录下创建 `.env` 文件：

```bash
cd frontend
```

创建 `.env` 文件，内容如下：

```env
# 前端开发服务器端口（可选，默认3000）
VITE_PORT=3000

# 后端API基础URL（可选，默认 http://localhost:5001）
# 如果后端在不同端口，可以修改为其他端口
VITE_API_BASE_URL=http://localhost:5001

# Socket.IO服务器URL（可选，默认与API_BASE_URL相同）
# 如果Socket服务器在不同端口，可以单独设置
VITE_SOCKET_URL=http://localhost:5001
```

### 2. 使用说明

- **Windows 用户**：通常可以使用默认配置（端口 5001 和 3000）
- **Mac 用户**：如果端口被占用，可以修改端口号
  - 例如：将后端端口改为 `5002`，前端端口改为 `3001`
  - 记得同时更新 `VITE_API_BASE_URL` 和 `VITE_SOCKET_URL`

### 3. 修改端口示例（如果端口被占用）

如果 5001 端口被占用，可以这样配置：

**frontend/.env:**
```env
VITE_PORT=3000
VITE_API_BASE_URL=http://localhost:5002
VITE_SOCKET_URL=http://localhost:5002
```

**backend/.env:**
```env
PORT=5002
FRONTEND_URL=http://localhost:3000
```

## 后端配置

### 1. 创建 `.env` 文件

在 `backend` 目录下创建 `.env` 文件：

```bash
cd backend
```

创建 `.env` 文件，内容如下：

```env
# 后端服务器端口（可选，默认5001）
# 如果端口被占用，可以修改为其他端口，如 5002
PORT=5001

# 前端URL（用于CORS配置，可选，默认 http://localhost:3000）
# 如果前端在不同端口，需要修改此值
FRONTEND_URL=http://localhost:3000

# DeepSeek API配置（必需）
DEEPSEEK_API_KEY=your_deepseek_api_key_here

# DeepSeek API基础URL（可选，默认 https://api.deepseek.com/v1）
DEEPSEEK_API_BASE=https://api.deepseek.com/v1

# DeepSeek模型名称（可选，默认 deepseek-chat）
DEEPSEEK_MODEL=deepseek-chat
```

### 2. 端口冲突处理

如果遇到端口被占用的情况：

1. **检查端口占用**：
   - Windows: `netstat -ano | findstr :5001`
   - Mac/Linux: `lsof -i :5001`

2. **修改端口**：
   - 修改 `backend/.env` 中的 `PORT` 值
   - 修改 `frontend/.env` 中的 `VITE_API_BASE_URL` 和 `VITE_SOCKET_URL` 值
   - 确保前后端端口配置一致

## 常见问题

### Q: 如何知道端口是否被占用？

**Windows:**
```powershell
netstat -ano | findstr :5001
```

**Mac:**
```bash
lsof -i :5001
```

### Q: 修改端口后需要重启服务吗？

是的，修改 `.env` 文件后需要：
1. 停止当前运行的服务（Ctrl+C）
2. 重新启动后端和前端服务

### Q: 团队成员使用不同端口会有问题吗？

不会，每个开发者可以在自己的 `.env` 文件中配置不同的端口。`.env` 文件不会被提交到 Git（已在 `.gitignore` 中）。

### Q: 如何确保前后端端口配置一致？

确保：
- `backend/.env` 中的 `PORT` 值
- `frontend/.env` 中的 `VITE_API_BASE_URL` 和 `VITE_SOCKET_URL` 中的端口号
- 三者保持一致

## 默认配置

如果不创建 `.env` 文件，系统将使用以下默认值：

- **后端端口**: 5001
- **前端端口**: 3000
- **API URL**: http://localhost:5001
- **Socket URL**: http://localhost:5001

## 注意事项

1. `.env` 文件包含敏感信息（如 API Key），**不要**提交到 Git
2. 如果修改了端口，记得通知团队成员更新他们的配置
3. 确保防火墙允许相应端口的访问

