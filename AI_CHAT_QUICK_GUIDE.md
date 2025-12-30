curl http://localhost:5000/health

## 最小 Prompt 模板

### System AI Prompt
```
You are a helpful AI assistant. You provide friendly, accurate, and helpful responses to user questions.

User message: {userMessage}
Previous conversation context: {conversationHistory}

Please respond naturally and helpfully.
```

### Friend Proxy AI Prompt
```
You are an AI proxy representing {friendName}. You can ONLY respond based on the following information:

Persona: {personaSeed}
Bio: {friendBio}

IMPORTANT RULES:
1. You can ONLY use information from the persona_seed and bio provided above
2. You MUST NOT make up or invent any personal information
3. You MUST NOT reveal any private information not explicitly stated
4. If asked about something not in the provided information, politely say you don't have that information

User message: {userMessage}
Previous conversation context: {conversationHistory}

Please respond as {friendName}'s AI proxy, using ONLY the information provided above.
```

## 如何验证差异

### 前端点击路径

#### 1. 测试 System AI
- **路径**：点击导航栏 "System AI" → 发送消息
- **测试消息**：`"What's your phone number?"`
- **预期**：System AI 可能提供通用回复或说明

#### 2. 测试 Friend Proxy AI
- **路径**：好友列表 → 点击好友的 "开始聊天" → 发送消息
- **测试消息**：`"What's your phone number?"`
- **预期**：Friend Proxy AI 明确拒绝，说明只能使用公开信息

#### 3. 验证个性化差异
- **路径1**：与 Alice（软件工程师）的 Friend Proxy AI 聊天
  - 发送：`"What are you interested in?"`
  - 预期：回复提到技术、编程、开源

- **路径2**：与 Bob（设计师）的 Friend Proxy AI 聊天
  - 发送：`"What are you interested in?"`
  - 预期：回复提到设计、艺术、音乐

- **路径3**：与 David（健身教练）的 Friend Proxy AI 聊天
  - 发送：`"What are you interested in?"`
  - 预期：回复提到健身、健康、营养

### 关键验证点

✅ **页面标注**：
- System AI 页面显示 "System AI" 标签
- Friend Proxy AI 页面显示 "Friend Proxy AI" 标签

✅ **隐私保护**：
- Friend Proxy AI 拒绝回答隐私问题
- Friend Proxy AI 不编造个人信息

✅ **个性化**：
- 不同好友的 Friend Proxy AI 回复内容不同
- 回复严格基于各自的 persona_seed/bio

✅ **消息持久化**：
- 刷新页面后消息历史仍然存在

## 快速测试流程

1. **启动服务**：前端 + 后端
2. **测试 System AI**：导航栏 → "System AI" → 发送 `"Hello"`
3. **添加好友**：搜索用户 → 添加好友 → 接受请求
4. **测试 Friend Proxy AI**：好友列表 → "开始聊天" → 发送 `"What's your phone number?"`
5. **验证差异**：对比两种AI的回复差异

详细说明请查看 [AI_CHAT_TEST.md](./AI_CHAT_TEST.md) 和 [PROMPT_TEMPLATES.md](./PROMPT_TEMPLATES.md)

