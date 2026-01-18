import { RoundProgressSummary } from '../../services/types';
import { formatDateRange, calculateOverallProgress } from '../roundUtils';

describe('roundUtils', () => {
  describe('formatDateRange', () => {
    it('formats same month date range correctly', () => {
      const result = formatDateRange('2026-01-01', '2026-01-31');
      expect(result).toBe('Jan 1 - 31, 2026');
    });

    it('formats different months same year date range correctly', () => {
      const result = formatDateRange('2026-01-01', '2026-02-15');
      expect(result).toBe('Jan 1 - Feb 15, 2026');
    });

    it('formats different years date range correctly', () => {
      const result = formatDateRange('2025-12-01', '2026-01-15');
      expect(result).toBe('Dec 1, 2025 - Jan 15, 2026');
    });

    it('handles single day range', () => {
      const result = formatDateRange('2026-01-15', '2026-01-15');
      expect(result).toBe('Jan 15 - 15, 2026');
    });

    it('handles full ISO string format', () => {
      const result = formatDateRange('2026-01-01T10:30:00.000Z', '2026-01-31T23:59:59.000Z');
      expect(result).toBe('Jan 1 - 31, 2026');
    });

    it('handles mixed formats (ISO and date-only)', () => {
      const result = formatDateRange('2026-01-01T00:00:00.000Z', '2026-02-15');
      expect(result).toBe('Jan 1 - Feb 15, 2026');
    });
  });

  describe('calculateOverallProgress', () => {
    it('returns 0 when progress summary is null', () => {
      const result = calculateOverallProgress(null);
      expect(result).toBe(0);
    });

    it('returns 0 when goal summaries array is empty', () => {
      const progressSummary: RoundProgressSummary = {
        roundId: 'round-1',
        daysRemaining: 10,
        daysElapsed: 20,
        totalDays: 30,
        goalSummaries: [],
      };

      const result = calculateOverallProgress(progressSummary);
      expect(result).toBe(0);
    });

    it('calculates average of single goal completion percentage', () => {
      const progressSummary: RoundProgressSummary = {
        roundId: 'round-1',
        daysRemaining: 10,
        daysElapsed: 20,
        totalDays: 30,
        goalSummaries: [
          {
            goalId: 'goal-1',
            goalTitle: 'Exercise',
            completedCount: 15,
            expectedCount: 20,
            completionPercentage: 75,
            totalDurationSeconds: 18000,
          },
        ],
      };

      const result = calculateOverallProgress(progressSummary);
      expect(result).toBe(75);
    });

    it('calculates average of multiple goal completion percentages', () => {
      const progressSummary: RoundProgressSummary = {
        roundId: 'round-1',
        daysRemaining: 10,
        daysElapsed: 20,
        totalDays: 30,
        goalSummaries: [
          {
            goalId: 'goal-1',
            goalTitle: 'Exercise',
            completedCount: 10,
            expectedCount: 15,
            completionPercentage: 67,
            totalDurationSeconds: 18000,
          },
          {
            goalId: 'goal-2',
            goalTitle: 'Read',
            completedCount: 15,
            expectedCount: 15,
            completionPercentage: 100,
            totalDurationSeconds: 13500,
          },
        ],
      };

      const result = calculateOverallProgress(progressSummary);
      // Average of 67 and 100 = 83.5, rounded to 84
      expect(result).toBe(84);
    });

    it('rounds to nearest integer', () => {
      const progressSummary: RoundProgressSummary = {
        roundId: 'round-1',
        daysRemaining: 10,
        daysElapsed: 20,
        totalDays: 30,
        goalSummaries: [
          {
            goalId: 'goal-1',
            goalTitle: 'Exercise',
            completedCount: 5,
            expectedCount: 10,
            completionPercentage: 50,
            totalDurationSeconds: 9000,
          },
          {
            goalId: 'goal-2',
            goalTitle: 'Read',
            completedCount: 6,
            expectedCount: 10,
            completionPercentage: 60,
            totalDurationSeconds: 10800,
          },
        ],
      };

      const result = calculateOverallProgress(progressSummary);
      // Average of 50 and 60 = 55
      expect(result).toBe(55);
    });
  });
});
