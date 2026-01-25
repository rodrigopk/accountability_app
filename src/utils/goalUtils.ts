import { GoalFrequency, DayOfWeek } from '../types/Goal';

import { SECONDS_PER_HOUR, SECONDS_PER_MINUTE } from './timeConstants';

/**
 * Type guard to check if a GoalFrequency is daily
 */
export function isDaily(frequency: GoalFrequency): frequency is { type: 'daily' } {
  return frequency.type === 'daily';
}

/**
 * Type guard to check if a GoalFrequency is timesPerWeek
 */
export function isTimesPerWeek(
  frequency: GoalFrequency,
): frequency is { type: 'timesPerWeek'; count: number } {
  return frequency.type === 'timesPerWeek';
}

/**
 * Type guard to check if a GoalFrequency is specificDays
 */
export function isSpecificDays(
  frequency: GoalFrequency,
): frequency is { type: 'specificDays'; days: DayOfWeek[] } {
  return frequency.type === 'specificDays';
}

/**
 * Formats a GoalFrequency into a human-readable string
 */
export function formatFrequency(frequency: GoalFrequency): string {
  switch (frequency.type) {
    case 'daily':
      return 'Daily';
    case 'timesPerWeek':
      return `${frequency.count}x per week`;
    case 'specificDays':
      if (frequency.days.length === 0) {
        return 'No days selected';
      }
      if (frequency.days.length === 7) {
        return 'Every day';
      }
      const dayLabels = frequency.days.map(day => {
        const capitalized = day.charAt(0).toUpperCase() + day.slice(1);
        return capitalized.slice(0, 3);
      });
      return dayLabels.join(', ');
    default:
      return 'Unknown';
  }
}

/**
 * Formats duration in seconds to a human-readable string
 */
export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / SECONDS_PER_HOUR);
  const minutes = Math.floor((seconds % SECONDS_PER_HOUR) / SECONDS_PER_MINUTE);

  if (hours === 0) {
    return `${minutes} min`;
  }
  if (minutes === 0) {
    return `${hours} hr`;
  }
  return `${hours} hr ${minutes} min`;
}

/**
 * Format a time string (HH:mm) to a readable 12-hour format
 * @param time Time in HH:mm format (e.g., "09:00", "14:30")
 * @returns Formatted time string (e.g., "9:00 AM", "2:30 PM")
 */
export function formatNotificationTime(time: string | undefined): string {
  if (!time) {
    return '9:00 AM'; // Default fallback
  }
  const [hours, minutes] = time.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHour = hours % 12 || 12;
  return `${displayHour}:${minutes.toString().padStart(2, '0')} ${period}`;
}
