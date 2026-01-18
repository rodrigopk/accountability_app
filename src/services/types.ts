import { Goal, GoalFrequency } from '../types/Goal';

export interface CreateRoundInput {
  deviceId: string;
  startDate: string;
  endDate: string;
  goals: CreateGoalInput[];
  reward: string;
  punishment: string;
}

export interface CreateGoalInput {
  title: string;
  description?: string;
  frequency: GoalFrequency;
  durationSeconds: number;
}

export interface UpdateRoundInput {
  startDate?: string;
  endDate?: string;
  goals?: Goal[];
  reward?: string;
  punishment?: string;
}

export interface UpdateGoalInput {
  title?: string;
  description?: string;
  frequency?: GoalFrequency;
  durationSeconds?: number;
}

export interface LogProgressInput {
  roundId: string;
  goalId: string;
  durationSeconds: number;
  notes?: string;
  targetDate?: string; // For amendments, defaults to today
}

export interface RoundProgressSummary {
  roundId: string;
  daysRemaining: number;
  daysElapsed: number;
  totalDays: number;
  goalSummaries: GoalProgressSummary[];
}

export interface GoalProgressSummary {
  goalId: string;
  goalTitle: string;
  completedCount: number;
  expectedCount: number;
  failedCount: number;
  completionPercentage: number;
  totalDurationSeconds: number;
  canLogToday: boolean;
  canLogReason?: string; // Reason why logging is not allowed (if canLogToday is false)
  amendableDates: string[];
}

export type GoalIntervalStatus = 'pending' | 'completed' | 'failed' | 'not_applicable';

export interface GoalDayStatus {
  date: string; // YYYY-MM-DD
  status: GoalIntervalStatus;
  progressId?: string; // If completed, reference to the progress entry
}

export interface CanLogProgressResult {
  canLog: boolean;
  reason?: string;
  nextAvailableDate?: string;
  failedDates?: string[]; // Dates that are now failed and can be amended
}

export interface GoalStatusResult {
  canLogToday: boolean;
  reason?: string;
  todayStatus: GoalIntervalStatus;
  failedDates: string[]; // Past dates that were missed
  amendableDates: string[]; // Failed dates that can still be amended
  completedDates: string[]; // Dates with logged progress
}
