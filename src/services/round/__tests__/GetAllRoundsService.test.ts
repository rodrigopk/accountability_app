import { createMockRoundRepository } from '../../../__mocks__/repositories';
import { AccountabilityRound } from '../../../types/AccountabilityRound';
import { GetAllRoundsService } from '../GetAllRoundsService';

describe('GetAllRoundsService', () => {
  it('should return all rounds for device', async () => {
    const mockRepository = createMockRoundRepository();
    const service = new GetAllRoundsService(mockRepository);

    const rounds: AccountabilityRound[] = [
      {
        id: 'round-1',
        deviceId: 'device-123',
        startDate: '2024-01-01',
        endDate: '2024-01-31',
        goals: [],
        reward: 'Reward 1',
        punishment: 'Punishment 1',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      },
      {
        id: 'round-2',
        deviceId: 'device-123',
        startDate: '2024-02-01',
        endDate: '2024-02-28',
        goals: [],
        reward: 'Reward 2',
        punishment: 'Punishment 2',
        createdAt: '2024-02-01T00:00:00Z',
        updatedAt: '2024-02-01T00:00:00Z',
      },
    ];

    mockRepository.getRoundsByDevice.mockResolvedValue(rounds);

    const result = await service.execute('device-123');

    expect(result).toEqual(rounds);
    expect(mockRepository.getRoundsByDevice).toHaveBeenCalledWith('device-123');
  });
});
