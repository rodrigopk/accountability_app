import { ProgressRepository } from '../../data/repositories/ProgressRepository';
import { RoundRepository } from '../../data/repositories/RoundRepository';
import { StorageAdapter } from '../../data/storage/StorageAdapter';
import { NotificationProvider } from '../notifications/NotificationProvider';
import { NotificationService } from '../notifications/NotificationService';

/**
 * Service for deleting accountability rounds.
 * Handles cascade deletion of associated progress entries.
 */
export class DeleteRoundService {
  private roundRepository: RoundRepository;
  private progressRepository: ProgressRepository;
  private notificationService?: NotificationService;

  constructor(
    roundRepository?: RoundRepository,
    progressRepository?: ProgressRepository,
    notificationProvider?: NotificationProvider,
  ) {
    const storage = new StorageAdapter();
    this.roundRepository = roundRepository ?? new RoundRepository(storage);
    this.progressRepository = progressRepository ?? new ProgressRepository(storage);
    if (notificationProvider) {
      this.notificationService = new NotificationService(notificationProvider);
    }
  }

  /**
   * Delete a round and all associated progress entries
   * @param roundId Round ID
   * @throws Error if round not found
   */
  async execute(roundId: string): Promise<void> {
    // Cancel notifications first
    if (this.notificationService) {
      await this.notificationService.cancelForRound(roundId);
    }

    // Delete associated progress (cascade delete)
    await this.progressRepository.deleteProgressForRound(roundId);

    // Then delete the round
    await this.roundRepository.deleteRound(roundId);
  }
}
