# Баба Яга Звонит — Инструкция по запуску

## Перед первым запуском

### 1. Скачать модель Whisper
Скачай модель `ggml-tiny.bin` (~75MB) для русского языка:
- [Ссылка на модели](https://huggingface.co/ggerganov/whisper.cpp/tree/main)
- Положи файл в `android/app/src/main/assets/ggml-tiny.bin`

Создай папку, если её нет:
```bash
mkdir -p android/app/src/main/assets
```

### 2. Настроить GigaChat API
Отредактируй `src/services/gigachat.ts`:
- Замени `YOUR_CLIENT_ID` и `YOUR_CLIENT_SECRET` на реальные credentials
- Получить можно на https://developers.sber.ru/studio/

### 3. Установить зависимости
```bash
npm install
```

### 4. Собрать приложение
```bash
npx react-native run-android
```

---

## Как работает

1. **Нажми кнопку микрофона** → начнётся запись (кнопка станет красной)
2. **Нажми снова** → остановится запись, начнётся обработка:
   - Whisper распознаёт речь → текст
   - GigaChat генерирует ответ от Бабы Яги
   - TTS озвучивает ответ
3. **Слушай ответ** → можешь снова нажать микрофон

---

## Troubleshooting

### Whisper не инициализируется
- Проверь, что `ggml-tiny.bin` лежит в `android/app/src/main/assets/`
- Пересобери: `npx react-native run-android`

### GigaChat возвращает ошибку
- Проверь credentials в `gigachat.ts`
- Проверь интернет-соединение

### TTS не работает
- Убедись, что в настройках Android установлен русский язык TTS
- Настройки → Система → Язык и ввод → Синтез речи

---

## Следующие шаги

- [ ] Добавить больше персонажей
- [ ] Кэшировать ответы GigaChat
- [ ] Улучшить UI/UX (анимации, визуализация звука)
- [ ] Добавить историю диалогов
