import { useFonts } from 'expo-font'

import { fonts } from './fonts'

export function useAppFonts() {
  return useFonts(fonts)
}
