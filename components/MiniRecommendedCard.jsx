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
    <TouchableOpacity activeOpacity={0.8} onPress={onPress} className="mb-2.5">
      <View className="mx-1 bg-white rounded-5xl overflow-hidden shadow-lg w-40 mb-0.5 border border-gray-200">
        <View className="relative" style={{ height: 120 }}>
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



export default MiniRecommendedCard;
