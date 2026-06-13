import { requireOptionalNativeModule } from 'expo-modules-core'

import {
  refreshTokenStorage as nativeRefreshTokenStorage,
  refreshTokenStorageKey,
  resetRefreshTokenStorageForTest,
} from '@/src/features/auth/token-storage.native'
import { refreshTokenStorage as webRefreshTokenStorage } from '@/src/features/auth/token-storage.web'

const mockSecureStoreNativeModule = {
  deleteValueWithKeyAsync: jest.fn(),
  getValueWithKeyAsync: jest.fn(),
  setValueWithKeyAsync: jest.fn(),
  WHEN_UNLOCKED_THIS_DEVICE_ONLY: 2,
}

jest.mock('expo-modules-core', () => {
  const actualExpoModulesCore = jest.requireActual('expo-modules-core')

  return {
    ...actualExpoModulesCore,
    requireOptionalNativeModule: jest.fn(() => mockSecureStoreNativeModule),
  }
})

describe('refresh token storage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.mocked(requireOptionalNativeModule).mockReturnValue(mockSecureStoreNativeModule)
    resetRefreshTokenStorageForTest()
  })

  it('stores native refresh tokens in Expo SecureStore', async () => {
    await nativeRefreshTokenStorage.set('native.refresh')

    expect(mockSecureStoreNativeModule.setValueWithKeyAsync).toHaveBeenCalledWith(
      'native.refresh',
      refreshTokenStorageKey,
      {
        keychainAccessible: 2,
      },
    )
  })

  it('removes native refresh tokens from Expo SecureStore', async () => {
    await nativeRefreshTokenStorage.remove()

    expect(mockSecureStoreNativeModule.deleteValueWithKeyAsync).toHaveBeenCalledWith(
      refreshTokenStorageKey,
      {},
    )
  })

  it('falls back to in-memory storage in dev when SecureStore is missing from the native build', async () => {
    jest.mocked(requireOptionalNativeModule).mockReturnValueOnce(null)

    await nativeRefreshTokenStorage.set('dev.refresh')

    await expect(nativeRefreshTokenStorage.get()).resolves.toBe('dev.refresh')

    await nativeRefreshTokenStorage.remove()

    await expect(nativeRefreshTokenStorage.get()).resolves.toBeNull()
  })

  it('does not persist refresh tokens on web', async () => {
    await webRefreshTokenStorage.set('web.refresh')

    await expect(webRefreshTokenStorage.get()).resolves.toBeNull()
  })
})
