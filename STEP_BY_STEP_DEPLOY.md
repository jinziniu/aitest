# 一步一步部署指南（小范围使用）

本指南将一步一步带你完成部署，适合小范围（几个人）使用。

**预计总时间**：20-30分钟  
**难度**：非常简单，跟着做就行

---

## 📋 准备工作

在开始之前，请确保：

- [ ] 你的代码已经推送到GitHub（如果还没有，先推送）
- [ ] 你有DeepSeek API密钥（如果没有，去 https://platform.deepseek.com 获取）
- [ ] 你有GitHub账号
- [ ] 准备两个邮箱（一个注册Railway，一个注册Vercel，或者用同一个也可以）

**准备好了吗？我们开始！**

---

## 第一部分：部署后端到 Railway

### 步骤 1：打开Railway网站

1. 打开浏览器
2. 访问：**https://railway.app**
3. 你会看到Railway的首页

### 步骤 2：注册账号

1. 点击页面右上角的 **"Start a New Project"** 或 **"Login"** 按钮
2. 选择 **"Login with GitHub"**（推荐，最简单）
3. 授权Railway访问你的GitHub账号
4. 完成注册

### 步骤 3：创建新项目

1. 登录后，你会看到Railway的控制台
2. 点击 **"New Project"** 按钮（通常在页面中间或右上角）
3. 选择 **"Deploy from GitHub repo"**
4. 如果这是第一次，可能需要授权Railway访问你的GitHub仓库
5. 在仓库列表中找到你的项目（`aitest`），点击它

### 步骤 4：配置项目根目录

1. Railway会自动开始部署，但我们需要先配置
2. 点击项目名称进入项目详情页
3. 找到 **"Settings"** 标签（通常在顶部导航栏）
4. 向下滚动找到 **"Root Directory"** 选项
5. 点击编辑，输入：**`backend`**
6. 点击保存

### 步骤 5：添加环境变量

1. 在项目页面，点击 **"Variables"** 标签（在Settings旁边）
2. 你会看到一个表格，可以添加环境变量
3. 点击 **"New Variable"** 或 **"+"** 按钮
4. 逐个添加以下环境变量：

   **第一个变量：**
   - Name: `PORT`
   - Value: `5001`
   - 点击 "Add"

   **第二个变量：**
   - Name: `NODE_ENV`
   - Value: `production`
   - 点击 "Add"

   **第三个变量：**
   - Name: `DEEPSEEK_API_KEY`
   - Value: `你的DeepSeek API密钥`（从 https://platform.deepseek.com 获取）
   - 点击 "Add"

   **第四个变量（先留空，等前端部署完再填）：**
   - Name: `FRONTEND_URL`
   - Value: `暂时留空，写个占位符：https://placeholder.vercel.app`
   - 点击 "Add"

### 步骤 6：等待部署完成

1. Railway会自动开始部署
2. 点击 **"Deployments"** 标签查看部署进度
3. 等待状态变成 **"Active"** 或 **"Success"**（通常需要1-3分钟）
4. 如果看到错误，查看日志（点击部署记录可以查看日志）

### 步骤 7：获取后端URL

1. 部署完成后，在项目页面找到 **"Settings"** 标签
2. 向下滚动找到 **"Domains"** 部分
3. 你会看到一个URL，格式类似：`https://your-project-name.up.railway.app`
4. **复制这个URL**，保存到记事本，稍后需要用到
5. 或者点击 **"Generate Domain"** 生成一个自定义域名

### 步骤 8：测试后端

1. 打开新标签页
2. 访问：`你的后端URL/health`
   - 例如：`https://your-project-name.up.railway.app/health`
3. 应该看到：`{"status":"healthy"}`
4. 如果看到这个，说明后端部署成功！✅

**🎉 恭喜！后端部署完成！**

---

## 第二部分：部署前端到 Vercel

### 步骤 9：打开Vercel网站

1. 打开新标签页（或新窗口）
2. 访问：**https://vercel.com**
3. 你会看到Vercel的首页

### 步骤 10：注册Vercel账号

1. 点击右上角的 **"Sign Up"** 或 **"Login"** 按钮
2. 选择 **"Continue with GitHub"**（推荐）
3. 授权Vercel访问你的GitHub账号
4. 完成注册

### 步骤 11：创建新项目

1. 登录后，你会看到Vercel的控制台
2. 点击 **"Add New..."** 按钮（通常在右上角）
3. 选择 **"Project"**
4. 在仓库列表中找到你的项目（`aitest`），点击 **"Import"**

### 步骤 12：配置项目设置

Vercel会显示项目配置页面，按以下设置：

1. **Framework Preset**：
   - 选择 **"Vite"**（Vercel通常会自动检测到）

2. **Root Directory**：
   - 点击 **"Edit"** 按钮
   - 输入：**`frontend`**
   - 点击 **"Continue"**

3. **Build and Output Settings**（通常会自动填充，检查一下）：
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

### 步骤 13：添加环境变量

1. 在配置页面，找到 **"Environment Variables"** 部分
2. 点击展开
3. 添加第一个变量：
   - Key: `VITE_API_BASE_URL`
   - Value: `你刚才复制的后端URL`（例如：`https://your-project-name.up.railway.app`）
   - 点击 **"Add"**

4. 添加第二个变量：
   - Key: `VITE_SOCKET_URL`
   - Value: `和上面一样的后端URL`（例如：`https://your-project-name.up.railway.app`）
   - 点击 **"Add"**

### 步骤 14：开始部署

1. 检查所有设置是否正确
2. 点击页面底部的 **"Deploy"** 按钮
3. Vercel会开始构建和部署（通常需要2-5分钟）

### 步骤 15：等待部署完成

1. 你会看到一个部署进度页面
2. 等待状态变成 **"Ready"** 或看到绿色的成功提示
3. 如果构建失败，点击查看日志，检查错误信息

### 步骤 16：获取前端URL

1. 部署完成后，你会看到一个成功页面
2. 页面上会显示你的应用URL，格式：`https://your-project-name.vercel.app`
3. **复制这个URL**，保存到记事本

**🎉 恭喜！前端部署完成！**

---

## 第三部分：连接前后端

### 步骤 17：更新后端CORS配置

1. 回到Railway网站（之前部署后端的那个标签页）
2. 进入你的项目
3. 点击 **"Variables"** 标签
4. 找到 `FRONTEND_URL` 这个环境变量
5. 点击编辑（通常是铅笔图标）
6. 将Value改为：`你刚才复制的前端URL`（例如：`https://your-project-name.vercel.app`）
7. 保存

### 步骤 18：等待Railway重新部署

1. Railway检测到环境变量变化后会自动重新部署
2. 等待1-2分钟，部署完成后状态会变成 "Active"

---

## 第四部分：测试部署

### 步骤 19：访问前端

1. 打开浏览器新标签页
2. 访问你刚才复制的前端URL
3. 页面应该正常加载，显示你的应用界面

### 步骤 20：测试基本功能

1. **测试用户切换**：
   - 点击右上角的用户切换器
   - 选择一个用户
   - 应该能正常切换

2. **测试API连接**：
   - 按 `F12` 打开开发者工具
   - 点击 **"Network"** 标签
   - 在应用中执行一些操作（如搜索用户）
   - 检查是否有红色的错误请求
   - 如果都是绿色的200状态，说明API连接正常 ✅

3. **测试实时聊天**：
   - 添加一个好友
   - 点击"实时聊天"
   - 如果消息能正常发送和接收，说明WebSocket连接正常 ✅

### 步骤 21：检查错误

1. 在浏览器开发者工具中，点击 **"Console"** 标签
2. 查看是否有红色错误信息
3. 如果有错误，记录错误信息，可能需要调整配置

---

## 🎊 完成！

如果所有测试都通过，恭喜你！部署成功了！

---

## ❓ 遇到问题？

### 问题1：后端部署失败

**可能原因**：
- 环境变量配置错误
- 代码有错误

**解决方法**：
1. 在Railway项目页面，点击 **"View Logs"**
2. 查看错误信息
3. 检查环境变量是否正确
4. 检查代码是否有语法错误

### 问题2：前端构建失败

**可能原因**：
- 环境变量格式错误
- 依赖安装失败

**解决方法**：
1. 在Vercel项目页面，点击部署记录
2. 查看构建日志
3. 检查环境变量URL是否正确（确保包含 `https://`）
4. 确保 `Root Directory` 设置为 `frontend`

### 问题3：API请求失败（CORS错误）

**错误信息**：`Access to fetch at '...' from origin '...' has been blocked by CORS policy`

**解决方法**：
1. 回到Railway
2. 检查 `FRONTEND_URL` 环境变量
3. 确保URL完全正确，包括 `https://`
4. 确保是前端URL，不是后端URL
5. 重新部署后端

### 问题4：WebSocket连接失败

**错误信息**：`WebSocket connection failed`

**解决方法**：
1. 检查 `VITE_SOCKET_URL` 环境变量是否正确
2. 确保使用HTTPS（`wss://`），不是HTTP（`ws://`）
3. Railway支持WebSocket，无需额外配置

### 问题5：页面空白

**可能原因**：
- 构建失败
- 路由配置问题

**解决方法**：
1. 检查Vercel构建日志
2. 确保 `vercel.json` 配置正确（我们已经创建了）
3. 尝试清除浏览器缓存

---

## 📝 重要信息记录

请记录以下信息，方便以后维护：

**后端信息：**
- Railway项目URL: ________________
- 后端服务URL: ________________
- Railway账号邮箱: ________________

**前端信息：**
- Vercel项目URL: ________________
- 前端应用URL: ________________
- Vercel账号邮箱: ________________

**环境变量：**
- DeepSeek API Key: ________________（保存在安全的地方）

---

## 🔄 更新代码

以后如果要更新代码：

1. **本地修改代码**
2. **推送到GitHub**：
   ```bash
   git add .
   git commit -m "更新说明"
   git push
   ```
3. **自动部署**：
   - Railway和Vercel会自动检测到代码更新
   - 自动重新部署（通常需要2-5分钟）
   - 无需手动操作！

---

## 💡 小提示

1. **保存好URL**：把前后端的URL保存到书签，方便访问
2. **监控使用量**：Railway有免费额度，小范围使用通常不会超出
3. **定期检查**：偶尔登录平台看看服务是否正常运行
4. **备份数据**：虽然数据在Railway上，但建议定期备份 `data.json`

---

## ✅ 完成检查清单

部署完成后，确认以下项目：

- [ ] 后端健康检查通过（访问 `/health`）
- [ ] 前端页面正常加载
- [ ] 可以切换用户
- [ ] API请求正常（无CORS错误）
- [ ] 实时聊天功能正常
- [ ] 浏览器控制台无错误

**如果以上都打勾，说明部署完全成功！🎉**

---

**需要帮助？** 查看详细错误信息，或检查 `DEPLOY_SEPARATE_GUIDE.md` 获取更多信息。

