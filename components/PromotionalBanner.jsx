import React from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import styles from '../styles/tiffinstyle';

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
      style={[
        styles.promotionalBanner,
        { backgroundColor: backgroundColor || '#FFE4E1' }
      ]}
    >
      <View style={styles.bannerContent}>
        <View style={styles.bannerTextContainer}>
        <Text style={[styles.bannerTitle, { color: textColor }]}>{title}</Text>
        <Text style={[styles.bannerSubtitle, { color: textColor }]}>{subtitle}</Text>
        </View>
        <Image
          source={image}
          style={styles.bannerImage}
          resizeMode="contain"
        />
      </View>
    </TouchableOpacity>
  );
}; 
export default PromotionalBanner;