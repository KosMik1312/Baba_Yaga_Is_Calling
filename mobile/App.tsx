import { LogBox } from 'react-native';
import App from './src/App';

// Игнорируем предупреждения для чистоты консоли в разработке
LogBox.ignoreLogs([
  'new NativeEventEmitter',
  'EventEmitter.removeListener',
]);

export default function Main() {
  return <App />;
}
