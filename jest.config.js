module.exports = {
  preset: 'jest-expo',
  testMatch: ['**/__tests__/**/*.test.ts?(x)'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '^react-native-mmkv$': '<rootDir>/__mocks__/react-native-mmkv.ts',
  },
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native|expo|expo-.*|expo-modules-core|@expo(nent)?/.*|@expo/.*|expo-router|@sentry/react-native|nativewind|react-native-css-interop|react-native-mmkv|zustand|@tanstack/react-query)/)',
  ],
}
