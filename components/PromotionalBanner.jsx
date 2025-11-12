import React from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
// import styles from '../styles/tiffinstyle';

 const PromotionalBanner = ({
  banner,
  onPress
}) => {
  const {
    title = 'Title',
    subtitle = 'Default Subtitle',
    image = require('../assets/images/food.jpg'), 
    backgroundColor = '#FFE4E1',
    textColor = '#FF4500'
  } = banner;

  return (
    <TouchableOpacity
      onPress={onPress}
      className="rounded-lg p-4 mx-4 my-2"
      style={{ backgroundColor: backgroundColor || '#FFE4E1' }}
    >
      <View className="flex-row items-center justify-between">
        <View className="flex-1 pr-4">
        <Text className="text-lg font-bold mb-1" style={{ color: textColor }}>{title}</Text>
        <Text className="text-sm" style={{ color: textColor }}>{subtitle}</Text>
        </View>
        <Image
          source={image}
          className="w-20 h-20"
          resizeMode="contain"
        />
      </View>
    </TouchableOpacity>
  );
}; 
export default PromotionalBanner;