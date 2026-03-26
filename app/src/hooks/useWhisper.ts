import { initWhisper, WhisperContext } from 'whisper.rn';
import { useState, useEffect, useRef } from 'react';

export const useWhisper = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const contextRef = useRef<WhisperContext | null>(null);

  useEffect(() => {
    const init = async () => {
      try {
        contextRef.current = await initWhisper({
          filePath: 'ggml-small.bin',
          isBundleAsset: true,
        });
        setIsInitialized(true);
        console.log('Whisper инициализирован (small model)');
      } catch (error) {
        console.error('Ошибка инициализации Whisper:', error);
      }
    };
    init();
    return () => {
      contextRef.current?.release();
    };
  }, []);

  const transcribe = async (audioPath: string): Promise<string> => {
    if (!contextRef.current) throw new Error('Whisper не инициализирован');

    const { promise } = contextRef.current.transcribe(audioPath, {
      language: 'ru',
      maxLen: 1,
      tokenTimestamps: false,
      speedUp: false,
      translate: false,
      noContext: true,
      singleSegment: false,
      maxContext: -1,
      offset: 0,
      duration: 0,
      beamSize: 5,
      bestOf: 5,
    });
    const { result } = await promise;
    return result.trim();
  };

  return { isInitialized, transcribe };
};
