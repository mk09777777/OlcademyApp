import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Colors from '../components/constants/Colors';
import { router } from 'expo-router';

const FoodSection = () => {
  const FoodItem = ({ icon, title, chevron, onPress }) => (
    <TouchableOpacity onPress={onPress} className="flex-row items-center py-4 px-4 bg-white border-b border-gray-100">
      <View className="w-10 h-10 rounded-full bg-gray-50 items-center justify-center mr-3">
        <MaterialCommunityIcons name={icon} size={24} color={Colors.textLight} />
      </View>
      <View className="flex-1">
        <Text className="text-base font-outfit-medium color-gray-800">{title}</Text>
      </View>
      {chevron && (
        <MaterialCommunityIcons
          name="chevron-right"
          size={24}
          color={Colors.textLight}
        />
      )}
    </TouchableOpacity>
  );

  return (
    <View className="bg-white rounded-lg mx-4 my-2 overflow-hidden shadow-sm">
      <View className="px-4 py-3 border-b border-gray-100">
        <Text className="text-lg font-outfit-bold color-gray-800">Food Orders</Text>
      </View>

      <FoodItem
        icon="shopping-outline"
        title="Your Orders"
        chevron
        onPress={() => router.push('/screens/Order')}
      />

      <FoodItem
        icon="heart-outline"
        title="Favorite Orders"
        chevron
        onPress={() => router.push('/screens/FavoriteOrders')}
      />

      <FoodItem
        icon="map-marker-outline"
        title="Your Address"
        chevron
        onPress={() => router.push('/screens/Address')}
      />

      <FoodItem
        icon="chat-outline"
        title="Online Ordering Help"
        chevron
        onPress={() => router.push('/screens/OrderSupportChat')}
      />
    </View>
  );
};

export default FoodSection;
