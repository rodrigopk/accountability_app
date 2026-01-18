import { RoundRepository } from '../../data/repositories/RoundRepository';
import { StorageAdapter } from '../../data/storage/StorageAdapter';
import { AccountabilityRound } from '../../types/AccountabilityRound';
import { UpdateRoundInput } from '../types';

/**
 * Service for updating accountability rounds.
 */
export class UpdateRoundService {
  private repository: RoundRepository;

  constructor(repository?: RoundRepository) {
    this.repository = repository ?? new RoundRepository(new StorageAdapter());
  }

  /**
   * Update an existing round
   * @param roundId Round ID
   * @param updates Partial updates
   * @returns Updated AccountabilityRound
   */
  async execute(roundId: string, updates: UpdateRoundInput): Promise<AccountabilityRound> {
    return this.repository.updateRound(roundId, updates);
  }
}
