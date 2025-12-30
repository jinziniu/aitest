# Git 错误修复指南

## 问题1：empty ident name

需要配置Git用户信息。

## 问题2：src refspec main does not match any

需要先创建提交，然后才能推送。

## 解决步骤

### 步骤1：配置Git用户信息

```bash
# 设置用户名（替换为你的GitHub用户名）
git config --global user.name "jinziniu"

# 设置邮箱（替换为你的GitHub邮箱）
git config --global user.email "your-email@example.com"
```

### 步骤2：检查Git状态

```bash
git status
```

### 步骤3：添加文件并创建提交

```bash
# 添加所有文件
git add .

# 创建初始提交
git commit -m "Initial commit: 全栈实时聊天应用"
```

### 步骤4：推送到GitHub

```bash
# 推送到main分支
git push -u origin main
```

## 完整命令序列

```bash
# 1. 配置Git用户信息
git config --global user.name "jinziniu"
git config --global user.email "your-email@example.com"

# 2. 添加文件
git add .

# 3. 创建提交
git commit -m "Initial commit: 全栈实时聊天应用"

# 4. 推送到GitHub
git push -u origin main
```

