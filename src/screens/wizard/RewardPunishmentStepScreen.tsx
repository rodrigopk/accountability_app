import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

import { WizardHeader } from '../../components/wizard/WizardHeader';
import { WizardNextButton } from '../../components/wizard/WizardNextButton';
import { useWizardNavigation } from '../../navigation/useAppNavigation';
import { useWizardStore } from '../../stores/useWizardStore';
import { colors, spacing, typography, borderRadius } from '../../theme';

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
        rightButton={<WizardNextButton onPress={handleNext} disabled={!isValid} />}
      />

      <View style={styles.content}>
        <Text style={styles.description}>
          Set what you'll reward yourself with if you complete your goals, and what consequences
          you'll face if you don't.
        </Text>

        <Text style={styles.label}>
          Reward <Text style={styles.required}>*</Text>
        </Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={reward}
          onChangeText={setReward}
          placeholder="What will you treat yourself to if you succeed? Be specific."
          placeholderTextColor={colors.textTertiary}
          multiline
          numberOfLines={4}
          maxLength={MAX_LENGTH}
        />
        <Text style={styles.exampleText}>
          Example: "Buy those new running shoes" or "Weekend getaway"
        </Text>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    padding: spacing.xl,
  },
  description: {
    fontSize: typography.fontSize.md,
    color: colors.textSecondary,
    marginBottom: spacing.xxl,
    lineHeight: typography.fontSize.md * 1.5,
  },
  label: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
    marginTop: spacing.lg,
  },
  required: {
    color: colors.danger,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    fontSize: typography.fontSize.lg,
    color: colors.textPrimary,
    backgroundColor: colors.surface,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  exampleText: {
    fontSize: typography.fontSize.sm,
    color: colors.textTertiary,
    marginTop: spacing.xs,
    fontStyle: 'italic',
  },
  charCount: {
    fontSize: typography.fontSize.xs,
    color: colors.textTertiary,
    textAlign: 'right',
    marginTop: spacing.xs,
  },
  helperText: {
    fontSize: typography.fontSize.md,
    color: colors.textSecondary,
    marginTop: spacing.xl,
    lineHeight: typography.fontSize.md * 1.5,
    fontStyle: 'italic',
  },
});
