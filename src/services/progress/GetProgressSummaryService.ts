import { ProgressRepository } from '../../data/repositories/ProgressRepository';
import { RoundRepository } from '../../data/repositories/RoundRepository';
import { StorageAdapter } from '../../data/storage/StorageAdapter';
import { DayOfWeek } from '../../types/Goal';
import { RoundProgressSummary, GoalProgressSummary } from '../types';

/**
 * Service for getting progress summary for a round.
 */
export class GetProgressSummaryService {
  private roundRepository: RoundRepository;
  private progressRepository: ProgressRepository;

  constructor(roundRepository?: RoundRepository, progressRepository?: ProgressRepository) {
    const storage = new StorageAdapter();
    this.roundRepository = roundRepository ?? new RoundRepository(storage);
    this.progressRepository = progressRepository ?? new ProgressRepository(storage);
  }

  /**
   * Get progress summary for a round
   * @param roundId Round ID
   * @returns RoundProgressSummary
   */
  async execute(roundId: string): Promise<RoundProgressSummary> {
    const round = await this.roundRepository.getRoundById(roundId);

    if (!round) {
      throw new Error(`Round with id ${roundId} not found`);
    }

    const progress = await this.progressRepository.getProgressForRound(roundId);
    const now = new Date();
    const startDate = new Date(round.startDate);
    const endDate = new Date(round.endDate);
    // Add 1 to make it inclusive (e.g., Jan 1 to Jan 31 = 31 days)
    const totalDays =
      Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    const daysElapsed = Math.max(
      0,
      Math.floor((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1,
    );
    const daysRemaining = Math.max(0, totalDays - daysElapsed);

    const goalSummaries: GoalProgressSummary[] = round.goals.map(goal => {
      const goalProgress = progress.filter(p => p.goalId === goal.id);
      const completedCount = goalProgress.length;
      const totalDurationSeconds = goalProgress.reduce((sum, p) => sum + p.durationSeconds, 0);

      // Calculate expected count based on frequency
      let expectedCount = 0;
      if (goal.frequency.type === 'daily') {
        expectedCount = daysElapsed;
      } else if (goal.frequency.type === 'timesPerWeek') {
        const weeksElapsed = daysElapsed / 7;
        expectedCount = Math.floor(weeksElapsed * goal.frequency.count);
      } else if (goal.frequency.type === 'specificDays') {
        // Count occurrences of specific days within elapsed days
        const dayNames: DayOfWeek[] = [
          'sunday',
          'monday',
          'tuesday',
          'wednesday',
          'thursday',
          'friday',
          'saturday',
        ];
        let count = 0;
        for (let i = 0; i < daysElapsed; i++) {
          const date = new Date(startDate);
          date.setDate(date.getDate() + i);
          const dayName = dayNames[date.getDay()];
          if (goal.frequency.days.includes(dayName)) {
            count++;
          }
        }
        expectedCount = count;
      }

      const completionPercentage =
        expectedCount > 0 ? Math.min(100, (completedCount / expectedCount) * 100) : 0;

      return {
        goalId: goal.id,
        goalTitle: goal.title,
        completedCount,
        expectedCount,
        completionPercentage,
        totalDurationSeconds,
      };
    });

    return {
      roundId,
      daysRemaining,
      daysElapsed,
      totalDays,
      goalSummaries,
    };
  }
}
