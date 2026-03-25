# Архитектура приложения

## Общая схема

```
┌─────────────────────────────────────────────────┐
│         Mobile App (React Native + Expo)        │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────┐ │
│  │   Camera    │  │ expo-audio  │  │   UI/   │ │
│  │  (Selfie)   │  │  Recorder   │  │   UX    │ │
│  └─────────────┘  └─────────────┘  └─────────┘ │
└─────────────────────────────────────────────────┘
                      ↕ WebSocket (base64 audio)
┌─────────────────────────────────────────────────┐
│         Backend (Python + FastAPI)              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────┐ │
│  │   WebSocket │  │   AI        │  │  ffmpeg │ │
│  │   Handler   │  │   Pipeline  │  │ convert │ │
│  └─────────────┘  └─────────────┘  └─────────┘ │
└─────────────────────────────────────────────────┘
                      ↕
┌─────────────────────────────────────────────────┐
│            AI Services (локально)               │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────┐ │
│  │   Whisper   │  │  GigaChat   │  │ Silero  │ │
│  │   STT       │  │   (LLM)     │  │   TTS   │ │
│  │  (OpenAI)   │  │   (Сбер)    │  │  (v3)   │ │
│  └─────────────┘  └─────────────┘  └─────────┘ │
└─────────────────────────────────────────────────┘
```

## Поток данных при звонке

1. **Ребёнок нажимает кнопку 🎤** → начинается запись микрофона
2. **Нажимает снова** → запись останавливается
3. **expo-audio** → аудио файл (WebM на вебе, WAV на мобильных)
4. **base64 → WebSocket → бэкенд**
5. **ffmpeg** конвертирует WebM/любой формат → WAV 16kHz моно
6. **Whisper small** распознаёт русскую речь → текст
7. **GigaChat API** генерирует ответ от лица Бабы Яги (с историей диалога)
8. **Silero TTS v3** синтезирует голос → WAV
9. **base64 WAV → WebSocket → фронт**
10. **expo-audio** воспроизводит голос Бабы Яги

## Структура файлов

### Mobile (React Native)

```
mobile/src/
├── screens/
│   ├── HomeScreen.tsx       # Список персонажей
│   ├── CallScreen.tsx       # Экран звонка (камера + кнопка микрофона)
│   └── SettingsScreen.tsx   # Настройки
│
├── services/
│   ├── websocket.ts         # WebSocket клиент
│   └── audioService.ts      # Запись и воспроизведение (expo-audio)
│
├── store/
│   └── useCallStore.ts      # Zustand: статус звонка, тексты
│
├── hooks/
│   └── useCall.ts           # Логика звонка (запись → отправка → воспроизведение)
│
└── utils/
    ├── constants.ts         # API URL, конфиги персонажей
    └── i18n.ts              # Переводы RU/EN
```

### Backend (Python)

```
backend/
├── app/
│   ├── api/routes/
│   │   ├── calls.py         # WebSocket endpoint + REST
│   │   ├── characters.py    # Список персонажей
│   │   └── users.py         # Пользователи
│   │
│   ├── services/
│   │   ├── ai_service.py    # Оркестратор: STT → GigaChat → TTS
│   │   ├── gigachat_client.py  # GigaChat SDK клиент
│   │   ├── silero_stt.py    # Whisper STT (faster-whisper)
│   │   └── silero_tts.py    # Silero TTS v3
│   │
│   └── core/
│       └── config.py        # Настройки из .env
│
├── main.py
└── requirements.txt
```

## Технологический стек

### Frontend
| Библиотека | Версия | Назначение |
|---|---|---|
| expo | ~54.0.0 | Платформа |
| react-native | 0.81.5 | UI фреймворк |
| expo-audio | ~0.4.0 | Запись и воспроизведение |
| expo-camera | ~17.0.10 | Камера |
| zustand | ^5.0.3 | Состояние |
| react-navigation | ^7.0 | Навигация |

### Backend
| Библиотека | Версия | Назначение |
|---|---|---|
| fastapi | 0.115.6 | Web фреймворк |
| faster-whisper | 1.2.1 | STT (Whisper small) |
| torch + silero | 2.11.0 | TTS |
| gigachat | 0.2.0 | GigaChat SDK |
| imageio-ffmpeg | 0.6.0 | Конвертация аудио |

## WebSocket протокол

### Клиент → Сервер:
```json
{ "type": "start_call", "child_name": "Вася" }
{ "type": "audio_chunk", "data": "<base64 audio>" }
{ "type": "end_call" }
```

### Сервер → Клиент:
```json
{ "type": "call_started", "character_id": 1, "status": "connected" }
{ "type": "processing" }
{ "type": "response", "recognized_text": "...", "response_text": "...", "audio": "<base64 wav>" }
{ "type": "call_ended" }
{ "type": "error", "message": "..." }
```

## Масштабируемость

- **MVP:** SQLite + один сервер, модели в памяти
- **Продакшен:** PostgreSQL + Redis + несколько воркеров
- **Модели:** можно вынести на GPU сервер для ускорения
