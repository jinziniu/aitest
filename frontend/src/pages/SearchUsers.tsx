import { useState } from 'react';
import { useUser } from '../contexts/UserContext';
import { API_BASE } from '../config/api';
import './SearchUsers.css';

interface User {
  id: string;
  username: string;
  email: string;
}

function SearchUsers() {
  const { currentUserId } = useUser();
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setUsers([]);
      return;
    }

    setLoading(true);
    setMessage('');
    try {
      const response = await fetch(`${API_BASE}/users?search=${encodeURIComponent(searchQuery)}`);
      const data = await response.json();
      setUsers(data.users || []);
    } catch (error) {
      setMessage('搜索失败，请检查后端服务是否启动');
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestFriend = async (toUserId: string) => {
    try {
      const response = await fetch(`${API_BASE}/friends/request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fromUserId: currentUserId,
          toUserId,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage(`已向 ${data.friendship?.otherUser?.username || '用户'} 发送好友请求`);
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage(data.error || '发送请求失败');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (error) {
      setMessage('网络错误，请检查后端服务');
      console.error('Request friend error:', error);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  return (
    <div className="search-users">
      <h1>搜索用户</h1>
      
      <div className="search-box">
        <input
          type="text"
          placeholder="输入用户名或邮箱搜索..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          className="search-input"
        />
        <button onClick={handleSearch} disabled={loading} className="search-button">
          {loading ? '搜索中...' : '搜索'}
        </button>
      </div>

      {message && (
        <div className={`message ${message.includes('失败') || message.includes('错误') ? 'error' : 'success'}`}>
          {message}
        </div>
      )}

      <div className="users-list">
        {users.length === 0 && searchQuery && !loading && (
          <div className="empty-state">未找到用户</div>
        )}
        {users.map((user) => (
          <div key={user.id} className="user-card">
            <div className="user-info">
              <div className="user-avatar">{user.username[0].toUpperCase()}</div>
              <div>
                <div className="user-name">{user.username}</div>
                <div className="user-email">{user.email}</div>
              </div>
            </div>
            {user.id !== currentUserId && (
              <button
                onClick={() => handleRequestFriend(user.id)}
                className="add-friend-button"
              >
                添加好友
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default SearchUsers;

