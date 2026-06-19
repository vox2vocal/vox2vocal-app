import { brandColors } from './colors'

export const shadows = {
  glowPrimary: `0 0 20px ${brandColors.glow}`,
  glowSubtle: `0 0 15px ${brandColors.glowSoft}`,
  ambientGlow: `0 0 120px ${brandColors.glowSoft}`,
  whiteDrop: '0 0 10px rgba(255, 255, 255, 0.3)',
} as const

export const nativeShadows = {
  glowPrimary: {
    shadowColor: brandColors.red,
    shadowOpacity: 0.4,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 0 },
    elevation: 8,
  },
  glowSubtle: {
    shadowColor: brandColors.red,
    shadowOpacity: 0.14,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 0 },
    elevation: 2,
  },
} as const

export const gradients = {
  primaryRed: [brandColors.redDark, brandColors.red, brandColors.redBright],
  primaryRedCss: `linear-gradient(90deg, ${brandColors.redDark}, ${brandColors.red}, ${brandColors.redBright})`,
  ambientRedCss: 'radial-gradient(circle, rgba(220, 38, 38, 0.18), rgba(5, 5, 5, 0) 68%)',
} as const

export const motion = {
  durationFast: 160,
  durationNormal: 300,
  easingStandard: 'ease-out',
  pressScale: 0.98,
  hoverScale: 1.04,
} as const
