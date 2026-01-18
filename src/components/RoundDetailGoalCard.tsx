import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import { GoalProgressSummary } from '../services/types';
import { Goal } from '../types/Goal';
import { formatDuration, formatFrequency } from '../utils/goalUtils';

import { styles } from './RoundDetailGoalCard.styles';

interface RoundDetailGoalCardProps {
  goal: Goal;
  progressSummary: GoalProgressSummary | null;
  onLogProgress: () => void;
}

/**
 * Component displaying a goal card in the round detail view
 * Shows goal information and progress with a "Log Progress" button
 */
export function RoundDetailGoalCard({
  goal,
  progressSummary,
  onLogProgress,
}: RoundDetailGoalCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{goal.title}</Text>
      {goal.description && <Text style={styles.description}>{goal.description}</Text>}

      <View style={styles.detailRow}>
        <Text style={styles.label}>Frequency:</Text>
        <Text style={styles.value}>{formatFrequency(goal.frequency)}</Text>
      </View>

      <View style={styles.detailRow}>
        <Text style={styles.label}>Duration:</Text>
        <Text style={styles.value}>{formatDuration(goal.durationSeconds)}</Text>
      </View>

      {progressSummary && (
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View
              style={[styles.progressFill, { width: `${progressSummary.completionPercentage}%` }]}
            />
          </View>
          <Text style={styles.progressText}>
            {progressSummary.completedCount}/{progressSummary.expectedCount} completed
          </Text>
        </View>
      )}

      <TouchableOpacity style={styles.logButton} onPress={onLogProgress}>
        <Text style={styles.logButtonText}>Log Progress</Text>
      </TouchableOpacity>
    </View>
  );
}
