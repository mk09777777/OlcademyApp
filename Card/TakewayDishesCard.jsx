import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
// import styles from '../styles/TakewayCollection';
const DishCard = ({ dish }) => {
  const { 
    name, 
    price, 
    originalPrice, 
    rating, 
    reviews, 
    isVeg, 
    customizable, 
    quantity,
    image 
  } = dish;
  const VegIcon = () => (
    <View className="w-4 h-4 border border-green-600 justify-center items-center">
      <View className="w-3 h-3 justify-center items-center">
        <View className="w-2 h-2 bg-green-600 rounded-full" />
      </View>
    </View>
  );
  return (
    <View className="flex-row bg-white p-4 mb-3 rounded-lg shadow-sm">
      <View className="flex-1 pr-3">
        {isVeg && <VegIcon />}
        <Text className="text-base font-semibold text-gray-900 mb-1">{name}</Text>
        {quantity && <Text className="text-sm text-gray-600 mb-1">{quantity}</Text>}
        {rating && (
          <View className="flex-row items-center mb-2">
            <Text className="text-yellow-500 mr-1">{'★'.repeat(Math.floor(rating))}</Text>
            <Text className="text-xs text-gray-500">({reviews})</Text>
          </View>
        )}
        <View className="flex-row items-center">
          <Text className="text-lg font-bold text-gray-900 mr-2">₹{price}</Text>
          {originalPrice && (
            <Text className="text-sm text-gray-500 line-through">₹{originalPrice}</Text>
          )}
        </View>
      </View>
      <View className="items-center">
        <Image source={image} className="w-20 h-20 rounded-lg mb-2" />
        <TouchableOpacity 
              className="absolute top-1 right-1 p-1"
              onPress={() => toggleBookmark(item.id)}
              activeOpacity={0.7}
            >
              <MaterialIcons 
                name={item.isBookmarked ? "bookmark" : "bookmark-border"} 
                size={24} 
                color={Colors.primary} 
              />
            </TouchableOpacity>
        <TouchableOpacity className="bg-green-600 px-4 py-2 rounded-lg">
          <Text className="text-white font-semibold text-sm">ADD{customizable ? ' +' : ''}</Text>
        </TouchableOpacity>
        {customizable && (
          <Text className="text-xs text-gray-500 mt-1">customizable</Text>
        )}
      </View>
    </View>
  );
};
export default DishCard;