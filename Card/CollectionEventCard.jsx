import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Calendar, MapPin, Users, Clock } from 'lucide-react-native';

const EventCard = ({ event }) => {
  return (
    <View className="bg-white rounded-xl shadow-lg m-2">
      <Image source={{ uri: event.image }} className="w-full h-48 rounded-t-xl" />
      <View className="p-4">
        <View className="flex-row justify-between items-center mb-3">
          <Text className="text-lg font-outfit-bold color-gray-900 flex-1">{event.title}</Text>
          <Text className="text-lg font-outfit-bold color-primary">${event.price}</Text>
        </View>

        <View className="flex-row items-center mb-2">
          <Calendar size={20} color="#666" />
          <Text className="text-sm color-gray-600 ml-2 font-outfit">{event.date}</Text>
        </View>

        <View className="flex-row items-center mb-2">
          <Clock size={20} color="#666" />
          <Text className="text-sm color-gray-600 ml-2 font-outfit">{event.time}</Text>
        </View>

        <View className="flex-row items-center mb-2">
          <MapPin size={20} color="#666" />
          <Text className="text-sm color-gray-600 ml-2 font-outfit">{event.location}</Text>
        </View>

        <View className="flex-row items-center mb-3">
          <Users size={20} color="#666" />
          <Text className="text-sm color-gray-600 ml-2 font-outfit">{event.attendees} attendees</Text>
        </View>

        <Text className="text-sm color-gray-700 mb-3 leading-5 font-outfit">{event.description}</Text>

        <View className="flex-row flex-wrap mb-4">
          {event.tags.map((tag, index) => (
            <View key={index} className="bg-gray-100 rounded-full px-3 py-1 mr-2 mb-2">
              <Text className="text-xs color-gray-600 font-outfit">#{tag}</Text>
            </View>
          ))}
        </View>

        <TouchableOpacity className="bg-primary py-3 rounded-lg items-center">
          <Text className="text-white font-outfit-bold text-base">Book Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default EventCard;
