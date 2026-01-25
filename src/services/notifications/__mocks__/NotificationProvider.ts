import { NotificationProvider } from '../NotificationProvider';
import { ScheduledNotification, NotificationChannel } from '../types';

export class MockNotificationProvider implements NotificationProvider {
  public scheduledNotifications: ScheduledNotification[] = [];
  public cancelledIds: string[] = [];
  public cancelledTags: string[] = [];
  public channels: NotificationChannel[] = [];
  public permissionGranted = true;

  async initialize(): Promise<boolean> {
    return this.permissionGranted;
  }

  async createChannel(channel: NotificationChannel): Promise<void> {
    this.channels.push(channel);
  }

  async schedule(notification: ScheduledNotification): Promise<void> {
    this.scheduledNotifications.push(notification);
  }

  async cancel(notificationId: string): Promise<void> {
    this.cancelledIds.push(notificationId);
    this.scheduledNotifications = this.scheduledNotifications.filter(n => n.id !== notificationId);
  }

  async cancelByTag(tag: string): Promise<void> {
    this.cancelledTags.push(tag);
    this.scheduledNotifications = this.scheduledNotifications.filter(n => !n.id.startsWith(tag));
  }

  async cancelAll(): Promise<void> {
    this.scheduledNotifications = [];
  }

  async hasPermission(): Promise<boolean> {
    return this.permissionGranted;
  }

  async openSettings(): Promise<void> {
    this.openSettingsCalled = true;
  }

  // Test helpers
  public openSettingsCalled = false;

  reset(): void {
    this.scheduledNotifications = [];
    this.cancelledIds = [];
    this.cancelledTags = [];
    this.channels = [];
    this.permissionGranted = true;
    this.openSettingsCalled = false;
  }
}
