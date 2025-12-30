# DeepSeek API 集成说明

## 配置步骤

### 1. 获取 DeepSeek API Key

1. 访问 [DeepSeek 开发者平台](https://platform.deepseek.com/)
2. 注册/登录账号
3. 创建新项目或使用现有项目
4. 生成 API Key 并复制保存

### 2. 配置环境变量

在 `backend` 目录下创建 `.env` 文件：

```bash
cd backend
cp .env.example .env
```

编辑 `.env` 文件，填入你的 API Key：

```
DEEPSEEK_API_KEY=your_actual_api_key_here
```

### 3. 安装依赖（如果需要）

当前实现使用 Node.js 内置的 `fetch` API（Node.js 18+），无需额外安装依赖。

如果你的 Node.js 版本低于 18，需要安装 `node-fetch`：

```bash
cd backend
npm install node-fetch
```

然后在 `backend/ai.js` 文件开头添加：

```javascript
import fetch from 'node-fetch';
```

### 4. 启动服务

```bash
cd backend
npm run dev
```

## API 配置说明

### 环境变量

- `DEEPSEEK_API_KEY` (必需): 你的 DeepSeek API Key
- `DEEPSEEK_API_BASE` (可选): API 端点，默认为 `https://api.deepseek.com/v1`
- `DEEPSEEK_MODEL` (可选): 模型名称，默认为 `deepseek-chat`

### 支持的模型

- `deepseek-chat`: 标准对话模型（默认）
- `deepseek-coder`: 代码专用模型
- 其他 DeepSeek 提供的模型

## 功能说明

### System AI

使用 DeepSeek API 生成通用 AI 助手回复，可以回答各种问题。

### Friend Proxy AI

使用 DeepSeek API 生成基于好友 persona 的个性化回复：
- 严格遵循好友的 `persona_seed` 和 `bio`
- 不编造隐私信息
- 回复风格匹配好友的个性

## 错误处理

如果 API 调用失败，系统会：
1. 在控制台输出错误信息
2. 返回错误响应给前端
3. 前端会显示错误提示

## 测试

1. 确保 `.env` 文件配置正确
2. 启动后端服务
3. 在前端测试 System AI 和 Friend Proxy AI 功能
4. 检查控制台是否有错误信息

## 注意事项

- API Key 请妥善保管，不要提交到代码仓库
- `.env` 文件已在 `.gitignore` 中，不会被提交
- 如果 API 调用失败，检查网络连接和 API Key 是否正确
- DeepSeek API 可能有使用限制，请查看官方文档

