import { StyleSheet } from 'react-native';

import { colors, spacing, typography } from '../theme';

export const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
  },
  backButton: {
    padding: spacing.sm,
  },
  backArrow: {
    fontSize: typography.fontSize.xl,
    color: colors.textPrimary,
  },
  title: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textPrimary,
    flex: 1,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 40,
  },
  rightElement: {
    minWidth: 40,
    alignItems: 'flex-end',
  },
});
