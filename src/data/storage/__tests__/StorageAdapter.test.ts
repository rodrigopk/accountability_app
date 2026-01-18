import AsyncStorage from '@react-native-async-storage/async-storage';

import { StorageAdapter } from '../StorageAdapter';

describe('StorageAdapter', () => {
  let adapter: StorageAdapter;

  beforeEach(() => {
    adapter = new StorageAdapter();
    jest.clearAllMocks();
  });

  describe('get', () => {
    it('should return parsed value for existing key', async () => {
      const testData = { id: 'test-123', name: 'Test' };
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(testData));

      const result = await adapter.get<typeof testData>('test-key');

      expect(AsyncStorage.getItem).toHaveBeenCalledWith('test-key');
      expect(result).toEqual(testData);
    });

    it('should return null for missing key', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

      const result = await adapter.get('missing-key');

      expect(result).toBeNull();
    });

    it('should return null on error', async () => {
      (AsyncStorage.getItem as jest.Mock).mockRejectedValue(new Error('Storage error'));

      const result = await adapter.get('error-key');

      expect(result).toBeNull();
    });
  });

  describe('set', () => {
    it('should serialize and store value', async () => {
      const testData = { id: 'test-123', name: 'Test' };
      (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);

      await adapter.set('test-key', testData);

      expect(AsyncStorage.setItem).toHaveBeenCalledWith('test-key', JSON.stringify(testData));
    });

    it('should throw on error', async () => {
      (AsyncStorage.setItem as jest.Mock).mockRejectedValue(new Error('Storage error'));

      await expect(adapter.set('error-key', 'value')).rejects.toThrow('Storage error');
    });
  });

  describe('delete', () => {
    it('should remove key from storage', async () => {
      (AsyncStorage.removeItem as jest.Mock).mockResolvedValue(undefined);

      await adapter.delete('test-key');

      expect(AsyncStorage.removeItem).toHaveBeenCalledWith('test-key');
    });

    it('should throw on error', async () => {
      (AsyncStorage.removeItem as jest.Mock).mockRejectedValue(new Error('Storage error'));

      await expect(adapter.delete('error-key')).rejects.toThrow('Storage error');
    });
  });

  describe('multiGet', () => {
    it('should return parsed values for multiple keys', async () => {
      const data1 = { id: 1 };
      const data2 = { id: 2 };
      (AsyncStorage.multiGet as jest.Mock).mockResolvedValue([
        ['key1', JSON.stringify(data1)],
        ['key2', JSON.stringify(data2)],
      ]);

      const result = await adapter.multiGet<{ id: number }>(['key1', 'key2']);

      expect(AsyncStorage.multiGet).toHaveBeenCalledWith(['key1', 'key2']);
      expect(result).toEqual([data1, data2]);
    });

    it('should return null for missing keys in results', async () => {
      (AsyncStorage.multiGet as jest.Mock).mockResolvedValue([
        ['key1', JSON.stringify({ id: 1 })],
        ['key2', null],
      ]);

      const result = await adapter.multiGet(['key1', 'key2']);

      expect(result).toEqual([{ id: 1 }, null]);
    });

    it('should return empty array for empty keys', async () => {
      const result = await adapter.multiGet([]);

      expect(AsyncStorage.multiGet).not.toHaveBeenCalled();
      expect(result).toEqual([]);
    });

    it('should return nulls on error', async () => {
      (AsyncStorage.multiGet as jest.Mock).mockRejectedValue(new Error('Storage error'));

      const result = await adapter.multiGet(['key1', 'key2']);

      expect(result).toEqual([null, null]);
    });
  });

  describe('multiSet', () => {
    it('should serialize and set multiple key-value pairs', async () => {
      (AsyncStorage.multiSet as jest.Mock).mockResolvedValue(undefined);

      await adapter.multiSet([
        ['key1', { id: 1 }],
        ['key2', { id: 2 }],
      ]);

      expect(AsyncStorage.multiSet).toHaveBeenCalledWith([
        ['key1', '{"id":1}'],
        ['key2', '{"id":2}'],
      ]);
    });

    it('should do nothing for empty entries', async () => {
      await adapter.multiSet([]);

      expect(AsyncStorage.multiSet).not.toHaveBeenCalled();
    });

    it('should throw on error', async () => {
      (AsyncStorage.multiSet as jest.Mock).mockRejectedValue(new Error('Storage error'));

      await expect(adapter.multiSet([['key', 'value']])).rejects.toThrow('Storage error');
    });
  });

  describe('multiDelete', () => {
    it('should delete multiple keys', async () => {
      (AsyncStorage.multiRemove as jest.Mock).mockResolvedValue(undefined);

      await adapter.multiDelete(['key1', 'key2']);

      expect(AsyncStorage.multiRemove).toHaveBeenCalledWith(['key1', 'key2']);
    });

    it('should do nothing for empty keys', async () => {
      await adapter.multiDelete([]);

      expect(AsyncStorage.multiRemove).not.toHaveBeenCalled();
    });

    it('should throw on error', async () => {
      (AsyncStorage.multiRemove as jest.Mock).mockRejectedValue(new Error('Storage error'));

      await expect(adapter.multiDelete(['key'])).rejects.toThrow('Storage error');
    });
  });
});
