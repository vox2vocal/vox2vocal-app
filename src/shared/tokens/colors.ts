export const colors = {
  bgDefault: '#050505',
  bgSubtle: '#0A0505',
  surfaceDefault: '#121212',
  surfaceRaised: '#1A1A1A',
  surfaceOverlay: '#1A1010',
  textPrimary: '#FFFFFF',
  textSecondary: '#A1A1AA',
  textMuted: '#71717A',
  textInverse: '#050505',
  borderSubtle: '#27272A',
  borderStrong: '#3F3F46',
  borderFocus: '#EF4444',
  actionPrimary: '#DC2626',
  actionPrimaryPressed: '#991B1B',
  actionPrimaryHover: '#EF4444',
  audioWaveform: '#EF4444',
  success: '#2EE8B6',
  warning: '#F6BF4F',
  danger: '#F87171',
} as const

export const brandColors = {
  black: '#050505',
  redDark: '#991B1B',
  red: '#DC2626',
  redBright: '#EF4444',
  glow: 'rgba(220, 38, 38, 0.4)',
  glowSoft: 'rgba(220, 38, 38, 0.15)',
  selection: 'rgba(239, 68, 68, 0.3)',
} as const

export const authColors = {
  background: colors.bgDefault,
  backgroundSoft: colors.bgSubtle,
  surface: colors.surfaceDefault,
  surfaceHover: colors.surfaceRaised,
  surfaceFocus: colors.surfaceOverlay,
  textPrimary: colors.textPrimary,
  textSecondary: colors.textSecondary,
  textMuted: colors.textMuted,
  border: colors.borderSubtle,
  red: brandColors.red,
  redBright: brandColors.redBright,
  redDark: brandColors.redDark,
  danger: colors.danger,
} as const

export type ColorToken = keyof typeof colors
