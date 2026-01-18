import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';

import { MILLISECONDS_PER_DAY } from '../utils/timeConstants';

type DateField = 'start' | 'end';

interface PeriodPickerProps {
  startDate: Date;
  endDate: Date;
  onStartDateChange: (date: Date) => void;
  onEndDateChange: (date: Date) => void;
  minimumStartDate?: Date;
}

/**
 * PeriodPicker component for selecting a date range (start and end date).
 * Displays both dates in a single row and handles platform-specific picker behavior.
 */
export function PeriodPicker({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  minimumStartDate,
}: PeriodPickerProps) {
  const [activeField, setActiveField] = useState<DateField | null>(
    Platform.OS === 'ios' ? 'start' : null,
  );

  const handleDateChange = (_event: unknown, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setActiveField(null);
    }

    if (!selectedDate || !activeField) return;

    if (activeField === 'start') {
      onStartDateChange(selectedDate);
      // If new start date is after or equal to end date, adjust end date
      if (selectedDate >= endDate) {
        onEndDateChange(new Date(selectedDate.getTime() + MILLISECONDS_PER_DAY));
      }
    } else {
      onEndDateChange(selectedDate);
    }
  };

  const openPicker = (field: DateField) => {
    setActiveField(field);
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getMinimumDate = (): Date | undefined => {
    if (activeField === 'start') {
      return minimumStartDate;
    }
    // End date must be at least 1 day after start date
    return new Date(startDate.getTime() + MILLISECONDS_PER_DAY);
  };

  const getCurrentValue = (): Date => {
    return activeField === 'start' ? startDate : endDate;
  };

  return (
    <View style={styles.container}>
      <View style={styles.datesRow}>
        <TouchableOpacity
          style={[styles.dateButton, activeField === 'start' && styles.dateButtonActive]}
          onPress={() => openPicker('start')}
        >
          <Text style={styles.dateLabel}>Start</Text>
          <Text style={styles.dateValue}>{formatDate(startDate)}</Text>
        </TouchableOpacity>

        <View style={styles.arrowContainer}>
          <Text style={styles.arrow}>→</Text>
        </View>

        <TouchableOpacity
          style={[styles.dateButton, activeField === 'end' && styles.dateButtonActive]}
          onPress={() => openPicker('end')}
        >
          <Text style={styles.dateLabel}>End</Text>
          <Text style={styles.dateValue}>{formatDate(endDate)}</Text>
        </TouchableOpacity>
      </View>

      {activeField && (
        <View style={styles.pickerContainer}>
          <DateTimePicker
            value={getCurrentValue()}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={handleDateChange}
            minimumDate={getMinimumDate()}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  datesRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateButton: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  dateButtonActive: {
    borderColor: '#007AFF',
    borderWidth: 2,
    backgroundColor: '#f0f7ff',
  },
  dateLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
    fontWeight: '500',
  },
  dateValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
  },
  arrowContainer: {
    paddingHorizontal: 12,
  },
  arrow: {
    fontSize: 20,
    color: '#666',
  },
  pickerContainer: {
    marginTop: 16,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 8,
  },
});
