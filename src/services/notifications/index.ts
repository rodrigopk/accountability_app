export { NotificationService } from './NotificationService';
export { NotificationProvider } from './NotificationProvider';
export { RNPushNotificationProvider } from './RNPushNotificationProvider';
export * from './types';

// Factory for production use
export function createNotificationProvider(): NotificationProvider {
  // Could add platform-specific logic or feature flags here
  return new RNPushNotificationProvider();
}
