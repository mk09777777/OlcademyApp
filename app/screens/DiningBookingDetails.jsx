import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import axios from 'axios';
import { API_CONFIG } from '../../config/apiConfig';
import { API_ENDPOINTS } from '../../config/api';

// Check if running in development build or Expo Go
const isExpoGo = Constants.appOwnership === 'expo';

if (!isExpoGo) {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
}

const BookingDetailsScreen = ({
  Rname,
  Raddress,
  guestes,
  name,
  Formatteddate,
  timeSlot,
  status,
  id,
  image,
  onClose,
}) => {

  const [enableAll, setEnableAll] = useState(false);
  const [promosPush, setPromosPush] = useState(false);
  const [promosWhatsapp, setPromosWhatsapp] = useState(false);
  const [socialPush, setSocialPush] = useState(false);
  const [ordersPush, setOrdersPush] = useState(false);
  const [ordersWhatsapp, setOrdersWhatsapp] = useState(false);

  const initialState = useRef({
    enableAll: false,
    promosPush: false,
    promosWhatsapp: false,
    socialPush: false,
    ordersPush: false,
    ordersWhatsapp: false,
  });

  const Booking = {
    restaurant: Rname || 'Unknown Restaurant',
    location: Raddress || 'Unknown Location',
    date: Formatteddate || 'N/A',
    time: timeSlot || 'N/A',
    guests: guestes || 'N/A',
    name: name || 'N/A',
    image:
      typeof image === 'string' && image.startsWith('http')
        ? { uri: image }
        : require('../../assets/images/barger.jpg'),
    status: status || 'N/A',
  };

  const fetchInitialSettings = async () => {
    try {
      const response = await fetch(`${API_CONFIG.BACKEND_URL}/api/getnotifications`, {
        method: 'GET',
        credentials: 'include',
      });
      const settings = await response.json();
      setEnableAll(settings.enableAll);
      setPromosPush(settings.promoPush);
      setPromosWhatsapp(settings.promoWhatsapp);
      setSocialPush(settings.socialPush);
      setOrdersPush(settings.orderPush);
      setOrdersWhatsapp(settings.orderWhatsapp);
      initialState.current = {
        enableAll: settings.enableAll,
        promosPush: settings.promoPush,
        promosWhatsapp: settings.promoWhatsapp,
        socialPush: settings.socialPush,
        ordersPush: settings.orderPush,
        ordersWhatsapp: settings.orderWhatsapp,
      };
    } catch (error) {
      console.error('Error fetching notification settings', error);
    }
  };

  useEffect(() => {
    fetchInitialSettings();
  }, []);

  const UploadNotifications = async () => {
    const now = new Date();
    const formattedDate = now.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    const formattedTime = now.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });

    const uploadData = {
      title: 'Table booking deleted',
      description: `Your table booked is canceled by you at ${Rname} on ${formattedDate} for ${guestes} guests at ${timeSlot}`,
      time: formattedTime,
    };

    try {
      await axios.post(`${API_CONFIG.BACKEND_URL}/api/postNotificationsInfo`, uploadData, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      });

      // Only schedule notifications in development builds, not Expo Go
      if (!isExpoGo) {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: uploadData.title,
            body: uploadData.description,
            sound: true,
            priority: Notifications.AndroidNotificationPriority.HIGH,
          },
          trigger: {
            seconds: 1,
          },
        });
      } else {
        console.log('📱 Notification would be shown:', uploadData.title, uploadData.description);
        Alert.alert(uploadData.title, uploadData.description);
      }
    } catch (error) {
      console.log('Error in uploading the notification', error.message);
    }
  };

  const handleCancel = async () => {
    if (status === 'accepted') {
      Alert.alert("Booking is accepted, you can't cancel it");
    } else {
      try {
        const url = `${API_CONFIG.BACKEND_URL}${API_ENDPOINTS.DiningBooking.CANCEL(id)}`;
        await axios.put(url, {
          withCredentials: true,
        });
        if (ordersPush) {
          UploadNotifications();
        }
        onClose && onClose();
      } catch (error) {
        console.log('Error in deleting the booking', error);
      }
    }
  };

  const cancelBooking = () => {
    Alert.alert('Cancel Booking', 'Are you sure you want to cancel this booking?', [
      { text: 'No', style: 'cancel' },
      { text: 'Yes', onPress: handleCancel },
    ]);
  };

  return (
    <ScrollView 
      className="flex-1 bg-black/50"
      contentContainerStyle={{ flex: 1, justifyContent: 'center' }}
    >
      {/* <Image source={Booking.image} className="w-full h-55" style={{ resizeMode: 'cover' }} /> */}

      <View className="bg-white m-4 rounded-2xl p-4 shadow-lg">
        <TouchableOpacity 
          className="justify-start"
          onPress={onClose}
        >
          <Text className="text-2xl font-bold text-black mb-2.5">×</Text>
        </TouchableOpacity>
        <View className="flex-row items-start mb-4">
          <View className="flex-1">
            <Text className="text-2xl font-bold text-gray-800">{Booking.restaurant}</Text>
            <Text className="text-sm text-gray-500 mt-1">{Booking.location}</Text>
          </View>
          {Booking.status === 'accepted' ? (
            <View className="bg-green-50 px-2.5 py-1 rounded-3xl self-start">
              <Text className="text-green-700 font-bold text-xs">{Booking.status}</Text>
            </View>
          ) : (
            <View className="bg-red-50 px-2.5 py-1 rounded-3xl self-start">
              <Text className="text-red-700 font-bold text-xs">{Booking.status}</Text>
            </View>
          )}
        </View>

        <View className="mt-2 border-t border-gray-200 pt-4">
          <Text className="text-base font-bold text-gray-700 mb-3">Reservation Details</Text>

          <View className="flex-row items-center mb-2.5">
            <Ionicons name="calendar-outline" size={20} color="#ff4d4d" className="mr-2" />
            <Text className="text-base text-gray-600 w-17.5">Date:</Text>
            <Text className="text-base font-medium text-black">{Booking.date}</Text>
          </View>

          <View className="flex-row items-center mb-2.5">
            <Ionicons name="time-outline" size={20} color="#ff4d4d" className="mr-2" />
            <Text className="text-base text-gray-600 w-17.5">Time:</Text>
            <Text className="text-base font-medium text-black">{Booking.time}</Text>
          </View>

          <View className="flex-row items-center mb-2.5">
            <Ionicons name="people-outline" size={20} color="#ff4d4d" className="mr-2" />
            <Text className="text-base text-gray-600 w-17.5">Guests:</Text>
            <Text className="text-base font-medium text-black">{Booking.guests}</Text>
          </View>
        </View>
        {Booking.status === 'pending' && (
          <TouchableOpacity className="mt-6 bg-red-600 py-3 rounded-lg items-center" onPress={cancelBooking}>
            <Text className="text-white text-base font-bold">Cancel Booking</Text>
          </TouchableOpacity>
        )}

      </View>
    </ScrollView>
  );
};

/* Original CSS Reference:
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#00000084' },
  contentContainer: { flex: 1, justifyContent: 'center' },
  coverImage: { width: '100%', height: 220, resizeMode: 'cover' },
  card: { backgroundColor: '#fff', margin: 16, borderRadius: 16, padding: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 6, elevation: 3 },
  header: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 16 },
  restaurantName: { fontSize: 22, fontWeight: 'bold', color: '#333' },
  location: { fontSize: 14, color: '#777', marginTop: 4 },
  statusBadge: { backgroundColor: '#e6f4ea', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, alignSelf: 'flex-start' },
  statusText: { color: '#388e3c', fontWeight: 'bold', fontSize: 12 },
  statusBadgeP: { backgroundColor: '#f4e6e6', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, alignSelf: 'flex-start' },
  statusTextP: { color: '#d32f2f', fontWeight: 'bold', fontSize: 12 },
  detailsSection: { marginTop: 8, borderTopWidth: 1, borderTopColor: '#eee', paddingTop: 16 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#444', marginBottom: 12 },
  detailRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  icon: { marginRight: 8 },
  detailLabel: { fontSize: 15, color: '#555', width: 70 },
  detailValue: { fontSize: 15, fontWeight: '500', color: '#000' },
  cancelButton: { marginTop: 24, backgroundColor: '#e53935', paddingVertical: 12, borderRadius: 8, alignItems: 'center' },
  cancelButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});
*/

export default BookingDetailsScreen;
