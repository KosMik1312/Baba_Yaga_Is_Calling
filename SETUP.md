# Инструкция по запуску проекта

## 📋 Предварительные требования

### Общее:
- Node.js 18+ — https://nodejs.org/
- Python 3.12 — https://www.python.org/
- uv (менеджер пакетов Python) — устанавливается через pip

### Для тестирования на телефоне:
- Expo Go приложение (Android/iOS)
- Телефон и компьютер в одной Wi-Fi сети

---

## 🚀 Установка и запуск

### Шаг 1: Клонирование репозитория

```bash
git clone https://github.com/KosMik1312/Baba_Yaga_Is_Calling.git
cd Baba_Yaga_Is_Calling
```

### Шаг 2: Настройка Backend

```bash
cd backend

# Установить uv (если не установлен)
pip install uv

# Установить Python 3.12 через uv
python -m uv python install 3.12

# Создать виртуальное окружение
python -m uv venv .venv --python 3.12

# Активировать (Windows PowerShell)
.venv\Scripts\Activate.ps1

# Активировать (Mac/Linux)
source .venv/bin/activate

# Установить зависимости
python -m uv pip install -r requirements.txt --python .venv\Scripts\python.exe

# Скопировать .env
copy .env.example .env   # Windows
cp .env.example .env     # Mac/Linux
```

### Шаг 3: Получение GigaChat API ключей

1. Зарегистрируйтесь на https://developers.sber.ru/studio
2. Создайте проект с GigaChat API
3. В разделе "Настройка API" скопируйте:
   - **Client ID**
   - **Authorization Key** (кнопка "Получить новый ключ")
4. Вставьте в `backend/.env`:
```env
GIGACHAT_CLIENT_ID=ваш_client_id
GIGACHAT_AUTH_KEY=ваш_authorization_key
GIGACHAT_SCOPE=GIGACHAT_API_PERS
```

### Шаг 4: Запуск Backend

```bash
cd backend
.venv\Scripts\Activate.ps1
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Сервер запустится на http://localhost:8000  
Swagger документация: http://localhost:8000/docs

> При первом запуске автоматически скачаются модели:
> - Whisper small (~244 MB) — распознавание речи
> - Silero TTS v3 (~100 MB) — синтез голоса

### Шаг 5: Настройка Mobile

Узнайте локальный IP вашего компьютера:
```bash
# Windows
ipconfig | findstr "IPv4"

# Mac/Linux
ifconfig | grep "inet "
```

Откройте `mobile/src/utils/constants.ts` и замените IP:
```ts
export const WS_CONFIG = {
  url: __DEV__
    ? 'ws://ВАШ_IP:8000/api/v1'  // например ws://192.168.0.102:8000/api/v1
    : 'wss://...',
};
```

### Шаг 6: Запуск Mobile

```bash
cd mobile
npm install
npx expo start --clear
```

- Отсканируйте QR код через Expo Go на телефоне
- Или нажмите `w` для запуска в браузере

---

## 🧪 Проверка работы

### Backend:
- http://localhost:8000/health — статус сервера
- http://localhost:8000/api/v1/characters/ — список персонажей
- http://localhost:8000/docs — Swagger UI

### Полный пайплайн (тест без фронта):
```bash
cd backend
.venv\Scripts\python.exe test_pipeline.py
```

---

## 🔧 Решение проблем

### "Port 8000 is already in use"
```bash
# Windows
netstat -ano | findstr :8000
taskkill /PID <PID> /F
```

### "Cannot find module"
```bash
cd mobile
rm -rf node_modules
npm install
npx expo start --clear
```

### Модели не скачиваются
Проверьте интернет-соединение. Модели кэшируются в `~/.cache/torch/hub/` и скачиваются только один раз.

---

**Версия:** 0.1.0-mvp
