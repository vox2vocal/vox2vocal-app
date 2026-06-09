import * as SecureStore from 'expo-secure-store'

export const refreshTokenStorageKey = 'vox2vocal.refreshToken.v1'

export const refreshTokenStorage = {
  get: () => SecureStore.getItemAsync(refreshTokenStorageKey),
  remove: () => SecureStore.deleteItemAsync(refreshTokenStorageKey),
  set: (refreshToken: string) =>
    SecureStore.setItemAsync(refreshTokenStorageKey, refreshToken, {
      keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
    }),
}
