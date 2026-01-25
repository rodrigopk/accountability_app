export { NotificationService } from './NotificationService';
export * from './types';

import { NotificationProvider } from './NotificationProvider';
import { RNPushNotificationProvider } from './RNPushNotificationProvider';

// Factory for production use
export function createNotificationProvider(): NotificationProvider {
  // Could add platform-specific logic or feature flags here
  return new RNPushNotificationProvider();
}
