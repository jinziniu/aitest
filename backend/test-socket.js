// Socket.IO 测试脚本
// 使用方法: node test-socket.js <userId> <peerUserId>
// 例如: node test-socket.js 1 2
// 注意：需要先安装依赖: npm install socket.io-client

import { io } from 'socket.io-client';

const userId = process.argv[2] || '1';
const peerUserId = process.argv[3] || '2';
const SOCKET_URL = 'http://localhost:5000';

console.log(`🔌 连接Socket.IO服务器: ${SOCKET_URL}`);
console.log(`👤 用户ID: ${userId}`);
console.log(`💬 对聊用户ID: ${peerUserId}`);
console.log('');

const socket = io(SOCKET_URL, {
  auth: {
    token: userId
  },
  transports: ['websocket', 'polling']
});

socket.on('connect', () => {
  console.log('✅ Socket连接成功');
  
  // 加入私聊房间
  console.log(`📥 加入私聊房间 (peerUserId: ${peerUserId})...`);
  socket.emit('join_private_chat', { peerUserId });
});

socket.on('joined_room', ({ roomId }) => {
  console.log(`✅ 已加入房间: ${roomId}`);
  console.log('');
  console.log('💡 可以开始发送消息了！');
  console.log('💡 输入消息并按回车发送，输入 "exit" 退出');
  console.log('');
});

socket.on('private_message', ({ message }) => {
  const isOwn = message.senderId === userId;
  const prefix = isOwn ? '📤 你发送' : '📥 收到';
  console.log(`${prefix}: ${message.content}`);
  console.log(`   时间: ${new Date(message.createdAt).toLocaleString()}`);
  console.log('');
});

socket.on('message_sent', ({ clientMsgId, serverMsgId }) => {
  console.log(`✅ 消息已确认: ${clientMsgId} -> ${serverMsgId}`);
});

socket.on('error', ({ message }) => {
  console.error(`❌ 错误: ${message}`);
});

socket.on('disconnect', () => {
  console.log('❌ Socket断开连接');
});

socket.on('connect_error', (error) => {
  console.error('❌ 连接错误:', error.message);
});

// 从命令行读取输入
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.on('line', (input) => {
  const message = input.trim();
  
  if (message === 'exit') {
    console.log('👋 退出...');
    socket.disconnect();
    rl.close();
    process.exit(0);
  }
  
  if (message) {
    const clientMsgId = `client-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    socket.emit('send_private_message', {
      peerUserId,
      content: message,
      clientMsgId
    });
  }
});

