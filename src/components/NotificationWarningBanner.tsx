import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

import { createNotificationProvider } from '../services/notifications';
import { colors, spacing, typography, borderRadius } from '../theme';

interface NotificationWarningBannerProps {
  onPress?: () => void;
}

export function NotificationWarningBanner({ onPress }: NotificationWarningBannerProps) {
  const handlePress = async () => {
    if (onPress) {
      onPress();
    } else {
      const provider = createNotificationProvider();
      await provider.openSettings();
    }
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress}>
      <Text style={styles.icon}>⚠️</Text>
      <View style={styles.textContainer}>
        <Text style={styles.title}>Notifications Disabled</Text>
        <Text style={styles.message}>
          Enable notifications to receive goal reminders. Tap to open settings.
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.warningBackground,
    borderColor: colors.warningBorder,
    borderWidth: 1,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  icon: {
    fontSize: 20,
    marginRight: spacing.sm,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.medium,
    color: colors.warningText,
  },
  message: {
    fontSize: typography.fontSize.sm,
    color: colors.warningText,
    marginTop: 2,
  },
});
