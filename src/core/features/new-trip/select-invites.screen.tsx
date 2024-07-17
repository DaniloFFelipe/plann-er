import {
  BottomSheetBackdrop,
  BottomSheetModal as BottomSheet,
  BottomSheetView,
} from '@gorhom/bottom-sheet'
import { StaticScreenProps, useNavigation } from '@react-navigation/native'
import { useMutation } from '@tanstack/react-query'
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  MapPin,
  Settings2,
  UserPlus2,
} from 'lucide-react-native'
import React, { useCallback, useMemo, useRef, useState } from 'react'
import {
  Alert,
  ImageBackground,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import colors from 'tailwindcss/colors'

import bgMask from '@/assets/bg.png'
import LogoSvg from '@/assets/logo.svg'
import { Button } from '@/core/components/button'
import { Card } from '@/core/components/card'
import type { AppStackProps } from '@/core/navigation/stacks/app.stack'
import { ApiClient } from '@/lib/api/client'
import { dayjs } from '@/lib/dayjs'

import { AddInvites } from './components/add-invites'
export type SelectInvitesScreenProps = StaticScreenProps<
  AppStackProps['SelectInvites']
>

export function SelectInvitesScreen({ route }: SelectInvitesScreenProps) {
  const { destination, endDate, startDate } = route.params
  const tripDateInterval =
    dayjs(startDate).date() + ' à ' + dayjs(endDate).format('LL')
  const navigation = useNavigation()

  const { mutateAsync: createTrips, isPending } = useMutation({
    mutationFn: ApiClient.createTrips,
    onError() {
      Alert.alert('Whops!', 'Não foi possível criar a viajem')
    },
    onSuccess({ tripId }) {
      navigation.reset({
        index: 0,
        routes: [
          {
            name: 'TripDetails',
            params: {
              tripId,
            },
          },
        ],
      })
    },
  })

  const [invitesEmails, setInvitesEmails] = useState<string[]>([])

  const bottomSheetRef = useRef<BottomSheet>(null)
  const { top } = useSafeAreaInsets()
  const snapPoints = useMemo(() => ['65%'], [])

  const handleOpenInvitesSheet = () => {
    bottomSheetRef.current?.present()
  }

  const handleCloseInvitesSheet = () => {
    bottomSheetRef.current?.close()
  }

  const handleCreateTrips = async () => {
    await createTrips({
      destination,
      starts_at: dayjs(startDate).startOf('day').toDate(),
      ends_at: dayjs(endDate).startOf('day').toDate(),
      emails_to_invite: invitesEmails,
    })
  }

  const onInviteAdd = useCallback(
    (email: string) => {
      if (!invitesEmails.includes(email)) {
        setInvitesEmails((state) => [...state, email])
      }
    },
    [invitesEmails],
  )

  const onInviteRemove = useCallback((email: string) => {
    setInvitesEmails((state) => state.filter((e) => e !== email))
  }, [])

  const renderBackdrop = useCallback(
    (props: React.ComponentProps<typeof BottomSheetBackdrop>) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        onPress={handleCloseInvitesSheet}
      />
    ),
    [],
  )

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View className="flex-1 items-center justify-center bg-zinc-950">
        <Pressable
          className="absolute left-4"
          style={{ top: top + 16 }}
          onPress={navigation.goBack}
        >
          <ArrowLeft color={colors.zinc[200]} size={24} />
        </Pressable>
        <LogoSvg />
        <ImageBackground source={bgMask} className="w-full px-4 mt-2 gap-8">
          <View>
            <Text className="text-zinc-400 font-sans text-lg mr-4 px-6 text-center">
              Convide seus amigos e planeje sua próxima viagem!
            </Text>
          </View>

          <Card className="gap-4">
            <View className="w-full py-2 flex-row items-center gap-3">
              <MapPin color={colors.zinc[400]} size={18} />

              <Text className="font-sans color-zinc-100">{destination}</Text>
            </View>

            <View className="w-full py-2 flex-row items-center gap-3">
              <Calendar color={colors.zinc[400]} size={18} />

              <Text className="font-sans color-zinc-100">
                {tripDateInterval}
              </Text>
            </View>

            <Button
              onPress={navigation.goBack}
              variant="secondary"
              Right={<Settings2 color={colors.zinc[200]} size={18} />}
            >
              Alterar local/data
            </Button>

            <View className="h-px w-full bg-zinc-800" />

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleOpenInvitesSheet}
            >
              <View className="w-full py-3 flex-row items-center gap-3">
                <UserPlus2 color={colors.zinc[400]} size={18} />
                <Text className="font-sans color-zinc-100">
                  {invitesEmails.length <= 0
                    ? 'Quem estará na viagem?'
                    : `${invitesEmails.length} pessoa(s) convidada(s)`}
                </Text>
              </View>
            </TouchableOpacity>

            <Button
              onPress={handleCreateTrips}
              loading={isPending}
              Right={<ArrowRight color={colors.lime[950]} size={18} />}
            >
              Confirmar viagem
            </Button>
          </Card>
        </ImageBackground>

        <BottomSheet
          ref={bottomSheetRef}
          index={0}
          snapPoints={snapPoints}
          backdropComponent={renderBackdrop}
          enablePanDownToClose
          style={{ borderRadius: 0 }}
          containerStyle={{ borderRadius: 0 }}
          backgroundStyle={{
            borderRadius: 0,
            backgroundColor: colors.zinc[900],
          }}
          handleComponent={() => null}
        >
          <BottomSheetView style={{ flex: 1 }}>
            <AddInvites
              invites={invitesEmails}
              onChange={onInviteAdd}
              onClose={handleCloseInvitesSheet}
              onRemove={onInviteRemove}
            />
          </BottomSheetView>
        </BottomSheet>
      </View>
    </GestureHandlerRootView>
  )
}
