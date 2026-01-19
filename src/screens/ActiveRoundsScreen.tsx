import React, { useEffect } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Navigation } from 'react-native-navigation';

import { EmptyState } from '../components/EmptyState';
import { RoundCard } from '../components/RoundCard';
import { useAppNavigation, useOnScreenFocus } from '../navigation/useAppNavigation';
import { useActiveRounds } from '../providers/ActiveRoundsProvider';

/**
 * Screen component displaying all active accountability rounds
 */
export function ActiveRoundsScreen() {
  const { openCreateWizard, goToRoundDetail } = useAppNavigation();
  const { rounds, progressSummaries, loading, error, refresh } = useActiveRounds();

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
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007AFF" testID="loading-indicator" />
        <Text style={styles.loadingText}>Loading rounds...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
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
    <View style={styles.container}>
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
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
      <TouchableOpacity style={styles.fab} onPress={handleCreatePress}>
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  listContent: {
    paddingTop: 16,
    paddingBottom: 16,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    fontSize: 16,
    color: '#ff0000',
    textAlign: 'center',
    marginBottom: 8,
  },
  retryText: {
    fontSize: 14,
    color: '#007AFF',
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  fabIcon: {
    fontSize: 32,
    color: '#fff',
    fontWeight: '300',
  },
});
