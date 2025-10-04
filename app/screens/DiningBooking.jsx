import React, { useState, useEffect } from 'react';
import { ScrollView, Text, View, TouchableOpacity, FlatList, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import axios from 'axios';
import BackRouting from '@/components/BackRouting';
import BookingCard from '../../Card/TableBookingCard';
import { useSafeNavigation } from '@/hooks/navigationPage';
import BookingDetailsScreen from "./DiningBookingDetails";
import { API_CONFIG } from '../../config/apiConfig';
import { api } from '../../config/httpClient';
import { useFocusEffect } from '@react-navigation/native';
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
      const res = await api.get('/api/bookings/userId'); 
      setUserBookings(res.data?.data || []);
    } catch (error) {
      console.log('Fetch bookings error:', error.response?.status, error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchDiningBookings();
  }, []);

   useFocusEffect(
    React.useCallback(() => {
      fetchDiningBookings();
      return () => {}; 
    }, [])
  );


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
    <View className="flex-1 bg-background">

      <BackRouting tittle="Booking Details" />
      <View className="flex-row bg-white border-b border-border">
        <TabButton title="ALL" isActive={activeTab === 'ALL'} onPress={() => setActiveTab('ALL')} />
        <TabButton title="Accepted Bookings" isActive={activeTab === 'Table booking'} onPress={() => setActiveTab('Table booking')} />
        <TabButton title="Experiences" isActive={activeTab === 'Experiences'} onPress={() => setActiveTab('Experiences')} />
      </View>
      <ScrollView className="flex-1 p-4">
        {loading ? (
          <Text className="text-textsecondary text-center font-outfit mt-8">Loading bookings...</Text>
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
                booking={item}
                status={item.status}
                onPress={() => handleBookingPress(item)}
                image={item.firm?.image_urls?.[0] || require('../../assets/images/barger.jpg')}
              />
            )}
          />

        ) : (
          <View className="flex-1 justify-center items-center">
            <Text className="text-xl text-textprimary font-outfit-bold">No Bookings Accepted Yet</Text>
          </View>
        )}
      </ScrollView>
      <Modal
        visible={diningBookingModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setDiningBookingModal(false)}
      >


        {selectedBooking && (
          <BookingDetailsScreen
            {...selectedBooking}
            onClose={() => setDiningBookingModal(false)}
          />
        )}


      </Modal>

    </View>
  );
};

const TabButton = ({ title, isActive, onPress }) => (
  <TouchableOpacity className={`flex-1 py-4 items-center ${isActive ? 'border-b-2 border-primary' : ''}`} onPress={onPress}>
    <Text className={`font-outfit text-sm ${isActive ? 'text-primary font-outfit-bold' : 'text-textsecondary'}`}>{title}</Text>
  </TouchableOpacity>
);

export default BookingsScreen;
