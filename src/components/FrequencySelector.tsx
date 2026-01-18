import React from 'react';
import { View, Text, TouchableOpacity, TextInput } from 'react-native';

import { GoalFrequency, DayOfWeek } from '../types/Goal';

import { styles } from './FrequencySelector.styles';

interface FrequencySelectorProps {
  value: GoalFrequency;
  onChange: (frequency: GoalFrequency) => void;
}

const DAYS: { key: DayOfWeek; label: string }[] = [
  { key: 'monday', label: 'Mon' },
  { key: 'tuesday', label: 'Tue' },
  { key: 'wednesday', label: 'Wed' },
  { key: 'thursday', label: 'Thu' },
  { key: 'friday', label: 'Fri' },
  { key: 'saturday', label: 'Sat' },
  { key: 'sunday', label: 'Sun' },
];

export function FrequencySelector({ value, onChange }: FrequencySelectorProps) {
  const isDaily = value.type === 'daily';
  const isTimesPerWeek = value.type === 'timesPerWeek';
  const isSpecificDays = value.type === 'specificDays';

  const handleTypeChange = (type: 'daily' | 'timesPerWeek' | 'specificDays') => {
    switch (type) {
      case 'daily':
        onChange({ type: 'daily' });
        break;
      case 'timesPerWeek':
        onChange({ type: 'timesPerWeek', count: 3 });
        break;
      case 'specificDays':
        onChange({ type: 'specificDays', days: [] });
        break;
    }
  };

  const toggleDay = (day: DayOfWeek) => {
    if (value.type !== 'specificDays') return;
    const days = value.days.includes(day)
      ? value.days.filter(d => d !== day)
      : [...value.days, day];
    onChange({ type: 'specificDays', days });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.option} onPress={() => handleTypeChange('daily')}>
        <View style={[styles.radioCircle, isDaily && styles.radioSelected]} />
        <Text style={styles.optionText}>Daily</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.option} onPress={() => handleTypeChange('timesPerWeek')}>
        <View style={[styles.radioCircle, isTimesPerWeek && styles.radioSelected]} />
        <Text style={styles.optionText}>Times per week</Text>
      </TouchableOpacity>

      {isTimesPerWeek && value.type === 'timesPerWeek' && (
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={value.count.toString()}
            onChangeText={text => {
              const count = Math.min(7, Math.max(1, parseInt(text, 10) || 1));
              onChange({ type: 'timesPerWeek', count });
            }}
            keyboardType="number-pad"
            placeholder="3"
          />
          <Text style={styles.inputLabel}>times per week</Text>
        </View>
      )}

      <TouchableOpacity style={styles.option} onPress={() => handleTypeChange('specificDays')}>
        <View style={[styles.radioCircle, isSpecificDays && styles.radioSelected]} />
        <Text style={styles.optionText}>Specific days</Text>
      </TouchableOpacity>

      {isSpecificDays && (
        <View style={styles.daysContainer}>
          {DAYS.map(({ key, label }) => (
            <TouchableOpacity
              key={key}
              style={[styles.dayButton, value.days?.includes(key) && styles.dayButtonSelected]}
              onPress={() => toggleDay(key)}
            >
              <Text
                style={[
                  styles.dayButtonText,
                  value.days?.includes(key) && styles.dayButtonTextSelected,
                ]}
              >
                {label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}
