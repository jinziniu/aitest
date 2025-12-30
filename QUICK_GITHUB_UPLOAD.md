# 快速上传到 GitHub

## 一键命令（复制粘贴执行）

```bash
# 1. 初始化Git（如果还没有）
git init

# 2. 添加所有文件
git add .

# 3. 创建初始提交
git commit -m "Initial commit: 全栈实时聊天应用"

# 4. 添加远程仓库（替换为你的GitHub仓库地址）
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# 5. 推送到GitHub
git branch -M main
git push -u origin main
```

## 在GitHub上创建仓库

1. 访问 https://github.com/new
2. 填写仓库名称（如：`aitest`）
3. 选择 Public 或 Private
4. **不要**勾选 "Initialize with README"
5. 点击 "Create repository"
6. 复制仓库地址（如：`https://github.com/YOUR_USERNAME/aitest.git`）
7. 将第4步中的地址替换为你的仓库地址

## 重要：上传前检查

运行以下命令检查哪些文件会被上传：

```bash
git status
```

**确保以下文件不在列表中（应该被忽略）：**
- `backend/data.json`
- `backend/.env`
- `node_modules/`（所有目录）

**应该包含的文件：**
- 所有 `.js`, `.ts`, `.tsx` 源代码文件
- `package.json` 文件
- `.md` 文档文件
- `.gitignore` 文件

## 如果遇到错误

### 错误：remote origin already exists
```bash
git remote remove origin
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
```

### 错误：需要认证
使用 Personal Access Token 代替密码，或配置SSH key

### 错误：文件太大
确保 `node_modules/` 在 `.gitignore` 中

