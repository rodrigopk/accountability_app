export type DayOfWeek =
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday'
  | 'sunday';

export type GoalFrequency =
  | { type: 'daily' }
  | { type: 'timesPerWeek'; count: number }
  | { type: 'specificDays'; days: DayOfWeek[] };

export interface Goal {
  id: string;
  title: string;
  description?: string;
  emoji?: string;
  frequency: GoalFrequency;
  durationSeconds: number;
  notificationTime: string; // HH:mm format, e.g., "09:00"
}

export const DEFAULT_NOTIFICATION_TIME = '09:00';
