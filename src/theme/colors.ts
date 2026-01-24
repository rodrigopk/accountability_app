export const colors = {
  // Primary - Mint Green
  primary: '#2ECC71',
  primaryLight: '#E8F8F0',
  primaryDark: '#27AE60',

  // Danger - Red
  danger: '#E74C3C',
  dangerLight: '#FDEDEC',

  // Warning - Orange
  warning: '#FF9800',
  warningLight: '#FFF8E1',

  // Text
  textPrimary: '#1A1A1A',
  textSecondary: '#666666',
  textTertiary: '#999999',
  textInverse: '#FFFFFF',

  // Backgrounds
  background: '#F5F5F5',
  surface: '#FFFFFF',

  // Borders & Dividers
  border: '#E0E0E0',
  divider: '#EEEEEE',

  // Progress
  progressBackground: '#E0E0E0',
  progressFill: '#2ECC71',

  // Transparent
  transparent: 'transparent',
  overlay: 'rgba(0, 0, 0, 0.5)',
} as const;

export type ColorToken = keyof typeof colors;
