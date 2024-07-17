/* eslint-disable @typescript-eslint/no-namespace */
import {
  createStaticNavigation,
  StaticParamList,
} from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import { CodeScreen } from '@/core/features/login/code.screen'
import { LoginScreen } from '@/core/features/login/login.screen'
import { UpdateNameScreen } from '@/core/features/login/update-name.screen'

export type AuthStackProps = {
  Login: undefined
  Code: {
    token: string
  }
  UpdateName: undefined
}

export const AuthStack = createNativeStackNavigator({
  screenOptions: {
    headerShown: false,
  },
  screens: {
    Login: LoginScreen,
    Code: {
      screen: CodeScreen,
      initialParams: {
        token: '',
      },
    },
    UpdateName: UpdateNameScreen,
  },
})

export const AuthNavigator = createStaticNavigation(AuthStack)

export type AuthStackParamList = AuthStackProps

declare global {
  namespace ReactNavigation {
    interface RootParamList extends AuthStackParamList {}
  }
}
