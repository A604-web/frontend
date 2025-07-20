// src/pages/Room.js
import React, { useEffect } from 'react';
import VideoRoom from '../components/video/VideoRoom';
import { useOpenVidu } from '../hooks/useOpenVidu';

const Room = ({ sessionId, userName, onLeaveRoom }) => {
  const {
    publisher,
    subscribers,
    isConnected,
    isLoading,
    error,
    audioEnabled,
    videoEnabled,
    joinSession,
    leaveSession,
    toggleAudio,
    toggleVideo,
    clearError,
    session // ← 세션 객체 추가 (useOpenVidu에서 노출해야 함)
  } = useOpenVidu();

  useEffect(() => {
    if (sessionId && userName) {
      joinSession(sessionId, userName);
    }
  }, [sessionId, userName, joinSession]);

  const handleLeaveSession = () => {
    leaveSession();
    onLeaveRoom();
  };

  // 에러 발생 시 자동으로 홈으로 돌아가기
  useEffect(() => {
    if (error && !isLoading) {
      const timer = setTimeout(() => {
        handleLeaveSession();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, isLoading]);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="text-red-500 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Connection Error</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={handleLeaveSession}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Back to Home
            </button>
            <p className="text-sm text-gray-500 mt-4">
              Automatically redirecting in 5 seconds...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-white text-lg">Connecting to session...</p>
          <p className="text-gray-400 text-sm mt-2">Session: {sessionId}</p>
        </div>
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-white text-lg">Initializing video call...</p>
        </div>
      </div>
    );
  }

  return (
    <VideoRoom
      publisher={publisher}
      subscribers={subscribers}
      audioEnabled={audioEnabled}
      videoEnabled={videoEnabled}
      onToggleAudio={toggleAudio}
      onToggleVideo={toggleVideo}
      onLeaveSession={handleLeaveSession}
      isLoading={isLoading}
      session={session}        // ← 세션 객체 전달
      currentUser={userName}   // ← 현재 사용자 이름 전달
    />
  );
};

export default Room;