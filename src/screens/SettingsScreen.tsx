import React from 'react';
import { View, Text, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { getVersion, getBuildNumber } from 'react-native-device-info';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useActiveRounds } from '../providers/ActiveRoundsProvider';
import { ClearAllDataService } from '../services/data/ClearAllDataService';

import { styles } from './SettingsScreen.styles.ts';

export function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const appVersion = getVersion();
  const buildNumber = getBuildNumber();
  const { refresh } = useActiveRounds();

  const handleDeleteAllData = () => {
    Alert.alert(
      'Delete All Data',
      'This will permanently remove all rounds, history, and settings. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const service = new ClearAllDataService();
              await service.execute();
              await refresh();
              Alert.alert('Data Deleted', 'All local data has been removed successfully.');
            } catch {
              Alert.alert('Error', 'Failed to delete data. Please try again.');
            }
          },
        },
      ],
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.sectionTitle}>ABOUT</Text>
        <View style={styles.section}>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>App Version</Text>
            <Text style={styles.rowValue}>{appVersion}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Build Number</Text>
            <Text style={styles.rowValue}>{buildNumber}</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>DATA MANAGEMENT</Text>
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.dangerRow}
            onPress={handleDeleteAllData}
            testID="delete-all-data-button"
          >
            <Text style={styles.dangerRowText}>Delete All Data</Text>
            <Text style={styles.dangerRowIcon}>🗑️</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.sectionDescription}>
          Permanently remove all rounds, history, and settings. This action cannot be undone.
        </Text>
      </ScrollView>
    </View>
  );
}
