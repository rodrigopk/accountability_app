// Mock for the notifications module index
import { MockNotificationProvider } from '../__mocks__/NotificationProvider';
import { NotificationProvider } from '../NotificationProvider';

export { NotificationService } from '../NotificationService';
export { NotificationProvider } from '../NotificationProvider';
export { MockNotificationProvider as RNPushNotificationProvider } from '../__mocks__/NotificationProvider';
export * from '../types';

// Factory for production use - returns mock in test environment
export function createNotificationProvider(): NotificationProvider {
  const provider = new MockNotificationProvider();
  // Ensure hasPermission resolves immediately to minimize act warnings
  provider.hasPermission = jest.fn(() => Promise.resolve(true));
  return provider;
}
