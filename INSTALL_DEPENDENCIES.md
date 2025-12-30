# 安装依赖说明

## 问题
如果遇到 `Failed to resolve import "react-router-dom"` 错误，说明依赖还没有安装。

## 解决方案

### 1. 安装前端依赖

在项目根目录下运行：

```bash
cd frontend
npm install
```

或者使用 PowerShell（Windows）：

```powershell
cd frontend
npm install
```

### 2. 安装后端依赖

```bash
cd backend
npm install
```

## 完整安装步骤

1. **确保已安装 Node.js**
   - 检查：`node --version`（应该显示 v18+）
   - 检查：`npm --version`（应该显示 v9+）
   - 如果未安装，请访问 https://nodejs.org/ 下载安装

2. **安装前端依赖**
   ```bash
   cd frontend
   npm install
   ```

3. **安装后端依赖**
   ```bash
   cd backend
   npm install
   ```

4. **启动服务**
   - 终端1（后端）：`cd backend && npm run dev`
   - 终端2（前端）：`cd frontend && npm run dev`

## 如果 npm 命令找不到

- 确保 Node.js 已正确安装
- 重启终端/IDE
- 检查环境变量 PATH 是否包含 Node.js 的路径
- Windows 用户可能需要重启系统

