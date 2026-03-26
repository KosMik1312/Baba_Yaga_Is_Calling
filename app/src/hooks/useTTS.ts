import { useEffect } from 'react';
import Tts from 'react-native-tts';

export const useTTS = () => {
  useEffect(() => {
    Tts.setDefaultLanguage('ru-RU');
    Tts.setDefaultRate(0.45); // Медленнее для Бабы Яги
    Tts.setDefaultPitch(0.8); // Ниже тон
  }, []);

  const speak = async (text: string): Promise<void> => {
    try {
      await Tts.speak(text);
    } catch (error) {
      console.error('Ошибка TTS:', error);
    }
  };

  const stop = async () => {
    try {
      await Tts.stop();
    } catch (error) {
      console.error('Ошибка остановки TTS:', error);
    }
  };

  return { speak, stop };
};
