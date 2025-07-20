// src/components/video/VideoRoom.js
import React, { useState } from 'react';
import UserVideo from './UserVideo';
import Controls from './Controls';
import ChatPanel from './ChatPanel';
import useChat from '../../hooks/useChat';

const VideoRoom = ({
  publisher,
  subscribers,
  audioEnabled,
  videoEnabled,
  onToggleAudio,
  onToggleVideo,
  onLeaveSession,
  isLoading,
  session, // OpenVidu 세션 객체 추가
  currentUser // 현재 사용자 이름 추가
}) => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // 채팅 훅 사용
  const { messages, sendMessage, isConnected } = useChat(session, currentUser);

  const allParticipants = publisher ? [publisher, ...subscribers] : subscribers;
  const participantCount = allParticipants.length;

  // 그리드 레이아웃 클래스 결정
  const getGridClasses = () => {
    if (participantCount === 1) return 'grid-cols-1';
    if (participantCount === 2) return 'grid-cols-2';
    if (participantCount <= 4) return 'grid-cols-2';
    if (participantCount <= 6) return 'grid-cols-3';
    return 'grid-cols-4';
  };

  const handleChatToggle = () => {
    setIsChatOpen(!isChatOpen);
    if (!isChatOpen) {
      setUnreadCount(0); // 채팅 열 때 읽지 않은 메시지 카운트 리셋
    }
  };

  const handleSendMessage = async (message) => {
    try {
      await sendMessage(message.text);
    } catch (error) {
      console.error('메시지 전송 실패:', error);
      // 에러 처리 (예: 사용자에게 알림)
    }
  };

  // 새 메시지가 올 때 읽지 않은 메시지 카운트 증가 (채팅이 닫혀있을 때만)
  React.useEffect(() => {
    if (!isChatOpen && messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage && lastMessage.sender !== currentUser && !lastMessage.isSystem) {
        setUnreadCount(prev => prev + 1);
      }
    }
  }, [messages, isChatOpen, currentUser]);

  return (
    <div className="h-screen bg-gray-900 flex flex-col">
      {/* 헤더 */}
      <div className="bg-gray-800 text-white p-4 shadow-lg">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold">Video Conference</h1>
          <div className="flex items-center gap-4">
            <div className="text-sm">
              Participants: {participantCount}
            </div>
            {/* 채팅 토글 버튼 */}
            <button
              onClick={handleChatToggle}
              disabled={!isConnected}
              className={`relative px-3 py-1 rounded text-sm transition-colors ${
                isConnected 
                  ? 'bg-blue-600 hover:bg-blue-700' 
                  : 'bg-gray-600 cursor-not-allowed'
              }`}
            >
              Chat
              {unreadCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 메인 컨텐츠 영역 */}
      <div className="flex-1 flex overflow-hidden">
        {/* 비디오 영역 */}
        <div className={`flex-1 p-4 transition-all duration-300 ${isChatOpen ? 'pr-2' : ''}`}>
          <div className={`grid ${getGridClasses()} gap-4 h-full`}>
            {/* Publisher (본인) */}
            {publisher && (
              <div className="relative">
                <UserVideo streamManager={publisher} isPublisher={true} />
                <div className="absolute top-2 left-2 bg-blue-600 text-white px-2 py-1 rounded text-xs">
                  You
                </div>
              </div>
            )}

            {/* Subscribers (다른 참가자들) */}
            {subscribers.map((subscriber, index) => (
              <div key={index} className="relative">
                <UserVideo streamManager={subscriber} isPublisher={false} />
              </div>
            ))}

            {/* 빈 슬롯 표시 (최대 6명까지) */}
            {participantCount < 6 && Array.from({ length: Math.min(6 - participantCount, 3) }).map((_, index) => (
              <div key={`empty-${index}`} className="bg-gray-800 rounded-lg border-2 border-dashed border-gray-600 flex items-center justify-center">
                <span className="text-gray-400 text-sm">Waiting for participant...</span>
              </div>
            ))}
          </div>
        </div>

        {/* 채팅 패널 */}
        <div className={`transition-all duration-300 ${
          isChatOpen 
            ? 'w-80 border-l border-gray-700' 
            : 'w-0 overflow-hidden'
        }`}>
          {isChatOpen && (
            <ChatPanel
              messages={messages}
              onSendMessage={handleSendMessage}
              currentUser={currentUser}
              onClose={() => setIsChatOpen(false)}
              isConnected={isConnected}
            />
          )}
        </div>
      </div>

      {/* 컨트롤 패널 */}
      <div className="p-4 bg-gray-900">
        <Controls
          audioEnabled={audioEnabled}
          videoEnabled={videoEnabled}
          onToggleAudio={onToggleAudio}
          onToggleVideo={onToggleVideo}
          onLeaveSession={onLeaveSession}
          disabled={isLoading}
        />
      </div>
    </div>
  );
};

export default VideoRoom;