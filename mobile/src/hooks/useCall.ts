import { useCallback, useRef } from 'react';
import { wsService } from '@services/websocket';
import { audioService } from '@services/audioService';
import { useCallStore } from '@store/useCallStore';

export function useCall(characterId: number) {
  const { status, recognizedText, responseText, childName, setStatus, setTexts, setChildName, reset } = useCallStore();
  const isTogglingRef = useRef(false);

  const startCall = useCallback((name: string) => {
    setChildName(name);
    setStatus('connecting');

    wsService.connect(characterId, {
      onMessage: async (msg) => {
        switch (msg.type) {
          case 'call_started':
            setStatus('connected');
            break;

          case 'processing':
            setStatus('processing');
            break;

          case 'response':
            setTexts(msg.recognized_text, msg.response_text);
            setStatus('speaking');
            await audioService.playBase64Audio(msg.audio);
            setStatus('connected');
            break;

          case 'error':
            console.error('Server error:', msg.message);
            setStatus('error');
            break;

          case 'call_ended':
            reset();
            break;
        }
      },
      onDisconnect: () => reset(),
    });

    const interval = setInterval(() => {
      if (wsService.isConnected()) {
        clearInterval(interval);
        wsService.send({ type: 'start_call', child_name: name });
      }
    }, 100);
  }, [characterId]);

  const toggleRecording = useCallback(async () => {
    if (isTogglingRef.current) return;
    isTogglingRef.current = true;

    try {
      if (status === 'connected') {
        await audioService.startRecording();
        setStatus('recording');
      } else if (status === 'recording') {
        setStatus('processing'); // сразу блокируем повторное нажатие
        const uri = await audioService.stopRecording();
        if (!uri) {
          setStatus('connected');
          return;
        }
        const base64 = await audioService.uriToBase64(uri);
        wsService.send({ type: 'audio_chunk', data: base64 });
      }
    } catch (e) {
      console.error('toggleRecording error:', e);
      setStatus('connected');
    } finally {
      isTogglingRef.current = false;
    }
  }, [status]);

  const endCall = useCallback(() => {
    wsService.send({ type: 'end_call' });
    wsService.disconnect();
    audioService.stopPlayback();
    reset();
  }, []);

  return {
    status,
    recognizedText,
    responseText,
    childName,
    startCall,
    toggleRecording,
    endCall,
  };
}
