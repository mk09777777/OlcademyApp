import { View, Text } from 'react-native'
import React from 'react'
import { LinearGradient } from 'expo-linear-gradient'
import { useGlobalSearchParams } from 'expo-router'
import { styles } from '@/styles/OffersCardStyles'

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
      style={styles.card}
    >
      <Text style={styles.offerTitle}>{offerTitle}</Text>
      <Text style={styles.offerValidity}>{offerValidity}</Text>
    </LinearGradient>
  )
}
//