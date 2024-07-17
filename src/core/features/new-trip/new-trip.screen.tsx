import { useNavigation } from '@react-navigation/native'
import { ArrowRight, Icon, LogOut, MapPin } from 'lucide-react-native'
import { useState } from 'react'
import { Alert, ImageBackground, Pressable, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import colors, { zinc } from 'tailwindcss/colors'
import { z } from 'zod'

import bgMask from '@/assets/bg.png'
import LogoSvg from '@/assets/logo.svg'
import { Button } from '@/core/components/button'
import { Card } from '@/core/components/card'
import { Input } from '@/core/components/input'
import { useAuthStore } from '@/core/stores/auth.store'
import { dayjs } from '@/lib/dayjs'

import { DateInput } from './components/date-input'

const FormSchema = z.object({
  destination: z.string().min(3),
})

export function NewTripScreen() {
  const logout = useAuthStore((a) => a.logout)
  const [destination, setDestination] = useState('')
  const [startDate, setStartDate] = useState<Date | undefined>(undefined)
  const [endDate, setEndDate] = useState<Date | undefined>(undefined)

  const navigation = useNavigation()

  const onStartDateChange = (date: Date) => {
    if (endDate && dayjs(date).isAfter(endDate)) {
      setEndDate(undefined)
    }

    setStartDate(date)
  }

  const handleConfirmTrip = () => {
    if (!endDate || !startDate) return

    const { success } = FormSchema.safeParse({ destination })
    if (!success) {
      Alert.alert('Whops!', 'Selecione uma destino válido')
      return
    }

    navigation.navigate('SelectInvites', {
      destination,
      endDate: endDate.toISOString(),
      startDate: startDate.toISOString(),
    })
  }

  const navigateToMyTrips = () => {
    navigation.navigate('MyTrips')
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.zinc[950] }}>
      <View className="flex-1 items-center justify-center bg-zinc-950">
        <LogoSvg />
        <ImageBackground source={bgMask} className="w-full px-4 mt-2 gap-8">
          <View>
            <Text className="text-zinc-400 font-sans text-lg mr-4 px-6 text-center">
              Convide seus amigos e planeje sua próxima viagem!
            </Text>
          </View>

          <Card className="gap-4">
            <Input
              placeholder="Para onde?"
              left={<MapPin color={colors.zinc[400]} size={18} />}
              autoCapitalize="words"
              autoCorrect={false}
              autoComplete="off"
              value={destination}
              onChangeText={setDestination}
            />
            <DateInput
              placeholder="De quando?"
              type="start"
              onChange={onStartDateChange}
              value={startDate}
              minDate={new Date()}
            />
            <DateInput
              placeholder="Ate quando?"
              type="end"
              disabled={!startDate}
              onChange={(date) => setEndDate(date)}
              value={endDate}
              minDate={startDate}
            />

            <Button
              Right={<ArrowRight color={colors.lime[950]} size={18} />}
              disabled={
                !endDate || !startDate || !(destination.trim().length >= 3)
              }
              onPress={handleConfirmTrip}
            >
              Continuar
            </Button>

            <Button
              onPress={navigateToMyTrips}
              variant="secondary"
              Right={<MapPin color={colors.zinc[200]} size={18} />}
            >
              Minhas viagens
            </Button>
          </Card>
        </ImageBackground>

        <Pressable className="absolute right-4 top-4" onPress={logout}>
          <LogOut color={colors.red[600]} size={24} />
        </Pressable>
      </View>
    </SafeAreaView>
  )
}
