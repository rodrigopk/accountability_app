import React, { useState, useCallback } from 'react';
import {
  Alert,
  ScrollView,
  Text,
  View,
  Modal,
  TouchableOpacity,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';

import { RoundDetailGoalCard } from '../components/RoundDetailGoalCard';
import { useActiveRounds } from '../providers/ActiveRoundsProvider';
import { LogProgressService } from '../services/progress/LogProgressService';
import { Goal } from '../types/Goal';
import { formatDateRange } from '../utils/roundUtils';

import { styles } from './RoundDetailScreen.styles';

interface RoundDetailScreenProps {
  roundId: string;
}

interface LogProgressModalState {
  visible: boolean;
  goalId: string;
  goalTitle: string;
  targetDate?: string; // If set, this is an amendment
  amendableDates: string[];
}

const initialModalState: LogProgressModalState = {
  visible: false,
  goalId: '',
  goalTitle: '',
  targetDate: undefined,
  amendableDates: [],
};

/**
 * Screen component displaying detailed information for a single accountability round
 */
export function RoundDetailScreen({ roundId }: RoundDetailScreenProps) {
  const { rounds, progressSummaries, refresh } = useActiveRounds();

  const [modalState, setModalState] = useState<LogProgressModalState>(initialModalState);
  const [durationMinutes, setDurationMinutes] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAmendDatePicker, setShowAmendDatePicker] = useState(false);

  const round = rounds.find(r => r.id === roundId);
  const progressSummary = progressSummaries.get(roundId) || null;

  const resetModal = useCallback(() => {
    setModalState(initialModalState);
    setDurationMinutes('');
    setNotes('');
    setShowAmendDatePicker(false);
  }, []);

  const handleLogProgress = useCallback(
    (goal: Goal) => {
      const goalSummary = progressSummary?.goalSummaries.find(g => g.goalId === goal.id);

      if (!goalSummary?.canLogToday) {
        Alert.alert('Cannot Log Progress', 'You have already logged progress for today.');
        return;
      }

      setModalState({
        visible: true,
        goalId: goal.id,
        goalTitle: goal.title,
        targetDate: undefined,
        amendableDates: goalSummary?.amendableDates ?? [],
      });
      setDurationMinutes(String(Math.floor(goal.durationSeconds / 60)));
    },
    [progressSummary],
  );

  const handleAmendProgress = useCallback(
    (goal: Goal) => {
      const goalSummary = progressSummary?.goalSummaries.find(g => g.goalId === goal.id);
      const amendableDates = goalSummary?.amendableDates ?? [];

      if (amendableDates.length === 0) {
        Alert.alert('No Dates to Amend', 'There are no missed dates that can be amended.');
        return;
      }

      setModalState({
        visible: true,
        goalId: goal.id,
        goalTitle: goal.title,
        targetDate: undefined,
        amendableDates,
      });
      setShowAmendDatePicker(true);
      setDurationMinutes(String(Math.floor(goal.durationSeconds / 60)));
    },
    [progressSummary],
  );

  const handleSelectAmendDate = useCallback((date: string) => {
    setModalState(prev => ({ ...prev, targetDate: date }));
    setShowAmendDatePicker(false);
  }, []);

  const handleSubmitProgress = useCallback(async () => {
    if (!modalState.goalId || !roundId) return;

    const duration = parseInt(durationMinutes, 10);
    if (isNaN(duration) || duration <= 0) {
      Alert.alert('Invalid Duration', 'Please enter a valid duration in minutes.');
      return;
    }

    setIsSubmitting(true);

    try {
      const logProgressService = new LogProgressService();
      await logProgressService.execute({
        roundId,
        goalId: modalState.goalId,
        durationSeconds: duration * 60,
        notes: notes.trim() || undefined,
        targetDate: modalState.targetDate,
      });

      resetModal();
      refresh();

      Alert.alert(
        'Progress Logged',
        modalState.targetDate
          ? `Successfully amended progress for ${formatDisplayDate(modalState.targetDate)}`
          : 'Successfully logged progress for today!',
      );
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      Alert.alert('Error', errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  }, [modalState, roundId, durationMinutes, notes, resetModal, refresh]);

  if (!round) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Round not found</Text>
      </View>
    );
  }

  return (
    <>
      <ScrollView style={styles.container}>
        {/* Round Header */}
        <View style={styles.header}>
          <Text style={styles.title}>{round.reward || 'Accountability Round'}</Text>
          <Text style={styles.dateRange}>{formatDateRange(round.startDate, round.endDate)}</Text>
          {round.punishment && (
            <View style={styles.punishmentContainer}>
              <Text style={styles.punishmentLabel}>Punishment:</Text>
              <Text style={styles.punishmentValue}>{round.punishment}</Text>
            </View>
          )}
        </View>

        {/* Goals Section */}
        <Text style={styles.sectionTitle}>Goals</Text>
        {round.goals.map(goal => {
          const goalProgressSummary =
            progressSummary?.goalSummaries.find(g => g.goalId === goal.id) || null;
          return (
            <RoundDetailGoalCard
              key={goal.id}
              goal={goal}
              progressSummary={goalProgressSummary}
              onLogProgress={() => handleLogProgress(goal)}
              onAmendProgress={() => handleAmendProgress(goal)}
            />
          );
        })}
      </ScrollView>

      {/* Log Progress Modal */}
      <Modal
        visible={modalState.visible}
        transparent
        animationType="slide"
        onRequestClose={resetModal}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              {showAmendDatePicker ? (
                // Date picker for amendments
                <>
                  <Text style={styles.modalTitle}>Select Date to Amend</Text>
                  <Text style={styles.modalSubtitle}>Choose a missed date to log progress for</Text>
                  <ScrollView style={styles.datePickerScrollView}>
                    {modalState.amendableDates.map(date => (
                      <TouchableOpacity
                        key={date}
                        style={styles.dateOption}
                        onPress={() => handleSelectAmendDate(date)}
                      >
                        <Text style={styles.dateOptionText}>{formatDisplayDate(date)}</Text>
                        <View style={styles.dateOptionBadge}>
                          <Text style={styles.dateOptionBadgeText}>Missed</Text>
                        </View>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                  <TouchableOpacity style={styles.cancelButton} onPress={resetModal}>
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                </>
              ) : (
                // Progress input form
                <>
                  <Text style={styles.modalTitle}>
                    {modalState.targetDate ? 'Amend Progress' : 'Log Progress'}
                  </Text>
                  <Text style={styles.modalSubtitle}>
                    {modalState.goalTitle}
                    {modalState.targetDate && ` - ${formatDisplayDate(modalState.targetDate)}`}
                  </Text>

                  <Text style={styles.inputLabel}>Duration (minutes)</Text>
                  <TextInput
                    style={styles.durationInput}
                    value={durationMinutes}
                    onChangeText={setDurationMinutes}
                    keyboardType="numeric"
                    placeholder="Enter duration in minutes"
                  />

                  <Text style={styles.inputLabel}>Notes (optional)</Text>
                  <TextInput
                    style={styles.notesInput}
                    value={notes}
                    onChangeText={setNotes}
                    placeholder="Add any notes..."
                    multiline
                  />

                  <TouchableOpacity
                    style={styles.submitButton}
                    onPress={handleSubmitProgress}
                    disabled={isSubmitting}
                  >
                    <Text style={styles.submitButtonText}>
                      {isSubmitting ? 'Saving...' : 'Save Progress'}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.cancelButton} onPress={resetModal}>
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
}

/**
 * Format a YYYY-MM-DD date string to a more readable format
 */
function formatDisplayDate(dateStr: string): string {
  const [year, month, day] = dateStr.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}
