import { useSessionStore } from '@/src/stores/session-store'

describe('session store', () => {
  it('increments the launch count', () => {
    useSessionStore.setState({ isAuthenticated: false, launchCount: 0, user: null })

    useSessionStore.getState().increaseLaunchCount()

    expect(useSessionStore.getState().launchCount).toBe(1)
  })

  it('stores and clears authenticated user metadata without tokens', () => {
    useSessionStore.getState().setAuthenticatedUser({
      displayName: 'User',
      email: 'user@example.com',
      id: 'user-1',
      role: 'USER',
    })

    expect(useSessionStore.getState()).toMatchObject({
      isAuthenticated: true,
      user: {
        email: 'user@example.com',
      },
    })

    useSessionStore.getState().clearSession()

    expect(useSessionStore.getState()).toMatchObject({
      isAuthenticated: false,
      user: null,
    })
  })
})
