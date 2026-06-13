import { requireOptionalNativeModule } from 'expo-modules-core'

export const refreshTokenStorageKey = 'vox2vocal.refreshToken.v1'

type SecureStoreOptions = {
  keychainAccessible?: number
}

type SecureStoreNativeModule = {
  WHEN_UNLOCKED_THIS_DEVICE_ONLY?: number
  deleteValueWithKeyAsync?: (key: string, options?: SecureStoreOptions) => Promise<void>
  getValueWithKeyAsync?: (key: string, options?: SecureStoreOptions) => Promise<string | null>
  setValueWithKeyAsync?: (value: string, key: string, options?: SecureStoreOptions) => Promise<void>
}

let secureStoreModule: SecureStoreNativeModule | null | undefined
let fallbackRefreshToken: string | null = null

function getSecureStore(): SecureStoreNativeModule | null {
  if (secureStoreModule === undefined) {
    secureStoreModule = requireOptionalNativeModule<SecureStoreNativeModule>('ExpoSecureStore')
  }

  if (!secureStoreModule && !__DEV__) {
    throw new Error('ExpoSecureStore native module is unavailable.')
  }

  return secureStoreModule
}

function isSecureStoreUsable(
  secureStore: SecureStoreNativeModule | null,
): secureStore is Required<
  Pick<
    SecureStoreNativeModule,
    'deleteValueWithKeyAsync' | 'getValueWithKeyAsync' | 'setValueWithKeyAsync'
  >
> &
  SecureStoreNativeModule {
  return Boolean(
    secureStore?.deleteValueWithKeyAsync &&
    secureStore.getValueWithKeyAsync &&
    secureStore.setValueWithKeyAsync,
  )
}

function getSecureStoreOptions(secureStore: SecureStoreNativeModule): SecureStoreOptions {
  if (!secureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY) {
    return {}
  }

  return {
    keychainAccessible: secureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
  }
}

async function withSecureStore<TValue>(
  action: (
    secureStore: Required<
      Pick<
        SecureStoreNativeModule,
        'deleteValueWithKeyAsync' | 'getValueWithKeyAsync' | 'setValueWithKeyAsync'
      >
    > &
      SecureStoreNativeModule,
  ) => Promise<TValue>,
  fallback: () => Promise<TValue>,
): Promise<TValue> {
  const secureStore = getSecureStore()

  if (!isSecureStoreUsable(secureStore) && __DEV__) {
    return fallback()
  }

  if (!isSecureStoreUsable(secureStore)) {
    throw new Error('ExpoSecureStore native module is unavailable.')
  }

  return action(secureStore)
}

export const refreshTokenStorage = {
  get: () =>
    withSecureStore(
      (secureStore) => secureStore.getValueWithKeyAsync(refreshTokenStorageKey, {}),
      async () => fallbackRefreshToken,
    ),
  remove: () =>
    withSecureStore(
      (secureStore) => secureStore.deleteValueWithKeyAsync(refreshTokenStorageKey, {}),
      async () => {
        fallbackRefreshToken = null
      },
    ),
  set: (refreshToken: string) =>
    withSecureStore(
      (secureStore) =>
        secureStore.setValueWithKeyAsync(
          refreshToken,
          refreshTokenStorageKey,
          getSecureStoreOptions(secureStore),
        ),
      async () => {
        fallbackRefreshToken = refreshToken
      },
    ),
}

export function resetRefreshTokenStorageForTest() {
  secureStoreModule = undefined
  fallbackRefreshToken = null
}
