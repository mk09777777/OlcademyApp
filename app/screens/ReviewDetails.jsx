import React from "react";
import { View, Text, Image, TouchableOpacity, ScrollView, TextInput } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons"; 
import { useGlobalSearchParams, useRouter } from "expo-router";

export default function ReviewDetails() {
  const {name, rating, firmName, cuisines, review, details, date, followers} = useGlobalSearchParams()
  const router = useRouter()
  
  return (
    <ScrollView className="flex-1 bg-gray-50 p-4">
      {/* Header Back Button */}
      <TouchableOpacity
        className="pb-2"
        onPress={() => router.back()}
      >
        <Ionicons name='chevron-back' size={30} color="black"/>
      </TouchableOpacity>

      {/* User Info Header */}
      <View className="flex-row items-center mb-4">
        <MaterialCommunityIcons name='account' size={30} color='#e23845'/>
        <View className="flex-1 ml-3">
          <Text className="text-gray-900 font-outfit-bold text-lg">{name || "User"}</Text>
          <Text className="text-gray-500 font-outfit text-sm">{followers || 0} Followers</Text>
        </View>
        <View className="bg-[#02757A] px-3 py-1 rounded-lg">
          <Text className="text-white font-outfit-bold">{rating || 0}★</Text>
        </View>
      </View>

      {/* Restaurant Card Info */}
      <View className="flex-row bg-white p-4 rounded-lg mb-4 shadow-sm border border-gray-100">
        {/* Note: Ensure this image exists, or use a uri */}
        <Image
          source={require('../../assets/images/menu.jpeg')} // Make sure this path is correct
          className="w-16 h-16 rounded-lg mr-4"
        />
        <View className="flex-1">
          <Text className="text-gray-900 font-outfit-bold text-lg mb-1">{firmName || "Restaurant Name"}</Text>
          <Text className="text-gray-500 font-outfit text-sm mb-1">{cuisines || "Cuisines"}</Text>
          <Text className="text-gray-500 font-outfit text-sm">{details || "Address"}</Text>
        </View>
      </View>

      {/* Review Body */}
      <View className="bg-white p-4 rounded-lg mb-4 border border-gray-100">
        <Text className="text-gray-800 font-outfit text-base leading-6 mb-2">
          {review}
        </Text>
        <Text className="text-gray-400 font-outfit text-xs">{date}</Text>
      </View>

      {/* Action Buttons - FIXED: Replaced style={styles...} with className */}
      <View className="flex-row justify-around bg-white p-4 rounded-lg mb-4 border border-gray-100">
        <TouchableOpacity className="flex-row items-center">
          <Ionicons name="thumbs-up-outline" size={20} color="#007BFF" />
          <Text className="text-[#007BFF] ml-2 font-outfit">Helpful</Text>
        </TouchableOpacity>
        <TouchableOpacity className="flex-row items-center">
          <Ionicons name="chatbubble-outline" size={20} color="#007BFF" />
          <Text className="text-[#007BFF] ml-2 font-outfit">Comment</Text>
        </TouchableOpacity>
        <TouchableOpacity className="flex-row items-center">
          <Ionicons name="share-social-outline" size={20} color="#007BFF" />
          <Text className="text-[#007BFF] ml-2 font-outfit">Share</Text>
        </TouchableOpacity>
      </View>

      {/* Owner Reply Section */}
      <View className="bg-white p-4 rounded-lg mb-4 border border-gray-100">
        <View className="flex-row items-center mb-3">
          <Image
            source={{ uri: "https://via.placeholder.com/50" }}
            className="w-12 h-12 rounded-lg mr-3"
          />
          <Text className="text-gray-900 font-outfit-bold text-base">{firmName}</Text>
        </View>
        <Text className="text-gray-800 font-outfit text-sm leading-5 mb-3">
          Dear {name}, thank you for your review! We hope to see you again soon.
        </Text>
        <Text className="text-gray-500 font-outfit text-sm mb-2">
          Regards, Manager
        </Text>
        <Text className="text-gray-400 font-outfit text-xs">1 day ago</Text>
      </View>

      {/* Input Section */}
      <View className="bg-white p-4 rounded-lg mb-4">
        <TextInput 
            className="border border-gray-300 rounded-lg p-3 text-gray-800 font-outfit" 
            placeholder="Write a comment..."
            placeholderTextColor="#9CA3AF"
        />
      </View>

      {/* Submit Button */}
      <TouchableOpacity
        className="bg-[#e23845] p-4 rounded-lg mb-10 shadow-sm"
      >
        <Text
          className="text-white font-outfit-bold text-center text-lg"
        >
          Submit
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};