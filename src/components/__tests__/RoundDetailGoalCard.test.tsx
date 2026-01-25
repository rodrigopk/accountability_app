import { fireEvent, render, screen } from '@testing-library/react-native';

import { GoalProgressSummary } from '../../services/types';
import { Goal } from '../../types/Goal';
import { RoundDetailGoalCard } from '../RoundDetailGoalCard';

describe('RoundDetailGoalCard', () => {
  const mockGoal: Goal = {
    id: 'goal-1',
    title: 'Exercise',
    description: 'Morning workout',
    frequency: { type: 'daily' },
    durationSeconds: 1800,
    notificationTime: '09:00',
  };

  const mockProgressSummary: GoalProgressSummary = {
    goalId: 'goal-1',
    goalTitle: 'Exercise',
    completedCount: 10,
    expectedCount: 15,
    failedCount: 3,
    completionPercentage: 67,
    totalDurationSeconds: 18000,
    canLogToday: true,
    amendableDates: [],
  };

  it('displays goal title', () => {
    render(
      <RoundDetailGoalCard
        goal={mockGoal}
        progressSummary={null}
        onLogProgress={jest.fn()}
        onAmendProgress={jest.fn()}
      />,
    );
    expect(screen.getByText('Exercise')).toBeTruthy();
  });

  it('displays formatted frequency, duration, and notification time', () => {
    render(
      <RoundDetailGoalCard
        goal={mockGoal}
        progressSummary={null}
        onLogProgress={jest.fn()}
        onAmendProgress={jest.fn()}
      />,
    );
    expect(screen.getByText(/Daily.*30 min.*9:00 AM/)).toBeTruthy();
  });

  it('displays emoji avatar with default emoji when not set', () => {
    render(
      <RoundDetailGoalCard
        goal={mockGoal}
        progressSummary={null}
        onLogProgress={jest.fn()}
        onAmendProgress={jest.fn()}
      />,
    );
    expect(screen.getByText('🎯')).toBeTruthy();
  });

  it('displays emoji avatar with goal emoji when set', () => {
    const goalWithEmoji = { ...mockGoal, emoji: '🏃' };
    render(
      <RoundDetailGoalCard
        goal={goalWithEmoji}
        progressSummary={null}
        onLogProgress={jest.fn()}
        onAmendProgress={jest.fn()}
      />,
    );
    expect(screen.getByText('🏃')).toBeTruthy();
  });

  it('displays weekly progress when summary is provided', () => {
    render(
      <RoundDetailGoalCard
        goal={mockGoal}
        progressSummary={mockProgressSummary}
        onLogProgress={jest.fn()}
        onAmendProgress={jest.fn()}
      />,
    );
    expect(screen.getByText('Weekly Progress')).toBeTruthy();
    expect(screen.getByText('10/15')).toBeTruthy();
  });

  it('does not display weekly progress when summary is null', () => {
    render(
      <RoundDetailGoalCard
        goal={mockGoal}
        progressSummary={null}
        onLogProgress={jest.fn()}
        onAmendProgress={jest.fn()}
      />,
    );
    expect(screen.queryByText('Weekly Progress')).toBeNull();
  });

  it('calls onLogProgress when Log Progress button is pressed', () => {
    const mockOnLogProgress = jest.fn();
    render(
      <RoundDetailGoalCard
        goal={mockGoal}
        progressSummary={mockProgressSummary}
        onLogProgress={mockOnLogProgress}
        onAmendProgress={jest.fn()}
      />,
    );

    fireEvent.press(screen.getByText('+ Log Progress'));
    expect(mockOnLogProgress).toHaveBeenCalledTimes(1);
  });

  it('displays Weekly Quota Met when canLogToday is false', () => {
    const summaryWithNoLog: GoalProgressSummary = {
      ...mockProgressSummary,
      canLogToday: false,
    };
    render(
      <RoundDetailGoalCard
        goal={mockGoal}
        progressSummary={summaryWithNoLog}
        onLogProgress={jest.fn()}
        onAmendProgress={jest.fn()}
      />,
    );
    expect(screen.getByText('✓ Weekly Quota Met')).toBeTruthy();
  });

  it('displays missed warning when there are failed days', () => {
    const summaryWithFailed: GoalProgressSummary = {
      ...mockProgressSummary,
      failedCount: 5,
      amendableDates: ['2026-01-15', '2026-01-16', '2026-01-17'],
    };
    render(
      <RoundDetailGoalCard
        goal={mockGoal}
        progressSummary={summaryWithFailed}
        onLogProgress={jest.fn()}
        onAmendProgress={jest.fn()}
      />,
    );
    expect(screen.getByText(/⚠️ Missed/)).toBeTruthy();
  });

  it('does not display missed warning when no failed days', () => {
    const summaryNoFailed: GoalProgressSummary = {
      ...mockProgressSummary,
      failedCount: 0,
    };
    render(
      <RoundDetailGoalCard
        goal={mockGoal}
        progressSummary={summaryNoFailed}
        onLogProgress={jest.fn()}
        onAmendProgress={jest.fn()}
      />,
    );
    expect(screen.queryByText(/⚠️ Missed/)).toBeNull();
  });

  it('shows Amend button when there are amendable dates', () => {
    const summaryWithAmendable: GoalProgressSummary = {
      ...mockProgressSummary,
      amendableDates: ['2026-01-10', '2026-01-11'],
    };
    render(
      <RoundDetailGoalCard
        goal={mockGoal}
        progressSummary={summaryWithAmendable}
        onLogProgress={jest.fn()}
        onAmendProgress={jest.fn()}
      />,
    );
    expect(screen.getByText('Amend')).toBeTruthy();
    expect(screen.getByText('📝')).toBeTruthy();
  });

  it('does not show Amend button when no amendable dates', () => {
    render(
      <RoundDetailGoalCard
        goal={mockGoal}
        progressSummary={mockProgressSummary}
        onLogProgress={jest.fn()}
        onAmendProgress={jest.fn()}
      />,
    );
    expect(screen.queryByText('Amend')).toBeNull();
  });

  it('calls onAmendProgress when Amend button is pressed', () => {
    const mockOnAmendProgress = jest.fn();
    const summaryWithAmendable: GoalProgressSummary = {
      ...mockProgressSummary,
      amendableDates: ['2026-01-10'],
    };
    render(
      <RoundDetailGoalCard
        goal={mockGoal}
        progressSummary={summaryWithAmendable}
        onLogProgress={jest.fn()}
        onAmendProgress={mockOnAmendProgress}
      />,
    );

    fireEvent.press(screen.getByText('Amend'));
    expect(mockOnAmendProgress).toHaveBeenCalledTimes(1);
  });
});
