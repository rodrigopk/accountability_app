import { render, screen, fireEvent } from '@testing-library/react-native';
import { Alert } from 'react-native';

import { Goal } from '../../types/Goal';
import { GoalCard } from '../GoalCard';

// Mock Alert
jest.spyOn(Alert, 'alert');

describe('GoalCard', () => {
  const mockOnUpdate = jest.fn();
  const mockOnRemove = jest.fn();

  const completedGoal: Goal = {
    id: 'goal-1',
    title: 'Exercise',
    description: 'Morning workout',
    frequency: { type: 'daily' },
    durationSeconds: 1800,
  };

  const newGoal: Goal = {
    id: 'goal-2',
    title: '',
    frequency: { type: 'daily' },
    durationSeconds: 0,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('show/edit mode toggle', () => {
    it('starts in edit mode when goal title is empty', () => {
      render(<GoalCard goal={newGoal} onUpdate={mockOnUpdate} onRemove={mockOnRemove} />);

      // Edit mode: form inputs should be visible
      expect(screen.getByPlaceholderText('E.g., Exercise, Read')).toBeTruthy();
      expect(screen.getByText('Done')).toBeTruthy();
    });

    it('starts in show mode when goal has a title', () => {
      render(<GoalCard goal={completedGoal} onUpdate={mockOnUpdate} onRemove={mockOnRemove} />);

      // Show mode: read-only view with Edit button
      expect(screen.getByText('Exercise')).toBeTruthy();
      expect(screen.getByText('Edit')).toBeTruthy();
      expect(screen.queryByPlaceholderText('E.g., Exercise, Read')).toBeNull();
    });

    it('switches from show mode to edit mode when Edit is pressed', () => {
      render(<GoalCard goal={completedGoal} onUpdate={mockOnUpdate} onRemove={mockOnRemove} />);

      // Initially in show mode
      expect(screen.queryByPlaceholderText('E.g., Exercise, Read')).toBeNull();

      // Press Edit button
      fireEvent.press(screen.getByText('Edit'));

      // Now in edit mode
      expect(screen.getByPlaceholderText('E.g., Exercise, Read')).toBeTruthy();
      expect(screen.getByText('Done')).toBeTruthy();
    });

    it('switches from edit mode to show mode when Done is pressed', () => {
      render(<GoalCard goal={completedGoal} onUpdate={mockOnUpdate} onRemove={mockOnRemove} />);

      // Switch to edit mode first
      fireEvent.press(screen.getByText('Edit'));
      expect(screen.getByPlaceholderText('E.g., Exercise, Read')).toBeTruthy();

      // Press Done button
      fireEvent.press(screen.getByText('Done'));

      // Now in show mode
      expect(screen.queryByPlaceholderText('E.g., Exercise, Read')).toBeNull();
      expect(screen.getByText('Edit')).toBeTruthy();
    });

    it('displays formatted frequency in show mode', () => {
      render(<GoalCard goal={completedGoal} onUpdate={mockOnUpdate} onRemove={mockOnRemove} />);

      expect(screen.getByText('Daily')).toBeTruthy();
    });

    it('displays formatted duration in show mode', () => {
      render(<GoalCard goal={completedGoal} onUpdate={mockOnUpdate} onRemove={mockOnRemove} />);

      // formatDuration returns "30 min" for 1800 seconds
      expect(screen.getByText('30 min')).toBeTruthy();
    });

    it('displays description in show mode when present', () => {
      render(<GoalCard goal={completedGoal} onUpdate={mockOnUpdate} onRemove={mockOnRemove} />);

      expect(screen.getByText('Morning workout')).toBeTruthy();
    });

    it('displays frequency and duration labels in show mode', () => {
      render(<GoalCard goal={completedGoal} onUpdate={mockOnUpdate} onRemove={mockOnRemove} />);

      expect(screen.getByText('Frequency:')).toBeTruthy();
      expect(screen.getByText('Duration:')).toBeTruthy();
    });

    it('shows Remove Goal button only in edit mode', () => {
      render(<GoalCard goal={completedGoal} onUpdate={mockOnUpdate} onRemove={mockOnRemove} />);

      // Initially in show mode - Remove button should not be visible
      expect(screen.queryByText('Remove Goal')).toBeNull();

      // Switch to edit mode
      fireEvent.press(screen.getByText('Edit'));

      // Now Remove button should be visible
      expect(screen.getByText('Remove Goal')).toBeTruthy();
    });
  });
});
