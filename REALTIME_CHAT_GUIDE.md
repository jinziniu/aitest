# 实时私聊功能使用指南

## 功能概述

实现了两个用户之间的实时私聊功能，支持：
- 实时消息收发（200ms~1s延迟）
- 消息持久化存储
- 断线自动重连
- 消息去重和乐观更新
- Socket连接鉴权

## 快速开始

### 1. 安装依赖

**后端：**
```bash
cd backend
npm install
```

**前端：**
```bash
cd frontend
npm install
```

### 2. 启动服务

**终端1 - 启动后端：**
```bash
cd backend
npm run dev
```

**终端2 - 启动前端：**
```bash
cd frontend
npm run dev
```

### 3. 测试实时聊天

#### 方法一：使用两个浏览器窗口（推荐）

1. **准备两个用户并建立好友关系**：
   - 打开浏览器窗口1，访问 http://localhost:3000
   - 使用用户1（alice，ID: 1）登录
   - 搜索用户2（bob），发送好友请求
   - 切换到用户2，接受好友请求

2. **打开两个浏览器窗口**：
   - **窗口1**：http://localhost:3000（用户1）
   - **窗口2**：http://localhost:3000（用户2）

3. **在两个窗口中分别登录不同用户**：
   - 窗口1：点击右上角用户切换器，选择"alice"（用户1）
   - 窗口2：点击右上角用户切换器，选择"bob"（用户2）

4. **进入实时聊天**：
   - 窗口1：好友列表 → 找到bob → 点击"实时聊天"
   - 窗口2：好友列表 → 找到alice → 点击"实时聊天"

5. **测试消息收发**：
   - 在窗口1发送消息："Hello from alice"
   - 观察窗口2，应该在200ms~1s内收到消息
   - 在窗口2回复："Hi alice, this is bob"
   - 观察窗口1，应该立即收到消息

6. **测试断线重连**：
   - 停止后端服务（Ctrl+C）
   - 观察前端连接状态变为"未连接"
   - 重新启动后端服务
   - 观察前端自动重连，状态变为"已连接"
   - 发送消息测试是否正常

7. **测试消息持久化**：
   - 发送几条消息
   - 刷新页面（F5）
   - 消息应该仍然存在

#### 方法二：使用Node.js测试脚本

**终端1 - 启动后端：**
```bash
cd backend
npm run dev
```

**终端2 - 用户1：**
```bash
cd backend
node test-socket.js 1 2
```

**终端3 - 用户2：**
```bash
cd backend
node test-socket.js 2 1
```

在终端2和终端3中分别输入消息，观察实时收发效果。

## 验收标准检查清单

- [ ] 两个浏览器窗口可以分别登录不同用户
- [ ] 进入同一个私聊对话（通过好友列表的"实时聊天"按钮）
- [ ] A发消息，B端200ms~1s内收到并显示
- [ ] B发消息，A端200ms~1s内收到并显示
- [ ] 消息落库：刷新页面后消息不丢失
- [ ] 只有互为好友（accepted）才能建立连接和发送消息
- [ ] Socket连接需要鉴权（携带token）
- [ ] 房间ID是deterministic的（双方进入同一房间）
- [ ] 断线后自动重连
- [ ] 重连后重新join room
- [ ] 不会产生重复消息（去重机制）

## 技术细节

### Socket事件

**客户端 → 服务器：**
- `join_private_chat({ peerUserId })` - 加入私聊房间
- `send_private_message({ peerUserId, content, clientMsgId })` - 发送私聊消息

**服务器 → 客户端：**
- `joined_room({ roomId, peerUserId })` - 加入房间成功
- `private_message({ roomId, message })` - 收到私聊消息
- `message_sent({ clientMsgId, serverMsgId })` - 消息发送确认
- `error({ message })` - 错误信息

### 房间ID生成规则

```javascript
roomId = [userId1, userId2].sort().join(':')
```

例如：用户1和用户2的roomId = "1:2"

### 消息结构

```javascript
{
  id: string,              // 服务器生成的消息ID
  senderId: string,        // 发送者ID
  receiverId: string,      // 接收者ID
  roomId: string,          // 房间ID
  content: string,         // 消息内容
  clientMsgId?: string,    // 客户端消息ID（用于去重）
  createdAt: string        // 创建时间
}
```

### 鉴权机制

Socket连接时，客户端需要在`auth.token`中传递userId：

```javascript
socket = io(SOCKET_URL, {
  auth: {
    token: userId  // 实际应用中应该使用JWT token
  }
});
```

服务器验证token（userId）是否存在，并将userId附加到socket对象。

## 常见问题排查

### 1. Socket连接失败

**问题**：前端显示"未连接"

**排查步骤**：
1. 检查后端服务是否运行（http://localhost:5000）
2. 检查浏览器控制台是否有错误
3. 检查CORS配置是否正确
4. 检查Socket URL是否正确（默认：http://localhost:5000）

### 2. 消息发送失败

**问题**：点击发送按钮没有反应

**排查步骤**：
1. 检查Socket连接状态（应该显示"已连接"）
2. 检查是否互为好友（accepted状态）
3. 检查浏览器控制台错误信息
4. 检查后端控制台日志

### 3. 消息重复

**问题**：同一条消息显示多次

**排查步骤**：
1. 检查消息去重逻辑（通过id或clientMsgId）
2. 检查是否多次join room
3. 检查是否有多个Socket连接

### 4. 消息丢失

**问题**：刷新页面后消息消失

**排查步骤**：
1. 检查后端data.json文件是否存在
2. 检查消息是否成功保存到数据库
3. 检查REST API `/messages/private` 是否正常

### 5. 端口冲突

**问题**：端口5000或3000被占用

**解决方案**：
- 修改后端端口：在`.env`中设置`PORT=5001`
- 修改前端端口：在`vite.config.ts`中修改`server.port`

### 6. CORS错误

**问题**：浏览器控制台显示CORS错误

**解决方案**：
- 检查后端CORS配置
- 确保前端URL在CORS允许列表中
- 检查Socket.IO的CORS配置

## 测试命令

### 测试REST API

```bash
# 获取私聊消息历史
curl "http://localhost:5000/messages/private?userId=1&peerUserId=2"
```

### 测试Socket连接（使用Node脚本）

```bash
# 用户1连接
cd backend
node test-socket.js 1 2

# 用户2连接（新终端）
cd backend
node test-socket.js 2 1
```

## 下一步优化

- [ ] 添加消息已读状态
- [ ] 添加输入中提示（typing indicator）
- [ ] 添加消息时间戳格式化
- [ ] 添加消息搜索功能
- [ ] 添加文件/图片发送
- [ ] 使用JWT token替代简单userId
- [ ] 添加消息推送通知

