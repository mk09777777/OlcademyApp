import React, { useState } from "react";
import * as ImagePicker from 'expo-image-picker';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  Image,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { useAuth } from "../../context/AuthContext";
import { API_CONFIG } from '../../config/apiConfig';
import BackRouting from "@/components/BackRouting";

/*
=== ORIGINAL CSS REFERENCE ===
container: {
  padding: 20,
  backgroundColor: "#fff",
  flexGrow: 1,
}

errorContainer: {
  backgroundColor: '#ffeeee',
  padding: 12,
  borderRadius: 8,
  marginBottom: 20,
  borderWidth: 1,
  borderColor: '#ffcccc'
}

errorText: {
  color: '#ff3333',
  textAlign: 'center'
}

ratingDisplay: {
  alignItems: "center",
  marginBottom: 25,
}

title: {
  fontSize: 24,
  fontWeight: "bold",
  color: "#1a1a1a",
  textAlign: 'center',
}

ratingText: {
  fontSize: 18,
  fontWeight: "600",
  marginBottom: 5,
}

starsContainer: {
  flexDirection: "row",
}

star: {
  marginHorizontal: 3,
}

label: {
  fontSize: 16,
  fontWeight: "600",
  marginBottom: 12,
  marginTop: 5,
}

optionContainer: {
  flexDirection: "row",
  flexWrap: "wrap",
  marginBottom: 20,
}

optionButton: {
  borderColor: "#ccc",
  borderWidth: 1,
  borderRadius: 20,
  paddingVertical: 8,
  paddingHorizontal: 14,
  margin: 5,
  backgroundColor: "#F2E8E8",
}

selectedOption: {
  backgroundColor: "#e0f7e9",
  borderColor: "#34a853",
}

optionText: {
  fontSize: 14,
}

selectedText: {
  color: "#34a853",
  fontWeight: "bold",
}

questionRow: {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 18,
}

question: {
  fontSize: 14,
  marginBottom: 8,
}

toggleButton: {
  width: 50,
  height: 25,
  borderRadius: 15,
  backgroundColor: "#ccc",
  justifyContent: "center",
  padding: 2,
}

toggleButtonActive: {
  backgroundColor: "#34a853",
}

toggleSlider: {
  width: 21,
  height: 21,
  borderRadius: 12,
  backgroundColor: "#fff",
  alignSelf: "flex-start",
}

toggleSliderActive: {
  alignSelf: "flex-end",
}

textArea: {
  minHeight: 120,
  borderColor: "#ccc",
  borderWidth: 1,
  borderRadius: 8,
  padding: 12,
  marginBottom: 20,
  fontSize: 15,
}

photoSection: {
  marginBottom: 25,
}

photoButton: {
  padding: 12,
  borderWidth: 1,
  borderColor: "#1a73e8",
  borderRadius: 8,
  marginBottom: 10,
}

photoButtonContent: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 8,
}

photoButtonText: {
  color: "#1a73e8",
  fontSize: 16,
  fontWeight: "500",
}

imagePreviewContainer: {
  position: 'relative',
}

previewImage: {
  width: "101%",
  height: 200,
  borderRadius: 8,
  marginTop: 10,
}

removeImageButton: {
  position: 'absolute',
  top: 20,
  right: 10,
  backgroundColor: 'rgba(0,0,0,0.5)',
  borderRadius: 15,
  width: 30,
  height: 30,
  alignItems: 'center',
  justifyContent: 'center',
}

submitButton: {
  backgroundColor: "#EB2933", 
  padding: 16,
  borderRadius: 8,
  marginBottom: 30,
}

submitButtonContent: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 8,
}

submitButtonDisabled: {
  opacity: 0.7,
}

submitText: {
  color: "#fff",
  fontSize: 16,
  fontWeight: "bold",
}
=== END CSS REFERENCE ===
*/
const feedbackOptions = ["Food", "Ambience", "Service", "Washroom hygiene"];
const questions = [
  "Is the ambient noise comfortable?",
  "Is the service prompt and attentive?",
  "Is the food served at the right temperature?",
];
const REVIEW_TYPES = {
  DINING: 'dining',
  TAKEAWAY: 'takeaway',
  TIFFIN: 'tiffin',
};

export default function WriteReview() {
  const { api, user } = useAuth();
  const params = useLocalSearchParams();
  const router = useRouter();
  const ratingFromRoute = Number(params.rating) || 0;
   const firmId = params.firmId;
  const reviewType = params.reviewType;

  const [selectedOptions, setSelectedOptions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [review, setReview] = useState("");
  const [image, setImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const toggleOption = (option) => {
    setSelectedOptions((prev) =>
      prev.includes(option)
        ? prev.filter((o) => o !== option)
        : [...prev, option]
    );
  };

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert("Permission required", "We need access to your photos to upload images.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const removeImage = () => {
    setImage(null);
  };

const handleSubmit = async () => {
  if (!user?.email) {
    setError("You need to be logged in to submit a review.");
    return;
  }

  if (ratingFromRoute === 0) {
    setError("Please select a star rating.");
    return;
  }

  if (!review.trim()) {
    setError("Please write your review before submitting.");
    return;
  }

  if (!firmId) {
    setError("Restaurant ID is missing. Cannot submit review.");
    return;
  }

  setIsSubmitting(true);
  setError(null);

  try {
    const reviewData = {
      email: user.email,
      date: new Date().toISOString(),
      rating: ratingFromRoute,
      reviewText: review,
      reviewType,
      aspects: {
        selectedOptions,
        questionAnswers: answers
      },
      firm: firmId,
      tiffin: null
    };

    let response;
    
    if (image) {
      const formData = new FormData();
      const filename = image.split('/').pop();
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : 'image';
      
      formData.append('image', {
        uri: image,
        name: filename,
        type
      });
      
      formData.append('data', JSON.stringify({
        newReview: reviewData
      }));

      // Use different endpoints based on review type
      const endpoint = reviewType === "tiffin" 
        ? `/api/reviews/${firmId}`
        : `/api/reviews/firm/${firmId}`;
      

      response = await api.post(`${API_CONFIG.BACKEND_URL}${endpoint}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    } else {
      // Use different endpoints based on review type
      const endpoint = reviewType === 'tiffin' 
        ? `/api/reviews/${firmId}`
        : `/api/reviews/firm/${firmId}`;
      
      response = await api.post(`${API_CONFIG.BACKEND_URL}${endpoint}`, {
        newReview: reviewData
      });
    }

    Alert.alert(
      "Thank You!", 
      `Your ${ratingFromRoute} star review has been submitted.`,
      [
        {
          text: "OK",
          onPress: () => router.back()
        }
      ]
    );
  } catch (error) {
    console.error("Review submission error:", error);
    const errorMsg = error.response?.data?.error || error.message || "Failed to submit review. Please try again.";
    setError(errorMsg);
  } finally {
    setIsSubmitting(false);
  }
};

  return (
   
    <ScrollView 
      contentContainerStyle={{padding: 20, backgroundColor: "#fff", flexGrow: 1}}
      keyboardShouldPersistTaps="handled"
    >
      {error && (
        <View className="bg-red-50 p-3 rounded-lg mb-5 border border-red-200">
          <Text className="text-red-600 text-center">{error}</Text>
        </View>
      )}

      <View className="items-center mb-6">
        <Text className="text-2xl font-bold text-gray-900 text-center">{params.restaurantName || "The Food Workshop"}</Text>
        <Text className="text-lg font-semibold mb-1">Your Rating: {ratingFromRoute}</Text>
        <View className="flex-row">
          {[1, 2, 3, 4, 5].map((val) => (
            <FontAwesome
              key={val}
              name={val <= ratingFromRoute ? "star" : "star-o"}
              size={20}
              color="#FFB800"
              className="mx-1"
            />
          ))}
        </View>
      </View>

      <Text className="text-base font-semibold mb-3 mt-1">Select Tag</Text>
      <View className="flex-row flex-wrap mb-5">
        {feedbackOptions.map((option) => (
          <TouchableOpacity
            key={option}
            className={`border border-gray-300 rounded-full py-2 px-3.5 m-1 ${
              selectedOptions.includes(option) 
                ? 'bg-green-100 border-green-600' 
                : 'bg-red-50'
            }`}
            onPress={() => toggleOption(option)}
            activeOpacity={0.7}
          >
            <Text
              className={`text-sm ${
                selectedOptions.includes(option) 
                  ? 'text-green-600 font-bold' 
                  : 'text-gray-900'
              }`}
            >
              {option}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text className="text-base font-semibold mb-3 mt-1">Tell us more!</Text>
      {questions.map((q) => (
        <View key={q} className="flex-row justify-between items-center mb-4">
          <Text className="text-sm mb-2 flex-1">{q}</Text>
          <TouchableOpacity
            onPress={() => setAnswers(prev => ({...prev, [q]: !prev[q]}))}
            className={`w-12 h-6 rounded-full justify-center p-0.5 ${
              answers[q] ? 'bg-green-600' : 'bg-gray-400'
            }`}
            activeOpacity={0.7}
          >
            <View className={`w-5 h-5 rounded-full bg-white ${
              answers[q] ? 'self-end' : 'self-start'
            }`} />
          </TouchableOpacity>
        </View>
      ))}

      <Text className="text-base font-semibold mb-3 mt-1">Add detailed review</Text>
      <TextInput
        placeholder="Share your experience in detail..."
        className="min-h-[120px] border border-gray-300 rounded-lg p-3 mb-5 text-base"
        value={review}
        onChangeText={setReview}
        multiline={true}
        numberOfLines={4}
        textAlignVertical="top"
      />

      <View className="mb-6">
        <TouchableOpacity 
          className="p-3 border border-blue-600 rounded-lg mb-2" 
          onPress={pickImage}
          activeOpacity={0.7}
        >
          <View className="flex-row items-center justify-center gap-2">
            <MaterialIcons name="add-a-photo" size={20} color="#1a73e8" />
            <Text className="text-blue-600 text-base font-medium">Add photo</Text>
          </View>
        </TouchableOpacity>
        {image && (
          <View className="relative">
            <Image
              source={{ uri: image }}
              className="w-full h-50 rounded-lg mt-2"
            />
            <TouchableOpacity 
              className="absolute top-5 right-2 bg-black/50 rounded-full w-7 h-7 items-center justify-center" 
              onPress={removeImage}
            >
              <MaterialIcons name="close" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        )}
      </View>

      <TouchableOpacity 
        className={`bg-red-600 p-4 rounded-lg mb-8 ${
          isSubmitting ? 'opacity-70' : ''
        }`} 
        onPress={handleSubmit}
        disabled={isSubmitting}
        activeOpacity={0.7}
      >
        {isSubmitting ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <View className="flex-row items-center justify-center gap-2">
            <MaterialIcons name="send" size={20} color="#fff" />
            <Text className="text-white text-base font-bold">Submit Review</Text>
          </View>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

