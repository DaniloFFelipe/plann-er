import { StaticScreenProps, useNavigation } from '@react-navigation/native'
import { ArrowLeft, ArrowRight, ScanBarcode } from 'lucide-react-native'
import { useState } from 'react'
import { Alert, ImageBackground, Pressable, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
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

type Props = StaticScreenProps<{
  token: string
}>

const CodeForm = z.object({
  code: z.string().length(6),
})

export function CodeScreen({ route }: Props) {
  const { top } = useSafeAreaInsets()
  const { navigate, goBack } = useNavigation()
  const token = route.params.token

  const [code, setCode] = useState('')
  const [isLoadingForm, setIsLoadingForm] = useState(false)

  const authenticate = useAuthStore((s) => s.authenticate)

  function handleContinue() {
    const validation = CodeForm.safeParse({ code })
    if (!validation.success) {
      Alert.alert('Whops!', 'Digite o código válido')
      return
    }
    setIsLoadingForm(true)
    ApiClient.authenticate(token, code)
      .then(({ token, hasToUpdateName }) => {
        setIsLoadingForm(false)
        localStorage.set('token', token)
        if (hasToUpdateName) {
          navigate('UpdateName')
          return
        }

        authenticate({ token })
      })
      .catch(() => {
        setIsLoadingForm(false)
        Alert.alert('Whops!', 'Something went wrong!')
      })
  }

  return (
    <View className="flex-1 items-center justify-center bg-zinc-950">
      <Pressable
        className="absolute left-4"
        style={{ top: top + 16 }}
        onPress={goBack}
      >
        <ArrowLeft color={colors.zinc[200]} size={24} />
      </Pressable>

      <LogoSvg />
      <ImageBackground source={bgMask} className="w-full px-4 mt-2 gap-8">
        <Text className="text-zinc-400 font-sans text-lg mr-4 px-6 text-center">
          Digite o código que enviamos para o seu email!
        </Text>

        <Card className="gap-4">
          <Input
            placeholder="Digite seu código"
            left={<ScanBarcode color={colors.zinc[400]} size={18} />}
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete="off"
            value={code}
            onChangeText={(t) => setCode(t.toUpperCase())}
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
