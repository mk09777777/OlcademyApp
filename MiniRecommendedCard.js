import React from 'react';
import { View, TouchableOpacity, ImageBackground } from 'react-native';
import { Text } from 'react-native-paper';
import { FontAwesome } from '@expo/vector-icons';
import EvilIcons from '@expo/vector-icons/EvilIcons';

const MiniRecommendedCard = ({ name, address, image, rating, onPress }) => {
  return (
    <TouchableOpacity activeOpacity={0.8} onPress={onPress} className="mb-0">
      <View className="mx-1.5 bg-white rounded-2xl shadow-sm w-40 mb-0" style={{ elevation: 3 }}>
        <View className="relative h-30" style={{ overflow: 'hidden', borderTopLeftRadius: 16, borderTopRightRadius: 16 }}>
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
            <Text className="text-base font-outfit-bold text-textprimary mb-1" numberOfLines={1}>
              {name || "Static restaurant"}
            </Text>
            <View className="flex-row items-center">
               <EvilIcons name="location" size={16} color="black" />
              <Text className="text-xs text-textsecondary ml-1" numberOfLines={1}>
             {address || "N/A"}
            </Text>
            </View>
          </View>

          <View className="flex-row items-center bg-green-700 rounded px-1 py-0.5">
            <Text className="text-white text-xs font-semibold mr-1">{rating}</Text>
            <FontAwesome name="star" size={10} color="#ffff" />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default MiniRecommendedCard;