import { AtSign } from 'lucide-react-native'
import { ReactNode } from 'react'
import { TextInput, TextInputProps, View } from 'react-native'
import { twMerge } from 'tailwind-merge'
import colors from 'tailwindcss/colors'

export interface InputProps extends TextInputProps {
  containerClassName?: string
  left?: ReactNode
}

export function Input({ containerClassName, left, ...props }: InputProps) {
  return (
    <View
      className={twMerge(
        'w-full h-11 flex-row items-center gap-3',
        containerClassName,
      )}
    >
      {left}
      <TextInput
        placeholderTextColor={colors.zinc[400]}
        className="flex-1 font-sans color-zinc-100"
        {...props}
      />
    </View>
  )
}
