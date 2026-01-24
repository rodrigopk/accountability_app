import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';

import { WizardHeader } from '../../components/wizard/WizardHeader';
import { WizardScreenName } from '../../navigation/NavigationService';
import { useWizardNavigation } from '../../navigation/useAppNavigation';
import { useDeviceInfo } from '../../providers/DeviceInfoProvider';
import { CreateRoundService } from '../../services/round/CreateRoundService';
import { useWizardStore } from '../../stores/useWizardStore';
import { formatFrequency, formatDuration } from '../../utils/goalUtils';
import { formatDateRange } from '../../utils/roundUtils';
import { MILLISECONDS_PER_DAY } from '../../utils/timeConstants';

import { styles } from './SummaryStepScreen.styles';

export function SummaryStepScreen() {
  const { goToWizardStep, goBackWizard, closeWizard } = useWizardNavigation();
  const { period, goals, reward, punishment, reset } = useWizardStore();
  const { deviceInfo } = useDeviceInfo();

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
          emoji: goal.emoji,
          frequency: goal.frequency,
          durationSeconds: goal.durationSeconds,
        })),
        reward,
        punishment,
      });

      // Success - reset wizard and navigate to main screen
      await reset();

      // Navigate to root - ActiveRoundsScreen will refresh via useOnScreenFocus
      // when it comes back into focus after the modal is dismissed
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
  const daysDuration = Math.ceil(
    (period.endDate.getTime() - period.startDate.getTime()) / MILLISECONDS_PER_DAY,
  );

  return (
    <View style={styles.container}>
      <WizardHeader
        currentStep={4}
        totalSteps={4}
        title="Review & Confirm"
        onBack={handleBack}
        rightButton={
          <TouchableOpacity onPress={handleCreateRound} disabled={loading}>
            {loading ? (
              <ActivityIndicator color={styles.saveButtonText.color} />
            ) : (
              <Text style={styles.saveButtonText}>Save</Text>
            )}
          </TouchableOpacity>
        }
      />

      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        {/* Period Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionHeaderText}>PERIOD</Text>
            <TouchableOpacity onPress={() => navigateToStep('PeriodStep')}>
              <Text style={styles.editLink}>Edit</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.sectionContent}>
            <Text style={styles.dateRange}>{dateRange}</Text>
            <Text style={styles.duration}>{daysDuration} days duration</Text>
          </View>
        </View>

        {/* Goals Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionHeaderText}>GOALS</Text>
            <TouchableOpacity onPress={() => navigateToStep('GoalsStep')}>
              <Text style={styles.editLink}>Edit</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.sectionContent}>
            {goals.map((goal, index) => (
              <View key={goal.id} style={styles.goalItem}>
                <Text style={styles.goalNumber}>{index + 1}</Text>
                <View style={styles.goalContent}>
                  <View style={styles.goalTitleRow}>
                    {goal.emoji && <Text style={styles.goalEmoji}>{goal.emoji}</Text>}
                    <Text style={styles.goalTitle}>{goal.title}</Text>
                  </View>
                  <Text style={styles.goalDetail}>
                    {formatFrequency(goal.frequency)} • {formatDuration(goal.durationSeconds)}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Reward & Punishment Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionHeaderText}>REWARD & PUNISHMENT</Text>
            <TouchableOpacity onPress={() => navigateToStep('RewardPunishmentStep')}>
              <Text style={styles.editLink}>Edit</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.sectionContent}>
            <View style={styles.rewardPunishmentItem}>
              <Text style={styles.rpLabel}>Reward:</Text>
              <Text style={styles.rpValue}>{reward}</Text>
            </View>
            <View style={styles.rewardPunishmentItem}>
              <Text style={styles.rpLabel}>Punishment:</Text>
              <Text style={styles.rpValue}>{punishment}</Text>
            </View>
          </View>
        </View>

        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity onPress={() => setError(null)}>
              <Text style={styles.dismissText}>Dismiss</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
