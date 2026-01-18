export interface GoalProgress {
  id: string;
  roundId: string;
  goalId: string;
  targetDate: string; // Date the progress counts for (YYYY-MM-DD)
  completedAt: string; // When progress was logged (ISO timestamp)
  durationSeconds: number;
  notes?: string;
  isAmendment?: boolean; // True if logged after the target date passed
}
