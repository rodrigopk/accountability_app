import { StyleSheet } from 'react-native';

import { colors, spacing, typography, borderRadius } from '../theme';

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingBottom: spacing.lg,
  },
  screenHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  backButton: {
    padding: spacing.sm,
  },
  backArrow: {
    fontSize: typography.fontSize.xl,
    color: colors.textPrimary,
  },
  screenTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textPrimary,
    flex: 1,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 40,
  },
  roundInfoSection: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
  roundTitle: {
    fontSize: typography.fontSize.xxl,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  roundSubtitle: {
    fontSize: typography.fontSize.md,
    color: colors.textSecondary,
  },
  punishmentBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.danger,
    marginHorizontal: spacing.lg,
    marginTop: spacing.lg,
    marginBottom: spacing.md,
    padding: spacing.lg,
    borderRadius: borderRadius.md,
    gap: spacing.md,
  },
  punishmentIcon: {
    fontSize: typography.fontSize.xxl,
  },
  punishmentLabel: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: colors.textInverse,
    textTransform: 'uppercase',
    marginBottom: spacing.xs,
  },
  punishmentText: {
    fontSize: typography.fontSize.md,
    color: colors.textInverse,
    fontWeight: typography.fontWeight.medium,
  },
  goalsSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
  },
  goalsCount: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: colors.textSecondary,
  },
  errorText: {
    fontSize: typography.fontSize.lg,
    color: colors.danger,
    textAlign: 'center',
    marginTop: spacing.xxxl,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    padding: spacing.xl,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textPrimary,
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: typography.fontSize.md,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  dateOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
    backgroundColor: colors.background,
    marginBottom: spacing.sm,
  },
  dateOptionText: {
    fontSize: typography.fontSize.lg,
    color: colors.textPrimary,
  },
  dateOptionBadge: {
    backgroundColor: colors.warning,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  dateOptionBadgeText: {
    fontSize: typography.fontSize.sm,
    color: colors.textInverse,
    fontWeight: typography.fontWeight.semibold,
  },
  cancelButton: {
    marginTop: spacing.lg,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: typography.fontSize.lg,
    color: colors.primary,
    fontWeight: typography.fontWeight.semibold,
  },
  durationInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    fontSize: typography.fontSize.lg,
    marginBottom: spacing.lg,
    color: colors.textPrimary,
    backgroundColor: colors.surface,
  },
  notesInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    fontSize: typography.fontSize.lg,
    marginBottom: spacing.lg,
    height: 80,
    textAlignVertical: 'top',
    color: colors.textPrimary,
    backgroundColor: colors.surface,
  },
  submitButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  submitButtonText: {
    color: colors.textInverse,
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
  },
  inputLabel: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.medium,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  datePickerScrollView: {
    maxHeight: 300,
  },
});
