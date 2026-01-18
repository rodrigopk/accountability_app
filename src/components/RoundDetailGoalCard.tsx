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
  onAmendProgress: () => void;
}

/**
 * Get appropriate button text based on the logging status
 */
function getLogButtonText(canLogToday: boolean, reason?: string): string {
  if (canLogToday) {
    return 'Log Progress';
  }

  // Check for specific reasons
  if (reason) {
    if (reason.includes('not started')) {
      return 'Not Started';
    }
    if (reason.includes('ended')) {
      return 'Round Ended';
    }
    if (reason.includes('not applicable') || reason.includes('only for:')) {
      return 'Not Applicable Today';
    }
    if (reason.includes('quota') && reason.includes('met')) {
      return 'Quota Met';
    }
  }

  // Default fallback
  return 'Already Logged';
}

/**
 * Component displaying a goal card in the round detail view
 * Shows goal information and progress with a "Log Progress" button
 */
export function RoundDetailGoalCard({
  goal,
  progressSummary,
  onLogProgress,
  onAmendProgress,
}: RoundDetailGoalCardProps) {
  const canLogToday = progressSummary?.canLogToday ?? true;
  const canLogReason = progressSummary?.canLogReason;
  const hasAmendableDates = (progressSummary?.amendableDates?.length ?? 0) > 0;
  const failedCount = progressSummary?.failedCount ?? 0;
  const buttonText = getLogButtonText(canLogToday, canLogReason);

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
        <>
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
          {failedCount > 0 && (
            <Text style={styles.failedCount}>
              {failedCount} missed {failedCount === 1 ? 'day' : 'days'}
            </Text>
          )}
        </>
      )}

      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[styles.logButton, !canLogToday && styles.logButtonDisabled, styles.logButtonFlex]}
          onPress={onLogProgress}
          disabled={!canLogToday}
        >
          <Text style={[styles.logButtonText, !canLogToday && styles.logButtonTextDisabled]}>
            {buttonText}
          </Text>
        </TouchableOpacity>
        {hasAmendableDates && (
          <TouchableOpacity style={styles.amendButton} onPress={onAmendProgress}>
            <Text style={styles.amendButtonText}>Amend</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
