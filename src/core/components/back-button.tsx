import { useNavigation } from '@react-navigation/native'
import { ArrowLeft } from 'lucide-react-native'
import React from 'react'
import { Pressable } from 'react-native'
import colors from 'tailwindcss/colors'

export function BackButton() {
  const { goBack, canGoBack } = useNavigation()

  return (
    <Pressable
      onPress={() => {
        if (canGoBack()) {
          goBack()
        }
      }}
    >
      <ArrowLeft color={colors.zinc[200]} size={24} />
    </Pressable>
  )
}
