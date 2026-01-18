import { createMockRoundRepository } from '../../../__mocks__/repositories';
import { AccountabilityRound } from '../../../types/AccountabilityRound';
import { UpdateGoalService } from '../UpdateGoalService';

describe('UpdateGoalService', () => {
  it('should update a goal within a round', async () => {
    const mockRepository = createMockRoundRepository();
    const service = new UpdateGoalService(mockRepository);

    const existingRound: AccountabilityRound = {
      id: 'round-1',
      deviceId: 'device-123',
      startDate: '2024-01-01',
      endDate: '2024-01-31',
      goals: [
        {
          id: 'goal-1',
          title: 'Old title',
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
        {
          id: 'goal-1',
          title: 'New title',
          frequency: { type: 'daily' },
          durationSeconds: 1800,
        },
      ],
      updatedAt: '2024-01-02T00:00:00Z',
    };

    mockRepository.getRoundById.mockResolvedValue(existingRound);
    mockRepository.updateRound.mockResolvedValue(updatedRound);

    const result = await service.execute('round-1', 'goal-1', {
      title: 'New title',
      durationSeconds: 1800,
    });

    expect(result.goals[0].title).toBe('New title');
    expect(result.goals[0].durationSeconds).toBe(1800);
  });

  it('should throw error when round not found', async () => {
    const mockRepository = createMockRoundRepository();
    const service = new UpdateGoalService(mockRepository);

    mockRepository.getRoundById.mockResolvedValue(null);

    await expect(service.execute('non-existent', 'goal-1', { title: 'New title' })).rejects.toThrow(
      'Round with id non-existent not found',
    );
  });

  it('should throw error when goal not found', async () => {
    const mockRepository = createMockRoundRepository();
    const service = new UpdateGoalService(mockRepository);

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

    await expect(
      service.execute('round-1', 'non-existent', { title: 'New title' }),
    ).rejects.toThrow('Goal with id non-existent not found in round round-1');
  });
});
