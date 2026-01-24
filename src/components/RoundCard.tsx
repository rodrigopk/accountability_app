import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import { RoundProgressSummary } from '../services/types';
import { AccountabilityRound } from '../types/AccountabilityRound';
import { formatDateRange, calculateOverallProgress } from '../utils/roundUtils';

import { styles } from './RoundCard.styles';

interface RoundCardProps {
  round: AccountabilityRound;
  progressSummary: RoundProgressSummary | null;
  onPress: () => void;
}

/**
 * Component displaying a single accountability round as a card
 */
export function RoundCard({ round, progressSummary, onPress }: RoundCardProps) {
  const title = round.reward || 'Accountability Round';
  const dateRange = formatDateRange(round.startDate, round.endDate);
  const overallProgress = calculateOverallProgress(progressSummary);

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      {/* Header row with Reward label and Date badge */}
      <View style={styles.headerRow}>
        <Text style={styles.rewardLabel}>Reward</Text>
        <View style={styles.dateBadge}>
          <Text style={styles.dateBadgeIcon}>📅</Text>
          <Text style={styles.dateBadgeText}>{dateRange}</Text>
        </View>
      </View>

      {/* Title */}
      <Text style={styles.title}>{title}</Text>

      {/* Progress section */}
      {progressSummary && (
        <View style={styles.progressSection}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressLabel}>Progress</Text>
            <Text style={styles.progressValue}>{overallProgress}%</Text>
          </View>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${overallProgress}%` }]} />
          </View>
        </View>
      )}

      {/* Goals chips */}
      <View style={styles.goalsSection}>
        <Text style={styles.goalsLabel}>Goals</Text>
        <View style={styles.goalsChipsRow}>
          {round.goals.slice(0, 3).map(goal => (
            <View key={goal.id} style={styles.goalChip}>
              {goal.emoji && <Text style={styles.goalChipEmoji}>{goal.emoji}</Text>}
              <Text style={styles.goalChipText} numberOfLines={1}>
                {goal.title}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </TouchableOpacity>
  );
}
