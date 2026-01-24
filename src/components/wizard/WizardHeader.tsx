import React from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';

import { useWizardNavigation } from '../../navigation/useAppNavigation';

import { styles } from './WizardHeader.styles';

interface WizardHeaderProps {
  currentStep: number;
  totalSteps: number;
  title: string;
  onBack?: () => void;
}

export function WizardHeader({ currentStep, totalSteps, title, onBack }: WizardHeaderProps) {
  const { closeWizard } = useWizardNavigation();

  const handleCancel = () => {
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
  };

  const isFirstStep = currentStep === 1;

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        {isFirstStep ? (
          <TouchableOpacity style={styles.closeButton} onPress={handleCancel}>
            <Text style={styles.closeIcon}>✕</Text>
          </TouchableOpacity>
        ) : (
          <>
            {onBack && (
              <TouchableOpacity style={styles.backButton} onPress={onBack}>
                <Text style={styles.backIcon}>←</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity style={styles.closeButton} onPress={handleCancel}>
              <Text style={styles.closeIcon}>✕</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      {/* Step text */}
      <Text style={styles.stepText}>
        STEP {currentStep} OF {totalSteps}
      </Text>

      <Text style={styles.title}>{title}</Text>
    </View>
  );
}
