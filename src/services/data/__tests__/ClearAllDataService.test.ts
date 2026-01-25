import { createMockStorageAdapter } from '../../../__mocks__/repositories';
import { ClearAllDataService } from '../ClearAllDataService';

describe('ClearAllDataService', () => {
  it('clears all storage data', async () => {
    const { storage } = createMockStorageAdapter();
    const mockClear = jest.fn().mockResolvedValue(undefined);
    storage.clear = mockClear;

    const service = new ClearAllDataService(storage);
    await service.execute();

    expect(mockClear).toHaveBeenCalled();
  });

  it('propagates errors from storage', async () => {
    const { storage } = createMockStorageAdapter();
    const error = new Error('Clear failed');
    storage.clear = jest.fn().mockRejectedValue(error);

    const service = new ClearAllDataService(storage);
    await expect(service.execute()).rejects.toThrow('Clear failed');
  });
});
