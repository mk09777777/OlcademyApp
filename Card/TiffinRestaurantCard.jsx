import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
// import styles from '../styles/TiffinCollection';
const TiffinRestaurantCard = ({ restaurant, onPress }) => {
  const { 
    rating, 
    deliveryTime, 
    distance, 
    speciality, 
    pricePerDay, 
    image, 
    offer, 
    offers 
  } = restaurant;

  const RatingBadge = ({ rating }) => (
    <View className="bg-green-600 px-2 py-1 rounded">
      <Text className="text-white text-sm font-semibold">{rating}★</Text>
    </View>
  );

  return (
    <TouchableOpacity className="bg-white rounded-lg mb-4 shadow-sm" onPress={onPress}>
      <Image source={image} className="w-full h-48 rounded-t-lg" />
      <View className="p-3">
        <View className="mb-1">
          <Text className="text-xs text-gray-500">
            {deliveryTime} mins • {distance}
          </Text>
        </View>
        <Text className="text-lg font-bold text-gray-900 mb-1">{name}</Text>
        <View className="flex-row items-center mb-2">
          <Text className="text-sm text-gray-600">{speciality}</Text>
          <Text className="text-sm text-gray-600 mx-1">•</Text>
          <Text className="text-sm text-gray-600">₹{pricePerDay} per day</Text>
        </View>
        {rating && <RatingBadge rating={rating} />}
        {(offer || offers) && (
          <View className="mt-2">
            {offer && <Text className="text-xs text-orange-600 font-medium">{offer}</Text>}
            {offers && offers.map((offerText, index) => (
              <Text key={index} className="text-xs text-orange-600 font-medium">{offerText}</Text>
            ))}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default TiffinRestaurantCard;