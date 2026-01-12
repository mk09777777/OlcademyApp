import React from 'react';
import {
  View,
  // StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  ImageBackground,
  ActivityIndicator
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

const MinTiffinCard = ({ firm, onPress,   onFavoriteToggle, 
  isFavorite, 
  isLoading = false, horizontal = false }) => {
  const { title, rating, image, priceRange, mealTypes } = firm;
  const handleFavoritePress = () => {
    if (!isLoading) {
      onFavoriteToggle();
    }
  };
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <View className="mx-1.5 bg-white rounded-[19px] overflow-hidden shadow-lg w-40 border border-gray-300 mb-0.5">
        <View className="relative h-28">
          <ImageBackground
            source={typeof image === 'string' ? { uri: image } : image}
            className="w-full h-full"
            resizeMode="cover"
          />
          {/* <LinearGradient
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
          </LinearGradient> */}

               <TouchableOpacity
          onPress={handleFavoritePress}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/40 justify-center items-center z-10"
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color={COLORS.PRIMARY} />
          ) : (
            <MaterialCommunityIcons
              name={isFavorite ? 'bookmark' : 'bookmark-outline'}
              size={24}
              color={isFavorite ? COLORS.PRIMARY : 'white'}
            />
          )}
        </TouchableOpacity>
        </View>

        <View className="p-3 flex-row justify-between items-start">
          <View className="flex-1 mr-3">
            <Text className="text-base font-extrabold text-gray-800 mb-1 mt-1.5" style={{fontFamily: 'outfit'}} numberOfLines={1}>
              {title}
            </Text>
            <Text className="text-sm text-gray-600 mb-3.5" style={{fontFamily: 'outfit-bold'}}>$ {priceRange}</Text>
          </View>

          {rating && (
            <View className="flex-row items-center bg-green-700 rounded-md px-1.5 py-0.5 mt-1.5">
              <Text className="text-white text-sm font-semibold ml-0.5 mr-1.5" style={{fontFamily: 'outfit-bold'}}>{rating}</Text>
              <FontAwesome name="star" size={12} color={COLORS.STAR} />
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

// const styles = StyleSheet.create({
//   card: {
//     marginHorizontal: 5,
//     backgroundColor: COLORS.SURFACE,
//     borderRadius: 19,
//     overflow: 'hidden',
//     shadowColor: '#b2babb',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 4,
//     width: 160,
//     borderWidth:1,
//     borderColor:'#d5d5d5ff',
//     marginBottom: 2,
//   },
//   imageContainer: {
//     position: 'relative',
//     height: 110,
//   },
//   image: {
//     width: '100%',
//     height: '100%',
//   },
//   badge: {
//     position: 'absolute',
//     bottom: 0,
//     left: 0,
//     height: 25,
//     width: 140,
//     borderRadius: 0,
//     flexDirection: 'column',
//   },
//   badgeTitle: {
//     color: '#fff',
//     fontSize: 13,
//     fontFamily: 'outfit',
//     fontWeight: 'bold',
//     marginTop: 3,
//     marginLeft: 4,
//   },
//   content: {
//     padding: SPACING.MD,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'flex-start',
//   },
//   textContent: {
//     flex: 1,
//     marginRight: SPACING.MD,
//   },
//   title: {
//         fontFamily: 'outfit',
//     fontSize: 16,
//     fontWeight: '800',
//     color: COLORS.TEXT_PRIMARY,
//     marginBottom: SPACING.XS,
//     marginTop: 5,
//   },
//   distance: {
//         fontFamily: 'outfit-bold',
//     fontSize: 14,
//     color: COLORS.TEXT_SECONDARY,
//     marginBottom: 14,
//   },
//   bookmarkButton: {
//     position: 'absolute',
//     top: SPACING.MD,
//     right: SPACING.MD,
//     width: 32,
//     height: 32,
//     borderRadius: 16,
//     backgroundColor: 'rgba(0, 0, 0, 0.4)',
//     justifyContent: 'center',
//     alignItems: 'center',
//     zIndex: 1,
//   },
//   ratingBadge: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: 'rgb(4, 116, 19)',
//     borderRadius: 6,
//     paddingHorizontal: 6,
//     paddingVertical: 2,
//     marginTop: 5,
//   },
//   ratingText: {
//         fontFamily: 'outfit-bold',
//     color: 'white',
//     fontSize: 14,
//     fontWeight: '600',
//     marginLeft: 2,
//     marginRight: 5,
//   },
// });

export default MinTiffinCard;
