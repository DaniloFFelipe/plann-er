import {
  Calendar,
  CalendarArrowDown,
  CalendarArrowUp,
} from 'lucide-react-native'
import { useMemo, useState } from 'react'
import { Pressable, Text, View } from 'react-native'
import DateTimePicker from 'react-native-modal-datetime-picker'
import { twMerge } from 'tailwind-merge'
import colors from 'tailwindcss/colors'

import { dayjs } from '@/lib/dayjs'

export interface DateInputProps {
  className?: string
  placeholder?: string
  value?: Date
  disabled?: boolean
  onChange?: (value: Date) => void
  type?: 'default' | 'start' | 'end'
  minDate?: Date
}

const DateIcon = {
  default: Calendar,
  start: CalendarArrowUp,
  end: CalendarArrowDown,
}

export function DateInput({
  className,
  placeholder,
  onChange,
  value,
  type = 'default',
  disabled,
  minDate,
}: DateInputProps) {
  const Icon = DateIcon[type]
  const [open, setOpen] = useState(false)

  const openPicker = () => setOpen(true)
  const closePicker = () => setOpen(false)

  const displayValue = useMemo(() => {
    if (!value) return placeholder
    return dayjs(value).format('LL')
  }, [value])

  return (
    <Pressable
      onPress={openPicker}
      className={twMerge('w-full h-11 flex-row items-center gap-3', className)}
    >
      <Icon color={colors.zinc[400]} size={20} />
      <Text className="flex-1 font-sans color-zinc-400">{displayValue}</Text>
      <DateTimePicker
        isVisible={open}
        display="inline"
        disabled={disabled}
        // value={value ?? new Date()}
        accentColor={colors.zinc[950]}
        minimumDate={minDate}
        onCancel={closePicker}
        onConfirm={(date) => {
          onChange?.(date)
          closePicker()
        }}
      />
    </Pressable>
  )
}
