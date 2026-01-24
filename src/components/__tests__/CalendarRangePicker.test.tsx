import { render, screen, fireEvent } from '@testing-library/react-native';

import { CalendarRangePicker } from '../CalendarRangePicker';

// Mock react-native-calendars
jest.mock('react-native-calendars', () => ({
  Calendar: ({ onDayPress }: { onDayPress: (day: { dateString: string }) => void }) => {
    const React = require('react');
    const { View, TouchableOpacity, Text } = require('react-native');
    return React.createElement(View, { testID: 'calendar' }, [
      React.createElement(
        TouchableOpacity,
        {
          key: '2026-02-15',
          testID: 'day-2026-02-15',
          onPress: () => onDayPress({ dateString: '2026-02-15' }),
        },
        React.createElement(Text, null, '15'),
      ),
      React.createElement(
        TouchableOpacity,
        {
          key: '2026-02-20',
          testID: 'day-2026-02-20',
          onPress: () => onDayPress({ dateString: '2026-02-20' }),
        },
        React.createElement(Text, null, '20'),
      ),
    ]);
  },
}));

describe('CalendarRangePicker', () => {
  const defaultStartDate = new Date('2026-02-01T12:00:00');
  const defaultEndDate = new Date('2026-02-07T12:00:00');
  const mockOnStartDateChange = jest.fn();
  const mockOnEndDateChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('displays formatted start and end dates', () => {
    render(
      <CalendarRangePicker
        startDate={defaultStartDate}
        endDate={defaultEndDate}
        onStartDateChange={mockOnStartDateChange}
        onEndDateChange={mockOnEndDateChange}
      />,
    );

    expect(screen.getByText('Feb 1')).toBeTruthy();
    expect(screen.getByText('Feb 7')).toBeTruthy();
  });

  it('displays pro tip message', () => {
    render(
      <CalendarRangePicker
        startDate={defaultStartDate}
        endDate={defaultEndDate}
        onStartDateChange={mockOnStartDateChange}
        onEndDateChange={mockOnEndDateChange}
      />,
    );

    expect(screen.getByText(/Pro Tip/)).toBeTruthy();
    expect(screen.getByText(/at least 7 days/)).toBeTruthy();
  });

  it('updates start date when day is pressed in start selection mode', () => {
    render(
      <CalendarRangePicker
        startDate={defaultStartDate}
        endDate={defaultEndDate}
        onStartDateChange={mockOnStartDateChange}
        onEndDateChange={mockOnEndDateChange}
      />,
    );

    fireEvent.press(screen.getByTestId('day-2026-02-15'));

    expect(mockOnStartDateChange).toHaveBeenCalled();
    const calledDate = mockOnStartDateChange.mock.calls[0][0];
    expect(calledDate.getDate()).toBe(15);
  });

  it('switches to end selection after selecting start date', () => {
    render(
      <CalendarRangePicker
        startDate={defaultStartDate}
        endDate={defaultEndDate}
        onStartDateChange={mockOnStartDateChange}
        onEndDateChange={mockOnEndDateChange}
      />,
    );

    // Select start date
    fireEvent.press(screen.getByTestId('day-2026-02-15'));

    // Select end date
    fireEvent.press(screen.getByTestId('day-2026-02-20'));

    expect(mockOnEndDateChange).toHaveBeenCalled();
  });
});
