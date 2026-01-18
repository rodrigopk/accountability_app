import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface WizardFooterProps {
  onNext: () => void;
  nextEnabled: boolean;
  nextLabel?: string;
}

export function WizardFooter({ onNext, nextEnabled, nextLabel = 'Next' }: WizardFooterProps) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.nextButton, !nextEnabled && styles.nextButtonDisabled]}
        onPress={onNext}
        disabled={!nextEnabled}
      >
        <Text style={styles.nextButtonText}>{nextLabel}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    backgroundColor: '#fff',
  },
  nextButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  nextButtonDisabled: {
    backgroundColor: '#ccc',
    opacity: 0.5,
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});
