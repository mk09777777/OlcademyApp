import React from 'react';
import { View, Image, TouchableOpacity, Dimensions } from 'react-native';
import { Card, Text } from 'react-native-paper';
import { MaterialCommunityIcons, FontAwesome } from '@expo/vector-icons';
import ImageGallery from '@/components/ImageGallery';
const TiffinCard = ({ firm, onPress, onFavoriteToggle, isFavorite, horizontal = false }) => {
  const { title, rating, image, priceRange, mealTypes, deliveryCities} = firm;
  const [currentImageIndex, setCurrentImageIndex] = React.useState(0);
  const displayImages = (() => {
    if (typeof image === 'string') {
      return [{ uri: image }];
    }
    if (Array.isArray(image) && image.length > 0) {
      return image.map(img => typeof img === 'string' ? { uri: img } : img);
    }
    // if (restaurantInfo?.image_urls?.length > 0) {
    //   return restaurantInfo.image_urls.map(url => ({ uri: url }));
    // }
    return [require('../assets/images/placeholder.png')];
  })();
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <View className="bg-white rounded-3xl overflow-hidden shadow-lg mb-4 mr-1.5 ml-1.5 border border-gray-200">
        <View className="relative">
          <View style={{ height: 140 }}>
            <ImageGallery 
              images={displayImages}
              currentIndex={currentImageIndex}
              onIndexChange={(index) => setCurrentImageIndex(index)}
            />
          </View>
          <TouchableOpacity
            onPress={onFavoriteToggle}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/40 justify-center items-center z-10"
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <MaterialCommunityIcons
              name={isFavorite ? 'bookmark' : 'bookmark-outline'}
              size={24}
              color={isFavorite ? '#FF4B3A' : 'white'}
            />
          </TouchableOpacity>

        </View>

        <View className="p-3 flex-row justify-between items-start">
          <View className="flex-1 mr-3">
            <Text
              className="font-outfit-bold text-lg font-bold text-textprimary mb-1"
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {title}
            </Text>

            <Text
              className="font-outfit-medium text-base text-textsecondary"
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {deliveryCities.join(' • ') || 'N/A'}
            </Text>
          </View>

          <View className="items-end justify-end min-w-20">
            <View className="flex-row items-center bg-green-700 rounded-1.5 px-2.5 py-1">
              <FontAwesome name='star' size={14} color="white" />
              <Text className="text-white font-outfit text-sm font-semibold ml-1">{rating}</Text>
            </View>
            <Text className="font-outfit text-base font-bold text-primary mb-1">${priceRange}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};



export default TiffinCard;