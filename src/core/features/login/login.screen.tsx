import { useNavigation } from '@react-navigation/native'
import { ArrowRight, AtSign } from 'lucide-react-native'
import { useState } from 'react'
import { Alert, ImageBackground, Text, View } from 'react-native'
import colors from 'tailwindcss/colors'
import { z } from 'zod'

import bgMask from '@/assets/bg.png'
import LogoSvg from '@/assets/logo.svg'
import { Button } from '@/core/components/button'
import { Card } from '@/core/components/card'
import { Input } from '@/core/components/input'
import { ApiClient } from '@/lib/api/client'

const loginForm = z.object({
  email: z.string().email(),
})

export function LoginScreen() {
  const { navigate } = useNavigation()
  const [email, setEmail] = useState('')
  const [isLoadingForm, setIsLoadingForm] = useState(false)

  function handleContinue() {
    const validation = loginForm.safeParse({ email })
    if (!validation.success) {
      Alert.alert('Whops!', 'Digite um E-mail valido')
      return
    }
    setIsLoadingForm(true)
    ApiClient.requestCode(email)
      .then(({ token }) => {
        setIsLoadingForm(false)
        navigate('Code', { token })
      })
      .catch(() => {
        setIsLoadingForm(false)
        Alert.alert('Whops!', 'Something went wrong!')
      })
  }

  return (
    <View className="flex-1 items-center bg-zinc-950 justify-center">
      <LogoSvg />

      <ImageBackground source={bgMask} className="w-full px-4 mt-2 gap-8">
        <Text className="text-zinc-400 font-sans text-lg mr-4 px-6 text-center">
          Convide seus amigos e planeje sua próxima viagem!
        </Text>

        <Card className="gap-4">
          <Input
            placeholder="Seu email"
            left={<AtSign color={colors.zinc[400]} size={18} />}
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete="off"
            keyboardType="email-address"
            onChangeText={setEmail}
            value={email}
          />

          <Button
            loading={isLoadingForm}
            Right={<ArrowRight color={colors.lime[950]} size={18} />}
            onPress={handleContinue}
          >
            Continuar
          </Button>
        </Card>
      </ImageBackground>
    </View>
  )
}
