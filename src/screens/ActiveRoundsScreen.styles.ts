import { StyleSheet } from 'react-native';

import { colors, spacing, typography, borderRadius, shadows } from '../theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  appHeader: {
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  logoPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.md,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoIcon: {
    fontSize: typography.fontSize.xxl,
  },
  appName: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
  },
  titleSection: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
    backgroundColor: colors.backgroundLight,
  },
  screenTitle: {
    fontSize: typography.fontSize.xxl,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  screenSubtitle: {
    fontSize: typography.fontSize.md,
    color: colors.textSecondary,
  },
  list: {
    flex: 1,
    backgroundColor: colors.backgroundLight,
  },
  listContent: {
    paddingTop: spacing.sm,
    paddingBottom: spacing.lg,
  },
  loadingText: {
    marginTop: spacing.lg,
    fontSize: typography.fontSize.lg,
    color: colors.textSecondary,
  },
  errorText: {
    fontSize: typography.fontSize.lg,
    color: colors.danger,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  retryText: {
    fontSize: typography.fontSize.md,
    color: colors.primary,
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
  fab: {
    position: 'absolute',
    right: spacing.xl,
    bottom: spacing.xl,
    width: 60,
    height: 60,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.lg,
  },
  fabIcon: {
    fontSize: typography.fontSize.xxxl,
    color: colors.textInverse,
    fontWeight: typography.fontWeight.regular,
  },
});
