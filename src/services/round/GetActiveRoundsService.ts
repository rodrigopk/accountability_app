import { RoundRepository } from '../../data/repositories/RoundRepository';
import { StorageAdapter } from '../../data/storage/StorageAdapter';
import { AccountabilityRound } from '../../types/AccountabilityRound';

/**
 * Service for getting all active accountability rounds for a device.
 * Returns rounds where endDate >= now.
 */
export class GetActiveRoundsService {
  private repository: RoundRepository;

  constructor(repository?: RoundRepository) {
    this.repository = repository ?? new RoundRepository(new StorageAdapter());
  }

  /**
   * Get all active rounds for a device (where endDate >= now)
   * @param deviceId Device ID
   * @returns Array of active AccountabilityRound
   */
  async execute(deviceId: string): Promise<AccountabilityRound[]> {
    const allRounds = await this.repository.getRoundsByDevice(deviceId);
    const now = new Date().toISOString();

    // Filter to only return rounds that haven't ended
    return allRounds.filter((round) => round.endDate >= now);
  }
}
