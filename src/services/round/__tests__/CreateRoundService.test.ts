import { createMockRoundRepository } from '../../../__mocks__/repositories';
import { AccountabilityRound } from '../../../types/AccountabilityRound';
import { CreateRoundService } from '../CreateRoundService';

describe('CreateRoundService', () => {
  it('should create a round with generated goal IDs', async () => {
    const mockRepository = createMockRoundRepository();
    const service = new CreateRoundService(mockRepository);

    const input = {
      deviceId: 'device-123',
      startDate: '2024-01-01',
      endDate: '2024-01-31',
      goals: [
        {
          title: 'Exercise',
          frequency: { type: 'daily' as const },
          durationSeconds: 3600,
        },
        {
          title: 'Meditate',
          description: 'Daily meditation',
          frequency: { type: 'timesPerWeek' as const, count: 4 },
          durationSeconds: 1800,
        },
      ],
      reward: 'Buy a book',
      punishment: 'Donate $50',
    };

    const createdRound: AccountabilityRound = {
      id: 'round-1',
      deviceId: 'device-123',
      startDate: '2024-01-01',
      endDate: '2024-01-31',
      goals: [
        {
          id: 'goal-1',
          title: 'Exercise',
          frequency: { type: 'daily' },
          durationSeconds: 3600,
        },
        {
          id: 'goal-2',
          title: 'Meditate',
          description: 'Daily meditation',
          frequency: { type: 'timesPerWeek', count: 4 },
          durationSeconds: 1800,
        },
      ],
      reward: 'Buy a book',
      punishment: 'Donate $50',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    };

    mockRepository.createRound.mockResolvedValue(createdRound);

    const result = await service.execute(input);

    expect(result).toEqual(createdRound);
    expect(mockRepository.createRound).toHaveBeenCalledWith(
      'device-123',
      expect.objectContaining({
        startDate: '2024-01-01',
        endDate: '2024-01-31',
        goals: expect.arrayContaining([
          expect.objectContaining({
            title: 'Exercise',
            id: expect.any(String),
          }),
          expect.objectContaining({
            title: 'Meditate',
            id: expect.any(String),
          }),
        ]),
        reward: 'Buy a book',
        punishment: 'Donate $50',
      }),
    );
  });
});
