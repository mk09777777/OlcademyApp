import React, { useState } from "react";
import * as ImagePicker from 'expo-image-picker';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  Image,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { useAuth } from "../../context/AuthContext";
import BackRouting from "@/components/BackRouting";
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

  const [selectedOptions, setSelectedOptions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [review, setReview] = useState("");
  const [image, setImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const reviewType = params.reviewType || REVIEW_TYPES.DINING;

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
        rating: ratingFromRoute,
        reviewText: review,
        reviewType,
        aspects: {
          selectedOptions,
          questionAnswers: answers
        },
        firm: firmId,
        date: new Date().toISOString(),
        days: 1,
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

        response = await api.post(`http://192.168.0.100:3000/api/reviews`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      } else {
        response = await api.post(`http://192.168.0.100:3000/api/reviews`, {
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
      setError(error.response?.data?.message || "Failed to submit review. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
   
    <ScrollView 
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      <View style={styles.ratingDisplay}>
        <Text style={styles.title}>{params.restaurantName || "The Food Workshop"}</Text>
        <Text style={styles.ratingText}>Your Rating: {ratingFromRoute}</Text>
        <View style={styles.starsContainer}>
          {[1, 2, 3, 4, 5].map((val) => (
            <FontAwesome
              key={val}
              name={val <= ratingFromRoute ? "star" : "star-o"}
              size={20}
              color="#FFB800"
              style={styles.star}
            />
          ))}
        </View>
      </View>

      <Text style={styles.label}>What impressed you?</Text>
      <View style={styles.optionContainer}>
        {feedbackOptions.map((option) => (
          <TouchableOpacity
            key={option}
            style={[
              styles.optionButton,
              selectedOptions.includes(option) && styles.selectedOption,
            ]}
            onPress={() => toggleOption(option)}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.optionText,
                selectedOptions.includes(option) && styles.selectedText,
              ]}
            >
              {option}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Tell us more!</Text>
      {questions.map((q) => (
        <View key={q} style={styles.questionRow}>
          <Text style={styles.question}>{q}</Text>
          <View style={styles.thumbRow}>
            <TouchableOpacity
              onPress={() => setAnswers(prev => ({...prev, [q]: false}))}
              style={[
                styles.thumb,
                answers[q] === false && styles.thumbSelected,
              ]}
              activeOpacity={0.7}
            >
              <MaterialIcons 
                name="thumb-down" 
                size={24} 
                color={answers[q] === false ? "#2196F3" : "#ccc"} 
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setAnswers(prev => ({...prev, [q]: true}))}
              style={[
                styles.thumb,
                answers[q] === true && styles.thumbSelected,
              ]}
              activeOpacity={0.7}
            >
              <MaterialIcons 
                name="thumb-up" 
                size={24} 
                color={answers[q] === true ? "#2196F3" : "#ccc"} 
              />
            </TouchableOpacity>
          </View>
        </View>
      ))}

      <Text style={styles.label}>Add detailed review</Text>
      <TextInput
        placeholder="Share your experience in detail..."
        style={styles.textArea}
        value={review}
        onChangeText={setReview}
        multiline={true}
        numberOfLines={4}
        textAlignVertical="top"
      />

      <View style={styles.photoSection}>
        <TouchableOpacity 
          style={styles.photoButton} 
          onPress={pickImage}
          activeOpacity={0.7}
        >
          <View style={styles.photoButtonContent}>
            <MaterialIcons name="add-a-photo" size={20} color="#1a73e8" />
            <Text style={styles.photoButtonText}>Add photo</Text>
          </View>
        </TouchableOpacity>
        {image && (
          <View style={styles.imagePreviewContainer}>
            <Image
              source={{ uri: image }}
              style={styles.previewImage}
            />
            <TouchableOpacity 
              style={styles.removeImageButton} 
              onPress={removeImage}
            >
              <MaterialIcons name="close" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        )}
      </View>

      <TouchableOpacity 
        style={[
          styles.submitButton,
          isSubmitting && styles.submitButtonDisabled
        ]} 
        onPress={handleSubmit}
        disabled={isSubmitting}
        activeOpacity={0.7}
      >
        {isSubmitting ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <View style={styles.submitButtonContent}>
            <MaterialIcons name="send" size={20} color="#fff" />
            <Text style={styles.submitText}>Submit Review</Text>
          </View>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
    flexGrow: 1,
  },
  errorContainer: {
    backgroundColor: '#ffeeee',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ffcccc'
  },
  errorText: {
    color: '#ff3333',
    textAlign: 'center'
  },
  ratingDisplay: {
    alignItems: "center",
    marginBottom: 25,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1a1a1a",
    textAlign: 'center',
  },
  ratingText: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 5,
  },
  starsContainer: {
    flexDirection: "row",
  },
  star: {
    marginHorizontal: 3,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
    marginTop: 5,
  },
  optionContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 20,
  },
  optionButton: {
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 14,
    margin: 5,
  },
  selectedOption: {
    backgroundColor: "#e0f7e9",
    borderColor: "#34a853",
  },
  optionText: {
    fontSize: 14,
  },
  selectedText: {
    color: "#34a853",
    fontWeight: "bold",
  },
  questionRow: {
    marginBottom: 18,
  },
  question: {
    fontSize: 14,
    marginBottom: 8,
  },
  thumbRow: {
    flexDirection: "row",
    gap: 12,
  },
  thumb: {
    padding: 10,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "#ccc",
    minWidth: 60,
    alignItems: "center",
  },
  thumbSelected: {
    backgroundColor: "#d4f1ff",
    borderColor: "#2196F3",
  },
  textArea: {
    minHeight: 120,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    fontSize: 15,
  },
  photoSection: {
    marginBottom: 25,
  },
  photoButton: {
    padding: 12,
    borderWidth: 1,
    borderColor: "#1a73e8",
    borderRadius: 8,
    marginBottom: 10,
  },
  photoButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  photoButtonText: {
    color: "#1a73e8",
    fontSize: 16,
    fontWeight: "500",
  },
  imagePreviewContainer: {
    position: 'relative',
  },
  previewImage: {
    width: "101%",
    height: 200,
    borderRadius: 8,
    marginTop: 10,
  },
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
  },
  submitButton: {
    backgroundColor: "#007e33",
    padding: 16,
    borderRadius: 8,
    marginBottom: 30,
  },
  submitButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});