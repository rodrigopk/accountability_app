import { RoundRepository } from '../../data/repositories/RoundRepository';
import { StorageAdapter } from '../../data/storage/StorageAdapter';
import { AccountabilityRound } from '../../types/AccountabilityRound';
import { Goal, DEFAULT_NOTIFICATION_TIME } from '../../types/Goal';
import { generateUUID } from '../../utils/uuidUtils';
import { NotificationProvider } from '../notifications/NotificationProvider';
import { NotificationService } from '../notifications/NotificationService';
import { CreateRoundInput } from '../types';

/**
 * Service for creating accountability rounds.
 */
export class CreateRoundService {
  private repository: RoundRepository;
  private notificationService?: NotificationService;

  constructor(repository?: RoundRepository, notificationProvider?: NotificationProvider) {
    this.repository = repository ?? new RoundRepository(new StorageAdapter());
    if (notificationProvider) {
      this.notificationService = new NotificationService(notificationProvider);
    }
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
      notificationTime: goal.notificationTime || DEFAULT_NOTIFICATION_TIME,
    }));

    const round = await this.repository.createRound(input.deviceId, {
      startDate: input.startDate,
      endDate: input.endDate,
      goals,
      reward: input.reward,
      punishment: input.punishment,
    });

    // Schedule notifications
    if (this.notificationService) {
      await this.notificationService.scheduleForRound(round);
    }

    return round;
  }
}
