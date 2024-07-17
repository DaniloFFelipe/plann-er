/* eslint-disable @typescript-eslint/no-namespace */
import { createStaticNavigation } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { View } from 'react-native'
import colors from 'tailwindcss/colors'

import { BackButton } from '@/core/components/back-button'
import { NewTripScreen } from '@/core/features/new-trip/new-trip.screen'
import { SelectInvitesScreen } from '@/core/features/new-trip/select-invites.screen'
import { MyInvitesScreen } from '@/core/features/trips/my-invites.screen'
import { MyTripsScreen } from '@/core/features/trips/my-trips.screen'
import { TripDetailsScreen } from '@/core/features/trips/trip-details.screen'

export type AppStackProps = {
  NewTrip: undefined
  MyTrips: undefined
  TripDetails: {
    tripId: string
  }
  SelectInvites: {
    destination: string
    startDate: string
    endDate: string
  }
  MyInvites: undefined
}

export const AppStack = createNativeStackNavigator({
  screenOptions: {
    headerShown: false,
    headerTitleStyle: {
      fontFamily: 'semi',
      color: colors.zinc[200],
    },
    headerBackground: () => <View className="flex-1 bg-zinc-950" />,
    headerLeft() {
      return <BackButton />
    },
  },
  screens: {
    NewTrip: NewTripScreen,
    SelectInvites: SelectInvitesScreen,
    TripDetails: TripDetailsScreen,
    MyTrips: {
      screen: MyTripsScreen,
      options: {
        title: 'Minhas viagens',
        headerShown: true,
      },
    },
    MyInvites: {
      screen: MyInvitesScreen,
      options: {
        title: 'Meus convites',
        headerShown: true,
      },
    },
  },
})

export const AppNavigator = createStaticNavigation(AppStack)

export type AppStackParamList = AppStackProps

declare global {
  namespace ReactNavigation {
    interface RootParamList extends AppStackParamList {}
  }
}
