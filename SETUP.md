# Инструкция по запуску проекта

## 📋 Предварительные требования

### Для мобильной разработки:
- Node.js 18+ (https://nodejs.org/)
- npm или yarn
- Expo CLI (`npm install -g expo-cli`)
- Эмулятор Android/iOS или физическое устройство
- Expo Go приложение (для тестирования на телефоне)

### Для backend разработки:
- Python 3.10+ (https://www.python.org/)
- pip (менеджер пакетов Python)
- venv (виртуальное окружение)

---

## 🚀 Установка и запуск

### Шаг 1: Клонирование репозитория

```bash
cd c:\Users\KosMik\Projects\At_Work_Projects\Baba_Yaga_Is_Calling
```

### Шаг 2: Настройка Mobile приложения

```bash
cd mobile

# Установка зависимостей
npm install

# Запуск Expo
npx expo start
```

После запуска:
- Отсканируйте QR код через Expo Go (на телефоне)
- Или нажмите `a` для запуска на Android эмуляторе
- Или нажмите `i` для запуска на iOS симуляторе

### Шаг 3: Настройка Backend сервера

```bash
cd backend

# Создание виртуального окружения
python -m venv venv

# Активация виртуального окружения (Windows)
venv\Scripts\activate

# (Mac/Linux)
source venv/bin/activate

# Установка зависимостей
pip install -r requirements.txt

# Копирование .env.example в .env
copy .env.example .env   # Windows
# или
cp .env.example .env     # Mac/Linux
```

### Шаг 4: Получение API ключей

#### GigaChat API:
1. Зарегистрируйтесь на https://developers.sber.ru/
2. Создайте новый проект
3. Получите API ключ для GigaChat
4. Вставьте ключ в файл `backend/.env`:
   ```
   GIGACHAT_API_KEY=ваш_ключ
   ```

### Шаг 5: Запуск Backend сервера

```bash
cd backend

# Активация venv (если не активировано)
venv\Scripts\activate

# Запуск сервера
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Сервер запустится на http://localhost:8000

Документация API будет доступна на: http://localhost:8000/docs

---

## 🧪 Тестирование

### Проверка Backend

Откройте браузер и перейдите на:
- http://localhost:8000/health - проверка статуса
- http://localhost:8000/api/v1/characters/ - список персонажей
- http://localhost:8000/docs - Swagger документация

### Проверка Mobile

После запуска Expo:
1. Откройте Expo Go на телефоне
2. Отсканируйте QR код из терминала
3. Должен открыться главный экран со списком персонажей

---

## 📁 Структура проекта

```
Baba_Yaga_Is_Calling/
├── mobile/              # React Native приложение
│   ├── src/
│   │   ├── screens/    # Экраны приложения
│   │   ├── components/ # Компоненты
│   │   ├── services/   # API сервисы
│   │   └── utils/      # Утилиты
│   ├── assets/         # Ресурсы (картинки, звуки)
│   └── package.json
│
├── backend/            # Python сервер
│   ├── app/
│   │   ├── api/       # REST API и WebSocket
│   │   ├── services/  # AI сервисы
│   │   ├── models/    # Модели данных
│   │   └── core/      # Конфигурация
│   └── requirements.txt
│
└── docs/              # Документация
    ├── architecture.md
    └── development_log.md
```

---

## 🔧 Решение проблем

### Ошибка: "Cannot find module 'react-native'"

```bash
cd mobile
rm -rf node_modules package-lock.json
npm install
```

### Ошибка: "ModuleNotFoundError: No module named 'fastapi'"

```bash
cd backend
venv\Scripts\activate
pip install -r requirements.txt
```

### Ошибка: "Expo requires Node.js 18+"

Обновите Node.js до последней версии с https://nodejs.org/

### Ошибка: "Port 8000 is already in use"

```bash
# Windows
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:8000 | xargs kill -9
```

---

## 📝 Следующие шаги

После успешного запуска:

1. ✅ Протестировать отображение главного экрана
2. ✅ Проверить переход на экран звонка
3. ✅ Настроить GigaChat API ключи
4. ✅ Интегрировать Silero STT/TTS
5. ✅ Протестировать WebSocket соединение
6. ✅ Добавить изображение Бабы Яги в `mobile/assets/characters/`

---

## 🆘 Помощь

Если возникли проблемы:

1. Проверьте логи в консоли
2. Убедитесь, что все зависимости установлены
3. Проверьте, что порты не заняты
4. Убедитесь, что .env файл настроен правильно

---

**Версия:** 0.1.0-mvp  
**Дата обновления:** 25 марта 2026
