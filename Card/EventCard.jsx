import React from 'react';
import { View, TouchableOpacity, Text, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const EventCard = ({ event, onPress }) => {
  return (
    <TouchableOpacity className="bg-white rounded-3xl mb-4 shadow-md overflow-hidden" onPress={onPress}>
      <Image 
        source={event.image} 
        className="w-full h-48"
      />
      
      <View className="p-4">
        <Text className="text-lg font-outfit-bold text-textprimary mb-3">{event.title || "Untitled Event"}</Text>

        <View className="flex-row items-center mb-2">
          <MaterialIcons name="calendar-today" size={16} color="#666" />
          <Text className="ml-2 text-sm text-textsecondary">
            {event.date ? new Date(event.date).toDateString() : "Date not available"}
          </Text>
        </View>

        <View className="flex-row items-center mb-2">
          <MaterialIcons name="access-time" size={16} color="#666" />
          <Text className="ml-2 text-sm text-textsecondary">
            {event.startTime && event.endTime 
              ? `${event.startTime} - ${event.endTime}` 
              : "Time not set"}
          </Text>
        </View>

        <View className="flex-row items-center mb-4">
          <MaterialIcons name="location-on" size={16} color="#666" />
          <Text className="ml-2 text-sm text-textsecondary">{event.location || "Location not specified"}</Text>
        </View>

        <View className="flex-row justify-between items-center">
          <View className="flex-row items-center">
            <MaterialIcons name="people" size={16} color="#666" />
            <Text className="ml-1 text-sm text-textsecondary">
              {event.attendees ? `${event.attendees} attending` : "No attendees yet"}
            </Text>
          </View>

          <TouchableOpacity className="bg-primary px-4 py-2 rounded-2xl" onPress={onPress}>
            <Text className="text-white font-outfit-bold text-sm">View Details</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default EventCard;
