import { getUserById } from './db.js';

// DeepSeek API 配置
const DEEPSEEK_API_BASE = process.env.DEEPSEEK_API_BASE || 'https://api.deepseek.com/v1';
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY || '';
const DEEPSEEK_MODEL = process.env.DEEPSEEK_MODEL || 'deepseek-chat';

// System AI Prompt 模板
const SYSTEM_AI_PROMPT_TEMPLATE = `You are a helpful AI assistant. You provide friendly, accurate, and helpful responses to user questions.

User message: {userMessage}

Previous conversation context:
{conversationHistory}

Please respond naturally and helpfully.`;

// Friend Proxy AI Prompt 模板
const FRIEND_AI_PROMPT_TEMPLATE = `You are an AI proxy representing {friendName}. You can ONLY respond based on the following information about {friendName}:

Persona: {personaSeed}
Bio: {friendBio}

IMPORTANT RULES:
1. You can ONLY use information from the persona_seed and bio provided above
2. You MUST NOT make up or invent any personal information, details, or facts about {friendName}
3. You MUST NOT reveal any private information that is not explicitly stated in the persona_seed or bio
4. If asked about something not in the provided information, politely say you don't have that information
5. Respond in a way that matches the personality described in the persona_seed

User message: {userMessage}

Previous conversation context:
{conversationHistory}

Please respond as {friendName}'s AI proxy, using ONLY the information provided above.`;

// 构建对话历史（用于DeepSeek API的消息格式）
function buildMessageHistory(messages, limit = 20) {
  const recentMessages = messages.slice(-limit);
  return recentMessages.map(msg => ({
    role: msg.role === 'user' ? 'user' : 'assistant',
    content: msg.content
  }));
}

// 调用DeepSeek API
async function callDeepSeekAPI(messages, systemPrompt = null) {
  if (!DEEPSEEK_API_KEY) {
    throw new Error('DeepSeek API key is not configured. Please set DEEPSEEK_API_KEY environment variable.');
  }

  const requestBody = {
    model: DEEPSEEK_MODEL,
    messages: []
  };

  // 如果有system prompt，添加到消息列表开头
  if (systemPrompt) {
    requestBody.messages.push({
      role: 'system',
      content: systemPrompt
    });
  }

  // 添加对话历史
  requestBody.messages.push(...messages);

  try {
    const response = await fetch(`${DEEPSEEK_API_BASE}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`DeepSeek API error: ${response.status} ${response.statusText}. ${errorData.error?.message || ''}`);
    }

    const data = await response.json();
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error('Invalid response from DeepSeek API');
    }

    return data.choices[0].message.content;
  } catch (error) {
    console.error('DeepSeek API call failed:', error);
    throw error;
  }
}

// 生成 System AI 回复
export async function generateSystemAIResponse(userMessage, conversationHistory = []) {
  const systemPrompt = `You are a helpful AI assistant. You provide friendly, accurate, and helpful responses to user questions.`;
  
  // 构建消息历史
  const messageHistory = buildMessageHistory(conversationHistory);
  
  // 添加当前用户消息
  messageHistory.push({
    role: 'user',
    content: userMessage
  });

  try {
    // 调用DeepSeek API
    const response = await callDeepSeekAPI(messageHistory, systemPrompt);
    
    return {
      response,
      prompt: systemPrompt,
      model: DEEPSEEK_MODEL
    };
  } catch (error) {
    // 如果API调用失败，返回错误信息
    console.error('Failed to generate System AI response:', error);
    throw new Error(`Failed to generate AI response: ${error.message}`);
  }
}

// 生成 Friend Proxy AI 回复
export async function generateFriendAIResponse(userMessage, friendId, conversationHistory = []) {
  const friend = getUserById(friendId);
  
  if (!friend) {
    throw new Error('Friend not found');
  }
  
  if (!friend.persona_seed || !friend.bio) {
    throw new Error('Friend persona information not available');
  }
  
  // 构建System Prompt
  const systemPrompt = FRIEND_AI_PROMPT_TEMPLATE
    .replace(/{friendName}/g, friend.username)
    .replace('{personaSeed}', friend.persona_seed)
    .replace('{friendBio}', friend.bio)
    .replace('{userMessage}', '')  // 用户消息会在消息历史中添加
    .replace('{conversationHistory}', '');  // 对话历史会在消息历史中构建
  
  // 构建消息历史
  const messageHistory = buildMessageHistory(conversationHistory);
  
  // 添加当前用户消息
  messageHistory.push({
    role: 'user',
    content: userMessage
  });

  try {
    // 调用DeepSeek API
    const response = await callDeepSeekAPI(messageHistory, systemPrompt);
    
    return {
      response,
      prompt: systemPrompt,
      model: DEEPSEEK_MODEL,
      friendName: friend.username
    };
  } catch (error) {
    // 如果API调用失败，返回错误信息
    console.error('Failed to generate Friend AI response:', error);
    throw new Error(`Failed to generate AI response: ${error.message}`);
  }
}

