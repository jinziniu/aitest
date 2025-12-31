import { 
  getAllUsers, 
  getUserById, 
  getFriendships,
  getOrCreateRelevanceScore,
  updateRelevanceScore,
  getRelevanceScore
} from './db.js';

// 计算年龄
function calculateAge(birthYear) {
  if (!birthYear) return null;
  return new Date().getFullYear() - birthYear;
}

// 推荐评分规则 - 增强差异化
export function calculateRelevanceScore(viewer, candidate, existingScore = null) {
  try {
    let score = 0; // 从0分开始，更极端
    const reasons = [];
    
    // 规则1：标签匹配（最重要，每个匹配标签 +20分，极端权重）
    if (viewer.tags && candidate.tags && Array.isArray(viewer.tags) && Array.isArray(candidate.tags)) {
      const commonTags = viewer.tags.filter(tag => candidate.tags.includes(tag));
      if (commonTags.length > 0) {
        // 极端权重：每个共同标签 +20分
        score += commonTags.length * 20;
        reasons.push(`共同兴趣：${commonTags.join(', ')}（+${commonTags.length * 20}分）`);
      } else {
        // 没有共同标签：大幅扣分
        score -= 30;
        reasons.push('兴趣不匹配（-30分）');
      }
    }
    
    // 规则2：年龄匹配（±3岁内 +25分，±5岁内 +15分，其他扣分）
    if (viewer.birth_year && candidate.birth_year) {
      const ageDiff = Math.abs(viewer.birth_year - candidate.birth_year);
      if (ageDiff <= 3) {
        score += 25;
        reasons.push(`年龄非常相近（相差${ageDiff}岁，+25分）`);
      } else if (ageDiff <= 5) {
        score += 15;
        reasons.push(`年龄相近（相差${ageDiff}岁，+15分）`);
      } else if (ageDiff <= 8) {
        score += 5;
        reasons.push(`年龄差距适中（相差${ageDiff}岁，+5分）`);
      } else {
        score -= 10;
        reasons.push(`年龄差距较大（相差${ageDiff}岁，-10分）`);
      }
    }
    
    // 规则3：性别偏好（极端化：异性 +30分，同性 -10分）
    if (viewer.gender && candidate.gender) {
      if (viewer.gender !== candidate.gender) {
        score += 30;
        reasons.push('性别互补（+30分）');
      } else {
        score -= 10;
        reasons.push('相同性别（-10分）');
      }
    }
    
    // 规则4：Bio关键词匹配（+8分每个匹配词）
    if (viewer.bio && candidate.bio) {
      const viewerKeywords = viewer.bio.toLowerCase().split(/[|\s,]+/);
      const candidateKeywords = candidate.bio.toLowerCase().split(/[|\s,]+/);
      const commonKeywords = viewerKeywords.filter(k => 
        k.length > 2 && candidateKeywords.includes(k)
      );
      if (commonKeywords.length > 0) {
        score += commonKeywords.length * 8;
        reasons.push(`简介相似：${commonKeywords.slice(0, 2).join(', ')}（+${commonKeywords.length * 8}分）`);
      }
    }
    
    // 规则5：基于用户ID的个性化因子（让不同用户有不同偏好）
    // 使用viewer和candidate的ID组合生成一个伪随机因子
    const viewerIdNum = parseInt(viewer.id) || 0;
    const candidateIdNum = parseInt(candidate.id) || 0;
    const personalFactor = ((viewerIdNum * 7 + candidateIdNum * 13) % 20) - 10; // -10到+10
    score += personalFactor;
    if (personalFactor > 5) {
      reasons.push('个性化匹配（+' + personalFactor + '分）');
    } else if (personalFactor < -5) {
      reasons.push('个性化不匹配（' + personalFactor + '分）');
    }
    
    // 确保至少有2条reasons
    if (reasons.length < 2) {
      if (reasons.length === 0) {
        reasons.push('系统推荐');
      }
      if (reasons.length === 1) {
        reasons.push('可能感兴趣');
      }
    }
    
    // 限制分数范围 0-100
    score = Math.max(0, Math.min(100, score));
    
    return { score, reasons: reasons.slice(0, 5) }; // 最多5条reasons
  } catch (error) {
    console.error('Error in calculateRelevanceScore:', error.message);
    // 返回默认分数
    return { score: 50, reasons: ['系统推荐', '可能感兴趣'] };
  }
}

// 获取推荐列表
export function getRecommendations(viewerId, filters = {}) {
  const {
    gender = null,
    age_min = null,
    age_max = null,
    limit = 20,
    offset = 0
  } = filters;
  
  const viewer = getUserById(viewerId);
  if (!viewer) {
    throw new Error(`Viewer not found: ${viewerId}`);
  }
  
  // 获取所有用户
  let candidates = getAllUsers();
  
  // 获取viewer的好友关系（只排除已接受的好友）
  const friendships = getFriendships(viewerId);
  const friendIds = new Set();
  if (friendships && Array.isArray(friendships)) {
    friendships.forEach(f => {
      // 只排除已接受的好友
      if (f.status === 'accepted') {
        const otherId = f.fromUserId === viewerId ? f.toUserId : f.fromUserId;
        friendIds.add(otherId);
      }
    });
  }
  
  // 过滤：排除自己、排除已接受的好友、排除已拉黑（如果有拉黑功能）
  candidates = candidates.filter(candidate => {
    if (!candidate || !candidate.id) return false;
    if (candidate.id === viewerId) return false;
    if (friendIds.has(candidate.id)) return false;
    return true;
  });
  
  // 应用筛选条件
  if (gender) {
    candidates = candidates.filter(c => c && c.gender === gender);
  }
  
  if (age_min !== null || age_max !== null) {
    candidates = candidates.filter(c => {
      if (!c || !c.birth_year) return false;
      const age = calculateAge(c.birth_year);
      if (age === null) return false;
      if (age_min !== null && age < age_min) return false;
      if (age_max !== null && age > age_max) return false;
      return true;
    });
  }
  
  // 计算每个候选人的relevance score
  const candidatesWithScore = candidates.map(candidate => {
    try {
      const existingScore = getRelevanceScore(viewerId, candidate.id);
      const { score, reasons } = calculateRelevanceScore(viewer, candidate, existingScore);
      
      // 更新或创建score记录
      updateRelevanceScore(viewerId, candidate.id, score, reasons);
      
      return {
        ...candidate,
        relevanceScore: score,
        reasons: reasons
      };
    } catch (error) {
      console.error('Error processing candidate:', candidate?.id, error.message);
      // 返回一个默认值，而不是抛出错误
      return {
        ...candidate,
        relevanceScore: 50,
        reasons: ['系统推荐', '可能感兴趣']
      };
    }
  });
  
  // 按score降序排序
  candidatesWithScore.sort((a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0));
  
  // 分页
  const total = candidatesWithScore.length;
  const paginated = candidatesWithScore.slice(offset, offset + limit);
  
  return {
    candidates: paginated,
    total,
    limit,
    offset
  };
}

// 处理推荐事件（更新score）
export function handleRecommendationEvent(viewerId, candidateId, eventType) {
  const viewer = getUserById(viewerId);
  const candidate = getUserById(candidateId);
  
  if (!viewer || !candidate) {
    throw new Error('User not found');
  }
  
  const existingScore = getRelevanceScore(viewerId, candidateId);
  let newScore = existingScore?.score || 50;
  const reasons = existingScore?.reasons || [];
  
  // 根据事件类型调整分数
  switch (eventType) {
    case 'SKIP':
      // 跳过：降低分数 -5
      newScore = Math.max(0, newScore - 5);
      if (!reasons.some(r => r.includes('被跳过'))) {
        reasons.push('曾被跳过');
      }
      break;
    case 'VIEW':
      // 查看：+2分
      newScore = Math.min(100, newScore + 2);
      break;
    case 'LIKE':
      // 点赞：+10分
      newScore = Math.min(100, newScore + 10);
      if (!reasons.some(r => r.includes('被点赞'))) {
        reasons.push('曾被点赞');
      }
      break;
    case 'CHAT':
      // 聊天：+15分
      newScore = Math.min(100, newScore + 15);
      if (!reasons.some(r => r.includes('有聊天'))) {
        reasons.push('有聊天记录');
      }
      break;
    default:
      // 未知事件类型，不改变分数
      break;
  }
  
  // 重新计算基础分数（基于用户属性）
  const { score: baseScore, reasons: baseReasons } = calculateRelevanceScore(viewer, candidate, null);
  
  // 合并基础分数和事件调整
  const finalScore = Math.max(0, Math.min(100, baseScore + (newScore - (existingScore?.score || 50))));
  const finalReasons = [...new Set([...baseReasons, ...reasons])].slice(0, 5);
  
  // 更新score
  updateRelevanceScore(viewerId, candidateId, finalScore, finalReasons);
  
  return {
    score: finalScore,
    reasons: finalReasons
  };
}

