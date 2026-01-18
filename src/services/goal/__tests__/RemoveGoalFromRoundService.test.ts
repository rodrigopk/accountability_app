import { createMockRoundRepository } from '../../../__mocks__/repositories';
import { AccountabilityRound } from '../../../types/AccountabilityRound';
import { RemoveGoalFromRoundService } from '../RemoveGoalFromRoundService';

describe('RemoveGoalFromRoundService', () => {
  it('should remove a goal from a round', async () => {
    const mockRepository = createMockRoundRepository();
    const service = new RemoveGoalFromRoundService(mockRepository);

    const existingRound: AccountabilityRound = {
      id: 'round-1',
      deviceId: 'device-123',
      startDate: '2024-01-01',
      endDate: '2024-01-31',
      goals: [
        {
          id: 'goal-1',
          title: 'Goal 1',
          frequency: { type: 'daily' },
          durationSeconds: 3600,
        },
        {
          id: 'goal-2',
          title: 'Goal 2',
          frequency: { type: 'daily' },
          durationSeconds: 1800,
        },
      ],
      reward: 'Reward',
      punishment: 'Punishment',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    };

    const updatedRound: AccountabilityRound = {
      ...existingRound,
      goals: [existingRound.goals[0]],
      updatedAt: '2024-01-02T00:00:00Z',
    };

    mockRepository.getRoundById.mockResolvedValue(existingRound);
    mockRepository.updateRound.mockResolvedValue(updatedRound);

    const result = await service.execute('round-1', 'goal-2');

    expect(result.goals).toHaveLength(1);
    expect(result.goals[0].id).toBe('goal-1');
  });

  it('should throw error when round not found', async () => {
    const mockRepository = createMockRoundRepository();
    const service = new RemoveGoalFromRoundService(mockRepository);

    mockRepository.getRoundById.mockResolvedValue(null);

    await expect(service.execute('non-existent', 'goal-1')).rejects.toThrow(
      'Round with id non-existent not found',
    );
  });

  it('should throw error when goal not found', async () => {
    const mockRepository = createMockRoundRepository();
    const service = new RemoveGoalFromRoundService(mockRepository);

    const existingRound: AccountabilityRound = {
      id: 'round-1',
      deviceId: 'device-123',
      startDate: '2024-01-01',
      endDate: '2024-01-31',
      goals: [],
      reward: 'Reward',
      punishment: 'Punishment',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    };

    mockRepository.getRoundById.mockResolvedValue(existingRound);

    await expect(service.execute('round-1', 'non-existent')).rejects.toThrow(
      'Goal with id non-existent not found in round round-1',
    );
  });
});
