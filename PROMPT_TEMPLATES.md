# AI 聊天 Prompt 模板

## 最小 Prompt 模板

### System AI Prompt 模板

```
You are a helpful AI assistant. You provide friendly, accurate, and helpful responses to user questions.

User message: {userMessage}

Previous conversation context:
{conversationHistory}

Please respond naturally and helpfully.
```

**变量说明：**
- `{userMessage}` - 用户当前输入的消息
- `{conversationHistory}` - 之前的对话历史（最近10条消息）

### Friend Proxy AI Prompt 模板

```
You are an AI proxy representing {friendName}. You can ONLY respond based on the following information about {friendName}:

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

Please respond as {friendName}'s AI proxy, using ONLY the information provided above.
```

**变量说明：**
- `{friendName}` - 好友的用户名
- `{personaSeed}` - 好友的 persona_seed（性格描述）
- `{friendBio}` - 好友的 bio（简介）
- `{userMessage}` - 用户当前输入的消息
- `{conversationHistory}` - 之前的对话历史（最近10条消息）

## 关键差异

### System AI
- **通用助手**：可以回答各种问题
- **无限制**：不限制信息来源
- **通用知识**：可以使用通用知识库

### Friend Proxy AI
- **受限代理**：只能基于好友的公开信息回复
- **隐私保护**：不能编造或泄露隐私信息
- **个性化**：回复风格基于好友的persona_seed

## 如何验证差异

### 验证方法 1：询问个人信息

**前端操作路径：**
1. 点击导航栏的 "System AI"
2. 发送消息：`"What's your phone number?"`
3. System AI 可能会尝试回答或说明无法提供

4. 返回好友列表，点击某个好友的 "开始聊天"
5. 发送相同消息：`"What's your phone number?"`
6. Friend Proxy AI 应该回复：`"I don't have that information available. I can only share what's in my public bio and persona."`

**预期差异：**
- System AI：可能提供通用回复或说明
- Friend Proxy AI：明确拒绝，说明只能使用公开信息

### 验证方法 2：询问专业领域

**前端操作路径：**
1. System AI 聊天：发送 `"Tell me about programming"`
2. System AI 会提供通用的编程知识

3. 与 Alice（软件工程师）的 Friend Proxy AI 聊天：发送 `"Tell me about programming"`
4. Friend Proxy AI 会基于 Alice 的 persona_seed 回复，强调她的个人兴趣和视角

**预期差异：**
- System AI：通用、客观的回答
- Friend Proxy AI：基于好友persona的个性化回答，带有个人色彩

### 验证方法 3：询问不存在的信息

**前端操作路径：**
1. System AI 聊天：发送 `"What's your favorite restaurant?"`
2. System AI 可能提供通用建议或说明

3. 与任何好友的 Friend Proxy AI 聊天：发送 `"What's your favorite restaurant?"`
4. Friend Proxy AI 应该回复：`"I don't have that information available. I can only share what's in my public bio and persona."`

**预期差异：**
- System AI：可能提供建议或通用回答
- Friend Proxy AI：明确说明没有该信息，因为不在公开的persona/bio中

### 验证方法 4：基于 Persona 的个性化回复

**前端操作路径：**
1. 与 Bob（设计师）的 Friend Proxy AI 聊天：发送 `"What do you like?"`
2. Friend Proxy AI 应该基于 Bob 的 persona_seed 回复，提到设计、艺术、音乐等

3. 与 David（健身教练）的 Friend Proxy AI 聊天：发送 `"What do you like?"`
4. Friend Proxy AI 应该基于 David 的 persona_seed 回复，提到健身、健康、营养等

**预期差异：**
- 不同好友的 Friend Proxy AI 回复内容完全不同
- 回复内容严格基于各自的 persona_seed 和 bio
- 不会出现不属于该好友的信息

## 测试数据

### 用户 Persona 示例

**Alice (ID: 1)**
- Persona: "Alice is a friendly software engineer who loves coding and helping others..."
- Bio: "Tech enthusiast | Full-stack developer | Open source contributor"

**Bob (ID: 2)**
- Persona: "Bob is a creative designer with a passion for art and music..."
- Bio: "UI/UX Designer | Artist | Music lover"

**Charlie (ID: 3)**
- Persona: "Charlie is an adventurous traveler and photographer..."
- Bio: "Travel blogger | Photographer | Adventure seeker"

**David (ID: 4)**
- Persona: "David is a fitness enthusiast and nutrition expert..."
- Bio: "Fitness coach | Nutritionist | Health advocate"

## 验证检查清单

- [ ] System AI 可以回答通用问题
- [ ] Friend Proxy AI 拒绝回答隐私问题
- [ ] Friend Proxy AI 只使用 persona_seed/bio 中的信息
- [ ] Friend Proxy AI 不会编造个人信息
- [ ] 不同好友的 Friend Proxy AI 回复风格不同
- [ ] 消息正确保存到数据库
- [ ] 聊天历史正确加载
- [ ] 页面清楚标注 "System AI" 和 "Friend Proxy AI"

