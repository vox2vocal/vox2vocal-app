import { Image, useWindowDimensions } from 'react-native'

import { H1, YStack } from 'tamagui'

const logoSource = require('../assets/logo.png') as number

export default function HomeScreen() {
  const { width } = useWindowDimensions()
  const logoSize = Math.min(Math.max(width * 0.76, 260), 520)

  return (
    <YStack
      flex={1}
      background="#050505"
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
      }}
    >
      <YStack
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
        }}
      >
        <Image
          accessibilityHint="Shows the Vox2Vocal brand mark"
          accessibilityLabel="Vox2Vocal logo"
          resizeMode="contain"
          source={logoSource}
          style={{
            height: logoSize,
            width: logoSize,
          }}
        />
        <H1
          color="#F8FAFC"
          size="$10"
          style={{
            letterSpacing: 0,
            marginTop: -Math.max(logoSize * 0.08, 20),
            textAlign: 'center',
          }}
        >
          Vox2Vocal
        </H1>
      </YStack>
    </YStack>
  )
}
