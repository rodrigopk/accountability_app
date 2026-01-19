import React, { useRef } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';

import { GoalCard } from '../../components/GoalCard';
import { WizardFooter } from '../../components/wizard/WizardFooter';
import { WizardHeader } from '../../components/wizard/WizardHeader';
import { useWizardNavigation } from '../../navigation/useAppNavigation';
import { useWizardStore } from '../../stores/useWizardStore';

export function GoalsStepScreen() {
  const { goToWizardStep, goBackWizard } = useWizardNavigation();
  const { goals, addGoal, updateGoal, removeGoal, isStepValid } = useWizardStore();
  const flatListRef = useRef<FlatList>(null);

  const handleAddGoal = () => {
    // Get the index of the new goal (current length will be the index after adding)
    const newGoalIndex = goals.length;

    addGoal({
      title: '',
      description: '',
      frequency: { type: 'daily' },
      durationSeconds: 0,
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
      <WizardHeader currentStep={2} totalSteps={4} title="Add Goals" onBack={handleBack} />

      <View style={styles.content}>
        <Text style={styles.description}>
          Add the goals you want to achieve during this accountability round.
        </Text>

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
              const wait = new Promise(resolve => setTimeout(resolve, 500));
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
          <Text style={styles.addButtonText}>+ Add Goal</Text>
        </TouchableOpacity>
      </View>

      <WizardFooter onNext={handleNext} nextEnabled={isStepValid('goals')} />
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
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
  listContent: {
    paddingBottom: 16,
  },
  addButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
