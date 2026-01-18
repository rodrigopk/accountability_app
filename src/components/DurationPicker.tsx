import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

import { SECONDS_PER_HOUR, SECONDS_PER_MINUTE } from '../utils/timeConstants';

interface DurationPickerProps {
  value: number; // seconds
  onChange: (seconds: number) => void;
}

export function DurationPicker({ value, onChange }: DurationPickerProps) {
  const hours = Math.floor(value / SECONDS_PER_HOUR);
  const minutes = Math.floor((value % SECONDS_PER_HOUR) / SECONDS_PER_MINUTE);

  const handleHoursChange = (text: string) => {
    const h = parseInt(text, 10) || 0;
    onChange(h * SECONDS_PER_HOUR + minutes * SECONDS_PER_MINUTE);
  };

  const handleMinutesChange = (text: string) => {
    const m = Math.min(59, Math.max(0, parseInt(text, 10) || 0));
    onChange(hours * SECONDS_PER_HOUR + m * SECONDS_PER_MINUTE);
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputGroup}>
        <TextInput
          style={styles.input}
          value={hours.toString()}
          onChangeText={handleHoursChange}
          keyboardType="number-pad"
          placeholder="0"
        />
        <Text style={styles.label}>hours</Text>
      </View>
      <View style={styles.inputGroup}>
        <TextInput
          style={styles.input}
          value={minutes.toString()}
          onChangeText={handleMinutesChange}
          keyboardType="number-pad"
          placeholder="0"
        />
        <Text style={styles.label}>minutes</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginVertical: 8,
  },
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 24,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    width: 80,
    fontSize: 16,
    marginRight: 8,
  },
  label: {
    fontSize: 16,
    color: '#666',
  },
});
