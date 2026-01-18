import { RoundRepository } from '../../data/repositories/RoundRepository';
import { StorageAdapter } from '../../data/storage/StorageAdapter';
import { AccountabilityRound } from '../../types/AccountabilityRound';

/**
 * Service for getting all accountability rounds for a device.
 */
export class GetAllRoundsService {
  private repository: RoundRepository;

  constructor(repository?: RoundRepository) {
    this.repository = repository ?? new RoundRepository(new StorageAdapter());
  }

  /**
   * Get all rounds for a device
   * @param deviceId Device ID
   * @returns Array of AccountabilityRound
   */
  async execute(deviceId: string): Promise<AccountabilityRound[]> {
    return this.repository.getRoundsByDevice(deviceId);
  }
}
