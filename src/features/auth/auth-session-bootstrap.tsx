import { PropsWithChildren, useEffect } from 'react'

import { useQueryClient } from '@tanstack/react-query'

import { bootstrapAuthSession } from './auth-session'

export function AuthSessionBootstrap({ children }: PropsWithChildren) {
  const queryClient = useQueryClient()

  useEffect(() => {
    let mounted = true

    void bootstrapAuthSession().then((user) => {
      if (!mounted) {
        return
      }

      if (user) {
        queryClient.setQueryData(['me'], user)
      } else {
        queryClient.clear()
      }
    })

    return () => {
      mounted = false
    }
  }, [queryClient])

  return children
}
