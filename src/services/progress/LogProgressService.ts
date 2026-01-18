import { ProgressRepository } from '../../data/repositories/ProgressRepository';
import { StorageAdapter } from '../../data/storage/StorageAdapter';
import { GoalProgress } from '../../types/GoalProgress';
import { LogProgressInput } from '../types';

/**
 * Service for logging progress for a goal.
 */
export class LogProgressService {
  private repository: ProgressRepository;

  constructor(repository?: ProgressRepository) {
    this.repository = repository ?? new ProgressRepository(new StorageAdapter());
  }

  /**
   * Log progress for a goal
   * @param input Progress logging input
   * @returns Created GoalProgress
   */
  async execute(input: LogProgressInput): Promise<GoalProgress> {
    return this.repository.logProgress({
      roundId: input.roundId,
      goalId: input.goalId,
      completedAt: new Date().toISOString(),
      durationSeconds: input.durationSeconds,
      notes: input.notes,
    });
  }
}
