export interface GoalProgress {
  id: string;
  roundId: string;
  goalId: string;
  completedAt: string;
  durationSeconds: number;
  notes?: string;
}
