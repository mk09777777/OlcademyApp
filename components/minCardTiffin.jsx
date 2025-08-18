import React from 'react';
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  ImageBackground
} from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons, FontAwesome } from '@expo/vector-icons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { LinearGradient } from 'expo-linear-gradient';

const COLORS = {
  PRIMARY: '#FF4B3A',
  WARNING: '#FFC107',
  TEXT_PRIMARY: '#212121',
  TEXT_SECONDARY: '#757575',
  SURFACE: '#FFFFFF',
  BACKGROUND: '#F8F8F8',
  STAR: '#ffff',
  BORDER: '#E0E0E0',
};

const SPACING = {
  XS: 4,
  SM: 8,
  MD: 12,
  LG: 16,
  XL: 24,
};

const SCREEN_WIDTH = Dimensions.get('window').width;

const MinTiffinCard = ({ firm, onPress, onFavoriteToggle, isFavorite, horizontal = false }) => {
  const { title, rating, image, priceRange, mealTypes } = firm;

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <View style={styles.card}>
        <View style={styles.imageContainer}>
          <ImageBackground
            source={typeof image === 'string' ? { uri: image } : image}
            style={styles.image}
            resizeMode="cover"
          />
          <LinearGradient
            colors={[
              'rgba(40, 109, 255, 1)',
              'rgba(135, 206, 250, 0.95)',
              'rgba(40, 108, 255, 0.73)',
              'rgba(40, 109, 255, 0)'
            ]}
            start={{ x: 0, y: 1 }}
            end={{ x: 1, y: 0 }}
            style={styles.badge}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 4 }}>
              <MaterialIcons name="local-offer" size={16} color="white" />
              <Text style={styles.badgeTitle}>Flat 20% OFF</Text>
            </View>
          </LinearGradient>

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
            <Text style={styles.title} numberOfLines={1}>
              {title}
            </Text>
            <Text style={styles.distance}>5KM</Text>
          </View>

          {rating && (
            <View style={styles.ratingBadge}>
              <Text style={styles.ratingText}>{rating}</Text>
              <FontAwesome name="star" size={12} color={COLORS.STAR} />
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 5,
    backgroundColor: COLORS.SURFACE,
    borderRadius: 19,
    overflow: 'hidden',
    shadowColor: '#b2babb',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    width: 160,
    marginBottom: 2,
  },
  imageContainer: {
    position: 'relative',
    height: 120,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  badge: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    height: 25,
    width: 140,
    borderRadius: 0,
    flexDirection: 'column',
  },
  badgeTitle: {
    color: '#fff',
    fontSize: 13,
    fontWeight: 'bold',
    marginTop: 3,
    marginLeft: 4,
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
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.XS,
    marginTop: 5,
  },
  distance: {
    fontSize: 12,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: 14,
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
    backgroundColor: 'rgb(4, 116, 19)',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginTop: 5,
  },
  ratingText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 2,
    marginRight: 5,
  },
});

export default MinTiffinCard;
