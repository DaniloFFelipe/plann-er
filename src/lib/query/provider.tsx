import { QueryClientProvider } from '@tanstack/react-query'

import { queryClient } from './client'

export function QueryProvider({ ...props }: React.PropsWithChildren) {
  return <QueryClientProvider client={queryClient} {...props} />
}
