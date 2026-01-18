import { RoundRepository } from '../../data/repositories/RoundRepository';
import { StorageAdapter } from '../../data/storage/StorageAdapter';
import { AccountabilityRound } from '../../types/AccountabilityRound';
import { Goal } from '../../types/Goal';
import { generateUUID } from '../../utils/uuidUtils';
import { CreateRoundInput } from '../types';

/**
 * Service for creating accountability rounds.
 */
export class CreateRoundService {
  private repository: RoundRepository;

  constructor(repository?: RoundRepository) {
    this.repository = repository ?? new RoundRepository(new StorageAdapter());
  }

  /**
   * Create a new accountability round
   * @param input Round creation input
   * @returns Created AccountabilityRound
   */
  async execute(input: CreateRoundInput): Promise<AccountabilityRound> {
    const goals: Goal[] = input.goals.map(goal => ({
      ...goal,
      id: generateUUID(),
    }));

    return this.repository.createRound(input.deviceId, {
      startDate: input.startDate,
      endDate: input.endDate,
      goals,
      reward: input.reward,
      punishment: input.punishment,
    });
  }
}
