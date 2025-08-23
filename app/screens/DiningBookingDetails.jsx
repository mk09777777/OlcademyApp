import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import axios from 'axios';
import { API_CONFIG } from '../../config/apiConfig';

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
        await axios.put(`${API_CONFIG.BACKEND_URL}/api/bookings/cancel/${id}`, {
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
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      {/* <Image source={Booking.image} style={styles.coverImage} /> */}

      <View style={styles.card}>
        <TouchableOpacity 
                      style={{justifyContent:"flex-start"}}
                      onPress={onClose}
                    >
                      <Text style={{fontSize:22,fontWeight:"bold",color:"black",marginBottom:10}}>×</Text>
                    </TouchableOpacity>
        <View style={styles.header}>
          <View style={{ flex: 1 }}>
            <Text style={styles.restaurantName}>{Booking.restaurant}</Text>
            <Text style={styles.location}>{Booking.location}</Text>
          </View>
          {Booking.status === 'accepted' ? (
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>{Booking.status}</Text>
            </View>
          ) : (
            <View style={styles.statusBadgeP}>
              <Text style={styles.statusTextP}>{Booking.status}</Text>
            </View>
          )}
        </View>

        <View style={styles.detailsSection}>
          <Text style={styles.sectionTitle}>Reservation Details</Text>

          <View style={styles.detailRow}>
            <Ionicons name="calendar-outline" size={20} color="#ff4d4d" style={styles.icon} />
            <Text style={styles.detailLabel}>Date:</Text>
            <Text style={styles.detailValue}>{Booking.date}</Text>
          </View>

          <View style={styles.detailRow}>
            <Ionicons name="time-outline" size={20} color="#ff4d4d" style={styles.icon} />
            <Text style={styles.detailLabel}>Time:</Text>
            <Text style={styles.detailValue}>{Booking.time}</Text>
          </View>

          <View style={styles.detailRow}>
            <Ionicons name="people-outline" size={20} color="#ff4d4d" style={styles.icon} />
            <Text style={styles.detailLabel}>Guests:</Text>
            <Text style={styles.detailValue}>{Booking.guests}</Text>
          </View>
        </View>
        {Booking.status === 'pending' && (
          <TouchableOpacity style={styles.cancelButton} onPress={cancelBooking}>
            <Text style={styles.cancelButtonText}>Cancel Booking</Text>
          </TouchableOpacity>
        )}

      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#00000084',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  coverImage: {
    width: '100%',
    height: 220,
    resizeMode: 'cover',
  },
  card: {
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  restaurantName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  location: {
    fontSize: 14,
    color: '#777',
    marginTop: 4,
  },
  statusBadge: {
    backgroundColor: '#e6f4ea',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  statusText: {
    color: '#388e3c',
    fontWeight: 'bold',
    fontSize: 12,
  },
  statusBadgeP: {
    backgroundColor: '#f4e6e6',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  statusTextP: {
    color: '#d32f2f',
    fontWeight: 'bold',
    fontSize: 12,
  },
  detailsSection: {
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#444',
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  icon: {
    marginRight: 8,
  },
  detailLabel: {
    fontSize: 15,
    color: '#555',
    width: 70,
  },
  detailValue: {
    fontSize: 15,
    fontWeight: '500',
    color: '#000',
  },
  cancelButton: {
    marginTop: 24,
    backgroundColor: '#e53935',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default BookingDetailsScreen;
