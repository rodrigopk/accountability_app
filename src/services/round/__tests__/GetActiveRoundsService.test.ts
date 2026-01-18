import { createMockRoundRepository } from '../../../__mocks__/repositories';
import { AccountabilityRound } from '../../../types/AccountabilityRound';
import { GetActiveRoundsService } from '../GetActiveRoundsService';

describe('GetActiveRoundsService', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-01-15'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should return only rounds where endDate >= now', async () => {
    const mockRepository = createMockRoundRepository();
    const service = new GetActiveRoundsService(mockRepository);

    const allRounds: AccountabilityRound[] = [
      {
        id: 'active-round',
        deviceId: 'device-123',
        startDate: '2026-01-01',
        endDate: '2026-01-31', // Active (ends in future)
        goals: [],
        reward: 'Active Reward',
        punishment: '',
        createdAt: '2026-01-01T00:00:00Z',
        updatedAt: '2026-01-01T00:00:00Z',
      },
      {
        id: 'expired-round',
        deviceId: 'device-123',
        startDate: '2025-12-01',
        endDate: '2025-12-31', // Expired (ended in past)
        goals: [],
        reward: 'Expired Reward',
        punishment: '',
        createdAt: '2025-12-01T00:00:00Z',
        updatedAt: '2025-12-01T00:00:00Z',
      },
    ];

    mockRepository.getRoundsByDevice.mockResolvedValue(allRounds);

    const result = await service.execute('device-123');

    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('active-round');
  });

  it('should return empty array when no active rounds exist', async () => {
    const mockRepository = createMockRoundRepository();
    const service = new GetActiveRoundsService(mockRepository);

    mockRepository.getRoundsByDevice.mockResolvedValue([]);

    const result = await service.execute('device-123');

    expect(result).toEqual([]);
  });

  it('should include rounds that end today', async () => {
    const mockRepository = createMockRoundRepository();
    const service = new GetActiveRoundsService(mockRepository);

    const allRounds: AccountabilityRound[] = [
      {
        id: 'ends-today',
        deviceId: 'device-123',
        startDate: '2026-01-01',
        endDate: '2026-01-15', // Ends today (should be included)
        goals: [],
        reward: 'Ends Today',
        punishment: '',
        createdAt: '2026-01-01T00:00:00Z',
        updatedAt: '2026-01-01T00:00:00Z',
      },
    ];

    mockRepository.getRoundsByDevice.mockResolvedValue(allRounds);

    const result = await service.execute('device-123');

    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('ends-today');
  });
});
