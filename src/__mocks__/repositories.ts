import { ProgressRepository } from '../data/repositories/ProgressRepository';
import { RoundRepository } from '../data/repositories/RoundRepository';

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
