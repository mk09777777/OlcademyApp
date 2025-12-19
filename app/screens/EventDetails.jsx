import { View, Text, ImageBackground, ScrollView, TouchableOpacity, Linking, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useGlobalSearchParams } from 'expo-router'
import { FontAwesome5, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { useSafeNavigation } from '@/hooks/navigationPage'
import { fetchEventById } from '@/services/eventService';
import { normalizeImageSource, transformEventPayload } from '@/utils/eventUtils';

const placeholderImage = require('@/assets/images/placeholder.png');
export default function EventDetails() {
  const { eventId, event } = useGlobalSearchParams()
  const [expanded, setExpanded] = useState(false)
  const [eventDetails, setEventDetails] = useState(null)
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const { safeNavigation } = useSafeNavigation();
  useEffect(() => {
    let isMounted = true;

    const assignEvent = (payload) => {
      if (!isMounted) {
        return;
      }
      const normalized = transformEventPayload(payload);
      setEventDetails(normalized ?? null);
      setLoadError(normalized ? null : new Error('Event not found'));
    };

    const hydrate = async () => {
      if (eventId) {
        setLoading(true);
        try {
          const fetched = await fetchEventById(eventId);
          assignEvent(fetched);
        } catch (error) {
          console.warn('Unable to load event', error);
          if (isMounted) {
            setEventDetails(null);
            setLoadError(error);
          }
        } finally {
          if (isMounted) {
            setLoading(false);
          }
        }
        return;
      }

      if (event) {
        try {
          const parsed = JSON.parse(event);
          assignEvent(parsed);
        } catch (parseError) {
          console.warn('Unable to parse event payload:', parseError);
          if (isMounted) {
            setEventDetails(null);
            setLoadError(parseError);
          }
        }
      }

      if (isMounted) {
        setLoading(false);
      }
    };

    hydrate();

    return () => {
      isMounted = false;
    };
  }, [event, eventId]);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#02757A" />
        <Text className="mt-3 text-base font-outfit text-textsecondary">
          Loading event details...
        </Text>
      </View>
    );
  }

  if (!eventDetails) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <MaterialCommunityIcons name="calendar-clock" size={36} color="#9CA3AF" />
        <Text className="mt-3 text-base font-outfit text-textsecondary">
          {loadError ? 'We could not load this event. Please try again later.' : 'Event not found.'}
        </Text>
      </View>
    );
  }

  const generalPrice = eventDetails.pricing?.general ?? 0;
  const layoutLabel = (eventDetails.layout || '').toLowerCase();
  const seatingLabel = layoutLabel.includes('outdoor') ? 'Festival seating' : 'Reserved seating';
  const ageGuidance = eventDetails.isKidsFriendly ? 'All ages' : '16 years & above';
  const heroImage = normalizeImageSource(eventDetails.bannerImage || eventDetails.image, placeholderImage);
  const dateLabel = eventDetails.dateLabel || eventDetails.date;

  return (
    <ScrollView className="flex-1 bg-background">
      <ImageBackground 
        source={heroImage}
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
            {dateLabel} | {eventDetails.startTime} - {eventDetails.endTime}
          </Text>
        </View>
      </ImageBackground>
      <View className="flex-row items-center justify-between p-4 bg-white border-b border-border">
        <Text className="text-primary text-xl font-outfit-bold">
          ₹ {generalPrice.toLocaleString('en-IN')} onwards
        </Text>
        <TouchableOpacity
          className="bg-primary px-6 py-3 rounded-lg"
          onPress={() => {
            safeNavigation(
              {
                pathname: '/screens/EventBooking',
                params: { eventId: eventDetails.id },
              }
            );
          }}

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
          {eventDetails.location}
        </Text>
        <TouchableOpacity
          className="p-2"
          onPress={() => {
            if (eventDetails.location) {
              const encoded = encodeURIComponent(eventDetails.location);
              Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${encoded}`)
            }
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
            {eventDetails.gatesOpen || '1 hr before'}
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
            {eventDetails.language?.join(', ') || 'English'}
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
            {eventDetails.duration || '5 hours'}
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
            {ageGuidance}
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
            {eventDetails.layout || 'Indoor'}
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
            {seatingLabel}
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
            {eventDetails.isKidsFriendly ? 'Yes' : 'No'}
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
            {eventDetails.isPetFriendly ? 'Yes' : 'No'}
          </Text>
        </View>
      </View>
      <Text className="text-textprimary text-lg font-outfit-bold p-4">
        Artists
      </Text>
      <View className="p-4">
        {eventDetails.performers?.length ? (
          eventDetails.performers.map((artist) => (
            <View key={artist.id} className="mb-4 bg-white rounded-2xl p-4 border border-border">
              <Text className="text-base font-outfit-bold text-textprimary">
                {artist.name}
              </Text>
              <Text className="text-xs font-outfit text-textsecondary mt-1">
                {artist.genre}
              </Text>
            </View>
          ))
        ) : (
          <Text className="text-sm font-outfit text-textsecondary">
            Performer details will be announced soon.
          </Text>
        )}
      </View>
    </ScrollView>
  )
}