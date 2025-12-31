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
  // 如果已经初始化过，直接返回
  if (isInitialized) {
    return;
  }
  
  if (!fs.existsSync(DB_PATH)) {
    const initialData = {
      users: [
        { 
          id: '1', 
          username: 'alice', 
          email: 'alice@example.com',
          gender: 'female',
          birth_year: 1995,
          tags: ['tech', 'coding', 'open-source'],
          persona_seed: 'Alice is a friendly software engineer who loves coding and helping others. She enjoys discussing technology, sharing knowledge, and is always curious about new programming languages.',
          bio: 'Tech enthusiast | Full-stack developer | Open source contributor'
        },
        { 
          id: '2', 
          username: 'bob', 
          email: 'bob@example.com',
          gender: 'male',
          birth_year: 1992,
          tags: ['design', 'art', 'music'],
          persona_seed: 'Bob is a creative designer with a passion for art and music. He likes to talk about design trends, creative projects, and enjoys sharing his artistic perspective.',
          bio: 'UI/UX Designer | Artist | Music lover'
        },
        { 
          id: '3', 
          username: 'charlie', 
          email: 'charlie@example.com',
          gender: 'male',
          birth_year: 1990,
          tags: ['travel', 'photography', 'adventure'],
          persona_seed: 'Charlie is an adventurous traveler and photographer. He loves sharing travel stories, photography tips, and discussing different cultures and places around the world.',
          bio: 'Travel blogger | Photographer | Adventure seeker'
        },
        { 
          id: '4', 
          username: 'david', 
          email: 'david@example.com',
          gender: 'male',
          birth_year: 1988,
          tags: ['fitness', 'health', 'nutrition'],
          persona_seed: 'David is a fitness enthusiast and nutrition expert. He enjoys talking about health, fitness routines, healthy eating, and motivating others to live a healthy lifestyle.',
          bio: 'Fitness coach | Nutritionist | Health advocate'
        },
        { 
          id: '5', 
          username: 'emma', 
          email: 'emma@example.com',
          gender: 'female',
          birth_year: 1996,
          tags: ['reading', 'writing', 'literature'],
          persona_seed: 'Emma is a passionate writer and book lover. She enjoys discussing literature, sharing writing tips, and exploring different genres and authors.',
          bio: 'Writer | Book reviewer | Literature enthusiast'
        },
        { 
          id: '6', 
          username: 'frank', 
          email: 'frank@example.com',
          gender: 'male',
          birth_year: 1993,
          tags: ['gaming', 'esports', 'streaming'],
          persona_seed: 'Frank is a gaming enthusiast and streamer. He loves playing video games, discussing game strategies, and sharing his gaming experiences with others.',
          bio: 'Gamer | Streamer | Esports fan'
        },
        { 
          id: '7', 
          username: 'grace', 
          email: 'grace@example.com',
          gender: 'female',
          birth_year: 1994,
          tags: ['yoga', 'meditation', 'wellness'],
          persona_seed: 'Grace is a yoga instructor and wellness advocate. She enjoys teaching yoga, sharing meditation techniques, and promoting a balanced lifestyle.',
          bio: 'Yoga instructor | Wellness coach | Meditation teacher'
        },
        { 
          id: '8', 
          username: 'henry', 
          email: 'henry@example.com',
          gender: 'male',
          birth_year: 1991,
          tags: ['cooking', 'food', 'restaurant'],
          persona_seed: 'Henry is a chef and food enthusiast. He loves cooking, trying new recipes, and sharing culinary experiences and restaurant recommendations.',
          bio: 'Chef | Food blogger | Restaurant critic'
        },
        { 
          id: '9', 
          username: 'ivy', 
          email: 'ivy@example.com',
          gender: 'female',
          birth_year: 1997,
          tags: ['fashion', 'beauty', 'lifestyle'],
          persona_seed: 'Ivy is a fashion designer and beauty influencer. She enjoys discussing fashion trends, sharing beauty tips, and creating stylish content.',
          bio: 'Fashion designer | Beauty influencer | Lifestyle blogger'
        },
        { 
          id: '10', 
          username: 'jack', 
          email: 'jack@example.com',
          gender: 'male',
          birth_year: 1989,
          tags: ['sports', 'football', 'fitness'],
          persona_seed: 'Jack is a sports enthusiast and football player. He loves playing and watching sports, discussing game strategies, and staying active.',
          bio: 'Football player | Sports analyst | Fitness trainer'
        },
        { 
          id: '11', 
          username: 'kate', 
          email: 'kate@example.com',
          gender: 'female',
          birth_year: 1998,
          tags: ['music', 'singing', 'piano'],
          persona_seed: 'Kate is a musician and singer. She enjoys playing piano, singing, and sharing her musical journey and performances with others.',
          bio: 'Musician | Singer | Piano teacher'
        },
        { 
          id: '12', 
          username: 'leo', 
          email: 'leo@example.com',
          gender: 'male',
          birth_year: 1994,
          tags: ['film', 'cinema', 'directing'],
          persona_seed: 'Leo is a filmmaker and cinema enthusiast. He loves creating films, discussing movie techniques, and exploring different genres of cinema.',
          bio: 'Filmmaker | Director | Cinema critic'
        },
        { 
          id: '13', 
          username: 'mia', 
          email: 'mia@example.com',
          gender: 'female',
          birth_year: 1993,
          tags: ['dance', 'ballet', 'performance'],
          persona_seed: 'Mia is a professional dancer and choreographer. She enjoys performing, teaching dance, and sharing her passion for movement and expression.',
          bio: 'Dancer | Choreographer | Performance artist'
        },
        { 
          id: '14', 
          username: 'noah', 
          email: 'noah@example.com',
          gender: 'male',
          birth_year: 1996,
          tags: ['science', 'research', 'physics'],
          persona_seed: 'Noah is a scientist and researcher. He enjoys discussing scientific discoveries, sharing research findings, and exploring the mysteries of the universe.',
          bio: 'Scientist | Researcher | Physics enthusiast'
        },
        { 
          id: '15', 
          username: 'olivia', 
          email: 'olivia@example.com',
          gender: 'female',
          birth_year: 1995,
          tags: ['gardening', 'plants', 'nature'],
          persona_seed: 'Olivia is a gardener and nature lover. She enjoys growing plants, sharing gardening tips, and connecting with nature.',
          bio: 'Gardener | Plant enthusiast | Nature photographer'
        },
        { 
          id: '16', 
          username: 'peter', 
          email: 'peter@example.com',
          gender: 'male',
          birth_year: 1992,
          tags: ['business', 'entrepreneurship', 'startup'],
          persona_seed: 'Peter is an entrepreneur and business consultant. He enjoys discussing business strategies, sharing startup experiences, and helping others succeed.',
          bio: 'Entrepreneur | Business consultant | Startup advisor'
        },
        { 
          id: '17', 
          username: 'quinn', 
          email: 'quinn@example.com',
          gender: 'female',
          birth_year: 1997,
          tags: ['photography', 'nature', 'wildlife'],
          persona_seed: 'Quinn is a wildlife photographer and nature conservationist. She loves capturing wildlife moments, sharing conservation stories, and raising awareness about nature.',
          bio: 'Wildlife photographer | Conservationist | Nature advocate'
        },
        { 
          id: '18', 
          username: 'ryan', 
          email: 'ryan@example.com',
          gender: 'male',
          birth_year: 1990,
          tags: ['tech', 'ai', 'machine-learning'],
          persona_seed: 'Ryan is an AI researcher and machine learning expert. He enjoys discussing AI developments, sharing ML techniques, and exploring the future of technology.',
          bio: 'AI researcher | ML engineer | Tech innovator'
        },
        { 
          id: '19', 
          username: 'sophia', 
          email: 'sophia@example.com',
          gender: 'female',
          birth_year: 1994,
          tags: ['education', 'teaching', 'learning'],
          persona_seed: 'Sophia is a teacher and education advocate. She enjoys teaching, sharing educational resources, and helping students achieve their goals.',
          bio: 'Teacher | Education consultant | Learning advocate'
        },
        { 
          id: '20', 
          username: 'tom', 
          email: 'tom@example.com',
          gender: 'male',
          birth_year: 1991,
          tags: ['cars', 'automotive', 'racing'],
          persona_seed: 'Tom is a car enthusiast and racing fan. He loves discussing cars, sharing automotive news, and following racing events.',
          bio: 'Car enthusiast | Racing fan | Automotive blogger'
        },
      ],
      friendships: [],
      messages: [],
      relevanceScores: []
    };
    fs.writeFileSync(DB_PATH, JSON.stringify(initialData, null, 2));
  } else {
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
        },
        '5': {
          persona_seed: 'Emma is a passionate writer and book lover. She enjoys discussing literature, sharing writing tips, and exploring different genres and authors.',
          bio: 'Writer | Book reviewer | Literature enthusiast'
        },
        '6': {
          persona_seed: 'Frank is a gaming enthusiast and streamer. He loves playing video games, discussing game strategies, and sharing his gaming experiences with others.',
          bio: 'Gamer | Streamer | Esports fan'
        },
        '7': {
          persona_seed: 'Grace is a yoga instructor and wellness advocate. She enjoys teaching yoga, sharing meditation techniques, and promoting a balanced lifestyle.',
          bio: 'Yoga instructor | Wellness coach | Meditation teacher'
        },
        '8': {
          persona_seed: 'Henry is a chef and food enthusiast. He loves cooking, trying new recipes, and sharing culinary experiences and restaurant recommendations.',
          bio: 'Chef | Food blogger | Restaurant critic'
        },
        '9': {
          persona_seed: 'Ivy is a fashion designer and beauty influencer. She enjoys discussing fashion trends, sharing beauty tips, and creating stylish content.',
          bio: 'Fashion designer | Beauty influencer | Lifestyle blogger'
        },
        '10': {
          persona_seed: 'Jack is a sports enthusiast and football player. He loves playing and watching sports, discussing game strategies, and staying active.',
          bio: 'Football player | Sports analyst | Fitness trainer'
        },
        '11': {
          persona_seed: 'Kate is a musician and singer. She enjoys playing piano, singing, and sharing her musical journey and performances with others.',
          bio: 'Musician | Singer | Piano teacher'
        },
        '12': {
          persona_seed: 'Leo is a filmmaker and cinema enthusiast. He loves creating films, discussing movie techniques, and exploring different genres of cinema.',
          bio: 'Filmmaker | Director | Cinema critic'
        },
        '13': {
          persona_seed: 'Mia is a professional dancer and choreographer. She enjoys performing, teaching dance, and sharing her passion for movement and expression.',
          bio: 'Dancer | Choreographer | Performance artist'
        },
        '14': {
          persona_seed: 'Noah is a scientist and researcher. He enjoys discussing scientific discoveries, sharing research findings, and exploring the mysteries of the universe.',
          bio: 'Scientist | Researcher | Physics enthusiast'
        },
        '15': {
          persona_seed: 'Olivia is a gardener and nature lover. She enjoys growing plants, sharing gardening tips, and connecting with nature.',
          bio: 'Gardener | Plant enthusiast | Nature photographer'
        },
        '16': {
          persona_seed: 'Peter is an entrepreneur and business consultant. He enjoys discussing business strategies, sharing startup experiences, and helping others succeed.',
          bio: 'Entrepreneur | Business consultant | Startup advisor'
        },
        '17': {
          persona_seed: 'Quinn is a wildlife photographer and nature conservationist. She loves capturing wildlife moments, sharing conservation stories, and raising awareness about nature.',
          bio: 'Wildlife photographer | Conservationist | Nature advocate'
        },
        '18': {
          persona_seed: 'Ryan is an AI researcher and machine learning expert. He enjoys discussing AI developments, sharing ML techniques, and exploring the future of technology.',
          bio: 'AI researcher | ML engineer | Tech innovator'
        },
        '19': {
          persona_seed: 'Sophia is a teacher and education advocate. She enjoys teaching, sharing educational resources, and helping students achieve their goals.',
          bio: 'Teacher | Education consultant | Learning advocate'
        },
        '20': {
          persona_seed: 'Tom is a car enthusiast and racing fan. He loves discussing cars, sharing automotive news, and following racing events.',
          bio: 'Car enthusiast | Racing fan | Automotive blogger'
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
    
    // 迁移：为现有用户添加新字段
    if (db.users) {
      const defaultFields = {
        '1': { gender: 'female', birth_year: 1995, tags: ['tech', 'coding', 'open-source'] },
        '2': { gender: 'male', birth_year: 1992, tags: ['design', 'art', 'music'] },
        '3': { gender: 'male', birth_year: 1990, tags: ['travel', 'photography', 'adventure'] },
        '4': { gender: 'male', birth_year: 1988, tags: ['fitness', 'health', 'nutrition'] },
        '5': { gender: 'female', birth_year: 1996, tags: ['reading', 'writing', 'literature'] },
        '6': { gender: 'male', birth_year: 1993, tags: ['gaming', 'esports', 'streaming'] },
        '7': { gender: 'female', birth_year: 1994, tags: ['yoga', 'meditation', 'wellness'] },
        '8': { gender: 'male', birth_year: 1991, tags: ['cooking', 'food', 'restaurant'] },
        '9': { gender: 'female', birth_year: 1997, tags: ['fashion', 'beauty', 'lifestyle'] },
        '10': { gender: 'male', birth_year: 1989, tags: ['sports', 'football', 'fitness'] },
        '11': { gender: 'female', birth_year: 1998, tags: ['music', 'singing', 'piano'] },
        '12': { gender: 'male', birth_year: 1994, tags: ['film', 'cinema', 'directing'] },
        '13': { gender: 'female', birth_year: 1993, tags: ['dance', 'ballet', 'performance'] },
        '14': { gender: 'male', birth_year: 1996, tags: ['science', 'research', 'physics'] },
        '15': { gender: 'female', birth_year: 1995, tags: ['gardening', 'plants', 'nature'] },
        '16': { gender: 'male', birth_year: 1992, tags: ['business', 'entrepreneurship', 'startup'] },
        '17': { gender: 'female', birth_year: 1997, tags: ['photography', 'nature', 'wildlife'] },
        '18': { gender: 'male', birth_year: 1990, tags: ['tech', 'ai', 'machine-learning'] },
        '19': { gender: 'female', birth_year: 1994, tags: ['education', 'teaching', 'learning'] },
        '20': { gender: 'male', birth_year: 1991, tags: ['cars', 'automotive', 'racing'] }
      };
      
      db.users = db.users.map(user => {
        if (!user.gender && defaultFields[user.id]) {
          updated = true;
          return { ...user, ...defaultFields[user.id] };
        }
        return user;
      });
    }
    
    // 初始化 relevanceScores 表
    if (!db.relevanceScores) {
      db.relevanceScores = [];
      updated = true;
    }
    
    if (updated) {
      writeDB(db);
    }
  }
  
  // 标记为已初始化
  isInitialized = true;
}

// 读取数据库
function readDB() {
  initDB(); // 确保数据库已初始化（但不会递归，因为isInitialized标志）
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
    gender: userData.gender || null,
    birth_year: userData.birth_year || null,
    tags: userData.tags || [],
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

// RelevanceScore 相关函数

// 获取或创建 RelevanceScore
export function getOrCreateRelevanceScore(viewerId, candidateId) {
  const db = readDB();
  let score = db.relevanceScores.find(s => 
    s.viewerId === viewerId && s.candidateId === candidateId
  );
  
  if (!score) {
    score = {
      viewerId,
      candidateId,
      score: 50, // 默认分数
      reasons: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    db.relevanceScores.push(score);
    writeDB(db);
  }
  
  return score;
}

// 更新 RelevanceScore
export function updateRelevanceScore(viewerId, candidateId, newScore, reasons) {
  const db = readDB();
  if (!db.relevanceScores) {
    db.relevanceScores = [];
  }
  const scoreIndex = db.relevanceScores.findIndex(s => 
    s.viewerId === viewerId && s.candidateId === candidateId
  );
  
  if (scoreIndex === -1) {
    // 创建新的score记录
    const scoreRecord = {
      viewerId,
      candidateId,
      score: newScore,
      reasons: reasons || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    db.relevanceScores.push(scoreRecord);
    writeDB(db);
    return scoreRecord;
  } else {
    // 更新现有记录
    db.relevanceScores[scoreIndex].score = newScore;
    db.relevanceScores[scoreIndex].reasons = reasons || db.relevanceScores[scoreIndex].reasons;
    db.relevanceScores[scoreIndex].updatedAt = new Date().toISOString();
    writeDB(db);
    return db.relevanceScores[scoreIndex];
  }
}

// 获取 RelevanceScore
export function getRelevanceScore(viewerId, candidateId) {
  const db = readDB();
  if (!db.relevanceScores) {
    db.relevanceScores = [];
    writeDB(db);
  }
  return db.relevanceScores.find(s => 
    s.viewerId === viewerId && s.candidateId === candidateId
  );
}

// 获取所有 RelevanceScores（用于调试）
export function getAllRelevanceScores() {
  const db = readDB();
  return db.relevanceScores;
}

// 初始化数据库
// 初始化数据库
initDB();

