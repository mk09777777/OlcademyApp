import React from 'react';
import { View, StyleSheet, Image, TouchableOpacity, Dimensions, ImageBackground } from 'react-native';
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

const MiniRecommendedCard = ({ name, address, image, rating, onPress }) => {


  return (
    <TouchableOpacity activeOpacity={0.8} onPress={onPress} style={{ marginBottom: 0}}>
      <View style={styles.card}>
        <View style={styles.imageContainer}>
          <ImageBackground
            source={
              image?.[0]
                ? { uri: image[0] }
                : require('../assets/images/biryani.png')
            }

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
            <View style={{display:"flex",flexDirection:"row",alignItems:"center",marginLeft:4}}>
              <MaterialIcons name="local-offer" size={16} color="white" />
            <Text style={styles.badgeTitle} >
              Flat 20% OFF
            </Text>
            </View>
            {/* <Text style={styles.badgeOffer}>Flat 20% OFF</Text> */}
          </LinearGradient>
          {/* <TouchableOpacity
            style={styles.bookmarkButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <MaterialCommunityIcons
              name="bookmark-outline"
              size={24}
              color="white"
            />
          </TouchableOpacity> */}
        </View>

        <View style={styles.content}>
          <View style={styles.textContent}>
            <Text style={styles.title} numberOfLines={1}>
              {name || "Static restaurant"}
            </Text>
            <Text style={styles.distance} numberOfLines={1}>
              {address || "N/A"}
            </Text>
          </View>

          <View style={styles.ratingBadge}>
            <Text style={styles.ratingText}>{rating}</Text>
            <FontAwesome name="star" size={12} color={COLORS.STAR} />
          </View>
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
    width: 140,
    marginBottom: 0,
  },
  imageContainer: {
    position: 'relative',
    height: 120,
  },
  badge: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    height: 25,                 // ✅ reduce height
    width: 140,
    borderRadius: 0,
    display: "flex",
    flexDirection: "column",
    // justifyContent:"flex-start"
  },
  badgeTitle: {
   color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    marginTop:3,
    marginLeft:4
  },
  badgeOffer: {
    color: '#fff',
    fontSize: 13,
    fontWeight: 'bold',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  content: {
    fontFamily: 'outfit-regular',
    padding: SPACING.MD,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  textContent: {
    fontFamily: 'outfit-regular',
    flex: 1,
    marginRight: SPACING.MD,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.XS,
    marginTop: 0
  },
  distance: {
    fontSize: 12,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: 1
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
    marginTop: 5
  },
  ratingText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 2,
    marginRight: 5
  },
});

export default MiniRecommendedCard;
