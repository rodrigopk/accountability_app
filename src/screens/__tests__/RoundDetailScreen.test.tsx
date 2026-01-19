import { render, screen } from '@testing-library/react-native';
import { Alert } from 'react-native';

import { useActiveRounds } from '../../providers/ActiveRoundsProvider';
import { RoundDetailScreen } from '../RoundDetailScreen';

// Mock the provider hook
jest.mock('../../providers/ActiveRoundsProvider', () => ({
  useActiveRounds: jest.fn(),
}));

// Mock react-navigation (still needed for useRoute until we pass props)
jest.mock('@react-navigation/native', () => ({
  useRoute: () => ({ params: { roundId: 'round-1' } }),
}));

// Mock the navigation abstraction layer
jest.mock('../../navigation/useAppNavigation', () => ({
  useAppNavigation: () => ({
    goBack: jest.fn(),
  }),
}));

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

  it('displays round title from reward', () => {
    render(<RoundDetailScreen />);
    expect(screen.getByText('Buy new shoes')).toBeTruthy();
  });

  it('displays fallback title when reward is empty', () => {
    const roundWithoutReward = { ...mockRound, reward: '' };
    (useActiveRounds as jest.Mock).mockReturnValue({
      rounds: [roundWithoutReward],
      progressSummaries: new Map(),
    });
    render(<RoundDetailScreen />);
    expect(screen.getByText('Accountability Round')).toBeTruthy();
  });

  it('displays all goals', () => {
    render(<RoundDetailScreen />);
    expect(screen.getByText('Exercise')).toBeTruthy();
  });

  it('displays punishment when present', () => {
    render(<RoundDetailScreen />);
    expect(screen.getByText(/No dessert/)).toBeTruthy();
  });

  it('does not display punishment section when punishment is empty', () => {
    const roundWithoutPunishment = { ...mockRound, punishment: '' };
    (useActiveRounds as jest.Mock).mockReturnValue({
      rounds: [roundWithoutPunishment],
      progressSummaries: new Map(),
    });
    render(<RoundDetailScreen />);
    expect(screen.queryByText(/Punishment:/)).toBeNull();
  });

  it('shows error state when round not found', () => {
    (useActiveRounds as jest.Mock).mockReturnValue({
      rounds: [],
      progressSummaries: new Map(),
    });
    render(<RoundDetailScreen />);
    expect(screen.getByText('Round not found')).toBeTruthy();
  });

  it('displays goal progress when available', () => {
    render(<RoundDetailScreen />);
    expect(screen.getByText('10/15 completed')).toBeTruthy();
  });
});
