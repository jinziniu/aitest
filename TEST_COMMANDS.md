# 测试命令和操作路径

## 后端 API 测试（curl 命令）

### 1. 搜索用户
```bash
curl "http://localhost:5000/users?search=alice"
```

### 2. 发送好友请求
```bash
curl -X POST http://localhost:5000/friends/request \
  -H "Content-Type: application/json" \
  -d "{\"fromUserId\":\"1\",\"toUserId\":\"2\"}"
```

### 3. 接受好友请求
```bash
curl -X POST http://localhost:5000/friends/accept \
  -H "Content-Type: application/json" \
  -d "{\"friendshipId\":\"1735123456789\",\"userId\":\"2\"}"
```

### 4. 获取好友列表
```bash
curl "http://localhost:5000/friends?userId=1"
```

## 前端操作路径

### 路径 1：搜索用户并发送好友请求
1. 启动前端：`cd frontend && npm run dev`
2. 浏览器访问：http://localhost:3000
3. 在搜索框输入用户名（如：`bob` 或 `charlie`）
4. 点击"搜索"按钮
5. 在搜索结果中，点击用户卡片右侧的"添加好友"按钮
6. 系统会显示"已向 [用户名] 发送好友请求"的提示

### 路径 2：查看好友列表并接受请求
1. 点击顶部导航栏的"好友列表"链接
2. 在"待处理的好友请求"区域，可以看到收到的好友请求
3. 点击"接受"按钮接受好友请求
4. 接受后，该用户会出现在"我的好友"区域

### 路径 3：查看完整好友状态
1. 在好友列表页面，可以看到三个区域：
   - **待处理的好友请求**：别人发给你的请求（pending状态，isFromMe=false）
   - **已发送的好友请求**：你发给别人的请求（pending状态，isFromMe=true）
   - **我的好友**：已接受的好友（accepted状态）

## 测试场景示例

### 场景 1：用户1 向用户2 发送好友请求
1. 前端搜索用户：搜索 "bob"
2. 点击"添加好友"按钮
3. 切换到"好友列表"页面，在"已发送的好友请求"区域可以看到请求

### 场景 2：用户2 接受用户1 的好友请求
1. 修改前端代码中的 `CURRENT_USER_ID` 为 `'2'`（在 SearchUsers.tsx 和 FriendsList.tsx 中）
2. 刷新页面，进入"好友列表"
3. 在"待处理的好友请求"区域可以看到用户1的请求
4. 点击"接受"按钮
5. 用户1会出现在"我的好友"区域

### 场景 3：验证数据持久化
1. 发送几个好友请求
2. 停止后端服务
3. 重新启动后端服务
4. 查看好友列表，数据应该仍然存在（存储在 `backend/data.json`）

## 注意事项

- 当前用户ID硬编码为 `'1'`，实际应用中应该从认证系统获取
- 数据存储在 `backend/data.json` 文件中
- 后端默认端口：5000
- 前端默认端口：3000
- 确保后端服务已启动后再测试前端功能

