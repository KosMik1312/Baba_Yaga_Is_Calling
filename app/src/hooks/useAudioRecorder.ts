import { useState } from 'react';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import { PermissionsAndroid, Platform } from 'react-native';
import RNFS from 'react-native-fs';

const audioRecorderPlayer = new AudioRecorderPlayer();
const MIN_RECORDING_TIME = 2000; // Минимум 2 секунды

export const useAudioRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordPath, setRecordPath] = useState<string | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [audioLevel, setAudioLevel] = useState(0); // Уровень звука 0-100

  const requestPermission = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        {
          title: 'Разрешение на микрофон',
          message: 'Приложению нужен доступ к микрофону для записи голоса',
          buttonPositive: 'Разрешить',
          buttonNegative: 'Отмена',
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
  };

  const startRecording = async () => {
    const hasPermission = await requestPermission();
    if (!hasPermission) {
      console.log('Нет разрешения на запись');
      return;
    }

    try {
      const wavPath = `${RNFS.CachesDirectoryPath}/recording_${Date.now()}.wav`;
      // Для Xiaomi: VOICE_COMMUNICATION + WAV PCM 16kHz для Whisper
      const path = await audioRecorderPlayer.startRecorder(
        wavPath,
        {
          AudioSourceAndroid: 7, // MediaRecorder.AudioSource.VOICE_COMMUNICATION
          OutputFormatAndroid: 1, // MediaRecorder.OutputFormat.DEFAULT (WAV)
          AudioEncoderAndroid: 0, // MediaRecorder.AudioEncoder.DEFAULT (PCM)
          AudioSamplingRateAndroid: 16000,
          AudioChannels: 1,
        },
        true
      );
      audioRecorderPlayer.addRecordBackListener((e) => {
        setRecordingTime(Math.floor(e.currentPosition / 1000));
        const metering = e.currentMetering || -160;
        const normalized = Math.max(0, Math.min(100, ((metering + 160) / 160) * 100));
        setAudioLevel(Math.floor(normalized));
        if (metering > -160) {
          console.log('Audio level:', metering, 'dB →', Math.floor(normalized), '%');
        }
      });
      setRecordPath(path);
      setIsRecording(true);
      setStartTime(Date.now());
      console.log('Запись началась (VOICE_COMMUNICATION):', path);
    } catch (error) {
      console.error('Ошибка записи:', error);
    }
  };

  const stopRecording = async () => {
    const elapsed = Date.now() - startTime;
    if (elapsed < MIN_RECORDING_TIME) {
      console.log(`Запись слишком короткая: ${elapsed}ms, минимум ${MIN_RECORDING_TIME}ms`);
      return null;
    }

    try {
      const result = await audioRecorderPlayer.stopRecorder();
      audioRecorderPlayer.removeRecordBackListener();
      setIsRecording(false);
      setRecordingTime(0);
      setAudioLevel(0);
      console.log('Запись остановлена:', result);
      return result;
    } catch (error) {
      console.error('Ошибка остановки:', error);
      return null;
    }
  };

  return {
    isRecording,
    recordPath,
    recordingTime,
    audioLevel,
    startRecording,
    stopRecording,
  };
};
