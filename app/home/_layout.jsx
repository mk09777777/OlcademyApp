import { Text, Dimensions } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'
import { Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons'
import { useFonts } from 'expo-font'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function TabLayout() {
  const [fontsLoaded] = useFonts({
    'outfit': require('../../assets/fonts/Outfit-Regular.ttf'),
    'outfit-bold': require('../../assets/fonts/Outfit-Bold.ttf'),
  })

  if (!fontsLoaded) {
    return null 
  }
  const { width } = Dimensions.get('window');
  
  // Calculate responsive sizes based on screen width
  const tabBarHeight = width < 400 ? 70 : 80;
  const iconSize = width < 400 ? 25 : 27;
  const fontSize = 16;
  const tabBarPadding = width < 400 ? 4 : 6;

  return (
    // <SafeAreaView style={{ flex: 1 }} >
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          // marginBottom: width < 400 ? 10 : 15,
          paddingBottom: tabBarPadding,
          paddingTop: tabBarPadding,
          height: tabBarHeight,
        },
        // tabBarItemStyle: {
        //   paddingVertical: 4,
        // },
      }}
    >
      {/* TakeAway Tab */}
      <Tabs.Screen 
        name="TakeAway"
        options={{
          tabBarLabel: ({ focused }) => (
            <Text style={{ 
              fontFamily: focused ? 'outfit-bold' : 'outfit',
              fontWeight: '500',
              color: focused ? '#e23845' : 'gray',
              fontSize: fontSize,
              lineHeight: fontSize,
              marginTop: 2,
            }}>
              Take Away
            </Text>
          ),
          tabBarIcon: ({ focused }) => (
            <Ionicons 
              name="fast-food-sharp" 
              size={iconSize} 
              color={focused ? '#e23845' : 'grey'} 
            />
          ),
        }}
      />

      {/* Dining Tab */}
      <Tabs.Screen 
        name="Dining"
        options={{
          tabBarLabel: ({ focused }) => (
            <Text style={{ 
              fontFamily: focused ? 'outfit-bold' : 'outfit',
              fontWeight: '500',
              color: focused ? '#e23845' : 'gray',
              fontSize: fontSize,
              lineHeight: fontSize,
              marginTop: 2,
            }}>
              Dining
            </Text>
          ),
          tabBarIcon: ({ focused }) => (
            <MaterialIcons 
              name="restaurant-menu" 
              size={iconSize} 
              color={focused ? '#e23845' : 'grey'} 
            />
          ),
        }}
      />

      {/* Tiffin Tab */}
      <Tabs.Screen 
        name="Tiffin"
        options={{
          tabBarLabel: ({ focused }) => (
            <Text style={{ 
              fontFamily: focused ? 'outfit-bold' : 'outfit',
              fontWeight: '500',
              color: focused ? '#e23845' : 'gray',
              fontSize: fontSize,
              lineHeight: fontSize,
              marginTop: 2,
            }}>
              Tiffin
            </Text>
          ),
          tabBarIcon: ({ focused }) => (
            <MaterialCommunityIcons 
              name="food-takeout-box-outline" 
              size={iconSize} 
              color={focused ? '#e23845' : 'grey'} 
            />
          ),
        }}
      />

      {/* LiveShows Tab */}
      <Tabs.Screen 
        name="LiveShows"
        options={{
          tabBarLabel: ({ focused }) => (
            <Text style={{ 
              fontFamily: focused ? 'outfit-bold' : 'outfit',
              fontWeight: '500',
              color: focused ? '#e23845' : 'gray',
              fontSize: fontSize,
              lineHeight: fontSize,
              marginTop: 2,
            }}>
              Live Shows
            </Text>
          ),
          tabBarIcon: ({ focused }) => (
            <MaterialIcons 
              name="live-tv" 
              size={iconSize} 
              color={focused ? '#e23845' : 'grey'} 
            />
          ),
        }}
      />
    </Tabs>
    // </SafeAreaView>
  )
}