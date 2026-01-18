import { createMockRoundRepository } from '../../../__mocks__/repositories';
import { AccountabilityRound } from '../../../types/AccountabilityRound';
import { AddGoalToRoundService } from '../AddGoalToRoundService';

describe('AddGoalToRoundService', () => {
  it('should add a goal to an existing round', async () => {
    const mockRepository = createMockRoundRepository();
    const service = new AddGoalToRoundService(mockRepository);

    const existingRound: AccountabilityRound = {
      id: 'round-1',
      deviceId: 'device-123',
      startDate: '2024-01-01',
      endDate: '2024-01-31',
      goals: [
        {
          id: 'goal-1',
          title: 'Existing goal',
          frequency: { type: 'daily' },
          durationSeconds: 3600,
        },
      ],
      reward: 'Reward',
      punishment: 'Punishment',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    };

    const updatedRound: AccountabilityRound = {
      ...existingRound,
      goals: [
        ...existingRound.goals,
        {
          id: 'goal-2',
          title: 'New goal',
          frequency: { type: 'daily' },
          durationSeconds: 1800,
        },
      ],
      updatedAt: '2024-01-02T00:00:00Z',
    };

    mockRepository.getRoundById.mockResolvedValue(existingRound);
    mockRepository.updateRound.mockResolvedValue(updatedRound);

    const result = await service.execute('round-1', {
      title: 'New goal',
      frequency: { type: 'daily' },
      durationSeconds: 1800,
    });

    expect(result.goals).toHaveLength(2);
    expect(result.goals[1]).toMatchObject({
      title: 'New goal',
      frequency: { type: 'daily' },
      durationSeconds: 1800,
    });
    expect(result.goals[1].id).toBeDefined();
  });

  it('should throw error when round not found', async () => {
    const mockRepository = createMockRoundRepository();
    const service = new AddGoalToRoundService(mockRepository);

    mockRepository.getRoundById.mockResolvedValue(null);

    await expect(
      service.execute('non-existent', {
        title: 'Goal',
        frequency: { type: 'daily' },
        durationSeconds: 3600,
      }),
    ).rejects.toThrow('Round with id non-existent not found');
  });
});
