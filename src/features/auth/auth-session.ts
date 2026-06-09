import { Platform } from 'react-native'

import { useMutation, useQueryClient } from '@tanstack/react-query'

import { SessionUser, useSessionStore } from '@/src/stores/session-store'

import { accessTokenMemory } from './access-token-memory'
import { AuthGraphQLClientError, requestGraphQL, setRefreshSessionHandler } from './graphql-client'
import { refreshTokenStorage } from './token-storage'

type AuthPayload = {
  accessToken: string
  expiresIn: number
  refreshToken?: string | null
  user: SessionUser
}

type LoginInput = {
  email: string
  password: string
}

type SignUpInput = LoginInput & {
  displayName: string
}

const authPayloadFields = `
  accessToken
  expiresIn
  refreshToken
  user {
    id
    email
    displayName
    role
  }
`

const loginMutation = `
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      ${authPayloadFields}
    }
  }
`

const signUpMutation = `
  mutation SignUp($input: SignUpInput!) {
    signUp(input: $input) {
      ${authPayloadFields}
    }
  }
`

const refreshSessionMutation = `
  mutation RefreshSession($input: RefreshSessionInput) {
    refreshSession(input: $input) {
      ${authPayloadFields}
    }
  }
`

const logoutMutation = `
  mutation Logout($input: LogoutInput) {
    logout(input: $input)
  }
`

const meQuery = `
  query Me {
    me {
      id
      email
      displayName
      role
    }
  }
`

export async function login(input: LoginInput): Promise<AuthPayload> {
  const response = await requestGraphQL<{ login: AuthPayload }>(loginMutation, {
    input,
  })

  return applyAuthPayload(response.login)
}

export async function signUp(input: SignUpInput): Promise<AuthPayload> {
  const response = await requestGraphQL<{ signUp: AuthPayload }>(signUpMutation, {
    input,
  })

  return applyAuthPayload(response.signUp)
}

export async function refreshSession(): Promise<AuthPayload> {
  const variables = await getRefreshSessionVariables()
  const response = await requestGraphQL<{ refreshSession: AuthPayload }>(
    refreshSessionMutation,
    variables,
    {
      retryOnAuthError: false,
    },
  )

  return applyAuthPayload(response.refreshSession)
}

export async function fetchMe(): Promise<SessionUser> {
  const response = await requestGraphQL<{ me: SessionUser }>(meQuery)

  useSessionStore.getState().setAuthenticatedUser(response.me)

  return response.me
}

export async function bootstrapAuthSession(): Promise<SessionUser | null> {
  try {
    await refreshSession()

    return await fetchMe()
  } catch {
    await clearLocalSession()

    return null
  }
}

export async function logout(): Promise<boolean> {
  const variables = await getLogoutVariables()

  try {
    if (variables) {
      const response = await requestGraphQL<{ logout: boolean }>(logoutMutation, variables, {
        retryOnAuthError: false,
      })

      return response.logout
    }

    return true
  } finally {
    await clearLocalSession()
  }
}

export function getAuthErrorMessage(error: unknown): string {
  if (error instanceof AuthGraphQLClientError) {
    if (error.code === 'BAD_USER_INPUT') {
      return '입력한 정보를 다시 확인해 주세요.'
    }

    if (error.code === 'TOKEN_REUSE_DETECTED') {
      return '세션 보안을 위해 다시 로그인해 주세요.'
    }

    if (error.code === 'UNAUTHENTICATED') {
      return '이메일 또는 비밀번호를 확인해 주세요.'
    }
  }

  return '인증 요청을 처리하지 못했습니다. 잠시 후 다시 시도해 주세요.'
}

export function useAuthSessionActions() {
  const queryClient = useQueryClient()
  const loginAction = useMutation({
    mutationFn: login,
    onSuccess: (payload) => {
      queryClient.setQueryData(['me'], payload.user)
    },
  })
  const signUpAction = useMutation({
    mutationFn: signUp,
    onSuccess: (payload) => {
      queryClient.setQueryData(['me'], payload.user)
    },
  })
  const logoutAction = useMutation({
    mutationFn: logout,
    onSettled: () => {
      queryClient.clear()
    },
  })

  return {
    login: loginAction,
    logout: logoutAction,
    signUp: signUpAction,
  }
}

async function applyAuthPayload(payload: AuthPayload): Promise<AuthPayload> {
  accessTokenMemory.set(payload.accessToken)
  useSessionStore.getState().setAuthenticatedUser(payload.user)

  if (payload.refreshToken) {
    await refreshTokenStorage.set(payload.refreshToken)
  }

  return payload
}

async function clearLocalSession() {
  accessTokenMemory.clear()
  useSessionStore.getState().clearSession()
  await refreshTokenStorage.remove()
}

async function getRefreshSessionVariables(): Promise<Record<string, unknown>> {
  if (Platform.OS === 'web') {
    return {}
  }

  const refreshToken = await refreshTokenStorage.get()

  if (!refreshToken) {
    throw new AuthGraphQLClientError('No refresh token is available', {
      code: 'UNAUTHENTICATED',
    })
  }

  return {
    input: {
      refreshToken,
    },
  }
}

async function getLogoutVariables(): Promise<Record<string, unknown> | null> {
  if (Platform.OS === 'web') {
    return {
      input: null,
    }
  }

  const refreshToken = await refreshTokenStorage.get()

  if (!refreshToken) {
    return null
  }

  return {
    input: {
      refreshToken,
    },
  }
}

setRefreshSessionHandler(async () => {
  try {
    await refreshSession()

    return true
  } catch {
    await clearLocalSession()

    return false
  }
})
