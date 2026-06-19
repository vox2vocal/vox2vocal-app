import { Platform } from 'react-native'
import Constants from 'expo-constants'

import { accessTokenMemory } from './access-token-memory'

type GraphQLVariables = Record<string, unknown>

type GraphQLError = {
  extensions?: {
    code?: string
  }
  message?: string
}

type GraphQLResponse<TData> = {
  data?: TData
  errors?: GraphQLError[]
}

type GraphQLRequestOptions = {
  retryOnAuthError?: boolean
}

type RefreshSessionHandler = () => Promise<boolean>

let refreshSessionHandler: RefreshSessionHandler | null = null
let refreshInFlight: Promise<boolean> | null = null

export class AuthGraphQLClientError extends Error {
  constructor(
    message: string,
    readonly options: {
      code?: string
      errors?: GraphQLError[]
      status?: number
    } = {},
  ) {
    super(message)
    this.name = 'AuthGraphQLClientError'
  }

  get code() {
    return this.options.code
  }

  get status() {
    return this.options.status
  }
}

export function setRefreshSessionHandler(handler: RefreshSessionHandler | null) {
  refreshSessionHandler = handler
}

export function resetAuthGraphQLClientForTest() {
  accessTokenMemory.clear()
  refreshSessionHandler = null
  refreshInFlight = null
}

export async function requestGraphQL<TData>(
  query: string,
  variables: GraphQLVariables = {},
  options: GraphQLRequestOptions = {},
): Promise<TData> {
  const retryOnAuthError = options.retryOnAuthError ?? true

  try {
    return await executeGraphQL<TData>(query, variables)
  } catch (error) {
    if (!retryOnAuthError || !isAuthenticationError(error)) {
      throw error
    }

    const refreshed = await refreshOnce()

    if (!refreshed) {
      throw error
    }

    return executeGraphQL<TData>(query, variables)
  }
}

async function executeGraphQL<TData>(query: string, variables: GraphQLVariables): Promise<TData> {
  const response = await fetch(getGraphQLEndpoint(), {
    body: JSON.stringify({
      query,
      variables,
    }),
    credentials: Platform.OS === 'web' ? 'include' : 'same-origin',
    headers: buildHeaders(),
    method: 'POST',
  })
  const payload = (await response.json().catch(() => ({}))) as GraphQLResponse<TData>

  if (!response.ok) {
    const error = payload.errors?.[0]

    throw new AuthGraphQLClientError(error?.message ?? 'GraphQL request failed', {
      code: error?.extensions?.code,
      errors: payload.errors,
      status: response.status,
    })
  }

  if (payload.errors?.length) {
    const error = payload.errors[0]

    throw new AuthGraphQLClientError(error.message ?? 'GraphQL request failed', {
      code: error.extensions?.code,
      errors: payload.errors,
      status: response.status,
    })
  }

  if (!payload.data) {
    throw new AuthGraphQLClientError('GraphQL response did not include data', {
      status: response.status,
    })
  }

  return payload.data
}

function buildHeaders(): HeadersInit {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }
  const accessToken = accessTokenMemory.get()

  if (Platform.OS === 'web') {
    headers['X-Vox2Vocal-CSRF'] = '1'
  } else {
    headers['X-Vox2Vocal-Client'] = 'native'
  }

  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`
  }

  return headers
}

function getGraphQLEndpoint(): string {
  const configuredUrl =
    process.env.EXPO_PUBLIC_BFF_GRAPHQL_URL ||
    (Constants.expoConfig?.extra?.bffGraphqlUrl as string | undefined)

  if (configuredUrl) {
    return configuredUrl
  }

  return Platform.OS === 'android'
    ? 'http://10.0.2.2:4000/graphql'
    : 'http://localhost:4000/graphql'
}

function isAuthenticationError(error: unknown): boolean {
  if (!(error instanceof AuthGraphQLClientError)) {
    return false
  }

  return error.status === 401 || error.code === 'UNAUTHENTICATED'
}

async function refreshOnce(): Promise<boolean> {
  if (!refreshSessionHandler) {
    return false
  }

  refreshInFlight ??= refreshSessionHandler().finally(() => {
    refreshInFlight = null
  })

  return refreshInFlight
}
