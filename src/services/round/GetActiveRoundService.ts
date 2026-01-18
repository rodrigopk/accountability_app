import { RoundRepository } from '../../data/repositories/RoundRepository';
import { StorageAdapter } from '../../data/storage/StorageAdapter';
import { AccountabilityRound } from '../../types/AccountabilityRound';

/**
 * Service for getting the active accountability round.
 */
export class GetActiveRoundService {
  private repository: RoundRepository;

  constructor(repository?: RoundRepository) {
    this.repository = repository ?? new RoundRepository(new StorageAdapter());
  }

  /**
   * Get the active round for a device
   * @param deviceId Device ID
   * @returns Active AccountabilityRound or null
   */
  async execute(deviceId: string): Promise<AccountabilityRound | null> {
    return this.repository.getActiveRound(deviceId);
  }
}
