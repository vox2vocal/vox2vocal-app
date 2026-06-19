import * as React from 'react'
import { View, type ViewProps } from 'react-native'

import { cn } from '@/src/shared/lib/cn'

type CardProps = ViewProps & {
  className?: string
}

function Card({ className, ...props }: CardProps) {
  return (
    <View
      className={cn('rounded-control border border-vv-border bg-vv-surface p-5', className)}
      {...props}
    />
  )
}

export { Card }
