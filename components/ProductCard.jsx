import React from "react";
import { View, Text, Image } from "react-native";

export default function ProductCard ({ productName, price, description, diatry }) {
  return (
    <View className="bg-white rounded-lg p-4 mb-4 shadow-md border border-gray-200">
      <Image 
        source={require('@/assets/images/food_placeholder.jpg')}
        className="w-full h-32 rounded-lg mb-3"
      />
      <View>
        <Text className="text-lg font-outfit-bold text-textprimary mb-1">{productName}</Text>
        <Text className="text-base font-outfit text-primary mb-2">Price: ₹{price}</Text>
        <Text className="text-sm font-outfit text-textsecondary mb-3">{description}</Text>
        <View className="flex-row items-center">
          { diatry &&
            diatry == 'veg' ? 
            <Image source={require('@/assets/images/veg.jpg')} className="w-5 h-5 mr-2"/> : 
            <Image source={require('@/assets/images/non-veg.jpg')} className="w-5 h-5 mr-2"/>
          }
          <Text className="text-xs font-outfit text-textsecondary">
            No Allergens
          </Text>
        </View>
      </View>
    </View>
  )
}
