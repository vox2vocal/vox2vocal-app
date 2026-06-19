import * as React from 'react'
import { Pressable, type PressableProps, Text } from 'react-native'

import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/src/shared/lib/cn'

const buttonVariants = cva(
  'min-h-[44px] shrink-0 flex-row items-center justify-center gap-2 rounded-control px-5 py-3 transition-opacity disabled:opacity-50',
  {
    variants: {
      variant: {
        gradient: 'bg-vv-red active:bg-vv-red-dark web:hover:opacity-95 shadow-vv-glow',
        outline: 'border border-vv-border bg-vv-surface active:bg-vv-surface-raised',
        ghost: 'bg-transparent active:bg-vv-surface-raised',
        destructive: 'bg-red-950/60 active:bg-red-900/70',
      },
      size: {
        default: 'min-h-[52px] px-5 py-3',
        sm: 'min-h-[44px] px-4 py-2',
        icon: 'h-11 w-11 rounded-xl p-0',
      },
    },
    defaultVariants: {
      size: 'default',
      variant: 'gradient',
    },
  },
)

const buttonTextVariants = cva('text-center text-sm font-semibold', {
  variants: {
    variant: {
      gradient: 'text-white',
      outline: 'text-vv-text-secondary',
      ghost: 'text-vv-text-secondary',
      destructive: 'text-red-100',
    },
  },
  defaultVariants: {
    variant: 'gradient',
  },
})

type ButtonProps = PressableProps &
  VariantProps<typeof buttonVariants> & {
    className?: string
    label?: string
    textClassName?: string
  }

function Button({
  children,
  className,
  label,
  size,
  textClassName,
  variant,
  ...props
}: ButtonProps) {
  return (
    <Pressable className={cn(buttonVariants({ size, variant }), className)} {...props}>
      {children ??
        (label ? (
          <Text className={cn(buttonTextVariants({ variant }), textClassName)}>{label}</Text>
        ) : null)}
    </Pressable>
  )
}

export { Button, buttonTextVariants, buttonVariants }
