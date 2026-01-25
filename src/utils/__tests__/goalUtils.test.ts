import { GoalFrequency, DayOfWeek } from '../../types/Goal';
import { isDaily, isTimesPerWeek, isSpecificDays, formatNotificationTime } from '../goalUtils';

describe('goalUtils', () => {
  describe('isDaily', () => {
    it('should return true for daily frequency', () => {
      const frequency: GoalFrequency = { type: 'daily' };
      expect(isDaily(frequency)).toBe(true);
    });

    it('should return false for timesPerWeek frequency', () => {
      const frequency: GoalFrequency = { type: 'timesPerWeek', count: 3 };
      expect(isDaily(frequency)).toBe(false);
    });

    it('should return false for specificDays frequency', () => {
      const frequency: GoalFrequency = { type: 'specificDays', days: ['monday', 'friday'] };
      expect(isDaily(frequency)).toBe(false);
    });
  });

  describe('isTimesPerWeek', () => {
    it('should return true for timesPerWeek frequency', () => {
      const frequency: GoalFrequency = { type: 'timesPerWeek', count: 4 };
      expect(isTimesPerWeek(frequency)).toBe(true);
    });

    it('should return false for daily frequency', () => {
      const frequency: GoalFrequency = { type: 'daily' };
      expect(isTimesPerWeek(frequency)).toBe(false);
    });

    it('should return false for specificDays frequency', () => {
      const frequency: GoalFrequency = { type: 'specificDays', days: ['monday'] };
      expect(isTimesPerWeek(frequency)).toBe(false);
    });
  });

  describe('isSpecificDays', () => {
    it('should return true for specificDays frequency', () => {
      const frequency: GoalFrequency = { type: 'specificDays', days: ['monday', 'wednesday'] };
      expect(isSpecificDays(frequency)).toBe(true);
    });

    it('should return false for daily frequency', () => {
      const frequency: GoalFrequency = { type: 'daily' };
      expect(isSpecificDays(frequency)).toBe(false);
    });

    it('should return false for timesPerWeek frequency', () => {
      const frequency: GoalFrequency = { type: 'timesPerWeek', count: 5 };
      expect(isSpecificDays(frequency)).toBe(false);
    });

    it('should handle empty days array', () => {
      const frequency: GoalFrequency = { type: 'specificDays', days: [] };
      expect(isSpecificDays(frequency)).toBe(true);
    });

    it('should handle all days of week', () => {
      const allDays: DayOfWeek[] = [
        'monday',
        'tuesday',
        'wednesday',
        'thursday',
        'friday',
        'saturday',
        'sunday',
      ];
      const frequency: GoalFrequency = { type: 'specificDays', days: allDays };
      expect(isSpecificDays(frequency)).toBe(true);
    });
  });

  describe('formatNotificationTime', () => {
    it('should format morning time correctly', () => {
      expect(formatNotificationTime('09:00')).toBe('9:00 AM');
    });

    it('should format afternoon time correctly', () => {
      expect(formatNotificationTime('14:30')).toBe('2:30 PM');
    });

    it('should format noon correctly', () => {
      expect(formatNotificationTime('12:00')).toBe('12:00 PM');
    });

    it('should format midnight correctly', () => {
      expect(formatNotificationTime('00:00')).toBe('12:00 AM');
    });

    it('should format single digit minutes correctly', () => {
      expect(formatNotificationTime('09:05')).toBe('9:05 AM');
    });

    it('should format evening time correctly', () => {
      expect(formatNotificationTime('23:59')).toBe('11:59 PM');
    });
  });
});
