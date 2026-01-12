import React, { useCallback, useState, Fragment } from 'react';
import { View, Text, Image, TouchableOpacity, Linking } from "react-native";
// import NotificationModalStyles from "../styles/ModalNotificationstyles";
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { log, error as logError } from '../utils/logger';

// Check if running in development build or Expo Go
const isExpoGo = Constants.appOwnership === 'expo';

export default function NotificationModal({ toggle }) {

  const checkAndRequestPermission = async () => {
    try {
      if (isExpoGo) {
        log('📱 Running in Expo Go - notifications limited');
        await AsyncStorage.setItem('notification_permission', 'limited');
        toggle();
        return;
      }

      const { status: existingStatus } = await Notifications.getPermissionsAsync();

      if (existingStatus === 'granted') {
        log('✅ Notification permission already granted.');
        await AsyncStorage.setItem('notification_permission', 'granted');
        toggle(); 
      } else {
        log('🔔 Requesting notification permission...');
        const { status: requestedStatus } = await Notifications.requestPermissionsAsync();

        if (requestedStatus === 'granted') {
          log('✅ Notification permission granted!');
          await AsyncStorage.setItem('notification_permission', 'granted');
          toggle(); 
        } else {
          log('❌ Notification permission denied.');
        }
      }
    } catch (error) {
      logError('❌ Error handling notification permission:', error);
    }
  };


  const dismissModal = async () => {
    try {
      await AsyncStorage.setItem('notification_modal_dismissed', 'true');
  
      toggle();
    } catch (error) {
      logError('Error dismissing notification modal:', error);
    }
  };


  return (
    <Fragment>
      <View className="bg-black/50 flex-1 justify-center items-center">
        <View className="flex flex-col p-2.5 rounded-lg mx-5 bg-white">
          <Image
            className="w-full mx-1.5"
            style={{ aspectRatio: 16/9, resizeMode: 'contain' }}
            source={require("../assets/images/notification.jpeg")}
          />
          <Text className="text-base text-black font-semibold mx-2.5" style={{fontFamily: 'outfit-medium'}}>
            Want to stay updated about offers, order status and more?
          </Text>
          <TouchableOpacity onPress={checkAndRequestPermission} className="mx-4 flex flex-col justify-center items-center p-2.5 rounded-lg bg-red-500 mt-2.5">
            <Text className="text-white text-base font-semibold" style={{fontFamily: 'outfit-medium'}}>
              Yes, enable notifications
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={dismissModal} className="mx-4 flex flex-col justify-center items-center p-2.5 rounded-lg bg-white mt-1.5">
            <Text className="text-red-500 text-base font-semibold" style={{fontFamily: 'outfit-medium'}}>
              Not now
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Fragment>
  );
}
