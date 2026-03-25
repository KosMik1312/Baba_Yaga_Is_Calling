import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  ru: {
    translation: {
      app: {
        title: 'Баба Яга Звонит',
      },
      common: {
        free: 'Бесплатно',
        call: 'Позвонить',
        endCall: 'Завершить звонок',
        settings: 'Настройки',
        loading: 'Загрузка...',
        error: 'Ошибка',
        retry: 'Повторить',
      },
      home: {
        choose_character: 'Выберите персонажа:',
        no_characters: 'Пока нет доступных персонажей',
      },
      call: {
        connecting: 'Соединение...',
        listening: 'Слушаю...',
        speaking: 'Говорю...',
        connection_error: 'Ошибка соединения',
        permission_required: 'Нужен доступ к камере и микрофону',
      },
      settings: {
        title: 'Настройки',
        child_name: 'Имя ребёнка',
        child_age: 'Возраст',
        save: 'Сохранить',
        saved: 'Настройки сохранены',
        parent_control: 'Родительский контроль',
        language: 'Язык',
      },
    },
  },
  en: {
    translation: {
      app: {
        title: 'Baba Yaga Is Calling',
      },
      common: {
        free: 'Free',
        call: 'Call',
        endCall: 'End Call',
        settings: 'Settings',
        loading: 'Loading...',
        error: 'Error',
        retry: 'Retry',
      },
      home: {
        choose_character: 'Choose a character:',
        no_characters: 'No characters available yet',
      },
      call: {
        connecting: 'Connecting...',
        listening: 'Listening...',
        speaking: 'Speaking...',
        connection_error: 'Connection error',
        permission_required: 'Camera and microphone access required',
      },
      settings: {
        title: 'Settings',
        child_name: 'Child name',
        child_age: 'Age',
        save: 'Save',
        saved: 'Settings saved',
        parent_control: 'Parental control',
        language: 'Language',
      },
    },
  },
};

i18n
  .use(initReactI18next)
  .init({
    compatibilityJSON: 'v3',
    resources,
    lng: 'ru', // Язык по умолчанию
    fallbackLng: 'ru',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
