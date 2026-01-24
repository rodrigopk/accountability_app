import { StyleSheet } from 'react-native';

import { colors, spacing, typography, borderRadius } from '../theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    borderBottomWidth: 2,
    borderBottomColor: colors.border,
  },
  title: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  content: {
    flex: 1,
    padding: spacing.xl,
  },
  sectionTitle: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
    marginTop: spacing.lg,
  },
  section: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  rowLabel: {
    fontSize: typography.fontSize.lg,
    color: colors.textPrimary,
  },
  rowValue: {
    fontSize: typography.fontSize.lg,
    color: colors.textSecondary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.divider,
    marginLeft: spacing.lg,
  },
  dangerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  dangerRowText: {
    fontSize: typography.fontSize.lg,
    color: colors.danger,
  },
  dangerRowIcon: {
    fontSize: typography.fontSize.xl,
  },
  sectionDescription: {
    fontSize: typography.fontSize.md,
    color: colors.textSecondary,
    marginTop: spacing.sm,
    lineHeight: Math.round(typography.fontSize.md * 1.5),
  },
});
