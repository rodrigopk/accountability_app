import { CanLogProgressResult, GoalDayStatus } from '../services/types';
import { Goal, GoalFrequency, DayOfWeek } from '../types/Goal';
import { GoalProgress } from '../types/GoalProgress';

const DAY_NAMES: DayOfWeek[] = [
  'sunday',
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
];

/**
 * Get the current date in YYYY-MM-DD format using local time
 */
export function getTodayDateString(): string {
  const now = new Date();
  return formatDateToString(now);
}

/**
 * Format a Date object to YYYY-MM-DD string using local time
 */
export function formatDateToString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Parse a YYYY-MM-DD string to a Date object at midnight local time
 */
export function parseDateString(dateStr: string): Date {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day);
}

/**
 * Get the day of week for a date string (YYYY-MM-DD)
 */
export function getDayOfWeek(dateStr: string): DayOfWeek {
  const date = parseDateString(dateStr);
  return DAY_NAMES[date.getDay()];
}

/**
 * Check if a specific date is applicable for a goal based on frequency.
 * For daily: every day is applicable
 * For specificDays: only the specified days are applicable
 * For timesPerWeek: every day is applicable (quota tracked separately)
 */
export function isDateApplicableForGoal(dateStr: string, frequency: GoalFrequency): boolean {
  switch (frequency.type) {
    case 'daily':
      return true;
    case 'specificDays':
      const dayOfWeek = getDayOfWeek(dateStr);
      return frequency.days.includes(dayOfWeek);
    case 'timesPerWeek':
      // Any day can count toward the weekly quota
      return true;
    default:
      return false;
  }
}

/**
 * Get the week boundaries (Monday to Sunday) for a given date.
 * Returns start (Monday) and end (Sunday) dates in YYYY-MM-DD format.
 */
export function getWeekBoundaries(dateStr: string): { start: string; end: string } {
  const date = parseDateString(dateStr);
  const dayOfWeek = date.getDay();

  // Calculate days to subtract to get to Monday (Sunday = 0 becomes 6, Monday = 1 becomes 0, etc.)
  const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

  const monday = new Date(date);
  monday.setDate(date.getDate() - daysToMonday);

  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);

  return {
    start: formatDateToString(monday),
    end: formatDateToString(sunday),
  };
}

/**
 * Get all dates between start and end (inclusive) as YYYY-MM-DD strings
 */
export function getDateRange(startDate: string, endDate: string): string[] {
  const dates: string[] = [];
  const start = parseDateString(startDate);
  const end = parseDateString(endDate);

  const current = new Date(start);
  while (current <= end) {
    dates.push(formatDateToString(current));
    current.setDate(current.getDate() + 1);
  }

  return dates;
}

/**
 * Check if progress has been logged for a specific date
 */
export function hasProgressForDate(progress: GoalProgress[], targetDate: string): boolean {
  return progress.some(p => p.targetDate === targetDate);
}

/**
 * Check if the weekly quota is met for a timesPerWeek goal
 * @returns Object with isMet flag and current count
 */
function isWeeklyQuotaMet(
  frequency: GoalFrequency,
  progress: GoalProgress[],
  dateStr: string,
): { isMet: boolean; count: number; requiredCount: number; weekStart: string; weekEnd: string } {
  if (frequency.type !== 'timesPerWeek') {
    return { isMet: false, count: 0, requiredCount: 0, weekStart: '', weekEnd: '' };
  }

  const { start, end } = getWeekBoundaries(dateStr);
  const weekProgress = progress.filter(p => p.targetDate >= start && p.targetDate <= end);

  return {
    isMet: weekProgress.length >= frequency.count,
    count: weekProgress.length,
    requiredCount: frequency.count,
    weekStart: start,
    weekEnd: end,
  };
}

/**
 * Check if user can log progress for a goal today
 */
export function canLogProgressForToday(
  goal: Goal,
  existingProgress: GoalProgress[],
  roundStartDate: string,
  roundEndDate: string,
): CanLogProgressResult {
  const today = getTodayDateString();

  // Check if round has started
  if (today < roundStartDate) {
    return {
      canLog: false,
      reason: 'Round has not started yet',
      nextAvailableDate: roundStartDate,
    };
  }

  // Check if round has ended
  if (today > roundEndDate) {
    return {
      canLog: false,
      reason: 'Round has ended',
    };
  }

  // Check if today is applicable for this goal
  if (!isDateApplicableForGoal(today, goal.frequency)) {
    const nextDate = findNextApplicableDate(goal.frequency, today, roundEndDate);
    return {
      canLog: false,
      reason: getNotApplicableReason(goal.frequency),
      nextAvailableDate: nextDate || undefined,
    };
  }

  // Check if already logged for today
  if (hasProgressForDate(existingProgress, today)) {
    if (goal.frequency.type === 'timesPerWeek') {
      const quotaCheck = isWeeklyQuotaMet(goal.frequency, existingProgress, today);
      if (quotaCheck.isMet) {
        return {
          canLog: false,
          reason: `Weekly quota of ${quotaCheck.requiredCount} already met`,
        };
      }
      // Can still log more this week, but not today (already logged)
      const effectiveEndDate =
        quotaCheck.weekEnd < roundEndDate ? quotaCheck.weekEnd : roundEndDate;
      const nextDate = findNextApplicableDate(goal.frequency, today, effectiveEndDate);
      return {
        canLog: false,
        reason: 'Already logged progress for today',
        nextAvailableDate: nextDate || undefined,
      };
    }
    return {
      canLog: false,
      reason: 'Already logged progress for today',
    };
  }

  // For timesPerWeek, check if weekly quota is already met
  if (goal.frequency.type === 'timesPerWeek') {
    const quotaCheck = isWeeklyQuotaMet(goal.frequency, existingProgress, today);
    if (quotaCheck.isMet) {
      return {
        canLog: false,
        reason: `Weekly quota of ${quotaCheck.requiredCount} already met for this week`,
      };
    }
  }

  // Calculate failed dates for reference
  const failedDates = getFailedDates(goal, existingProgress, roundStartDate, today);

  return {
    canLog: true,
    failedDates: failedDates.length > 0 ? failedDates : undefined,
  };
}

/**
 * Find the next applicable date for a goal after the given date
 */
function findNextApplicableDate(
  frequency: GoalFrequency,
  afterDate: string,
  endDate: string,
): string | null {
  const start = parseDateString(afterDate);
  const end = parseDateString(endDate);

  const current = new Date(start);
  current.setDate(current.getDate() + 1); // Start from the next day

  while (current <= end) {
    const dateStr = formatDateToString(current);
    if (isDateApplicableForGoal(dateStr, frequency)) {
      return dateStr;
    }
    current.setDate(current.getDate() + 1);
  }

  return null;
}

/**
 * Get a human-readable reason why today is not applicable
 */
function getNotApplicableReason(frequency: GoalFrequency): string {
  switch (frequency.type) {
    case 'specificDays':
      const dayNames = frequency.days.map(d => d.charAt(0).toUpperCase() + d.slice(1));
      return `This goal is only for: ${dayNames.join(', ')}`;
    default:
      return 'Today is not applicable for this goal';
  }
}

/**
 * Get status for each applicable date in a range
 */
export function getGoalStatusByDate(
  goal: Goal,
  progress: GoalProgress[],
  startDate: string,
  endDate: string,
): GoalDayStatus[] {
  const today = getTodayDateString();
  const dates = getDateRange(startDate, endDate);
  const statuses: GoalDayStatus[] = [];

  // For timesPerWeek, we need to track by week
  if (goal.frequency.type === 'timesPerWeek') {
    return getTimesPerWeekStatuses(goal, progress, dates, today);
  }

  // For daily and specificDays, track by individual date
  for (const date of dates) {
    const isApplicable = isDateApplicableForGoal(date, goal.frequency);

    if (!isApplicable) {
      statuses.push({ date, status: 'not_applicable' });
      continue;
    }

    const progressEntry = progress.find(p => p.targetDate === date);

    if (progressEntry) {
      statuses.push({ date, status: 'completed', progressId: progressEntry.id });
    } else if (date < today) {
      statuses.push({ date, status: 'failed' });
    } else if (date === today) {
      statuses.push({ date, status: 'pending' });
    } else {
      // Future date
      statuses.push({ date, status: 'pending' });
    }
  }

  return statuses;
}

/**
 * Get statuses for timesPerWeek frequency (tracks by week, not by day)
 */
function getTimesPerWeekStatuses(
  goal: Goal,
  progress: GoalProgress[],
  dates: string[],
  today: string,
): GoalDayStatus[] {
  if (goal.frequency.type !== 'timesPerWeek') {
    return [];
  }

  const statuses: GoalDayStatus[] = [];
  const requiredCount = goal.frequency.count;
  const processedWeeks = new Set<string>();

  for (const date of dates) {
    const { start: weekStart, end: weekEnd } = getWeekBoundaries(date);

    // Skip if we already processed this week
    if (processedWeeks.has(weekStart)) {
      const weekProgress = progress.filter(
        p => p.targetDate >= weekStart && p.targetDate <= weekEnd,
      );
      const progressEntry = progress.find(p => p.targetDate === date);

      if (progressEntry) {
        statuses.push({ date, status: 'completed', progressId: progressEntry.id });
      } else if (weekEnd < today && weekProgress.length < requiredCount) {
        // Week ended without meeting quota
        statuses.push({ date, status: 'failed' });
      } else {
        statuses.push({ date, status: 'pending' });
      }
      continue;
    }

    processedWeeks.add(weekStart);

    const weekProgress = progress.filter(p => p.targetDate >= weekStart && p.targetDate <= weekEnd);
    const progressEntry = progress.find(p => p.targetDate === date);

    if (progressEntry) {
      statuses.push({ date, status: 'completed', progressId: progressEntry.id });
    } else if (weekEnd < today && weekProgress.length < requiredCount) {
      // Week has ended and quota was not met
      statuses.push({ date, status: 'failed' });
    } else {
      statuses.push({ date, status: 'pending' });
    }
  }

  return statuses;
}

/**
 * Get failed dates (past dates that were missed) for daily and specificDays goals
 */
function getFailedDates(
  goal: Goal,
  progress: GoalProgress[],
  roundStartDate: string,
  upToDate: string,
): string[] {
  const failed: string[] = [];
  const dates = getDateRange(roundStartDate, upToDate);

  // Don't include today in failed dates
  const today = getTodayDateString();
  const pastDates = dates.filter(d => d < today);

  if (goal.frequency.type === 'timesPerWeek') {
    // For timesPerWeek, track failed weeks not individual dates
    return getFailedWeeks(goal, progress, pastDates);
  }

  for (const date of pastDates) {
    if (!isDateApplicableForGoal(date, goal.frequency)) {
      continue;
    }

    const hasProgress = progress.some(p => p.targetDate === date);
    if (!hasProgress) {
      failed.push(date);
    }
  }

  return failed;
}

/**
 * Get failed weeks for timesPerWeek goals (returns the Sunday of each failed week)
 */
function getFailedWeeks(goal: Goal, progress: GoalProgress[], pastDates: string[]): string[] {
  if (goal.frequency.type !== 'timesPerWeek') {
    return [];
  }

  const failedWeeks: string[] = [];
  const processedWeeks = new Set<string>();
  const today = getTodayDateString();

  for (const date of pastDates) {
    const { start: weekStart, end: weekEnd } = getWeekBoundaries(date);

    // Only count weeks that have fully ended
    if (weekEnd >= today || processedWeeks.has(weekStart)) {
      continue;
    }

    processedWeeks.add(weekStart);

    const weekProgress = progress.filter(p => p.targetDate >= weekStart && p.targetDate <= weekEnd);

    if (weekProgress.length < goal.frequency.count) {
      // Return the Sunday of the failed week
      failedWeeks.push(weekEnd);
    }
  }

  return failedWeeks;
}

/**
 * Get dates that can be amended (failed dates within the round period)
 */
export function getAmendableDates(
  goal: Goal,
  progress: GoalProgress[],
  roundStartDate: string,
  roundEndDate: string,
): string[] {
  const today = getTodayDateString();
  // Can only amend dates up to yesterday (not today, not future)
  const upToDate = today <= roundEndDate ? today : roundEndDate;

  return getFailedDates(goal, progress, roundStartDate, upToDate);
}
