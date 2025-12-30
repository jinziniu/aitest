# 上传项目到 GitHub 指南

## 步骤 1：在 GitHub 上创建仓库

1. 登录 GitHub (https://github.com)
2. 点击右上角的 "+" 按钮，选择 "New repository"
3. 填写仓库信息：
   - Repository name: `aitest` (或你喜欢的名字)
   - Description: `全栈实时聊天应用 - React + Node.js + Socket.IO`
   - 选择 Public 或 Private
   - **不要**勾选 "Initialize this repository with a README"（因为我们已经有了）
4. 点击 "Create repository"

## 步骤 2：初始化 Git 仓库（如果还没有）

在项目根目录执行：

```bash
# 检查是否已有Git仓库
git status

# 如果没有，初始化Git仓库
git init
```

## 步骤 3：添加所有文件

```bash
# 添加所有文件到暂存区
git add .

# 查看将要提交的文件（确认敏感文件被忽略）
git status
```

**确认以下文件被忽略（不应该出现在git status中）：**
- `backend/data.json`
- `backend/.env`
- `node_modules/` (所有node_modules目录)
- `.cursor/debug.log`

## 步骤 4：创建初始提交

```bash
git commit -m "Initial commit: 全栈实时聊天应用

- 前端: React + Vite + TypeScript
- 后端: Node.js + Express + Socket.IO
- 功能: 用户管理、好友系统、AI聊天、实时私聊"
```

## 步骤 5：连接到 GitHub 仓库

```bash
# 添加远程仓库（将 YOUR_USERNAME 和 REPO_NAME 替换为你的实际值）
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git

# 或者使用SSH（如果你配置了SSH key）
# git remote add origin git@github.com:YOUR_USERNAME/REPO_NAME.git
```

## 步骤 6：推送代码

```bash
# 推送代码到GitHub
git branch -M main
git push -u origin main
```

## 完整命令序列（复制粘贴）

```bash
# 1. 初始化Git（如果还没有）
git init

# 2. 添加所有文件
git add .

# 3. 创建提交
git commit -m "Initial commit: 全栈实时聊天应用"

# 4. 添加远程仓库（替换YOUR_USERNAME和REPO_NAME）
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git

# 5. 推送到GitHub
git branch -M main
git push -u origin main
```

## 后续更新代码

```bash
# 1. 查看更改
git status

# 2. 添加更改
git add .

# 3. 提交更改
git commit -m "描述你的更改"

# 4. 推送到GitHub
git push
```

## 重要提醒

### ✅ 确保以下文件被忽略（不会上传到GitHub）

- `backend/data.json` - 数据库文件（包含用户数据）
- `backend/.env` - 环境变量（包含API密钥）
- `node_modules/` - 依赖包（太大，不需要上传）
- `.cursor/debug.log` - 调试日志

### ✅ 应该上传的文件

- 所有源代码文件（`.js`, `.ts`, `.tsx`, `.json`等）
- 配置文件（`package.json`, `vite.config.ts`等）
- 文档文件（`.md`文件）
- `.gitignore` 文件

## 如果遇到问题

### 问题1：需要输入GitHub用户名和密码

**解决方案：**
- 使用 Personal Access Token 代替密码
- 或者配置SSH key

### 问题2：推送被拒绝

**解决方案：**
```bash
# 如果远程仓库有README等文件，先拉取
git pull origin main --allow-unrelated-histories

# 然后再推送
git push -u origin main
```

### 问题3：文件太大

**解决方案：**
- 确保 `node_modules/` 在 `.gitignore` 中
- 如果已经提交了，使用：
```bash
git rm -r --cached node_modules
git commit -m "Remove node_modules"
```

## 检查清单

上传前确认：
- [ ] `.gitignore` 文件已创建
- [ ] `backend/data.json` 在 `.gitignore` 中
- [ ] `backend/.env` 在 `.gitignore` 中
- [ ] `node_modules/` 在 `.gitignore` 中
- [ ] 所有源代码文件已添加
- [ ] README.md 已更新
- [ ] 没有敏感信息（API密钥、密码等）在代码中

## 创建 .env.example 文件（推荐）

为了让其他开发者知道需要哪些环境变量，创建示例文件：

```bash
# backend/.env.example 已存在，确保它被提交
git add backend/.env.example
```

