import { isLoading } from 'expo-font'
import React, { ReactNode } from 'react'
import {
  ActivityIndicator,
  Pressable,
  PressableProps,
  Text,
} from 'react-native'
import { twMerge } from 'tailwind-merge'
import { tv, VariantProps } from 'tailwind-variants'
import colors from 'tailwindcss/colors'

const button = tv({
  base: 'w-full h-11 flex-row items-center justify-center rounded-lg gap-4',
  variants: {
    color: {
      primary: 'bg-lime-300',
      secondary: 'bg-zinc-800',
      destructive: 'bg-red-600',
    },
    disabled: {
      true: 'opacity-40',
      false: 'opacity-100',
    },
  },
  defaultVariants: {
    size: 'md',
    color: 'primary',
  },
})
const buttonText = tv({
  base: 'font-mid text-lg',
  variants: {
    color: {
      primary: 'text-lime-950',
      secondary: 'text-zinc-200',
      destructive: 'text-zinc-50',
    },
  },
  defaultVariants: {
    size: 'md',
    color: 'primary',
  },
})
type ButtonVariants = VariantProps<typeof button>

export interface ButtonProps extends PressableProps {
  variant?: ButtonVariants['color']
  children?: string
  Left?: ReactNode
  Right?: ReactNode
  loading?: boolean
}

const loadingColors: Record<'primary' | 'secondary' | 'destructive', string> = {
  primary: colors.lime[950],
  secondary: colors.zinc[200],
  destructive: colors.zinc[50],
}

export function Button({
  variant = 'primary',
  className,
  children,
  loading = false,
  disabled = false,
  Left,
  Right,
  ...props
}: ButtonProps) {
  return (
    <Pressable
      disabled={disabled || loading}
      className={twMerge(
        button({ color: variant, disabled: !!disabled }),
        className,
      )}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={loadingColors[variant]} />
      ) : (
        <>
          {Left}
          <Text className={buttonText({ color: variant })}>{children}</Text>
          {Right}
        </>
      )}
    </Pressable>
  )
}
