import { getViewportClass } from '@/src/design-system/tokens'
import { getAuthMetrics } from '@/src/features/auth/auth-components'

describe('getViewportClass', () => {
  it.each([
    [360, 'compact'],
    [599, 'compact'],
    [600, 'medium'],
    [839, 'medium'],
    [840, 'expanded'],
    [1199, 'expanded'],
    [1200, 'large'],
    [1599, 'large'],
    [1600, 'xlarge'],
  ] as const)('classifies %i as %s', (width, expectedClass) => {
    expect(getViewportClass(width)).toBe(expectedClass)
  })
})

describe('getAuthMetrics', () => {
  it.each([
    [320, 16, 288],
    [375, 24, 327],
    [768, 24, 384],
    [1440, 24, 384],
  ] as const)('keeps auth shell within the %ipx viewport', (width, padding, shellWidth) => {
    const metrics = getAuthMetrics(width, 812, 'login')

    expect(metrics.horizontalPadding).toBe(padding)
    expect(metrics.shellWidth).toBe(shellWidth)
    expect(metrics.shellWidth + metrics.horizontalPadding * 2).toBeLessThanOrEqual(width)
  })

  it('uses denser signup metrics so compact signup screens fit vertically', () => {
    const loginMetrics = getAuthMetrics(375, 812, 'login')
    const signupMetrics = getAuthMetrics(375, 812, 'signup')

    expect(signupMetrics.logoSize).toBeLessThan(loginMetrics.logoSize)
    expect(signupMetrics.inputHeight).toBeLessThan(loginMetrics.inputHeight)
    expect(signupMetrics.buttonHeight).toBeLessThan(loginMetrics.buttonHeight)
  })

  it('uses extra compact control metrics on short mobile viewports', () => {
    const metrics = getAuthMetrics(320, 568, 'signup')

    expect(metrics.buttonHeight).toBe(52)
    expect(metrics.inputHeight).toBe(50)
    expect(metrics.logoSize).toBe(60)
    expect(metrics.shellGap).toBe(16)
    expect(metrics.socialButtonHeight).toBe(52)
  })
})
