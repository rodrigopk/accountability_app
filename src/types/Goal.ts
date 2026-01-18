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
  frequency: GoalFrequency;
  durationSeconds: number;
}
