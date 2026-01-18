import { GoalFrequency, DayOfWeek } from '../types/Goal';

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
