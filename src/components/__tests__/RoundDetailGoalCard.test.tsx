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

  it('displays goal description when present', () => {
    render(
      <RoundDetailGoalCard
        goal={mockGoal}
        progressSummary={null}
        onLogProgress={jest.fn()}
        onAmendProgress={jest.fn()}
      />,
    );
    expect(screen.getByText('Morning workout')).toBeTruthy();
  });

  it('does not display description when absent', () => {
    const goalWithoutDescription = { ...mockGoal, description: undefined };
    render(
      <RoundDetailGoalCard
        goal={goalWithoutDescription}
        progressSummary={null}
        onLogProgress={jest.fn()}
        onAmendProgress={jest.fn()}
      />,
    );
    expect(screen.queryByText('Morning workout')).toBeNull();
  });

  it('displays formatted frequency and duration', () => {
    render(
      <RoundDetailGoalCard
        goal={mockGoal}
        progressSummary={null}
        onLogProgress={jest.fn()}
        onAmendProgress={jest.fn()}
      />,
    );
    expect(screen.getByText('Daily')).toBeTruthy();
    expect(screen.getByText('30 min')).toBeTruthy();
  });

  it('displays progress when summary is provided', () => {
    render(
      <RoundDetailGoalCard
        goal={mockGoal}
        progressSummary={mockProgressSummary}
        onLogProgress={jest.fn()}
        onAmendProgress={jest.fn()}
      />,
    );
    expect(screen.getByText('10/15 completed')).toBeTruthy();
  });

  it('does not display progress when summary is null', () => {
    render(
      <RoundDetailGoalCard
        goal={mockGoal}
        progressSummary={null}
        onLogProgress={jest.fn()}
        onAmendProgress={jest.fn()}
      />,
    );
    expect(screen.queryByText(/completed/)).toBeNull();
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

    fireEvent.press(screen.getByText('Log Progress'));
    expect(mockOnLogProgress).toHaveBeenCalledTimes(1);
  });

  it('displays Already Logged when canLogToday is false with no reason', () => {
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
    expect(screen.getByText('Already Logged')).toBeTruthy();
  });

  it('displays Not Started when round has not started', () => {
    const summaryNotStarted: GoalProgressSummary = {
      ...mockProgressSummary,
      canLogToday: false,
      canLogReason: 'Round has not started yet',
    };
    render(
      <RoundDetailGoalCard
        goal={mockGoal}
        progressSummary={summaryNotStarted}
        onLogProgress={jest.fn()}
        onAmendProgress={jest.fn()}
      />,
    );
    expect(screen.getByText('Not Started')).toBeTruthy();
  });

  it('displays Round Ended when round has ended', () => {
    const summaryEnded: GoalProgressSummary = {
      ...mockProgressSummary,
      canLogToday: false,
      canLogReason: 'Round has ended',
    };
    render(
      <RoundDetailGoalCard
        goal={mockGoal}
        progressSummary={summaryEnded}
        onLogProgress={jest.fn()}
        onAmendProgress={jest.fn()}
      />,
    );
    expect(screen.getByText('Round Ended')).toBeTruthy();
  });

  it('displays Not Applicable Today when today is not applicable', () => {
    const summaryNotApplicable: GoalProgressSummary = {
      ...mockProgressSummary,
      canLogToday: false,
      canLogReason: 'This goal is only for: Monday, Wednesday, Friday',
    };
    render(
      <RoundDetailGoalCard
        goal={mockGoal}
        progressSummary={summaryNotApplicable}
        onLogProgress={jest.fn()}
        onAmendProgress={jest.fn()}
      />,
    );
    expect(screen.getByText('Not Applicable Today')).toBeTruthy();
  });

  it('displays Quota Met when weekly quota is met', () => {
    const summaryQuotaMet: GoalProgressSummary = {
      ...mockProgressSummary,
      canLogToday: false,
      canLogReason: 'Weekly quota of 3 already met for this week',
    };
    render(
      <RoundDetailGoalCard
        goal={mockGoal}
        progressSummary={summaryQuotaMet}
        onLogProgress={jest.fn()}
        onAmendProgress={jest.fn()}
      />,
    );
    expect(screen.getByText('Quota Met')).toBeTruthy();
  });

  it('displays failed count when there are failed days', () => {
    const summaryWithFailed: GoalProgressSummary = {
      ...mockProgressSummary,
      failedCount: 5,
    };
    render(
      <RoundDetailGoalCard
        goal={mockGoal}
        progressSummary={summaryWithFailed}
        onLogProgress={jest.fn()}
        onAmendProgress={jest.fn()}
      />,
    );
    expect(screen.getByText('5 missed days')).toBeTruthy();
  });

  it('displays singular form for 1 missed day', () => {
    const summaryWithOneFailed: GoalProgressSummary = {
      ...mockProgressSummary,
      failedCount: 1,
    };
    render(
      <RoundDetailGoalCard
        goal={mockGoal}
        progressSummary={summaryWithOneFailed}
        onLogProgress={jest.fn()}
        onAmendProgress={jest.fn()}
      />,
    );
    expect(screen.getByText('1 missed day')).toBeTruthy();
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
