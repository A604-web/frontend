// src/utils/constants.js
export const OPENVIDU_CONFIG = {
  SERVER_URL: "https://54.180.252.148:4443",
  SERVER_SECRET: "MY_SECRET",
  APPLICATION_NAME: 'OPENVIDUAPP'
};

export const API_ENDPOINTS = {
  SESSIONS: '/openvidu/api/sessions',
  CONNECTIONS: (sessionId) => `/openvidu/api/sessions/${sessionId}/connection`
};

export const MEDIA_CONSTRAINTS = {
  video: {
    width: { ideal: 1280 },
    height: { ideal: 720 },
    frameRate: { ideal: 15 }
  },
  audio: true
};