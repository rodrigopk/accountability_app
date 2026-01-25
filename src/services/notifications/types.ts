export interface ScheduledNotification {
  id: string;
  title: string;
  message: string;
  date: Date;
  repeatType?: 'day' | 'week';
  data?: Record<string, unknown>;
}

export interface NotificationChannel {
  channelId: string;
  channelName: string;
  channelDescription?: string;
}
