import { type ComponentType, type ReactNode, useEffect, useState } from 'react'
import {
  Animated,
  Image,
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  type TextInputProps,
  type TextStyle,
  useWindowDimensions,
  View,
  type ViewStyle,
} from 'react-native'

import { ArrowRight, Check, Eye, EyeOff } from 'lucide-react-native'
import Svg, { Path } from 'react-native-svg'

import { authColors, brandColors, radius, spacing } from '@/src/design-system/tokens'

const brandMarkSource = require('../../../assets/brand-mark.png') as number

type AuthMode = 'login' | 'signup'

type AuthMetrics = {
  buttonHeight: number
  formGap: number
  iconSize: number
  inputHeight: number
  inputTextSize: number
  logoSize: number
  pagePaddingY: number
  titleSize: number
}

type FieldIcon = ComponentType<{
  color?: string
  size?: number
  strokeWidth?: number
}>

type BrandIconProps = {
  size: number
}

type AuthScaffoldProps = {
  children: ReactNode
  mode: AuthMode
  subtitle: string
  title: string
}

type AuthTextFieldProps = {
  error?: string
  icon: FieldIcon
  inputProps?: Omit<TextInputProps, 'onChangeText' | 'placeholder' | 'style' | 'value'>
  mode?: AuthMode
  onChangeText: (value: string) => void
  placeholder: string
  secureToggle?: {
    enabled: boolean
    onToggle: () => void
  }
  value: string
}

type PrimaryButtonProps = {
  disabled?: boolean
  label: string
  loading?: boolean
  onPress: () => void
}

type SocialButtonProps = {
  label: string
  onPress: () => void
  provider: 'apple' | 'google'
}

type AuthFooterLinkProps = {
  action: ReactNode
  prompt: string
}

type AuthCheckboxProps = {
  checked: boolean
  label: ReactNode
  onPress: () => void
}

function getAuthMetrics(width: number, height: number, mode: AuthMode): AuthMetrics {
  const isPhone = width < 600
  const isShort = height < 760
  const isSignup = mode === 'signup'

  return {
    buttonHeight: isShort || isSignup ? 56 : 62,
    formGap: isSignup ? spacing[5] : isShort ? spacing[5] : spacing[6],
    iconSize: isShort || isSignup ? 22 : 24,
    inputHeight: isShort || isSignup ? 54 : 58,
    inputTextSize: isShort || isSignup ? 17 : 18,
    logoSize: isSignup ? 82 : isShort ? 88 : isPhone ? 104 : 112,
    pagePaddingY: isSignup ? spacing[6] : isShort ? spacing[5] : spacing[8],
    titleSize: isSignup ? 32 : isShort ? 34 : 38,
  }
}

function useSelectionStyle() {
  useEffect(() => {
    if (process.env.EXPO_OS !== 'web' || typeof document === 'undefined') {
      return undefined
    }

    const styleElement = document.createElement('style')
    styleElement.textContent = `::selection { background: ${brandColors.selection}; color: #fff; }`
    document.head.appendChild(styleElement)

    return () => styleElement.remove()
  }, [])
}

export function GoogleMarkIcon({ size }: BrandIconProps) {
  return (
    <Svg height={size} viewBox="0 0 24 24" width={size}>
      <Path
        d="M23.5 12.27c0-.79-.07-1.54-.2-2.27H12v4.29h6.46a5.52 5.52 0 0 1-2.38 3.62v3h3.85c2.25-2.07 3.57-5.12 3.57-8.64Z"
        fill="#4285F4"
      />
      <Path
        d="M12 24c3.24 0 5.95-1.08 7.93-2.93l-3.85-3c-1.07.72-2.44 1.14-4.08 1.14-3.13 0-5.78-2.11-6.73-4.95H1.29v3.09C3.26 21.27 7.31 24 12 24Z"
        fill="#34A853"
      />
      <Path
        d="M5.27 14.26A7.2 7.2 0 0 1 4.89 12c0-.77.14-1.54.38-2.26V6.65H1.29A11.96 11.96 0 0 0 0 12c0 1.91.47 3.72 1.29 5.35l3.98-3.09Z"
        fill="#FBBC05"
      />
      <Path
        d="M12 4.79c1.76 0 3.34.61 4.59 1.8l3.43-3.43C17.95 1.23 15.24 0 12 0 7.31 0 3.26 2.73 1.29 6.65l3.98 3.09C6.22 6.9 8.87 4.79 12 4.79Z"
        fill="#EA4335"
      />
    </Svg>
  )
}

export function AppleMarkIcon({ size }: BrandIconProps) {
  return (
    <Svg height={size} viewBox="0 0 24 24" width={size}>
      <Path
        d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.53 4.08ZM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25Z"
        fill="#FFFFFF"
      />
    </Svg>
  )
}

export function AuthScaffold({ children, mode, subtitle, title }: AuthScaffoldProps) {
  const { height, width } = useWindowDimensions()
  const metrics = getAuthMetrics(width, height, mode)
  useSelectionStyle()

  return (
    <ScrollView
      contentContainerStyle={[
        styles.screenContent,
        {
          minHeight: height,
          paddingHorizontal: spacing[7],
          paddingVertical: metrics.pagePaddingY,
        },
      ]}
      contentInsetAdjustmentBehavior="automatic"
      keyboardShouldPersistTaps="handled"
      style={styles.screen}
    >
      <View style={styles.ambientGlow} />
      <KeyboardAvoidingView
        behavior={process.env.EXPO_OS === 'ios' ? 'padding' : undefined}
        style={styles.shell}
      >
        <View style={styles.brandBlock}>
          <Image
            accessibilityHint="Shows the Vox2Vocal brand mark"
            accessibilityLabel="Vox2Vocal logo"
            resizeMode="contain"
            source={brandMarkSource}
            style={{ height: metrics.logoSize, width: metrics.logoSize }}
          />
          <View style={styles.titleBlock}>
            <Text
              selectable
              style={[
                styles.title,
                {
                  fontSize: metrics.titleSize,
                  lineHeight: metrics.titleSize + 8,
                },
              ]}
            >
              {title}
            </Text>
            <Text selectable style={styles.subtitle}>
              {subtitle}
            </Text>
          </View>
        </View>
        <View style={[styles.form, { gap: metrics.formGap }]}>{children}</View>
      </KeyboardAvoidingView>
    </ScrollView>
  )
}

export function AuthTextField({
  error,
  icon: Icon,
  inputProps,
  mode = 'login',
  onChangeText,
  placeholder,
  secureToggle,
  value,
}: AuthTextFieldProps) {
  const [focused, setFocused] = useState(false)
  const { height, width } = useWindowDimensions()
  const metrics = getAuthMetrics(width, height, mode)
  const iconColor = focused ? authColors.redBright : authColors.textMuted

  return (
    <View style={styles.fieldStack}>
      <View
        style={[
          styles.inputShell,
          {
            minHeight: metrics.inputHeight,
          },
          focused ? styles.inputShellFocused : null,
          error ? styles.inputShellError : null,
        ]}
      >
        <Icon color={iconColor} size={metrics.iconSize} strokeWidth={2.1} />
        <TextInput
          autoCapitalize="none"
          onBlur={(event) => {
            setFocused(false)
            inputProps?.onBlur?.(event)
          }}
          onChangeText={onChangeText}
          onFocus={(event) => {
            setFocused(true)
            inputProps?.onFocus?.(event)
          }}
          placeholder={placeholder}
          placeholderTextColor={authColors.textMuted}
          selectionColor={authColors.redBright}
          style={[
            styles.textInput,
            {
              fontSize: metrics.inputTextSize,
              minHeight: metrics.inputHeight - 8,
            },
          ]}
          value={value}
          {...inputProps}
        />
        {secureToggle ? (
          <Pressable
            accessibilityHint="비밀번호 입력값의 표시 상태를 변경합니다."
            accessibilityLabel={secureToggle.enabled ? '비밀번호 표시' : '비밀번호 숨기기'}
            accessibilityRole="button"
            hitSlop={8}
            onPress={secureToggle.onToggle}
            style={({ pressed }) => [styles.iconButton, pressed ? styles.iconButtonPressed : null]}
          >
            {secureToggle.enabled ? (
              <Eye color={authColors.textSecondary} size={metrics.iconSize} strokeWidth={2.2} />
            ) : (
              <EyeOff color={authColors.textSecondary} size={metrics.iconSize} strokeWidth={2.2} />
            )}
          </Pressable>
        ) : null}
      </View>
      {error ? (
        <Text accessibilityRole="alert" selectable style={styles.errorText}>
          {error}
        </Text>
      ) : null}
    </View>
  )
}

export function PrimaryButton({ disabled, label, loading, onPress }: PrimaryButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ busy: loading, disabled }}
      disabled={disabled || loading}
      onPress={onPress}
      style={({ hovered, pressed }) => [
        styles.primaryButton,
        disabled ? styles.primaryButtonDisabled : null,
        hovered && !disabled ? styles.primaryButtonHovered : null,
        pressed && !disabled ? styles.primaryButtonPressed : null,
      ]}
    >
      {({ hovered, pressed }) => (
        <>
          <Text style={styles.primaryButtonText}>{loading ? '확인 중' : label}</Text>
          <View
            style={[
              styles.primaryButtonArrow,
              hovered && !disabled ? styles.primaryButtonArrowHovered : null,
              pressed && !disabled ? styles.primaryButtonArrowPressed : null,
            ]}
          >
            <ArrowRight color="#FFFFFF" size={24} strokeWidth={2.4} />
          </View>
        </>
      )}
    </Pressable>
  )
}

export function SocialButton({ label, onPress, provider }: SocialButtonProps) {
  const icon = provider === 'google' ? <GoogleMarkIcon size={25} /> : <AppleMarkIcon size={25} />

  return (
    <Pressable
      accessibilityHint={`${label} 인증 흐름으로 이동합니다.`}
      accessibilityLabel={label}
      accessibilityRole="button"
      onPress={onPress}
      style={({ hovered, pressed }) => [
        styles.socialButton,
        hovered ? styles.socialButtonHovered : null,
        pressed ? styles.socialButtonPressed : null,
      ]}
    >
      {icon}
      <Text style={styles.socialButtonText}>{label}</Text>
    </Pressable>
  )
}

export function Divider() {
  return (
    <View style={styles.dividerRow}>
      <View style={styles.dividerLine} />
      <Text selectable style={styles.dividerText}>
        또는
      </Text>
      <View style={styles.dividerLine} />
    </View>
  )
}

export function AuthCheckbox({ checked, label, onPress }: AuthCheckboxProps) {
  const [scale] = useState(() => new Animated.Value(checked ? 1 : 0))

  useEffect(() => {
    Animated.spring(scale, {
      friction: 5,
      tension: 180,
      toValue: checked ? 1 : 0,
      useNativeDriver: process.env.EXPO_OS !== 'web',
    }).start()
  }, [checked, scale])

  return (
    <Pressable accessibilityRole="checkbox" accessibilityState={{ checked }} onPress={onPress}>
      {({ hovered, pressed }) => (
        <View style={[styles.checkboxRow, pressed ? styles.checkboxRowPressed : null]}>
          <View
            style={[
              styles.checkboxBox,
              hovered ? styles.checkboxBoxHovered : null,
              checked ? styles.checkboxBoxChecked : null,
            ]}
          >
            <Animated.View style={{ transform: [{ scale }] }}>
              <Check color="#FFFFFF" size={16} strokeWidth={3} />
            </Animated.View>
          </View>
          <View style={styles.checkboxLabel}>{label}</View>
        </View>
      )}
    </Pressable>
  )
}

export function AuthFooterLink({ action, prompt }: AuthFooterLinkProps) {
  return (
    <View style={styles.footerRow}>
      <Text selectable style={styles.footerPrompt}>
        {prompt}
      </Text>
      {action}
    </View>
  )
}

export function StatusMessage({ message }: { message: string | null }) {
  if (!message) {
    return null
  }

  return (
    <Text accessibilityRole="alert" selectable style={styles.statusMessage}>
      {message}
    </Text>
  )
}

export const authStyles: {
  legalLinkLabel: TextStyle
  linkLabel: TextStyle
  textButton: ViewStyle
  textButtonLabel: TextStyle
} = {
  textButton: {
    alignSelf: 'flex-end',
    borderRadius: radius.md,
    minHeight: 34,
    justifyContent: 'center',
    paddingHorizontal: spacing[1],
  },
  textButtonLabel: {
    color: authColors.textSecondary,
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 22,
  },
  linkLabel: {
    color: authColors.textPrimary,
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 24,
  },
  legalLinkLabel: {
    color: authColors.textPrimary,
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 20,
  },
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: authColors.background,
    flex: 1,
  },
  screenContent: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  ambientGlow: {
    backgroundColor: 'rgba(220, 38, 38, 0.22)',
    borderRadius: 999,
    boxShadow: '0 0 120px rgba(220, 38, 38, 0.26)',
    filter: 'blur(72px)',
    height: 260,
    opacity: 0.68,
    position: 'absolute',
    top: 40,
    width: 260,
  },
  shell: {
    alignItems: 'center',
    gap: spacing[7],
    maxWidth: 384,
    width: '100%',
    zIndex: 1,
  },
  brandBlock: {
    alignItems: 'center',
    gap: spacing[3],
    width: '100%',
  },
  titleBlock: {
    alignItems: 'center',
    gap: spacing[2],
  },
  title: {
    color: authColors.textPrimary,
    fontWeight: '700',
    letterSpacing: 0,
    textAlign: 'center',
  },
  subtitle: {
    color: authColors.textSecondary,
    fontSize: 18,
    fontWeight: '500',
    letterSpacing: 0,
    lineHeight: 26,
    textAlign: 'center',
  },
  form: {
    width: '100%',
  },
  fieldStack: {
    gap: spacing[2],
  },
  inputShell: {
    alignItems: 'center',
    backgroundColor: authColors.surface,
    borderColor: authColors.border,
    borderCurve: 'continuous',
    borderRadius: radius.authControl,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing[4],
    paddingHorizontal: spacing[5],
    width: '100%',
  },
  inputShellFocused: {
    backgroundColor: authColors.surfaceFocus,
    borderColor: 'rgba(239, 68, 68, 0.5)',
    boxShadow: '0 0 15px rgba(220, 38, 38, 0.15)',
  },
  inputShellError: {
    borderColor: authColors.danger,
  },
  textInput: {
    color: authColors.textPrimary,
    flex: 1,
    fontWeight: '400',
    lineHeight: 24,
    padding: 0,
  },
  iconButton: {
    alignItems: 'center',
    borderRadius: 999,
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  iconButtonPressed: {
    backgroundColor: authColors.surfaceHover,
  },
  errorText: {
    color: authColors.danger,
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 19,
    paddingHorizontal: spacing[2],
  },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: authColors.red,
    borderCurve: 'continuous',
    borderRadius: radius.authControl,
    boxShadow: '0 0 20px rgba(220, 38, 38, 0.4)',
    experimental_backgroundImage: `linear-gradient(90deg, ${authColors.redDark}, ${authColors.red}, ${authColors.redBright})`,
    flexDirection: 'row',
    gap: spacing[4],
    justifyContent: 'center',
    minHeight: 60,
    overflow: 'hidden',
    transform: [{ scale: 1 }],
    width: '100%',
  },
  primaryButtonHovered: {
    boxShadow: '0 0 28px rgba(239, 68, 68, 0.5)',
    transform: [{ scale: 1.03 }],
  },
  primaryButtonPressed: {
    transform: [{ scale: 0.99 }],
  },
  primaryButtonDisabled: {
    opacity: 0.5,
  },
  primaryButtonText: {
    color: authColors.textPrimary,
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 26,
  },
  primaryButtonArrow: {
    transform: [{ translateX: 0 }],
  },
  primaryButtonArrowHovered: {
    transform: [{ translateX: 4 }],
  },
  primaryButtonArrowPressed: {
    transform: [{ translateX: 2 }],
  },
  dividerRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing[5],
  },
  dividerLine: {
    backgroundColor: authColors.border,
    flex: 1,
    height: 1,
  },
  dividerText: {
    color: authColors.textMuted,
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 22,
  },
  socialButton: {
    alignItems: 'center',
    backgroundColor: authColors.surface,
    borderColor: authColors.border,
    borderCurve: 'continuous',
    borderRadius: radius.authControl,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing[4],
    justifyContent: 'center',
    minHeight: 56,
    width: '100%',
  },
  socialButtonHovered: {
    backgroundColor: authColors.surfaceHover,
  },
  socialButtonPressed: {
    opacity: 0.82,
  },
  socialButtonText: {
    color: '#E4E4E7',
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 24,
  },
  checkboxRow: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: spacing[4],
  },
  checkboxRowPressed: {
    opacity: 0.82,
  },
  checkboxBox: {
    alignItems: 'center',
    backgroundColor: authColors.surface,
    borderColor: authColors.border,
    borderCurve: 'continuous',
    borderRadius: radius.md,
    borderWidth: 1,
    height: 24,
    justifyContent: 'center',
    marginTop: 1,
    width: 24,
  },
  checkboxBoxHovered: {
    backgroundColor: authColors.surfaceHover,
  },
  checkboxBoxChecked: {
    backgroundColor: authColors.red,
    borderColor: authColors.red,
    boxShadow: '0 0 16px rgba(220, 38, 38, 0.35)',
  },
  checkboxLabel: {
    flex: 1,
  },
  footerRow: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[3],
    justifyContent: 'center',
    paddingTop: spacing[2],
  },
  footerPrompt: {
    color: authColors.textMuted,
    fontSize: 16,
    lineHeight: 24,
  },
  statusMessage: {
    color: '#E4E4E7',
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 19,
    textAlign: 'center',
  },
})
