# Archive — MVP v0.1.0 (Expo)

Первая версия проекта на Expo SDK 54.

## Что работало:
- React Native + Expo (web + mobile через Expo Go)
- FastAPI + WebSocket
- Whisper STT + GigaChat + Silero TTS
- Полный голосовой пайплайн

## Почему архивировано:
Принято решение переписать приложение на React Native CLI
для полноценной нативной сборки под Android/iOS.
STT переносится на устройство (whisper.rn).

## Как запустить (если нужно):
```bash
# Backend
cd backend
python -m uv venv .venv --python 3.12
python -m uv pip install -r requirements.txt --python .venv\Scripts\python.exe
.venv\Scripts\Activate.ps1
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# Mobile
cd mobile
npm install
npx expo start --clear
```
