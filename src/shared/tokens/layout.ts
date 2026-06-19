export const viewportBreakpoints = {
  compact: 0,
  medium: 600,
  expanded: 840,
  large: 1200,
  xlarge: 1600,
} as const

export type ViewportClass = 'compact' | 'medium' | 'expanded' | 'large' | 'xlarge'

export function getViewportClass(width: number): ViewportClass {
  if (width >= viewportBreakpoints.xlarge) {
    return 'xlarge'
  }

  if (width >= viewportBreakpoints.large) {
    return 'large'
  }

  if (width >= viewportBreakpoints.expanded) {
    return 'expanded'
  }

  if (width >= viewportBreakpoints.medium) {
    return 'medium'
  }

  return 'compact'
}

export const appLayout = {
  mobileMaxWidth: 384,
  mobilePadding: 24,
  tabletMaxWidth: 720,
  desktopMaxWidth: 1200,
  topNavHeight: 56,
  bottomActionMinHeight: 56,
  touchTargetMin: 44,
} as const
