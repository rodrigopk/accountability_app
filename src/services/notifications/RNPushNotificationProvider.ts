import { Platform, Linking, PushNotificationPermissions, PermissionsAndroid } from 'react-native';
import RNPushNotification, {
  PushNotificationScheduledLocalObject,
} from 'react-native-push-notification';

import { NotificationProvider } from './NotificationProvider';
import { ScheduledNotification, NotificationChannel } from './types';

export class RNPushNotificationProvider implements NotificationProvider {
  private initialized = false;

  async initialize(): Promise<boolean> {
    if (this.initialized) return true;

    // Configure without requesting permissions (avoids Firebase initialization on Android)
    RNPushNotification.configure({
      onNotification: notification => {
        // Handle notification tap
        console.log('Notification:', notification);
      },
      // Don't request permissions here - we'll do it manually to avoid Firebase
      requestPermissions: false,
    });

    this.initialized = true;

    // Request permissions manually for Android 13+
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          console.log('Notification permission not granted');
          return false;
        }
      } catch (err) {
        // Permission might not exist on older Android versions, which is fine
        console.log('Notification permission request error:', err);
      }
    }

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
