let currentAccessToken: string | null = null

export const accessTokenMemory = {
  clear: () => {
    currentAccessToken = null
  },
  get: () => currentAccessToken,
  set: (accessToken: string) => {
    currentAccessToken = accessToken
  },
}
