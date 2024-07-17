import { ActivityIndicator, View, ViewProps } from 'react-native'
import { twMerge } from 'tailwind-merge'
import colors from 'tailwindcss/colors'

export interface LoadingViewProps extends ViewProps {}

export function LoadingView({ className, ...props }: LoadingViewProps) {
  return (
    <View
      className={twMerge(
        'flex-1 bg-zinc-950 items-center justify-center',
        className,
      )}
      {...props}
    >
      <ActivityIndicator color={colors.zinc[200]} />
    </View>
  )
}
