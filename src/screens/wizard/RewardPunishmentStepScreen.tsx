import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

import { WizardFooter } from '../../components/wizard/WizardFooter';
import { WizardHeader } from '../../components/wizard/WizardHeader';
import { useWizardNavigation } from '../../navigation/useAppNavigation';
import { useWizardStore } from '../../stores/useWizardStore';

const MAX_LENGTH = 200;

export function RewardPunishmentStepScreen() {
  const { goToWizardStep, goBackWizard } = useWizardNavigation();
  const {
    reward: storedReward,
    punishment: storedPunishment,
    updateRewardPunishment,
  } = useWizardStore();

  const [reward, setReward] = useState(storedReward);
  const [punishment, setPunishment] = useState(storedPunishment);

  const handleNext = () => {
    updateRewardPunishment(reward.trim(), punishment.trim());
    goToWizardStep('SummaryStep');
  };

  const handleBack = () => {
    // Save current values before going back
    updateRewardPunishment(reward.trim(), punishment.trim());
    goBackWizard();
  };

  const isValid = reward.trim().length > 0 && punishment.trim().length > 0;

  return (
    <View style={styles.container}>
      <WizardHeader
        currentStep={3}
        totalSteps={4}
        title="Set Reward & Punishment"
        onBack={handleBack}
      />

      <View style={styles.content}>
        <Text style={styles.description}>
          Set what you'll reward yourself with if you complete your goals, and what consequences
          you'll face if you don't.
        </Text>

        <Text style={styles.label}>Reward *</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={reward}
          onChangeText={setReward}
          placeholder="E.g., Buy that new book, Weekend trip, Special meal..."
          placeholderTextColor="#999"
          multiline
          numberOfLines={4}
          maxLength={MAX_LENGTH}
        />
        <Text style={styles.charCount}>
          {reward.length}/{MAX_LENGTH}
        </Text>

        <Text style={styles.label}>Punishment *</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={punishment}
          onChangeText={setPunishment}
          placeholder="E.g., Donate to a cause you dislike, Skip next leisure activity..."
          placeholderTextColor="#999"
          multiline
          numberOfLines={4}
          maxLength={MAX_LENGTH}
        />
        <Text style={styles.charCount}>
          {punishment.length}/{MAX_LENGTH}
        </Text>

        <Text style={styles.helperText}>
          Be specific and meaningful. The reward should motivate you, and the punishment should be
          something you want to avoid.
        </Text>
      </View>

      <WizardFooter onNext={handleNext} nextEnabled={isValid} nextLabel="Next" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 24,
    lineHeight: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#fff',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  charCount: {
    fontSize: 12,
    color: '#999',
    textAlign: 'right',
    marginTop: 4,
  },
  helperText: {
    fontSize: 14,
    color: '#666',
    marginTop: 20,
    lineHeight: 20,
    fontStyle: 'italic',
  },
});
