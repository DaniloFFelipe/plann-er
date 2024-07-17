import { useQuery } from '@tanstack/react-query'
import { Calendar, ChevronRight, MapPin, TentTree } from 'lucide-react-native'
import { FlatList, Pressable, Text, View } from 'react-native'
import colors from 'tailwindcss/colors'

import { Card } from '@/core/components/card'
import { LoadingView } from '@/core/components/loading-view'
import { ApiClient } from '@/lib/api/client'

import { InviteCell } from './components/invite-cell'
import { TripCell } from './components/trip-cell'

export function MyInvitesScreen() {
  const { data, isLoading } = useQuery({
    queryKey: ['invites'],
    queryFn: async () => {
      const invites = await ApiClient.getMyInvites()

      return {
        invites,
      }
    },
    initialData: {
      invites: [],
    },
  })

  if (isLoading) {
    return <LoadingView />
  }

  return (
    <View className="flex-1 bg-zinc-950">
      <FlatList
        data={data.invites}
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
        renderItem={({ item }) => {
          return <InviteCell invite={item} />
        }}
      />
    </View>
  )
}
