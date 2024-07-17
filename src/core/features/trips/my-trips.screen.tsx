import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { useQuery } from '@tanstack/react-query'
import { Calendar, ChevronRight, MapPin, TentTree } from 'lucide-react-native'
import { useCallback } from 'react'
import { FlatList, Pressable, Text, View } from 'react-native'
import colors from 'tailwindcss/colors'

import { Card } from '@/core/components/card'
import { LoadingView } from '@/core/components/loading-view'
import { ApiClient } from '@/lib/api/client'

import { TripCell } from './components/trip-cell'

export interface MyTripsScreenProps {
  presentationType?: 'screen' | 'drawer'
  onTripChange?: () => void
}

export function MyTripsScreen({
  presentationType = 'screen',
  onTripChange,
}: MyTripsScreenProps) {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['trips', 'me', 'invites'],
    queryFn: async () => {
      const [trips, invites] = await Promise.all([
        ApiClient.getMyTrips(),
        ApiClient.getMyInvites(),
      ])

      return {
        trips,
        invites,
      }
    },
    initialData: {
      trips: [],
      invites: [],
    },
  })
  const navigation = useNavigation()

  useFocusEffect(
    useCallback(() => {
      refetch()
    }, []),
  )

  if (isLoading) {
    return <LoadingView />
  }

  return (
    <View className="flex-1 bg-zinc-950">
      <FlatList
        data={data.trips}
        keyExtractor={(d) => d.id}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 8,
        }}
        ListEmptyComponent={() => {
          return (
            <Card className="items-center justify-center gap-4">
              <TentTree color={colors.zinc[200]} size={32} />
              <Text className="text-xl font-semi text-zinc-200 text-center">
                Você ainda não possui viagens cadastradas
              </Text>
            </Card>
          )
        }}
        ItemSeparatorComponent={() => <View className="h-4" />}
        ListHeaderComponent={() => {
          if (data.invites.length <= 0) return null

          return (
            <Pressable onPress={() => navigation.navigate('MyInvites')}>
              <Card className="flex-row items-center justify-between mb-8">
                <Text className="color-zinc-100 text-lg font-semi">
                  Convites
                </Text>

                <View className="flex-row items-center">
                  <View className="h-6 w-6 bg-lime-300 rounded-full items-center justify-center">
                    <Text className="color-lime-950 text-md font-semi">
                      {data.invites.length}
                    </Text>
                  </View>

                  <ChevronRight color={colors.zinc[200]} size={24} />
                </View>
              </Card>
            </Pressable>
          )
        }}
        renderItem={({ item }) => {
          return (
            <TripCell
              trip={item}
              presentation={presentationType}
              onTripChange={onTripChange}
            />
          )
        }}
      />
    </View>
  )
}
