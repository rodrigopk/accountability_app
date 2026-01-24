import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { CalendarRangePicker } from '../../components/CalendarRangePicker';
import { WizardFooter } from '../../components/wizard/WizardFooter';
import { WizardHeader } from '../../components/wizard/WizardHeader';
import { useWizardNavigation } from '../../navigation/useAppNavigation';
import { useWizardStore } from '../../stores/useWizardStore';
import { colors, spacing, typography } from '../../theme';
import { MILLISECONDS_PER_WEEK } from '../../utils/timeConstants';

export function PeriodStepScreen() {
  const { goToWizardStep } = useWizardNavigation();
  const { period, updatePeriod } = useWizardStore();

  const [startDate, setStartDate] = useState<Date>(period.startDate || new Date());
  const [endDate, setEndDate] = useState<Date>(
    period.endDate || new Date(Date.now() + MILLISECONDS_PER_WEEK),
  );

  const handleNext = () => {
    updatePeriod(startDate, endDate);
    goToWizardStep('GoalsStep');
  };

  // PeriodPicker ensures end date is always after start date
  const isValid = endDate > startDate;

  return (
    <View style={styles.container}>
      <WizardHeader currentStep={1} totalSteps={4} title="Set Period" />

      <View style={styles.content}>
        <Text style={styles.subtitle}>
          Choose the start and end dates for your accountability round.
        </Text>

        <View style={styles.dateLabelsRow}>
          <Text style={styles.dateLabel}>Start Date</Text>
          <Text style={styles.dateLabel}>End Date</Text>
        </View>

        <CalendarRangePicker
          startDate={startDate}
          endDate={endDate}
          onStartDateChange={setStartDate}
          onEndDateChange={setEndDate}
          minimumDate={new Date()}
        />
      </View>

      <WizardFooter onNext={handleNext} nextEnabled={isValid} nextLabel="Next" />
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
  subtitle: {
    fontSize: typography.fontSize.md,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
    lineHeight: typography.fontSize.md * 1.5,
  },
  dateLabelsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  dateLabel: {
    flex: 1,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: colors.textSecondary,
  },
});
