import React, { useEffect, useState } from 'react'
import { View, TouchableOpacity, Text } from "react-native";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from 'expo-linear-gradient';
import ImageGallery from '@/components/ImageGallery';
import axios from 'axios';
import { API_CONFIG } from '../config/apiConfig';

export default function FirmCard({
  firmId,
  firmName,
  area,
  image,
  onPress,
  offer,
  addtoFavorite,
  rating,
  cuisines,
  price,
  promoted,
  time,
  offB,
  proExtraB,
  off,
  proExtra,
  distance,
  restaurantInfo
}) {
  const [currentImageIndex, setCurrentImageIndex] = React.useState(0);
  const [isFavorited, setIsFavorited] = useState(false);

useEffect(() => {
  const fetchIsLiked = async () => {
    try {
      const response = await axios.get(

        `${API_CONFIG.BACKEND_URL}/firm/user/${firmId}/islike`,
        { withCredentials: true }
      );
      setIsFavorited(response.data.islike);
    } catch (error) {
      console.error("Error fetching like status:", error.message);
      setIsFavorited(false); // Fallback to false
    }
  };

  fetchIsLiked();
}, [firmId]);

  const handleClick = async () => {
    try {
      await addtoFavorite(firmId);
      setIsFavorited((prev) => !prev);
    } catch (err) {
      console.error("Error updating favorite:", err);
    }
  };

  // const isRestaurantBookmarked = restaurantInfo?.isBookMarked || false;
  // const actualIsBookmarked = isBookmarked !== undefined ? isBookmarked : isRestaurantBookmarked;

  const displayName = firmName || restaurantInfo?.name || 'Unnamed Restaurant';
  const displayArea = area || restaurantInfo?.address || 'Location not specified';
  const displayRating = rating || restaurantInfo?.ratings?.overall || 0;
  const displayPrice = price || restaurantInfo?.priceRange || 'N/A';
  const displaydistance = distance || restaurantInfo?.distance;
  const displayCuisines = cuisines || restaurantInfo?.cuisines || [];
  const displayTime = time || restaurantInfo?.deliveryTime || 'N/A';
  const displayImages = (() => {
    if (typeof image === 'string') {
      return [{ uri: image }];
    }
    if (Array.isArray(image) && image.length > 0) {
      return image.map(img => typeof img === 'string' ? { uri: img } : img);
    }
    if (restaurantInfo?.image_urls?.length > 0) {
      return restaurantInfo.image_urls.map(url => ({ uri: url }));
    }
    return [require('../assets/images/placeholder.png')];
  })();

  // const handleBookmark = (event) => {
  //   event.stopPropagation();
  //   if (onBookmark) {
  //     onBookmark();
  //     if (restaurantInfo) {
  //       restaurantInfo.isBookMarked = !actualIsBookmarked;
  //     }
  //   }
  // };

  return (
    <TouchableOpacity className="bg-white rounded-3xl overflow-hidden mb-4 shadow-md shadow-black border border-gray-200" onPress={onPress}>
      <View style={{ height: 140 }}>
        <ImageGallery
          images={displayImages.slice(0,4)}
          currentIndex={currentImageIndex}
          onIndexChange={(index) => setCurrentImageIndex(index)}
        />

        {/* Promoted Banner */}
        {promoted && (
          <View className="absolute top-2.5 left-2.5 bg-black/70 px-2 py-1 rounded z-10">
            <Text className="text-white text-xs font-bold">Promoted</Text>
          </View>
        )}

        {/* Discount Banners */}
        <View className="absolute bottom-2.5 left-2.5 flex-row z-10">
          {offB && (
            <View className="bg-primary px-2 py-1 rounded mr-1">
              <Text className="text-white text-xs font-bold">{off}% OFF</Text>
            </View>
          )}
          {proExtraB && (
            <View className="bg-green-500 px-2 py-1 rounded">
              <Text className="text-white text-xs font-bold">Pro extra {proExtra}% OFF</Text>
            </View>
          )}
        </View>

        {/* Delivery Time */}
        <View className="absolute bottom-2.5 right-2.5 bg-black/70 px-2 py-1 rounded z-10">
          <Text className="text-white text-xs font-bold">{displayTime} min</Text>
        </View>
      </View>

      {/* Bookmark Button */}
      <TouchableOpacity
        onPress={handleClick}
        className="absolute top-2 right-2"
        activeOpacity={0.7}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <MaterialIcons
          name={isFavorited ? "bookmark" : "bookmark-border"}
          size={32}
          color={isFavorited ? "#02757A" : "white"}
        />
      </TouchableOpacity>

      {/* Text Content Section */}
      <View className="p-3 flex-row justify-between">
        <View className="flex-1 mr-2">
          <Text className="text-lg font-outfit-bold text-textprimary mb-1" numberOfLines={1} ellipsizeMode="tail">
            {displayName}
          </Text>

          <Text
            className="text-sm font-outfit text-textsecondary mb-1"
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {Array.isArray(displayCuisines) ? displayCuisines.join(' • ') : displayCuisines}
          </Text>

          <Text
            className="text-sm font-outfit text-textsecondary"
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {displayArea}
          </Text>
        </View>
        <View className="items-end">
          <View className="bg-green-600 rounded-lg px-2 py-1 flex-row items-center">
            <Text className="text-white text-sm font-semibold mr-1">{displayRating.toFixed(1)}</Text>
            <FontAwesome name='star' size={16} color='white' />
          </View>
          {displaydistance && (
            <Text className="mt-1.5 font-bold text-xs text-gray-600">
              {displaydistance.length > 3
                ? `${displaydistance.toString().slice(0, 3)} km`
                : `${displaydistance.toString().slice(0, 3)} km`}
            </Text>
          )}
          {displayPrice && displayPrice !== 'N/A' && (
            <Text className="text-xs font-outfit text-textsecondary mt-1">
              {typeof displayPrice === 'string' ? displayPrice : `$${displayPrice}`}
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}