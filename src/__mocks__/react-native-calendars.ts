/**
 * Shared mock for react-native-calendars
 * Used across multiple component tests
 */

import { createElement } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';

interface DateData {
  dateString: string;
  day: number;
  month: number;
  year: number;
  timestamp: number;
}

interface CalendarProps {
  markedDates?: Record<string, unknown>;
  markingType?: string;
  onDayPress?: (day: DateData) => void;
  minDate?: string;
  theme?: Record<string, unknown>;
  testID?: string;
}

const MockCalendar = (props: CalendarProps) => {
  return createElement(
    View,
    { testID: props.testID || 'mock-calendar' },
    createElement(
      TouchableOpacity,
      {
        testID: 'calendar-day',
        onPress: () => {
          if (props.onDayPress) {
            const today = new Date();
            props.onDayPress({
              dateString: today.toISOString().split('T')[0],
              day: today.getDate(),
              month: today.getMonth() + 1,
              year: today.getFullYear(),
              timestamp: today.getTime(),
            });
          }
        },
      },
      createElement(Text, null, 'Mock Calendar Day'),
    ),
  );
};

module.exports = {
  Calendar: MockCalendar,
};
