import { View, Text, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'

export default function ReviewCard({ firmName, name, date, rating, review, details, followers}) {
  const router = useRouter()
  return (
    <View className="bg-white rounded-lg p-4 mx-2 w-72 shadow-md border border-gray-200">
      <View className="flex-row items-center mb-3">
        <MaterialCommunityIcons name='account' size={30} color='#02757A'/>
        <View className="flex-1 ml-3">
          <Text className="font-outfit-bold text-base text-textprimary">{name}</Text>
          <Text className="font-outfit text-sm text-textsecondary">{date}</Text>
        </View>
        <View className="bg-green-600 rounded-lg px-2 py-1 flex-row items-center">
          <Text className="text-white font-outfit-bold text-sm mr-1">{rating}</Text>
          <Ionicons name="star" size={16} color="white" />
        </View>
      </View>

      <Text className="font-outfit text-sm text-textprimary leading-5">
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
            <Text className="text-primary font-outfit-bold"> more</Text>
          </TouchableOpacity>
        )}
      </Text>
    </View>
  )
}