import { GoalProgress } from '../../types/GoalProgress';
import { generateUUID } from '../../utils/uuidUtils';
import { StorageAdapter } from '../storage/StorageAdapter';

import { BaseIndexedRepository, SecondaryIndexConfig } from './BaseIndexedRepository';

const PROGRESS_KEY_PREFIX = 'progress_';
const PROGRESS_INDEX_KEY = 'progress_index';
const PROGRESS_BY_ROUND_PREFIX = 'progress_by_round_';

/**
 * Repository for goal progress data access.
 * Handles CRUD operations for progress entries with indexed storage.
 */
export class ProgressRepository extends BaseIndexedRepository<GoalProgress> {
  protected readonly entityKeyPrefix = PROGRESS_KEY_PREFIX;
  protected readonly primaryIndexKey = PROGRESS_INDEX_KEY;

  protected readonly secondaryIndexes: SecondaryIndexConfig<GoalProgress>[] = [
    {
      prefix: PROGRESS_BY_ROUND_PREFIX,
      getKey: progress => progress.roundId,
    },
  ];

  constructor(storage: StorageAdapter) {
    super(storage);
  }

  /**
   * Log progress for a goal
   * @param progress Progress data without id
   * @returns Created GoalProgress
   */
  async logProgress(progress: Omit<GoalProgress, 'id'>): Promise<GoalProgress> {
    const newProgress: GoalProgress = {
      ...progress,
      id: generateUUID(),
    };

    await this.saveEntity(newProgress);

    return newProgress;
  }

  /**
   * Get all progress entries for a round
   * @param roundId Round ID to filter by
   * @returns Array of GoalProgress
   */
  async getProgressForRound(roundId: string): Promise<GoalProgress[]> {
    return this.getBySecondaryIndex(PROGRESS_BY_ROUND_PREFIX, roundId);
  }

  /**
   * Get all progress entries for a specific goal within a round
   * @param roundId Round ID to filter by
   * @param goalId Goal ID to filter by
   * @returns Array of GoalProgress
   */
  async getProgressForGoal(roundId: string, goalId: string): Promise<GoalProgress[]> {
    const progressList = await this.getProgressForRound(roundId);
    return progressList.filter(progress => progress.goalId === goalId);
  }

  /**
   * Delete a progress entry
   * @param progressId ID of the progress entry to delete
   * @throws Error if progress not found
   */
  async deleteProgress(progressId: string): Promise<void> {
    await this.deleteEntity(progressId);
  }

  /**
   * Delete all progress entries for a round (cascade delete)
   * @param roundId Round ID to delete progress for
   */
  async deleteProgressForRound(roundId: string): Promise<void> {
    await this.deleteBySecondaryIndex(PROGRESS_BY_ROUND_PREFIX, roundId);
  }

  /**
   * Get a progress entry by ID
   * @param progressId Progress ID
   * @returns GoalProgress or null if not found
   */
  async getProgressById(progressId: string): Promise<GoalProgress | null> {
    return this.getById(progressId);
  }
}
