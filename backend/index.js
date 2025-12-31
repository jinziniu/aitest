import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import {
  searchUsers,
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getFriendships,
  createFriendRequest,
  acceptFriendRequest,
  saveMessage,
  getChatMessages,
  savePrivateMessage,
  getPrivateMessages,
  generateRoomId
} from './db.js';
import {
  generateSystemAIResponse,
  generateFriendAIResponse
} from './ai.js';
import {
  getRecommendations,
  handleRecommendationEvent
} from './recommendations.js';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true
  }
});

const PORT = process.env.PORT || 5001;

// 启用 CORS
app.use(cors());

// 解析 JSON 请求体
app.use(express.json());

// 基础路由
app.get('/', (req, res) => {
  res.json({ message: 'OK', status: 'success' });
});

// 健康检查路由
app.get('/health', (req, res) => {
  res.json({ status: 'healthy' });
});

// 获取所有用户或搜索用户
app.get('/users', (req, res) => {
  try {
    const search = req.query.search || '';
    if (search) {
      // 搜索用户
      const users = searchUsers(search);
      res.json({ users });
    } else {
      // 获取所有用户
      const users = getAllUsers();
      res.json({ users });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 获取单个用户
app.get('/users/:id', (req, res) => {
  try {
    const user = getUserById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 创建用户
app.post('/users', (req, res) => {
  try {
    const { username, email, persona_seed, bio } = req.body;
    
    if (!username || !email) {
      return res.status(400).json({ error: 'Username and email are required' });
    }
    
    const user = createUser({ username, email, gender, birth_year, tags, persona_seed, bio });
    res.status(201).json({ user, message: 'User created successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 更新用户
app.put('/users/:id', (req, res) => {
  try {
    const { username, email, gender, birth_year, tags, persona_seed, bio } = req.body;
    const user = updateUser(req.params.id, { username, email, gender, birth_year, tags, persona_seed, bio });
    res.json({ user, message: 'User updated successfully' });
  } catch (error) {
    if (error.message === 'User not found') {
      return res.status(404).json({ error: error.message });
    }
    res.status(400).json({ error: error.message });
  }
});

// 删除用户
app.delete('/users/:id', (req, res) => {
  try {
    const result = deleteUser(req.params.id);
    res.json(result);
  } catch (error) {
    if (error.message === 'User not found') {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
});

// 发送好友请求
app.post('/friends/request', (req, res) => {
  try {
    const { fromUserId, toUserId } = req.body;
    
    if (!fromUserId || !toUserId) {
      return res.status(400).json({ error: 'fromUserId and toUserId are required' });
    }
    
    const friendship = createFriendRequest(fromUserId, toUserId);
    res.json({ friendship, message: 'Friend request sent' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 接受好友请求
app.post('/friends/accept', (req, res) => {
  try {
    const { friendshipId, userId } = req.body;
    
    if (!friendshipId || !userId) {
      return res.status(400).json({ error: 'friendshipId and userId are required' });
    }
    
    const friendship = acceptFriendRequest(friendshipId, userId);
    res.json({ friendship, message: 'Friend request accepted' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 获取好友列表
app.get('/friends', (req, res) => {
  try {
    const userId = req.query.userId;
    
    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }
    
    const friendships = getFriendships(userId);
    
    // 丰富好友信息
    const enrichedFriendships = friendships.map(f => {
      const otherUserId = f.fromUserId === userId ? f.toUserId : f.fromUserId;
      const otherUser = getUserById(otherUserId);
      return {
        ...f,
        otherUser,
        isFromMe: f.fromUserId === userId
      };
    });
    
    res.json({ friendships: enrichedFriendships });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// System AI 聊天
app.post('/chat/system', async (req, res) => {
  try {
    const { userId, message } = req.body;
    
    if (!userId || !message) {
      return res.status(400).json({ error: 'userId and message are required' });
    }
    
    // 获取对话历史
    const history = getChatMessages(userId, 'system');
    
    // 保存用户消息
    const userMsg = saveMessage({
      userId,
      chatType: 'system',
      role: 'user',
      content: message
    });
    
    // 生成AI回复
    const aiResult = await generateSystemAIResponse(message, history);
    
    // 保存AI回复
    const aiMsg = saveMessage({
      userId,
      chatType: 'system',
      role: 'assistant',
      content: aiResult.response,
      metadata: {
        model: aiResult.model,
        prompt: aiResult.prompt
      }
    });
    
    res.json({
      userMessage: userMsg,
      aiMessage: aiMsg
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Friend Proxy AI 聊天
app.post('/chat/friend', async (req, res) => {
  try {
    const { userId, friendId, message } = req.body;
    
    if (!userId || !friendId || !message) {
      return res.status(400).json({ error: 'userId, friendId, and message are required' });
    }
    
    // 验证好友关系
    const friendships = getFriendships(userId);
    const isFriend = friendships.some(f => {
      const otherUserId = f.fromUserId === userId ? f.toUserId : f.fromUserId;
      return otherUserId === friendId && f.status === 'accepted';
    });
    
    if (!isFriend) {
      return res.status(403).json({ error: 'You can only chat with accepted friends' });
    }
    
    // 获取好友信息
    const friend = getUserById(friendId);
    if (!friend) {
      return res.status(404).json({ error: 'Friend not found' });
    }
    
    // 获取对话历史
    const history = getChatMessages(userId, 'friend', friendId);
    
    // 保存用户消息
    const userMsg = saveMessage({
      userId,
      chatType: 'friend',
      friendId,
      role: 'user',
      content: message
    });
    
    // 生成AI回复
    const aiResult = await generateFriendAIResponse(message, friendId, history);
    
    // 保存AI回复
    const aiMsg = saveMessage({
      userId,
      chatType: 'friend',
      friendId,
      role: 'assistant',
      content: aiResult.response,
      metadata: {
        model: aiResult.model,
        prompt: aiResult.prompt,
        friendName: aiResult.friendName
      }
    });
    
    res.json({
      userMessage: userMsg,
      aiMessage: aiMsg,
      friend: {
        id: friend.id,
        username: friend.username,
        bio: friend.bio
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 获取聊天历史
app.get('/chat/messages', (req, res) => {
  try {
    const { userId, chatType, friendId } = req.query;
    
    if (!userId || !chatType) {
      return res.status(400).json({ error: 'userId and chatType are required' });
    }
    
    const messages = getChatMessages(userId, chatType, friendId || null);
    res.json({ messages });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Socket.IO 中间件：鉴权
io.use((socket, next) => {
  // 从 handshake.auth.token 或 query 中获取 token
  const token = socket.handshake.auth?.token || socket.handshake.query?.token;
  
  if (!token) {
    return next(new Error('Authentication error: token required'));
  }
  
  // 简单的token验证：token就是userId（实际应用中应该使用JWT等）
  // 这里为了demo简单，直接使用userId作为token
  const userId = token;
  
  // 验证用户是否存在
  const user = getUserById(userId);
  if (!user) {
    return next(new Error('Authentication error: invalid user'));
  }
  
  // 将userId附加到socket对象
  socket.userId = userId;
  socket.user = user;
  
  next();
});

// Socket.IO 连接处理
io.on('connection', (socket) => {
  console.log(`✅ User ${socket.userId} (${socket.user.username}) connected`);
  
  // 加入用户的个人房间（用于通知等）
  socket.join(`user:${socket.userId}`);
  
  // 加入私聊房间
  socket.on('join_private_chat', async ({ peerUserId }) => {
    try {
      if (!peerUserId) {
        socket.emit('error', { message: 'peerUserId is required' });
        return;
      }
      
      // 验证好友关系
      const friendships = getFriendships(socket.userId);
      const isFriend = friendships.some(f => {
        const otherUserId = f.fromUserId === socket.userId ? f.toUserId : f.fromUserId;
        return otherUserId === peerUserId && f.status === 'accepted';
      });
      
      if (!isFriend) {
        socket.emit('error', { message: 'You can only chat with accepted friends' });
        return;
      }
      
      // 生成房间ID
      const roomId = generateRoomId(socket.userId, peerUserId);
      
      // 加入房间
      socket.join(roomId);
      
      console.log(`✅ User ${socket.userId} joined room ${roomId}`);
      
      socket.emit('joined_room', { roomId, peerUserId });
    } catch (error) {
      console.error('Error in join_private_chat:', error);
      socket.emit('error', { message: error.message });
    }
  });
  
  // 发送私聊消息
  socket.on('send_private_message', async ({ peerUserId, content, clientMsgId }) => {
    try {
      if (!peerUserId || !content) {
        socket.emit('error', { message: 'peerUserId and content are required' });
        return;
      }
      
      // 验证好友关系
      const friendships = getFriendships(socket.userId);
      const isFriend = friendships.some(f => {
        const otherUserId = f.fromUserId === socket.userId ? f.toUserId : f.fromUserId;
        return otherUserId === peerUserId && f.status === 'accepted';
      });
      
      if (!isFriend) {
        socket.emit('error', { message: 'You can only chat with accepted friends' });
        return;
      }
      
      // 生成房间ID
      const roomId = generateRoomId(socket.userId, peerUserId);
      
      // 保存消息到数据库
      const savedMessage = savePrivateMessage({
        senderId: socket.userId,
        receiverId: peerUserId,
        roomId,
        content,
        clientMsgId: clientMsgId || `client-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      });
      
      // 发送消息到房间（包括发送者）
      io.to(roomId).emit('private_message', {
        roomId,
        message: {
          id: savedMessage.id,
          senderId: savedMessage.senderId,
          receiverId: savedMessage.receiverId,
          content: savedMessage.content,
          clientMsgId: savedMessage.clientMsgId,
          createdAt: savedMessage.createdAt
        }
      });
      
      // 发送ack确认
      socket.emit('message_sent', {
        clientMsgId: savedMessage.clientMsgId,
        serverMsgId: savedMessage.id
      });
      
      console.log(`📨 Message sent in room ${roomId} from ${socket.userId} to ${peerUserId}`);
    } catch (error) {
      console.error('Error in send_private_message:', error);
      socket.emit('error', { message: error.message });
    }
  });
  
  // 断开连接
  socket.on('disconnect', () => {
    console.log(`❌ User ${socket.userId} disconnected`);
  });
});

// 获取私聊消息历史（REST API）
app.get('/messages/private', (req, res) => {
  try {
    const { userId, peerUserId } = req.query;
    
    if (!userId || !peerUserId) {
      return res.status(400).json({ error: 'userId and peerUserId are required' });
    }
    
    // 验证好友关系
    const friendships = getFriendships(userId);
    const isFriend = friendships.some(f => {
      const otherUserId = f.fromUserId === userId ? f.toUserId : f.fromUserId;
      return otherUserId === peerUserId && f.status === 'accepted';
    });
    
    if (!isFriend) {
      return res.status(403).json({ error: 'You can only view messages with accepted friends' });
    }
    
    const messages = getPrivateMessages(userId, peerUserId);
    res.json({ messages });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 获取推荐列表
app.get('/recommendations', (req, res) => {
  try {
    const { userId, gender, age_min, age_max, limit, offset } = req.query;
    
    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }
    
    const filters = {
      gender: gender || null,
      age_min: age_min ? parseInt(age_min) : null,
      age_max: age_max ? parseInt(age_max) : null,
      limit: limit ? parseInt(limit) : 20,
      offset: offset ? parseInt(offset) : 0
    };
    
    const result = getRecommendations(userId, filters);
    res.json(result);
  } catch (error) {
    console.error('Error in /recommendations:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// 推荐事件（更新score）
app.post('/recommendations/event', (req, res) => {
  try {
    const { userId, candidateId, eventType } = req.body;
    
    if (!userId || !candidateId || !eventType) {
      return res.status(400).json({ error: 'userId, candidateId, and eventType are required' });
    }
    
    const result = handleRecommendationEvent(userId, candidateId, eventType);
    res.json({ 
      success: true, 
      score: result.score, 
      reasons: result.reasons,
      message: `Score updated to ${result.score}`
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 启动服务器
httpServer.listen(PORT, () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`);
  console.log(`🔌 Socket.IO server ready`);
  console.log(`✅ Server is ready!`);
});

