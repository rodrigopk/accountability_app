import {
  createMockRoundRepository,
  createMockProgressRepository,
} from '../../../__mocks__/repositories';
import { AccountabilityRound } from '../../../types/AccountabilityRound';
import { GoalProgress } from '../../../types/GoalProgress';
import { GetProgressSummaryService } from '../GetProgressSummaryService';

describe('GetProgressSummaryService', () => {
  it('should calculate progress summary for daily goals', async () => {
    const now = new Date('2024-01-15T12:00:00Z');
    jest.useFakeTimers();
    jest.setSystemTime(now);

    const mockRoundRepository = createMockRoundRepository();
    const mockProgressRepository = createMockProgressRepository();
    const service = new GetProgressSummaryService(mockRoundRepository, mockProgressRepository);

    const round: AccountabilityRound = {
      id: 'round-1',
      deviceId: 'device-123',
      startDate: '2024-01-01',
      endDate: '2024-01-31',
      goals: [
        {
          id: 'goal-1',
          title: 'Daily Exercise',
          frequency: { type: 'daily' },
          durationSeconds: 3600,
        },
      ],
      reward: 'Reward',
      punishment: 'Punishment',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    };

    const progress: GoalProgress[] = [
      {
        id: 'progress-1',
        roundId: 'round-1',
        goalId: 'goal-1',
        completedAt: '2024-01-10T10:00:00Z',
        durationSeconds: 3600,
      },
      {
        id: 'progress-2',
        roundId: 'round-1',
        goalId: 'goal-1',
        completedAt: '2024-01-12T10:00:00Z',
        durationSeconds: 3600,
      },
    ];

    mockRoundRepository.getRoundById.mockResolvedValue(round);
    mockProgressRepository.getProgressForRound.mockResolvedValue(progress);

    const result = await service.execute('round-1');

    expect(result.roundId).toBe('round-1');
    expect(result.daysElapsed).toBe(15); // Jan 1 to Jan 15 (inclusive)
    expect(result.totalDays).toBe(31); // Jan 1 to Jan 31 (inclusive)
    expect(result.daysRemaining).toBe(16);
    expect(result.goalSummaries).toHaveLength(1);
    expect(result.goalSummaries[0].completedCount).toBe(2);
    expect(result.goalSummaries[0].expectedCount).toBe(15); // 15 days elapsed
    expect(result.goalSummaries[0].completionPercentage).toBeCloseTo(13.33, 1); // 2/15 * 100

    jest.useRealTimers();
  });

  it('should calculate progress summary for timesPerWeek goals', async () => {
    const now = new Date('2024-01-15T12:00:00Z');
    jest.useFakeTimers();
    jest.setSystemTime(now);

    const mockRoundRepository = createMockRoundRepository();
    const mockProgressRepository = createMockProgressRepository();
    const service = new GetProgressSummaryService(mockRoundRepository, mockProgressRepository);

    const round: AccountabilityRound = {
      id: 'round-1',
      deviceId: 'device-123',
      startDate: '2024-01-01',
      endDate: '2024-01-31',
      goals: [
        {
          id: 'goal-1',
          title: 'Exercise 3x per week',
          frequency: { type: 'timesPerWeek', count: 3 },
          durationSeconds: 3600,
        },
      ],
      reward: 'Reward',
      punishment: 'Punishment',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    };

    const progress: GoalProgress[] = [
      {
        id: 'progress-1',
        roundId: 'round-1',
        goalId: 'goal-1',
        completedAt: '2024-01-05T10:00:00Z',
        durationSeconds: 3600,
      },
    ];

    mockRoundRepository.getRoundById.mockResolvedValue(round);
    mockProgressRepository.getProgressForRound.mockResolvedValue(progress);

    const result = await service.execute('round-1');

    // 15 days elapsed = ~2.1 weeks, so expected count = floor(2.1 * 3) = 6
    expect(result.goalSummaries[0].expectedCount).toBe(6);
    expect(result.goalSummaries[0].completedCount).toBe(1);

    jest.useRealTimers();
  });

  it('should throw error when round not found', async () => {
    const mockRoundRepository = createMockRoundRepository();
    const mockProgressRepository = createMockProgressRepository();
    const service = new GetProgressSummaryService(mockRoundRepository, mockProgressRepository);

    mockRoundRepository.getRoundById.mockResolvedValue(null);

    await expect(service.execute('non-existent')).rejects.toThrow(
      'Round with id non-existent not found',
    );
  });
});
