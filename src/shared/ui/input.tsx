import * as React from 'react'
import { TextInput, type TextInputProps } from 'react-native'

import { cn } from '@/src/shared/lib/cn'

type InputProps = TextInputProps & {
  className?: string
}

function Input({ className, placeholderTextColor = '#71717A', ...props }: InputProps) {
  return (
    <TextInput
      className={cn(
        'min-h-[52px] rounded-control border border-vv-border bg-vv-surface px-4 py-3 text-base font-medium text-white',
        className,
      )}
      placeholderTextColor={placeholderTextColor}
      selectionColor="#EF4444"
      {...props}
    />
  )
}

export { Input }
