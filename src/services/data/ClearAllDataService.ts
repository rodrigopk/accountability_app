import { StorageAdapter } from '../../data/storage/StorageAdapter';

/**
 * Service for clearing all application data.
 * Resets the app to its initial state as if just installed.
 */
export class ClearAllDataService {
  private storage: StorageAdapter;

  constructor(storage?: StorageAdapter) {
    this.storage = storage ?? new StorageAdapter();
  }

  /**
   * Clear all application data from storage
   * @returns Promise that resolves when data is cleared
   */
  async execute(): Promise<void> {
    await this.storage.clear();
  }
}
