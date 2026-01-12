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
    <TouchableOpacity activeOpacity={0.8} onPress={onPress} className="mb-2.5 mr-1.5">
      <View className="mx-1.5 bg-white rounded-[19px] overflow-hidden w-40 mb-0.5 shadow-md shadow-black" >
        <View className="relative h-[120px]">
          <ImageBackground
            source={
              image
                ? { uri: Array.isArray(image) ? image[0] : image }
                : require('../assets/images/biryani.png')
            }
            className="w-full h-full"
            resizeMode="cover"
          />
          {/* <LinearGradient
            colors={[
              '#D02433',
              '#E03A48',
              '#AE1E2A'
            ]}
            start={{ x: 0, y: 1 }}
            end={{ x: 1, y: 0 }}
            style={styles.badge}
          >
            <View style={{display:"flex",flexDirection:"row",alignItems:"center",marginLeft:4}}>
            <Text style={styles.badgeTitle} >
              Flat 20% OFF
            </Text>
            </View> */}
            {/* <Text style={styles.badgeOffer}>Flat 20% OFF</Text> */}
          {/* </LinearGradient> */}
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

        <View className="p-3 flex-row justify-between items-start">
          <View className="flex-1 mr-3">
            <Text className="text-base font-extrabold text-[#212121] mb-1 mt-1.5" style={{ fontFamily: 'outfit-bold' }} numberOfLines={1}>
              {name || "Static restaurant"}
            </Text>
            <View className="flex-row justify-center mb-3.5">
               <EvilIcons name="location" size={19} color="black" />
              <Text className="text-xs text-[#757575]" numberOfLines={1}>
             {address || "N/A"}
            </Text>
            </View>
          </View>

          <View className="flex-row items-center bg-[rgb(4,116,19)] rounded-md px-0.5 py-0.5 mt-6">
            <Text className="text-white text-sm font-semibold ml-0.5 mr-1">{rating}</Text>
            <FontAwesome name="star" size={12} color="#ffff" />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};



export default MiniRecommendedCard;