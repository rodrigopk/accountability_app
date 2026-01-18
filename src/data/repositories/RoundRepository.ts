import { AccountabilityRound } from '../../types/AccountabilityRound';
import { generateUUID } from '../../utils/uuidUtils';
import { StorageAdapter } from '../storage/StorageAdapter';

import { BaseIndexedRepository, SecondaryIndexConfig } from './BaseIndexedRepository';

const ROUND_KEY_PREFIX = 'round_';
const ROUNDS_INDEX_KEY = 'rounds_index';
const ROUNDS_BY_DEVICE_PREFIX = 'rounds_by_device_';

/**
 * Repository for accountability rounds data access.
 * Handles CRUD operations for rounds with indexed storage.
 */
export class RoundRepository extends BaseIndexedRepository<AccountabilityRound> {
  protected readonly entityKeyPrefix = ROUND_KEY_PREFIX;
  protected readonly primaryIndexKey = ROUNDS_INDEX_KEY;

  protected readonly secondaryIndexes: SecondaryIndexConfig<AccountabilityRound>[] = [
    {
      prefix: ROUNDS_BY_DEVICE_PREFIX,
      getKey: (round) => round.deviceId,
    },
  ];

  constructor(storage: StorageAdapter) {
    super(storage);
  }

  /**
   * Create a new accountability round
   * @param deviceId Device ID to link the round to
   * @param round Round data without id, deviceId, createdAt, updatedAt
   * @returns Created AccountabilityRound
   */
  async createRound(
    deviceId: string,
    round: Omit<AccountabilityRound, 'id' | 'deviceId' | 'createdAt' | 'updatedAt'>,
  ): Promise<AccountabilityRound> {
    const newRound: AccountabilityRound = {
      ...round,
      id: generateUUID(),
      deviceId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await this.saveEntity(newRound);

    return newRound;
  }

  /**
   * Get all rounds for a specific device
   * @param deviceId Device ID to filter by
   * @returns Array of AccountabilityRound
   */
  async getRoundsByDevice(deviceId: string): Promise<AccountabilityRound[]> {
    return this.getBySecondaryIndex(ROUNDS_BY_DEVICE_PREFIX, deviceId);
  }

  /**
   * Get the active round for a device (most recent round that hasn't ended)
   * @param deviceId Device ID to filter by
   * @returns Active AccountabilityRound or null
   */
  async getActiveRound(deviceId: string): Promise<AccountabilityRound | null> {
    const rounds = await this.getRoundsByDevice(deviceId);
    const now = new Date().toISOString();

    // Find the most recent round that hasn't ended
    const activeRounds = rounds
      .filter((round) => round.endDate >= now)
      .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());

    return activeRounds.length > 0 ? activeRounds[0] : null;
  }

  /**
   * Update an existing round
   * @param roundId ID of the round to update
   * @param updates Partial updates to apply
   * @returns Updated AccountabilityRound
   * @throws Error if round not found
   */
  async updateRound(
    roundId: string,
    updates: Partial<Omit<AccountabilityRound, 'id' | 'deviceId'>>,
  ): Promise<AccountabilityRound> {
    const existing = await this.getById(roundId);

    if (!existing) {
      throw new Error(`Round with id ${roundId} not found`);
    }

    const updatedRound: AccountabilityRound = {
      ...existing,
      ...updates,
      id: existing.id, // Prevent ID override
      deviceId: existing.deviceId, // Prevent deviceId change (would break indexes)
      updatedAt: new Date().toISOString(),
    };

    await this.storage.set(this.entityKey(roundId), updatedRound);

    return updatedRound;
  }

  /**
   * Delete a round
   * @param roundId ID of the round to delete
   * @throws Error if round not found
   */
  async deleteRound(roundId: string): Promise<void> {
    await this.deleteEntity(roundId);
  }

  /**
   * Get a round by ID
   * @param roundId Round ID
   * @returns AccountabilityRound or null if not found
   */
  async getRoundById(roundId: string): Promise<AccountabilityRound | null> {
    return this.getById(roundId);
  }
}
