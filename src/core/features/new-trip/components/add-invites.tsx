import { AtSign, Plus, X } from 'lucide-react-native'
import { useState } from 'react'
import {
  Alert,
  FlatList,
  ListRenderItem,
  Pressable,
  Text,
  View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import colors from 'tailwindcss/colors'
import { z } from 'zod'

import { Button } from '@/core/components/button'
import { Card } from '@/core/components/card'
import { Input } from '@/core/components/input'

export interface AddInvitesProps {
  invites?: string[]
  onClose?: () => void
  onChange?: (value: string) => void
  onRemove?: (value: string) => void
}

export function AddInvites({
  invites = [],
  onChange,
  onRemove,
  onClose,
}: AddInvitesProps) {
  const [email, setEmail] = useState('')

  const handleInvite = () => {
    try {
      z.string().email().parse(email)

      onChange?.(email)
      setEmail('')
    } catch {
      Alert.alert('Whoops!', 'Digite um email válido')
    }
  }

  const renderItem: ListRenderItem<string> = ({ item }) => {
    return (
      <View className="w-full flex-row">
        <View className="px-2.5 py-1.5 bg-zinc-800 flex-row rounded-lg items-center gap-2.5">
          <Text className="text-zinc-200 font-semi text-sm">{item}</Text>
          <Pressable onPress={() => onRemove?.(item)}>
            <X color={colors.zinc[200]} size={14} />
          </Pressable>
        </View>
      </View>
    )
  }

  return (
    <View className="flex-1 bg-zinc-900 border-t border-zinc-800 p-4 gap-4">
      <View className="gap-2">
        <View className="w-full flex-row justify-between items-center">
          <Text className="text-zinc-200 font-head text-lg">
            Selecionar convidados
          </Text>

          <Pressable onPress={onClose}>
            <X color={colors.zinc[200]} size={18} />
          </Pressable>
        </View>

        <Text className="text-zinc-400 font-sans text-sm">
          Os convidados irão receber o convite para a participação na viagem.
        </Text>
      </View>

      <View className="flex-1">
        <FlatList
          data={invites}
          keyExtractor={(i) => i}
          ItemSeparatorComponent={() => <View className="h-2" />}
          renderItem={renderItem}
        />
      </View>

      <View className="h-px w-full bg-zinc-800" />

      <Card className="bg-zinc-950 py-2">
        <Input
          left={<AtSign color={colors.zinc[400]} size={18} />}
          placeholder="Digite o e-mail do convidado"
          autoCapitalize="none"
          autoCorrect={false}
          autoComplete="off"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
      </Card>
      <Button
        Right={<Plus color={colors.lime[950]} size={18} />}
        onPress={handleInvite}
      >
        Convidar
      </Button>

      <SafeAreaView edges={['bottom']} />
    </View>
  )
}
