# Архитектура приложения

## Общая схема

```
┌─────────────────────────────────────────────────┐
│         Mobile App (React Native + Expo)        │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────┐ │
│  │   Camera    │  │   Audio     │  │   UI/   │ │
│  │   (Selfie)  │  │   Capture   │  │   UX    │ │
│  └─────────────┘  └─────────────┘  └─────────┘ │
└─────────────────────────────────────────────────┘
                      ↕ WebSocket
┌─────────────────────────────────────────────────┐
│         Backend (Python + FastAPI)              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────┐ │
│  │   WebSocket │  │   AI        │  │   User  │ │
│  │   Handler   │  │   Pipeline  │  │   Mgmt  │ │
│  └─────────────┘  └─────────────┘  └─────────┘ │
└─────────────────────────────────────────────────┘
                      ↕
┌─────────────────────────────────────────────────┐
│            AI Services                          │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────┐ │
│  │   Silero    │  │  GigaChat   │  │ Silero  │ │
│  │   STT       │  │   (LLM)     │  │   TTS   │ │
│  └─────────────┘  └─────────────┘  └─────────┘ │
└─────────────────────────────────────────────────┘
```

## Поток данных при звонке

1. **Ребёнок нажимает "Позвонить"** → открывается экран звонка
2. **Камера включается** → ребёнок видит себя
3. **Ребёнок говорит** → аудио записывается
4. **Audio → Backend (WebSocket)** → Silero STT → текст
5. **Текст → GigaChat** → контекст + имя ребёнка → ответ текстом
6. **Ответ → Silero TTS** → голос Бабы Яги
7. **Аудио ответа → Мобильное приложение** → воспроизведение
8. **Баба Яга "говорит"** → минимальная анимация картинки

## Структура файлов

### Mobile (React Native)

```
mobile/
├── src/
│   ├── components/
│   │   ├── CharacterCard.tsx       # Карточка персонажа
│   │   ├── VideoPreview.tsx        # Предпросмотр камеры
│   │   ├── AudioVisualizer.tsx     # Визуализация звука
│   │   └── LoadingSpinner.tsx      # Индикатор загрузки
│   │
│   ├── screens/
│   │   ├── HomeScreen.tsx          # Главный экран (список персонажей)
│   │   ├── CallScreen.tsx          # Экран звонка
│   │   └── SettingsScreen.tsx      # Настройки (родительский контроль)
│   │
│   ├── services/
│   │   ├── api.ts                  # REST API клиент
│   │   ├── websocket.ts            # WebSocket соединение
│   │   └── audioService.ts         # Работа с аудио
│   │
│   ├── store/
│   │   ├── useAppStore.ts          # Zustand store
│   │   └── slices/
│   │       ├── callSlice.ts        # Состояние звонка
│   │       └── userSlice.ts        # Пользовательские настройки
│   │
│   ├── hooks/
│   │   ├── useAudioRecorder.ts     # Хук записи аудио
│   │   ├── useWebSocket.ts         # Хук WebSocket
│   │   └── useCamera.ts            # Хук камеры
│   │
│   ├── utils/
│   │   ├── constants.ts            # Константы
│   │   ├── i18n.ts                 # Интернационализация
│   │   └── helpers.ts              # Утилиты
│   │
│   └── types/
│       └── index.ts                # TypeScript типы
│
├── assets/
│   ├── characters/
│   │   └── baba_yaga.png           # Изображение Бабы Яги
│   ├── sounds/
│   │   └── call_sound.mp3          # Звук звонка
│   └── images/
│       └── logo.png                # Логотип
│
├── App.tsx                         # Точка входа
├── app.json                        # Expo конфигурация
├── package.json                    # Зависимости
├── tsconfig.json                   # TypeScript конфиг
├── babel.config.js                 # Babel конфиг
└── .eslintrc.js                    # ESLint конфиг
```

### Backend (Python)

```
backend/
├── app/
│   ├── api/
│   │   ├── routes/
│   │   │   ├── calls.py            # Эндпоинты звонков
│   │   │   ├── users.py            # Эндпоинты пользователей
│   │   │   └── characters.py       # Эндпоинты персонажей
│   │   └── websocket/
│   │       └── call_handler.py     # WebSocket обработчик
│   │
│   ├── services/
│   │   ├── ai_service.py           # AI пайплайн
│   │   ├── gigachat_client.py      # GigaChat клиент
│   │   ├── silero_stt.py           # Silero STT клиент
│   │   ├── silero_tts.py           # Silero TTS клиент
│   │   └── character_service.py    # Логика персонажей
│   │
│   ├── models/
│   │   ├── user.py                 # Модель пользователя
│   │   ├── character.py            # Модель персонажа
│   │   └── call.py                 # Модель звонка
│   │
│   ├── core/
│   │   ├── config.py               # Конфигурация
│   │   └── database.py             # БД подключение
│   │
│   └── db/
│       └── repositories.py         # Репозитории
│
├── main.py                         # Точка входа FastAPI
├── requirements.txt                # Python зависимости
└── .env.example                    # Пример переменных окружения
```

## Технологические детали

### Frontend ключевые библиотеки

```json
{
  "expo": "~50.0.0",
  "react-native-webrtc": "^118.0.0",
  "expo-av": "~13.10.0",
  "expo-camera": "~14.0.0",
  "zustand": "^4.5.0",
  "i18next": "^23.8.2",
  "axios": "^1.6.7"
}
```

### Backend ключевые библиотеки

```txt
fastapi==0.109.0
uvicorn[standard]==0.27.0
websockets==12.0
python-multipart==0.0.6
pydantic==2.5.3
aiohttp==3.9.1
silero-models==0.1.0
```

## Безопасность

- JWT токены для аутентификации
- Родительский контроль (PIN код)
- Шифрование данных детей
- Соответствие 152-ФЗ

## Масштабируемость

- MVP: SQLite + один сервер
- Продакшен: PostgreSQL + Redis + балансировщик
- CDN для статики (изображения персонажей)
- Kubernetes для оркестрации
