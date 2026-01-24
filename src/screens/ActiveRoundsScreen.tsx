import React, { useEffect } from 'react';
import { ActivityIndicator, FlatList, Text, TouchableOpacity, View } from 'react-native';
import { Navigation } from 'react-native-navigation';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { EmptyState } from '../components/EmptyState';
import { RoundCard } from '../components/RoundCard';
import { useAppNavigation, useOnScreenFocus } from '../navigation/useAppNavigation';
import { useActiveRounds } from '../providers/ActiveRoundsProvider';
import { colors } from '../theme';

import { styles } from './ActiveRoundsScreen.styles';

/**
 * Screen component displaying all active accountability rounds
 */
export function ActiveRoundsScreen() {
  const { openCreateWizard, goToRoundDetail } = useAppNavigation();
  const { rounds, progressSummaries, loading, error, refresh } = useActiveRounds();
  const insets = useSafeAreaInsets();

  const handleCreatePress = () => {
    openCreateWizard();
  };

  // Refresh when returning from wizard
  useOnScreenFocus(refresh);

  // Also listen for modal dismissal to ensure refresh happens when wizard closes
  useEffect(() => {
    const subscription = Navigation.events().registerModalDismissedListener(() => {
      // Refresh when any modal (including wizard) is dismissed
      refresh().catch(err => console.error('Error refreshing after modal dismissal:', err));
    });

    return () => {
      subscription.remove();
    };
  }, [refresh]);

  if (loading) {
    return (
      <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
        <ActivityIndicator size="large" color={colors.primary} testID="loading-indicator" />
        <Text style={styles.loadingText}>Loading rounds...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
        <Text style={styles.errorText}>Error: {error.message}</Text>
        <Text style={styles.retryText} onPress={refresh}>
          Tap to retry
        </Text>
      </View>
    );
  }

  if (rounds.length === 0) {
    return <EmptyState onCreatePress={handleCreatePress} />;
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      {/* App Header */}
      <View style={styles.appHeader}>
        <View style={styles.logoContainer}>
          <View style={styles.logoPlaceholder}>
            <Text style={styles.logoIcon}>🎯</Text>
          </View>
          <Text style={styles.appName}>Commit</Text>
        </View>
      </View>

      {/* Title Section */}
      <View style={styles.titleSection}>
        <Text style={styles.screenTitle}>Active Rounds</Text>
        <Text style={styles.screenSubtitle}>Track your progress and stay accountable.</Text>
      </View>

      <FlatList
        data={rounds}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <RoundCard
            round={item}
            progressSummary={progressSummaries.get(item.id) || null}
            onPress={() => goToRoundDetail({ roundId: item.id })}
          />
        )}
        style={styles.list}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        contentInsetAdjustmentBehavior="automatic"
      />
      <TouchableOpacity
        style={[styles.fab, { bottom: 20 + insets.bottom }]}
        onPress={handleCreatePress}
      >
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>
    </View>
  );
}
