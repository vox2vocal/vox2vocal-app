import { accessTokenMemory } from '@/src/features/auth/access-token-memory'
import {
  requestGraphQL,
  resetAuthGraphQLClientForTest,
  setRefreshSessionHandler,
} from '@/src/features/auth/graphql-client'

function mockGraphQLResponse(body: unknown, status = 200): Response {
  return {
    json: jest.fn().mockResolvedValue(body),
    ok: status >= 200 && status < 300,
    status,
  } as unknown as Response
}

describe('GraphQL auth client', () => {
  const fetchMock = jest.fn()

  beforeEach(() => {
    fetchMock.mockReset()
    globalThis.fetch = fetchMock as unknown as typeof fetch
    resetAuthGraphQLClientForTest()
  })

  it('attaches the access token to authenticated requests', async () => {
    accessTokenMemory.set('access.token')
    fetchMock.mockResolvedValueOnce(
      mockGraphQLResponse({
        data: {
          me: {
            id: 'user-1',
          },
        },
      }),
    )

    await requestGraphQL<{ me: { id: string } }>('query Me { me { id } }')

    expect(fetchMock).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: 'Bearer access.token',
        }),
      }),
    )
  })

  it('refreshes only once when concurrent requests receive UNAUTHENTICATED', async () => {
    const refreshHandler = jest.fn().mockImplementation(async () => {
      accessTokenMemory.set('new.access')

      return true
    })

    setRefreshSessionHandler(refreshHandler)
    fetchMock
      .mockResolvedValueOnce(
        mockGraphQLResponse({
          errors: [{ extensions: { code: 'UNAUTHENTICATED' }, message: 'expired' }],
        }),
      )
      .mockResolvedValueOnce(
        mockGraphQLResponse({
          errors: [{ extensions: { code: 'UNAUTHENTICATED' }, message: 'expired' }],
        }),
      )
      .mockResolvedValueOnce(
        mockGraphQLResponse({
          data: {
            me: {
              id: 'user-1',
            },
          },
        }),
      )
      .mockResolvedValueOnce(
        mockGraphQLResponse({
          data: {
            me: {
              id: 'user-1',
            },
          },
        }),
      )

    await Promise.all([
      requestGraphQL<{ me: { id: string } }>('query Me { me { id } }'),
      requestGraphQL<{ me: { id: string } }>('query Me { me { id } }'),
    ])

    expect(refreshHandler).toHaveBeenCalledTimes(1)
    expect(fetchMock).toHaveBeenCalledTimes(4)
    expect(fetchMock.mock.calls[2][1]).toEqual(
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: 'Bearer new.access',
        }),
      }),
    )
  })
})
