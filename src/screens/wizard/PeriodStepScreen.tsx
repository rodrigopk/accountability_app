import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { PeriodPicker } from '../../components/PeriodPicker';
import { WizardFooter } from '../../components/wizard/WizardFooter';
import { WizardHeader } from '../../components/wizard/WizardHeader';
import { PeriodStepNavigationProp } from '../../navigation/types';
import { useWizard } from '../../providers/CreateRoundWizardProvider';
import { MILLISECONDS_PER_WEEK } from '../../utils/timeConstants';

export function PeriodStepScreen() {
  const navigation = useNavigation<PeriodStepNavigationProp>();
  const { state, updatePeriod } = useWizard();

  const [startDate, setStartDate] = useState<Date>(state.period.startDate || new Date());
  const [endDate, setEndDate] = useState<Date>(
    state.period.endDate || new Date(Date.now() + MILLISECONDS_PER_WEEK),
  );

  const handleNext = () => {
    updatePeriod(startDate, endDate);
    navigation.navigate('GoalsStep');
  };

  // PeriodPicker ensures end date is always after start date
  const isValid = endDate > startDate;

  return (
    <View style={styles.container}>
      <WizardHeader currentStep={1} totalSteps={4} title="Set Period" />

      <View style={styles.content}>
        <Text style={styles.label}>Select Period</Text>
        <PeriodPicker
          startDate={startDate}
          endDate={endDate}
          onStartDateChange={setStartDate}
          onEndDateChange={setEndDate}
          minimumStartDate={new Date()}
        />

        <Text style={styles.helperText}>
          Select the period for your accountability round. We recommend at least 7 days.
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
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 8,
    color: '#333',
  },
  helperText: {
    fontSize: 14,
    color: '#666',
    marginTop: 16,
    lineHeight: 20,
  },
});
