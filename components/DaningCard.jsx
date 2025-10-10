import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  FlatList,
  Dimensions,
  TouchableOpacity,
  Pressable,
  Image
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import ImageGallery from '@/components/ImageGallery';
import { MaterialIcons } from "@expo/vector-icons";
const { width } = Dimensions.get('window');
import axios from 'axios';
import { API_CONFIG } from '../config/apiConfig';

const DiningCard = ({ firmId,
  firmName,
  area,
  image,
  onPress,
  addtoFavorite,
  distance,
  rating,
  promoted,
  time,
  offB,
  proExtraB,
  off,
  proExtra,
  cuisines,
  price,
  restaurantInfo
}) => {

  const displayName = firmName || restaurantInfo?.name || 'Unnamed Restaurant';
  const displayArea = area || restaurantInfo?.address || 'Location not specified';
  const displayRating = rating || restaurantInfo?.ratings?.overall || 0;
  const displayCuisines = cuisines || restaurantInfo?.cuisines || [];
  const displaydistance = distance || restaurantInfo?.distance;
  const displayPrice = price || restaurantInfo?.priceRange || '$50';
  const displayTime = time || restaurantInfo?.deliveryTime || 'N/A';
  const table = 'Prebooked';
  const offer = '5% OFF';

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
        setIsFavorited(false);
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

  return (
    <TouchableOpacity className="bg-white rounded-3xl overflow-hidden mb-4 shadow-md shadow-black border border-gray-200" onPress={onPress}>
      <View style={{ height: 150 }}>
        <ImageGallery
          images={displayImages.slice(0, 4)}
          currentIndex={currentImageIndex}
          onIndexChange={(index) => setCurrentImageIndex(index)}
        />
        
        {promoted && (
          <View className="absolute top-2.5 left-2.5 bg-black/70 px-2 py-1 rounded z-10">
            <Text className="text-white text-xs font-bold">Promoted</Text>
          </View>
        )}

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

        <View className="absolute bottom-2.5 right-2.5 bg-black/70 px-2 py-1 rounded z-10">
          <Text className="text-white text-xs font-bold">{displayTime} min</Text>
        </View>
      </View>

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

      <View className="p-3 flex-row justify-between">
        <View className="flex-1 mr-2">
          <Text className="text-lg font-outfit-bold text-textprimary mb-1" numberOfLines={1} ellipsizeMode="tail">
            {displayName}
          </Text>
          <Text className="text-sm font-outfit text-textsecondary mb-1" numberOfLines={1} ellipsizeMode="tail">
            {Array.isArray(displayCuisines) ? displayCuisines.join(' • ') : displayCuisines}
          </Text>
          <Text className="text-sm font-outfit text-textsecondary" numberOfLines={1} ellipsizeMode="tail">
            {displayArea}
          </Text>
        </View>
        <View className="items-end">
          <View className="bg-green-600 rounded-lg px-2 py-1 flex-row items-center">
            <Text className="text-white text-sm font-semibold mr-1">{displayRating.toFixed(1)}</Text>
            <Text className="text-white text-sm">★</Text>
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
};


export default DiningCard;