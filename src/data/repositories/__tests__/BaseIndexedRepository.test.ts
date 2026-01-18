import { StorageAdapter } from '../../storage/StorageAdapter';
import { BaseIndexedRepository, SecondaryIndexConfig } from '../BaseIndexedRepository';

// Create a concrete implementation for testing
interface TestEntity {
  id: string;
  groupKey: string;
  name: string;
}

class TestRepository extends BaseIndexedRepository<TestEntity> {
  protected readonly entityKeyPrefix = 'test_';
  protected readonly primaryIndexKey = 'test_index';

  protected readonly secondaryIndexes: SecondaryIndexConfig<TestEntity>[] = [
    {
      prefix: 'test_by_group_',
      getKey: (entity) => entity.groupKey,
    },
  ];

  // Expose protected methods for testing
  async publicSaveEntity(entity: TestEntity): Promise<void> {
    return this.saveEntity(entity);
  }

  async publicDeleteEntity(id: string): Promise<void> {
    return this.deleteEntity(id);
  }

  async publicGetBySecondaryIndex(groupKey: string): Promise<TestEntity[]> {
    return this.getBySecondaryIndex('test_by_group_', groupKey);
  }

  async publicDeleteBySecondaryIndex(groupKey: string): Promise<void> {
    return this.deleteBySecondaryIndex('test_by_group_', groupKey);
  }

  async publicGetIndex(key: string): Promise<string[]> {
    return this.getIndex(key);
  }
}

// Mock StorageAdapter
jest.mock('../../storage/StorageAdapter');

describe('BaseIndexedRepository', () => {
  let repository: TestRepository;
  let mockStorage: jest.Mocked<StorageAdapter>;
  let mockGet: jest.Mock;
  let mockSet: jest.Mock;
  let mockDelete: jest.Mock;
  let mockMultiGet: jest.Mock;
  let mockMultiSet: jest.Mock;
  let mockMultiDelete: jest.Mock;

  beforeEach(() => {
    mockGet = jest.fn();
    mockSet = jest.fn();
    mockDelete = jest.fn();
    mockMultiGet = jest.fn();
    mockMultiSet = jest.fn();
    mockMultiDelete = jest.fn();

    mockStorage = {
      get: mockGet,
      set: mockSet,
      delete: mockDelete,
      multiGet: mockMultiGet,
      multiSet: mockMultiSet,
      multiDelete: mockMultiDelete,
    } as unknown as jest.Mocked<StorageAdapter>;

    repository = new TestRepository(mockStorage);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('saveEntity', () => {
    it('should save entity and update indexes', async () => {
      mockGet.mockResolvedValue([]); // Empty indexes
      mockMultiSet.mockResolvedValue(undefined);

      const entity: TestEntity = { id: 'entity-1', groupKey: 'group-a', name: 'Test' };

      await repository.publicSaveEntity(entity);

      expect(mockMultiSet).toHaveBeenCalledWith([
        ['test_entity-1', entity],
        ['test_index', ['entity-1']],
        ['test_by_group_group-a', ['entity-1']],
      ]);
    });

    it('should append to existing indexes', async () => {
      mockGet.mockImplementation((key: string) => {
        if (key === 'test_index') return Promise.resolve(['existing-1']);
        if (key === 'test_by_group_group-a') return Promise.resolve(['existing-1']);
        return Promise.resolve([]);
      });
      mockMultiSet.mockResolvedValue(undefined);

      const entity: TestEntity = { id: 'entity-2', groupKey: 'group-a', name: 'Test 2' };

      await repository.publicSaveEntity(entity);

      expect(mockMultiSet).toHaveBeenCalledWith([
        ['test_entity-2', entity],
        ['test_index', ['existing-1', 'entity-2']],
        ['test_by_group_group-a', ['existing-1', 'entity-2']],
      ]);
    });
  });

  describe('getById', () => {
    it('should return entity by ID', async () => {
      const entity: TestEntity = { id: 'entity-1', groupKey: 'group-a', name: 'Test' };
      mockGet.mockResolvedValue(entity);

      const result = await repository.getById('entity-1');

      expect(mockGet).toHaveBeenCalledWith('test_entity-1');
      expect(result).toEqual(entity);
    });

    it('should return null for non-existent entity', async () => {
      mockGet.mockResolvedValue(null);

      const result = await repository.getById('non-existent');

      expect(result).toBeNull();
    });
  });

  describe('getBySecondaryIndex', () => {
    it('should return entities by secondary index', async () => {
      const entity1: TestEntity = { id: 'entity-1', groupKey: 'group-a', name: 'Test 1' };
      const entity2: TestEntity = { id: 'entity-2', groupKey: 'group-a', name: 'Test 2' };

      mockGet.mockResolvedValue(['entity-1', 'entity-2']); // Index IDs
      mockMultiGet.mockResolvedValue([entity1, entity2]);

      const result = await repository.publicGetBySecondaryIndex('group-a');

      expect(mockGet).toHaveBeenCalledWith('test_by_group_group-a');
      expect(mockMultiGet).toHaveBeenCalledWith(['test_entity-1', 'test_entity-2']);
      expect(result).toEqual([entity1, entity2]);
    });

    it('should return empty array for non-existent index', async () => {
      mockGet.mockResolvedValue([]);

      const result = await repository.publicGetBySecondaryIndex('non-existent');

      expect(result).toEqual([]);
      expect(mockMultiGet).not.toHaveBeenCalled();
    });

    it('should filter out null values (stale index entries)', async () => {
      const entity1: TestEntity = { id: 'entity-1', groupKey: 'group-a', name: 'Test 1' };

      mockGet.mockResolvedValue(['entity-1', 'stale-id']);
      mockMultiGet.mockResolvedValue([entity1, null]);

      const result = await repository.publicGetBySecondaryIndex('group-a');

      expect(result).toEqual([entity1]);
    });
  });

  describe('deleteEntity', () => {
    it('should delete entity and update indexes', async () => {
      const entity: TestEntity = { id: 'entity-1', groupKey: 'group-a', name: 'Test' };
      mockGet.mockImplementation((key: string) => {
        if (key === 'test_entity-1') return Promise.resolve(entity);
        if (key === 'test_index') return Promise.resolve(['entity-1', 'entity-2']);
        if (key === 'test_by_group_group-a') return Promise.resolve(['entity-1', 'entity-3']);
        return Promise.resolve([]);
      });
      mockDelete.mockResolvedValue(undefined);
      mockMultiSet.mockResolvedValue(undefined);

      await repository.publicDeleteEntity('entity-1');

      expect(mockDelete).toHaveBeenCalledWith('test_entity-1');
      expect(mockMultiSet).toHaveBeenCalledWith([
        ['test_index', ['entity-2']],
        ['test_by_group_group-a', ['entity-3']],
      ]);
    });

    it('should throw error for non-existent entity', async () => {
      mockGet.mockResolvedValue(null);

      await expect(repository.publicDeleteEntity('non-existent')).rejects.toThrow(
        'Entity with id non-existent not found',
      );
    });
  });

  describe('deleteBySecondaryIndex', () => {
    it('should delete all entities in secondary index and update indexes', async () => {
      const entity1: TestEntity = { id: 'entity-1', groupKey: 'group-a', name: 'Test 1' };
      const entity2: TestEntity = { id: 'entity-2', groupKey: 'group-a', name: 'Test 2' };

      mockGet.mockImplementation((key: string) => {
        if (key === 'test_by_group_group-a') return Promise.resolve(['entity-1', 'entity-2']);
        if (key === 'test_index') return Promise.resolve(['entity-1', 'entity-2', 'entity-3']);
        return Promise.resolve([]);
      });
      mockMultiGet.mockResolvedValue([entity1, entity2]);
      mockMultiDelete.mockResolvedValue(undefined);
      mockMultiSet.mockResolvedValue(undefined);

      await repository.publicDeleteBySecondaryIndex('group-a');

      expect(mockMultiDelete).toHaveBeenCalledWith(['test_entity-1', 'test_entity-2']);
      expect(mockMultiSet).toHaveBeenCalledWith([
        ['test_index', ['entity-3']],
        ['test_by_group_group-a', []],
      ]);
    });

    it('should do nothing for empty secondary index', async () => {
      mockGet.mockResolvedValue([]);

      await repository.publicDeleteBySecondaryIndex('empty-group');

      expect(mockMultiDelete).not.toHaveBeenCalled();
      expect(mockMultiSet).not.toHaveBeenCalled();
    });
  });
});
