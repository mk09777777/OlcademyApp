import React, { useState, useEffect } from 'react';
import { ScrollView, Text, View, TouchableOpacity, FlatList, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import axios from 'axios';
import styles from '../../styles/DiningBooking';
import BackRouting from '@/components/BackRouting';
import BookingCard from '../../Card/TableBookingCard';
import { useSafeNavigation } from '@/hooks/navigationPage';
import BookingDetailsScreen from "./DiningBookingDetails"
const BookingsScreen = () => {
  const router = useRouter();
  const [userBookings, setUserBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('ALL');
  const { safeNavigation } = useSafeNavigation();
  const [diningBookingModal, setDiningBookingModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  useEffect(() => {
    fetchDiningBookings();
  }, []);

  const fetchDiningBookings = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://192.168.0.101:3000/api/bookings/userId', {
        withCredentials: true,
      });
      console.log('Fetched bookings:', JSON.stringify(response.data, null, 2));
      const bookingsArray = response.data?.data || [];
      setUserBookings(bookingsArray);
    } catch (error) {
      console.error('Error fetching user bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBookingPress = (item) => {
    const {
      firm,
      guests,
      username,
      ScheduleDate,
      timeSlot,
      status,
      _id,
    } = item;

    const parsedDate = new Date(ScheduleDate);
    const formattedDate = isNaN(parsedDate.getTime())
      ? 'Invalid Date'
      : parsedDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });

    setSelectedBooking({
      Rname: firm?.restaurantInfo?.name || '',
      Raddress: firm?.restaurantInfo?.address || '',
      guestes: guests.toString(),
      name: username,
      Formatteddate: formattedDate,
      timeSlot,
      status,
      id: _id,
      image: firm?.image_urls?.[0] || require('../../assets/images/barger.jpg'),
    });
    setDiningBookingModal(true);
  };


  const filteredBookings = userBookings.filter((booking) => {
    if (activeTab === 'ALL') return true;
    if (activeTab === 'Table booking') return booking.status === 'accepted';
    if (activeTab === 'Experiences') return booking?.meal === 'Experience';
    return false;
  });

  return (
    <View style={styles.container}>
      
      <BackRouting tittle="Booking Details" />
      <View style={styles.tabContainer}>
        <TabButton title="ALL" isActive={activeTab === 'ALL'} onPress={() => setActiveTab('ALL')} />
        <TabButton title="Accepted Bookings" isActive={activeTab === 'Table booking'} onPress={() => setActiveTab('Table booking')} />
        <TabButton title="Experiences" isActive={activeTab === 'Experiences'} onPress={() => setActiveTab('Experiences')} />
      </View>
      <ScrollView style={styles.bookingsList}>
        {loading ? (
          <Text style={styles.loadingText}>Loading bookings...</Text>
        ) : filteredBookings.length > 0 ? (
          <FlatList
            data={filteredBookings}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <BookingCard
                Rname={item.firm?.restaurantInfo?.name}
                add={item.firm?.restaurantInfo?.address}
                guestes={item.guests}
                name={item.username}
                date={item.ScheduleDate}
                timeSlot={item.timeSlot}
                key={item._id}
                booking={item}
                status={item.status}
                onPress={() => handleBookingPress(item)}
                image={item.firm?.image_urls?.[0] || require('../../assets/images/barger.jpg')}
              />
            )}
          />

        ) : (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontSize: 20, color: 'black', fontWeight: 'bold' }}>No Bookings Accepted Yet</Text>
          </View>
        )}
      </ScrollView>
          <Modal
        visible={diningBookingModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setDiningBookingModal(false)}
      >
        <View style={{display:"flex",justifyContent:"center",flex:1}}>
         
            
            {selectedBooking && (
              <BookingDetailsScreen 
                {...selectedBooking}
                onClose={() => setDiningBookingModal(false)}
              />
            )}
      
        </View>
      </Modal>
  
    </View>
  );
};

const TabButton = ({ title, isActive, onPress }) => (
  <TouchableOpacity style={[styles.tab, isActive && styles.activeTab]} onPress={onPress}>
    <Text style={[styles.tabText, isActive && styles.activeTabText]}>{title}</Text>
  </TouchableOpacity>
);

export default BookingsScreen;
