import './src/lib/styles/global.css'

import { BottomSheetModalProvider } from '@gorhom/bottom-sheet'
import { enableReactNativeComponents } from '@legendapp/state/config/enableReactNativeComponents'
import { StatusBar } from 'expo-status-bar'
import { GestureHandlerRootView } from 'react-native-gesture-handler'

import { RootNavigator } from '@/core/navigation/main.router'
import { useAppLuncher } from '@/lib/hooks/use-luncher'
import { QueryProvider } from '@/lib/query/provider'

enableReactNativeComponents()

export default function App() {
  const isFontsDone = useAppLuncher()

  if (!isFontsDone) return null

  return (
    <QueryProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <BottomSheetModalProvider>
          <StatusBar style="light" />
          <RootNavigator />
        </BottomSheetModalProvider>
      </GestureHandlerRootView>
    </QueryProvider>
  )
}
