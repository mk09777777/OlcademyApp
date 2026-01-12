import React from "react";
import { View, Text, Image, TouchableOpacity, ScrollView, TextInput } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons"; 
import { useGlobalSearchParams, useRouter } from "expo-router";


export default function ReviewDetails() {
  const {name, rating, firmName, cuisines, review, details, date, followers} = useGlobalSearchParams()
  const router = useRouter()
  return (
    <ScrollView className="flex-1 bg-background p-4">
      <TouchableOpacity
        className="pb-2"
        onPress={() => router.back()}
      >
        <Ionicons name='chevron-back' size={30}/>
      </TouchableOpacity>
      <View className="flex-row items-center mb-4">
        <MaterialCommunityIcons name='account' size={30} color='#e23845'/>
        <View className="flex-1 ml-3">
          <Text className="text-textprimary font-outfit-bold text-lg">{name}</Text>
          <Text className="text-textsecondary font-outfit text-sm">{followers} Followers</Text>
        </View>
        <View className="bg-primary px-3 py-1 rounded-lg">
          <Text className="text-white font-outfit-bold">{rating}★</Text>
        </View>
      </View>

      <View className="flex-row bg-white p-4 rounded-lg mb-4 shadow-sm">
        <Image
          source={require('@/assets/images/placeholder.png')}
          className="w-16 h-16 rounded-lg mr-4"
        />
        <View>
          <Text className="text-textprimary font-outfit-bold text-lg mb-1">{firmName}</Text>
          <Text className="text-textsecondary font-outfit text-sm mb-1">{cuisines}</Text>
          <Text className="text-textsecondary font-outfit text-sm">{details}</Text>
        </View>
      </View>

      <View className="bg-white p-4 rounded-lg mb-4">
        <Text className="text-textprimary font-outfit text-base leading-6 mb-2">
          {review}
        </Text>
        <Text className="text-textsecondary font-outfit text-xs">{date}</Text>
      </View>

      <View className="flex-row justify-around bg-white p-4 rounded-lg mb-4">
        <TouchableOpacity style={styles.button}>
          <Ionicons name="thumbs-up-outline" size={20} color="#007BFF" />
          <Text style={styles.buttonText}>Helpful</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Ionicons name="chatbubble-outline" size={20} color="#007BFF" />
          <Text style={styles.buttonText}>Comment</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Ionicons name="share-outline" size={20} color="#007BFF" />
          <Text style={styles.buttonText}>Share</Text>
        </TouchableOpacity>
      </View>

      <View className="bg-white p-4 rounded-lg mb-4">
        <View className="flex-row items-center mb-3">
          <Image
            source={{ uri: "https://via.placeholder.com/50" }}
            className="w-12 h-12 rounded-lg mr-3"
          />
          <Text className="text-textprimary font-outfit-bold text-base">{firmName}</Text>
        </View>
        <Text className="text-textprimary font-outfit text-sm leading-5 mb-3">
          Dear Mr Biswajit, Greetings from Topnotch - Zoris Boutique Hotel!! Thank you for your 5-star Review :)
          Please visit us again and we hope your experience is shared within your close group, friends, and family as well.
          Keep coming and enjoy our hospitality. Many many thanks for your review.
        </Text>
        <Text className="text-textsecondary font-outfit text-sm mb-2">
          Thank You
          {"\n"}Regards, Biswajit Rakshit
          {"\n"}+91-81180-95109
          {"\n"}GM
        </Text>
        <Text className="text-textsecondary font-outfit text-xs">1 day ago</Text>
      </View>

      <View className="bg-white p-4 rounded-lg mb-4">
        <TextInput className="border border-border rounded-lg p-3 text-textprimary font-outfit" placeholder="Write a comment..."/>
      </View>
      <TouchableOpacity
        className="bg-primary p-4 rounded-lg"
      >
        <Text
          className="text-white font-outfit-bold text-center"
        >
          Submit
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};