import React from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function EventCard({ event, onPress }) {
  return (
    <TouchableOpacity onPress={onPress}>
      <View className="bg-white rounded-xl shadow-sm m-2 overflow-hidden relative">
        <Image 
          source={event.firmImage || require('@/assets/images/placeholder.png')} 
          className="w-full h-32"
        />
        <View className="p-4">
          <View>
            <Text className="text-base font-outfit-bold color-gray-900">{event.title}</Text>
            <Text className="text-sm color-gray-600 font-outfit mt-1">{event.firmName}</Text>
            <Text className="text-xs color-gray-500 font-outfit mt-2">
              <MaterialCommunityIcons name="calendar" size={14} color="#666" />
              {' '}{event.date} • {event.time}
            </Text>
            <Text className="text-xs color-gray-500 font-outfit mt-1">
              <MaterialCommunityIcons name="map-marker" size={14} color="#666" />
              {' '}{event.location}
            </Text>
          </View>
          
          <View className="flex-row justify-between items-center mt-3">
            {event.price && (
              <Text className="text-base font-outfit-bold color-primary">₹{event.price}</Text>
            )}
            {event.attendees && (
              <Text className="text-xs color-gray-500 font-outfit">
                {event.attendees} attending
              </Text>
            )}
          </View>
        </View>

        {event.featured && (
          <View className="absolute top-2 right-2 bg-orange-500 px-2 py-1 rounded">
            <Text className="text-xs text-white font-outfit-bold">Featured</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}
