import { getViewportClass } from '@/src/design-system/tokens'

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
