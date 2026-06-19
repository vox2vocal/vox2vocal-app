import * as React from 'react'
import { Pressable, type PressableProps, Text, View } from 'react-native'

import { Check } from 'lucide-react-native'

import { cn } from '@/src/shared/lib/cn'

type CheckboxProps = Omit<PressableProps, 'children'> & {
  checked: boolean
  className?: string
  label?: React.ReactNode
}

function Checkbox({ checked, className, label, ...props }: CheckboxProps) {
  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
      className={cn('min-h-[44px] flex-row items-start gap-3', className)}
      {...props}
    >
      <View
        className={cn(
          'mt-0.5 h-6 w-6 items-center justify-center rounded-lg border border-vv-border bg-vv-surface',
          checked && 'border-vv-red bg-vv-red shadow-vv-glow-subtle',
        )}
      >
        {checked ? <Check color="#FFFFFF" size={16} strokeWidth={3} /> : null}
      </View>
      {typeof label === 'string' ? (
        <Text className="flex-1 text-sm font-medium leading-5 text-vv-text-secondary">{label}</Text>
      ) : (
        label
      )}
    </Pressable>
  )
}

export { Checkbox }
