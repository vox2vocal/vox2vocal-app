import * as SecureStore from 'expo-secure-store'

import {
  refreshTokenStorage as nativeRefreshTokenStorage,
  refreshTokenStorageKey,
} from '@/src/features/auth/token-storage.native'
import { refreshTokenStorage as webRefreshTokenStorage } from '@/src/features/auth/token-storage.web'

jest.mock('expo-secure-store', () => ({
  deleteItemAsync: jest.fn(),
  getItemAsync: jest.fn(),
  setItemAsync: jest.fn(),
  WHEN_UNLOCKED_THIS_DEVICE_ONLY: 'WHEN_UNLOCKED_THIS_DEVICE_ONLY',
}))

describe('refresh token storage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('stores native refresh tokens in Expo SecureStore', async () => {
    await nativeRefreshTokenStorage.set('native.refresh')

    expect(SecureStore.setItemAsync).toHaveBeenCalledWith(
      refreshTokenStorageKey,
      'native.refresh',
      {
        keychainAccessible: 'WHEN_UNLOCKED_THIS_DEVICE_ONLY',
      },
    )
  })

  it('removes native refresh tokens from Expo SecureStore', async () => {
    await nativeRefreshTokenStorage.remove()

    expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith(refreshTokenStorageKey)
  })

  it('does not persist refresh tokens on web', async () => {
    await webRefreshTokenStorage.set('web.refresh')

    await expect(webRefreshTokenStorage.get()).resolves.toBeNull()
  })
})
