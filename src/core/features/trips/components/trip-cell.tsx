import { useNavigation } from '@react-navigation/native'
import { ArrowRight, Calendar, MapPin } from 'lucide-react-native'
import { Text, View } from 'react-native'
import colors from 'tailwindcss/colors'

import { Button } from '@/core/components/button'
import { Card } from '@/core/components/card'
import { Trip } from '@/core/models/trip.model'
import { dayjs } from '@/lib/dayjs'

export interface TripCellProps {
  trip: Trip
  presentation: 'screen' | 'drawer'
  onTripChange?: () => void
}

export function TripCell({ trip, presentation, onTripChange }: TripCellProps) {
  const navigation = useNavigation()

  const tripDateInterval =
    dayjs(trip.starts_at).date() + ' à ' + dayjs(trip.ends_at).format('LL')

  function goToTripDetails() {
    if (presentation === 'screen') {
      navigation.reset({
        index: 0,
        routes: [
          {
            name: 'TripDetails',
            params: {
              tripId: trip.id,
            },
          },
        ],
      })
      onTripChange?.()
      return
    }

    navigation.setParams({
      tripId: trip.id,
    })
    onTripChange?.()
  }

  return (
    <Card className="gap-4">
      <View>
        <View className="w-full py-2 flex-row items-center gap-3">
          <MapPin color={colors.zinc[400]} size={18} />

          <Text className="font-sans color-zinc-100">{trip.destination}</Text>
        </View>

        <View className="w-full py-2 flex-row items-center gap-3">
          <Calendar color={colors.zinc[400]} size={18} />

          <Text className="font-sans color-zinc-100">{tripDateInterval}</Text>
        </View>
      </View>

      <Button
        Right={<ArrowRight color={colors.lime[950]} size={18} />}
        onPress={goToTripDetails}
      >
        Ver Detalhes
      </Button>
    </Card>
  )
}
