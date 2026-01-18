import { render, screen } from '@testing-library/react-native';

import { AccountabilityRound } from '../../types/AccountabilityRound';
import { RoundProgressSummary } from '../../services/types';
import { RoundCard } from '../RoundCard';

describe('RoundCard', () => {
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
        completionPercentage: 67,
        totalDurationSeconds: 18000,
      },
      {
        goalId: 'goal-2',
        goalTitle: 'Read',
        completedCount: 15,
        expectedCount: 15,
        completionPercentage: 100,
        totalDurationSeconds: 13500,
      },
    ],
  };

  it('displays round reward as title', () => {
    render(<RoundCard round={mockRound} progressSummary={mockProgressSummary} />);

    expect(screen.getByText('Buy new shoes')).toBeTruthy();
  });

  it('displays goal titles', () => {
    render(<RoundCard round={mockRound} progressSummary={mockProgressSummary} />);

    expect(screen.getByText(/Exercise/)).toBeTruthy();
    expect(screen.getByText(/Read/)).toBeTruthy();
  });

  it('displays formatted date period', () => {
    render(<RoundCard round={mockRound} progressSummary={mockProgressSummary} />);

    // Check for date range display (format may vary)
    expect(screen.getByText(/Jan.*2026/)).toBeTruthy();
  });

  it('displays fallback title when reward is empty', () => {
    const roundWithoutReward = { ...mockRound, reward: '' };
    render(<RoundCard round={roundWithoutReward} progressSummary={null} />);

    expect(screen.getByText('Accountability Round')).toBeTruthy();
  });

  it('displays progress percentage when progress summary is provided', () => {
    render(<RoundCard round={mockRound} progressSummary={mockProgressSummary} />);

    // Average of 67% and 100% = 84% (rounded)
    expect(screen.getByText(/84%/)).toBeTruthy();
  });

  it('handles missing progress summary gracefully', () => {
    render(<RoundCard round={mockRound} progressSummary={null} />);

    expect(screen.getByText('Buy new shoes')).toBeTruthy();
    expect(screen.getByText(/Exercise/)).toBeTruthy();
  });
});
