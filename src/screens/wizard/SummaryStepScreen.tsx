import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';

import { WizardHeader } from '../../components/wizard/WizardHeader';
import { SummaryStepNavigationProp } from '../../navigation/types';
import { useActiveRounds } from '../../providers/ActiveRoundsProvider';
import { useWizard } from '../../providers/CreateRoundWizardProvider';
import { useDeviceInfo } from '../../providers/DeviceInfoProvider';
import { CreateRoundService } from '../../services/round/CreateRoundService';
import { formatFrequency } from '../../utils/goalUtils';
import { formatDateRange } from '../../utils/roundUtils';

import { styles } from './SummaryStepScreen.styles';

export function SummaryStepScreen() {
  const navigation = useNavigation<SummaryStepNavigationProp>();
  const { state, reset } = useWizard();
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
        startDate: state.period.startDate!.toISOString(),
        endDate: state.period.endDate!.toISOString(),
        goals: state.goals.map(goal => ({
          title: goal.title,
          description: goal.description,
          frequency: goal.frequency,
          durationSeconds: goal.durationSeconds,
        })),
        reward: state.reward,
        punishment: state.punishment,
      });

      // Success - reset wizard and navigate to main screen
      await reset();
      refresh();

      // Navigate to root
      navigation.getParent()?.goBack();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create round');
    } finally {
      setLoading(false);
    }
  };

  const navigateToStep = (step: 'PeriodStep' | 'GoalsStep' | 'RewardPunishmentStep') => {
    navigation.navigate(step);
  };

  const handleBack = () => {
    navigation.goBack();
  };

  if (!state.period.startDate || !state.period.endDate) {
    return null; // Should never happen
  }

  const dateRange = formatDateRange(
    state.period.startDate.toISOString(),
    state.period.endDate.toISOString(),
  );

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
            <Text style={styles.sectionLabel}>Goals ({state.goals.length})</Text>
            <Text style={styles.editText}>Edit</Text>
          </View>
          {state.goals.map((goal, index) => (
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
            <Text style={styles.rpValue}>{state.reward}</Text>
          </View>
          <View style={styles.rewardPunishmentItem}>
            <Text style={styles.rpLabel}>Punishment:</Text>
            <Text style={styles.rpValue}>{state.punishment}</Text>
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
