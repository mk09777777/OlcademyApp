import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView } from 'react-native';
import BackRouting from '@/components/BackRouting';

const FeedbackScreen = () => {
  const [feedback, setFeedback] = useState('');

  return (
    <View className="flex-1 bg-background">
      <BackRouting title="Feedback" />
      <ScrollView contentContainerStyle={{ padding: 16 }} showsVerticalScrollIndicator={false}>
        <View className="bg-white rounded-lg border border-border p-4 mb-4">
          <Text className="text-textprimary text-xl font-outfit-bold mb-2">Send feedback</Text>
          <Text className="text-textsecondary text-sm font-outfit leading-6">
            Tell us what you love about the app, or what we could be doing better.
          </Text>
        </View>

        <View className="bg-white rounded-lg border border-border p-4 mb-4">
          <Text className="text-textprimary text-base font-outfit-bold mb-3">Enter feedback</Text>
          <TextInput
            className="bg-background rounded-lg border border-border text-textprimary font-outfit min-h-32 p-4"
            placeholder="Share your thoughts"
            placeholderTextColor="#999"
            multiline
            value={feedback}
            onChangeText={setFeedback}
          />
        </View>

        <View className="flex-row bg-white p-4 rounded-lg border border-border mb-4">
          <Image
            source={{ uri: 'https://cdn-icons-png.flaticon.com/512/1828/1828884.png' }}
            className="w-12 h-12 mr-4"
          />
          <View className="flex-1">
            <Text className="text-textprimary font-outfit-bold text-base mb-1">Need help with your order?</Text>
            <Text className="text-textsecondary font-outfit text-sm">
              Get instant help from our customer support team.
            </Text>
          </View>
        </View>

        <TouchableOpacity
          className={`p-4 rounded-lg ${feedback.trim() ? 'bg-primary' : 'bg-gray-300'}`}
          disabled={!feedback.trim()}
        >
          <Text className="text-white font-outfit-bold text-center">Submit feedback</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default FeedbackScreen;
