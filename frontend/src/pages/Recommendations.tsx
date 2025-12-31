import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { API_BASE } from '../config/api';
import './Recommendations.css';

interface Candidate {
  id: string;
  username: string;
  email: string;
  gender?: string;
  birth_year?: number;
  tags?: string[];
  bio?: string;
  persona_seed?: string;
  relevanceScore: number;
  reasons: string[];
}

function Recommendations() {
  const { currentUserId } = useUser();
  const navigate = useNavigate();
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [filters, setFilters] = useState({
    gender: '',
    age_min: '',
    age_max: ''
  });

  useEffect(() => {
    loadRecommendations();
  }, [currentUserId]);
  
  // 筛选条件变化时重新加载
  useEffect(() => {
    loadRecommendations();
  }, [filters.gender, filters.age_min, filters.age_max]);

  const loadRecommendations = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        userId: currentUserId,
        ...(filters.gender && { gender: filters.gender }),
        ...(filters.age_min && { age_min: filters.age_min }),
        ...(filters.age_max && { age_max: filters.age_max })
      });
      
      const response = await fetch(`${API_BASE}/recommendations?${params}`);
      const data = await response.json();
      setCandidates(data.candidates || []);
    } catch (error) {
      setMessage('加载推荐列表失败，请检查后端服务是否启动');
      console.error('Load recommendations error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleEvent = async (candidateId: string, eventType: string) => {
    try {
      if (eventType === 'ADD_FRIEND') {
        // 直接发送好友请求
        const response = await fetch(`${API_BASE}/friends/request`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            fromUserId: currentUserId,
            toUserId: candidateId,
          }),
        });

        const data = await response.json();
        if (response.ok) {
          const candidate = candidates.find(c => c.id === candidateId);
          setMessage(`已向 ${candidate?.username || '用户'} 发送好友请求`);
          setTimeout(() => setMessage(''), 3000);
          // 记录推荐事件（不刷新列表）
          await fetch(`${API_BASE}/recommendations/event`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              userId: currentUserId,
              candidateId,
              eventType: 'LIKE' // 添加好友视为点赞行为
            }),
          });
          // 从列表中移除该用户（因为已经是好友请求状态）
          setCandidates(prev => prev.filter(c => c.id !== candidateId));
        } else {
          setMessage(data.error || '发送好友请求失败');
          setTimeout(() => setMessage(''), 3000);
        }
        return;
      }

      // 其他事件类型（SKIP, CHAT等）
      const response = await fetch(`${API_BASE}/recommendations/event`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: currentUserId,
          candidateId,
          eventType
        }),
      });

      const data = await response.json();
      if (response.ok) {
        if (eventType === 'SKIP') {
          // 从列表中移除该用户
          setCandidates(prev => prev.filter(c => c.id !== candidateId));
        } else if (eventType === 'CHAT') {
          // 跳转到AI聊天
          navigate(`/chat/friend/${candidateId}`);
        }
      } else {
        setMessage(data.error || '操作失败');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (error) {
      setMessage('网络错误，请检查后端服务');
      console.error('Event error:', error);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const calculateAge = (birthYear?: number) => {
    if (!birthYear) return '未知';
    return new Date().getFullYear() - birthYear;
  };

  if (loading) {
    return (
      <div className="recommendations">
        <div className="loading">加载推荐列表...</div>
      </div>
    );
  }

  return (
    <div className="recommendations">
      <h1 className="page-title">发现界面</h1>

      {message && (
        <div className={`message ${message.includes('失败') || message.includes('错误') ? 'error' : 'success'}`}>
          {message}
        </div>
      )}

      {/* 推荐列表 - 两列卡片布局 */}
      <div className="candidates-grid">
        {candidates.length === 0 ? (
          <div className="empty-state">暂无推荐用户</div>
        ) : (
          candidates.map((candidate) => (
            <div key={candidate.id} className="discovery-card">
              <div className="card-avatar">
                {candidate.username[0].toUpperCase()}
              </div>
              <div className="card-name">{candidate.username}</div>
              <div className="card-details">
                {candidate.gender && (
                  <span className="gender-icon">{candidate.gender === 'male' ? '👨' : '👩'}</span>
                )}
                {candidate.birth_year && (
                  <span className="age-text">{calculateAge(candidate.birth_year)}岁</span>
                )}
                <span className="score-badge">{candidate.relevanceScore}</span>
              </div>
              {candidate.bio && (
                <div className="card-bio">{candidate.bio}</div>
              )}
              {candidate.reasons && candidate.reasons.length > 0 && (
                <div className="card-reasons">
                  {candidate.reasons.slice(0, 2).map((reason, index) => (
                    <span key={index} className="reason-badge">{reason}</span>
                  ))}
                </div>
              )}
              <div className="card-actions">
                <button
                  onClick={() => handleEvent(candidate.id, 'ADD_FRIEND')}
                  className="action-btn primary"
                >
                  添加好友
                </button>
                <button
                  onClick={() => handleEvent(candidate.id, 'CHAT')}
                  className="action-btn secondary"
                >
                  聊天
                </button>
                <button
                  onClick={() => handleEvent(candidate.id, 'SKIP')}
                  className="action-btn skip"
                >
                  跳过
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Recommendations;

