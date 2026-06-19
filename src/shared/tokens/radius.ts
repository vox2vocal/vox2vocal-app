export const radius = {
  none: 0,
  xs: 4,
  sm: 6,
  md: 8,
  lg: 12,
  authControl: 16,
  full: 999,
} as const

export const componentRadius = {
  input: radius.authControl,
  button: radius.authControl,
  card: radius.authControl,
  panel: radius.lg,
  chip: radius.full,
} as const
