import { ProgressRepository } from '../../data/repositories/ProgressRepository';
import { StorageAdapter } from '../../data/storage/StorageAdapter';

/**
 * Service for deleting a progress entry.
 */
export class DeleteProgressService {
  private repository: ProgressRepository;

  constructor(repository?: ProgressRepository) {
    this.repository = repository ?? new ProgressRepository(new StorageAdapter());
  }

  /**
   * Delete a progress entry
   * @param progressId Progress ID
   */
  async execute(progressId: string): Promise<void> {
    return this.repository.deleteProgress(progressId);
  }
}
