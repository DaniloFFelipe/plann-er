import { View } from 'react-native'
import { twMerge } from 'tailwind-merge'

export type CardProps = React.PropsWithChildren & {
  className?: string
}

export function Card({ className, children }: CardProps) {
  return (
    <View
      className={twMerge(
        'w-full bg-zinc-900 rounded-lg py-4 px-4 border border-zinc-800',
        className,
      )}
      children={children}
    />
  )
}
