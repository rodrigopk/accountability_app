import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { useActiveRounds } from '../providers/ActiveRoundsProvider';
import { RoundCard } from '../components/RoundCard';
import { EmptyState } from '../components/EmptyState';

/**
 * Screen component displaying all active accountability rounds
 */
export function ActiveRoundsScreen() {
  const { rounds, progressSummaries, loading, error, refresh } = useActiveRounds();

  const handleCreatePress = () => {
    // Placeholder for future implementation
    console.log('Create round pressed');
  };

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
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <RoundCard
            round={item}
            progressSummary={progressSummaries.get(item.id) || null}
          />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
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
});
