import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import './Chat.css';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: string;
}

const API_BASE = 'http://localhost:5000';

function Chat() {
  const { currentUserId } = useUser();
  const { friendId } = useParams<{ friendId?: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 从路径判断聊天类型
  const isSystemChat = location.pathname === '/chat/system';
  const isFriendChat = location.pathname.startsWith('/chat/friend/') && friendId;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadChatHistory = useCallback(async () => {
    // 重新检查路径，确保在调用时路径仍然有效
    const currentIsSystemChat = location.pathname === '/chat/system';
    const currentIsFriendChat = location.pathname.startsWith('/chat/friend/') && friendId;
    
    if (!currentIsSystemChat && !currentIsFriendChat) {
      return;
    }
    
    setLoadingHistory(true);
    try {
      const url = currentIsSystemChat
        ? `${API_BASE}/chat/messages?userId=${currentUserId}&chatType=system`
        : `${API_BASE}/chat/messages?userId=${currentUserId}&chatType=friend&friendId=${friendId}`;
      
      const response = await fetch(url);
      const data = await response.json();
      setMessages(data.messages || []);
    } catch (error) {
      console.error('Load history error:', error);
    } finally {
      setLoadingHistory(false);
    }
  }, [location.pathname, friendId, currentUserId]);

  useEffect(() => {
    // 在useEffect内部重新计算，确保使用最新的路径值
    const currentIsSystemChat = location.pathname === '/chat/system';
    const currentIsFriendChat = location.pathname.startsWith('/chat/friend/') && friendId;
    const pathIsValid = currentIsSystemChat || currentIsFriendChat;
    
    console.log('Chat useEffect:', { 
      pathname: location.pathname, 
      friendId, 
      currentIsSystemChat, 
      currentIsFriendChat, 
      pathIsValid 
    });
    
    if (!pathIsValid) {
      console.log('Path invalid, navigating to /');
      navigate('/');
      return;
    }
    
    // 只有在路径有效时才加载聊天历史
    loadChatHistory();
  }, [location.pathname, friendId, navigate, loadChatHistory]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || loading) return;

    const userMessage = inputMessage.trim();
    setInputMessage('');
    setLoading(true);

    // 添加用户消息到UI（乐观更新）
    const tempUserMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: userMessage,
      createdAt: new Date().toISOString()
    };
    setMessages(prev => [...prev, tempUserMsg]);

    try {
      const url = isSystemChat
        ? `${API_BASE}/chat/system`
        : `${API_BASE}/chat/friend`;
      
      const body = isSystemChat
        ? { userId: currentUserId, message: userMessage }
        : { userId: currentUserId, friendId, message: userMessage };

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();
      
      if (response.ok) {
        // 替换临时消息，添加AI回复
        setMessages(prev => {
          const filtered = prev.filter(m => m.id !== tempUserMsg.id);
          return [...filtered, data.userMessage, data.aiMessage];
        });
      } else {
        // 移除临时消息，显示错误
        setMessages(prev => prev.filter(m => m.id !== tempUserMsg.id));
        alert(data.error || '发送消息失败');
      }
    } catch (error) {
      // 移除临时消息
      setMessages(prev => prev.filter(m => m.id !== tempUserMsg.id));
      alert('网络错误，请检查后端服务');
      console.error('Send message error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (loadingHistory) {
    return (
      <div className="chat-container">
        <div className="chat-loading">加载聊天历史...</div>
      </div>
    );
  }

  return (
    <div className="chat-container">
      <div className="chat-header">
        <button onClick={() => navigate('/friends')} className="back-button">
          ← 返回
        </button>
        <div className="chat-title">
          {isSystemChat ? (
            <>
              <span className="chat-badge system-badge">System AI</span>
              <span className="chat-title-text">系统AI助手</span>
            </>
          ) : (
            <>
              <span className="chat-badge friend-badge">Friend Proxy AI</span>
              <span className="chat-title-text">好友AI代理</span>
            </>
          )}
        </div>
      </div>

      <div className="chat-messages">
        {messages.length === 0 && (
          <div className="empty-chat">
            <div className="empty-chat-icon">💬</div>
            <div className="empty-chat-text">
              {isSystemChat 
                ? '开始与 System AI 对话吧！' 
                : '开始与好友的 AI 代理对话吧！'}
            </div>
            <div className="empty-chat-hint">
              {isSystemChat
                ? 'System AI 是一个通用的AI助手，可以回答各种问题。'
                : 'Friend Proxy AI 基于好友的公开信息回复，不会编造隐私信息。'}
            </div>
          </div>
        )}
        {messages.map((message) => (
          <div
            key={message.id}
            className={`message ${message.role === 'user' ? 'user-message' : 'ai-message'}`}
          >
            <div className="message-content">
              {message.role === 'user' ? (
                <div className="message-bubble user-bubble">
                  {message.content}
                </div>
              ) : (
                <div className="message-bubble ai-bubble">
                  <div className="ai-label">
                    {isSystemChat ? 'System AI' : 'Friend Proxy AI'}
                  </div>
                  {message.content}
                </div>
              )}
            </div>
            <div className="message-time">
              {new Date(message.createdAt).toLocaleTimeString('zh-CN', {
                hour: '2-digit',
                minute: '2-digit'
              })}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input-container">
        <textarea
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={isSystemChat ? '输入消息...' : '输入消息...'}
          className="chat-input"
          rows={1}
          disabled={loading}
        />
        <button
          onClick={handleSendMessage}
          disabled={!inputMessage.trim() || loading}
          className="send-button"
        >
          {loading ? '发送中...' : '发送'}
        </button>
      </div>
    </div>
  );
}

export default Chat;

