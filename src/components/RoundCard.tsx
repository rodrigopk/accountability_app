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
  const goalTitles = round.goals.map(goal => goal.title).join(', ');

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.dateRange}>{dateRange}</Text>

      {progressSummary && (
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${overallProgress}%` }]} />
          </View>
          <Text style={styles.progressText}>{overallProgress}%</Text>
        </View>
      )}

      {goalTitles && (
        <Text style={styles.goals} numberOfLines={2}>
          {goalTitles}
        </Text>
      )}
    </TouchableOpacity>
  );
}
