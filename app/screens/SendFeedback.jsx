import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  Image, 
  ScrollView,
  Alert
} from 'react-native';
import BackRouting from '@/components/BackRouting';

const FeedbackScreen = () => {
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmitFeedback = () => {
    if (!feedback.trim()) return;

    setLoading(true);

    // Simulating backend call
    setTimeout(() => {
      setLoading(false);
      Alert.alert("Thank you!", "Your feedback has been submitted successfully.");

      // Clear input after submit
      setFeedback('');
    }, 800);
  };

  return (
    <View className="flex-1 bg-[#F3F4F6]">
      {/* Back Header */}
      <BackRouting title="Feedback" />

      <ScrollView
        contentContainerStyle={{ padding: 18 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Intro Card */}
        <View className="bg-white rounded-2xl p-5 mb-4 shadow-sm border border-gray-200">
          <Text className="text-gray-900 text-xl font-outfit-bold mb-2">
            Send Feedback
          </Text>
          <Text className="text-gray-500 text-sm leading-6 font-outfit">
            We value your thoughts. Let us know how we can improve your app experience.
          </Text>
        </View>

        {/* Feedback Input */}
        <View className="bg-white rounded-2xl p-5 mb-4 shadow-sm border border-gray-200">
          <Text className="text-gray-900 text-base font-outfit-bold mb-3">
            Enter your feedback
          </Text>

          <TextInput
            className="bg-[#F9FAFB] rounded-xl border border-gray-300 text-gray-900 
                       font-outfit min-h-36 p-4"
            placeholder="Write here..."
            placeholderTextColor="#9CA3AF"
            multiline
            value={feedback}
            onChangeText={setFeedback}
          />
        </View>

        {/* Support Section */}
        <View className="flex-row items-center bg-white rounded-2xl p-4 shadow-sm border border-gray-200 mb-5">
          <Image
            source={{ uri: 'https://cdn-icons-png.flaticon.com/512/3034/3034091.png' }}
            className="w-12 h-12 mr-4"
          />
          <View className="flex-1">
            <Text className="text-gray-900 font-outfit-bold text-base mb-1">
              Need assistance?
            </Text>
            <Text className="text-gray-500 font-outfit text-sm">
              Our support team is always here to help you.
            </Text>
          </View>
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          onPress={handleSubmitFeedback}
          disabled={!feedback.trim() || loading}
          className={`p-4 rounded-xl shadow-sm ${
            feedback.trim() ? 'bg-primary' : 'bg-gray-300'
          }`}
        >
          <Text className="text-white font-outfit-bold text-center text-base">
            {loading ? "Submitting..." : "Submit Feedback"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default FeedbackScreen;
