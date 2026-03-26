# Baba Yaga Is Calling 📱

Детское мобильное приложение — голосовые звонки со сказочными персонажами.

## Статус

| Версия | Статус | Описание |
|---|---|---|
| v0.1.0 MVP | ✅ Архив | Expo + бэкенд пайплайн |
| v0.2.0 | ✅ Готово | React Native CLI + серверный STT |

## Архитектура v0.2.0

```
Устройство (React Native CLI):
    → Запись речи (react-native-audio-recorder-player)
    → отправка WAV на бэкенд
    ← текст от бэкенда
    → GigaChat API (rn-fetch-blob)
    ← текст ответа
    → TTS на устройстве (react-native-tts)
    → воспроизведение

Бэкенд (FastAPI):
    → faster-whisper (small model, CPU)
    → STT endpoint: POST /api/v1/stt
```

## Структура проекта

```
Baba_Yaga_Is_Calling/
├── _archive/       # MVP v0.1.0 на Expo (для справки)
├── app/            # React Native CLI приложение
│   ├── android/    # Android нативный код
│   ├── ios/        # iOS нативный код (не настроен)
│   └── src/
│       ├── screens/      # CallScreen, HomeScreen
│       ├── hooks/        # useAudioRecorder, useTTS
│       └── services/     # gigachat.ts, backendSTT.ts (не в git)
├── backend/        # FastAPI сервер
│   ├── main.py           # STT endpoint с faster-whisper
│   └── requirements.txt
└── docs/           # Документация
```

## Быстрый старт

### 1. Бэкенд

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate  # Windows
source .venv/bin/activate  # Linux/Mac
pip install -r requirements.txt
python main.py  # Запуск на http://0.0.0.0:8000
```

### 2. Мобильное приложение

```bash
cd app
npm install

# Создай файлы с ключами (см. .env.example):
# src/services/gigachat.ts - GigaChat API ключ
# src/services/backendSTT.ts - IP адрес бэкенда

# Android
npx react-native run-android

# iOS (не настроен)
npx react-native run-ios
```

## Технологии

**Frontend:**
- React Native 0.78.1 (CLI, не Expo)
- TypeScript
- react-navigation 6.x
- react-native-audio-recorder-player (запись)
- react-native-tts (синтез речи)
- rn-fetch-blob (HTTP с SSL bypass)

**Backend:**
- FastAPI 0.115.6
- faster-whisper 1.1.1 (small model)
- uvicorn

**AI:**
- GigaChat API (Сбер) - диалоги
- faster-whisper small - распознавание речи

## Особенности реализации

### Xiaomi MIUI
На устройствах Xiaomi используется `AudioSource.VOICE_COMMUNICATION` (7) вместо `MIC` (1) из-за ограничений MIUI.

### SSL Bypass
GigaChat требует `trusty: true` в rn-fetch-blob для игнорирования самоподписанных сертификатов.

### Формат аудио
WAV PCM 16kHz mono - совместимо с faster-whisper без конвертации.

## Производительность

- **Запись:** мгновенно
- **STT (бэкенд):** ~1-2 сек (CPU)
- **GigaChat:** ~1-2 сек
- **TTS:** мгновенно (нативный)
- **Итого:** ~2-4 сек на полный цикл

## Roadmap

- [ ] iOS поддержка
- [ ] Больше персонажей
- [ ] Авторизация / регистрация
- [ ] Платежи (подписка)
- [ ] Аналитика
- [ ] GPU ускорение STT на бэкенде

## Лицензия

MIT License
