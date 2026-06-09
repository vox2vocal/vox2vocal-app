export const refreshTokenStorageKey = 'vox2vocal.refreshToken.v1'

export const refreshTokenStorage = {
  get: async () => null,
  remove: async () => undefined,
  set: async (_refreshToken: string) => undefined,
}
