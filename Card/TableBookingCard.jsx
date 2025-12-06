import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';

const BookingCard = ({ booking, onPress, Rname, add, guestes, name, date, timeSlot, status, image }) => {
  const statusColor = status === 'accepted' ? '#08a742' : '#e53935';
  const statusText = status === 'confirmed' ? 'Booking confirmed' : 'Booking cancelled';

  // Format date to dd/mm/yy with validation
  const formatDate = (dateString) => {
    const parsedDate = new Date(dateString);
    if (isNaN(parsedDate.getTime())) {
      return 'Invalid Date';
    }
    return parsedDate.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit'
    });
  };
  
  const formattedDate = formatDate(date);

  return (
    <TouchableOpacity className="bg-white rounded-xl mb-4 shadow-sm" onPress={onPress}>
      <View className="flex-row p-4">
        <Image
          source={typeof image === 'string' ? { uri: image } : image}
          className="w-16 h-16 rounded-lg"
        />
        <View className="ml-4 justify-center">
          <Text className="text-lg font-outfit-bold mb-1">{Rname}</Text>
          <Text className="text-base color-gray-500 font-outfit">{add}</Text>
        </View>
      </View>

      <View className="h-px bg-gray-200 mx-4" />

      <View className="p-4">
        <View className="flex-row mb-2">
          <Text className="text-base color-gray-500 w-20 font-outfit">Name:</Text>
          <Text className="text-base font-outfit-medium">{name}</Text>
        </View>

        <View className="flex-row mb-2">
          <Text className="text-base color-gray-500 w-20 font-outfit">Guest:</Text>
          <Text className="text-base font-outfit-medium">{guestes}</Text>
        </View>
      </View>

      <View className="h-px bg-gray-200 mx-4" />

      <View className="flex-row justify-between p-4 items-center">
        <Text className="text-base font-outfit-medium">
          {timeSlot}, {formattedDate}
        </Text>
        <Text className="text-base font-outfit-medium" style={{ color: statusColor }}>
          {status}
        </Text>
      </View>
    </TouchableOpacity>
  );
};



export default BookingCard;
