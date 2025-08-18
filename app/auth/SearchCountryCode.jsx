import { View, Text } from 'react-native'
import React from 'react'
import SelectCountryCode from '@/components/SelectCountryCode'

export default function SearchCountryCode() {
  return (
    <View
        style={{flex: 1}}
    >
      <SelectCountryCode/>
    </View>
  )
}