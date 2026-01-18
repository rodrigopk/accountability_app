import { ProgressRepository } from '../data/repositories/ProgressRepository';
import { RoundRepository } from '../data/repositories/RoundRepository';
import { StorageAdapter } from '../data/storage/StorageAdapter';

/**
 * Return type for createMockStorageAdapter providing both the mock instance
 * and individual mock functions for test configuration
 */
export interface MockStorageAdapter {
  storage: jest.Mocked<StorageAdapter>;
  mockGet: jest.Mock;
  mockSet: jest.Mock;
  mockDelete: jest.Mock;
  mockMultiGet: jest.Mock;
  mockMultiSet: jest.Mock;
  mockMultiDelete: jest.Mock;
}

/**
 * Creates a mock StorageAdapter with all methods mocked.
 * Returns both the mock storage instance and individual mock functions
 * so tests can configure return values and verify calls.
 */
export function createMockStorageAdapter(): MockStorageAdapter {
  const mockGet = jest.fn();
  const mockSet = jest.fn();
  const mockDelete = jest.fn();
  const mockMultiGet = jest.fn();
  const mockMultiSet = jest.fn();
  const mockMultiDelete = jest.fn();

  const storage = {
    get: mockGet,
    set: mockSet,
    delete: mockDelete,
    multiGet: mockMultiGet,
    multiSet: mockMultiSet,
    multiDelete: mockMultiDelete,
  } as unknown as jest.Mocked<StorageAdapter>;

  return {
    storage,
    mockGet,
    mockSet,
    mockDelete,
    mockMultiGet,
    mockMultiSet,
    mockMultiDelete,
  };
}

/**
 * Creates a mock RoundRepository with all methods mocked
 */
export function createMockRoundRepository(): jest.Mocked<RoundRepository> {
  return {
    createRound: jest.fn(),
    getRoundsByDevice: jest.fn(),
    getActiveRound: jest.fn(),
    getRoundById: jest.fn(),
    updateRound: jest.fn(),
    deleteRound: jest.fn(),
    getById: jest.fn(),
  } as unknown as jest.Mocked<RoundRepository>;
}

/**
 * Creates a mock ProgressRepository with all methods mocked
 */
export function createMockProgressRepository(): jest.Mocked<ProgressRepository> {
  return {
    logProgress: jest.fn(),
    getProgressForRound: jest.fn(),
    getProgressForGoal: jest.fn(),
    getProgressById: jest.fn(),
    deleteProgress: jest.fn(),
    deleteProgressForRound: jest.fn(),
    getById: jest.fn(),
  } as unknown as jest.Mocked<ProgressRepository>;
}
