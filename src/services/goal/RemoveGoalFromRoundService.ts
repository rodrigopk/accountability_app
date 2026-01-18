import { RoundRepository } from '../../data/repositories/RoundRepository';
import { StorageAdapter } from '../../data/storage/StorageAdapter';
import { AccountabilityRound } from '../../types/AccountabilityRound';

/**
 * Service for removing a goal from a round.
 */
export class RemoveGoalFromRoundService {
  private repository: RoundRepository;

  constructor(repository?: RoundRepository) {
    this.repository = repository ?? new RoundRepository(new StorageAdapter());
  }

  /**
   * Remove a goal from a round
   * @param roundId Round ID
   * @param goalId Goal ID
   * @returns Updated AccountabilityRound
   */
  async execute(roundId: string, goalId: string): Promise<AccountabilityRound> {
    const round = await this.repository.getRoundById(roundId);

    if (!round) {
      throw new Error(`Round with id ${roundId} not found`);
    }

    const updatedGoals = round.goals.filter(g => g.id !== goalId);

    if (updatedGoals.length === round.goals.length) {
      throw new Error(`Goal with id ${goalId} not found in round ${roundId}`);
    }

    return this.repository.updateRound(roundId, { goals: updatedGoals });
  }
}
