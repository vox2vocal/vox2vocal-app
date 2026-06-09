import { useState } from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { Link } from 'expo-router'

import { LockKeyhole, Mail, ShieldCheck, UserRound } from 'lucide-react-native'

import { authColors } from '@/src/design-system/tokens'

import {
  AuthCheckbox,
  AuthFooterLink,
  AuthScaffold,
  authStyles,
  AuthTextField,
  PrimaryButton,
  StatusMessage,
} from './auth-components'
import { getAuthErrorMessage, useAuthSessionActions } from './auth-session'

type SignupErrors = {
  email?: string
  name?: string
  password?: string
  passwordConfirm?: string
  terms?: string
}

function validateSignup({
  acceptedTerms,
  email,
  name,
  password,
  passwordConfirm,
}: {
  acceptedTerms: boolean
  email: string
  name: string
  password: string
  passwordConfirm: string
}): SignupErrors {
  const nextErrors: SignupErrors = {}
  const trimmedEmail = email.trim()
  const trimmedName = name.trim()

  if (!trimmedName) {
    nextErrors.name = '이름 또는 닉네임을 입력해 주세요.'
  }

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

  if (!passwordConfirm) {
    nextErrors.passwordConfirm = '비밀번호 확인을 입력해 주세요.'
  } else if (password !== passwordConfirm) {
    nextErrors.passwordConfirm = '비밀번호가 서로 일치하지 않습니다.'
  }

  if (!acceptedTerms) {
    nextErrors.terms = '서비스 이용약관과 개인정보 처리방침에 동의해 주세요.'
  }

  return nextErrors
}

export function SignupScreen() {
  const { signUp } = useAuthSessionActions()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [securePassword, setSecurePassword] = useState(true)
  const [securePasswordConfirm, setSecurePasswordConfirm] = useState(true)
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [errors, setErrors] = useState<SignupErrors>({})
  const [formMessage, setFormMessage] = useState<string | null>(null)

  const clearFieldError = (field: keyof SignupErrors) => {
    setErrors((currentErrors) => ({ ...currentErrors, [field]: undefined }))
    setFormMessage(null)
  }

  const handleSubmit = async () => {
    const nextErrors = validateSignup({
      acceptedTerms,
      email,
      name,
      password,
      passwordConfirm,
    })

    setErrors(nextErrors)
    setFormMessage(null)

    if (Object.keys(nextErrors).length > 0) {
      return
    }

    try {
      await signUp.mutateAsync({
        displayName: name.trim(),
        email: email.trim(),
        password,
      })
      setFormMessage('회원가입이 완료되었습니다.')
    } catch (error) {
      setFormMessage(getAuthErrorMessage(error))
    }
  }

  return (
    <AuthScaffold mode="signup" subtitle="새로운 목소리 여정을 시작하세요" title="회원가입">
      <AuthTextField
        error={errors.name}
        icon={UserRound}
        inputProps={{
          accessibilityHint: 'Vox2Vocal에서 사용할 이름 또는 닉네임을 입력합니다.',
          accessibilityLabel: '이름 또는 닉네임',
          autoComplete: 'name',
          textContentType: 'name',
        }}
        mode="signup"
        onChangeText={(value) => {
          setName(value)
          clearFieldError('name')
        }}
        placeholder="이름 또는 닉네임"
        value={name}
      />

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
        mode="signup"
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
          accessibilityHint: '8자 이상의 비밀번호를 입력합니다.',
          accessibilityLabel: '비밀번호',
          autoComplete: 'new-password',
          secureTextEntry: securePassword,
          textContentType: 'newPassword',
        }}
        mode="signup"
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

      <AuthTextField
        error={errors.passwordConfirm}
        icon={ShieldCheck}
        inputProps={{
          accessibilityHint: '비밀번호를 한 번 더 입력합니다.',
          accessibilityLabel: '비밀번호 확인',
          autoComplete: 'new-password',
          secureTextEntry: securePasswordConfirm,
          textContentType: 'newPassword',
        }}
        mode="signup"
        onChangeText={(value) => {
          setPasswordConfirm(value)
          clearFieldError('passwordConfirm')
        }}
        placeholder="비밀번호 확인"
        secureToggle={{
          enabled: securePasswordConfirm,
          onToggle: () => setSecurePasswordConfirm((currentValue) => !currentValue),
        }}
        value={passwordConfirm}
      />

      <View style={styles.termsBlock}>
        <AuthCheckbox
          checked={acceptedTerms}
          label={
            <Text selectable style={styles.termsText}>
              만 14세 이상이며 <Text style={authStyles.legalLinkLabel}>서비스 이용약관</Text> 및{' '}
              <Text style={authStyles.legalLinkLabel}>개인정보 처리방침</Text>에 동의합니다.
            </Text>
          }
          onPress={() => {
            setAcceptedTerms((currentValue) => !currentValue)
            clearFieldError('terms')
          }}
        />
        {errors.terms ? (
          <Text accessibilityRole="alert" selectable style={styles.termsError}>
            {errors.terms}
          </Text>
        ) : null}
      </View>

      <PrimaryButton
        disabled={!acceptedTerms}
        label="가입하기"
        loading={signUp.isPending}
        onPress={() => {
          void handleSubmit()
        }}
      />
      <StatusMessage message={formMessage} />

      <AuthFooterLink
        action={
          <Link asChild href="/">
            <Pressable accessibilityRole="link">
              {({ pressed }) => (
                <Text style={[authStyles.linkLabel, pressed ? { opacity: 0.7 } : null]}>
                  로그인
                </Text>
              )}
            </Pressable>
          </Link>
        }
        prompt="이미 계정이 있으신가요?"
      />
    </AuthScaffold>
  )
}

const styles = StyleSheet.create({
  termsBlock: {
    gap: 8,
  },
  termsText: {
    color: authColors.textSecondary,
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
  },
  termsError: {
    color: '#F87171',
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 19,
    paddingLeft: 40,
  },
})
