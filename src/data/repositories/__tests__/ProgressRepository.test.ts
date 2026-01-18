import { createMockStorageAdapter, MockStorageAdapter } from '../../../__mocks__/repositories';
import { GoalProgress } from '../../../types/GoalProgress';
import { ProgressRepository } from '../ProgressRepository';

describe('ProgressRepository', () => {
  let repository: ProgressRepository;
  let mocks: MockStorageAdapter;
  let mockGet: jest.Mock;
  let mockSet: jest.Mock;
  let mockDelete: jest.Mock;
  let mockMultiGet: jest.Mock;
  let mockMultiSet: jest.Mock;
  let mockMultiDelete: jest.Mock;

  beforeEach(() => {
    mocks = createMockStorageAdapter();
    ({ mockGet, mockSet, mockDelete, mockMultiGet, mockMultiSet, mockMultiDelete } = mocks);

    repository = new ProgressRepository(mocks.storage);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('logProgress', () => {
    it('should create progress entry with generated id', async () => {
      mockGet.mockResolvedValue([]); // Empty indexes
      mockMultiSet.mockResolvedValue(undefined);

      const progressData = {
        roundId: 'round-123',
        goalId: 'goal-456',
        completedAt: '2024-01-15T10:00:00Z',
        durationSeconds: 3600,
        notes: 'Great session!',
      };

      const result = await repository.logProgress(progressData);

      expect(result).toMatchObject(progressData);
      expect(result.id).toBeDefined();
      expect(mockMultiSet).toHaveBeenCalledTimes(1);
    });

    it('should update primary and round indexes', async () => {
      mockGet.mockImplementation((key: string) => {
        if (key === 'progress_index') return Promise.resolve(['existing-1']);
        if (key === 'progress_by_round_round-123') return Promise.resolve(['existing-1']);
        return Promise.resolve([]);
      });
      mockMultiSet.mockResolvedValue(undefined);

      const progressData = {
        roundId: 'round-123',
        goalId: 'goal-456',
        completedAt: '2024-01-15T10:00:00Z',
        durationSeconds: 3600,
      };

      const result = await repository.logProgress(progressData);

      expect(mockMultiSet).toHaveBeenCalledWith([
        [`progress_${result.id}`, result],
        ['progress_index', ['existing-1', result.id]],
        ['progress_by_round_round-123', ['existing-1', result.id]],
      ]);
    });
  });

  describe('getProgressForRound', () => {
    it('should return progress entries for a round', async () => {
      const progress1: GoalProgress = {
        id: 'progress-1',
        roundId: 'round-123',
        goalId: 'goal-1',
        completedAt: '2024-01-15T10:00:00Z',
        durationSeconds: 3600,
      };

      const progress2: GoalProgress = {
        id: 'progress-2',
        roundId: 'round-123',
        goalId: 'goal-2',
        completedAt: '2024-01-16T10:00:00Z',
        durationSeconds: 1800,
      };

      mockGet.mockResolvedValue(['progress-1', 'progress-2']); // Round index
      mockMultiGet.mockResolvedValue([progress1, progress2]);

      const result = await repository.getProgressForRound('round-123');

      expect(mockGet).toHaveBeenCalledWith('progress_by_round_round-123');
      expect(mockMultiGet).toHaveBeenCalledWith(['progress_progress-1', 'progress_progress-2']);
      expect(result).toEqual([progress1, progress2]);
    });

    it('should return empty array when no progress exists', async () => {
      mockGet.mockResolvedValue([]);

      const result = await repository.getProgressForRound('round-123');

      expect(result).toEqual([]);
      expect(mockMultiGet).not.toHaveBeenCalled();
    });

    it('should filter out null values from stale indexes', async () => {
      const progress1: GoalProgress = {
        id: 'progress-1',
        roundId: 'round-123',
        goalId: 'goal-1',
        completedAt: '2024-01-15T10:00:00Z',
        durationSeconds: 3600,
      };

      mockGet.mockResolvedValue(['progress-1', 'stale-progress']);
      mockMultiGet.mockResolvedValue([progress1, null]);

      const result = await repository.getProgressForRound('round-123');

      expect(result).toEqual([progress1]);
    });
  });

  describe('getProgressForGoal', () => {
    it('should return progress entries for a specific goal in a round', async () => {
      const progress1: GoalProgress = {
        id: 'progress-1',
        roundId: 'round-123',
        goalId: 'goal-1',
        completedAt: '2024-01-15T10:00:00Z',
        durationSeconds: 3600,
      };

      const progress2: GoalProgress = {
        id: 'progress-2',
        roundId: 'round-123',
        goalId: 'goal-2',
        completedAt: '2024-01-16T10:00:00Z',
        durationSeconds: 1800,
      };

      const progress3: GoalProgress = {
        id: 'progress-3',
        roundId: 'round-123',
        goalId: 'goal-1',
        completedAt: '2024-01-17T10:00:00Z',
        durationSeconds: 2400,
      };

      mockGet.mockResolvedValue(['progress-1', 'progress-2', 'progress-3']);
      mockMultiGet.mockResolvedValue([progress1, progress2, progress3]);

      const result = await repository.getProgressForGoal('round-123', 'goal-1');

      expect(result).toEqual([progress1, progress3]);
    });

    it('should return empty array when no matching progress exists', async () => {
      const progress: GoalProgress = {
        id: 'progress-1',
        roundId: 'round-123',
        goalId: 'goal-1',
        completedAt: '2024-01-15T10:00:00Z',
        durationSeconds: 3600,
      };

      mockGet.mockResolvedValue(['progress-1']);
      mockMultiGet.mockResolvedValue([progress]);

      const result = await repository.getProgressForGoal('round-123', 'non-existent-goal');

      expect(result).toEqual([]);
    });
  });

  describe('deleteProgress', () => {
    it('should delete a progress entry and update indexes', async () => {
      const progress: GoalProgress = {
        id: 'progress-1',
        roundId: 'round-123',
        goalId: 'goal-1',
        completedAt: '2024-01-15T10:00:00Z',
        durationSeconds: 3600,
      };

      mockGet.mockImplementation((key: string) => {
        if (key === 'progress_progress-1') return Promise.resolve(progress);
        if (key === 'progress_index') return Promise.resolve(['progress-1', 'progress-2']);
        if (key === 'progress_by_round_round-123') return Promise.resolve(['progress-1']);
        return Promise.resolve([]);
      });
      mockDelete.mockResolvedValue(undefined);
      mockMultiSet.mockResolvedValue(undefined);

      await repository.deleteProgress('progress-1');

      expect(mockDelete).toHaveBeenCalledWith('progress_progress-1');
      expect(mockMultiSet).toHaveBeenCalledWith([
        ['progress_index', ['progress-2']],
        ['progress_by_round_round-123', []],
      ]);
    });

    it('should throw error when progress not found', async () => {
      mockGet.mockResolvedValue(null);

      await expect(repository.deleteProgress('non-existent')).rejects.toThrow(
        'Entity with id non-existent not found',
      );
    });
  });

  describe('deleteProgressForRound', () => {
    it('should delete all progress entries for a round', async () => {
      const progress1: GoalProgress = {
        id: 'progress-1',
        roundId: 'round-123',
        goalId: 'goal-1',
        completedAt: '2024-01-15T10:00:00Z',
        durationSeconds: 3600,
      };

      const progress2: GoalProgress = {
        id: 'progress-2',
        roundId: 'round-123',
        goalId: 'goal-2',
        completedAt: '2024-01-16T10:00:00Z',
        durationSeconds: 1800,
      };

      mockGet.mockImplementation((key: string) => {
        if (key === 'progress_by_round_round-123') return Promise.resolve(['progress-1', 'progress-2']);
        if (key === 'progress_index') return Promise.resolve(['progress-1', 'progress-2', 'progress-3']);
        return Promise.resolve([]);
      });
      mockMultiGet.mockResolvedValue([progress1, progress2]);
      mockMultiDelete.mockResolvedValue(undefined);
      mockMultiSet.mockResolvedValue(undefined);

      await repository.deleteProgressForRound('round-123');

      expect(mockMultiDelete).toHaveBeenCalledWith(['progress_progress-1', 'progress_progress-2']);
      expect(mockMultiSet).toHaveBeenCalledWith([
        ['progress_index', ['progress-3']],
        ['progress_by_round_round-123', []],
      ]);
    });

    it('should do nothing for round with no progress', async () => {
      mockGet.mockResolvedValue([]);

      await repository.deleteProgressForRound('round-123');

      expect(mockMultiDelete).not.toHaveBeenCalled();
      expect(mockMultiSet).not.toHaveBeenCalled();
    });
  });

  describe('getProgressById', () => {
    it('should return progress by id', async () => {
      const progress: GoalProgress = {
        id: 'progress-1',
        roundId: 'round-123',
        goalId: 'goal-1',
        completedAt: '2024-01-15T10:00:00Z',
        durationSeconds: 3600,
      };

      mockGet.mockResolvedValue(progress);

      const result = await repository.getProgressById('progress-1');

      expect(mockGet).toHaveBeenCalledWith('progress_progress-1');
      expect(result).toEqual(progress);
    });

    it('should return null when progress not found', async () => {
      mockGet.mockResolvedValue(null);

      const result = await repository.getProgressById('non-existent');

      expect(result).toBeNull();
    });
  });
});
