# Baba Yaga Is Calling - Детское AI приложение 📱

Мобильное приложение для голосовых звонков детей со сказочными персонажами.

## 🎯 Описание

MVP версия приложения с одним персонажем — Бабой Ягой.

**Основные возможности:**
- ✅ Ребёнок видит себя на экране (как в мессенджере)
- ✅ Баба Яга отвечает голосом в реальном времени
- ✅ Распознавание речи ребёнка (Whisper)
- ✅ AI-диалог через GigaChat
- ✅ Голосовой ответ через Silero TTS

## 🛠 Технологический стек

### Frontend
- **React Native** + **TypeScript**
- **Expo SDK 54**
- **Zustand** — состояние звонка
- **React Navigation** — навигация
- **expo-audio** — запись и воспроизведение аудио
- **expo-camera** — камера
- **i18next** — интернационализация (RU/EN)

### Backend
- **Python 3.12** + **FastAPI**
- **WebSocket** — реальное время
- **uv** — менеджер пакетов и виртуальное окружение

### AI Сервисы
- **GigaChat API** (Сбер) — генерация диалогов от лица персонажа
- **Whisper small** (OpenAI, open-source) — распознавание речи, работает локально
- **Silero TTS v3** (open-source) — синтез голоса, работает локально
- **ffmpeg** — конвертация аудио форматов (WebM → WAV)

## 📁 Структура проекта

```
Baba_Yaga_Is_Calling/
├── mobile/                   # React Native приложение
│   ├── src/
│   │   ├── screens/          # Экраны (Home, Call, Settings)
│   │   ├── services/         # WebSocket, AudioService
│   │   ├── store/            # Zustand store
│   │   ├── hooks/            # useCall
│   │   └── utils/            # Константы, i18n
│   ├── assets/
│   │   └── characters/       # Изображения персонажей
│   ├── App.tsx
│   └── package.json
│
├── backend/                  # Python сервер
│   ├── app/
│   │   ├── api/routes/       # REST + WebSocket endpoints
│   │   ├── services/         # AI сервисы
│   │   ├── models/           # Pydantic схемы
│   │   └── core/             # Конфигурация
│   ├── requirements.txt
│   └── main.py
│
└── docs/                     # Документация
```

## 🚀 Быстрый старт

### Backend
```bash
cd backend

# Создать виртуальное окружение (Python 3.12)
python -m uv venv .venv --python 3.12

# Активировать (Windows)
.venv\Scripts\Activate.ps1

# Установить зависимости
python -m uv pip install -r requirements.txt --python .venv\Scripts\python.exe

# Скопировать и заполнить .env
copy .env.example .env

# Запустить сервер
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Mobile
```bash
cd mobile
npm install
npx expo start --clear
```

## ⚙️ Настройка .env

```env
GIGACHAT_CLIENT_ID=ваш_client_id
GIGACHAT_AUTH_KEY=ваш_authorization_key
GIGACHAT_SCOPE=GIGACHAT_API_PERS
```

Authorization Key получить на [developers.sber.ru/studio](https://developers.sber.ru/studio).

## 🔄 Поток данных при звонке

```
Ребёнок говорит
    → expo-audio записывает аудио (WebM/WAV)
    → WebSocket отправляет base64 на бэкенд
    → ffmpeg конвертирует в WAV
    → Whisper STT распознаёт текст
    → GigaChat генерирует ответ от лица Бабы Яги
    → Silero TTS озвучивает ответ
    → WAV base64 возвращается на фронт
    → expo-audio воспроизводит голос Бабы Яги
```

## 💰 Монетизация (план)

- 2 бесплатных персонажа
- Покупка дополнительных персонажей
- Подписка на премиум контент

## 🌍 Мультиязычность

- 🇷🇺 Русский (реализован)
- 🇬🇧 English (планируется)

## 📄 Лицензия

MIT License

---

**Статус:** MVP работает  
**Версия:** 0.1.0-mvp
