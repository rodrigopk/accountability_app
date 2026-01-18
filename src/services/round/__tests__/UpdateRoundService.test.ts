import { createMockRoundRepository } from '../../../__mocks__/repositories';
import { AccountabilityRound } from '../../../types/AccountabilityRound';
import { UpdateRoundService } from '../UpdateRoundService';

describe('UpdateRoundService', () => {
  it('should update an existing round', async () => {
    const mockRepository = createMockRoundRepository();
    const service = new UpdateRoundService(mockRepository);

    const updatedRound: AccountabilityRound = {
      id: 'round-1',
      deviceId: 'device-123',
      startDate: '2024-01-01',
      endDate: '2024-01-31',
      goals: [],
      reward: 'New reward',
      punishment: 'New punishment',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-02T00:00:00Z',
    };

    mockRepository.updateRound.mockResolvedValue(updatedRound);

    const result = await service.execute('round-1', {
      reward: 'New reward',
      punishment: 'New punishment',
    });

    expect(result).toEqual(updatedRound);
    expect(mockRepository.updateRound).toHaveBeenCalledWith('round-1', {
      reward: 'New reward',
      punishment: 'New punishment',
    });
  });
});
