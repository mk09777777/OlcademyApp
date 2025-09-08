import React, { useState } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useAuth } from "../../context/AuthContext";
import { useSafeNavigation } from "@/hooks/navigationPage";
import BackRouting from "@/components/BackRouting";
const REVIEW_TYPES = {
  DINING: 'dining',
  TIFFIN: 'tiffin',
  TAKEAWAY: 'takeaway'
};

export default function RatingScreen() {
  const { user, profileData } = useAuth();
  const currentUserData = profileData?.email ? profileData : (user ? { username: user } : null);
  const params = useLocalSearchParams();
  const firmId = params.firmId;
  const reviewType = params.reviewType;
  console.log(reviewType)
  const [rating, setRating] = useState(0);
  const { safeNavigation } = useSafeNavigation();

  const handleRating = (value) => {
    if (!user?.email) {
      Alert.alert("Login Required", "You need to be logged in to submit a review.");
      return;
    }
    
    setRating(value);
    safeNavigation({
      pathname: "/screens/Userreview",
      params: {
        rating: value,
        firmId: firmId,
        reviewType: reviewType,
        restaurantName: params.restaurantName,
          currentUser: currentUserData 

      }
    });
  };

  return (
  <View style={styles.container}>
    {/* Back button at top-left */}
    <View style={styles.backContainer}>
      <BackRouting />
    </View>

    {/* Centered content */}
    <View style={styles.contentContainer}>
      <Image
        source={{
          uri: "https://cdn-icons-png.flaticon.com/512/3075/3075977.png",
        }}
        style={styles.image}
      />
      <Text style={styles.title}>{params.restaurantName || "The Food Workshop"}</Text>
      <View style={styles.underline} />
      <Text style={styles.subtitle}>How was your {reviewType} experience?</Text>

      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((val) => (
          <TouchableOpacity
            key={val}
            onPress={() => handleRating(val)}
            activeOpacity={0.7}
          >
            <FontAwesome
              name={val <= rating ? "star" : "star-o"}
              size={40}
              color="#FFB800"
              style={styles.star}
            />
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.reviewTypeText}>
        Reviewing as: {reviewType}
      </Text>
    </View>
  </View>
);

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  image: {
    width: 160,
    height: 160,
    marginBottom: 30,
    borderRadius: 80,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1a1a1a",
    textAlign: 'center',
  },
  underline: {
    width: 50,
    height: 3,
    backgroundColor: "#FFD700",
    marginVertical: 8,
    borderRadius: 2,
  },
  subtitle: {
    fontSize: 18,
    color: "#1a1a1a",
    marginBottom: 30,
    textAlign: 'center',
  },
  starsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  star: {
    marginHorizontal: 10,
  },
  reviewTypeText: {
    marginTop: 20,
    fontSize: 16,
    color: "#666",
    fontStyle: 'italic'
  },
  backContainer: {
  position: 'absolute',
  top: 20,
  left: 0,
  zIndex: 10,
},
contentContainer: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  paddingHorizontal: 20,
},

});