import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  Image, SafeAreaView, ActivityIndicator,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { useAudioRecorder } from '../hooks/useAudioRecorder';
import { useTTS } from '../hooks/useTTS';
import { sendMessageToGigaChat } from '../services/gigachat';
import { backendSTT } from '../services/backendSTT';
import { RootStackParamList } from '../App';
import RNFS from 'react-native-fs';

type CallScreenRouteProp = RouteProp<RootStackParamList, 'Call'>;

export default function CallScreen() {
  const navigation = useNavigation();
  const route = useRoute<CallScreenRouteProp>();
  const { characterId } = route.params;

  const { isRecording, recordingTime, audioLevel, startRecording, stopRecording } = useAudioRecorder();
  const { speak, stop } = useTTS();

  const [status, setStatus] = useState('Нажми чтобы говорить');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleMicPress = async () => {
    if (isProcessing) return;

    if (isRecording) {
      setIsProcessing(true);
      setStatus('Обработка...');

      const audioPath = await stopRecording();
      if (!audioPath) {
        setStatus('Запись слишком короткая');
        setIsProcessing(false);
        setTimeout(() => setStatus('Нажми чтобы говорить'), 2000);
        return;
      }

      const fileInfo = await RNFS.stat(audioPath.replace('file://', ''));
      console.log('Размер аудио:', fileInfo.size, 'байт');

      try {
        // 1. STT на бэкенде
        setStatus('Распознаю речь...');
        const userText = await backendSTT.recognize(audioPath);
        console.log('Распознано:', userText);

        if (!userText) {
          setStatus('Не расслышала...');
          setIsProcessing(false);
          setTimeout(() => setStatus('Нажми чтобы говорить'), 2000);
          return;
        }

        // 2. GigaChat
        setStatus('Думаю...');
        const responseText = await sendMessageToGigaChat(userText, characterId);
        console.log('Ответ:', responseText);

        // 3. TTS
        setStatus('Говорю...');
        await speak(responseText);

        setStatus('Нажми чтобы говорить');
      } catch (error) {
        console.error('Ошибка пайплайна:', error);
        setStatus('Что-то пошло не так...');
        setTimeout(() => setStatus('Нажми чтобы говорить'), 3000);
      } finally {
        setIsProcessing(false);
      }
    } else {
      await stop();
      setStatus('Говорите...');
      await startRecording();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.characterContainer}>
        <Image
          source={require('@assets/characters/baba_yaga.png')}
          style={styles.characterImage}
          resizeMode="cover"
        />
        <Text style={styles.characterName}>Баба Яга</Text>
        <Text style={styles.statusText}>{status}</Text>
        {isRecording && (
          <View style={styles.recordingIndicator}>
            <Text style={styles.timerText}>{recordingTime}с</Text>
            <View style={styles.audioLevelContainer}>
              <View style={[styles.audioLevelBar, { width: `${audioLevel}%` }]} />
            </View>
          </View>
        )}
      </View>

      <View style={styles.controls}>
        {isProcessing && <ActivityIndicator size="large" color="#FFD700" style={styles.loader} />}

        <TouchableOpacity
          style={[styles.micButton, isRecording && styles.micButtonActive]}
          activeOpacity={0.7}
          onPress={handleMicPress}
          disabled={isProcessing}
        >
          <Text style={styles.micButtonText}>🎤</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.endCallButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Text style={styles.endCallButtonText}>📴 Завершить</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  characterContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  characterImage: { width: 280, height: 350, borderRadius: 20, borderWidth: 5, borderColor: '#FFD700' },
  characterName: { fontSize: 24, fontWeight: 'bold', color: '#FFF', marginTop: 16 },
  statusText: { fontSize: 16, color: '#FFD700', marginTop: 8 },
  recordingIndicator: { alignItems: 'center', marginTop: 12 },
  timerText: { fontSize: 20, color: '#4CAF50', fontWeight: 'bold', marginBottom: 8 },
  audioLevelContainer: { width: 200, height: 20, backgroundColor: '#333', borderRadius: 10, overflow: 'hidden' },
  audioLevelBar: { height: '100%', backgroundColor: '#4CAF50' },
  controls: { paddingBottom: 40, alignItems: 'center', gap: 16 },
  loader: { marginBottom: 16 },
  micButton: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#4CAF50', justifyContent: 'center', alignItems: 'center', elevation: 5 },
  micButtonActive: { backgroundColor: '#F44336' },
  micButtonText: { fontSize: 36 },
  endCallButton: { backgroundColor: '#F44336', paddingHorizontal: 40, paddingVertical: 14, borderRadius: 30 },
  endCallButtonText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
});
