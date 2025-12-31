import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { getSocket } from '../services/socket';
import { API_BASE } from '../config/api';
import './PrivateChat.css';

interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  clientMsgId?: string;
  createdAt: string;
}

function PrivateChat() {
  const { peerUserId } = useParams<{ peerUserId: string }>();
  const { currentUserId } = useUser();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [connected, setConnected] = useState(false);
  const [reconnecting, setReconnecting] = useState(false);
  const [peerUser, setPeerUser] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<any>(null);
  const pendingMessagesRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!peerUserId || !currentUserId) {
      navigate('/friends');
      return;
    }

    loadPeerUser();
    loadMessageHistory();
    setupSocket();

    return () => {
      if (socketRef.current) {
        socketRef.current.off('private_message');
        socketRef.current.off('joined_room');
        socketRef.current.off('message_sent');
        socketRef.current.off('error');
        socketRef.current.off('connect');
        socketRef.current.off('disconnect');
        socketRef.current.off('reconnect');
      }
    };
  }, [peerUserId, currentUserId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadPeerUser = async () => {
    try {
      const response = await fetch(`${API_BASE}/users/${peerUserId}`);
      const data = await response.json();
      setPeerUser(data.user);
    } catch (error) {
      console.error('Load peer user error:', error);
    }
  };

  const loadMessageHistory = async () => {
    setLoadingHistory(true);
    try {
      const response = await fetch(
        `${API_BASE}/messages/private?userId=${currentUserId}&peerUserId=${peerUserId}`
      );
      const data = await response.json();
      setMessages(data.messages || []);
    } catch (error) {
      console.error('Load history error:', error);
    } finally {
      setLoadingHistory(false);
    }
  };

  const setupSocket = () => {
    const socket = getSocket(currentUserId);
    socketRef.current = socket;

    // 连接状态
    socket.on('connect', () => {
      console.log('Socket connected');
      setConnected(true);
      setReconnecting(false);
      
      // 加入私聊房间
      socket.emit('join_private_chat', { peerUserId });
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected');
      setConnected(false);
    });

    socket.on('reconnect', () => {
      console.log('Socket reconnected');
      setReconnecting(false);
      setConnected(true);
      
      // 重连后重新加入房间
      socket.emit('join_private_chat', { peerUserId });
    });

    socket.on('connect_error', () => {
      setReconnecting(true);
    });

    // 加入房间成功
    socket.on('joined_room', ({ roomId }) => {
      console.log('Joined room:', roomId);
    });

    // 接收私聊消息
    socket.on('private_message', ({ message }) => {
      // 去重：检查是否已存在（通过id或clientMsgId）
      setMessages(prev => {
        const exists = prev.some(
          m => m.id === message.id || 
          (message.clientMsgId && m.clientMsgId === message.clientMsgId)
        );
        
        if (exists) {
          return prev;
        }
        
        return [...prev, message];
      });
      
      // 如果是pending消息被确认，移除pending标记
      if (message.clientMsgId) {
        pendingMessagesRef.current.delete(message.clientMsgId);
      }
    });

    // 消息发送确认
    socket.on('message_sent', ({ clientMsgId, serverMsgId }) => {
      // 更新消息ID（从clientMsgId到serverMsgId）
      setMessages(prev => prev.map(msg => {
        if (msg.clientMsgId === clientMsgId) {
          return { ...msg, id: serverMsgId, clientMsgId: undefined };
        }
        return msg;
      }));
      
      pendingMessagesRef.current.delete(clientMsgId);
    });

    // 错误处理
    socket.on('error', ({ message }) => {
      console.error('Socket error:', message);
      alert(`错误: ${message}`);
    });
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || loading) return;

    const content = inputMessage.trim();
    setInputMessage('');
    setLoading(true);

    // 生成客户端消息ID
    const clientMsgId = `client-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    // 乐观更新：立即显示消息（pending状态）
    const tempMessage: Message = {
      id: clientMsgId,
      senderId: currentUserId,
      receiverId: peerUserId!,
      content,
      clientMsgId,
      createdAt: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, tempMessage]);
    pendingMessagesRef.current.add(clientMsgId);

    try {
      const socket = socketRef.current;
      if (!socket || !socket.connected) {
        throw new Error('Socket not connected');
      }

      // 发送消息
      socket.emit('send_private_message', {
        peerUserId,
        content,
        clientMsgId
      });
    } catch (error) {
      // 移除失败的消息
      setMessages(prev => prev.filter(m => m.id !== clientMsgId));
      pendingMessagesRef.current.delete(clientMsgId);
      alert('发送消息失败，请检查连接');
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
      <div className="private-chat-container">
        <div className="chat-loading">加载聊天历史...</div>
      </div>
    );
  }

  if (!peerUser) {
    return (
      <div className="private-chat-container">
        <div className="chat-loading">加载用户信息...</div>
      </div>
    );
  }

  return (
    <div className="private-chat-container">
      <div className="chat-header">
        <button onClick={() => navigate('/friends')} className="back-button">
          ← 返回
        </button>
        <div className="chat-title">
          <div className="user-avatar">{peerUser.username[0].toUpperCase()}</div>
          <div>
            <div className="chat-title-text">{peerUser.username}</div>
            <div className="connection-status">
              {connected ? (
                <span className="status-connected">● 已连接</span>
              ) : reconnecting ? (
                <span className="status-reconnecting">● 重连中...</span>
              ) : (
                <span className="status-disconnected">● 未连接</span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="chat-messages">
        {messages.length === 0 && (
          <div className="empty-chat">
            <div className="empty-chat-icon">💬</div>
            <div className="empty-chat-text">开始与 {peerUser.username} 聊天吧！</div>
          </div>
        )}
        {messages.map((message) => {
          const isOwn = message.senderId === currentUserId;
          const isPending = message.clientMsgId && pendingMessagesRef.current.has(message.clientMsgId);
          
          return (
            <div
              key={message.id}
              className={`message ${isOwn ? 'user-message' : 'peer-message'} ${isPending ? 'pending' : ''}`}
            >
              <div className="message-content">
                <div className={`message-bubble ${isOwn ? 'user-bubble' : 'peer-bubble'}`}>
                  {message.content}
                  {isPending && <span className="pending-indicator">⏳</span>}
                </div>
              </div>
              <div className="message-time">
                {new Date(message.createdAt).toLocaleTimeString('zh-CN', {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input-container">
        <textarea
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="输入消息..."
          className="chat-input"
          rows={1}
          disabled={loading || !connected}
        />
        <button
          onClick={handleSendMessage}
          disabled={!inputMessage.trim() || loading || !connected}
          className="send-button"
        >
          {loading ? '发送中...' : '发送'}
        </button>
      </div>
    </div>
  );
}

export default PrivateChat;

