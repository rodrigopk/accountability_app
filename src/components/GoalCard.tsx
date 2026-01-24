import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';

import { Goal } from '../types/Goal';
import { formatFrequency, formatDuration } from '../utils/goalUtils';

import { DurationPicker } from './DurationPicker';
import { EmojiPickerButton } from './EmojiPickerButton';
import { FrequencySelector } from './FrequencySelector';
import { styles } from './GoalCard.styles';

interface GoalCardProps {
  goal: Goal;
  onUpdate: (updates: Partial<Omit<Goal, 'id'>>) => void;
  onRemove: () => void;
}

export function GoalCard({ goal, onUpdate, onRemove }: GoalCardProps) {
  // New goals (empty title) start in edit mode, others start in show mode
  const [isEditing, setIsEditing] = useState(!goal.title);

  const handleRemove = () => {
    Alert.alert('Remove Goal', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Remove', style: 'destructive', onPress: onRemove },
    ]);
  };

  const handleDone = () => {
    setIsEditing(false);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const isValid = goal.title.trim().length > 0 && goal.durationSeconds > 0;

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        {goal.emoji && <Text style={styles.emojiDisplay}>{goal.emoji}</Text>}
        <Text style={styles.title}>{goal.title || 'New Goal'}</Text>
        <View style={styles.headerRight}>
          {!isValid && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>Incomplete</Text>
            </View>
          )}
          {!isEditing && (
            <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {isEditing ? (
        <View style={styles.form}>
          <Text style={styles.label}>Title *</Text>
          <TextInput
            style={styles.input}
            value={goal.title}
            onChangeText={text => onUpdate({ title: text })}
            placeholder="E.g., Exercise, Read"
          />

          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={goal.description || ''}
            onChangeText={text => onUpdate({ description: text })}
            placeholder="Optional description"
            multiline
            numberOfLines={2}
          />

          <Text style={styles.label}>Frequency *</Text>
          <FrequencySelector
            value={goal.frequency}
            onChange={frequency => onUpdate({ frequency })}
          />

          <Text style={styles.label}>Duration *</Text>
          <DurationPicker
            value={goal.durationSeconds}
            onChange={seconds => onUpdate({ durationSeconds: seconds })}
          />

          <View style={styles.emojiRow}>
            <Text style={styles.label}>Icon</Text>
            <EmojiPickerButton
              value={goal.emoji}
              onChange={emoji => onUpdate({ emoji })}
              size="medium"
            />
          </View>

          <TouchableOpacity style={styles.removeButton} onPress={handleRemove}>
            <Text style={styles.removeButtonText}>Remove Goal</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.doneButton} onPress={handleDone}>
            <Text style={styles.doneButtonText}>Done</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.showModeContainer}>
          {goal.description ? (
            <View style={styles.detailRow}>
              <Text style={styles.detailValue}>{goal.description}</Text>
            </View>
          ) : null}
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Frequency:</Text>
            <Text style={styles.detailValue}>{formatFrequency(goal.frequency)}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Duration:</Text>
            <Text style={styles.detailValue}>{formatDuration(goal.durationSeconds)}</Text>
          </View>
        </View>
      )}
    </View>
  );
}
