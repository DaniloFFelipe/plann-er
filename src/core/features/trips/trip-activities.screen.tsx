import {
  BottomSheetBackdrop,
  BottomSheetModal as BottomSheet,
  BottomSheetView,
} from '@gorhom/bottom-sheet'
import clsx from 'clsx'
import dayjs from 'dayjs'
import { CircleCheck, CircleDashed, Plus } from 'lucide-react-native'
import { useCallback, useMemo, useRef } from 'react'
import { SectionList, Text, View } from 'react-native'
import colors from 'tailwindcss/colors'

import { Button } from '@/core/components/button'
import { Card } from '@/core/components/card'
import { ActivitySection } from '@/core/models/activity.model'
import { Trip } from '@/core/models/trip.model'

import { CreateActivityScreen } from './create-activity.screen'

export interface TripActivitiesProps {
  trip: Trip
  activities: ActivitySection[]
  reloadActivities: () => void
}

export function TripActivities({
  trip,
  activities,
  reloadActivities,
}: TripActivitiesProps) {
  const bottomSheetRef = useRef<BottomSheet>(null)
  const snapPoints = useMemo(() => ['40%'], [])

  const handleOpenInvitesSheet = () => {
    bottomSheetRef.current?.present()
  }

  const handleCloseInvitesSheet = () => {
    bottomSheetRef.current?.close()
  }

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
    <View className="flex-1 bg-zinc-950">
      <View className="w-full flex-row p-4 items-center justify-between">
        <Text className="font-semi text-zinc-50 text-2xl">Atividades</Text>

        <Button
          className="w-auto px-4 gap-2"
          Right={<Plus color={colors.lime[950]} size={18} />}
          onPress={handleOpenInvitesSheet}
        >
          Nova Atividade
        </Button>
      </View>

      <SectionList
        sections={activities.map((i) => ({
          title: i.date,
          data: i.activities,
          empty: i.activities.length === 0,
        }))}
        contentContainerStyle={{ paddingHorizontal: 16 }}
        keyExtractor={(d) => d.id}
        SectionSeparatorComponent={() => <View className="h-4" />}
        ItemSeparatorComponent={() => <View className="h-4" />}
        renderSectionHeader={({ section: { title } }) => (
          <View className="bg-zinc-950">
            <Text
              className={clsx('font-semi text-zinc-50 text-xl', {
                'text-zinc-500': dayjs(title).isBefore(new Date()),
              })}
            >
              {`Dia ${dayjs(title).date()}`}
              <Text className="font-sans text-zinc-500 text-sm">{`  ${dayjs(title).format('dddd')}`}</Text>
            </Text>
          </View>
        )}
        renderSectionFooter={({ section: { empty } }) => {
          if (!empty) return null

          return (
            <Text className="font-sans text-zinc-500 text-sm mt-2 mb-4">
              Nenhuma atividade cadastrada nessa data.
            </Text>
          )
        }}
        renderItem={({ item }) => {
          const occursAt = dayjs(item.occurs_at)
          const isOnDayBeforeDate = occursAt.isBefore(new Date(), 'date')
          const isOnDayBeforeNow = occursAt.isBefore(new Date(), 'date')

          return (
            <Card
              className={clsx('flex-row items-center gap-4', {
                'opacity-25': isOnDayBeforeDate,
              })}
            >
              {isOnDayBeforeNow ? (
                <CircleCheck color={colors.lime[300]} size={18} />
              ) : (
                <CircleDashed color={colors.zinc[400]} size={18} />
              )}
              <Text className="font-sans text-zinc-100 text-md">
                {item.title}
              </Text>
              <Text className="font-sans text-zinc-100 text-md ml-auto">
                {occursAt.format('LT[h]')}
              </Text>
            </Card>
          )
        }}
      />

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
          <CreateActivityScreen
            tripId={trip.id}
            startDate={trip.starts_at}
            endDate={trip.ends_at}
            onActivityCreate={() => {
              reloadActivities()
            }}
            onClose={handleCloseInvitesSheet}
          />
        </BottomSheetView>
      </BottomSheet>
    </View>
  )
}
