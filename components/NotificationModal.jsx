import React, { useCallback, useState, Fragment } from 'react';
import { View, Text, Image, TouchableOpacity, Linking } from "react-native";
import NotificationModalStyles from "../styles/ModalNotificationstyles";
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';

// Check if running in development build or Expo Go
const isExpoGo = Constants.appOwnership === 'expo';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function NotificationModal({ toggle }) {

  const checkAndRequestPermission = async () => {
    try {
      if (isExpoGo) {
        console.log('📱 Running in Expo Go - notifications limited');
        await AsyncStorage.setItem('notification_permission', 'limited');
        toggle();
        return;
      }

      const { status: existingStatus } = await Notifications.getPermissionsAsync();

      if (existingStatus === 'granted') {
        console.log('✅ Notification permission already granted.');
        await AsyncStorage.setItem('notification_permission', 'granted');
        toggle(); 
      } else {
        console.log('🔔 Requesting notification permission...');
        const { status: requestedStatus } = await Notifications.requestPermissionsAsync();

        if (requestedStatus === 'granted') {
          console.log('✅ Notification permission granted!');
          await AsyncStorage.setItem('notification_permission', 'granted');
          toggle(); 
        } else {
          console.log('❌ Notification permission denied.');
        }
      }
    } catch (error) {
      console.error('❌ Error handling notification permission:', error);
    }
  };


  const dismissModal = async () => {
    try {
      await AsyncStorage.setItem('notification_modal_dismissed', 'true');
  
      toggle();
    } catch (error) {
      console.error('Error dismissing notification modal:', error);
    }
  };


  return (
    <Fragment>
      <View style={NotificationModalStyles.background}>
        <View style={NotificationModalStyles.mainContainer}>
          <Image
            style={NotificationModalStyles.Notifimg}
            source={require("../assets/images/notification.jpeg")}
          />
          <Text style={NotificationModalStyles.NotifText}>
            Want to stay updated about offers, order status and more?
          </Text>
          <TouchableOpacity onPress={checkAndRequestPermission} style={NotificationModalStyles.NotifButton}>
            <Text style={NotificationModalStyles.NotifText2}>
              Yes, enable notifications
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={dismissModal} style={NotificationModalStyles.NotifButton2}>
            <Text style={NotificationModalStyles.NotNowText}>
              Not now
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Fragment>
  );
}
