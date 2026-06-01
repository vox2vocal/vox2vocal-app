import { Check, Globe2, Layers3, Smartphone } from '@tamagui/lucide-icons'
import { useQuery } from '@tanstack/react-query'
import { Platform } from 'react-native'
import { Button, H1, H2, Paragraph, ScrollView, XStack, YStack } from 'tamagui'

import { useSessionStore } from '@/src/stores/session-store'

const stackItems = [
  'Expo SDK 56 + React Native 0.85',
  'React 19 + TypeScript 6',
  'Expo Router + React Navigation',
  'React Native Web + Metro',
  'Tamagui v2 design system',
  'TanStack Query + Zustand',
  'React Hook Form + Zod',
  'MMKV, Sentry, FlashList',
]

function useHealthCheck() {
  return useQuery({
    queryKey: ['health-check'],
    queryFn: async () => ({
      status: 'ready',
      platform: Platform.OS,
      checkedAt: new Date().toISOString(),
    }),
    staleTime: 60_000,
  })
}

export default function HomeScreen() {
  const { data } = useHealthCheck()
  const launchCount = useSessionStore((state) => state.launchCount)
  const increaseLaunchCount = useSessionStore((state) => state.increaseLaunchCount)

  return (
    <ScrollView flex={1} background="$background">
      <YStack
        gap="$6"
        style={{
          alignItems: 'center',
          minHeight: '100%',
          padding: 20,
          paddingTop: 40,
        }}
      >
        <YStack gap="$5" style={{ width: '100%', maxWidth: 960 }}>
          <XStack gap="$3" style={{ alignItems: 'center' }}>
            <Globe2 size={28} color="$blue10" />
            <Paragraph color="$color10">Universal React Native starter</Paragraph>
          </XStack>

          <YStack gap="$3">
            <H1 size="$10">Abyul Platform</H1>
            <Paragraph size="$6" color="$color11" style={{ maxWidth: 720 }}>
              Expo, React Native Web, Tamagui를 중심으로 모바일과 웹을 함께
              운영하는 최신 RN 프로젝트 기반입니다.
            </Paragraph>
          </YStack>

          <XStack gap="$3" style={{ flexWrap: 'wrap' }}>
            <Button icon={Smartphone} theme="blue" onPress={increaseLaunchCount}>
              앱 상태 확인 {launchCount}
            </Button>
            <Button icon={Layers3} variant="outlined">
              {data?.platform ?? 'loading'}
            </Button>
          </XStack>

          <YStack
            borderWidth={1}
            borderColor="$borderColor"
            background="$background"
            gap="$4"
            style={{
              borderRadius: 8,
              padding: 20,
            }}
          >
            <H2 size="$7">Installed Stack</H2>
            <YStack gap="$3">
              {stackItems.map((item) => (
                <XStack key={item} gap="$3" style={{ alignItems: 'center' }}>
                  <Check size={18} color="$green10" />
                  <Paragraph size="$5">{item}</Paragraph>
                </XStack>
              ))}
            </YStack>
          </YStack>
        </YStack>
      </YStack>
    </ScrollView>
  )
}
