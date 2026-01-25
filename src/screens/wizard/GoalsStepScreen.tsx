import React, { useRef, useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';

import { GoalCard } from '../../components/GoalCard';
import { NotificationWarningBanner } from '../../components/NotificationWarningBanner';
import { WizardHeader } from '../../components/wizard/WizardHeader';
import { WizardNextButton } from '../../components/wizard/WizardNextButton';
import { useWizardNavigation } from '../../navigation/useAppNavigation';
import { createNotificationProvider } from '../../services/notifications';
import { useWizardStore } from '../../stores/useWizardStore';
import { colors, spacing, typography, borderRadius } from '../../theme';
import { DEFAULT_NOTIFICATION_TIME } from '../../types/Goal';

export function GoalsStepScreen() {
  const { goToWizardStep, goBackWizard } = useWizardNavigation();
  const { goals, addGoal, updateGoal, removeGoal, isStepValid } = useWizardStore();
  const flatListRef = useRef<FlatList>(null);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  useEffect(() => {
    const checkPermissions = async () => {
      const provider = createNotificationProvider();
      const hasPermission = await provider.hasPermission();
      setNotificationsEnabled(hasPermission);
    };
    checkPermissions();
  }, []);

  const handleAddGoal = () => {
    // Get the index of the new goal (current length will be the index after adding)
    const newGoalIndex = goals.length;

    addGoal({
      title: '',
      description: '',
      frequency: { type: 'daily' },
      durationSeconds: 0,
      notificationTime: DEFAULT_NOTIFICATION_TIME,
    });

    // Scroll to the start of the newly added goal card
    setTimeout(() => {
      flatListRef.current?.scrollToIndex({
        index: newGoalIndex,
        animated: true,
        viewPosition: 0, // 0 = top of the viewport
      });
    }, 100);
  };

  const handleNext = () => {
    goToWizardStep('RewardPunishmentStep');
  };

  const handleBack = () => {
    goBackWizard();
  };

  return (
    <View style={styles.container}>
      <WizardHeader
        currentStep={2}
        totalSteps={4}
        title="Add Goals"
        onBack={handleBack}
        rightButton={<WizardNextButton onPress={handleNext} disabled={!isStepValid('goals')} />}
      />

      <View style={styles.content}>
        <Text style={styles.description}>
          Add the goals you want to achieve during this accountability round.
        </Text>

        {!notificationsEnabled && <NotificationWarningBanner />}

        {goals.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No goals added yet</Text>
          </View>
        ) : (
          <FlatList
            ref={flatListRef}
            data={goals}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <GoalCard
                goal={item}
                onUpdate={updates => updateGoal(item.id, updates)}
                onRemove={() => removeGoal(item.id)}
              />
            )}
            contentContainerStyle={styles.listContent}
            onScrollToIndexFailed={info => {
              // Fallback: if scrollToIndex fails, scroll to end instead
              const wait = new Promise<void>(resolve => setTimeout(() => resolve(), 500));
              wait.then(() => {
                flatListRef.current?.scrollToIndex({
                  index: info.index,
                  animated: true,
                  viewPosition: 0,
                });
              });
            }}
          />
        )}

        <TouchableOpacity style={styles.addButton} onPress={handleAddGoal}>
          <Text style={styles.addButtonText}>Add Another Goal</Text>
        </TouchableOpacity>
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
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.xxxl,
  },
  emptyText: {
    fontSize: typography.fontSize.lg,
    color: colors.textTertiary,
  },
  listContent: {
    paddingBottom: spacing.lg,
  },
  addButton: {
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: 'dashed',
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  addButtonText: {
    color: colors.textSecondary,
    fontSize: typography.fontSize.md,
  },
});
