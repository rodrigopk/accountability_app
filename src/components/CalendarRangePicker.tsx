import React, { useState, useMemo, useCallback } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Calendar, DateData } from 'react-native-calendars';

import { colors, typography } from '../theme';
import { MILLISECONDS_PER_DAY } from '../utils/timeConstants';

import { styles } from './CalendarRangePicker.styles';

interface CalendarRangePickerProps {
  startDate: Date;
  endDate: Date;
  onStartDateChange: (date: Date) => void;
  onEndDateChange: (date: Date) => void;
  minimumDate?: Date;
}

type SelectionState = 'start' | 'end';

function formatDisplayDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

function toDateString(date: Date): string {
  return date.toISOString().split('T')[0];
}

type MarkedDateValue = {
  startingDay?: boolean;
  endingDay?: boolean;
  color: string;
  textColor: string;
};

function generateMarkedDates(startDate: Date, endDate: Date): Record<string, MarkedDateValue> {
  const marked: Record<string, MarkedDateValue> = {};
  const start = new Date(startDate);
  const end = new Date(endDate);

  const current = new Date(start);
  while (current <= end) {
    const dateStr = toDateString(current);
    const isStart = dateStr === toDateString(start);
    const isEnd = dateStr === toDateString(end);

    marked[dateStr] = {
      color: isStart || isEnd ? colors.primary : colors.primaryLight,
      textColor: isStart || isEnd ? colors.textInverse : colors.textPrimary,
      startingDay: isStart,
      endingDay: isEnd,
    };

    current.setDate(current.getDate() + 1);
  }

  return marked;
}

export function CalendarRangePicker({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  minimumDate,
}: CalendarRangePickerProps) {
  const [selectionState, setSelectionState] = useState<SelectionState>('start');

  const markedDates = useMemo(() => generateMarkedDates(startDate, endDate), [startDate, endDate]);

  const handleDayPress = useCallback(
    (day: DateData) => {
      const selectedDate = new Date(day.dateString + 'T12:00:00');

      if (selectionState === 'start') {
        onStartDateChange(selectedDate);
        setSelectionState('end');
        if (selectedDate >= endDate) {
          onEndDateChange(new Date(selectedDate.getTime() + MILLISECONDS_PER_DAY));
        }
      } else {
        if (selectedDate <= startDate) {
          onStartDateChange(selectedDate);
        } else {
          onEndDateChange(selectedDate);
          setSelectionState('start');
        }
      }
    },
    [selectionState, startDate, endDate, onStartDateChange, onEndDateChange],
  );

  const minDateStr = minimumDate ? toDateString(minimumDate) : undefined;

  return (
    <View style={styles.container}>
      {/* Date fields */}
      <View style={styles.dateFieldsRow}>
        <TouchableOpacity
          style={[styles.dateField, selectionState === 'start' && styles.dateFieldActive]}
          onPress={() => setSelectionState('start')}
          testID="start-date-field"
        >
          <View style={styles.dateFieldIcon}>
            <Text>📅</Text>
          </View>
          <Text style={styles.dateFieldValue}>{formatDisplayDate(startDate)}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.dateField, selectionState === 'end' && styles.dateFieldActive]}
          onPress={() => setSelectionState('end')}
          testID="end-date-field"
        >
          <View style={styles.dateFieldIcon}>
            <Text>📅</Text>
          </View>
          <Text style={styles.dateFieldValue}>{formatDisplayDate(endDate)}</Text>
        </TouchableOpacity>
      </View>

      {/* Calendar */}
      <View style={styles.calendarContainer}>
        <Calendar
          markedDates={markedDates}
          markingType="period"
          onDayPress={handleDayPress}
          minDate={minDateStr}
          theme={{
            backgroundColor: colors.surface,
            calendarBackground: colors.surface,
            textSectionTitleColor: colors.textSecondary,
            selectedDayBackgroundColor: colors.primary,
            selectedDayTextColor: colors.textInverse,
            todayTextColor: colors.primary,
            dayTextColor: colors.textPrimary,
            textDisabledColor: colors.textTertiary,
            arrowColor: colors.textPrimary,
            monthTextColor: colors.textPrimary,
            textDayFontWeight: typography.fontWeight.regular,
            textMonthFontWeight: typography.fontWeight.semibold,
            textDayHeaderFontWeight: typography.fontWeight.medium,
            textDayFontSize: typography.fontSize.md,
            textMonthFontSize: typography.fontSize.lg,
            textDayHeaderFontSize: typography.fontSize.sm,
          }}
        />
      </View>

      {/* Pro Tip */}
      <View style={styles.proTip}>
        <Text style={styles.proTipIcon}>💡</Text>
        <Text style={styles.proTipText}>
          Pro Tip: We recommend a duration of at least 7 days to build a solid habit.
        </Text>
      </View>
    </View>
  );
}
