import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import { GoalProgressSummary } from '../services/types';
import { Goal } from '../types/Goal';
import { formatDuration, formatFrequency } from '../utils/goalUtils';

import { styles } from './RoundDetailGoalCard.styles';

/**
 * Format a YYYY-MM-DD date string to a readable format
 */
function formatDate(dateStr: string): string {
  const [year, month, day] = dateStr.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Get the last missed day from progress summary
 */
function getLastMissedDay(progressSummary: GoalProgressSummary | null): string {
  if (!progressSummary || progressSummary.failedCount === 0) {
    return '';
  }

  // If there are amendable dates, use the last one (most recent)
  if (progressSummary.amendableDates && progressSummary.amendableDates.length > 0) {
    const sortedDates = [...progressSummary.amendableDates].sort();
    return formatDate(sortedDates[sortedDates.length - 1]);
  }

  // Fallback: just return a generic message
  return 'recently';
}

interface RoundDetailGoalCardProps {
  goal: Goal;
  progressSummary: GoalProgressSummary | null;
  onLogProgress: () => void;
  onAmendProgress: () => void;
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
  const hasAmendableDates = (progressSummary?.amendableDates?.length ?? 0) > 0;
  const failedCount = progressSummary?.failedCount ?? 0;

  return (
    <View style={styles.card}>
      <View style={styles.contentRow}>
        {/* Emoji avatar */}
        <View style={styles.emojiAvatar}>
          <Text style={styles.emoji}>{goal.emoji || '🎯'}</Text>
        </View>

        {/* Goal info */}
        <View style={styles.infoColumn}>
          <Text style={styles.title}>{goal.title}</Text>
          <Text style={styles.subtitle}>
            {formatFrequency(goal.frequency)} • {formatDuration(goal.durationSeconds)}
          </Text>

          {/* Weekly progress */}
          {progressSummary && (
            <View style={styles.progressRow}>
              <Text style={styles.progressLabel}>Weekly Progress</Text>
              <Text style={styles.progressValue}>
                {progressSummary.completedCount}/{progressSummary.expectedCount}
              </Text>
            </View>
          )}

          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${progressSummary?.completionPercentage || 0}%` },
              ]}
            />
          </View>

          {/* Missed warning if applicable */}
          {failedCount > 0 && (
            <Text style={styles.missedWarning}>⚠️ Missed {getLastMissedDay(progressSummary)}</Text>
          )}
        </View>
      </View>

      {/* Action buttons */}
      <View style={styles.buttonRow}>
        {hasAmendableDates && (
          <TouchableOpacity style={styles.amendButton} onPress={onAmendProgress}>
            <Text style={styles.amendButtonIcon}>📝</Text>
            <Text style={styles.amendButtonText}>Amend</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={[styles.logButton, !canLogToday && styles.logButtonDisabled]}
          onPress={onLogProgress}
          disabled={!canLogToday}
        >
          <Text style={[styles.logButtonText, !canLogToday && styles.logButtonTextDisabled]}>
            {canLogToday ? '+ Log Progress' : '✓ Weekly Quota Met'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
