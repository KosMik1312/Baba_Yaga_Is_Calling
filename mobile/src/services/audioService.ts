import { Platform } from 'react-native';
import { useAudioRecorder, useAudioPlayer, RecordingPresets, AudioModule } from 'expo-audio';
import * as FileSystem from 'expo-file-system';

class AudioService {
  private recorder: ReturnType<typeof useAudioRecorder> | null = null;
  private player: ReturnType<typeof useAudioPlayer> | null = null;

  setRecorder(recorder: ReturnType<typeof useAudioRecorder>) {
    this.recorder = recorder;
  }

  setPlayer(player: ReturnType<typeof useAudioPlayer>) {
    this.player = player;
  }

  async startRecording(): Promise<void> {
    if (!this.recorder) return;
    await this.recorder.prepareToRecordAsync(RecordingPresets.HIGH_QUALITY);
    this.recorder.record();
  }

  async stopRecording(): Promise<string | null> {
    if (!this.recorder) return null;
    await this.recorder.stop();
    return this.recorder.uri ?? null;
  }

  async uriToBase64(uri: string): Promise<string> {
    if (Platform.OS === 'web') {
      // На вебе читаем через fetch → blob → base64
      const response = await fetch(uri);
      const blob = await response.blob();
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const result = reader.result as string;
          // Убираем префикс "data:...;base64,"
          resolve(result.split(',')[1]);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    }
    // На мобильных используем expo-file-system
    return await FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType.Base64,
    });
  }

  async playBase64Audio(base64: string): Promise<void> {
    if (!this.player) return;

    if (Platform.OS === 'web') {
      // На вебе используем Web Audio API напрямую
      const binary = atob(base64);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }
      const blob = new Blob([bytes], { type: 'audio/wav' });
      const url = URL.createObjectURL(blob);
      this.player.replace({ uri: url });
      this.player.play();
      return;
    }

    // На мобильных пишем файл через expo-file-system
    const uri = FileSystem.cacheDirectory + 'response.wav';
    await FileSystem.writeAsStringAsync(uri, base64, {
      encoding: FileSystem.EncodingType.Base64,
    });
    this.player.replace({ uri });
    this.player.play();
  }

  stopPlayback(): void {
    this.player?.pause();
  }
}

export const audioService = new AudioService();
export { useAudioRecorder, useAudioPlayer, RecordingPresets, AudioModule };
