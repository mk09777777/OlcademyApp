import { View, Text, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { styles } from '@/styles/ReviewCardStyles'
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'

export default function ReviewCard({ firmName, name, date, rating, review, details, followers}) {
  const router = useRouter()
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <MaterialCommunityIcons name='account' size={30} color='#e23845'/>
        <View style={styles.userInfo}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.date}>{date}</Text>
        </View>
        <View style={styles.ratingContainer}>
          <Text style={styles.ratingText}>{rating}</Text>
          <Ionicons name="star" size={16} color="white" />
        </View>
      </View>

      <Text style={styles.reviewText}>
        {`${review.substring(0, 120)}...`}
        {review.length > 120 && (
          <TouchableOpacity onPress={() => router.navigate({
            pathname: 'screens/ReviewDetails',
            params: {
              firmName: firmName, 
              name: name, 
              rating: rating, 
              review: review, 
              details: details,
              date: date, 
              followers: followers
            }
            })}>
            <Text style={styles.readMore}> more</Text>
          </TouchableOpacity>
        )}
      </Text>
    </View>
  )
}