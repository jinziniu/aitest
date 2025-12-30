import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { UserProvider } from './contexts/UserContext';
import SearchUsers from './pages/SearchUsers';
import FriendsList from './pages/FriendsList';
import Chat from './pages/Chat';
import PrivateChat from './pages/PrivateChat';
import UserManagement from './pages/UserManagement';
import UserSwitcher from './components/UserSwitcher';
import './App.css';

function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <div className="app">
          <nav className="navbar">
            <div className="nav-links">
              <Link to="/" className="nav-link">搜索用户</Link>
              <Link to="/friends" className="nav-link">好友列表</Link>
              <Link to="/users" className="nav-link">用户管理</Link>
              <Link to="/chat/system" className="nav-link">System AI</Link>
            </div>
            <UserSwitcher />
          </nav>
          <main className="main-content">
            <Routes>
              <Route path="/" element={<SearchUsers />} />
              <Route path="/friends" element={<FriendsList />} />
            <Route path="/users" element={<UserManagement />} />
            <Route path="/chat/system" element={<Chat />} />
            <Route path="/chat/friend/:friendId" element={<Chat />} />
            <Route path="/chat/private/:peerUserId" element={<PrivateChat />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </UserProvider>
  );
}

export default App;
