import { createMockProgressRepository } from '../../../__mocks__/repositories';
import { GoalProgress } from '../../../types/GoalProgress';
import { LogProgressService } from '../LogProgressService';

describe('LogProgressService', () => {
  it('should log progress with current timestamp', async () => {
    const mockRepository = createMockProgressRepository();
    const service = new LogProgressService(mockRepository);

    const progress: GoalProgress = {
      id: 'progress-1',
      roundId: 'round-1',
      goalId: 'goal-1',
      completedAt: '2024-01-15T10:00:00Z',
      durationSeconds: 3600,
      notes: 'Great session',
    };

    mockRepository.logProgress.mockResolvedValue(progress);

    const result = await service.execute({
      roundId: 'round-1',
      goalId: 'goal-1',
      durationSeconds: 3600,
      notes: 'Great session',
    });

    expect(result).toEqual(progress);
    expect(mockRepository.logProgress).toHaveBeenCalledWith(
      expect.objectContaining({
        roundId: 'round-1',
        goalId: 'goal-1',
        durationSeconds: 3600,
        notes: 'Great session',
        completedAt: expect.any(String),
      }),
    );
  });
});
