// src/pages/Home.js
import React, { useState } from 'react';
import { Video, Users, Settings } from 'lucide-react';
import Button from '../components/common/Button';
import Input from '../components/common/Input';

const Home = ({ onJoinSession, isLoading, error, onTestConnection }) => {
  const [sessionId, setSessionId] = useState('');
  const [userName, setUserName] = useState('');
  const [formErrors, setFormErrors] = useState({});

  const validateForm = () => {
    const errors = {};
    
    if (!sessionId.trim()) {
      errors.sessionId = 'Session ID is required';
    } else if (sessionId.length < 3) {
      errors.sessionId = 'Session ID must be at least 3 characters';
    }
    
    if (!userName.trim()) {
      errors.userName = 'User name is required';
    } else if (userName.length < 2) {
      errors.userName = 'User name must be at least 2 characters';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onJoinSession(sessionId.trim(), userName.trim());
    }
  };

  const generateRandomSessionId = () => {
    const randomId = Math.random().toString(36).substring(2, 8);
    setSessionId(`room-${randomId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Video className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            OpenVidu Video Call
          </h1>
          <p className="text-gray-600 text-sm">
            Enter a session ID and your name to join a video call
          </p>
        </div>

        {/* 에러 메시지 */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-6">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {/* 참가 폼 */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Input
              label="Session ID"
              value={sessionId}
              onChange={(e) => setSessionId(e.target.value)}
              placeholder="Enter session ID (e.g., room-123)"
              required
              error={formErrors.sessionId}
              disabled={isLoading}
            />
            <Button
              type="button"
              onClick={generateRandomSessionId}
              variant="secondary"
              size="small"
              className="w-full mt-2"
              disabled={isLoading}
            >
              Generate Random ID
            </Button>
          </div>

          <Input
            label="Your Name"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="Enter your display name"
            required
            error={formErrors.userName}
            disabled={isLoading}
          />

          <Button
            type="submit"
            variant="primary"
            size="large"
            className="w-full flex items-center justify-center space-x-2"
            disabled={isLoading || !sessionId.trim() || !userName.trim()}
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <>
                <Users className="w-5 h-5" />
                <span>Join Session</span>
              </>
            )}
          </Button>
        </form>

        {/* 추가 옵션 */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <Button
            onClick={onTestConnection}
            variant="secondary"
            size="medium"
            className="w-full flex items-center justify-center space-x-2"
            disabled={isLoading}
          >
            <Settings className="w-4 h-4" />
            <span>Test Connection</span>
          </Button>
          
          <div className="mt-4 text-center text-xs text-gray-500">
            <p>Make sure camera and microphone permissions are enabled</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;