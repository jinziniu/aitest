# AI 聊天功能测试指南

## 快速验证步骤

### 1. 验证 System AI 聊天

**前端操作：**
1. 点击顶部导航栏的 "System AI"
2. 页面标题显示：**"System AI - 系统AI助手"**
3. 发送消息：`"Hello, what can you help me with?"`
4. 观察回复：System AI 会提供通用帮助信息

**验证点：**
- ✅ 页面清楚标注 "System AI"
- ✅ 消息气泡显示 "System AI" 标签
- ✅ 回复是通用的、有帮助的

### 2. 验证 Friend Proxy AI 聊天

**前置条件：**
- 确保至少有一个已接受的好友（如果没有，先添加并接受好友请求）

**前端操作：**
1. 进入 "好友列表" 页面
2. 在 "我的好友" 区域，点击某个好友的 **"开始聊天"** 按钮
3. 页面标题显示：**"Friend Proxy AI - 好友AI代理"**
4. 发送消息：`"What's your phone number?"`
5. 观察回复：Friend Proxy AI 应该拒绝，说明只能使用公开信息

**验证点：**
- ✅ 页面清楚标注 "Friend Proxy AI"
- ✅ 消息气泡显示 "Friend Proxy AI" 标签
- ✅ 回复基于好友的 persona_seed/bio
- ✅ 拒绝回答隐私问题

### 3. 验证两种 AI 的差异

#### 测试场景 A：询问隐私信息

**System AI：**
- 发送：`"What's your phone number?"`
- 预期：可能提供通用回复或说明无法提供

**Friend Proxy AI（任意好友）：**
- 发送：`"What's your phone number?"`
- 预期：明确拒绝，说明只能使用公开信息

#### 测试场景 B：询问专业领域

**System AI：**
- 发送：`"Tell me about programming"`
- 预期：提供通用的编程知识

**Friend Proxy AI（Alice - 软件工程师）：**
- 发送：`"Tell me about programming"`
- 预期：基于 Alice 的 persona_seed 回复，强调个人兴趣和视角

**Friend Proxy AI（Bob - 设计师）：**
- 发送：`"Tell me about programming"`
- 预期：可能提到设计相关，或说明这不是他的专业领域

#### 测试场景 C：询问不存在的信息

**System AI：**
- 发送：`"What's your favorite restaurant?"`
- 预期：可能提供通用建议

**Friend Proxy AI（任意好友）：**
- 发送：`"What's your favorite restaurant?"`
- 预期：说明没有该信息，因为不在公开的 persona/bio 中

### 4. 验证消息持久化

**操作步骤：**
1. 在 System AI 或 Friend Proxy AI 中发送几条消息
2. 刷新页面（F5）
3. 检查消息是否还在

**验证点：**
- ✅ 消息历史正确加载
- ✅ 所有之前的消息都显示
- ✅ 消息顺序正确

### 5. 验证不同好友的个性化回复

**操作步骤：**
1. 与 Alice（软件工程师）的 Friend Proxy AI 聊天
   - 发送：`"What are you interested in?"`
   - 预期：回复提到技术、编程、开源等

2. 与 Bob（设计师）的 Friend Proxy AI 聊天
   - 发送：`"What are you interested in?"`
   - 预期：回复提到设计、艺术、音乐等

3. 与 David（健身教练）的 Friend Proxy AI 聊天
   - 发送：`"What are you interested in?"`
   - 预期：回复提到健身、健康、营养等

**验证点：**
- ✅ 不同好友的回复内容完全不同
- ✅ 回复严格基于各自的 persona_seed
- ✅ 不会出现不属于该好友的信息

## 推荐测试消息

### System AI 测试消息
1. `"Hello"`
2. `"What can you help me with?"`
3. `"Tell me about the weather"`
4. `"What's your name?"`
5. `"Help me with programming"`

### Friend Proxy AI 测试消息
1. `"Hello"` - 测试基础回复
2. `"What's your phone number?"` - 测试隐私保护
3. `"What are you interested in?"` - 测试基于 persona 的回复
4. `"Tell me about yourself"` - 测试基于 bio 的回复
5. `"What's your favorite restaurant?"` - 测试不存在信息的处理

## 预期行为总结

| 特性 | System AI | Friend Proxy AI |
|------|-----------|-----------------|
| 信息来源 | 通用知识库 | 仅限好友的 persona_seed/bio |
| 隐私保护 | 可能提供通用建议 | 严格拒绝隐私问题 |
| 个性化 | 通用回复 | 基于好友persona的个性化回复 |
| 信息编造 | 可能使用通用知识 | 严格禁止编造信息 |
| 页面标注 | "System AI" | "Friend Proxy AI" |

## 常见问题排查

**问题：消息发送失败**
- 检查后端服务是否运行（http://localhost:5000）
- 检查浏览器控制台是否有错误

**问题：消息历史不显示**
- 检查后端 data.json 文件是否存在
- 检查网络请求是否成功

**问题：Friend Proxy AI 回复不符合预期**
- 检查好友的 persona_seed 和 bio 是否正确设置
- 检查是否真的是已接受的好友关系

