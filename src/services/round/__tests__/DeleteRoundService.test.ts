import {
  createMockProgressRepository,
  createMockRoundRepository,
} from '../../../__mocks__/repositories';
import { DeleteRoundService } from '../DeleteRoundService';

describe('DeleteRoundService', () => {
  it('should delete associated progress before deleting the round', async () => {
    const mockRoundRepository = createMockRoundRepository();
    const mockProgressRepository = createMockProgressRepository();
    const service = new DeleteRoundService(mockRoundRepository, mockProgressRepository);

    mockProgressRepository.deleteProgressForRound.mockResolvedValue(undefined);
    mockRoundRepository.deleteRound.mockResolvedValue(undefined);

    await service.execute('round-1');

    // Verify cascade delete order: progress first, then round
    expect(mockProgressRepository.deleteProgressForRound).toHaveBeenCalledWith('round-1');
    expect(mockRoundRepository.deleteRound).toHaveBeenCalledWith('round-1');

    // Verify progress was deleted before round
    const progressCallOrder =
      mockProgressRepository.deleteProgressForRound.mock.invocationCallOrder[0];
    const roundCallOrder = mockRoundRepository.deleteRound.mock.invocationCallOrder[0];
    expect(progressCallOrder).toBeLessThan(roundCallOrder);
  });

  it('should propagate errors from progress deletion', async () => {
    const mockRoundRepository = createMockRoundRepository();
    const mockProgressRepository = createMockProgressRepository();
    const service = new DeleteRoundService(mockRoundRepository, mockProgressRepository);

    mockProgressRepository.deleteProgressForRound.mockRejectedValue(
      new Error('Progress deletion failed'),
    );

    await expect(service.execute('round-1')).rejects.toThrow('Progress deletion failed');

    // Round should not be deleted if progress deletion fails
    expect(mockRoundRepository.deleteRound).not.toHaveBeenCalled();
  });

  it('should propagate errors from round deletion', async () => {
    const mockRoundRepository = createMockRoundRepository();
    const mockProgressRepository = createMockProgressRepository();
    const service = new DeleteRoundService(mockRoundRepository, mockProgressRepository);

    mockProgressRepository.deleteProgressForRound.mockResolvedValue(undefined);
    mockRoundRepository.deleteRound.mockRejectedValue(new Error('Round not found'));

    await expect(service.execute('round-1')).rejects.toThrow('Round not found');

    // Progress should have been deleted before the round deletion failed
    expect(mockProgressRepository.deleteProgressForRound).toHaveBeenCalledWith('round-1');
  });

  it('should work even when round has no progress entries', async () => {
    const mockRoundRepository = createMockRoundRepository();
    const mockProgressRepository = createMockProgressRepository();
    const service = new DeleteRoundService(mockRoundRepository, mockProgressRepository);

    // deleteProgressForRound should succeed even with no entries
    mockProgressRepository.deleteProgressForRound.mockResolvedValue(undefined);
    mockRoundRepository.deleteRound.mockResolvedValue(undefined);

    await service.execute('round-with-no-progress');

    expect(mockProgressRepository.deleteProgressForRound).toHaveBeenCalledWith(
      'round-with-no-progress',
    );
    expect(mockRoundRepository.deleteRound).toHaveBeenCalledWith('round-with-no-progress');
  });
});
