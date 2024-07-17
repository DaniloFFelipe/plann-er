import { useNavigation } from '@react-navigation/native'
import { useMutation } from '@tanstack/react-query'
import { ArrowRight, Calendar, MapPin } from 'lucide-react-native'
import React from 'react'
import { Alert, Text, View } from 'react-native'
import colors from 'tailwindcss/colors'

import { Button } from '@/core/components/button'
import { Card } from '@/core/components/card'
import { Invite } from '@/core/models/invites.model'
import { ApiClient } from '@/lib/api/client'
import { dayjs } from '@/lib/dayjs'

export interface InviteCellProps {
  invite: Invite
}

export function InviteCell({ invite }: InviteCellProps) {
  const navigation = useNavigation()
  const { mutateAsync: acceptInvite, isPending: isAccepting } = useMutation({
    mutationFn: () => ApiClient.acceptInvite(invite.id),
    onError() {
      Alert.alert('Whops!', 'Não foi possível criar a viajem')
    },
    onSuccess() {
      navigation.reset({
        index: 0,
        routes: [
          {
            name: 'TripDetails',
            params: {
              tripId: invite.trip_id,
            },
          },
        ],
      })
    },
  })

  const { mutateAsync: rejectInvite, isPending: isRejecting } = useMutation({
    mutationFn: () => ApiClient.rejectInvite(invite.id),
    onError() {
      Alert.alert('Whops!', 'Não foi possível rejeitar a viajem')
    },
    onSuccess() {
      navigation.goBack()
    },
  })

  const tripDateInterval =
    dayjs(invite.trip.starts_at).date() +
    ' à ' +
    dayjs(invite.trip.ends_at).format('LL')

  return (
    <Card className="gap-4">
      <View>
        <View className="w-full py-2 flex-row items-center gap-3">
          <MapPin color={colors.zinc[400]} size={18} />

          <Text className="font-sans color-zinc-100">
            {invite.trip.destination}
          </Text>
        </View>

        <View className="w-full py-2 flex-row items-center gap-3">
          <Calendar color={colors.zinc[400]} size={18} />

          <Text className="font-sans color-zinc-100">{tripDateInterval}</Text>
        </View>
      </View>

      <Button onPress={() => acceptInvite()} loading={isAccepting}>
        Aceitar
      </Button>

      <Button
        variant="secondary"
        onPress={() => rejectInvite()}
        loading={isRejecting}
      >
        Rejeitar
      </Button>
    </Card>
  )
}
