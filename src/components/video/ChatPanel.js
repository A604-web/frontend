// src/components/video/ChatPanel.js
import React, { useState, useRef, useEffect } from 'react';

const ChatPanel = ({ messages = [], onSendMessage, currentUser, onClose, isConnected = true }) => {
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // 메시지가 업데이트될 때마다 스크롤을 맨 아래로
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 컴포넌트 마운트 시 입력 필드에 포커스
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputMessage.trim() && onSendMessage) {
      onSendMessage({
        text: inputMessage.trim(),
        sender: currentUser,
        timestamp: Date.now(),
        id: Date.now() + Math.random() // 임시 ID
      });
      setInputMessage('');
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isMyMessage = (message) => {
    return message.sender === currentUser;
  };

  return (
    <div className="h-full bg-gray-800 flex flex-col">
      {/* 채팅 헤더 */}
      <div className="p-4 border-b border-gray-700 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <h3 className="text-white font-semibold">Chat</h3>
          <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white transition-colors"
          aria-label="Close chat"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* 메시지 영역 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 ? (
          <div className="text-center text-gray-400 text-sm mt-8">
            채팅을 시작해보세요!
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id || message.timestamp}
              className={`flex ${isMyMessage(message) ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-3 py-2 rounded-lg ${
                  message.isSystem
                    ? 'bg-gray-600 text-gray-300 text-center text-sm mx-auto'
                    : isMyMessage(message)
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-100'
                }`}
              >
                {!isMyMessage(message) && (
                  <div className="text-xs text-gray-300 mb-1 font-medium">
                    {message.sender}
                  </div>
                )}
                  <div className="break-words">{message.text}</div>
                  {message.isSystem ? (
                    <div className="text-xs text-center text-gray-400 mt-1">
                      {formatTime(message.timestamp)}
                    </div>
                  ) : (
                    <div
                      className={`text-xs mt-1 ${
                        isMyMessage(message) ? 'text-blue-200' : 'text-gray-400'
                      }`}
                    >
                      {formatTime(message.timestamp)}
                    </div>
                  )}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* 메시지 입력 영역 */}
      <div className="p-4 border-t border-gray-700">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="메시지를 입력하세요..."
            className="flex-1 bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
            maxLength={500}
          />
          <button
            type="submit"
            disabled={!inputMessage.trim() || !isConnected}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-4 py-2 rounded transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatPanel;