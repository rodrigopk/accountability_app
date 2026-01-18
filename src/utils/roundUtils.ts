import { RoundProgressSummary } from '../services/types';

/**
 * Formats a date range from startDate to endDate
 * Example: "Jan 1 - Jan 31, 2026"
 */
export function formatDateRange(startDate: string, endDate: string): string {
  const start = new Date(startDate);
  const end = new Date(endDate);

  const startMonth = start.toLocaleDateString('en-US', { month: 'short' });
  const startDay = start.getDate();
  const endMonth = end.toLocaleDateString('en-US', { month: 'short' });
  const endDay = end.getDate();
  const year = end.getFullYear();

  // If same month, show: "Jan 1 - 31, 2026"
  if (startMonth === endMonth && start.getFullYear() === year) {
    return `${startMonth} ${startDay} - ${endDay}, ${year}`;
  }

  // If different months but same year: "Jan 1 - Feb 15, 2026"
  if (start.getFullYear() === year) {
    return `${startMonth} ${startDay} - ${endMonth} ${endDay}, ${year}`;
  }

  // Different years: "Dec 1, 2025 - Jan 15, 2026"
  return `${startMonth} ${startDay}, ${start.getFullYear()} - ${endMonth} ${endDay}, ${year}`;
}

/**
 * Calculates overall completion percentage from progress summary
 * Returns average of all goal completion percentages
 */
export function calculateOverallProgress(
  progressSummary: RoundProgressSummary | null,
): number {
  if (!progressSummary || progressSummary.goalSummaries.length === 0) {
    return 0;
  }

  const totalPercentage = progressSummary.goalSummaries.reduce(
    (sum, goal) => sum + goal.completionPercentage,
    0,
  );

  return Math.round(totalPercentage / progressSummary.goalSummaries.length);
}
