import 'react-native-gesture-handler'

import Constants from 'expo-constants'
import { Stack } from 'expo-router'
import { DarkTheme, ThemeProvider } from 'expo-router/react-navigation'
import { StatusBar } from 'expo-status-bar'

import * as Sentry from '@sentry/react-native'
import { TamaguiProvider, Theme } from 'tamagui'

import { AuthSessionBootstrap } from '@/src/features/auth/auth-session-bootstrap'
import { QueryProvider } from '@/src/providers/query-provider'
import { tamaguiConfig } from '@/tamagui.config'

import '../tamagui.generated.css'

const sentryDsn = Constants.expoConfig?.extra?.sentryDsn

if (sentryDsn) {
  Sentry.init({
    dsn: sentryDsn,
    tracesSampleRate: 0.2,
    enableNative: true,
  })
}

function RootLayout() {
  return (
    <TamaguiProvider config={tamaguiConfig} defaultTheme="dark">
      <Theme name="dark">
        <QueryProvider>
          <AuthSessionBootstrap>
            <ThemeProvider value={DarkTheme}>
              <Stack
                screenOptions={{
                  headerShown: false,
                  contentStyle: { backgroundColor: '#050505' },
                }}
              />
              <StatusBar style="light" />
            </ThemeProvider>
          </AuthSessionBootstrap>
        </QueryProvider>
      </Theme>
    </TamaguiProvider>
  )
}

export default sentryDsn ? Sentry.wrap(RootLayout) : RootLayout
