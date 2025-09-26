import React, { useState } from 'react';

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
} from 'react-native';
import BackRouting from '@/components/BackRouting';
const FeedbackScreen = () => {
  const [feedback, setFeedback] = useState('');

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <BackRouting style={styles.backButtonFeedBack} tittle="FeedBack"/>
      

      <Text style={styles.title}>Send Feedback</Text>
      <Text style={styles.description}>
        Tell us what you love about the app, or what we could be doing better.
      </Text>

      <Text className="text-textprimary text-base font-outfit-bold mb-2">Enter feedback</Text>
      <TextInput
        className="bg-white p-4 rounded-lg border border-border text-textprimary font-outfit min-h-32 mb-6"
        placeholder=""
        placeholderTextColor="#ccc"
        multiline
        value={feedback}
        onChangeText={setFeedback}
      />

      <View className="flex-row bg-white p-4 rounded-lg border border-border mb-6">
        <Image
          source={{
            uri: 'https://cdn-icons-png.flaticon.com/512/1828/1828884.png',
          }}
          className="w-12 h-12 mr-4"
        />
        <View style={{ flex: 1 }}>
          <Text className="text-textprimary font-outfit-bold text-base mb-1">Need help with your order?</Text>
          <Text className="text-textsecondary font-outfit text-sm">
            Get instant help from our customer support team
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
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  backButtonFeedBack: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    fontFamily: 'outfit-bold',
    marginTop: 20,
  },
  description: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
    lineHeight: 22,
    fontFamily: 'outfit',
  },
});

export default FeedbackScreen;
