import { RoundRepository } from '../../data/repositories/RoundRepository';
import { StorageAdapter } from '../../data/storage/StorageAdapter';
import { AccountabilityRound } from '../../types/AccountabilityRound';
import { UpdateGoalInput } from '../types';

/**
 * Service for updating a goal within a round.
 */
export class UpdateGoalService {
  private repository: RoundRepository;

  constructor(repository?: RoundRepository) {
    this.repository = repository ?? new RoundRepository(new StorageAdapter());
  }

  /**
   * Update a goal within a round
   * @param roundId Round ID
   * @param goalId Goal ID
   * @param updates Partial goal updates
   * @returns Updated AccountabilityRound
   */
  async execute(
    roundId: string,
    goalId: string,
    updates: UpdateGoalInput,
  ): Promise<AccountabilityRound> {
    const round = await this.repository.getRoundById(roundId);

    if (!round) {
      throw new Error(`Round with id ${roundId} not found`);
    }

    const goalIndex = round.goals.findIndex(g => g.id === goalId);
    if (goalIndex === -1) {
      throw new Error(`Goal with id ${goalId} not found in round ${roundId}`);
    }

    const updatedGoals = [...round.goals];
    updatedGoals[goalIndex] = {
      ...updatedGoals[goalIndex],
      ...updates,
    };

    return this.repository.updateRound(roundId, { goals: updatedGoals });
  }
}
