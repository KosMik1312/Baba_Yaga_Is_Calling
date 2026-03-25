import { create } from 'zustand';

type CallStatus = 'idle' | 'connecting' | 'connected' | 'recording' | 'processing' | 'speaking' | 'error';

interface CallStore {
  status: CallStatus;
  recognizedText: string;
  responseText: string;
  childName: string;
  setStatus: (status: CallStatus) => void;
  setTexts: (recognized: string, response: string) => void;
  setChildName: (name: string) => void;
  reset: () => void;
}

export const useCallStore = create<CallStore>((set) => ({
  status: 'idle',
  recognizedText: '',
  responseText: '',
  childName: 'друг',
  setStatus: (status) => set({ status }),
  setTexts: (recognizedText, responseText) => set({ recognizedText, responseText }),
  setChildName: (childName) => set({ childName }),
  reset: () => set({ status: 'idle', recognizedText: '', responseText: '' }),
}));
