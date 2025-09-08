import { View, Text, ImageBackground, ScrollView, TouchableOpacity, Linking } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useGlobalSearchParams, useRouter } from 'expo-router'
import { FontAwesome5, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { useSafeNavigation } from '@/hooks/navigationPage'
export default function EventDetails() {
  const router = useRouter()
  const { event } = useGlobalSearchParams()
  const [expanded, setExpanded] = useState(false)
  const [eventDetails, setEventDetails] = useState([])
  const { safeNavigation } = useSafeNavigation();
  useState(() => {
    setEventDetails(JSON.parse(event))
  },[])
  return (
    <ScrollView className="flex-1 bg-background">
      <ImageBackground 
        source={eventDetails.image}
        className="h-80 justify-end"
      >
        <LinearGradient
          colors={['transparent', 'rgba(0, 0, 0, 0.8)']}
          className="absolute inset-0"
          start={{ x: 0.5, y: 0.5 }}
          end={{ x: 0.5, y: 1 }}
        />
        <View className="p-4 pb-6">
          <Text className="text-white text-2xl font-outfit-bold mb-2">
            {eventDetails.title}
          </Text>
          <Text className="text-white text-base font-outfit">
            Sat, Feb 8 | 6PM onwards
          </Text>
        </View>
      </ImageBackground>
      <View className="flex-row items-center justify-between p-4 bg-white border-b border-border">
        <Text className="text-primary text-xl font-outfit-bold">
          ₹ 799 onwards
        </Text>
        <TouchableOpacity
          className="bg-primary px-6 py-3 rounded-lg"
          onPress={() => {safeNavigation('screens/EventBooking')}}
        >
          <Text className="text-white font-outfit-bold">
            Book
          </Text>
        </TouchableOpacity>
      </View>
      <View className="flex-row items-center p-4 bg-white border-b border-border">
        <Ionicons 
          name='location-outline' 
          size={25} 
          color='#FF002E'
        />
        <Text className="flex-1 ml-3 text-textprimary font-outfit"> 
          Rogers Center
        </Text>
        <TouchableOpacity
          className="p-2"
          onPress={() => {
            Linking.openURL('https://www.google.com/maps/search/?api=1&query=Rogers Centre')
          }}
        >
        <FontAwesome5 name='directions' size={24} color='#FF002E'/>
        </TouchableOpacity>
      </View>
      <Text
        className="text-textprimary text-base font-outfit p-4 leading-6"
        numberOfLines={expanded ? undefined : 4}
      >
        {eventDetails.description}
      </Text>
      {eventDetails?.description?.split(" ").length > 20 && ( // Show "Read More" only if text is long
        <TouchableOpacity onPress={() => setExpanded(!expanded)} className="px-4 pb-4">
          <Text className="text-primary font-outfit">
            {expanded ? 'Show Less' : 'Read More'}
          </Text>
        </TouchableOpacity>
      )}
      <View className="flex-row items-center p-4 bg-white border-b border-border">
        <MaterialCommunityIcons 
          name='clock-outline' 
          size={30}
          color='#FF002E'
        />
        <View className="ml-4">
          <Text className="text-textsecondary text-sm font-outfit">
            Gates Open
          </Text>
          <Text className="text-textprimary text-base font-outfit-bold">
            1 hr Before
          </Text>
        </View>
      </View>
      <View className="flex-row items-center p-4 bg-white border-b border-border">
        <Ionicons 
          name='language' 
          size={30}
          color='#FF002E'
        />
        <View className="ml-4">
          <Text className="text-textsecondary text-sm font-outfit">
            Language
          </Text>
          <Text className="text-textprimary text-base font-outfit-bold">
            English, Canadian
          </Text>
        </View>
      </View>
      <View className="flex-row items-center p-4 bg-white border-b border-border">
        <MaterialCommunityIcons 
          name='clock-outline' 
          size={30}
          color='#FF002E'
        />
        <View className="ml-4">
          <Text className="text-textsecondary text-sm font-outfit">
            Duration
          </Text>
          <Text className="text-textprimary text-base font-outfit-bold">
            5 Hours
          </Text>
        </View>
      </View>
      <View className="flex-row items-center p-4 bg-white border-b border-border">
        <Ionicons 
          name='information-circle-outline' 
          size={30}
          color='#FF002E'
        />
        <View className="ml-4">
          <Text className="text-textsecondary text-sm font-outfit">
            Best suited for ages
          </Text>
          <Text className="text-textprimary text-base font-outfit-bold">
            6 years & above
          </Text>
        </View>
      </View>
      <View className="flex-row items-center p-4 bg-white border-b border-border">
        <Ionicons 
          name='information-circle-outline'  
          size={30}
          color='#FF002E'
        />
        <View className="ml-4">
          <Text className="text-textsecondary text-sm font-outfit">
            Layout
          </Text>
          <Text className="text-textprimary text-base font-outfit-bold">
            Outdoor
          </Text>
        </View>
      </View>
      <View className="flex-row items-center p-4 bg-white border-b border-border">
        <MaterialCommunityIcons 
          name='seat' 
          size={30}
          color='#FF002E'
        />
        <View className="ml-4">
          <Text className="text-textsecondary text-sm font-outfit">
            Seating Arrangement
          </Text>
          <Text className="text-textprimary text-base font-outfit-bold">
            Seating and Standing
          </Text>
        </View>
      </View>
      <View className="flex-row items-center p-4 bg-white border-b border-border">
        <Ionicons 
          name='information-circle-outline' 
          size={30}
          color='#FF002E'
        />
        <View className="ml-4">
          <Text className="text-textsecondary text-sm font-outfit">
            Kids Friendly?
          </Text>
          <Text className="text-textprimary text-base font-outfit-bold">
            No
          </Text>
        </View>
      </View>
      <View className="flex-row items-center p-4 bg-white border-b border-border">
        <Ionicons 
          name='information-circle-outline' 
          size={30}
          color='#FF002E'
        />
        <View className="ml-4">
          <Text className="text-textsecondary text-sm font-outfit">
            Pet Friendly?
          </Text>
          <Text className="text-textprimary text-base font-outfit-bold">
            No
          </Text>
        </View>
      </View>
      <Text className="text-textprimary text-lg font-outfit-bold p-4">
        Artists
      </Text>
      <View className="p-4">

      </View>
    </ScrollView>
  )
}