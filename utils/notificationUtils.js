import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { Alert } from 'react-native';

// Check if running in development build or Expo Go
export const isExpoGo = Constants.appOwnership === 'expo';

// Set up notification handler only for development builds
export const setupNotificationHandler = () => {
  if (!isExpoGo) {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      }),
    });
  }
};

// Schedule notification with fallback for Expo Go
export const scheduleNotification = async (title, body, triggerSeconds = 1) => {
  try {
    if (!isExpoGo) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          sound: true,
          priority: Notifications.AndroidNotificationPriority.HIGH,
        },
        trigger: {
          seconds: triggerSeconds,
        },
      });
      console.log('✅ Notification scheduled:', title);
    } else {
      // Fallback for Expo Go - show alert instead
      console.log('📱 Notification would be shown:', title, body);
      Alert.alert(title, body);
    }
  } catch (error) {
    console.error('❌ Error scheduling notification:', error);
    // Fallback to alert if notification fails
    Alert.alert(title, body);
  }
};

// Request notification permissions with Expo Go handling
export const requestNotificationPermissions = async () => {
  try {
    if (isExpoGo) {
      console.log('📱 Running in Expo Go - notifications limited');
      return { status: 'limited', canAskAgain: false };
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    
    if (existingStatus === 'granted') {
      return { status: 'granted', canAskAgain: false };
    }

    const { status } = await Notifications.requestPermissionsAsync();
    return { status, canAskAgain: status !== 'denied' };
  } catch (error) {
    console.error('❌ Error requesting notification permissions:', error);
    return { status: 'error', canAskAgain: false };
  }
};

// Check notification permissions
export const checkNotificationPermissions = async () => {
  try {
    if (isExpoGo) {
      return { status: 'limited' };
    }

    const { status } = await Notifications.getPermissionsAsync();
    return { status };
  } catch (error) {
    console.error('❌ Error checking notification permissions:', error);
    return { status: 'error' };
  }
};

// Add notification response listener with Expo Go handling
export const addNotificationResponseListener = (callback) => {
  if (isExpoGo) {
    console.log('📱 Notification response handling limited in Expo Go');
    return { remove: () => {} };
  }

  return Notifications.addNotificationResponseReceivedListener(callback);
};