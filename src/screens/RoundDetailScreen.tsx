import { useRoute } from '@react-navigation/native';
import React from 'react';
import { Alert, ScrollView, Text, View } from 'react-native';

import { RoundDetailGoalCard } from '../components/RoundDetailGoalCard';
import { RoundDetailRouteProp } from '../navigation/types';
import { useActiveRounds } from '../providers/ActiveRoundsProvider';
import { formatDateRange } from '../utils/roundUtils';

import { styles } from './RoundDetailScreen.styles';

/**
 * Screen component displaying detailed information for a single accountability round
 */
export function RoundDetailScreen() {
  const route = useRoute<RoundDetailRouteProp>();
  const { roundId } = route.params;

  const { rounds, progressSummaries } = useActiveRounds();

  const round = rounds.find(r => r.id === roundId);
  const progressSummary = progressSummaries.get(roundId) || null;

  if (!round) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Round not found</Text>
      </View>
    );
  }

  const handleLogProgress = (_goalId: string) => {
    // Placeholder for future implementation
    Alert.alert('Coming Soon', 'Progress logging will be available soon!');
  };

  return (
    <ScrollView style={styles.container}>
      {/* Round Header */}
      <View style={styles.header}>
        <Text style={styles.title}>{round.reward || 'Accountability Round'}</Text>
        <Text style={styles.dateRange}>{formatDateRange(round.startDate, round.endDate)}</Text>
        {round.punishment && (
          <View style={styles.punishmentContainer}>
            <Text style={styles.punishmentLabel}>Punishment:</Text>
            <Text style={styles.punishmentValue}>{round.punishment}</Text>
          </View>
        )}
      </View>

      {/* Goals Section */}
      <Text style={styles.sectionTitle}>Goals</Text>
      {round.goals.map(goal => {
        const goalProgressSummary =
          progressSummary?.goalSummaries.find(g => g.goalId === goal.id) || null;
        return (
          <RoundDetailGoalCard
            key={goal.id}
            goal={goal}
            progressSummary={goalProgressSummary}
            onLogProgress={() => handleLogProgress(goal.id)}
          />
        );
      })}
    </ScrollView>
  );
}
