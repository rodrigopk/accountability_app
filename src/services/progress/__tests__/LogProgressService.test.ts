import {
  createMockProgressRepository,
  createMockRoundRepository,
} from '../../../__mocks__/repositories';
import { AccountabilityRound } from '../../../types/AccountabilityRound';
import { GoalProgress } from '../../../types/GoalProgress';
import { getTodayDateString } from '../../../utils/progressValidation';
import { LogProgressService } from '../LogProgressService';

// Helper to create a test round
function createTestRound(overrides: Partial<AccountabilityRound> = {}): AccountabilityRound {
  return {
    id: 'round-1',
    deviceId: 'device-1',
    startDate: '2026-01-01',
    endDate: '2026-01-31',
    goals: [
      {
        id: 'goal-1',
        title: 'Test Goal',
        frequency: { type: 'daily' },
        durationSeconds: 3600,
      },
    ],
    reward: 'Test reward',
    punishment: 'Test punishment',
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
    ...overrides,
  };
}

describe('LogProgressService', () => {
  let mockProgressRepository: ReturnType<typeof createMockProgressRepository>;
  let mockRoundRepository: ReturnType<typeof createMockRoundRepository>;
  let service: LogProgressService;

  beforeEach(() => {
    mockProgressRepository = createMockProgressRepository();
    mockRoundRepository = createMockRoundRepository();
    service = new LogProgressService(mockProgressRepository, mockRoundRepository);
  });

  it('should log progress with current timestamp and target date', async () => {
    const today = getTodayDateString();
    const round = createTestRound({
      startDate: '2026-01-01',
      endDate: '2026-12-31',
    });

    mockRoundRepository.getRoundById.mockResolvedValue(round);
    mockProgressRepository.getProgressForGoal.mockResolvedValue([]);

    const progress: GoalProgress = {
      id: 'progress-1',
      roundId: 'round-1',
      goalId: 'goal-1',
      targetDate: today,
      completedAt: '2026-01-18T10:00:00Z',
      durationSeconds: 3600,
      notes: 'Great session',
    };

    mockProgressRepository.logProgress.mockResolvedValue(progress);

    const result = await service.execute({
      roundId: 'round-1',
      goalId: 'goal-1',
      durationSeconds: 3600,
      notes: 'Great session',
    });

    expect(result).toEqual(progress);
    expect(mockProgressRepository.logProgress).toHaveBeenCalledWith(
      expect.objectContaining({
        roundId: 'round-1',
        goalId: 'goal-1',
        targetDate: today,
        durationSeconds: 3600,
        notes: 'Great session',
        completedAt: expect.any(String),
        isAmendment: false,
      }),
    );
  });

  it('should throw error if round not found', async () => {
    mockRoundRepository.getRoundById.mockResolvedValue(null);

    await expect(
      service.execute({
        roundId: 'non-existent',
        goalId: 'goal-1',
        durationSeconds: 3600,
      }),
    ).rejects.toThrow('Round with id non-existent not found');
  });

  it('should throw error if goal not found in round', async () => {
    const round = createTestRound();
    mockRoundRepository.getRoundById.mockResolvedValue(round);

    await expect(
      service.execute({
        roundId: 'round-1',
        goalId: 'non-existent-goal',
        durationSeconds: 3600,
      }),
    ).rejects.toThrow('Goal with id non-existent-goal not found in round round-1');
  });

  it('should throw error if progress already logged for target date', async () => {
    const today = getTodayDateString();
    const round = createTestRound({
      startDate: '2026-01-01',
      endDate: '2026-12-31',
    });

    mockRoundRepository.getRoundById.mockResolvedValue(round);
    mockProgressRepository.getProgressForGoal.mockResolvedValue([
      {
        id: 'existing-progress',
        roundId: 'round-1',
        goalId: 'goal-1',
        targetDate: today,
        completedAt: '2026-01-18T08:00:00Z',
        durationSeconds: 3600,
      },
    ]);

    await expect(
      service.execute({
        roundId: 'round-1',
        goalId: 'goal-1',
        durationSeconds: 3600,
      }),
    ).rejects.toThrow(`Progress already logged for ${today}`);
  });

  it('should throw error if target date is before round start', async () => {
    const round = createTestRound({
      startDate: '2026-02-01',
      endDate: '2026-02-28',
    });

    mockRoundRepository.getRoundById.mockResolvedValue(round);
    mockProgressRepository.getProgressForGoal.mockResolvedValue([]);

    await expect(
      service.execute({
        roundId: 'round-1',
        goalId: 'goal-1',
        durationSeconds: 3600,
        targetDate: '2026-01-15',
      }),
    ).rejects.toThrow('Cannot log progress for 2026-01-15: before round start date');
  });

  it('should throw error if target date is after round end', async () => {
    const round = createTestRound({
      startDate: '2026-01-01',
      endDate: '2026-01-15',
    });

    mockRoundRepository.getRoundById.mockResolvedValue(round);
    mockProgressRepository.getProgressForGoal.mockResolvedValue([]);

    await expect(
      service.execute({
        roundId: 'round-1',
        goalId: 'goal-1',
        durationSeconds: 3600,
        targetDate: '2026-01-20',
      }),
    ).rejects.toThrow('Cannot log progress for 2026-01-20: after round end date');
  });

  it('should throw error if target date is in the future', async () => {
    const round = createTestRound({
      startDate: '2026-01-01',
      endDate: '2026-12-31',
    });

    mockRoundRepository.getRoundById.mockResolvedValue(round);
    mockProgressRepository.getProgressForGoal.mockResolvedValue([]);

    await expect(
      service.execute({
        roundId: 'round-1',
        goalId: 'goal-1',
        durationSeconds: 3600,
        targetDate: '2030-01-01',
      }),
    ).rejects.toThrow('Cannot log progress for 2030-01-01: after round end date');
  });

  it('should throw error for specificDays goal on non-applicable day', async () => {
    const round = createTestRound({
      startDate: '2026-01-01',
      endDate: '2026-12-31',
      goals: [
        {
          id: 'goal-1',
          title: 'Test Goal',
          frequency: { type: 'specificDays', days: ['monday', 'wednesday'] },
          durationSeconds: 3600,
        },
      ],
    });

    mockRoundRepository.getRoundById.mockResolvedValue(round);
    mockProgressRepository.getProgressForGoal.mockResolvedValue([]);

    // 2026-01-15 is Thursday
    await expect(
      service.execute({
        roundId: 'round-1',
        goalId: 'goal-1',
        durationSeconds: 3600,
        targetDate: '2026-01-15',
      }),
    ).rejects.toThrow('2026-01-15 is not an applicable date for this goal');
  });

  it('should log progress as amendment when target date is in the past', async () => {
    const round = createTestRound({
      startDate: '2026-01-01',
      endDate: '2026-12-31',
    });

    mockRoundRepository.getRoundById.mockResolvedValue(round);
    mockProgressRepository.getProgressForGoal.mockResolvedValue([]);

    const pastDate = '2026-01-10';
    const progress: GoalProgress = {
      id: 'progress-1',
      roundId: 'round-1',
      goalId: 'goal-1',
      targetDate: pastDate,
      completedAt: '2026-01-18T10:00:00Z',
      durationSeconds: 3600,
      isAmendment: true,
    };

    mockProgressRepository.logProgress.mockResolvedValue(progress);

    await service.execute({
      roundId: 'round-1',
      goalId: 'goal-1',
      durationSeconds: 3600,
      targetDate: pastDate,
    });

    expect(mockProgressRepository.logProgress).toHaveBeenCalledWith(
      expect.objectContaining({
        targetDate: pastDate,
        isAmendment: true,
      }),
    );
  });

  it('should throw error when timesPerWeek quota is exceeded', async () => {
    const round = createTestRound({
      startDate: '2026-01-01',
      endDate: '2026-12-31',
      goals: [
        {
          id: 'goal-1',
          title: 'Test Goal',
          frequency: { type: 'timesPerWeek', count: 2 },
          durationSeconds: 3600,
        },
      ],
    });

    mockRoundRepository.getRoundById.mockResolvedValue(round);
    // Already logged 2 times this week (quota met)
    mockProgressRepository.getProgressForGoal.mockResolvedValue([
      {
        id: 'progress-1',
        roundId: 'round-1',
        goalId: 'goal-1',
        targetDate: '2026-01-12', // Monday of the week
        completedAt: '2026-01-12T10:00:00Z',
        durationSeconds: 3600,
      },
      {
        id: 'progress-2',
        roundId: 'round-1',
        goalId: 'goal-1',
        targetDate: '2026-01-14', // Wednesday of the week
        completedAt: '2026-01-14T10:00:00Z',
        durationSeconds: 3600,
      },
    ]);

    // Trying to log on 2026-01-15 (Thursday, same week)
    await expect(
      service.execute({
        roundId: 'round-1',
        goalId: 'goal-1',
        durationSeconds: 3600,
        targetDate: '2026-01-15',
      }),
    ).rejects.toThrow('Weekly quota of 2 already met');
  });
});
