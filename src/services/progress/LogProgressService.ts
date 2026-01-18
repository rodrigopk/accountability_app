import { ProgressRepository } from '../../data/repositories/ProgressRepository';
import { RoundRepository } from '../../data/repositories/RoundRepository';
import { StorageAdapter } from '../../data/storage/StorageAdapter';
import { GoalProgress } from '../../types/GoalProgress';
import {
  getTodayDateString,
  isDateApplicableForGoal,
  getWeekBoundaries,
} from '../../utils/progressValidation';
import { LogProgressInput } from '../types';

/**
 * Service for logging progress for a goal.
 */
export class LogProgressService {
  private progressRepository: ProgressRepository;
  private roundRepository: RoundRepository;

  constructor(progressRepository?: ProgressRepository, roundRepository?: RoundRepository) {
    const storage = new StorageAdapter();
    this.progressRepository = progressRepository ?? new ProgressRepository(storage);
    this.roundRepository = roundRepository ?? new RoundRepository(storage);
  }

  /**
   * Log progress for a goal
   * @param input Progress logging input
   * @returns Created GoalProgress
   * @throws Error if validation fails
   */
  async execute(input: LogProgressInput): Promise<GoalProgress> {
    const round = await this.roundRepository.getRoundById(input.roundId);

    if (!round) {
      throw new Error(`Round with id ${input.roundId} not found`);
    }

    const goal = round.goals.find(g => g.id === input.goalId);

    if (!goal) {
      throw new Error(`Goal with id ${input.goalId} not found in round ${input.roundId}`);
    }

    const existingProgress = await this.progressRepository.getProgressForGoal(
      input.roundId,
      input.goalId,
    );

    const today = getTodayDateString();
    const targetDate = input.targetDate ?? today;
    const isAmendment = targetDate !== today;

    // Validate: check if target date is within round period
    const roundStartDate = round.startDate.split('T')[0];
    const roundEndDate = round.endDate.split('T')[0];

    if (targetDate < roundStartDate) {
      throw new Error(`Cannot log progress for ${targetDate}: before round start date`);
    }

    if (targetDate > roundEndDate) {
      throw new Error(`Cannot log progress for ${targetDate}: after round end date`);
    }

    // For non-amendments, cannot log for future dates
    if (targetDate > today) {
      throw new Error(`Cannot log progress for future date ${targetDate}`);
    }

    // Validate: check if already logged for this target date
    const alreadyLogged = existingProgress.some(p => p.targetDate === targetDate);
    if (alreadyLogged) {
      throw new Error(`Progress already logged for ${targetDate}`);
    }

    // Validate: check if date is applicable for this goal
    if (!isDateApplicableForGoal(targetDate, goal.frequency)) {
      throw new Error(`${targetDate} is not an applicable date for this goal`);
    }

    // For timesPerWeek: check week quota not exceeded
    if (goal.frequency.type === 'timesPerWeek') {
      const { start, end } = getWeekBoundaries(targetDate);
      const weekProgress = existingProgress.filter(
        p => p.targetDate >= start && p.targetDate <= end,
      );
      if (weekProgress.length >= goal.frequency.count) {
        throw new Error(`Weekly quota of ${goal.frequency.count} already met`);
      }
    }

    return this.progressRepository.logProgress({
      roundId: input.roundId,
      goalId: input.goalId,
      targetDate,
      completedAt: new Date().toISOString(),
      durationSeconds: input.durationSeconds,
      notes: input.notes,
      isAmendment,
    });
  }
}
