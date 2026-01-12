import { Fragment } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import Entypo from '@expo/vector-icons/Entypo';

export default function RatingsCalculated({ toggle }) {
  return (
    <View className="flex-1 bg-black/50 justify-end">
      <View className="bg-white rounded-t-3xl p-6">
        <View className="flex-row items-center mb-6">
          <TouchableOpacity onPress={toggle} className="mr-4">
            <Entypo name="circle-with-cross" size={34} color="#2f2f37" />
          </TouchableOpacity>
          <Text className="text-lg font-outfit-bold color-gray-900 flex-1">How are ratings calculated?</Text>
        </View>
        <View className="items-center">
          <Image source={require("../assets/images/dish.jpg")} className="w-24 h-24 rounded-full mb-6" />
          <Text className="text-sm color-gray-700 font-outfit mb-4 text-center leading-5">
            The rating on Zomato is calculated based on a proprietary algorithm instead of a simple average of all reviews.
          </Text>
          <Text className="text-sm color-gray-700 font-outfit mb-8 text-center leading-5">
            This algorithm, aided by machine learning, takes into account recency of experiences and checks for spam or suspicious profiles to ensure genuine ratings.
          </Text>
          <TouchableOpacity onPress={toggle} className="bg-primary py-3 px-8 rounded-lg">
            <Text className="text-white font-outfit-bold text-base">Okay</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
