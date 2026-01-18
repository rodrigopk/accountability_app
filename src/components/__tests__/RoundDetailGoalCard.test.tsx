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
    completionPercentage: 67,
    totalDurationSeconds: 18000,
  };

  it('displays goal title', () => {
    render(
      <RoundDetailGoalCard goal={mockGoal} progressSummary={null} onLogProgress={jest.fn()} />,
    );
    expect(screen.getByText('Exercise')).toBeTruthy();
  });

  it('displays goal description when present', () => {
    render(
      <RoundDetailGoalCard goal={mockGoal} progressSummary={null} onLogProgress={jest.fn()} />,
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
      />,
    );
    expect(screen.queryByText('Morning workout')).toBeNull();
  });

  it('displays formatted frequency and duration', () => {
    render(
      <RoundDetailGoalCard goal={mockGoal} progressSummary={null} onLogProgress={jest.fn()} />,
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
      />,
    );
    expect(screen.getByText('10/15 completed')).toBeTruthy();
  });

  it('does not display progress when summary is null', () => {
    render(
      <RoundDetailGoalCard goal={mockGoal} progressSummary={null} onLogProgress={jest.fn()} />,
    );
    expect(screen.queryByText(/completed/)).toBeNull();
  });

  it('calls onLogProgress when Log Progress button is pressed', () => {
    const mockOnLogProgress = jest.fn();
    render(
      <RoundDetailGoalCard
        goal={mockGoal}
        progressSummary={null}
        onLogProgress={mockOnLogProgress}
      />,
    );

    fireEvent.press(screen.getByText('Log Progress'));
    expect(mockOnLogProgress).toHaveBeenCalledTimes(1);
  });
});
