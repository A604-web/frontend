// src/components/video/Controls.js
import React from 'react';
import { Mic, MicOff, Video, VideoOff, Phone } from 'lucide-react';
import Button from '../common/Button';

const Controls = ({
  audioEnabled,
  videoEnabled,
  onToggleAudio,
  onToggleVideo,
  onLeaveSession,
  disabled = false
}) => {
  return (
    <div className="flex justify-center space-x-4 p-4 bg-gray-800 rounded-lg">
      {/* 오디오 토글 */}
      <Button
        onClick={onToggleAudio}
        variant={audioEnabled ? 'success' : 'danger'}
        size="large"
        disabled={disabled}
        className="flex items-center space-x-2"
      >
        {audioEnabled ? <Mic size={20} /> : <MicOff size={20} />}
        <span>{audioEnabled ? 'Mute' : 'Unmute'}</span>
      </Button>

      {/* 비디오 토글 */}
      <Button
        onClick={onToggleVideo}
        variant={videoEnabled ? 'success' : 'danger'}
        size="large"
        disabled={disabled}
        className="flex items-center space-x-2"
      >
        {videoEnabled ? <Video size={20} /> : <VideoOff size={20} />}
        <span>{videoEnabled ? 'Stop Video' : 'Start Video'}</span>
      </Button>

      {/* 세션 나가기 */}
      <Button
        onClick={onLeaveSession}
        variant="danger"
        size="large"
        disabled={disabled}
        className="flex items-center space-x-2"
      >
        <Phone size={20} />
        <span>Leave</span>
      </Button>
    </div>
  );
};

export default Controls;