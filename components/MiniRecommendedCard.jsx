import React from 'react';
import { View, Image, TouchableOpacity, Dimensions, ImageBackground } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons, FontAwesome } from '@expo/vector-icons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { LinearGradient } from 'expo-linear-gradient';
import EvilIcons from '@expo/vector-icons/EvilIcons';

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
            className="w-full h-full"
            resizeMode="cover"
          />
        </View>

        <View className="p-3 flex-row justify-between items-start">
          <View className="flex-1 mr-3">
            <Text className="text-base font-outfit-bold text-textprimary mb-1 mt-1" numberOfLines={1}>
              {name || "Static restaurant"}
            </Text>
            <View className="flex-row justify-center mb-3.5">
               <EvilIcons name="location" size={19} color="black" />
              <Text className="text-xs text-textsecondary" numberOfLines={1}>
             {address || "N/A"}
            </Text>
            </View>
          </View>

          <View className="flex-row items-center bg-green-700 rounded-1.5 px-0.5 py-0.5 mt-6">
            <Text className="text-white text-sm font-semibold ml-0.5 mr-1">{rating}</Text>
            <FontAwesome name="star" size={12} color="#ffff" />
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
    width: 160,
    marginBottom: 0,
  },
  imageContainer: {
    position: 'relative',
    height: 120,
  },
 badge: {
  position: 'absolute',
  bottom: 90,
  left: 0,
  height: 20,
  width: 140,
  borderRadius: 0,
  display: "flex",
  flexDirection: "column",

  // ✅ Android shadow
  elevation: 10,

  // ✅ iOS shadow
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 0 },
  shadowOpacity: 0.25,
  shadowRadius: 3.84,
  backgroundColor: "#fff", // required for shadow to show
}
,
  badgeTitle: {
   color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    marginTop:1,
    marginLeft:4,
    fontFamily:"outfit-bold",
  },
  badgeOffer: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  image: {
    width: '100%',
    height: '100%',
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
    fontFamily:"outfit-medium"
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.XS,
    marginTop: 5,
    fontFamily:"outfit-bold"
  },
  distance: {
    fontSize: 12,
    color: COLORS.TEXT_SECONDARY,

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
    paddingHorizontal: 2,
    paddingVertical: 0,
    marginTop: 25  
  },
  ratingText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 0,
    marginRight: 0
  },
});

export default MiniRecommendedCard;
