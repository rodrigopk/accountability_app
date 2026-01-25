import { ScheduledNotification, NotificationChannel } from './types';

export interface NotificationProvider {
  /** Initialize the provider and request permissions */
  initialize(): Promise<boolean>;

  /** Create notification channel (Android) */
  createChannel(channel: NotificationChannel): Promise<void>;

  /** Schedule a local notification */
  schedule(notification: ScheduledNotification): Promise<void>;

  /** Cancel a specific notification by ID */
  cancel(notificationId: string): Promise<void>;

  /** Cancel all notifications matching a tag/group */
  cancelByTag(tag: string): Promise<void>;

  /** Cancel all scheduled notifications */
  cancelAll(): Promise<void>;

  /** Check if permissions are granted */
  hasPermission(): Promise<boolean>;

  /** Open OS notification settings for the app */
  openSettings(): Promise<void>;
}
