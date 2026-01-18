import { createMockProgressRepository } from '../../../__mocks__/repositories';
import { GoalProgress } from '../../../types/GoalProgress';
import { GetProgressForRoundService } from '../GetProgressForRoundService';

describe('GetProgressForRoundService', () => {
  it('should return progress entries for a round', async () => {
    const mockRepository = createMockProgressRepository();
    const service = new GetProgressForRoundService(mockRepository);

    const progress: GoalProgress[] = [
      {
        id: 'progress-1',
        roundId: 'round-1',
        goalId: 'goal-1',
        completedAt: '2024-01-15T10:00:00Z',
        durationSeconds: 3600,
      },
    ];

    mockRepository.getProgressForRound.mockResolvedValue(progress);

    const result = await service.execute('round-1');

    expect(result).toEqual(progress);
    expect(mockRepository.getProgressForRound).toHaveBeenCalledWith('round-1');
  });
});
