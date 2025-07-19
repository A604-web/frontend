// src/App.js
import React, { useState } from 'react';
import Home from './pages/Home';
import Room from './pages/Room';
import { useOpenVidu } from './hooks/useOpenVidu';
import './styles/globals.css';

function App() {
  const [currentView, setCurrentView] = useState('home'); // 'home' | 'room'
  const [sessionData, setSessionData] = useState({ sessionId: '', userName: '' });
  
  const { testConnection, error, clearError } = useOpenVidu();

  // 세션 참가
  const handleJoinSession = (sessionId, userName) => {
    setSessionData({ sessionId, userName });
    setCurrentView('room');
    clearError();
  };

  // 세션 나가기 (홈으로 돌아가기)
  const handleLeaveRoom = () => {
    setSessionData({ sessionId: '', userName: '' });
    setCurrentView('home');
    clearError();
  };

  // 연결 테스트
  const handleTestConnection = async () => {
    try {
      const result = await testConnection();
      if (result) {
        alert('OpenVidu server connection successful! ✅');
      }
    } catch (error) {
      alert(`Connection failed: ${error.message} ❌`);
    }
  };

  return (
    <div className="App">
      {currentView === 'home' ? (
        <Home
          onJoinSession={handleJoinSession}
          onTestConnection={handleTestConnection}
          error={error}
          isLoading={false}
        />
      ) : (
        <Room
          sessionId={sessionData.sessionId}
          userName={sessionData.userName}
          onLeaveRoom={handleLeaveRoom}
        />
      )}
    </div>
  );
}

export default App;