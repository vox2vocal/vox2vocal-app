import { Platform } from 'react-native'

import { createMMKV } from 'react-native-mmkv'
import { create } from 'zustand'
import { createJSONStorage, persist, StateStorage } from 'zustand/middleware'

type SessionState = {
  launchCount: number
  increaseLaunchCount: () => void
}

const nativeStorage = Platform.OS === 'web' ? null : createMMKV({ id: 'session' })

const storage: StateStorage = {
  getItem: (name) => {
    if (Platform.OS === 'web') {
      return globalThis.localStorage?.getItem(name) ?? null
    }

    return nativeStorage?.getString(name) ?? null
  },
  setItem: (name, value) => {
    if (Platform.OS === 'web') {
      globalThis.localStorage?.setItem(name, value)
      return
    }

    nativeStorage?.set(name, value)
  },
  removeItem: (name) => {
    if (Platform.OS === 'web') {
      globalThis.localStorage?.removeItem(name)
      return
    }

    nativeStorage?.remove(name)
  },
}

export const useSessionStore = create<SessionState>()(
  persist(
    (set) => ({
      launchCount: 0,
      increaseLaunchCount: () => set((state) => ({ launchCount: state.launchCount + 1 })),
    }),
    {
      name: 'abyul-session',
      storage: createJSONStorage(() => storage),
    },
  ),
)
