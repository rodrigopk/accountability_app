import { Goal, GoalFrequency } from '../../types/Goal';
import { GoalProgress } from '../../types/GoalProgress';
import {
  getTodayDateString,
  formatDateToString,
  parseDateString,
  getDayOfWeek,
  isDateApplicableForGoal,
  getWeekBoundaries,
  getDateRange,
  canLogProgressForToday,
  getGoalStatusByDate,
  getAmendableDates,
} from '../progressValidation';

// Helper to create a goal with specific frequency
function createGoal(frequency: GoalFrequency, id = 'goal-1'): Goal {
  return {
    id,
    title: 'Test Goal',
    frequency,
    durationSeconds: 3600,
  };
}

// Helper to create progress entries
function createProgress(goalId: string, targetDate: string, roundId = 'round-1'): GoalProgress {
  return {
    id: `progress-${targetDate}`,
    roundId,
    goalId,
    targetDate,
    completedAt: `${targetDate}T12:00:00Z`,
    durationSeconds: 3600,
  };
}

describe('progressValidation', () => {
  describe('formatDateToString', () => {
    it('should format date to YYYY-MM-DD', () => {
      const date = new Date(2026, 0, 18); // January 18, 2026
      expect(formatDateToString(date)).toBe('2026-01-18');
    });

    it('should pad single digit months and days', () => {
      const date = new Date(2026, 0, 5); // January 5, 2026
      expect(formatDateToString(date)).toBe('2026-01-05');
    });
  });

  describe('parseDateString', () => {
    it('should parse YYYY-MM-DD to Date at midnight', () => {
      const result = parseDateString('2026-01-18');
      expect(result.getFullYear()).toBe(2026);
      expect(result.getMonth()).toBe(0); // January
      expect(result.getDate()).toBe(18);
    });
  });

  describe('getDayOfWeek', () => {
    it('should return correct day of week', () => {
      expect(getDayOfWeek('2026-01-18')).toBe('sunday');
      expect(getDayOfWeek('2026-01-19')).toBe('monday');
      expect(getDayOfWeek('2026-01-20')).toBe('tuesday');
      expect(getDayOfWeek('2026-01-21')).toBe('wednesday');
      expect(getDayOfWeek('2026-01-22')).toBe('thursday');
      expect(getDayOfWeek('2026-01-23')).toBe('friday');
      expect(getDayOfWeek('2026-01-24')).toBe('saturday');
    });
  });

  describe('isDateApplicableForGoal', () => {
    it('should return true for daily goals on any day', () => {
      const frequency: GoalFrequency = { type: 'daily' };
      expect(isDateApplicableForGoal('2026-01-18', frequency)).toBe(true);
      expect(isDateApplicableForGoal('2026-01-19', frequency)).toBe(true);
    });

    it('should return true for specificDays when day is included', () => {
      const frequency: GoalFrequency = {
        type: 'specificDays',
        days: ['monday', 'wednesday', 'friday'],
      };
      expect(isDateApplicableForGoal('2026-01-19', frequency)).toBe(true); // Monday
      expect(isDateApplicableForGoal('2026-01-21', frequency)).toBe(true); // Wednesday
      expect(isDateApplicableForGoal('2026-01-23', frequency)).toBe(true); // Friday
    });

    it('should return false for specificDays when day is not included', () => {
      const frequency: GoalFrequency = {
        type: 'specificDays',
        days: ['monday', 'wednesday', 'friday'],
      };
      expect(isDateApplicableForGoal('2026-01-18', frequency)).toBe(false); // Sunday
      expect(isDateApplicableForGoal('2026-01-20', frequency)).toBe(false); // Tuesday
    });

    it('should return true for timesPerWeek on any day', () => {
      const frequency: GoalFrequency = { type: 'timesPerWeek', count: 3 };
      expect(isDateApplicableForGoal('2026-01-18', frequency)).toBe(true);
      expect(isDateApplicableForGoal('2026-01-22', frequency)).toBe(true);
    });
  });

  describe('getWeekBoundaries', () => {
    it('should return Monday to Sunday for a mid-week date', () => {
      const { start, end } = getWeekBoundaries('2026-01-21'); // Wednesday
      expect(start).toBe('2026-01-19'); // Monday
      expect(end).toBe('2026-01-25'); // Sunday
    });

    it('should handle Sunday correctly (end of week)', () => {
      const { start, end } = getWeekBoundaries('2026-01-18'); // Sunday
      expect(start).toBe('2026-01-12'); // Previous Monday
      expect(end).toBe('2026-01-18'); // Same Sunday
    });

    it('should handle Monday correctly (start of week)', () => {
      const { start, end } = getWeekBoundaries('2026-01-19'); // Monday
      expect(start).toBe('2026-01-19'); // Same Monday
      expect(end).toBe('2026-01-25'); // Next Sunday
    });
  });

  describe('getDateRange', () => {
    it('should return all dates between start and end inclusive', () => {
      const dates = getDateRange('2026-01-18', '2026-01-22');
      expect(dates).toEqual(['2026-01-18', '2026-01-19', '2026-01-20', '2026-01-21', '2026-01-22']);
    });

    it('should return single date when start equals end', () => {
      const dates = getDateRange('2026-01-18', '2026-01-18');
      expect(dates).toEqual(['2026-01-18']);
    });
  });

  describe('canLogProgressForToday', () => {
    // Note: These tests depend on the actual current date via getTodayDateString()
    // In a real scenario, we would mock the date

    it('should return canLog false when round has not started', () => {
      const goal = createGoal({ type: 'daily' });
      const result = canLogProgressForToday(goal, [], '2030-01-01', '2030-01-31');
      expect(result.canLog).toBe(false);
      expect(result.reason).toBe('Round has not started yet');
    });

    it('should return canLog false when round has ended', () => {
      const goal = createGoal({ type: 'daily' });
      const result = canLogProgressForToday(goal, [], '2020-01-01', '2020-01-31');
      expect(result.canLog).toBe(false);
      expect(result.reason).toBe('Round has ended');
    });
  });

  describe('getGoalStatusByDate', () => {
    it('should mark completed dates as completed', () => {
      const goal = createGoal({ type: 'daily' });
      const progress = [
        createProgress('goal-1', '2026-01-15'),
        createProgress('goal-1', '2026-01-16'),
      ];

      const statuses = getGoalStatusByDate(goal, progress, '2026-01-15', '2026-01-16');

      expect(statuses).toHaveLength(2);
      expect(statuses[0].status).toBe('completed');
      expect(statuses[0].progressId).toBe('progress-2026-01-15');
      expect(statuses[1].status).toBe('completed');
    });

    it('should mark past dates without progress as failed', () => {
      const goal = createGoal({ type: 'daily' });
      const progress: GoalProgress[] = [];

      // Assuming today is 2026-01-18, dates before that without progress are failed
      const statuses = getGoalStatusByDate(goal, progress, '2026-01-15', '2026-01-16');

      expect(statuses.every(s => s.status === 'failed')).toBe(true);
    });

    it('should mark non-applicable days for specificDays as not_applicable', () => {
      const goal = createGoal({ type: 'specificDays', days: ['monday', 'wednesday'] });
      const progress: GoalProgress[] = [];

      // 2026-01-18 is Sunday
      // 2026-01-12 is Monday, 2026-01-13 is Tuesday, 2026-01-14 is Wednesday
      const statuses = getGoalStatusByDate(goal, progress, '2026-01-12', '2026-01-14');

      // Check that non-applicable days are marked correctly
      const mondayStatus = statuses.find(s => s.date === '2026-01-12'); // Monday
      const tuesdayStatus = statuses.find(s => s.date === '2026-01-13'); // Tuesday
      const wednesdayStatus = statuses.find(s => s.date === '2026-01-14'); // Wednesday

      expect(mondayStatus?.status).toBe('failed'); // Monday is applicable but no progress
      expect(tuesdayStatus?.status).toBe('not_applicable'); // Tuesday not in days
      expect(wednesdayStatus?.status).toBe('failed'); // Wednesday is applicable but no progress
    });
  });

  describe('getAmendableDates', () => {
    it('should return failed dates that can be amended', () => {
      const goal = createGoal({ type: 'daily' });
      const progress = [
        createProgress('goal-1', '2026-01-15'),
        // 2026-01-16 is missing
        createProgress('goal-1', '2026-01-17'),
      ];

      const amendable = getAmendableDates(goal, progress, '2026-01-15', '2026-01-20');

      expect(amendable).toContain('2026-01-16');
      expect(amendable).not.toContain('2026-01-15'); // Has progress
      expect(amendable).not.toContain('2026-01-17'); // Has progress
    });

    it('should only return past dates (not today or future)', () => {
      const goal = createGoal({ type: 'daily' });
      const progress: GoalProgress[] = [];

      // Today is based on getTodayDateString()
      const today = getTodayDateString();
      const amendable = getAmendableDates(goal, progress, '2026-01-15', '2026-01-25');

      // Should not include today or future dates
      expect(amendable).not.toContain(today);
      amendable.forEach(date => {
        expect(date < today).toBe(true);
      });
    });

    it('should respect specificDays frequency', () => {
      const goal = createGoal({ type: 'specificDays', days: ['monday'] });
      const progress: GoalProgress[] = [];

      const amendable = getAmendableDates(goal, progress, '2026-01-12', '2026-01-18');

      // Only Mondays should be amendable
      // 2026-01-12 is Monday, 2026-01-19 is Monday (future)
      expect(amendable).toContain('2026-01-12');
      expect(amendable).not.toContain('2026-01-13'); // Tuesday
      expect(amendable).not.toContain('2026-01-14'); // Wednesday
    });
  });
});
