import React from 'react';
import { View, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import { Card, Text } from 'react-native-paper';
import { MaterialCommunityIcons, FontAwesome } from '@expo/vector-icons';
import ImageGallery from '@/components/ImageGallery';
const COLORS = {
  PRIMARY: '#FF4B3A',
  WARNING: '#FFC107',
  TEXT_PRIMARY: '#212121',
  TEXT_SECONDARY: '#757575',
  SURFACE: '#FFFFFF',
  BACKGROUND: '#F8F8F8',
  STAR: '#FFD700',
  BORDER: '#E0E0E0',
};

const SPACING = {
  XS: 4,
  SM: 8,
  MD: 12,
  LG: 16,
  XL: 24,
};
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
      <View style={
        styles.card}>
        <View style={styles.imageContainer}>
          <View style={{ height: 150 }}>
            <ImageGallery
              images={displayImages}
              currentIndex={currentImageIndex}
              onIndexChange={(index) => setCurrentImageIndex(index)}
            />
          </View>
          <TouchableOpacity
            onPress={onFavoriteToggle}
            style={styles.bookmarkButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <MaterialCommunityIcons
              name={isFavorite ? 'bookmark' : 'bookmark-outline'}
              size={24}
              color={isFavorite ? COLORS.PRIMARY : 'white'}
            />
          </TouchableOpacity>

        </View>

        <View style={styles.content}>
          <View style={styles.textContent}>
            <Text
              style={styles.title}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {title}
            </Text>

            {/* <View style={styles.mealTypesContainer}> */}
            {/* {mealTypes?.slice(0, horizontal ? 2 : 3).map((type, index) => ( */}
            {/* <Text

              style={styles.mealTypeText}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
             
              {mealTypes.join(' • ') || 'N/A'}
            </Text> */}
                    <Text

              style={styles.mealTypeText}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {/* {Array.isArray(type) ? type.join(' , ') : type || 'N/A'} */}
              {deliveryCities.join(' • ') || 'N/A'}
            </Text>
            {/* ))} */}
            {/* </View> */}
          </View>

          <View style={styles.priceContainer}>
            <View style={styles.ratingBadge}>
              <FontAwesome name='star' size={14} color={"white"} />
              <Text style={styles.ratingText}>{rating}</Text>
            </View>
            <Text style={styles.price}>${priceRange}</Text>
            {/* <Text style={styles.distance}>5KM</Text> */}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.SURFACE,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: SPACING.LG,
  },
  imageContainer: {
    position: 'relative',
    height: 150,
  },
  content: {
    padding: SPACING.MD,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  textContent: {
    flex: 1,
    marginRight: SPACING.MD,
  },
  title: {
    fontFamily:'outfit-bold',
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.XS,
  },
  mealTypeText: {
    fontFamily:'outfit-medium',
    fontSize: 15,
    color: COLORS.TEXT_SECONDARY,
  },
  cuisineText:{
 fontFamily:'outfit-medium',
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
  },
  priceContainer: {
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    minWidth: 80,
  },
  price: {
    fontFamily:'outfit',
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.PRIMARY,
    marginBottom: SPACING.XS,
  },
  bookmarkButton: {
    position: 'absolute',
    top: SPACING.MD,
    right: SPACING.MD,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(5, 137, 23, 0.97)',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  ratingText: {
    color: 'white',
    fontFamily:'out-fit',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
});

export default TiffinCard;