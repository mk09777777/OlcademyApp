import React from "react";
import { View, Text, Image, TouchableOpacity, ScrollView, TextInput } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons"; 
import { useGlobalSearchParams, useRouter } from "expo-router";
import { styles } from "@/styles/ReviewDetailsStyles";

export default function ReviewDetails() {
  const {name, rating, firmName, cuisines, review, details, date, followers} = useGlobalSearchParams()
  const router = useRouter()
  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity
        style={{paddingBottom: 8}}
        onPress={() => router.back()}
      >
        <Ionicons name='chevron-back' size={30}/>
      </TouchableOpacity>
      <View style={styles.header}>
        <MaterialCommunityIcons name='account' size={30} color='#e23845'/>
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{name}</Text>
          <Text style={styles.userFollowers}>{followers} Followers</Text>
        </View>
        <View style={styles.rating}>
          <Text style={styles.ratingText}>{rating}★</Text>
        </View>
      </View>

      <View style={styles.restaurantInfo}>
        <Image
          source={require('@/assets/images/placeholder.png')}
          style={styles.restaurantImage}
        />
        <View>
          <Text style={styles.restaurantName}>{firmName}</Text>
          <Text style={styles.restaurantDetails}>{cuisines}</Text>
          <Text style={styles.restaurantLocation}>{details}</Text>
        </View>
      </View>

      <View style={styles.reviewContent}>
        <Text style={styles.reviewText}>
          {review}
        </Text>
        <Text style={styles.reviewDate}>{date}</Text>
      </View>

      <View style={styles.actionButtons}>
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

      <View style={styles.responseSection}>
        <View style={styles.responseHeader}>
          <Image
            source={{ uri: "https://via.placeholder.com/50" }}
            style={styles.restaurantImage}
          />
          <Text style={styles.responseTitle}>{firmName}</Text>
        </View>
        <Text style={styles.responseText}>
          Dear Mr Biswajit, Greetings from Topnotch - Zoris Boutique Hotel!! Thank you for your 5-star Review :)
          Please visit us again and we hope your experience is shared within your close group, friends, and family as well.
          Keep coming and enjoy our hospitality. Many many thanks for your review.
        </Text>
        <Text style={styles.responseFooter}>
          Thank You
          {"\n"}Regards, Biswajit Rakshit
          {"\n"}+91-81180-95109
          {"\n"}GM
        </Text>
        <Text style={styles.responseDate}>1 day ago</Text>
      </View>

      <View style={styles.commentInput}>
        <TextInput style={styles.commentPlaceholder} placeholder="Write a comment..."/>
      </View>
      <TouchableOpacity
        style={styles.submitButton}
      >
        <Text
          style={styles.submitButtonText}
        >
          Submit
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};