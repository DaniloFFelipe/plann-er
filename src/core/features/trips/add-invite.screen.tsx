import { useMutation } from '@tanstack/react-query'
import { AtSign, Link2, Tag, X } from 'lucide-react-native'
import { useState } from 'react'
import { Alert, Pressable, Text, View } from 'react-native'
import colors from 'tailwindcss/colors'
import { z } from 'zod'

import { Button } from '@/core/components/button'
import { Card } from '@/core/components/card'
import { Input } from '@/core/components/input'
import { createLinkDto } from '@/core/dto/create-link.dto'
import { ApiClient } from '@/lib/api/client'

export interface AddInviteScreenProps {
  tripId: string
  onCreate?: () => void
  onClose?: () => void
}

export function AddInviteScreen({
  tripId,
  onCreate,
  onClose,
}: AddInviteScreenProps) {
  const [email, setEmail] = useState('')

  const { mutateAsync: createActivities, isPending } = useMutation({
    mutationFn: (email: string) => ApiClient.createInvite(tripId, email),
    onError() {
      Alert.alert('Whops!', 'Não foi possível criar a viajem')
    },
    onSuccess() {
      setEmail('')

      onCreate?.()
      onClose?.()
    },
  })

  const onCreateInvite = async () => {
    try {
      const data = z.string().email().parse(email)
      await createActivities(data)
    } catch (error) {
      console.log(error)
      Alert.alert('Whoops!', 'Digite um E-mail válido')
    }
  }

  return (
    <View className="flex-1 bg-zinc-900 border-t border-zinc-800 p-4">
      <View className="gap-2">
        <View className="gap-2">
          <View className="w-full flex-row justify-between items-center">
            <Text className="text-zinc-200 font-head text-lg">
              Adicionar convidados
            </Text>

            <Pressable onPress={onClose}>
              <X color={colors.zinc[200]} size={18} />
            </Pressable>
          </View>

          <Text className="text-zinc-400 font-sans text-sm">
            O convidado irá receber o convite para a participação na viagem.
          </Text>
        </View>

        <Card className="bg-zinc-950 my-4">
          <Input
            containerClassName="h-auto py-1"
            placeholder="Email do convidado"
            left={<AtSign color={colors.zinc[400]} size={18} />}
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete="off"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
        </Card>

        <Button onPress={onCreateInvite} loading={isPending}>
          Criar convite
        </Button>
      </View>
    </View>
  )
}
