import { io, Socket } from 'socket.io-client';
import { SOCKET_URL } from '../config/api';

let socket: Socket | null = null;

export function getSocket(userId: string): Socket {
  if (socket && socket.connected) {
    return socket;
  }
  
  // 断开旧连接
  if (socket) {
    socket.disconnect();
  }
  
  // 创建新连接，携带token（userId）进行鉴权
  socket = io(SOCKET_URL, {
    auth: {
      token: userId
    },
    transports: ['websocket', 'polling']
  });
  
  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}

export function getSocketInstance(): Socket | null {
  return socket;
}

