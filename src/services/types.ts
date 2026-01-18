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
  completionPercentage: number;
  totalDurationSeconds: number;
}
