import { StaticScreenProps, useNavigation } from '@react-navigation/native'
import { useQuery } from '@tanstack/react-query'
import {
  ArrowLeft,
  CalendarRange,
  Info,
  InfoIcon,
  LogOut,
  MapPin,
  Menu,
} from 'lucide-react-native'
import React, { useCallback, useMemo, useState } from 'react'
import { Alert, Pressable, Text, useWindowDimensions, View } from 'react-native'
import { Drawer } from 'react-native-drawer-layout'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import { SceneRendererProps, TabView } from 'react-native-tab-view'
import colors from 'tailwindcss/colors'

import { Button } from '@/core/components/button'
import { Card } from '@/core/components/card'
import { LoadingView } from '@/core/components/loading-view'
import { useAuthStore } from '@/core/stores/auth.store'
import { ApiClient } from '@/lib/api/client'
import { dayjs } from '@/lib/dayjs'

import { MyTripsScreen } from './my-trips.screen'
import { TripActivities } from './trip-activities.screen'
import { TripInfo } from './trip-info.screen'

export interface TripDetailsScreenProps
  extends StaticScreenProps<{
    tripId: string
  }> {}

export function TripDetailsScreen({
  route: { params },
}: TripDetailsScreenProps) {
  const logout = useAuthStore((as) => as.logout)
  const [isMyTripsOpen, setIsMyTripsOpen] = useState(false)
  const {
    data,
    isLoading,
    refetch: reloadActivities,
  } = useQuery({
    queryKey: ['trips', params.tripId],
    queryFn: async () => {
      const [trip, activities] = await Promise.all([
        ApiClient.getTrip(params.tripId),
        ApiClient.getTripActivities(params.tripId),
      ])

      return {
        trip,
        activities,
      }
    },
  })

  const { width } = useWindowDimensions()
  const { bottom } = useSafeAreaInsets()
  const [index, setIndex] = React.useState(0)
  const [routes] = React.useState([
    { key: 'activities', title: 'Atividades', Icon: CalendarRange },
    { key: 'info', title: 'Detalhes', Icon: Info },
  ])

  const navigation = useNavigation()

  const goToNewTrip = () => {
    navigation.reset({
      index: 0,
      routes: [
        {
          name: 'NewTrip',
        },
      ],
    })
  }

  const tripDateTimeFormatted = useMemo(() => {
    if (!data) return ''
    return (
      dayjs(data.trip.starts_at).date() +
      ' à ' +
      dayjs(data.trip.ends_at).format('D [de] MMM')
    )
  }, [])

  const renderScene = useCallback(
    ({
      route,
    }: SceneRendererProps & {
      route: {
        key: string
        title: string
      }
    }) => {
      if (!data) return <View className="flex-1 bg-zinc-950" />

      switch (route.key) {
        case 'activities':
          return (
            <TripActivities
              activities={data.activities}
              trip={data.trip}
              reloadActivities={reloadActivities}
            />
          )
        case 'info':
          return <TripInfo trip={data.trip} />
      }
    },
    [data],
  )

  const handleLogout = () => {
    Alert.alert('Sair', 'Deseja sair do app?', [
      {
        text: 'Cancelar',
        style: 'cancel',
      },
      {
        text: 'Sair',
        style: 'destructive',
        onPress: () => {
          logout()
        },
      },
    ])
  }

  return (
    <Drawer
      open={isMyTripsOpen}
      onOpen={() => setIsMyTripsOpen(true)}
      onClose={() => setIsMyTripsOpen(false)}
      drawerType="front"
      drawerStyle={{
        width: width * 0.9,
        backgroundColor: colors.zinc[950],
      }}
      renderDrawerContent={() => {
        return (
          <View className="flex-1 bg-zinc-950 border-r border-zinc-800">
            <SafeAreaView edges={['top']} />
            <View className="w-full flex-row items-center justify-between mb-4 px-4">
              <Pressable onPress={() => setIsMyTripsOpen(false)}>
                <ArrowLeft color={colors.zinc[200]} size={20} />
              </Pressable>

              <Text className="font-semi text-zinc-200">Minhas Viagens</Text>

              <Pressable onPress={handleLogout}>
                <LogOut color={colors.red[600]} size={20} />
              </Pressable>
            </View>

            <MyTripsScreen
              presentationType="drawer"
              onTripChange={() => setIsMyTripsOpen(false)}
            />

            <View className="w-full items-center justify-center px-4 mb-4">
              <Button onPress={goToNewTrip}>Nova viagem</Button>
              <SafeAreaView edges={['bottom']} />
            </View>
          </View>
        )
      }}
    >
      {!data || isLoading ? (
        <LoadingView />
      ) : (
        <View className="flex-1 bg-zinc-950">
          <View className="px-4">
            <SafeAreaView edges={['top']} />
            <Card className="flex-row items-center py-2 gap-4">
              <Pressable
                className="p-2 bg-zinc-800 rounded-md"
                onPress={() => setIsMyTripsOpen(true)}
              >
                <Menu color={colors.zinc[200]} size={21} />
              </Pressable>

              <View className="flex-row gap-2">
                <MapPin color={colors.zinc[200]} size={18} />
                <Text
                  className="font-sans text-zinc-200 max-w-[90%]"
                  numberOfLines={1}
                >
                  {data.trip.destination} - {tripDateTimeFormatted}
                </Text>
              </View>
            </Card>
          </View>

          <TabView
            navigationState={{ index, routes }}
            renderScene={renderScene}
            onIndexChange={setIndex}
            initialLayout={{ width }}
            tabBarPosition="bottom"
            swipeEnabled={false}
            animationEnabled={false}
            sceneContainerStyle={{
              backgroundColor: 'transparent',
            }}
            renderTabBar={({ navigationState: { routes, index }, jumpTo }) => {
              return (
                <View
                  className="w-full px-4 bg-transparent"
                  style={{ paddingBottom: bottom + 16 }}
                >
                  <Card className="w-full flex-row items-center justify-between p-3">
                    {routes.map(({ Icon, key, title }, routeIdx) => (
                      <Button
                        key={key}
                        className="w-[48%]"
                        variant={index === routeIdx ? 'primary' : 'secondary'}
                        Left={
                          <Icon
                            color={
                              index === routeIdx
                                ? colors.lime[950]
                                : colors.zinc[200]
                            }
                          />
                        }
                        onPress={() => jumpTo(key)}
                      >
                        {title}
                      </Button>
                    ))}
                  </Card>
                </View>
              )
            }}
          />
        </View>
      )}
    </Drawer>
  )
}
