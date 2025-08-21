import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  TouchableOpacity,
  SafeAreaView,
  Pressable,
  Image
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import ImageGallery from '@/components/ImageGallery';
import { MaterialIcons } from "@expo/vector-icons";
const { width } = Dimensions.get('window');
import axios from 'axios';

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
          `http://192.168.0.101:3000/firm/user/${firmId}/islike`,
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
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.card} onPress={onPress}>
        <View style={styles.card}>
          <View style={{ height: 250 }}>
            <ImageGallery
              images={displayImages.slice(0, 4)}
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
            {/* <View style={styles.timeContainer}>
              <Text style={styles.timeText}>{displayTime} min</Text>
            </View> */}
          </View>
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
          <LinearGradient
            colors={['#3A8DFF', '#6ABEFFE5', '#3A8DFF00']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.badge}
          >

            <Text style={styles.badgeTitle}>{table}</Text>
            <Text style={styles.badgeOffer}>{offer}</Text>
          </LinearGradient>

          {/* Card Content */}
          <View style={styles.content}>
            <View style={styles.leftColumn}>
              <Text
                style={styles.name}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {displayName}
              </Text>
              <Text
                style={styles.subtext}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {displayArea}
              </Text>
              <Text
                style={styles.subtext}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {Array.isArray(displayCuisines) ? displayCuisines.join(' • ') : displayCuisines}
              </Text>
            </View>
            <View style={styles.rightColumn}>
              <View style={styles.ratingBox}>
                <Text style={styles.ratingText}>{displayRating} ★</Text>
              </View>
              {displaydistance && (
                <Text>
                  {displaydistance.length > 3
                    ? `${displaydistance.toString().slice(0, 4)} km`
                    : `${displaydistance.toString().slice(0, 4)} km`}
                </Text>
              )}
              <Text style={styles.subinfo}>{displayPrice}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#fff',
    marginBottom: 14,
    elevation: 4,
    height: 250,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover'
  },
  badge: {
    position: 'absolute',
    bottom: 90,
    left: 10,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 4,
    width:"100%"
  },
  badgeTitle: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500'
  },
  badgeOffer: {
    color: '#fff',
    fontSize: 13,
    fontWeight: 'bold',
  },
  content: {
    backgroundColor: 'white',
    flexDirection: 'row',
    padding: 7,
    bottom: 95,
    margin: 7,
    borderRadius: 10,
    justifyContent: 'space-between',
  },
  leftColumn: {
    flex: 1,
    marginRight: 10,
  },
  rightColumn: {
    alignItems: 'flex-end',
  },
  name: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#111',
  },
  subtext: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  ratingBox: {
    backgroundColor: '#048520',
    borderRadius: 8,
    paddingVertical: 3,
    paddingHorizontal: 8,
    // marginBottom: 5,
  },
  ratingText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 13
  },
  subinfo: {
    fontSize: 13,
    color: '#444',
    marginTop: 3,
  },
  promotedBanner: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    zIndex: 1,
  },
  promotedText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  discountContainer: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    flexDirection: 'row',
    zIndex: 1,
  },
  offBanner: {
    backgroundColor: '#e23845',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 5,
  },
  offText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  proExtraBanner: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  proExtraText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  timeContainer: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    zIndex: 1,
  },
  timeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
export default DiningCard;