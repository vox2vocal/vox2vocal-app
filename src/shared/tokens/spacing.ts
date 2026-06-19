export const spacing = {
  0: 0,
  1: 2,
  2: 4,
  3: 8,
  4: 12,
  5: 16,
  6: 20,
  7: 24,
  8: 32,
  9: 40,
  10: 48,
  11: 64,
  12: 80,
} as const

export const componentSpacing = {
  screenX: spacing[7],
  fieldGap: spacing[5],
  sectionGap: spacing[8],
  cardPadding: spacing[6],
  controlPaddingX: spacing[7],
  controlPaddingY: spacing[5],
} as const
