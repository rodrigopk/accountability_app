import { ProgressRepository } from '../../data/repositories/ProgressRepository';
import { RoundRepository } from '../../data/repositories/RoundRepository';
import { StorageAdapter } from '../../data/storage/StorageAdapter';

/**
 * Service for deleting accountability rounds.
 * Handles cascade deletion of associated progress entries.
 */
export class DeleteRoundService {
  private roundRepository: RoundRepository;
  private progressRepository: ProgressRepository;

  constructor(roundRepository?: RoundRepository, progressRepository?: ProgressRepository) {
    const storage = new StorageAdapter();
    this.roundRepository = roundRepository ?? new RoundRepository(storage);
    this.progressRepository = progressRepository ?? new ProgressRepository(storage);
  }

  /**
   * Delete a round and all associated progress entries
   * @param roundId Round ID
   * @throws Error if round not found
   */
  async execute(roundId: string): Promise<void> {
    // Delete associated progress first (cascade delete)
    await this.progressRepository.deleteProgressForRound(roundId);

    // Then delete the round
    await this.roundRepository.deleteRound(roundId);
  }
}
