import { useState, useEffect } from 'react';
import './UserManagement.css';

interface User {
  id: string;
  username: string;
  email: string;
  persona_seed?: string;
  bio?: string;
  createdAt?: string;
}

const API_BASE = 'http://localhost:5000';

function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    persona_seed: '',
    bio: ''
  });

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
      setMessage('加载用户列表失败，请检查后端服务是否启动');
      console.error('Load users error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingUser(null);
    setFormData({ username: '', email: '', persona_seed: '', bio: '' });
    setShowForm(true);
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setFormData({
      username: user.username,
      email: user.email,
      persona_seed: user.persona_seed || '',
      bio: user.bio || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除这个用户吗？这将同时删除该用户的所有好友关系和消息。')) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/users/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setMessage('用户删除成功');
        setTimeout(() => setMessage(''), 3000);
        loadUsers();
      } else {
        const data = await response.json();
        setMessage(data.error || '删除失败');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (error) {
      setMessage('网络错误，请检查后端服务');
      console.error('Delete user error:', error);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const url = editingUser
        ? `${API_BASE}/users/${editingUser.id}`
        : `${API_BASE}/users`;
      
      const method = editingUser ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage(editingUser ? '用户更新成功' : '用户创建成功');
        setTimeout(() => setMessage(''), 3000);
        setShowForm(false);
        loadUsers();
      } else {
        setMessage(data.error || '操作失败');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (error) {
      setMessage('网络错误，请检查后端服务');
      console.error('Submit error:', error);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  if (loading) {
    return (
      <div className="user-management">
        <div className="loading">加载中...</div>
      </div>
    );
  }

  return (
    <div className="user-management">
      <div className="header-section">
        <h1>用户管理</h1>
        <button onClick={handleCreate} className="create-button">
          + 添加用户
        </button>
      </div>

      {message && (
        <div className={`message ${message.includes('失败') || message.includes('错误') ? 'error' : 'success'}`}>
          {message}
        </div>
      )}

      {showForm && (
        <div className="form-overlay" onClick={() => setShowForm(false)}>
          <div className="form-container" onClick={(e) => e.stopPropagation()}>
            <h2>{editingUser ? '编辑用户' : '添加用户'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>用户名 *</label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>邮箱 *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Persona Seed</label>
                <textarea
                  value={formData.persona_seed}
                  onChange={(e) => setFormData({ ...formData, persona_seed: e.target.value })}
                  rows={3}
                  placeholder="描述用户的性格和特点..."
                />
              </div>
              <div className="form-group">
                <label>Bio</label>
                <input
                  type="text"
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="简短的个人简介..."
                />
              </div>
              <div className="form-actions">
                <button type="submit" className="submit-button">
                  {editingUser ? '更新' : '创建'}
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="cancel-button">
                  取消
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="users-table">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>用户名</th>
              <th>邮箱</th>
              <th>Bio</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan={5} className="empty-state">
                  暂无用户
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>{user.bio || '-'}</td>
                  <td>
                    <button
                      onClick={() => handleEdit(user)}
                      className="edit-button"
                    >
                      编辑
                    </button>
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="delete-button"
                    >
                      删除
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default UserManagement;

