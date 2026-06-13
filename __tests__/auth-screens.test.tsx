import type { ReactElement, ReactNode } from 'react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { cleanup, fireEvent, render, waitFor } from '@testing-library/react-native'

import { accessTokenMemory } from '@/src/features/auth/access-token-memory'
import { LoginScreen } from '@/src/features/auth/login-screen'
import { resetAuthGraphQLClientForTest } from '@/src/features/auth/graphql-client'
import { SignupScreen } from '@/src/features/auth/signup-screen'
import { useSessionStore } from '@/src/stores/session-store'

jest.mock('expo-router', () => ({
  Link: ({ children }: { children: ReactNode }) => children,
}))

function mockGraphQLResponse(body: unknown, status = 200): Response {
  return {
    json: jest.fn().mockResolvedValue(body),
    ok: status >= 200 && status < 300,
    status,
  } as unknown as Response
}

function authPayload(email: string, displayName = 'Vox User') {
  return {
    accessToken: 'access.token',
    expiresIn: 900,
    refreshToken: null,
    user: {
      displayName,
      email,
      id: 'user-1',
      role: 'USER',
    },
  }
}

function renderWithQueryClient(ui: ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: {
      mutations: {
        gcTime: Infinity,
        retry: false,
      },
      queries: {
        gcTime: Infinity,
        retry: false,
      },
    },
  })

  queryClients.push(queryClient)

  return render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>)
}

const queryClients: QueryClient[] = []

function getGraphQLRequestBody(fetchMock: jest.Mock) {
  const requestInit = fetchMock.mock.calls[0]?.[1] as RequestInit | undefined

  if (!requestInit?.body || typeof requestInit.body !== 'string') {
    throw new Error('Expected GraphQL request body to be a JSON string')
  }

  return JSON.parse(requestInit.body) as {
    query: string
    variables: Record<string, unknown>
  }
}

describe('auth screens', () => {
  const fetchMock = jest.fn()

  beforeEach(() => {
    fetchMock.mockReset()
    globalThis.fetch = fetchMock as unknown as typeof fetch
    resetAuthGraphQLClientForTest()
    useSessionStore.setState({
      isAuthenticated: false,
      launchCount: 0,
      user: null,
    })
  })

  afterEach(() => {
    cleanup()
    queryClients.splice(0).forEach((queryClient) => queryClient.clear())
  })

  it('validates login input before calling the auth mutation', () => {
    const screen = renderWithQueryClient(<LoginScreen />)

    fireEvent.changeText(screen.getByLabelText('이메일 주소'), '')
    fireEvent.changeText(screen.getByLabelText('비밀번호'), '')
    fireEvent.press(screen.getByText('로그인'))

    expect(screen.getByText('이메일 주소를 입력해 주세요.')).toBeTruthy()
    expect(screen.getByText('비밀번호를 입력해 주세요.')).toBeTruthy()
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('prefills the login form with the temporary database account', () => {
    const screen = renderWithQueryClient(<LoginScreen />)

    expect(screen.getByLabelText('이메일 주소').props.value).toBe('user@example.com')
    expect(screen.getByLabelText('비밀번호').props.value).toBe('password123')
  })

  it('submits login with trimmed email and updates the session on success', async () => {
    fetchMock.mockResolvedValueOnce(
      mockGraphQLResponse({
        data: {
          login: authPayload('user@example.com'),
        },
      }),
    )
    const screen = renderWithQueryClient(<LoginScreen />)

    fireEvent.changeText(screen.getByLabelText('이메일 주소'), ' user@example.com ')
    fireEvent.changeText(screen.getByLabelText('비밀번호'), 'password123')
    fireEvent.press(screen.getByText('로그인'))

    await waitFor(() => expect(screen.getByText('로그인이 완료되었습니다.')).toBeTruthy())

    const body = getGraphQLRequestBody(fetchMock)
    expect(body.query).toContain('mutation Login')
    expect(body.variables).toEqual({
      input: {
        email: 'user@example.com',
        password: 'password123',
      },
    })
    expect(accessTokenMemory.get()).toBe('access.token')
    expect(useSessionStore.getState()).toMatchObject({
      isAuthenticated: true,
      user: {
        email: 'user@example.com',
      },
    })
  })

  it('shows the mapped login error message for rejected credentials', async () => {
    fetchMock.mockResolvedValueOnce(
      mockGraphQLResponse({
        errors: [
          {
            extensions: {
              code: 'UNAUTHENTICATED',
            },
            message: 'Invalid credentials',
          },
        ],
      }),
    )
    const screen = renderWithQueryClient(<LoginScreen />)

    fireEvent.changeText(screen.getByLabelText('이메일 주소'), 'user@example.com')
    fireEvent.changeText(screen.getByLabelText('비밀번호'), 'password123')
    fireEvent.press(screen.getByText('로그인'))

    await waitFor(() =>
      expect(screen.getByText('이메일 또는 비밀번호를 확인해 주세요.')).toBeTruthy(),
    )
    expect(useSessionStore.getState().isAuthenticated).toBe(false)
  })

  it('exposes accessible login fields and toggles password visibility', () => {
    const screen = renderWithQueryClient(<LoginScreen />)
    const passwordInput = screen.getByLabelText('비밀번호')

    expect(screen.getByLabelText('Vox2Vocal logo')).toBeTruthy()
    expect(screen.getByLabelText('이메일 주소')).toBeTruthy()
    expect(passwordInput.props.secureTextEntry).toBe(true)

    fireEvent.press(screen.getByLabelText('비밀번호 표시'))

    expect(screen.getByLabelText('비밀번호').props.secureTextEntry).toBe(false)
    expect(screen.getByLabelText('비밀번호 숨기기')).toBeTruthy()
  })

  it('keeps signup disabled until terms are accepted and exposes checkbox state', () => {
    const screen = renderWithQueryClient(<SignupScreen />)
    const termsCheckbox = screen.getByRole('checkbox')
    const submitButton = screen.getByRole('button', {
      name: '가입하기',
    })

    expect(termsCheckbox.props.accessibilityState).toMatchObject({
      checked: false,
    })
    expect(submitButton.props.accessibilityState).toMatchObject({
      disabled: true,
    })

    fireEvent.press(termsCheckbox)

    expect(screen.getByRole('checkbox').props.accessibilityState).toMatchObject({
      checked: true,
    })
    expect(
      screen.getByRole('button', {
        name: '가입하기',
      }).props.accessibilityState,
    ).toMatchObject({
      disabled: false,
    })
  })

  it('validates signup input before calling the auth mutation', () => {
    const screen = renderWithQueryClient(<SignupScreen />)

    fireEvent.press(screen.getByRole('checkbox'))
    fireEvent.press(screen.getByText('가입하기'))

    expect(screen.getByText('이름 또는 닉네임을 입력해 주세요.')).toBeTruthy()
    expect(screen.getByText('이메일 주소를 입력해 주세요.')).toBeTruthy()
    expect(screen.getByText('비밀번호를 입력해 주세요.')).toBeTruthy()
    expect(screen.getByText('비밀번호 확인을 입력해 주세요.')).toBeTruthy()
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('prevents signup when password confirmation does not match', () => {
    const screen = renderWithQueryClient(<SignupScreen />)

    fireEvent.changeText(screen.getByLabelText('이름 또는 닉네임'), 'Vox User')
    fireEvent.changeText(screen.getByLabelText('이메일 주소'), 'user@example.com')
    fireEvent.changeText(screen.getByLabelText('비밀번호'), 'password123')
    fireEvent.changeText(screen.getByLabelText('비밀번호 확인'), 'password456')
    fireEvent.press(screen.getByRole('checkbox'))
    fireEvent.press(screen.getByText('가입하기'))

    expect(screen.getByText('비밀번호가 서로 일치하지 않습니다.')).toBeTruthy()
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('submits signup with trimmed identity fields and updates the session on success', async () => {
    fetchMock.mockResolvedValueOnce(
      mockGraphQLResponse({
        data: {
          signUp: authPayload('new@example.com', 'New User'),
        },
      }),
    )
    const screen = renderWithQueryClient(<SignupScreen />)

    fireEvent.changeText(screen.getByLabelText('이름 또는 닉네임'), ' New User ')
    fireEvent.changeText(screen.getByLabelText('이메일 주소'), ' new@example.com ')
    fireEvent.changeText(screen.getByLabelText('비밀번호'), 'password123')
    fireEvent.changeText(screen.getByLabelText('비밀번호 확인'), 'password123')
    fireEvent.press(screen.getByRole('checkbox'))
    fireEvent.press(screen.getByText('가입하기'))

    await waitFor(() => expect(screen.getByText('회원가입이 완료되었습니다.')).toBeTruthy())

    const body = getGraphQLRequestBody(fetchMock)
    expect(body.query).toContain('mutation SignUp')
    expect(body.variables).toEqual({
      input: {
        displayName: 'New User',
        email: 'new@example.com',
        password: 'password123',
      },
    })
    expect(useSessionStore.getState()).toMatchObject({
      isAuthenticated: true,
      user: {
        displayName: 'New User',
        email: 'new@example.com',
      },
    })
  })
})
