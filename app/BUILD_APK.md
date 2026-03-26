# Сборка APK для установки на смартфон

## Шаги

### 1. Генерация ключа для подписи (один раз)

```bash
cd app/android/app
keytool -genkeypair -v -storetype PKCS12 -keystore babayaga-release.keystore -alias babayaga-key -keyalg RSA -keysize 2048 -validity 10000
```

Введи пароль (запомни его!) и данные (можно любые).

### 2. Настройка gradle

Создай файл `app/android/gradle.properties` (если нет) и добавь:

```properties
BABAYAGA_RELEASE_STORE_FILE=babayaga-release.keystore
BABAYAGA_RELEASE_KEY_ALIAS=babayaga-key
BABAYAGA_RELEASE_STORE_PASSWORD=твой_пароль
BABAYAGA_RELEASE_KEY_PASSWORD=твой_пароль
```

### 3. Обновление build.gradle

Файл `app/android/app/build.gradle` уже настроен (проверь секцию signingConfigs).

### 4. Сборка APK

```bash
cd app/android
./gradlew assembleRelease
```

APK будет в: `app/android/app/build/outputs/apk/release/app-release.apk`

### 5. Установка на смартфон

Скопируй APK на телефон и установи (разреши установку из неизвестных источников).

Или через ADB:
```bash
adb install app/android/app/build/outputs/apk/release/app-release.apk
```
