// src/components/video/UserVideo.js
import React, { useRef, useEffect } from 'react';

const UserVideo = ({ streamManager, isPublisher = false }) => {
  const videoRef = useRef();
  
  useEffect(() => {
    if (streamManager && videoRef.current) {
      streamManager.addVideoElement(videoRef.current);
    }
  }, [streamManager]);

  const getUserName = () => {
    if (streamManager && streamManager.stream) {
      const connection = streamManager.stream.connection;
      const clientData = connection.data ? JSON.parse(connection.data) : {};
      return clientData.clientData || 'Unknown User';
    }
    return 'Unknown User';
  };

  const isVideoActive = streamManager && streamManager.stream && streamManager.stream.videoActive;
  const isAudioActive = streamManager && streamManager.stream && streamManager.stream.audioActive;

  return (
    <div className="relative bg-gray-900 rounded-lg overflow-hidden shadow-lg">
      {isVideoActive ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted={isPublisher}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gray-800">
          <div className="text-center text-white">
            <div className="w-16 h-16 bg-gray-600 rounded-full mx-auto mb-2 flex items-center justify-center">
              <span className="text-2xl font-bold">
                {getUserName().charAt(0).toUpperCase()}
              </span>
            </div>
            <p className="text-sm">Camera Off</p>
          </div>
        </div>
      )}
      
      {/* 사용자 정보 오버레이 */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
        <div className="flex items-center justify-between text-white text-sm">
          <span className="font-medium">
            {getUserName()} {isPublisher && '(You)'}
          </span>
          <div className="flex space-x-2">
            {/* 오디오 상태 */}
            <div className={`w-4 h-4 rounded-full ${isAudioActive ? 'bg-green-500' : 'bg-red-500'}`} 
                 title={isAudioActive ? 'Audio On' : 'Audio Off'}>
            </div>
            {/* 비디오 상태 */}
            <div className={`w-4 h-4 rounded-full ${isVideoActive ? 'bg-green-500' : 'bg-red-500'}`}
                 title={isVideoActive ? 'Video On' : 'Video Off'}>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserVideo;