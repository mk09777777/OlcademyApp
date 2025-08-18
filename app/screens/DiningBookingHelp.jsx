import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import styles from '../../styles/DiningBookingHelp';
import BackRouting from '@/components/BackRouting';
const DiningBookingHelp = () => {
  return (
    <View style={styles.container}>
      <BackRouting tittle="Dinning Booking Help"/>
      <ScrollView contentContainerStyle={styles.chatContainer}>
        {/* Greeting Message */}
        <View style={styles.messageBubble}>
          <Text style={styles.messageText}>Hi Shrija, Welcome to Zomato dining chat support.</Text>
          <Text style={styles.timeText}>9:05 PM</Text>
        </View>

        {/* Prompt Message */}
        <View style={styles.messageBubble}>
          <Text style={styles.messageText}>Please select the issue that you need support with:</Text>
          <Text style={styles.timeText}>9:05 PM</Text>
        </View>

        {/* Options */}
        <TouchableOpacity style={styles.option}>
          <Text style={styles.optionText}>I have an issue with my dining booking</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.option}>
          <Text style={styles.optionText}>I have a payment related issue</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.option}>
          <Text style={styles.optionText}>I made a mistake while making a payment</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.option}>
          <Text style={styles.optionText}>I have a food delivery issue</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};



export default DiningBookingHelp;
