import React, { ReactNode } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { styles } from './ScreenHeader.styles';

interface ScreenHeaderProps {
  title: string;
  onBack?: () => void;
  rightElement?: ReactNode;
}

/**
 * Reusable screen header component with back button, title, and optional right element.
 * Handles safe area insets automatically.
 */
export function ScreenHeader({ title, onBack, rightElement }: ScreenHeaderProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.content}>
        {onBack ? (
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.headerSpacer} />
        )}
        <Text style={styles.title}>{title}</Text>
        {rightElement ? (
          <View style={styles.rightElement}>{rightElement}</View>
        ) : (
          <View style={styles.headerSpacer} />
        )}
      </View>
    </View>
  );
}
