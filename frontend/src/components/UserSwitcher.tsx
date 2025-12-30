import { useState, useEffect } from 'react';
import { useUser } from '../contexts/UserContext';
import './UserSwitcher.css';

const API_BASE = 'http://localhost:5000';

interface User {
  id: string;
  username: string;
  email: string;
}

function UserSwitcher() {
  const { currentUser, setCurrentUser, currentUserId } = useUser();
  const [users, setUsers] = useState<User[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/users`);
      const data = await response.json();
      setUsers(data.users || []);
    } catch (error) {
      console.error('Load users error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSwitchUser = (user: User) => {
    setCurrentUser(user);
    setShowDropdown(false);
    // 刷新页面以更新所有使用currentUserId的组件
    window.location.reload();
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setShowDropdown(false);
    window.location.reload();
  };

  const displayName = currentUser 
    ? `${currentUser.username} (${currentUser.email})`
    : `用户 ${currentUserId}`;

  return (
    <div className="user-switcher">
      <button
        className="user-switcher-button"
        onClick={() => setShowDropdown(!showDropdown)}
      >
        <span className="user-icon">👤</span>
        <span className="user-name">{displayName}</span>
        <span className="dropdown-arrow">{showDropdown ? '▲' : '▼'}</span>
      </button>

      {showDropdown && (
        <>
          <div className="dropdown-overlay" onClick={() => setShowDropdown(false)} />
          <div className="user-dropdown">
            <div className="dropdown-header">
              <strong>切换用户</strong>
            </div>
            <div className="dropdown-content">
              {loading ? (
                <div className="loading">加载中...</div>
              ) : (
                users.map((user) => (
                  <button
                    key={user.id}
                    className={`user-option ${currentUser?.id === user.id ? 'active' : ''}`}
                    onClick={() => handleSwitchUser(user)}
                  >
                    <span className="user-option-avatar">{user.username[0].toUpperCase()}</span>
                    <div className="user-option-info">
                      <div className="user-option-name">{user.username}</div>
                      <div className="user-option-email">{user.email}</div>
                    </div>
                    {currentUser?.id === user.id && (
                      <span className="check-mark">✓</span>
                    )}
                  </button>
                ))
              )}
            </div>
            {currentUser && (
              <div className="dropdown-footer">
                <button className="logout-button" onClick={handleLogout}>
                  退出登录
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default UserSwitcher;

