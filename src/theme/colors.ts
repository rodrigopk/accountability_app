export const colors = {
  // Primary - Mint Green
  primary: '#2BB673',
  primaryLight: '#E6F6EE',
  primaryDark: '#27AE60',

  // Danger - Red
  danger: '#F05959',
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
  backgroundLight: '#FBFEFC',
  surface: '#FFFFFF',

  // Borders & Dividers
  border: '#E0E0E0',
  divider: '#EEEEEE',

  // Progress
  progressBackground: '#E6F6EE',
  progressFill: '#2BB673',

  // Warning colors for notification banner
  warningBackground: '#FFF3CD',
  warningBorder: '#FFECB5',
  warningText: '#856404',

  // Success color for settings
  success: '#28A745',

  // Transparent
  transparent: 'transparent',
  overlay: 'rgba(0, 0, 0, 0.5)',
} as const;

export type ColorToken = keyof typeof colors;
