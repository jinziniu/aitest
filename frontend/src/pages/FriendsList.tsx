import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { API_BASE } from '../config/api';
import './FriendsList.css';

interface Friendship {
  id: string;
  fromUserId: string;
  toUserId: string;
  status: 'pending' | 'accepted';
  otherUser: {
    id: string;
    username: string;
    email: string;
  };
  isFromMe: boolean;
  createdAt: string;
  acceptedAt?: string;
}

function FriendsList() {
  const navigate = useNavigate();
  const { currentUserId } = useUser();
  const [friendships, setFriendships] = useState<Friendship[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const loadFriends = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/friends?userId=${currentUserId}`);
      const data = await response.json();
      setFriendships(data.friendships || []);
    } catch (error) {
      setMessage('加载好友列表失败，请检查后端服务是否启动');
      console.error('Load friends error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFriends();
  }, []);

  const handleAcceptFriend = async (friendshipId: string) => {
    try {
      const response = await fetch(`${API_BASE}/friends/accept`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          friendshipId,
          userId: currentUserId,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage('好友请求已接受');
        setTimeout(() => setMessage(''), 3000);
        loadFriends(); // 重新加载列表
      } else {
        setMessage(data.error || '接受请求失败');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (error) {
      setMessage('网络错误，请检查后端服务');
      console.error('Accept friend error:', error);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const pendingRequests = friendships.filter(f => f.status === 'pending' && !f.isFromMe);
  const sentRequests = friendships.filter(f => f.status === 'pending' && f.isFromMe);
  const acceptedFriends = friendships.filter(f => f.status === 'accepted');

  if (loading) {
    return (
      <div className="friends-list">
        <div className="loading">加载中...</div>
      </div>
    );
  }

  return (
    <div className="friends-list">
      <h1>好友列表</h1>

      {message && (
        <div className={`message ${message.includes('失败') || message.includes('错误') ? 'error' : 'success'}`}>
          {message}
        </div>
      )}

      {/* 待处理的好友请求 */}
      {pendingRequests.length > 0 && (
        <section className="friends-section">
          <h2>待处理的好友请求 ({pendingRequests.length})</h2>
          <div className="friends-grid">
            {pendingRequests.map((friendship) => (
              <div key={friendship.id} className="friend-card pending">
                <div className="user-info">
                  <div className="user-avatar">{friendship.otherUser.username[0].toUpperCase()}</div>
                  <div>
                    <div className="user-name">{friendship.otherUser.username}</div>
                    <div className="user-email">{friendship.otherUser.email}</div>
                    <div className="request-time">请求时间: {new Date(friendship.createdAt).toLocaleString('zh-CN')}</div>
                  </div>
                </div>
                <button
                  onClick={() => handleAcceptFriend(friendship.id)}
                  className="accept-button"
                >
                  接受
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 已发送的好友请求 */}
      {sentRequests.length > 0 && (
        <section className="friends-section">
          <h2>已发送的好友请求 ({sentRequests.length})</h2>
          <div className="friends-grid">
            {sentRequests.map((friendship) => (
              <div key={friendship.id} className="friend-card sent">
                <div className="user-info">
                  <div className="user-avatar">{friendship.otherUser.username[0].toUpperCase()}</div>
                  <div>
                    <div className="user-name">{friendship.otherUser.username}</div>
                    <div className="user-email">{friendship.otherUser.email}</div>
                    <div className="request-time">等待接受中...</div>
                  </div>
                </div>
                <span className="status-badge">待接受</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 已接受的好友 */}
      <section className="friends-section">
        <h2>我的好友 ({acceptedFriends.length})</h2>
        {acceptedFriends.length === 0 ? (
          <div className="empty-state">暂无好友</div>
        ) : (
          <div className="friends-grid">
            {acceptedFriends.map((friendship) => (
              <div key={friendship.id} className="friend-card accepted">
                <div className="user-info">
                  <div className="user-avatar">{friendship.otherUser.username[0].toUpperCase()}</div>
                  <div>
                    <div className="user-name">{friendship.otherUser.username}</div>
                    <div className="user-email">{friendship.otherUser.email}</div>
                    <div className="request-time">
                      成为好友: {new Date(friendship.acceptedAt || friendship.createdAt).toLocaleString('zh-CN')}
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={() => navigate(`/chat/friend/${friendship.otherUser.id}`)}
                    className="chat-button"
                  >
                    AI聊天
                  </button>
                  <button
                    onClick={() => navigate(`/chat/private/${friendship.otherUser.id}`)}
                    className="chat-button private-chat-button"
                  >
                    实时聊天
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default FriendsList;

