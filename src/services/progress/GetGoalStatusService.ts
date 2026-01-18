import { ProgressRepository } from '../../data/repositories/ProgressRepository';
import { RoundRepository } from '../../data/repositories/RoundRepository';
import { StorageAdapter } from '../../data/storage/StorageAdapter';
import {
  getTodayDateString,
  isDateApplicableForGoal,
  canLogProgressForToday,
  getAmendableDates,
  getGoalStatusByDate,
} from '../../utils/progressValidation';
import { GoalStatusResult, GoalIntervalStatus } from '../types';

/**
 * Service for getting the current status of a goal including failed and amendable dates.
 */
export class GetGoalStatusService {
  private roundRepository: RoundRepository;
  private progressRepository: ProgressRepository;

  constructor(roundRepository?: RoundRepository, progressRepository?: ProgressRepository) {
    const storage = new StorageAdapter();
    this.roundRepository = roundRepository ?? new RoundRepository(storage);
    this.progressRepository = progressRepository ?? new ProgressRepository(storage);
  }

  /**
   * Get the current status of a goal
   * @param roundId Round ID
   * @param goalId Goal ID
   * @returns GoalStatusResult
   */
  async execute(roundId: string, goalId: string): Promise<GoalStatusResult> {
    const round = await this.roundRepository.getRoundById(roundId);

    if (!round) {
      throw new Error(`Round with id ${roundId} not found`);
    }

    const goal = round.goals.find(g => g.id === goalId);

    if (!goal) {
      throw new Error(`Goal with id ${goalId} not found in round ${roundId}`);
    }

    const progress = await this.progressRepository.getProgressForGoal(roundId, goalId);

    const today = getTodayDateString();
    const roundStartDate = round.startDate.split('T')[0];
    const roundEndDate = round.endDate.split('T')[0];

    // Check if user can log progress today
    const canLogResult = canLogProgressForToday(goal, progress, roundStartDate, roundEndDate);

    // Get today's status
    let todayStatus: GoalIntervalStatus = 'pending';
    if (today < roundStartDate) {
      todayStatus = 'not_applicable';
    } else if (today > roundEndDate) {
      todayStatus = 'not_applicable';
    } else if (!isDateApplicableForGoal(today, goal.frequency)) {
      todayStatus = 'not_applicable';
    } else {
      const hasProgressToday = progress.some(p => p.targetDate === today);
      todayStatus = hasProgressToday ? 'completed' : 'pending';
    }

    // Get all statuses to compute failed and completed dates
    const effectiveEndDate = today <= roundEndDate ? today : roundEndDate;
    const statuses = getGoalStatusByDate(goal, progress, roundStartDate, effectiveEndDate);

    const failedDates = statuses.filter(s => s.status === 'failed').map(s => s.date);

    const completedDates = statuses.filter(s => s.status === 'completed').map(s => s.date);

    // Get amendable dates (failed dates that can be recovered)
    const amendableDates = getAmendableDates(goal, progress, roundStartDate, roundEndDate);

    return {
      canLogToday: canLogResult.canLog,
      reason: canLogResult.reason,
      todayStatus,
      failedDates,
      amendableDates,
      completedDates,
    };
  }
}
