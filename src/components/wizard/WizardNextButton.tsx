import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

import { colors, typography } from '../../theme';

interface WizardNextButtonProps {
  onPress: () => void;
  disabled: boolean;
}

export function WizardNextButton({ onPress, disabled }: WizardNextButtonProps) {
  return (
    <TouchableOpacity onPress={onPress} disabled={disabled}>
      <Text style={[styles.nextButtonText, disabled && styles.nextButtonTextDisabled]}>Next</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  nextButtonText: {
    color: colors.primary,
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semibold,
  },
  nextButtonTextDisabled: {
    color: colors.textTertiary,
  },
});
