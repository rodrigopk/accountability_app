import { StyleSheet } from 'react-native';

import { colors, spacing, borderRadius, typography } from '../theme';

export const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.sm,
  },
  dateFieldsRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  dateField: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    gap: spacing.sm,
  },
  dateFieldActive: {
    borderColor: colors.primary,
    borderWidth: 2,
  },
  dateFieldIcon: {
    opacity: 0.6,
  },
  dateFieldValue: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.medium,
    color: colors.textPrimary,
  },
  calendarContainer: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  proTip: {
    flexDirection: 'row',
    backgroundColor: colors.primaryLight,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    marginTop: spacing.lg,
    gap: spacing.sm,
  },
  proTipIcon: {
    fontSize: typography.fontSize.lg,
  },
  proTipText: {
    flex: 1,
    fontSize: typography.fontSize.md,
    color: colors.primary,
    lineHeight: typography.fontSize.md * 1.5,
  },
});
