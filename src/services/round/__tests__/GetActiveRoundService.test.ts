import { createMockRoundRepository } from '../../../__mocks__/repositories';
import { AccountabilityRound } from '../../../types/AccountabilityRound';
import { GetActiveRoundService } from '../GetActiveRoundService';

describe('GetActiveRoundService', () => {
  it('should return active round for device', async () => {
    const mockRepository = createMockRoundRepository();
    const service = new GetActiveRoundService(mockRepository);

    const round: AccountabilityRound = {
      id: 'round-1',
      deviceId: 'device-123',
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      goals: [],
      reward: 'Reward',
      punishment: 'Punishment',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    };

    mockRepository.getActiveRound.mockResolvedValue(round);

    const result = await service.execute('device-123');

    expect(result).toEqual(round);
    expect(mockRepository.getActiveRound).toHaveBeenCalledWith('device-123');
  });

  it('should return null when no active round exists', async () => {
    const mockRepository = createMockRoundRepository();
    const service = new GetActiveRoundService(mockRepository);

    mockRepository.getActiveRound.mockResolvedValue(null);

    const result = await service.execute('device-123');

    expect(result).toBeNull();
  });
});
