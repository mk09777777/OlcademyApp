import { View, Text } from 'react-native'
import React from 'react'
import { useGlobalSearchParams } from 'expo-router'
import { styles } from '@/styles/OffersCardStyles'

export default function OffersCard({ offerTitle, offerValidity }) {
  return (
    <View style={styles.card}>
      <Text style={styles.offerTitle}>{offerTitle}</Text>
      <Text style={styles.offerValidity}>{offerValidity}</Text>
    </View>
  )
}