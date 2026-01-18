import { RoundRepository } from '../../data/repositories/RoundRepository';
import { StorageAdapter } from '../../data/storage/StorageAdapter';
import { AccountabilityRound } from '../../types/AccountabilityRound';
import { Goal } from '../../types/Goal';
import { generateUUID } from '../../utils/uuidUtils';
import { CreateGoalInput } from '../types';

/**
 * Service for adding a goal to an existing round.
 */
export class AddGoalToRoundService {
  private repository: RoundRepository;

  constructor(repository?: RoundRepository) {
    this.repository = repository ?? new RoundRepository(new StorageAdapter());
  }

  /**
   * Add a goal to an existing round
   * @param roundId Round ID
   * @param goal Goal creation input
   * @returns Updated AccountabilityRound
   */
  async execute(roundId: string, goal: CreateGoalInput): Promise<AccountabilityRound> {
    const round = await this.repository.getRoundById(roundId);

    if (!round) {
      throw new Error(`Round with id ${roundId} not found`);
    }

    const newGoal: Goal = {
      ...goal,
      id: generateUUID(),
    };

    const updatedGoals = [...round.goals, newGoal];

    return this.repository.updateRound(roundId, { goals: updatedGoals });
  }
}
