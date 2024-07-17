/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  BottomSheetBackdrop,
  BottomSheetModal as BottomSheet,
  BottomSheetView,
} from '@gorhom/bottom-sheet'
import { useQuery } from '@tanstack/react-query'
import * as Burnt from 'burnt'
import * as Clipboard from 'expo-clipboard'
import {
  CircleCheck,
  CircleDashed,
  Link2,
  Plus,
  UserCog,
} from 'lucide-react-native'
import { useCallback, useMemo, useRef } from 'react'
import {
  Pressable,
  SectionList,
  Text,
  useWindowDimensions,
  View,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import colors from 'tailwindcss/colors'

import { Button } from '@/core/components/button'
import { LoadingView } from '@/core/components/loading-view'
import { Link } from '@/core/models/links.model'
import { Member } from '@/core/models/member.model'
import { Trip } from '@/core/models/trip.model'
import { ApiClient } from '@/lib/api/client'

import { AddInviteScreen } from './add-invite.screen'
import { CreateLinkScreen } from './create-link.screen'

export interface TripInfoProps {
  trip: Trip
}

type SectionType = { id: string }

export function TripInfo({ trip }: TripInfoProps) {
  const { height } = useWindowDimensions()
  const { bottom } = useSafeAreaInsets()
  const linkSheetRef = useRef<BottomSheet>(null)
  const inviteSheetRef = useRef<BottomSheet>(null)
  const snapPoints = useMemo(() => [height * 0.35 + bottom], [])
  const inviteSnapPoints = useMemo(() => [height * 0.28 + bottom], [])

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['trip', trip.id, 'info'],
    queryFn: () => ApiClient.getTripInfo(trip.id),
  })

  const handleOpenLinkSheet = () => {
    linkSheetRef.current?.present()
  }

  const handleCloseLinkSheet = () => {
    linkSheetRef.current?.close()
  }

  const handleOpenInviteSheet = () => {
    inviteSheetRef.current?.present()
  }

  const handleCloseInviteSheet = () => {
    inviteSheetRef.current?.close()
  }

  const handleAddLinkToClipboard = async (url: string) => {
    await Clipboard.setStringAsync(url)
    Burnt.toast({
      title: 'Link copiado',
      preset: 'done',
      message: 'O link foi copiado para o seu clipboard',
    })
  }

  const renderBackdrop = useCallback(
    (props: React.ComponentProps<typeof BottomSheetBackdrop>) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        onPress={handleCloseLinkSheet}
      />
    ),
    [],
  )

  if (isLoading || !data) {
    return <LoadingView />
  }

  return (
    <View className="flex-1 bg-zinc-950 px-4">
      <SectionList<SectionType>
        sections={[
          { title: 'Links importantes', type: 'links', data: data.links },
          { title: 'Convidados', type: 'members', data: data.members },
        ]}
        keyExtractor={(d) => d.id}
        renderSectionHeader={({ section: { title } }) => (
          <View className="w-full px-4 py-4 bg-zinc-950">
            <Text className="font-semi text-zinc-50 text-2xl">{title}</Text>
          </View>
        )}
        renderItem={({ section, item }) => {
          if (section.type === 'links') {
            const link = item as Link
            return (
              <Pressable
                onPress={() => handleAddLinkToClipboard(link.url)}
                className="w-full px-4 py-4 bg-zinc-950 flex-row items-center justify-between"
              >
                <View className="w-[95%]">
                  <Text
                    className="font-semi text-zinc-50 text-md max-w-[85%]"
                    numberOfLines={1}
                  >
                    {link.title}
                  </Text>
                  <Text
                    className="font-sans text-zinc-400 text-sm max-w-[85%]"
                    numberOfLines={1}
                  >
                    {link.url}
                  </Text>
                </View>

                <Link2 color={colors.zinc[400]} size={20} />
              </Pressable>
            )
          }

          if (section.type === 'members') {
            const member = item as Member
            return (
              <View className="w-full px-4 py-4 bg-zinc-950 flex-row items-center justify-between">
                <View className="w-[95%]">
                  <Text
                    className="font-semi text-zinc-50 text-md max-w-[85%]"
                    numberOfLines={1}
                  >
                    {member.name ?? ' - '}
                  </Text>
                  <Text
                    className="font-sans text-zinc-400 text-sm max-w-[85%]"
                    numberOfLines={1}
                  >
                    {member.email}
                  </Text>
                </View>

                {member.isConfirmed ? (
                  <CircleCheck color={colors.lime[300]} size={18} />
                ) : (
                  <CircleDashed color={colors.zinc[400]} size={18} />
                )}
              </View>
            )
          }

          return null
        }}
        renderSectionFooter={({ section }) => {
          if (section.type === 'links') {
            return (
              <View className="w-full px-4 pt-4 pb-8 bg-zinc-950 items-center border-b border-zinc-800 gap-4">
                {section.data.length <= 0 && (
                  <Text className="font-sans text-zinc-400 text-md">
                    Nenhum link cadastrado
                  </Text>
                )}

                <Button
                  variant="secondary"
                  Left={<Plus color={colors.zinc[200]} size={20} />}
                  onPress={handleOpenLinkSheet}
                >
                  Cadastrar novo link
                </Button>
              </View>
            )
          }

          if (section.type === 'members') {
            return (
              <View className="w-full px-4 pt-4 pb-8 bg-zinc-950 items-center">
                {section.data.length <= 0 && (
                  <Text className="font-sans text-zinc-400 text-md">
                    Nenhum conivdado cadastrado
                  </Text>
                )}

                <Button
                  onPress={handleOpenInviteSheet}
                  variant="secondary"
                  Left={<UserCog color={colors.zinc[200]} size={20} />}
                >
                  Gerenciar convidados
                </Button>
              </View>
            )
          }

          return null
        }}
      />

      <BottomSheet
        ref={linkSheetRef}
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
          <CreateLinkScreen
            tripId={trip.id}
            onClose={handleCloseLinkSheet}
            onCreate={refetch}
          />
        </BottomSheetView>
      </BottomSheet>

      <BottomSheet
        ref={inviteSheetRef}
        index={0}
        snapPoints={inviteSnapPoints}
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
          <AddInviteScreen
            tripId={trip.id}
            onClose={handleCloseInviteSheet}
            onCreate={refetch}
          />
        </BottomSheetView>
      </BottomSheet>
    </View>
  )
}
