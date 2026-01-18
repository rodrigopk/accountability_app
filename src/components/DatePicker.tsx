import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';

interface DatePickerProps {
  value: Date;
  onChange: (date: Date) => void;
  minimumDate?: Date;
  maximumDate?: Date;
}

/**
 * DatePicker component with platform-specific behavior.
 *
 * Why OS dependent?
 * - iOS: DateTimePicker displays as an inline spinner that's always visible
 * - Android: DateTimePicker shows as a modal dialog that must be triggered
 *
 * This difference requires different UI patterns:
 * - iOS: Show picker immediately, no button needed
 * - Android: Show a button that opens the picker modal
 */
export function DatePicker({ value, onChange, minimumDate, maximumDate }: DatePickerProps) {
  const [show, setShow] = useState(Platform.OS === 'ios');

  const handleChange = (_event: unknown, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShow(false);
    }
    if (selectedDate) {
      onChange(selectedDate);
    }
  };

  const showPicker = () => {
    setShow(true);
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <View style={styles.container}>
      {Platform.OS === 'android' && (
        <TouchableOpacity style={styles.button} onPress={showPicker}>
          <Text style={styles.buttonText}>{formatDate(value)}</Text>
        </TouchableOpacity>
      )}

      {show && (
        <DateTimePicker
          value={value}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleChange}
          minimumDate={minimumDate}
          maximumDate={maximumDate}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  button: {
    backgroundColor: '#f0f0f0',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  buttonText: {
    fontSize: 16,
    color: '#333',
  },
});
