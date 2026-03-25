import { WS_CONFIG } from '@utils/constants';

export type WSMessage =
  | { type: 'call_started'; character_id: number; status: string }
  | { type: 'processing' }
  | { type: 'response'; recognized_text: string; response_text: string; audio: string }
  | { type: 'call_ended' }
  | { type: 'error'; message: string };

type MessageHandler = (msg: WSMessage) => void;

class WebSocketService {
  private ws: WebSocket | null = null;
  private onMessage: MessageHandler | null = null;
  private onDisconnect: (() => void) | null = null;

  connect(characterId: number, handlers: { onMessage: MessageHandler; onDisconnect: () => void }) {
    this.onMessage = handlers.onMessage;
    this.onDisconnect = handlers.onDisconnect;

    const url = `${WS_CONFIG.url}/calls/ws/${characterId}`;
    this.ws = new WebSocket(url);

    this.ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data) as WSMessage;
        this.onMessage?.(msg);
      } catch (e) {
        console.error('WS parse error:', e);
      }
    };

    this.ws.onclose = () => this.onDisconnect?.();
    this.ws.onerror = (e) => console.error('WS error:', e);
  }

  send(data: object) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    }
  }

  disconnect() {
    this.ws?.close();
    this.ws = null;
  }

  isConnected() {
    return this.ws?.readyState === WebSocket.OPEN;
  }
}

export const wsService = new WebSocketService();
