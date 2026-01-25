import { AccountabilityRound } from '../../types/AccountabilityRound';
import { Goal, DayOfWeek } from '../../types/Goal';

import { NotificationProvider } from './NotificationProvider';
import { ScheduledNotification } from './types';

const CHANNEL_ID = 'goal-reminders';
const DAY_MAP: Record<DayOfWeek, number> = {
  sunday: 0,
  monday: 1,
  tuesday: 2,
  wednesday: 3,
  thursday: 4,
  friday: 5,
  saturday: 6,
};

export class NotificationService {
  constructor(private provider: NotificationProvider) {}

  async initialize(): Promise<boolean> {
    const granted = await this.provider.initialize();
    if (granted) {
      await this.provider.createChannel({
        channelId: CHANNEL_ID,
        channelName: 'Goal Reminders',
        channelDescription: 'Notifications to remind you about your goals',
      });
    }
    return granted;
  }

  /**
   * Schedule notifications for all goals in a round
   */
  async scheduleForRound(round: AccountabilityRound): Promise<void> {
    const startDate = new Date(round.startDate);
    const endDate = new Date(round.endDate);

    for (const goal of round.goals) {
      await this.scheduleForGoal(round.id, goal, startDate, endDate);
    }
  }

  /**
   * Cancel all notifications for a round
   */
  async cancelForRound(roundId: string): Promise<void> {
    await this.provider.cancelByTag(roundId);
  }

  private async scheduleForGoal(
    roundId: string,
    goal: Goal,
    startDate: Date,
    endDate: Date,
  ): Promise<void> {
    const [hours, minutes] = goal.notificationTime.split(':').map(Number);
    const dates = this.getNotificationDates(goal, startDate, endDate);

    for (const date of dates) {
      const notificationDate = new Date(date);
      notificationDate.setHours(hours, minutes, 0, 0);

      // Skip if notification time is in the past
      if (notificationDate <= new Date()) continue;

      const notification: ScheduledNotification = {
        id: `${roundId}-${goal.id}-${date.toISOString().split('T')[0]}`,
        title: `${goal.emoji || '🎯'} ${goal.title}`,
        message: 'Time to work on your goal!',
        date: notificationDate,
        data: { roundId, goalId: goal.id },
      };

      await this.provider.schedule(notification);
    }
  }

  private getNotificationDates(goal: Goal, start: Date, end: Date): Date[] {
    const dates: Date[] = [];
    const current = new Date(start);

    while (current <= end) {
      if (this.shouldNotifyOnDate(goal, current)) {
        dates.push(new Date(current));
      }
      current.setDate(current.getDate() + 1);
    }

    return dates;
  }

  private shouldNotifyOnDate(goal: Goal, date: Date): boolean {
    const dayOfWeek = date.getDay();
    const { frequency } = goal;

    switch (frequency.type) {
      case 'daily':
        return true;
      case 'specificDays':
        return frequency.days.some(day => DAY_MAP[day] === dayOfWeek);
      case 'timesPerWeek':
        // For timesPerWeek, notify on distributed days (Mon, Wed, Fri, etc.)
        return this.getDistributedDays(frequency.count).includes(dayOfWeek);
      default:
        return false;
    }
  }

  private getDistributedDays(count: number): number[] {
    // Distribute notifications evenly across the week
    const distributions: Record<number, number[]> = {
      1: [1], // Monday
      2: [1, 4], // Mon, Thu
      3: [1, 3, 5], // Mon, Wed, Fri
      4: [1, 2, 4, 5], // Mon, Tue, Thu, Fri
      5: [1, 2, 3, 4, 5], // Weekdays
      6: [1, 2, 3, 4, 5, 6], // Mon-Sat
      7: [0, 1, 2, 3, 4, 5, 6], // Every day
    };
    return distributions[count] || [1];
  }
}
