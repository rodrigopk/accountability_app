import {
  createMockProgressRepository,
  createMockRoundRepository,
} from '../../../__mocks__/repositories';
import { AccountabilityRound } from '../../../types/AccountabilityRound';
import { GoalProgress } from '../../../types/GoalProgress';
import { GetGoalStatusService } from '../GetGoalStatusService';

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
        title: 'Daily Goal',
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

// Helper to create progress entries
function createProgress(targetDate: string): GoalProgress {
  return {
    id: `progress-${targetDate}`,
    roundId: 'round-1',
    goalId: 'goal-1',
    targetDate,
    completedAt: `${targetDate}T12:00:00Z`,
    durationSeconds: 3600,
  };
}

describe('GetGoalStatusService', () => {
  let mockProgressRepository: ReturnType<typeof createMockProgressRepository>;
  let mockRoundRepository: ReturnType<typeof createMockRoundRepository>;
  let service: GetGoalStatusService;

  beforeEach(() => {
    mockProgressRepository = createMockProgressRepository();
    mockRoundRepository = createMockRoundRepository();
    service = new GetGoalStatusService(mockRoundRepository, mockProgressRepository);
  });

  it('should throw error if round not found', async () => {
    mockRoundRepository.getRoundById.mockResolvedValue(null);

    await expect(service.execute('non-existent', 'goal-1')).rejects.toThrow(
      'Round with id non-existent not found',
    );
  });

  it('should throw error if goal not found in round', async () => {
    const round = createTestRound();
    mockRoundRepository.getRoundById.mockResolvedValue(round);

    await expect(service.execute('round-1', 'non-existent-goal')).rejects.toThrow(
      'Goal with id non-existent-goal not found in round round-1',
    );
  });

  it('should return completed dates from progress entries', async () => {
    const round = createTestRound({
      startDate: '2026-01-01',
      endDate: '2026-01-31',
    });
    mockRoundRepository.getRoundById.mockResolvedValue(round);

    const progress = [
      createProgress('2026-01-10'),
      createProgress('2026-01-11'),
      createProgress('2026-01-12'),
    ];
    mockProgressRepository.getProgressForGoal.mockResolvedValue(progress);

    const result = await service.execute('round-1', 'goal-1');

    expect(result.completedDates).toContain('2026-01-10');
    expect(result.completedDates).toContain('2026-01-11');
    expect(result.completedDates).toContain('2026-01-12');
  });

  it('should identify failed dates (past dates without progress)', async () => {
    const round = createTestRound({
      startDate: '2026-01-10',
      endDate: '2026-01-31',
    });
    mockRoundRepository.getRoundById.mockResolvedValue(round);

    // Only have progress for 2026-01-10 and 2026-01-12, missing 2026-01-11
    const progress = [createProgress('2026-01-10'), createProgress('2026-01-12')];
    mockProgressRepository.getProgressForGoal.mockResolvedValue(progress);

    const result = await service.execute('round-1', 'goal-1');

    // 2026-01-11 should be in failedDates (assuming today is after 2026-01-11)
    expect(result.failedDates).toContain('2026-01-11');
  });

  it('should return amendable dates for failed entries', async () => {
    const round = createTestRound({
      startDate: '2026-01-10',
      endDate: '2026-01-31',
    });
    mockRoundRepository.getRoundById.mockResolvedValue(round);

    // Missing 2026-01-11
    const progress = [createProgress('2026-01-10'), createProgress('2026-01-12')];
    mockProgressRepository.getProgressForGoal.mockResolvedValue(progress);

    const result = await service.execute('round-1', 'goal-1');

    // Failed dates should also be amendable
    expect(result.amendableDates).toContain('2026-01-11');
  });

  it('should handle specificDays frequency correctly', async () => {
    const round = createTestRound({
      startDate: '2026-01-01',
      endDate: '2026-01-31',
      goals: [
        {
          id: 'goal-1',
          title: 'Monday/Wednesday Goal',
          frequency: { type: 'specificDays', days: ['monday', 'wednesday'] },
          durationSeconds: 3600,
        },
      ],
    });
    mockRoundRepository.getRoundById.mockResolvedValue(round);
    mockProgressRepository.getProgressForGoal.mockResolvedValue([]);

    const result = await service.execute('round-1', 'goal-1');

    // Failed dates should only include Mondays and Wednesdays
    // Use the getDayOfWeek utility which parses the date string correctly in local time
    result.failedDates.forEach(date => {
      const [year, month, day] = date.split('-').map(Number);
      const localDate = new Date(year, month - 1, day);
      const dayOfWeek = localDate.getDay();
      // Monday = 1, Wednesday = 3
      expect([1, 3]).toContain(dayOfWeek);
    });
  });

  it('should return correct todayStatus when today has progress', async () => {
    const round = createTestRound({
      startDate: '2026-01-01',
      endDate: '2026-12-31',
    });
    mockRoundRepository.getRoundById.mockResolvedValue(round);

    // Simulate having progress for today
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(
      2,
      '0',
    )}-${String(today.getDate()).padStart(2, '0')}`;

    mockProgressRepository.getProgressForGoal.mockResolvedValue([createProgress(todayStr)]);

    const result = await service.execute('round-1', 'goal-1');

    expect(result.todayStatus).toBe('completed');
    expect(result.canLogToday).toBe(false);
  });

  it('should return todayStatus as pending when no progress for today', async () => {
    const round = createTestRound({
      startDate: '2026-01-01',
      endDate: '2026-12-31',
    });
    mockRoundRepository.getRoundById.mockResolvedValue(round);
    mockProgressRepository.getProgressForGoal.mockResolvedValue([]);

    const result = await service.execute('round-1', 'goal-1');

    expect(result.todayStatus).toBe('pending');
    expect(result.canLogToday).toBe(true);
  });

  it('should return not_applicable for today if round has not started', async () => {
    const round = createTestRound({
      startDate: '2030-01-01',
      endDate: '2030-01-31',
    });
    mockRoundRepository.getRoundById.mockResolvedValue(round);
    mockProgressRepository.getProgressForGoal.mockResolvedValue([]);

    const result = await service.execute('round-1', 'goal-1');

    expect(result.todayStatus).toBe('not_applicable');
    expect(result.canLogToday).toBe(false);
  });

  it('should return not_applicable for today if round has ended', async () => {
    const round = createTestRound({
      startDate: '2020-01-01',
      endDate: '2020-01-31',
    });
    mockRoundRepository.getRoundById.mockResolvedValue(round);
    mockProgressRepository.getProgressForGoal.mockResolvedValue([]);

    const result = await service.execute('round-1', 'goal-1');

    expect(result.todayStatus).toBe('not_applicable');
    expect(result.canLogToday).toBe(false);
  });
});
