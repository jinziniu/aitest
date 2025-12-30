import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_PATH = path.join(__dirname, 'data.json');

// 初始化标志，防止重复初始化
let isInitialized = false;

// 初始化数据库
function initDB() {
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/850a54be-0758-45c9-8a9e-ccf167ef259c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'db.js:14',message:'initDB entry',data:{dbPath:DB_PATH,fileExists:fs.existsSync(DB_PATH),isInitialized},timestamp:Date.now(),sessionId:'debug-session',runId:'run2',hypothesisId:'H3'})}).catch(()=>{});
  // #endregion
  
  // 如果已经初始化过，直接返回
  if (isInitialized) {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/850a54be-0758-45c9-8a9e-ccf167ef259c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'db.js:18',message:'initDB already initialized, returning early',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run2',hypothesisId:'H3'})}).catch(()=>{});
    // #endregion
    return;
  }
  
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/850a54be-0758-45c9-8a9e-ccf167ef259c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'db.js:23',message:'initDB starting initialization',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run2',hypothesisId:'H3'})}).catch(()=>{});
  // #endregion
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/850a54be-0758-45c9-8a9e-ccf167ef259c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'db.js:11',message:'initDB entry',data:{dbPath:DB_PATH,fileExists:fs.existsSync(DB_PATH)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'H1'})}).catch(()=>{});
  // #endregion
  if (!fs.existsSync(DB_PATH)) {
    const initialData = {
      users: [
        { 
          id: '1', 
          username: 'alice', 
          email: 'alice@example.com',
          persona_seed: 'Alice is a friendly software engineer who loves coding and helping others. She enjoys discussing technology, sharing knowledge, and is always curious about new programming languages.',
          bio: 'Tech enthusiast | Full-stack developer | Open source contributor'
        },
        { 
          id: '2', 
          username: 'bob', 
          email: 'bob@example.com',
          persona_seed: 'Bob is a creative designer with a passion for art and music. He likes to talk about design trends, creative projects, and enjoys sharing his artistic perspective.',
          bio: 'UI/UX Designer | Artist | Music lover'
        },
        { 
          id: '3', 
          username: 'charlie', 
          email: 'charlie@example.com',
          persona_seed: 'Charlie is an adventurous traveler and photographer. He loves sharing travel stories, photography tips, and discussing different cultures and places around the world.',
          bio: 'Travel blogger | Photographer | Adventure seeker'
        },
        { 
          id: '4', 
          username: 'david', 
          email: 'david@example.com',
          persona_seed: 'David is a fitness enthusiast and nutrition expert. He enjoys talking about health, fitness routines, healthy eating, and motivating others to live a healthy lifestyle.',
          bio: 'Fitness coach | Nutritionist | Health advocate'
        },
      ],
      friendships: [],
      messages: []
    };
    fs.writeFileSync(DB_PATH, JSON.stringify(initialData, null, 2));
  } else {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/850a54be-0758-45c9-8a9e-ccf167ef259c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'db.js:48',message:'initDB else branch - reading file directly',data:{dbPath:DB_PATH},timestamp:Date.now(),sessionId:'debug-session',runId:'post-fix',hypothesisId:'H4'})}).catch(()=>{});
    // #endregion
    // 迁移现有数据：为现有用户添加persona_seed和bio
    // 直接读取文件，避免调用readDB()导致递归
    const data = fs.readFileSync(DB_PATH, 'utf8');
    const db = JSON.parse(data);
    let updated = false;
    
    if (db.users) {
      const defaultPersonas = {
        '1': {
          persona_seed: 'Alice is a friendly software engineer who loves coding and helping others. She enjoys discussing technology, sharing knowledge, and is always curious about new programming languages.',
          bio: 'Tech enthusiast | Full-stack developer | Open source contributor'
        },
        '2': {
          persona_seed: 'Bob is a creative designer with a passion for art and music. He likes to talk about design trends, creative projects, and enjoys sharing his artistic perspective.',
          bio: 'UI/UX Designer | Artist | Music lover'
        },
        '3': {
          persona_seed: 'Charlie is an adventurous traveler and photographer. He loves sharing travel stories, photography tips, and discussing different cultures and places around the world.',
          bio: 'Travel blogger | Photographer | Adventure seeker'
        },
        '4': {
          persona_seed: 'David is a fitness enthusiast and nutrition expert. He enjoys talking about health, fitness routines, healthy eating, and motivating others to live a healthy lifestyle.',
          bio: 'Fitness coach | Nutritionist | Health advocate'
        }
      };
      
      db.users = db.users.map(user => {
        if (!user.persona_seed && defaultPersonas[user.id]) {
          updated = true;
          return { ...user, ...defaultPersonas[user.id] };
        }
        return user;
      });
    }
    
    if (!db.messages) {
      db.messages = [];
      updated = true;
    }
    
    if (updated) {
      writeDB(db);
    }
  }
  
  // 标记为已初始化
  isInitialized = true;
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/850a54be-0758-45c9-8a9e-ccf167ef259c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'db.js:100',message:'initDB completed, marked as initialized',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run2',hypothesisId:'H3'})}).catch(()=>{});
  // #endregion
}

// 读取数据库
function readDB() {
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/850a54be-0758-45c9-8a9e-ccf167ef259c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'db.js:110',message:'readDB entry - calling initDB',data:{dbPath:DB_PATH,isInitialized},timestamp:Date.now(),sessionId:'debug-session',runId:'run2',hypothesisId:'H3'})}).catch(()=>{});
  // #endregion
  initDB(); // 确保数据库已初始化（但不会递归，因为isInitialized标志）
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/850a54be-0758-45c9-8a9e-ccf167ef259c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'db.js:112',message:'readDB after initDB - reading file',data:{dbPath:DB_PATH},timestamp:Date.now(),sessionId:'debug-session',runId:'run2',hypothesisId:'H3'})}).catch(()=>{});
  // #endregion
  const data = fs.readFileSync(DB_PATH, 'utf8');
  return JSON.parse(data);
}

// 写入数据库
function writeDB(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

// 获取所有用户
export function getAllUsers() {
  const db = readDB();
  return db.users;
}

// 搜索用户
export function searchUsers(query) {
  const users = getAllUsers();
  if (!query) return users;
  const lowerQuery = query.toLowerCase();
  return users.filter(user => 
    user.username.toLowerCase().includes(lowerQuery) ||
    user.email.toLowerCase().includes(lowerQuery)
  );
}

// 获取用户
export function getUserById(id) {
  const users = getAllUsers();
  return users.find(u => u.id === id);
}

// 创建用户
export function createUser(userData) {
  const db = readDB();
  
  // 检查用户名和邮箱是否已存在
  const existingUser = db.users.find(u => 
    u.username === userData.username || u.email === userData.email
  );
  
  if (existingUser) {
    throw new Error('Username or email already exists');
  }
  
  const newUser = {
    id: Date.now().toString(),
    username: userData.username,
    email: userData.email,
    persona_seed: userData.persona_seed || '',
    bio: userData.bio || '',
    createdAt: new Date().toISOString()
  };
  
  db.users.push(newUser);
  writeDB(db);
  return newUser;
}

// 更新用户
export function updateUser(id, userData) {
  const db = readDB();
  const userIndex = db.users.findIndex(u => u.id === id);
  
  if (userIndex === -1) {
    throw new Error('User not found');
  }
  
  // 检查用户名和邮箱是否与其他用户冲突
  const existingUser = db.users.find(u => 
    u.id !== id && (u.username === userData.username || u.email === userData.email)
  );
  
  if (existingUser) {
    throw new Error('Username or email already exists');
  }
  
  db.users[userIndex] = {
    ...db.users[userIndex],
    ...userData,
    updatedAt: new Date().toISOString()
  };
  
  writeDB(db);
  return db.users[userIndex];
}

// 删除用户
export function deleteUser(id) {
  const db = readDB();
  const userIndex = db.users.findIndex(u => u.id === id);
  
  if (userIndex === -1) {
    throw new Error('User not found');
  }
  
  // 删除该用户的所有好友关系
  db.friendships = db.friendships.filter(f => 
    f.fromUserId !== id && f.toUserId !== id
  );
  
  // 删除该用户的所有消息
  db.messages = db.messages.filter(m => m.userId !== id);
  
  // 删除用户
  db.users.splice(userIndex, 1);
  writeDB(db);
  
  return { success: true, message: 'User deleted successfully' };
}

// 获取好友关系
export function getFriendships(userId) {
  const db = readDB();
  return db.friendships.filter(f => 
    f.fromUserId === userId || f.toUserId === userId
  );
}

// 创建好友请求
export function createFriendRequest(fromUserId, toUserId) {
  const db = readDB();
  
  // 检查是否已经是好友或已有请求
  const existing = db.friendships.find(f => 
    (f.fromUserId === fromUserId && f.toUserId === toUserId) ||
    (f.fromUserId === toUserId && f.toUserId === fromUserId)
  );
  
  if (existing) {
    throw new Error('Friend request already exists or already friends');
  }
  
  // 检查用户是否存在
  if (!getUserById(fromUserId) || !getUserById(toUserId)) {
    throw new Error('User not found');
  }
  
  const friendship = {
    id: Date.now().toString(),
    fromUserId,
    toUserId,
    status: 'pending',
    createdAt: new Date().toISOString()
  };
  
  db.friendships.push(friendship);
  writeDB(db);
  return friendship;
}

// 接受好友请求
export function acceptFriendRequest(friendshipId, userId) {
  const db = readDB();
  const friendship = db.friendships.find(f => f.id === friendshipId);
  
  if (!friendship) {
    throw new Error('Friend request not found');
  }
  
  if (friendship.toUserId !== userId) {
    throw new Error('Unauthorized');
  }
  
  if (friendship.status !== 'pending') {
    throw new Error('Friend request already processed');
  }
  
  friendship.status = 'accepted';
  friendship.acceptedAt = new Date().toISOString();
  writeDB(db);
  return friendship;
}

// 保存消息
export function saveMessage(message) {
  const db = readDB();
  const newMessage = {
    id: Date.now().toString(),
    ...message,
    createdAt: new Date().toISOString()
  };
  db.messages.push(newMessage);
  writeDB(db);
  return newMessage;
}

// 获取聊天消息
export function getChatMessages(userId, chatType, friendId = null) {
  const db = readDB();
  return db.messages.filter(msg => {
    if (msg.userId !== userId) return false;
    if (msg.chatType !== chatType) return false;
    if (chatType === 'friend' && msg.friendId !== friendId) return false;
    return true;
  }).sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
}

// 保存私聊消息（用户对用户）
export function savePrivateMessage(messageData) {
  const db = readDB();
  const { senderId, receiverId, roomId, content, clientMsgId } = messageData;
  
  const newMessage = {
    id: Date.now().toString() + '-' + Math.random().toString(36).substr(2, 9),
    type: 'private',
    senderId,
    receiverId,
    roomId,
    content,
    clientMsgId,
    createdAt: new Date().toISOString()
  };
  
  db.messages.push(newMessage);
  writeDB(db);
  return newMessage;
}

// 获取私聊消息历史
export function getPrivateMessages(userId, peerUserId) {
  const db = readDB();
  const roomId = generateRoomId(userId, peerUserId);
  
  return db.messages
    .filter(msg => {
      if (msg.type !== 'private') return false;
      if (msg.roomId !== roomId) return false;
      // 用户可以看到自己发送的或接收到的消息
      return msg.senderId === userId || msg.receiverId === userId;
    })
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
}

// 生成房间ID（deterministic）
export function generateRoomId(userId1, userId2) {
  const sorted = [userId1, userId2].sort();
  return sorted.join(':');
}

// 初始化数据库
// #region agent log
fetch('http://127.0.0.1:7242/ingest/850a54be-0758-45c9-8a9e-ccf167ef259c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'db.js:216',message:'Module load - calling initDB',data:{dbPath:DB_PATH},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'H2'})}).catch(()=>{});
// #endregion
initDB();

