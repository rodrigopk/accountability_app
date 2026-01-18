import { ProgressRepository } from '../../data/repositories/ProgressRepository';
import { StorageAdapter } from '../../data/storage/StorageAdapter';
import { GoalProgress } from '../../types/GoalProgress';

/**
 * Service for getting progress entries for a round.
 */
export class GetProgressForRoundService {
  private repository: ProgressRepository;

  constructor(repository?: ProgressRepository) {
    this.repository = repository ?? new ProgressRepository(new StorageAdapter());
  }

  /**
   * Get all progress entries for a round
   * @param roundId Round ID
   * @returns Array of GoalProgress
   */
  async execute(roundId: string): Promise<GoalProgress[]> {
    return this.repository.getProgressForRound(roundId);
  }
}
