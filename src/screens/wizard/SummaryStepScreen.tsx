import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';

import { WizardHeader } from '../../components/wizard/WizardHeader';
import { WizardScreenName } from '../../navigation/NavigationService';
import { useWizardNavigation } from '../../navigation/useAppNavigation';
import { useActiveRounds } from '../../providers/ActiveRoundsProvider';
import { useDeviceInfo } from '../../providers/DeviceInfoProvider';
import { CreateRoundService } from '../../services/round/CreateRoundService';
import { useWizardStore } from '../../stores/useWizardStore';
import { formatFrequency } from '../../utils/goalUtils';
import { formatDateRange } from '../../utils/roundUtils';

import { styles } from './SummaryStepScreen.styles';

export function SummaryStepScreen() {
  const { goToWizardStep, goBackWizard, closeWizard } = useWizardNavigation();
  const { period, goals, reward, punishment, reset } = useWizardStore();
  const { deviceInfo } = useDeviceInfo();
  const { refresh } = useActiveRounds();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreateRound = async () => {
    if (!deviceInfo?.id) {
      setError('Device information not available');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const createRoundService = new CreateRoundService();

      await createRoundService.execute({
        deviceId: deviceInfo.id,
        startDate: period.startDate!.toISOString(),
        endDate: period.endDate!.toISOString(),
        goals: goals.map(goal => ({
          title: goal.title,
          description: goal.description,
          frequency: goal.frequency,
          durationSeconds: goal.durationSeconds,
        })),
        reward,
        punishment,
      });

      // Success - reset wizard and navigate to main screen
      await reset();
      refresh();

      // Navigate to root
      closeWizard();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create round');
    } finally {
      setLoading(false);
    }
  };

  const navigateToStep = (step: WizardScreenName) => {
    goToWizardStep(step);
  };

  const handleBack = () => {
    goBackWizard();
  };

  if (!period.startDate || !period.endDate) {
    return null; // Should never happen
  }

  const dateRange = formatDateRange(period.startDate.toISOString(), period.endDate.toISOString());

  return (
    <View style={styles.container}>
      <WizardHeader currentStep={4} totalSteps={4} title="Review & Confirm" onBack={handleBack} />

      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.sectionTitle}>Summary</Text>
        <Text style={styles.description}>
          Review your accountability round details. Tap any section to edit.
        </Text>

        {/* Period Section */}
        <TouchableOpacity style={styles.section} onPress={() => navigateToStep('PeriodStep')}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionLabel}>Period</Text>
            <Text style={styles.editText}>Edit</Text>
          </View>
          <Text style={styles.sectionValue}>{dateRange}</Text>
        </TouchableOpacity>

        {/* Goals Section */}
        <TouchableOpacity style={styles.section} onPress={() => navigateToStep('GoalsStep')}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionLabel}>Goals ({goals.length})</Text>
            <Text style={styles.editText}>Edit</Text>
          </View>
          {goals.map((goal, index) => (
            <View key={goal.id} style={styles.goalItem}>
              <Text style={styles.goalTitle}>
                {index + 1}. {goal.title}
              </Text>
              <Text style={styles.goalDetail}>
                {formatFrequency(goal.frequency)} • {Math.floor(goal.durationSeconds / 60)} minutes
              </Text>
            </View>
          ))}
        </TouchableOpacity>

        {/* Reward & Punishment Section */}
        <TouchableOpacity
          style={styles.section}
          onPress={() => navigateToStep('RewardPunishmentStep')}
        >
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionLabel}>Reward & Punishment</Text>
            <Text style={styles.editText}>Edit</Text>
          </View>
          <View style={styles.rewardPunishmentItem}>
            <Text style={styles.rpLabel}>Reward:</Text>
            <Text style={styles.rpValue}>{reward}</Text>
          </View>
          <View style={styles.rewardPunishmentItem}>
            <Text style={styles.rpLabel}>Punishment:</Text>
            <Text style={styles.rpValue}>{punishment}</Text>
          </View>
        </TouchableOpacity>

        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity onPress={() => setError(null)}>
              <Text style={styles.dismissText}>Dismiss</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.createButton, loading && styles.createButtonDisabled]}
          onPress={handleCreateRound}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.createButtonText}>Create Round</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}
