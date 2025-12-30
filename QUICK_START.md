# 快速开始指南

## 安装和启动

### 1. 安装依赖

```bash
# 安装前端依赖
cd frontend
npm install

# 安装后端依赖
cd ../backend
npm install
```

### 2. 启动服务

**终端 1 - 启动后端：**
```bash
cd backend
npm run dev
```

**终端 2 - 启动前端：**
```bash
cd frontend
npm run dev
```

### 3. 访问应用

- 前端：http://localhost:3000
- 后端 API：http://localhost:5000

## 3 条 curl 测试命令

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

### 3. 获取好友列表
```bash
curl "http://localhost:5000/friends?userId=1"
```

## 前端点击路径

### 路径 1：搜索并添加好友
1. 访问 http://localhost:3000
2. 在搜索框输入 `bob` 或 `charlie`
3. 点击"搜索"按钮
4. 点击用户卡片右侧的"添加好友"按钮

### 路径 2：查看并接受好友请求
1. 点击顶部导航栏的"好友列表"
2. 在"待处理的好友请求"区域找到请求
3. 点击"接受"按钮

### 路径 3：查看完整好友状态
1. 在好友列表页面查看三个区域：
   - 待处理的好友请求（黄色边框）
   - 已发送的好友请求（蓝色边框）
   - 我的好友（绿色边框）

## 数据持久化

所有数据存储在 `backend/data.json` 文件中，重启服务后数据不会丢失。

初始数据包含4个测试用户：
- alice (ID: 1)
- bob (ID: 2)
- charlie (ID: 3)
- david (ID: 4)

