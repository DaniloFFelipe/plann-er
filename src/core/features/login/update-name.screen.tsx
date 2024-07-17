import { ArrowRight, User } from 'lucide-react-native'
import { useState } from 'react'
import { Alert, ImageBackground, Text, View } from 'react-native'
import colors from 'tailwindcss/colors'
import { z } from 'zod'

import bgMask from '@/assets/bg.png'
import LogoSvg from '@/assets/logo.svg'
import { Button } from '@/core/components/button'
import { Card } from '@/core/components/card'
import { Input } from '@/core/components/input'
import { useAuthStore } from '@/core/stores/auth.store'
import { ApiClient } from '@/lib/api/client'
import { localStorage } from '@/lib/storage/mmkv'

const formSchema = z.object({
  name: z.string().min(3),
})

export function UpdateNameScreen() {
  const [name, setName] = useState('')
  const [isLoadingForm, setIsLoadingForm] = useState(false)
  const authenticate = useAuthStore((s) => s.authenticate)

  function handleContinue() {
    const validation = formSchema.safeParse({ name })
    if (!validation.success) {
      Alert.alert('Whops!', 'Digite um E-mail valido')
      return
    }
    setIsLoadingForm(true)
    ApiClient.updateName(name)
      .then(() => {
        setIsLoadingForm(false)
        const token = localStorage.getString('token')!
        authenticate({ token })
      })
      .catch(() => {
        setIsLoadingForm(false)
        Alert.alert('Whops!', 'Something went wrong!')
      })
  }

  return (
    <View className="flex-1 items-center justify-center bg-zinc-950">
      <LogoSvg />
      <ImageBackground source={bgMask} className="w-full px-4 mt-2 gap-8">
        <View>
          <Text className="text-zinc-400 font-sans text-lg mr-4 px-6 text-center">
            Seja bem vindo!
          </Text>
          <Text className="text-zinc-400 font-sans text-lg mr-4 px-6 text-center">
            Como podemos lhe chamar?
          </Text>
        </View>

        <Card className="gap-4">
          <Input
            placeholder="Seu nome"
            left={<User color={colors.zinc[400]} size={18} />}
            autoCapitalize="words"
            autoCorrect={false}
            autoComplete="off"
            value={name}
            onChangeText={setName}
          />

          <Button
            loading={isLoadingForm}
            onPress={handleContinue}
            Right={<ArrowRight color={colors.lime[950]} size={18} />}
          >
            Continuar
          </Button>
        </Card>
      </ImageBackground>
    </View>
  )
}
