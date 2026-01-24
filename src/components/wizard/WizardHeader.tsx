import React, { ReactNode } from 'react';
import { View, Text, Alert } from 'react-native';

import { useWizardNavigation } from '../../navigation/useAppNavigation';
import { ScreenHeader } from '../ScreenHeader';

import { styles } from './WizardHeader.styles';

interface WizardHeaderProps {
  currentStep: number;
  totalSteps: number;
  title: string;
  onBack?: () => void;
  rightButton?: ReactNode;
}

export function WizardHeader({
  currentStep,
  totalSteps,
  title,
  onBack,
  rightButton,
}: WizardHeaderProps) {
  const { closeWizard, goBackWizard } = useWizardNavigation();

  const handleBack = () => {
    const isFirstStep = currentStep === 1;
    if (isFirstStep) {
      // First step: show confirmation alert before closing
      Alert.alert(
        'Cancel Creation',
        'Are you sure you want to cancel? Your progress will be saved as a draft.',
        [
          { text: "Don't Cancel", style: 'cancel' },
          {
            text: 'Yes, Cancel',
            style: 'destructive',
            onPress: () => {
              closeWizard();
            },
          },
        ],
      );
    } else {
      // Other steps: use provided onBack or goBackWizard
      if (onBack) {
        onBack();
      } else {
        goBackWizard();
      }
    }
  };

  return (
    <View style={styles.container}>
      <ScreenHeader title="Create Round" onBack={handleBack} rightElement={rightButton} />

      {/* Step text */}
      <Text style={styles.stepText}>
        STEP {currentStep} OF {totalSteps}
      </Text>

      <Text style={styles.title}>{title}</Text>
    </View>
  );
}
