import { useSessionStore } from '@/src/stores/session-store'

describe('session store', () => {
  it('increments the launch count', () => {
    useSessionStore.setState({ launchCount: 0 })

    useSessionStore.getState().increaseLaunchCount()

    expect(useSessionStore.getState().launchCount).toBe(1)
  })
})
