import { Platform, Linking, PushNotificationPermissions } from 'react-native';
import RNPushNotification, {
  PushNotificationScheduledLocalObject,
} from 'react-native-push-notification';

import { NotificationProvider } from './NotificationProvider';
import { ScheduledNotification, NotificationChannel } from './types';

export class RNPushNotificationProvider implements NotificationProvider {
  private initialized = false;

  async initialize(): Promise<boolean> {
    if (this.initialized) return true;

    RNPushNotification.configure({
      onNotification: notification => {
        // Handle notification tap
        console.log('Notification:', notification);
      },
      requestPermissions: true,
    });

    this.initialized = true;
    return this.hasPermission();
  }

  async createChannel(channel: NotificationChannel): Promise<void> {
    RNPushNotification.createChannel(
      {
        channelId: channel.channelId,
        channelName: channel.channelName,
        channelDescription: channel.channelDescription,
      },
      () => {}, // callback
    );
  }

  async schedule(notification: ScheduledNotification): Promise<void> {
    RNPushNotification.localNotificationSchedule({
      id: notification.id,
      title: notification.title,
      message: notification.message,
      date: notification.date,
      repeatType: notification.repeatType,
      channelId: 'goal-reminders',
      userInfo: { id: notification.id, ...notification.data },
    });
  }

  async cancel(notificationId: string): Promise<void> {
    RNPushNotification.cancelLocalNotification(notificationId);
  }

  async cancelByTag(tag: string): Promise<void> {
    // react-native-push-notification doesn't support tags natively
    // We'll use a convention: notification IDs are prefixed with roundId
    RNPushNotification.getScheduledLocalNotifications(
      (notifications: PushNotificationScheduledLocalObject[]) => {
        notifications
          .filter((n: PushNotificationScheduledLocalObject) => n.id?.toString().startsWith(tag))
          .forEach((n: PushNotificationScheduledLocalObject) =>
            RNPushNotification.cancelLocalNotification(n.id),
          );
      },
    );
  }

  async cancelAll(): Promise<void> {
    RNPushNotification.cancelAllLocalNotifications();
  }

  async hasPermission(): Promise<boolean> {
    return new Promise(resolve => {
      RNPushNotification.checkPermissions((permissions: PushNotificationPermissions) => {
        resolve(permissions.alert ?? false);
      });
    });
  }

  async openSettings(): Promise<void> {
    if (Platform.OS === 'ios') {
      await Linking.openURL('app-settings:');
    } else {
      await Linking.openSettings();
    }
  }
}
