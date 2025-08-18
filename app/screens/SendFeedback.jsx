import React, { useState } from 'react';
import styles from '../../styles/SendFeedback';
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
      <BackRouting tittle= "FeedBack"/>
      <TouchableOpacity style={styles.backButton}>
        <Text style={styles.backArrow}>{'←'}</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Send Feedback</Text>
      <Text style={styles.description}>
        Tell us what you love about the app, or what we could be doing better.
      </Text>

      <Text style={styles.label}>Enter feedback</Text>
      <TextInput
        style={styles.input}
        placeholder=""
        placeholderTextColor="#ccc"
        multiline
        value={feedback}
        onChangeText={setFeedback}
      />

      <View style={styles.helpCard}>
        <Image
          source={{
            uri: 'https://cdn-icons-png.flaticon.com/512/1828/1828884.png',
          }}
          style={styles.helpIcon}
        />
        <View style={{ flex: 1 }}>
          <Text style={styles.helpTitle}>Need help with your order?</Text>
          <Text style={styles.helpDescription}>
            Get instant help from our customer support team
          </Text>
        </View>
      </View>

      <TouchableOpacity
        style={[
          styles.submitButton,
          {
            backgroundColor: feedback.trim()
              ? '#f0435f'
              : '#c4c4c4',
          },
        ]}
        disabled={!feedback.trim()}
      >
        <Text style={styles.submitText}>Submit feedback</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};


export default FeedbackScreen;
