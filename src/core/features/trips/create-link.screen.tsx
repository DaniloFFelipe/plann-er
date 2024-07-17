import { useMutation } from '@tanstack/react-query'
import { Link2, Tag, X } from 'lucide-react-native'
import { useState } from 'react'
import { Alert, Pressable, Text, View } from 'react-native'
import colors from 'tailwindcss/colors'
import { date, z } from 'zod'

import { Button } from '@/core/components/button'
import { Card } from '@/core/components/card'
import { Input } from '@/core/components/input'
import { createLinkDto } from '@/core/dto/create-link.dto'
import { ApiClient } from '@/lib/api/client'
import { dayjs } from '@/lib/dayjs'

import { DateInput } from './components/date-input'

export interface CreateLinkScreenProps {
  tripId: string
  onCreate?: () => void
  onClose?: () => void
}

export function CreateLinkScreen({
  tripId,
  onCreate,
  onClose,
}: CreateLinkScreenProps) {
  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')

  const { mutateAsync: createActivities, isPending } = useMutation({
    mutationFn: (dto: z.infer<typeof createLinkDto>) =>
      ApiClient.createLink(tripId, dto),
    onError() {
      Alert.alert('Whops!', 'Não foi possível criar a viajem')
    },
    onSuccess() {
      setTitle('')
      setUrl('')

      onCreate?.()
      onClose?.()
    },
  })

  const onCreateLink = async () => {
    try {
      const data = createLinkDto.parse({ title, url })
      await createActivities(data)
    } catch (error) {
      Alert.alert('Whoops!', 'Please verify link information')
    }
  }

  return (
    <View className="flex-1 bg-zinc-900 border-t border-zinc-800 p-4">
      <View className="gap-2">
        <View className="gap-2">
          <View className="w-full flex-row justify-between items-center">
            <Text className="text-zinc-200 font-head text-lg">
              Cadastrar link
            </Text>

            <Pressable onPress={onClose}>
              <X color={colors.zinc[200]} size={18} />
            </Pressable>
          </View>

          <Text className="text-zinc-400 font-sans text-sm">
            Todos convidados podem visualizar os links importantes.
          </Text>
        </View>

        <Card className="bg-zinc-950 mt-4">
          <Input
            containerClassName="h-auto py-1"
            placeholder="Título do link"
            left={<Tag color={colors.zinc[400]} size={18} />}
            value={title}
            onChangeText={setTitle}
          />
        </Card>

        <Card className="bg-zinc-950 mb-4">
          <Input
            containerClassName="h-auto py-1"
            placeholder="URL"
            left={<Link2 color={colors.zinc[400]} size={18} />}
            value={url}
            onChangeText={setUrl}
            keyboardType="url"
            autoComplete="off"
            autoCorrect={false}
            autoCapitalize="none"
          />
        </Card>

        <Button onPress={onCreateLink} loading={isPending}>
          Salvar link
        </Button>
      </View>
    </View>
  )
}
