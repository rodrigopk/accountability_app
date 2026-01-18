import { StorageAdapter } from '../storage/StorageAdapter';

/**
 * Configuration for a secondary index.
 * Extracts a key from an entity to group entities by that key.
 */
export interface SecondaryIndexConfig<T> {
  /** Prefix for the index key (e.g., 'rounds_by_device_') */
  prefix: string;
  /** Extract the grouping key from an entity (e.g., entity.deviceId) */
  getKey: (entity: T) => string;
}

/**
 * Base repository providing indexed storage pattern.
 * Stores entities with individual keys and maintains indexes for efficient queries.
 *
 * Key pattern:
 * - Entity: `{entityPrefix}{id}` (e.g., `round_abc123`)
 * - Primary index: `{primaryIndexKey}` -> string[] of all IDs
 * - Secondary indexes: `{secondaryPrefix}{groupKey}` -> string[] of IDs in that group
 */
export abstract class BaseIndexedRepository<T extends { id: string }> {
  protected storage: StorageAdapter;

  /** Prefix for entity keys (e.g., 'round_') */
  protected abstract readonly entityKeyPrefix: string;

  /** Key for the primary index containing all entity IDs */
  protected abstract readonly primaryIndexKey: string;

  /** Optional secondary index configurations */
  protected abstract readonly secondaryIndexes: SecondaryIndexConfig<T>[];

  constructor(storage: StorageAdapter) {
    this.storage = storage;
  }

  // ─────────────────────────────────────────────────────────────
  // Key Helpers
  // ─────────────────────────────────────────────────────────────

  /**
   * Generate the storage key for an entity by ID
   */
  protected entityKey(id: string): string {
    return `${this.entityKeyPrefix}${id}`;
  }

  /**
   * Generate a secondary index key
   */
  protected secondaryIndexKey(prefix: string, groupKey: string): string {
    return `${prefix}${groupKey}`;
  }

  // ─────────────────────────────────────────────────────────────
  // Index Operations
  // ─────────────────────────────────────────────────────────────

  /**
   * Get an index (array of IDs) from storage
   */
  protected async getIndex(key: string): Promise<string[]> {
    return (await this.storage.get<string[]>(key)) ?? [];
  }

  /**
   * Build index entries for adding an entity
   */
  private async buildAddIndexEntries(entity: T): Promise<[string, string[]][]> {
    const indexKeys = [
      this.primaryIndexKey,
      ...this.secondaryIndexes.map(idx => this.secondaryIndexKey(idx.prefix, idx.getKey(entity))),
    ];

    const indexes = await Promise.all(indexKeys.map(key => this.getIndex(key)));

    return indexKeys.map((key, i) => [key, [...indexes[i], entity.id]]);
  }

  /**
   * Build index entries for removing an entity
   */
  private async buildRemoveIndexEntries(entity: T): Promise<[string, string[]][]> {
    const indexKeys = [
      this.primaryIndexKey,
      ...this.secondaryIndexes.map(idx => this.secondaryIndexKey(idx.prefix, idx.getKey(entity))),
    ];

    const indexes = await Promise.all(indexKeys.map(key => this.getIndex(key)));

    return indexKeys.map((key, i) => [key, indexes[i].filter(id => id !== entity.id)]);
  }

  // ─────────────────────────────────────────────────────────────
  // CRUD Operations
  // ─────────────────────────────────────────────────────────────

  /**
   * Save an entity and update all indexes
   */
  protected async saveEntity(entity: T): Promise<void> {
    const indexEntries = await this.buildAddIndexEntries(entity);

    await this.storage.multiSet<T | string[]>([
      [this.entityKey(entity.id), entity],
      ...indexEntries,
    ]);
  }

  /**
   * Get an entity by ID
   */
  async getById(id: string): Promise<T | null> {
    return this.storage.get<T>(this.entityKey(id));
  }

  /**
   * Get multiple entities by IDs
   */
  protected async getByIds(ids: string[]): Promise<T[]> {
    if (ids.length === 0) {
      return [];
    }

    const keys = ids.map(id => this.entityKey(id));
    const entities = await this.storage.multiGet<T>(keys);

    return entities.filter((e): e is T => e !== null);
  }

  /**
   * Get all entities matching a secondary index
   */
  protected async getBySecondaryIndex(indexPrefix: string, groupKey: string): Promise<T[]> {
    const indexKey = this.secondaryIndexKey(indexPrefix, groupKey);
    const ids = await this.getIndex(indexKey);
    return this.getByIds(ids);
  }

  /**
   * Update an entity (does not change indexes - assumes grouping keys are immutable)
   */
  protected async updateEntity(id: string, updates: Partial<T>): Promise<T> {
    const existing = await this.getById(id);

    if (!existing) {
      throw new Error(`Entity with id ${id} not found`);
    }

    const updated = {
      ...existing,
      ...updates,
      id: existing.id, // Prevent ID override
    } as T;

    await this.storage.set(this.entityKey(id), updated);

    return updated;
  }

  /**
   * Delete an entity and update all indexes
   */
  protected async deleteEntity(id: string): Promise<void> {
    const existing = await this.getById(id);

    if (!existing) {
      throw new Error(`Entity with id ${id} not found`);
    }

    const indexEntries = await this.buildRemoveIndexEntries(existing);

    await Promise.all([
      this.storage.delete(this.entityKey(id)),
      this.storage.multiSet(indexEntries),
    ]);
  }

  /**
   * Delete multiple entities by a secondary index key and clean up indexes
   */
  protected async deleteBySecondaryIndex(indexPrefix: string, groupKey: string): Promise<void> {
    const indexKey = this.secondaryIndexKey(indexPrefix, groupKey);
    const ids = await this.getIndex(indexKey);

    if (ids.length === 0) {
      return;
    }

    // Get all entities to update other secondary indexes
    const entities = await this.getByIds(ids);
    const idsToRemove = new Set(ids);

    // Get current primary index
    const primaryIndex = await this.getIndex(this.primaryIndexKey);

    // Build updated indexes
    const indexUpdates: [string, string[]][] = [
      [this.primaryIndexKey, primaryIndex.filter(id => !idsToRemove.has(id))],
      [indexKey, []], // Clear the secondary index we're deleting by
    ];

    // Update other secondary indexes (for entities that might have other groupings)
    // This handles cases where an entity might be in multiple secondary indexes
    for (const idx of this.secondaryIndexes) {
      if (idx.prefix === indexPrefix) {
        continue; // Already handled above
      }

      // Group entities by their secondary key
      const groupedIds = new Map<string, string[]>();
      for (const entity of entities) {
        const key = idx.getKey(entity);
        const secKey = this.secondaryIndexKey(idx.prefix, key);
        if (!groupedIds.has(secKey)) {
          groupedIds.set(secKey, await this.getIndex(secKey));
        }
      }

      // Remove deleted IDs from each group
      for (const [secKey, currentIds] of groupedIds) {
        indexUpdates.push([secKey, currentIds.filter(id => !idsToRemove.has(id))]);
      }
    }

    await Promise.all([
      this.storage.multiDelete(ids.map(id => this.entityKey(id))),
      this.storage.multiSet(indexUpdates),
    ]);
  }
}
