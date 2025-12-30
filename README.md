# 全栈项目

这是一个前后端分离的全栈项目，前端使用 React + Vite + TypeScript，后端使用 Node.js + Express。

## 项目结构

```
.
├── frontend/          # 前端项目（React + Vite + TypeScript）
│   └── src/
│       ├── pages/     # 页面组件（搜索用户、好友列表）
│       └── App.tsx    # 主应用组件
├── backend/           # 后端项目（Node.js + Express）
│   ├── db.js         # 数据存储模块（JSON文件）
│   ├── index.js      # Express服务器
│   └── data.json     # 数据文件（自动生成）
├── README.md         # 项目说明文档
└── TEST_COMMANDS.md  # 测试命令和操作路径
```

## 快速开始

### 前置要求

- Node.js >= 18.0.0
- npm >= 9.0.0

### 安装依赖

#### 前端依赖
```bash
cd frontend
npm install
```

#### 后端依赖
```bash
cd backend
npm install
```

### 启动项目

#### 启动前端（端口 3000）
```bash
cd frontend
npm run dev
```

前端将在 http://localhost:3000 启动，首页会显示 "OK"。

#### 启动后端（端口 5000）
```bash
cd backend
npm run dev
```

后端将在 http://localhost:5000 启动。

### 访问

- 前端：http://localhost:3000
- 后端 API：http://localhost:5000

## 开发说明

### 前端

- **技术栈**：React 18 + Vite 5 + TypeScript
- **开发服务器**：Vite Dev Server（端口 3000）
- **构建命令**：`npm run build`
- **预览构建**：`npm run preview`

### 后端

- **技术栈**：Node.js + Express
- **开发服务器**：Node.js Watch Mode（端口 5000）
- **数据存储**：JSON文件（`backend/data.json`）
- **API 路由**：
  - `GET /` - 返回 `{ message: 'OK', status: 'success' }`
  - `GET /health` - 健康检查
  - `GET /users` - 获取所有用户
  - `GET /users?search=` - 搜索用户
  - `GET /users/:id` - 获取单个用户
  - `POST /users` - 创建用户
  - `PUT /users/:id` - 更新用户
  - `DELETE /users/:id` - 删除用户
  - `POST /friends/request` - 发送好友请求
  - `POST /friends/accept` - 接受好友请求
  - `GET /friends?userId=` - 获取好友列表
  - `POST /chat/system` - System AI 聊天
  - `POST /chat/friend` - Friend Proxy AI 聊天
  - `GET /chat/messages` - 获取聊天历史
  - `GET /messages/private?userId=&peerUserId=` - 获取私聊消息历史
  - **WebSocket (Socket.IO)** - 实时私聊功能

## 项目特性

- ✅ 前端 React + Vite + TypeScript 配置完成
- ✅ 后端 Express 服务器配置完成
- ✅ CORS 跨域支持
- ✅ 开发模式热重载
- ✅ TypeScript 类型支持
- ✅ 用户搜索功能
- ✅ 用户管理（增删改查）
- ✅ 好友请求系统（发送/接受）
- ✅ 好友列表（pending/accepted状态）
- ✅ 数据持久化（JSON文件存储）
- ✅ React Router 路由导航
- ✅ System AI 聊天（通用AI助手）
- ✅ Friend Proxy AI 聊天（基于好友persona的AI代理）
- ✅ 消息持久化存储
- ✅ 隐私保护（Friend Proxy AI不编造隐私信息）
- ✅ 实时私聊功能（Socket.IO）
- ✅ 断线重连机制
- ✅ 消息去重和乐观更新

## 功能说明

### 好友功能

1. **搜索用户**：在搜索页面输入用户名或邮箱搜索用户
2. **发送好友请求**：点击"添加好友"按钮发送请求
3. **接受好友请求**：在好友列表页面接受待处理的请求
4. **查看好友状态**：
   - 待处理的好友请求（别人发给你的）
   - 已发送的好友请求（你发给别人的）
   - 我的好友（已接受的好友）

### 用户管理功能

1. **用户列表**：
   - 点击导航栏的 "用户管理" 进入
   - 查看所有用户信息（ID、用户名、邮箱、Bio）

2. **添加用户**：
   - 点击 "+ 添加用户" 按钮
   - 填写用户名、邮箱（必填）
   - 可选填写 Persona Seed 和 Bio

3. **编辑用户**：
   - 在用户列表中点击 "编辑" 按钮
   - 修改用户信息
   - 支持更新用户名、邮箱、Persona Seed 和 Bio

4. **删除用户**：
   - 在用户列表中点击 "删除" 按钮
   - 删除用户会同时删除该用户的所有好友关系和消息
   - 需要确认操作

### AI 聊天功能

1. **System AI 聊天**：
   - 点击导航栏的 "System AI" 进入
   - 通用AI助手，可以回答各种问题
   - 页面清楚标注 "System AI"

2. **Friend Proxy AI 聊天**：
   - 在好友列表中点击 "开始聊天" 按钮
   - 基于好友的 persona_seed 和 bio 回复
   - 严格保护隐私，不编造个人信息
   - 页面清楚标注 "Friend Proxy AI"

3. **消息持久化**：
   - 所有消息保存到数据库
   - 刷新页面后消息历史仍然存在

### 实时私聊功能

1. **实时聊天**：
   - 在好友列表中点击 "实时聊天" 按钮
   - 两个用户可以在不同浏览器窗口实时聊天
   - 消息延迟：200ms~1s
   - 自动断线重连

2. **功能特性**：
   - ✅ 只有互为好友（accepted）才能聊天
   - ✅ Socket连接鉴权（token验证）
   - ✅ 消息落库（刷新不丢）
   - ✅ 消息去重（防止重复）
   - ✅ 乐观更新（发送即显示）
   - ✅ 连接状态显示（已连接/重连中/未连接）
   - ✅ 断线自动重连

3. **技术实现**：
   - 后端：Socket.IO + Express
   - 前端：socket.io-client
   - 房间ID：deterministic（sort(userId1, userId2).join(":")）
   - 鉴权：Socket连接时携带token（userId）

### 测试文档

- 好友功能测试：查看 [TEST_COMMANDS.md](./TEST_COMMANDS.md)
- AI聊天测试：查看 [AI_CHAT_TEST.md](./AI_CHAT_TEST.md)
- Prompt模板：查看 [PROMPT_TEMPLATES.md](./PROMPT_TEMPLATES.md)
- 实时聊天测试：查看 [REALTIME_CHAT_GUIDE.md](./REALTIME_CHAT_GUIDE.md) 和 [FINAL_TESTING_STEPS.md](./FINAL_TESTING_STEPS.md)

## 下一步

- [x] 添加 API 路由
- [x] 数据持久化（JSON文件）
- [x] AI 聊天功能（System AI + Friend Proxy AI）
- [x] 实时私聊功能（Socket.IO）
- [ ] 集成真实 AI API（OpenAI/Claude等）
- [ ] 配置数据库连接（SQLite/PostgreSQL）
- [ ] 添加用户认证（JWT）
- [ ] 添加状态管理（Redux/Zustand）
- [ ] 添加 UI 组件库
- [ ] 添加消息已读状态
- [ ] 添加输入中提示（typing indicator）

