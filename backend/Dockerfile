FROM node:18-alpine

WORKDIR /app

# 复制package文件
COPY package*.json ./

# 安装依赖（只安装生产依赖）
RUN npm ci --only=production

# 复制应用代码
COPY . .

# 创建数据目录（如果不存在）
RUN mkdir -p /app/data

# 暴露端口
EXPOSE 5001

# 启动应用
CMD ["node", "index.js"]



