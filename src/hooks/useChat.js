// src/hooks/useChat.js
import { useState, useEffect, useCallback } from 'react';

const useChat = (session, currentUser) => {
  const [messages, setMessages] = useState([]);
  const [isConnected, setIsConnected] = useState(false);

  // OpenVidu 세션 연결 상태 확인
  useEffect(() => {
    if (session) {
      setIsConnected(true);
      
      // 채팅 메시지 수신 리스너
      const handleChatSignal = (event) => {
        try {
          const messageData = JSON.parse(event.data);
          const newMessage = {
            id: `${messageData.timestamp}-${messageData.sender}`,
            text: messageData.text,
            sender: messageData.sender,
            timestamp: messageData.timestamp
          };
          
          setMessages(prevMessages => [...prevMessages, newMessage]);
        } catch (error) {
          console.error('채팅 메시지 파싱 오류:', error);
        }
      };

      // 사용자 입장/퇴장 알림
      const handleUserJoined = (event) => {
        const userData = JSON.parse(event.data);
        const systemMessage = {
          id: `system-${Date.now()}`,
          text: `${userData.clientData}님이 입장하셨습니다.`,
          sender: 'system',
          timestamp: Date.now(),
          isSystem: true
        };
        setMessages(prevMessages => [...prevMessages, systemMessage]);
      };

      const handleUserLeft = (event) => {
        const userData = JSON.parse(event.data);
        const systemMessage = {
          id: `system-${Date.now()}`,
          text: `${userData.clientData}님이 퇴장하셨습니다.`,
          sender: 'system',
          timestamp: Date.now(),
          isSystem: true
        };
        setMessages(prevMessages => [...prevMessages, systemMessage]);
      };

      // 이벤트 리스너 등록
      session.on('signal:chat', handleChatSignal);
      session.on('signal:user-joined', handleUserJoined);
      session.on('signal:user-left', handleUserLeft);

      // 컴포넌트 언마운트 시 리스너 제거
      return () => {
        session.off('signal:chat', handleChatSignal);
        session.off('signal:user-joined', handleUserJoined);
        session.off('signal:user-left', handleUserLeft);
      };
    } else {
      setIsConnected(false);
      setMessages([]); // 세션이 없으면 메시지 초기화
    }
  }, [session]);

  // 메시지 전송 함수
  const sendMessage = useCallback((messageText) => {
    if (!session || !messageText.trim() || !currentUser) {
      console.warn('메시지 전송 실패: 세션, 메시지 내용 또는 사용자 정보가 없습니다.');
      return Promise.reject('Invalid parameters');
    }

    const messageData = {
      text: messageText.trim(),
      sender: currentUser,
      timestamp: Date.now()
    };

    // OpenVidu signal을 통해 메시지 전송
    return session.signal({
      type: 'chat',
      data: JSON.stringify(messageData),
      to: [] // 모든 참가자에게 전송
    })
    .then(() => {
      console.log('메세지 전송 성공');
    })
    .catch(error => {
      console.error('메시지 전송 실패:', error);
      throw error;
    });
  }, [session, currentUser]);

  // 시스템 메시지 추가 함수 (선택사항)
  const addSystemMessage = useCallback((text) => {
    const systemMessage = {
      id: `system-${Date.now()}-${Math.random()}`,
      text,
      sender: 'system',
      timestamp: Date.now(),
      isSystem: true
    };
    setMessages(prevMessages => [...prevMessages, systemMessage]);
  }, []);

  // 채팅 기록 삭제
  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  return {
    messages,
    sendMessage,
    addSystemMessage,
    clearMessages,
    isConnected,
    messageCount: messages.length
  };
};

export default useChat;