// src/services/openviduService.js
import { OPENVIDU_CONFIG, API_ENDPOINTS } from '../utils/constants';

class OpenViduService {
  constructor() {
    this.baseURL = OPENVIDU_CONFIG.SERVER_URL;
    this.secret = OPENVIDU_CONFIG.SERVER_SECRET;
    this.applicationName = OPENVIDU_CONFIG.APPLICATION_NAME;
  }

  // Base64 인코딩된 인증 헤더 생성
  getAuthHeader() {
    return `Basic ${btoa(`${this.applicationName}:${this.secret}`)}`;
  }

  // 공통 fetch 옵션
  getRequestOptions(method = 'GET', body = null) {
    const options = {
      method,
      headers: {
        'Authorization': this.getAuthHeader(),
        'Content-Type': 'application/json'
      }
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    return options;
  }

  // 세션 생성
  async createSession(sessionId) {
    try {
      const response = await fetch(
        `${this.baseURL}${API_ENDPOINTS.SESSIONS}`,
        this.getRequestOptions('POST', { customSessionId: sessionId })
      );

      // 성공적으로 새 세션 생성
      if (response.ok) {
        const session = await response.json();
        console.log('New session created:', session);
        return session;
      }
      
      // 이미 존재하는 세션 (409)
      if (response.status === 409) {
        console.log('Session already exists, fetching existing session info');
        
        // 기존 세션 정보 조회
        const existingResponse = await fetch(
          `${this.baseURL}/openvidu/api/sessions/${sessionId}`,
          this.getRequestOptions('GET')
        );
        
        if (existingResponse.ok) {
          const existingSession = await existingResponse.json();
          console.log('Existing session found:', existingSession);
          return existingSession;
        } else {
          // 세션 정보 조회 실패 시 최소한의 정보만 반환
          return { id: sessionId };
        }
      }
      
      // 기타 에러
      throw new Error(`Session creation failed: ${response.status}`);

    } catch (error) {
      // 409는 이미 존재하는 세션이므로 정상
      if (error.message.includes('409')) {
        return { id: sessionId };
      }
      console.error('Error creating session:', error);
      throw error;
    }
  }

  // 토큰 생성
  async createToken(sessionId, role = 'PUBLISHER') {
    try {
      const response = await fetch(
        `${this.baseURL}${API_ENDPOINTS.CONNECTIONS(sessionId)}`,
        this.getRequestOptions('POST', { role })
      );

      if (!response.ok) {
        throw new Error(`Token creation failed: ${response.status}`);
      }

      const connection = await response.json();
      console.log('Token created:', connection.token);
      return connection.token;
    } catch (error) {
      console.error('Error creating token:', error);
      throw error;
    }
  }

  // 세션 참가
  async joinSession(sessionId) {
    try {
      // 세션 생성 시도 (이미 존재하면 409 에러, 무시)
      await this.createSession(sessionId);

      // 토큰 생성
      const token = await this.createToken(sessionId);
      return token;
    } catch (error) {
      console.error('Error joining session:', error);
      throw error;
    }
  }

  // 서버 연결 테스트
  async testConnection() {
    try {
      const response = await fetch(
        `${this.baseURL}/openvidu/api/config`,
        this.getRequestOptions('GET')
      );

      if (!response.ok) {
        throw new Error(`Connection test failed: ${response.status}`);
      }

      const config = await response.json();
      console.log('OpenVidu server connected:', config);
      return config;
    } catch (error) {
      console.error('Error testing connection:', error);
      throw error;
    }
  }
}

export default new OpenViduService();