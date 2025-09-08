import { View, Text } from 'react-native'
import React from 'react'
import { LinearGradient } from 'expo-linear-gradient'
import { useGlobalSearchParams } from 'expo-router'

export default function OffersCard({ offerTitle, offerValidity }) {
  return (
    <LinearGradient
      colors={[
        "#7300E1", // top
        "#5600A9",
        "#5600A9", // bottom
      ]}
      start={{ x: 1, y: 0 }}
      end={{ x: 0, y: 1 }}
      className="w-48 p-4 mx-2 rounded-lg"
    >
      <Text className="text-white font-outfit-bold text-base mb-2">{offerTitle}</Text>
      <Text className="text-white font-outfit text-sm">{offerValidity}</Text>
    </LinearGradient>
  )
}
//