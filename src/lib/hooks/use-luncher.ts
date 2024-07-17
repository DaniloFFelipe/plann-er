import * as SplashScreen from 'expo-splash-screen'
import { useEffect } from 'react'

import { useAuthStore } from '@/core/stores/auth.store'

import { useAppFonts } from '../fonts/use-app-fonts'
import { localStorage } from '../storage/mmkv'

SplashScreen.preventAutoHideAsync()

export function useAppLuncher() {
  const [loaded, error] = useAppFonts()
  const authenticate = useAuthStore((s) => s.authenticate)

  useEffect(() => {
    if (loaded || error) {
      const token = localStorage.getString('token')
      if (token) {
        authenticate({ token })
      }

      SplashScreen.hideAsync()
    }
  }, [loaded, error])

  if (!loaded && !error) {
    return false
  }

  return true
}
