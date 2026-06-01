import 'react-native-gesture-handler'
import '../tamagui.generated.css'

import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native'
import * as Sentry from '@sentry/react-native'
import Constants from 'expo-constants'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { useColorScheme } from 'react-native'
import { TamaguiProvider, Theme } from 'tamagui'

import { QueryProvider } from '@/src/providers/query-provider'
import { tamaguiConfig } from '@/tamagui.config'

const sentryDsn = Constants.expoConfig?.extra?.sentryDsn

if (sentryDsn) {
  Sentry.init({
    dsn: sentryDsn,
    tracesSampleRate: 0.2,
    enableNative: true,
  })
}

function RootLayout() {
  const colorScheme = useColorScheme()
  const themeName = colorScheme === 'dark' ? 'dark' : 'light'

  return (
    <TamaguiProvider config={tamaguiConfig} defaultTheme={themeName}>
      <Theme name={themeName}>
        <QueryProvider>
          <ThemeProvider value={themeName === 'dark' ? DarkTheme : DefaultTheme}>
            <Stack screenOptions={{ headerShown: false }} />
            <StatusBar style={themeName === 'dark' ? 'light' : 'dark'} />
          </ThemeProvider>
        </QueryProvider>
      </Theme>
    </TamaguiProvider>
  )
}

export default Sentry.wrap(RootLayout)
