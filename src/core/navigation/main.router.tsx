import { createStaticNavigation } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import { useAuthStore } from '../stores/auth.store'
import { AppStack } from './stacks/app.stack'
import { AuthStack } from './stacks/auth.stack'

function useIsSignedIn() {
  const session = useAuthStore((s) => s.session)
  return session !== null
}

function useIsSignedOut() {
  const session = useAuthStore((s) => s.session)
  return session === null
}

export const Root = createNativeStackNavigator({
  screens: {
    LoggedIn: {
      if: useIsSignedIn,
      screen: AppStack,
      options: {
        headerShown: false,
      },
    },
    LoggedOut: {
      if: useIsSignedOut,
      screen: AuthStack,
      options: {
        headerShown: false,
      },
    },
  },
})

export const RootNavigator = createStaticNavigation(Root)
