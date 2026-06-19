export const fontFamilies = {
  base: 'Pretendard, Noto Sans KR, Inter, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif',
  mono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
} as const

export const typography = {
  h1: {
    fontSize: 30,
    lineHeight: 38,
    fontWeight: '700',
  },
  h2: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: '700',
  },
  h3: {
    fontSize: 18,
    lineHeight: 26,
    fontWeight: '700',
  },
  bodyPrimary: {
    fontSize: 14,
    lineHeight: 22,
    fontWeight: '400',
  },
  bodyEmphasis: {
    fontSize: 14,
    lineHeight: 22,
    fontWeight: '600',
  },
  bodySecondary: {
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '400',
  },
  caption: {
    fontSize: 11,
    lineHeight: 16,
    fontWeight: '500',
  },
  authTitle: {
    fontSize: 38,
    lineHeight: 46,
    fontWeight: '700',
  },
  authSubtitle: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '400',
  },
  timerMono: {
    fontSize: 56,
    lineHeight: 64,
    fontWeight: '300',
    letterSpacing: 8,
  },
} as const

export type TypographyToken = keyof typeof typography
