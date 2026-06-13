import { useState } from 'react'
import { Pressable, Text } from 'react-native'
import { Link } from 'expo-router'

import { LockKeyhole, Mail } from 'lucide-react-native'

import {
  AuthFooterLink,
  AuthScaffold,
  authStyles,
  AuthTextField,
  Divider,
  PrimaryButton,
  SocialButton,
  StatusMessage,
} from './auth-components'
import { getAuthErrorMessage, useAuthSessionActions } from './auth-session'

const signupHref = '/signup' as never

const temporaryLoginCredentials = {
  email: 'user@example.com',
  password: 'password123',
} as const

type LoginErrors = {
  email?: string
  password?: string
}

function validateLogin(email: string, password: string): LoginErrors {
  const nextErrors: LoginErrors = {}
  const trimmedEmail = email.trim()

  if (!trimmedEmail) {
    nextErrors.email = '이메일 주소를 입력해 주세요.'
  } else if (!trimmedEmail.includes('@')) {
    nextErrors.email = '올바른 이메일 형식으로 입력해 주세요.'
  }

  if (!password) {
    nextErrors.password = '비밀번호를 입력해 주세요.'
  } else if (password.length < 8) {
    nextErrors.password = '비밀번호는 8자 이상이어야 합니다.'
  }

  return nextErrors
}

export function LoginScreen() {
  const { login } = useAuthSessionActions()
  const [email, setEmail] = useState<string>(temporaryLoginCredentials.email)
  const [password, setPassword] = useState<string>(temporaryLoginCredentials.password)
  const [securePassword, setSecurePassword] = useState(true)
  const [errors, setErrors] = useState<LoginErrors>({})
  const [formMessage, setFormMessage] = useState<string | null>(null)

  const clearFieldError = (field: keyof LoginErrors) => {
    setErrors((currentErrors) => ({ ...currentErrors, [field]: undefined }))
    setFormMessage(null)
  }

  const handleSubmit = async () => {
    const nextErrors = validateLogin(email, password)
    setErrors(nextErrors)
    setFormMessage(null)

    if (Object.keys(nextErrors).length > 0) {
      return
    }

    try {
      await login.mutateAsync({
        email: email.trim(),
        password,
      })
      setFormMessage('로그인이 완료되었습니다.')
    } catch (error) {
      setFormMessage(getAuthErrorMessage(error))
    }
  }

  const handleSecondaryAction = (message: string) => {
    setErrors({})
    setFormMessage(message)
  }

  return (
    <AuthScaffold mode="login" subtitle="당신의 목소리를 깨우세요" title="Vox2Vocal">
      <AuthTextField
        error={errors.email}
        icon={Mail}
        inputProps={{
          accessibilityHint: 'Vox2Vocal 계정 이메일 주소를 입력합니다.',
          accessibilityLabel: '이메일 주소',
          autoComplete: 'email',
          autoCorrect: false,
          inputMode: 'email',
          keyboardType: 'email-address',
          textContentType: 'emailAddress',
        }}
        onChangeText={(value) => {
          setEmail(value)
          clearFieldError('email')
        }}
        placeholder="이메일 주소"
        value={email}
      />

      <AuthTextField
        error={errors.password}
        icon={LockKeyhole}
        inputProps={{
          accessibilityHint: 'Vox2Vocal 계정 비밀번호를 입력합니다.',
          accessibilityLabel: '비밀번호',
          autoComplete: 'current-password',
          secureTextEntry: securePassword,
          textContentType: 'password',
        }}
        onChangeText={(value) => {
          setPassword(value)
          clearFieldError('password')
        }}
        placeholder="비밀번호"
        secureToggle={{
          enabled: securePassword,
          onToggle: () => setSecurePassword((currentValue) => !currentValue),
        }}
        value={password}
      />

      <Pressable
        accessibilityRole="button"
        onPress={() => handleSecondaryAction('비밀번호 재설정 화면은 다음 단계에서 연결됩니다.')}
        style={({ pressed }) => [authStyles.textButton, pressed ? { opacity: 0.7 } : null]}
      >
        <Text style={authStyles.textButtonLabel}>비밀번호를 잊으셨나요?</Text>
      </Pressable>

      <PrimaryButton
        label="로그인"
        loading={login.isPending}
        onPress={() => {
          void handleSubmit()
        }}
      />
      <StatusMessage message={formMessage} />
      <Divider />

      <SocialButton
        label="Google로 계속하기"
        onPress={() => handleSecondaryAction('Google 로그인은 다음 단계에서 연결됩니다.')}
        provider="google"
      />
      <SocialButton
        label="Apple로 계속하기"
        onPress={() => handleSecondaryAction('Apple 로그인은 다음 단계에서 연결됩니다.')}
        provider="apple"
      />

      <AuthFooterLink
        action={
          <Link asChild href={signupHref}>
            <Pressable accessibilityRole="link">
              {({ pressed }) => (
                <Text style={[authStyles.linkLabel, pressed ? { opacity: 0.7 } : null]}>
                  회원가입
                </Text>
              )}
            </Pressable>
          </Link>
        }
        prompt="계정이 없으신가요?"
      />
    </AuthScaffold>
  )
}
