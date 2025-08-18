import React, { useEffect, useState } from 'react'
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { styles } from "../styles/FirmCardStyle";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from 'expo-linear-gradient';
import ImageGallery from '@/components/ImageGallery';
import axios from 'axios'

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
        `http://192.168.0.101:3000/firm/user/${firmId}/islike`,
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
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={{ height: 150 }}>
        <ImageGallery
          images={displayImages.slice(0,4)}
          currentIndex={currentImageIndex}
          onIndexChange={(index) => setCurrentImageIndex(index)}
        />

        {/* Promoted Banner */}
        {promoted && (
          <View style={styles.promotedBanner}>
            <Text style={styles.promotedText}>Promoted</Text>
          </View>
        )}

        {/* Discount Banners */}
        <View style={styles.discountContainer}>
          {offB && (
            <View style={styles.offBanner}>
              <Text style={styles.offText}>{off}% OFF</Text>
            </View>
          )}
          {proExtraB && (
            <View style={styles.proExtraBanner}>
              <Text style={styles.proExtraText}>Pro extra {proExtra}% OFF</Text>
            </View>
          )}
        </View>

        {/* Delivery Time */}
        <View style={styles.timeContainer}>
          <Text style={styles.timeText}>{displayTime} min</Text>
        </View>
      </View>

      {/* Bookmark Button */}
      <TouchableOpacity
        onPress={handleClick}
        style={{ position: 'absolute', top: 8, right: 8 }}
        activeOpacity={0.7}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <MaterialIcons
          name={isFavorited ? "bookmark" : "bookmark-border"}
          size={32}
          color={isFavorited ? "#e23845" : "white"}
        />
      </TouchableOpacity>
      {/* {offer && (
        <LinearGradient
          colors={['#e23845', 'rgba(226, 56, 69, 0)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.offerBanner}
        >
          <Text style={styles.offerText}>5% OFF</Text>
        </LinearGradient>
      )} */}

      {/* Text Content Section */}
      <View style={styles.textCard}>
        <View style={{ flex: 1, marginRight: 8 }}>
          <Text style={styles.firmName} numberOfLines={1} ellipsizeMode="tail">
            {displayName}
          </Text>

          <Text
            style={styles.subtext}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {Array.isArray(displayCuisines) ? displayCuisines.join(' • ') : displayCuisines}
          </Text>

          <Text
            style={styles.area}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {displayArea}
          </Text>
        </View>
        <View style={styles.areamain}>
          <View style={styles.reviewBox}>
            <Text style={styles.reviewText}>{displayRating.toFixed(1)}</Text>
            <FontAwesome name='star' size={16} color='white' />
          </View>
          {displaydistance && (
            <Text style={{marginTop:6,fontWeight:"bold",fontSize:12,color:"#57606F" }}>
              {displaydistance.length > 3
                ? `${displaydistance.toString().slice(0, 3)} km`
                : `${displaydistance.toString().slice(0, 3)} km`}
            </Text>
          )}
          {displayPrice && displayPrice !== 'N/A' && (
            <Text style={styles.priceText}>
              {typeof displayPrice === 'string' ? displayPrice : `$${displayPrice}`}
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}