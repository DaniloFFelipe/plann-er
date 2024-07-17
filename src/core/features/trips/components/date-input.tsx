import {
  Calendar,
  CalendarArrowDown,
  CalendarArrowUp,
  Clock,
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
  type?: 'date' | 'time'
  minDate?: Date
  maxDate?: Date
}

const DateIcon = {
  date: Calendar,
  time: Clock,
}

export function DateInput({
  className,
  placeholder,
  onChange,
  value,
  type = 'date',
  disabled,
  minDate,
  maxDate,
}: DateInputProps) {
  const Icon = DateIcon[type]
  const [open, setOpen] = useState(false)

  const openPicker = () => setOpen(true)
  const closePicker = () => setOpen(false)

  const displayValue = useMemo(() => {
    if (!value) return placeholder
    if (type === 'time') return dayjs(value).format('LT[h]')

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
        mode={type}
        isVisible={open}
        display={type === 'date' ? 'inline' : 'spinner'}
        disabled={disabled}
        date={value || minDate}
        accentColor={colors.zinc[950]}
        minimumDate={minDate}
        maximumDate={maxDate}
        onCancel={closePicker}
        onConfirm={(date) => {
          onChange?.(date)
          closePicker()
        }}
      />
    </Pressable>
  )
}
