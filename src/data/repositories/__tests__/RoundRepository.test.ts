import { AccountabilityRound } from '../../../types/AccountabilityRound';
import { StorageAdapter } from '../../storage/StorageAdapter';
import { RoundRepository } from '../RoundRepository';

// Mock StorageAdapter
jest.mock('../../storage/StorageAdapter');

describe('RoundRepository', () => {
  let repository: RoundRepository;
  let mockStorage: jest.Mocked<StorageAdapter>;
  let mockGet: jest.Mock;
  let mockSet: jest.Mock;
  let mockDelete: jest.Mock;
  let mockMultiGet: jest.Mock;
  let mockMultiSet: jest.Mock;

  beforeEach(() => {
    mockGet = jest.fn();
    mockSet = jest.fn();
    mockDelete = jest.fn();
    mockMultiGet = jest.fn();
    mockMultiSet = jest.fn();

    mockStorage = {
      get: mockGet,
      set: mockSet,
      delete: mockDelete,
      multiGet: mockMultiGet,
      multiSet: mockMultiSet,
      multiDelete: jest.fn(),
    } as unknown as jest.Mocked<StorageAdapter>;

    repository = new RoundRepository(mockStorage);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createRound', () => {
    it('should create a new round with generated id and timestamps', async () => {
      mockGet.mockResolvedValue([]); // Empty indexes
      mockMultiSet.mockResolvedValue(undefined);

      const deviceId = 'device-123';
      const roundData = {
        startDate: '2024-01-01',
        endDate: '2024-01-31',
        goals: [],
        reward: 'Buy a new book',
        punishment: 'Donate $50',
      };

      const result = await repository.createRound(deviceId, roundData);

      expect(result).toMatchObject({
        deviceId,
        ...roundData,
      });
      expect(result.id).toBeDefined();
      expect(result.createdAt).toBeDefined();
      expect(result.updatedAt).toBeDefined();
      expect(mockMultiSet).toHaveBeenCalledTimes(1);
    });

    it('should update primary and device indexes', async () => {
      mockGet.mockImplementation((key: string) => {
        if (key === 'rounds_index') return Promise.resolve(['existing-1']);
        if (key === 'rounds_by_device_device-123') return Promise.resolve(['existing-1']);
        return Promise.resolve([]);
      });
      mockMultiSet.mockResolvedValue(undefined);

      const roundData = {
        startDate: '2024-01-01',
        endDate: '2024-01-31',
        goals: [],
        reward: 'Reward',
        punishment: 'Punishment',
      };

      const result = await repository.createRound('device-123', roundData);

      expect(mockMultiSet).toHaveBeenCalledWith([
        [`round_${result.id}`, result],
        ['rounds_index', ['existing-1', result.id]],
        ['rounds_by_device_device-123', ['existing-1', result.id]],
      ]);
    });
  });

  describe('getRoundsByDevice', () => {
    it('should return rounds for specific device', async () => {
      const round1: AccountabilityRound = {
        id: 'round-1',
        deviceId: 'device-123',
        startDate: '2024-01-01',
        endDate: '2024-01-31',
        goals: [],
        reward: 'Reward 1',
        punishment: 'Punishment 1',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      };

      const round2: AccountabilityRound = {
        id: 'round-2',
        deviceId: 'device-123',
        startDate: '2024-02-01',
        endDate: '2024-02-28',
        goals: [],
        reward: 'Reward 2',
        punishment: 'Punishment 2',
        createdAt: '2024-02-01T00:00:00Z',
        updatedAt: '2024-02-01T00:00:00Z',
      };

      mockGet.mockResolvedValue(['round-1', 'round-2']); // Device index
      mockMultiGet.mockResolvedValue([round1, round2]);

      const result = await repository.getRoundsByDevice('device-123');

      expect(mockGet).toHaveBeenCalledWith('rounds_by_device_device-123');
      expect(mockMultiGet).toHaveBeenCalledWith(['round_round-1', 'round_round-2']);
      expect(result).toEqual([round1, round2]);
    });

    it('should return empty array when no rounds exist', async () => {
      mockGet.mockResolvedValue([]);

      const result = await repository.getRoundsByDevice('device-123');

      expect(result).toEqual([]);
      expect(mockMultiGet).not.toHaveBeenCalled();
    });

    it('should filter out null values from stale indexes', async () => {
      const round1: AccountabilityRound = {
        id: 'round-1',
        deviceId: 'device-123',
        startDate: '2024-01-01',
        endDate: '2024-01-31',
        goals: [],
        reward: 'Reward',
        punishment: 'Punishment',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      };

      mockGet.mockResolvedValue(['round-1', 'stale-round']);
      mockMultiGet.mockResolvedValue([round1, null]);

      const result = await repository.getRoundsByDevice('device-123');

      expect(result).toEqual([round1]);
    });
  });

  describe('getActiveRound', () => {
    it('should return the most recent active round', async () => {
      const now = new Date();
      const futureDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString();
      const pastDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();

      const activeRound1: AccountabilityRound = {
        id: 'round-1',
        deviceId: 'device-123',
        startDate: pastDate,
        endDate: futureDate,
        goals: [],
        reward: 'Reward 1',
        punishment: 'Punishment 1',
        createdAt: pastDate,
        updatedAt: pastDate,
      };

      const activeRound2: AccountabilityRound = {
        id: 'round-2',
        deviceId: 'device-123',
        startDate: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        endDate: futureDate,
        goals: [],
        reward: 'Reward 2',
        punishment: 'Punishment 2',
        createdAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      };

      mockGet.mockResolvedValue(['round-1', 'round-2']);
      mockMultiGet.mockResolvedValue([activeRound1, activeRound2]);

      const result = await repository.getActiveRound('device-123');

      expect(result).toEqual(activeRound2); // Most recent by startDate
    });

    it('should return null when no active rounds exist', async () => {
      const pastDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

      const expiredRound: AccountabilityRound = {
        id: 'round-1',
        deviceId: 'device-123',
        startDate: pastDate,
        endDate: pastDate,
        goals: [],
        reward: 'Reward',
        punishment: 'Punishment',
        createdAt: pastDate,
        updatedAt: pastDate,
      };

      mockGet.mockResolvedValue(['round-1']);
      mockMultiGet.mockResolvedValue([expiredRound]);

      const result = await repository.getActiveRound('device-123');

      expect(result).toBeNull();
    });

    it('should return null when device has no rounds', async () => {
      mockGet.mockResolvedValue([]);

      const result = await repository.getActiveRound('device-123');

      expect(result).toBeNull();
    });
  });

  describe('updateRound', () => {
    it('should update an existing round', async () => {
      const existingRound: AccountabilityRound = {
        id: 'round-1',
        deviceId: 'device-123',
        startDate: '2024-01-01',
        endDate: '2024-01-31',
        goals: [],
        reward: 'Old reward',
        punishment: 'Old punishment',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      };

      mockGet.mockResolvedValue(existingRound);
      mockSet.mockResolvedValue(undefined);

      const result = await repository.updateRound('round-1', { reward: 'New reward' });

      expect(result.reward).toBe('New reward');
      expect(result.punishment).toBe('Old punishment');
      expect(result.deviceId).toBe('device-123'); // Unchanged
      expect(result.updatedAt).not.toBe(existingRound.updatedAt);
      expect(mockSet).toHaveBeenCalledWith('round_round-1', expect.any(Object));
    });

    it('should prevent deviceId changes', async () => {
      const existingRound: AccountabilityRound = {
        id: 'round-1',
        deviceId: 'device-123',
        startDate: '2024-01-01',
        endDate: '2024-01-31',
        goals: [],
        reward: 'Reward',
        punishment: 'Punishment',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      };

      mockGet.mockResolvedValue(existingRound);
      mockSet.mockResolvedValue(undefined);

      const result = await repository.updateRound('round-1', {
        reward: 'New reward',
      });

      expect(result.deviceId).toBe('device-123');
    });

    it('should throw error when round not found', async () => {
      mockGet.mockResolvedValue(null);

      await expect(repository.updateRound('non-existent', {})).rejects.toThrow(
        'Round with id non-existent not found',
      );
    });
  });

  describe('deleteRound', () => {
    it('should delete an existing round and update indexes', async () => {
      const round: AccountabilityRound = {
        id: 'round-1',
        deviceId: 'device-123',
        startDate: '2024-01-01',
        endDate: '2024-01-31',
        goals: [],
        reward: 'Reward',
        punishment: 'Punishment',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      };

      mockGet.mockImplementation((key: string) => {
        if (key === 'round_round-1') return Promise.resolve(round);
        if (key === 'rounds_index') return Promise.resolve(['round-1', 'round-2']);
        if (key === 'rounds_by_device_device-123') return Promise.resolve(['round-1']);
        return Promise.resolve([]);
      });
      mockDelete.mockResolvedValue(undefined);
      mockMultiSet.mockResolvedValue(undefined);

      await repository.deleteRound('round-1');

      expect(mockDelete).toHaveBeenCalledWith('round_round-1');
      expect(mockMultiSet).toHaveBeenCalledWith([
        ['rounds_index', ['round-2']],
        ['rounds_by_device_device-123', []],
      ]);
    });

    it('should throw error when round not found', async () => {
      mockGet.mockResolvedValue(null);

      await expect(repository.deleteRound('non-existent')).rejects.toThrow(
        'Entity with id non-existent not found',
      );
    });
  });

  describe('getRoundById', () => {
    it('should return round by id', async () => {
      const round: AccountabilityRound = {
        id: 'round-1',
        deviceId: 'device-123',
        startDate: '2024-01-01',
        endDate: '2024-01-31',
        goals: [],
        reward: 'Reward',
        punishment: 'Punishment',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      };

      mockGet.mockResolvedValue(round);

      const result = await repository.getRoundById('round-1');

      expect(mockGet).toHaveBeenCalledWith('round_round-1');
      expect(result).toEqual(round);
    });

    it('should return null when round not found', async () => {
      mockGet.mockResolvedValue(null);

      const result = await repository.getRoundById('non-existent');

      expect(result).toBeNull();
    });
  });
});
