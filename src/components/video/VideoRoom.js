// src/components/video/VideoRoom.js
import React from 'react';
import UserVideo from './UserVideo';
import Controls from './Controls';

const VideoRoom = ({
  publisher,
  subscribers,
  audioEnabled,
  videoEnabled,
  onToggleAudio,
  onToggleVideo,
  onLeaveSession,
  isLoading
}) => {
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

  return (
    <div className="h-screen bg-gray-900 flex flex-col">
      {/* 헤더 */}
      <div className="bg-gray-800 text-white p-4 shadow-lg">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold">Video Conference</h1>
          <div className="text-sm">
            Participants: {participantCount}
          </div>
        </div>
      </div>

      {/* 비디오 그리드 */}
      <div className="flex-1 p-4">
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