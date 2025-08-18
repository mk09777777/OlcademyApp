import { View, Text, ImageBackground, ScrollView, TouchableOpacity, Linking } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useGlobalSearchParams, useRouter } from 'expo-router'
import { styles } from '@/styles/EventDetailsStyles'
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
    <ScrollView
      style={styles.container}
    >
      <ImageBackground 
        source={eventDetails.image}
        style={styles.imageContainer}
        imageStyle={styles.primaryImage}
      >
        <LinearGradient
          colors={['transparent', 'rgba(0, 0, 0, 0.8)']}
          style={styles.gradientOverlay}
          start={{ x: 0.5, y: 0.5 }}
          end={{ x: 0.5, y: 1 }}
        />
        <View
          style={styles.bottomDisplay}
        >
          <Text
            style={styles.titleText}
          >
            {eventDetails.title}
          </Text>
          <Text
            style={styles.eventTime}
          >
            Sat, Feb 8 | 6PM onwards
          </Text>
        </View>
      </ImageBackground>
      <View
        style={styles.bookingCard}
      >
        <Text
          style={styles.price}
        >
          ₹ 799 onwards
        </Text>
        <TouchableOpacity
          style={styles.bookingButton}
          onPress={() => {safeNavigation('screens/EventBooking')}}
        >
          <Text
            style={styles.bookingButtonText}
          >
            Book
          </Text>
        </TouchableOpacity>
      </View>
      <View
        style={styles.locationCard}
      >
        <Ionicons 
          name='location-outline' 
          size={25} 
          style={styles.locationIcon}
        />
        <Text
          style={styles.locatioText}
        > 
          Rogers Center
        </Text>
        <TouchableOpacity
          style={styles.locationButton}
          onPress={() => {
            Linking.openURL('https://www.google.com/maps/search/?api=1&query=Rogers Centre')
          }}
        >
        <FontAwesome5 name='directions' size={24} color='#e23845'/>
        </TouchableOpacity>
      </View>
      <Text
        style={styles.descriptionText}
        numberOfLines={expanded ? undefined : 4}
      >
        {eventDetails.description}
      </Text>
      {eventDetails?.description?.split(" ").length > 20 && ( // Show "Read More" only if text is long
        <TouchableOpacity onPress={() => setExpanded(!expanded)}>
          <Text style={styles.readMore}>
            {expanded ? 'Show Less' : 'Read More'}
          </Text>
        </TouchableOpacity>
      )}
      <View
        style={styles.propertyCard}
      >
        <MaterialCommunityIcons 
          name='clock-outline' 
          size={30}
          style={styles.propertyIcon}
        />
        <View>
          <Text
            style={styles.propertyType}
          >
            Gates Open
          </Text>
          <Text
            style={styles.propertyValue}
          >
            1 hr Before
          </Text>
        </View>
      </View>
      <View
        style={styles.propertyCard}
      >
        <Ionicons 
          name='language' 
          size={30}
          style={styles.propertyIcon}
        />
        <View>
          <Text
            style={styles.propertyType}
          >
            Language
          </Text>
          <Text
            style={styles.propertyValue}
          >
            English, Canadian
          </Text>
        </View>
      </View>
      <View
        style={styles.propertyCard}
      >
        <MaterialCommunityIcons 
          name='clock-outline' 
          size={30}
          style={styles.propertyIcon}
        />
        <View>
          <Text
            style={styles.propertyType}
          >
            Duration
          </Text>
          <Text
            style={styles.propertyValue}
          >
            5 Hours
          </Text>
        </View>
      </View>
      <View
        style={styles.propertyCard}
      >
        <Ionicons 
          name='information-circle-outline' 
          size={30}
          style={styles.propertyIcon}
        />
        <View>
          <Text
            style={styles.propertyType}
          >
            Best suited for ages
          </Text>
          <Text
            style={styles.propertyValue}
          >
            6 years & above
          </Text>
        </View>
      </View>
      <View
        style={styles.propertyCard}
      >
        <Ionicons 
          name='information-circle-outline'  
          size={30}
          style={styles.propertyIcon}
        />
        <View>
          <Text
            style={styles.propertyType}
          >
            Layout
          </Text>
          <Text
            style={styles.propertyValue}
          >
            Outdoor
          </Text>
        </View>
      </View>
      <View
        style={styles.propertyCard}
      >
        <MaterialCommunityIcons 
          name='seat' 
          size={30}
          style={styles.propertyIcon}
        />
        <View>
          <Text
            style={styles.propertyType}
          >
            Seating Arrangement
          </Text>
          <Text
            style={styles.propertyValue}
          >
            Seating and Standing
          </Text>
        </View>
      </View>
      <View
        style={styles.propertyCard}
      >
        <Ionicons 
          name='information-circle-outline' 
          size={30}
          style={styles.propertyIcon}
        />
        <View>
          <Text
            style={styles.propertyType}
          >
            Kids Friendly?
          </Text>
          <Text
            style={styles.propertyValue}
          >
            No
          </Text>
        </View>
      </View>
      <View
        style={styles.propertyCard}
      >
        <Ionicons 
          name='information-circle-outline' 
          size={30}
          style={styles.propertyIcon}
        />
        <View>
          <Text
            style={styles.propertyType}
          >
            Pet Friendly?
          </Text>
          <Text
            style={styles.propertyValue}
          >
            No
          </Text>
        </View>
      </View>
      <Text
        style={styles.subHeading}
      >
        Artists
      </Text>
      <View
        style={styles.artistView}
      >

      </View>
    </ScrollView>
  )
}