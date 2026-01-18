import { createMockProgressRepository } from '../../../__mocks__/repositories';
import { DeleteProgressService } from '../DeleteProgressService';

describe('DeleteProgressService', () => {
  it('should delete a progress entry', async () => {
    const mockRepository = createMockProgressRepository();
    const service = new DeleteProgressService(mockRepository);

    mockRepository.deleteProgress.mockResolvedValue(undefined);

    await service.execute('progress-1');

    expect(mockRepository.deleteProgress).toHaveBeenCalledWith('progress-1');
  });
});
