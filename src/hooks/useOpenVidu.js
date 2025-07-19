// src/hooks/useOpenVidu.js
import { useState, useEffect, useCallback } from 'react';
import { OpenVidu } from 'openvidu-browser';
import openviduService from '../services/openviduService';
import { MEDIA_CONSTRAINTS } from '../utils/constants';

export const useOpenVidu = () => {
  const [openVidu, setOpenVidu] = useState(null);
  const [session, setSession] = useState(null);
  const [publisher, setPublisher] = useState(null);
  const [subscribers, setSubscribers] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(true);

  // OpenVidu 초기화
  useEffect(() => {
    const ov = new OpenVidu();
    setOpenVidu(ov);
    
    return () => {
      if (session) {
        session.disconnect();
      }
    };
  }, []);

  // 세션 참가
  const joinSession = useCallback(async (sessionId, userName) => {
    if (!openVidu) return;

    setIsLoading(true);
    setError(null);

    try {
      // 토큰 획득
      const token = await openviduService.joinSession(sessionId);

      // 세션 초기화
      const newSession = openVidu.initSession();
      setSession(newSession);

      // 이벤트 리스너 설정
      setupSessionEvents(newSession);

      // 세션 연결
      await newSession.connect(token, { clientData: userName });

      // Publisher 생성
      const newPublisher = await openVidu.initPublisherAsync(undefined, {
        audioSource: undefined,
        videoSource: undefined,
        publishAudio: audioEnabled,
        publishVideo: videoEnabled,
        resolution: `${MEDIA_CONSTRAINTS.video.width.ideal}x${MEDIA_CONSTRAINTS.video.height.ideal}`,
        frameRate: MEDIA_CONSTRAINTS.video.frameRate.ideal,
        insertMode: 'APPEND',
        mirror: false
      });

      // Publisher 이벤트 설정
      setupPublisherEvents(newPublisher);

      // Publisher 발행
      await newSession.publish(newPublisher);
      setPublisher(newPublisher);
      setIsConnected(true);

    } catch (error) {
      console.error('Error joining session:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  }, [openVidu, audioEnabled, videoEnabled]);

  // 세션 나가기
  const leaveSession = useCallback(() => {
    if (session) {
      session.disconnect();
    }
    
    setSession(null);
    setPublisher(null);
    setSubscribers([]);
    setIsConnected(false);
    setError(null);
  }, [session]);

  // 세션 이벤트 설정
  const setupSessionEvents = (session) => {
    // 새 스트림 구독
    session.on('streamCreated', (event) => {
      const subscriber = session.subscribe(event.stream, undefined);
      setupSubscriberEvents(subscriber);
      
      setSubscribers(prev => [...prev, subscriber]);
    });

    // 스트림 삭제
    session.on('streamDestroyed', (event) => {
      setSubscribers(prev => 
        prev.filter(sub => sub.stream.streamId !== event.stream.streamId)
      );
    });

    // 세션 종료
    session.on('sessionDisconnected', (event) => {
      setIsConnected(false);
      setSession(null);
      setPublisher(null);
      setSubscribers([]);
    });

    // 예외 처리
    session.on('exception', (exception) => {
      console.error('Session exception:', exception);
      setError(exception.message);
    });
  };

  // Publisher 이벤트 설정
  const setupPublisherEvents = (publisher) => {
    publisher.on('accessAllowed', () => {
      console.log('Camera and microphone access allowed');
    });

    publisher.on('accessDenied', () => {
      console.error('Camera and microphone access denied');
      setError('Camera and microphone access denied');
    });
  };

  // Subscriber 이벤트 설정
  const setupSubscriberEvents = (subscriber) => {
    subscriber.on('videoElementCreated', (event) => {
      console.log('Video element created for subscriber');
    });
  };

  // 오디오 토글
  const toggleAudio = useCallback(() => {
    if (publisher) {
      publisher.publishAudio(!audioEnabled);
      setAudioEnabled(!audioEnabled);
    }
  }, [publisher, audioEnabled]);

  // 비디오 토글
  const toggleVideo = useCallback(() => {
    if (publisher) {
      publisher.publishVideo(!videoEnabled);
      setVideoEnabled(!videoEnabled);
    }
  }, [publisher, videoEnabled]);

  // 연결 테스트
  const testConnection = useCallback(async () => {
    try {
      await openviduService.testConnection();
      return true;
    } catch (error) {
      setError(error.message);
      return false;
    }
  }, []);

  return {
    // 상태
    session,
    publisher,
    subscribers,
    isConnected,
    isLoading,
    error,
    audioEnabled,
    videoEnabled,
    
    // 액션
    joinSession,
    leaveSession,
    toggleAudio,
    toggleVideo,
    testConnection,
    
    // 유틸
    clearError: () => setError(null)
  };
};