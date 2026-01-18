import { fireEvent, render, screen } from '@testing-library/react-native';

import { RoundProgressSummary } from '../../services/types';
import { AccountabilityRound } from '../../types/AccountabilityRound';
import { RoundCard } from '../RoundCard';

describe('RoundCard', () => {
  const mockOnPress = jest.fn();
  const mockRound: AccountabilityRound = {
    id: 'round-1',
    deviceId: 'device-123',
    startDate: '2026-01-01',
    endDate: '2026-01-31',
    goals: [
      { id: 'goal-1', title: 'Exercise', frequency: { type: 'daily' }, durationSeconds: 1800 },
      { id: 'goal-2', title: 'Read', frequency: { type: 'daily' }, durationSeconds: 900 },
    ],
    reward: 'Buy new shoes',
    punishment: '',
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  };

  const mockProgressSummary: RoundProgressSummary = {
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
        failedCount: 0,
        completionPercentage: 67,
        totalDurationSeconds: 18000,
        canLogToday: true,
        amendableDates: [],
      },
      {
        goalId: 'goal-2',
        goalTitle: 'Read',
        completedCount: 15,
        expectedCount: 15,
        failedCount: 0,
        completionPercentage: 100,
        totalDurationSeconds: 13500,
        canLogToday: true,
        amendableDates: [],
      },
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('displays round reward as title', () => {
    render(
      <RoundCard round={mockRound} progressSummary={mockProgressSummary} onPress={mockOnPress} />,
    );

    expect(screen.getByText('Buy new shoes')).toBeTruthy();
  });

  it('displays goal titles', () => {
    render(
      <RoundCard round={mockRound} progressSummary={mockProgressSummary} onPress={mockOnPress} />,
    );

    expect(screen.getByText(/Exercise/)).toBeTruthy();
    expect(screen.getByText(/Read/)).toBeTruthy();
  });

  it('displays formatted date period', () => {
    render(
      <RoundCard round={mockRound} progressSummary={mockProgressSummary} onPress={mockOnPress} />,
    );

    // Check for date range display (format may vary)
    expect(screen.getByText(/Jan.*2026/)).toBeTruthy();
  });

  it('displays fallback title when reward is empty', () => {
    const roundWithoutReward = { ...mockRound, reward: '' };
    render(<RoundCard round={roundWithoutReward} progressSummary={null} onPress={mockOnPress} />);

    expect(screen.getByText('Accountability Round')).toBeTruthy();
  });

  it('displays progress percentage when progress summary is provided', () => {
    render(
      <RoundCard round={mockRound} progressSummary={mockProgressSummary} onPress={mockOnPress} />,
    );

    // Average of 67% and 100% = 84% (rounded)
    expect(screen.getByText(/84%/)).toBeTruthy();
  });

  it('handles missing progress summary gracefully', () => {
    render(<RoundCard round={mockRound} progressSummary={null} onPress={mockOnPress} />);

    expect(screen.getByText('Buy new shoes')).toBeTruthy();
    expect(screen.getByText(/Exercise/)).toBeTruthy();
  });

  it('calls onPress when card is pressed', () => {
    render(
      <RoundCard round={mockRound} progressSummary={mockProgressSummary} onPress={mockOnPress} />,
    );

    const card = screen.getByText('Buy new shoes').parent;
    fireEvent.press(card!);
    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });
});
