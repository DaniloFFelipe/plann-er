import { useMutation } from '@tanstack/react-query'
import { Tag, X } from 'lucide-react-native'
import { useState } from 'react'
import { Alert, Pressable, Text, View } from 'react-native'
import colors from 'tailwindcss/colors'

import { Button } from '@/core/components/button'
import { Card } from '@/core/components/card'
import { Input } from '@/core/components/input'
import { ApiClient } from '@/lib/api/client'
import { dayjs } from '@/lib/dayjs'

import { DateInput } from './components/date-input'

export interface CreateActivityScreenProps {
  tripId: string
  startDate: string
  endDate: string
  onActivityCreate?: () => void
  onClose?: () => void
}

export function CreateActivityScreen({
  tripId,

  startDate,
  endDate,

  onActivityCreate,
  onClose,
}: CreateActivityScreenProps) {
  const [name, setName] = useState('')
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [time, setTime] = useState<Date | undefined>(undefined)

  const { mutateAsync: createActivities, isPending } = useMutation({
    mutationFn: ApiClient.createActivities,
    onError() {
      Alert.alert('Whops!', 'Não foi possível criar a viajem')
    },
    onSuccess() {
      setName('')
      setDate(undefined)
      setTime(undefined)

      onActivityCreate?.()
      onClose?.()
    },
  })

  const onCreate = async () => {
    if (!date || !time || name.length <= 4) return

    const dateTime = dayjs(date)
      .startOf('day')
      .set('hour', time.getHours())
      .set('minute', time.getMinutes())

    await createActivities({
      occurs_at: dateTime.toDate(),
      title: name,
      tripId,
    })
  }

  return (
    <View className="flex-1 bg-zinc-900 border-t border-zinc-800 p-4">
      <View className="gap-5">
        <View className="gap-2">
          <View className="w-full flex-row justify-between items-center">
            <Text className="text-zinc-200 font-head text-lg">
              Cadastrar atividade
            </Text>

            <Pressable onPress={onClose}>
              <X color={colors.zinc[200]} size={18} />
            </Pressable>
          </View>

          <Text className="text-zinc-400 font-sans text-sm">
            Todos convidados podem visualizar as atividades.
          </Text>
        </View>

        <Card className="bg-zinc-950">
          <Input
            containerClassName="h-auto py-1"
            placeholder="Qual a atividade?"
            left={<Tag color={colors.zinc[400]} size={18} />}
            value={name}
            onChangeText={setName}
          />
        </Card>

        <View className="w-full flex-row justify-between">
          <Card className="bg-zinc-950 w-[58%]">
            <DateInput
              placeholder="Data"
              className="h-auto py-1"
              minDate={new Date(startDate)}
              maxDate={new Date(endDate)}
              value={date}
              onChange={setDate}
            />
          </Card>

          <Card className="bg-zinc-950 w-[38%]">
            <DateInput
              placeholder="Horário"
              className="h-auto py-1"
              type="time"
              value={time}
              onChange={setTime}
            />
          </Card>
        </View>

        <Button
          onPress={onCreate}
          disabled={!date || !time || name.length <= 4}
          loading={isPending}
        >
          Salvar atividade
        </Button>
      </View>
    </View>
  )
}
