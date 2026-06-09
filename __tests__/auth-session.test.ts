import { accessTokenMemory } from '@/src/features/auth/access-token-memory'
import { login, logout } from '@/src/features/auth/auth-session'
import { useSessionStore } from '@/src/stores/session-store'

function mockGraphQLResponse(body: unknown): Response {
  return {
    json: jest.fn().mockResolvedValue(body),
    ok: true,
    status: 200,
  } as unknown as Response
}

describe('auth session orchestration', () => {
  const fetchMock = jest.fn()

  beforeEach(() => {
    fetchMock.mockReset()
    globalThis.fetch = fetchMock as unknown as typeof fetch
    accessTokenMemory.clear()
    useSessionStore.setState({
      isAuthenticated: false,
      user: null,
    })
  })

  it('updates access token memory and session state after login', async () => {
    fetchMock.mockResolvedValueOnce(
      mockGraphQLResponse({
        data: {
          login: {
            accessToken: 'access.token',
            expiresIn: 900,
            refreshToken: null,
            user: {
              displayName: 'User',
              email: 'user@example.com',
              id: 'user-1',
              role: 'USER',
            },
          },
        },
      }),
    )

    await login({
      email: 'user@example.com',
      password: 'password123',
    })

    expect(accessTokenMemory.get()).toBe('access.token')
    expect(useSessionStore.getState()).toMatchObject({
      isAuthenticated: true,
      user: {
        email: 'user@example.com',
      },
    })
  })

  it('clears local auth state on logout even when no native refresh token is available', async () => {
    accessTokenMemory.set('access.token')
    useSessionStore.getState().setAuthenticatedUser({
      displayName: 'User',
      email: 'user@example.com',
      id: 'user-1',
      role: 'USER',
    })

    await logout()

    expect(accessTokenMemory.get()).toBeNull()
    expect(useSessionStore.getState()).toMatchObject({
      isAuthenticated: false,
      user: null,
    })
  })
})
