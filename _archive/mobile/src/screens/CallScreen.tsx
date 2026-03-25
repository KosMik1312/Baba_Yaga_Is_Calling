import React, { useEffect } from 'react';
import {
  View, StyleSheet, TouchableOpacity, Text, Image,
  ActivityIndicator, Platform,
} from 'react-native';
import { CameraView, useCameraPermissions, useMicrophonePermissions } from 'expo-camera';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../App';
import { CHARACTERS } from '@utils/constants';
import { useTranslation } from 'react-i18next';
import { useCall } from '@hooks/useCall';
import { audioService, useAudioRecorder, useAudioPlayer, RecordingPresets } from '@services/audioService';

type CallScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Call'>;
type CallScreenRouteProp = RouteProp<RootStackParamList, 'Call'>;

const STATUS_LABELS: Record<string, string> = {
  idle: '',
  connecting: 'Соединение...',
  connected: 'Нажми чтобы говорить',
  recording: 'Слушаю... Нажми ещё раз чтобы отправить',
  processing: 'Думаю...',
  speaking: 'Говорю...',
  error: 'Ошибка соединения',
};

export default function CallScreen() {
  const navigation = useNavigation<CallScreenNavigationProp>();
  const route = useRoute<CallScreenRouteProp>();
  const { t } = useTranslation();
  const { characterId } = route.params;

  const character = CHARACTERS[characterId.toUpperCase() as keyof typeof CHARACTERS];
  const charIdNum = 1;

  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [micPermission, requestMicPermission] = useMicrophonePermissions();

  const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const player = useAudioPlayer(null);

  const {
    status, responseText,
    startCall, toggleRecording, endCall,
  } = useCall(charIdNum);

  useEffect(() => {
    audioService.setRecorder(recorder);
    audioService.setPlayer(player);
  }, []);

  useEffect(() => {
    (async () => {
      await requestCameraPermission();
      await requestMicPermission();
    })();
  }, []);

  useEffect(() => {
    if (cameraPermission?.granted && micPermission?.granted && status === 'idle') {
      startCall('друг');
    }
  }, [cameraPermission?.granted, micPermission?.granted]);

  const handleEndCall = () => {
    endCall();
    navigation.goBack();
  };

  const hasPermission = cameraPermission?.granted && micPermission?.granted;

  if (!cameraPermission || !micPermission) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#FFD700" />
      </View>
    );
  }

  if (!hasPermission) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{t('call.permission_required')}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => navigation.goBack()}>
          <Text style={styles.retryButtonText}>{t('common.retry')}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const isRecordable = status === 'connected' || status === 'recording';
  const isRecording = status === 'recording';
  const isSpeaking = status === 'speaking';

  return (
    <View style={styles.container}>
      {/* Камера ребёнка */}
      <View style={styles.cameraContainer}>
        <CameraView style={styles.camera} facing="front" />
      </View>

      {/* Персонаж */}
      <View style={styles.characterContainer}>
        <View style={styles.characterFrame}>
          <Image source={character.avatar} style={styles.characterImage} resizeMode="cover" />
          {isSpeaking && (
            <View style={styles.speakingIndicator}>
              <View style={[styles.wave, { height: 20 }]} />
              <View style={[styles.wave, { height: 35 }]} />
              <View style={[styles.wave, { height: 20 }]} />
            </View>
          )}
        </View>

        <Text style={styles.characterName}>{character.name}</Text>
        <Text style={styles.statusText}>{STATUS_LABELS[status] ?? ''}</Text>

        {responseText ? (
          <Text style={styles.responseText} numberOfLines={3}>{responseText}</Text>
        ) : null}
      </View>

      {/* Кнопки */}
      <View style={styles.controls}>
        <TouchableOpacity
          style={[
            styles.micButton,
            isRecording && styles.micButtonRecording,
            !isRecordable && styles.micButtonDisabled,
          ]}
          onPress={toggleRecording}
          disabled={!isRecordable}
          activeOpacity={0.7}
        >
          <Text style={styles.micButtonText}>
            {status === 'processing' ? '⏳' : isRecording ? '⏹️' : '🎤'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.endCallButton} onPress={handleEndCall} activeOpacity={0.7}>
          <Text style={styles.endCallButtonText}>📴 {t('common.endCall')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  cameraContainer: {
    position: 'absolute', top: 20, right: 20,
    width: 120, height: 160, borderRadius: 10,
    overflow: 'hidden', borderWidth: 3, borderColor: '#FFF', zIndex: 10,
  },
  camera: { flex: 1 },
  characterContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  characterFrame: {
    width: 280, height: 350, borderRadius: 20, overflow: 'hidden',
    borderWidth: 5, borderColor: '#FFD700', backgroundColor: '#FFF',
    justifyContent: 'center', alignItems: 'center', position: 'relative',
  },
  characterImage: { width: '100%', height: '100%' },
  speakingIndicator: {
    position: 'absolute', bottom: 20, flexDirection: 'row',
    alignItems: 'flex-end', gap: 5,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 15, paddingVertical: 10, borderRadius: 20,
  },
  wave: { width: 6, backgroundColor: '#FFD700', borderRadius: 3 },
  characterName: {
    fontSize: 24, fontWeight: 'bold', color: '#FFF', marginTop: 20,
    ...Platform.select({
      web: { textShadow: '-1px -1px 3px rgba(0,0,0,0.75)' },
      default: { textShadowColor: 'rgba(0,0,0,0.75)', textShadowOffset: { width: -1, height: -1 }, textShadowRadius: 3 },
    }),
  },
  statusText: { fontSize: 16, color: '#FFD700', marginTop: 8, fontWeight: '600', textAlign: 'center', paddingHorizontal: 20 },
  responseText: {
    fontSize: 14, color: '#FFF', marginTop: 10, textAlign: 'center',
    paddingHorizontal: 20, opacity: 0.9,
  },
  controls: {
    position: 'absolute', bottom: 40, left: 0, right: 0,
    alignItems: 'center', gap: 16,
  },
  micButton: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: '#4CAF50', justifyContent: 'center', alignItems: 'center',
    ...Platform.select({
      web: { boxShadow: '0px 4px 8px rgba(0,0,0,0.4)' },
      default: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 8 },
    }),
  },
  micButtonDisabled: { backgroundColor: '#555' },
  micButtonRecording: { backgroundColor: '#F44336', transform: [{ scale: 1.1 }] },
  micButtonText: { fontSize: 36 },
  endCallButton: {
    backgroundColor: '#F44336', paddingHorizontal: 40, paddingVertical: 14,
    borderRadius: 30,
    ...Platform.select({
      web: { boxShadow: '0px 2px 4px rgba(0,0,0,0.3)' },
      default: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 4 },
    }),
  },
  endCallButtonText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  errorText: { fontSize: 18, color: '#FFF', textAlign: 'center', marginBottom: 20 },
  retryButton: { backgroundColor: '#FFD700', paddingHorizontal: 30, paddingVertical: 15, borderRadius: 25 },
  retryButtonText: { color: '#8B4513', fontSize: 18, fontWeight: 'bold' },
});
