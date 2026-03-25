// Константы приложения
export const APP_NAME = 'Baba Yaga Is Calling';
export const APP_VERSION = '0.1.0-mvp';

// Персонажи MVP
export const CHARACTERS = {
  BABA_YAGA: {
    id: 'baba_yaga',
    name: 'Баба Яга',
    nameEn: 'Baba Yaga',
    description: 'Волшебница из сказок',
    descriptionEn: 'The magic witch from fairy tales',
    isFree: true,
    avatar: require('../../assets/characters/baba_yaga.png'),
    voiceModel: 'baba_yaga_v1',
    personality: 'добрая, мудрая, любит загадывать загадки',
    personalityEn: 'kind, wise, loves to ask riddles',
  },
} as const;

// Настройки экспозиции
export const EXPO_CONFIG = {
  slug: 'baba-yaga-is-calling',
  name: 'Baba Yaga Is Calling',
  version: '0.1.0',
  orientation: 'portrait' as const,
  sdkVersion: '50.0.0',
};

// API конфигурация
export const API_CONFIG = {
  baseUrl: __DEV__
    ? 'http://192.168.0.102:8000'
    : 'https://api.babayaga-calling.ru',
  timeout: 10000,
  endpoints: {
    call: '/api/v1/call',
    characters: '/api/v1/characters',
    users: '/api/v1/users',
  },
};

// Silero конфигурация
export const SILERO_CONFIG = {
  sttModel: 'v3_1_ru',
  ttsModel: 'v3_1_ru',
  sampleRate: 16000,
  language: 'ru',
};

// GigaChat конфигурация  
export const GIGACHAT_CONFIG = {
  apiKey: process.env.GIGACHAT_API_KEY || '',
  model: 'GigaChat',
  maxTokens: 200,
  temperature: 0.7,
};

// WebSocket конфигурация
export const WS_CONFIG = {
  url: __DEV__
    ? 'ws://192.168.0.102:8000/api/v1'
    : 'wss://api.babayaga-calling.ru/api/v1',
  reconnectInterval: 3000,
  maxReconnectAttempts: 5,
};

// Возрастные группы
export const AGE_GROUPS = {
  TODDLERS: { min: 3, max: 6, name: 'Дошкольники' },
  JUNIOR: { min: 7, max: 10, name: 'Младшие школьники' },
  TEENS: { min: 11, max: 14, name: 'Подростки' },
} as const;
