export { colors } from './colors';
export type { ColorToken } from './colors';
export { typography, textStyles } from './typography';
export { spacing, borderRadius, shadows } from './spacing';

import { colors } from './colors';
import { spacing, borderRadius, shadows } from './spacing';
import { typography, textStyles } from './typography';

export const theme = {
  colors,
  typography,
  textStyles,
  spacing,
  borderRadius,
  shadows,
} as const;

export type Theme = typeof theme;
