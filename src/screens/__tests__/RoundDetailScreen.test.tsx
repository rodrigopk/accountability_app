import { render, screen } from '@testing-library/react-native';
import { Alert } from 'react-native';

import { useActiveRounds } from '../../providers/ActiveRoundsProvider';
import { RoundDetailScreen } from '../RoundDetailScreen';

// Mock the provider hook
jest.mock('../../providers/ActiveRoundsProvider', () => ({
  useActiveRounds: jest.fn(),
}));

// Mock react-native-navigation
jest.mock('react-native-navigation', () => ({
  Navigation: {
    events: jest.fn(() => ({
      registerComponentDidAppearListener: jest.fn(() => ({ remove: jest.fn() })),
    })),
  },
}));

// Mock the navigation abstraction layer
jest.mock('../../navigation/useAppNavigation', () => ({
  useAppNavigation: () => ({
    goBack: jest.fn(),
  }),
}));

// Mock react-native-safe-area-context (shared mock)
jest.mock('react-native-safe-area-context');

// Mock Alert
jest.spyOn(Alert, 'alert');

describe('RoundDetailScreen', () => {
  const mockRound = {
    id: 'round-1',
    deviceId: 'device-123',
    startDate: '2026-01-01',
    endDate: '2026-01-31',
    goals: [
      {
        id: 'goal-1',
        title: 'Exercise',
        description: 'Morning workout',
        frequency: { type: 'daily' },
        durationSeconds: 1800,
      },
    ],
    reward: 'Buy new shoes',
    punishment: 'No dessert',
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  };

  const mockProgressSummary = {
    roundId: 'round-1',
    daysRemaining: 16,
    daysElapsed: 15,
    totalDays: 31,
    goalSummaries: [
      {
        goalId: 'goal-1',
        goalTitle: 'Exercise',
        completedCount: 10,
        expectedCount: 15,
        completionPercentage: 67,
        totalDurationSeconds: 18000,
      },
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useActiveRounds as jest.Mock).mockReturnValue({
      rounds: [mockRound],
      progressSummaries: new Map([['round-1', mockProgressSummary]]),
    });
  });

  it('displays screen title', () => {
    render(<RoundDetailScreen roundId="round-1" />);
    expect(screen.getByText('Round Details')).toBeTruthy();
  });

  it('displays all goals', () => {
    render(<RoundDetailScreen roundId="round-1" />);
    expect(screen.getByText('Exercise')).toBeTruthy();
  });

  it('displays punishment banner when present', () => {
    render(<RoundDetailScreen roundId="round-1" />);
    expect(screen.getByText('PUNISHMENT')).toBeTruthy();
    expect(screen.getByText(/No dessert/)).toBeTruthy();
  });

  it('does not display punishment banner when punishment is empty', () => {
    const roundWithoutPunishment = { ...mockRound, punishment: '' };
    (useActiveRounds as jest.Mock).mockReturnValue({
      rounds: [roundWithoutPunishment],
      progressSummaries: new Map(),
    });
    render(<RoundDetailScreen roundId="round-1" />);
    expect(screen.queryByText('PUNISHMENT')).toBeNull();
  });

  it('displays Your Goals section header', () => {
    render(<RoundDetailScreen roundId="round-1" />);
    expect(screen.getByText('Your Goals')).toBeTruthy();
  });

  it('displays goals count badge', () => {
    render(<RoundDetailScreen roundId="round-1" />);
    expect(screen.getByText('1 Active')).toBeTruthy();
  });

  it('shows error state when round not found', () => {
    (useActiveRounds as jest.Mock).mockReturnValue({
      rounds: [],
      progressSummaries: new Map(),
    });
    render(<RoundDetailScreen roundId="nonexistent" />);
    expect(screen.getByText('Round not found')).toBeTruthy();
  });

  it('displays goal progress when available', () => {
    render(<RoundDetailScreen roundId="round-1" />);
    expect(screen.getByText('10/15 completed')).toBeTruthy();
  });
});
