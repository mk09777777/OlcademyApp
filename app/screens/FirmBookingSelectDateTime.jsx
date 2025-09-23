import { View, Text, TouchableOpacity, Alert, FlatList, ScrollView, TextInput, Modal } from 'react-native';
import React, { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useGlobalSearchParams, useRouter } from 'expo-router';
import DateTimePicker from 'react-native-ui-datepicker';
import dayjs from 'dayjs';

import { useSafeNavigation } from '@/hooks/navigationPage';
import { Schedule } from '@/components/Schedule';
import { API_CONFIG } from '../../config/apiConfig';

export default function SelectDateTime() {
  const { firmName, guestCount, firmadd, firmId } = useGlobalSearchParams();
  const [date, setDate] = useState(dayjs());
  const [selectedTab, setSelectedTab] = useState('Lunch');
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedOfferId, setSelectedOfferId] = useState(null);
  const [selectedOfferDetails, setSelectedOfferDetails] = useState(null);
  const [inputModal, setInputModal] = useState(false);
  const [name, setname] = useState('');
  const [email, setEmail] = useState('');
  const [contact, setcontact] = useState('');
  const [lunchSlots, setLunchSlots] = useState([]);
  const [dinnerSlots, setDinnerSlots] = useState([]);
  const router = useRouter();
  const { safeNavigation } = useSafeNavigation();
  const [scheduleModalVisible, setScheduleModalVisible] = useState(false);
  const [selectedScheduleTime, setSelectedScheduleTime] = useState(null);

  useEffect(() => {
    const fetchSlots = async () => {
      try {
        const response = await fetch(
          `${API_CONFIG.BACKEND_URL}/api/operating-hours/formatted-with-offers-only/${firmId}`
        );
        const result = await response.json();
        const offers = Array.isArray(result.availableOffers) ? result.availableOffers : [];
        const today = dayjs(date).format('dddd');
        const todayOffer = offers.find((item) => item.day === today);

        if (!todayOffer || !Array.isArray(todayOffer.timeSlots)) {
          setLunchSlots([]);
          setDinnerSlots([]);
          return;
        }

        const slotsForToday = todayOffer.timeSlots;
        const lunch = [];
        const dinner = [];

        for (const slot of slotsForToday) {
          const [time, period] = slot.slot.split(' ');
          const [hourStr, minuteStr] = time.split(':');
          let hour = parseInt(hourStr, 10);
          const minute = parseInt(minuteStr, 10);

          if (period === 'PM' && hour !== 12) hour += 12;
          if (period === 'AM' && hour === 12) hour = 0;

          if (hour < 17 || (hour === 17 && minute === 0)) {
            lunch.push(slot);
          } else {
            dinner.push(slot);
          }
        }

        setLunchSlots(lunch);
        setDinnerSlots(dinner);
      } catch (error) {
        setLunchSlots([]);
        setDinnerSlots([]);
      }
    };

    fetchSlots();
  }, [date]);

  const toggleInputModal = () => {
    setInputModal(!inputModal);
  };

  const handleContinue = () => {
    if (!date) {
      Alert.alert('Select Date', 'Please select a valid date');
      return;
    }

    if (!selectedTime && !selectedScheduleTime) {
      Alert.alert('Select Time', 'Please select a valid time');
      return;
    }

    setInputModal(true);
  };

  const handleConfirm = () => {
    if (
      !name ||
      !email ||
      !contact ||
      !email.endsWith('@gmail.com') ||
      isNaN(contact) ||
      contact.toString().length !== 10
    ) {
      Alert.alert('Invalid Input', 'Please enter valid name, email and 10-digit contact number.');
      return;
    }

    toggleInputModal();
    safeNavigation({
      pathname: 'screens/FirmBookingSummary',
      params: {
        firmId,
        firmName,
        date: date.toISOString(),
        guestCount,
        time: selectedTime || selectedScheduleTime,
        name,
        email,
        contact,
        firmadd,
        offerId: selectedOfferId,
        selectedTab,
        offerDetails: JSON.stringify(selectedOfferDetails),
      }
    });
  };

  const currentSlots = selectedTab === 'Lunch' ? lunchSlots : dinnerSlots;

  return (
    <ScrollView className="flex-1  bg-[#E6F1F2] px-4 py-4">
      <View className="flex-row items-center mb-6">
        <TouchableOpacity className="pr-4 mr-2" onPress={() => router.back()}>
          <Ionicons name='arrow-back' size={24} />
        </TouchableOpacity>
        <View>
          <Text className="text-2xl text-textprimary mb-1" style={{ fontFamily: 'outfit-bold' }}>Select Date and Time</Text>
          <Text className="text-base text-textsecondary" style={{ fontFamily: 'outfit-medium' }}>{firmName}</Text>
        </View>
      </View>

      <View className="bg-white rounded-xl p-3 mb-5 shadow-sm">
        <DateTimePicker
          mode="single"
          date={date}
          onChange={(params) => setDate(params.date)}
          calendarTextStyle={{ fontFamily: 'outfit' }}
          todayTextStyle={{ color: 'black' }}
          todayContainerStyle={{ borderColor: '#02757A' }}
          selectedItemColor='#02757A'
        />
      </View>

      <View className="flex-row justify-center mb-5 mt-3">
        <TouchableOpacity
          className={`py-2.5 px-6 rounded-full mx-2 bg-white border ${selectedTab === "Lunch" ? "bg-primary border-border" : "border-border"}`}
          onPress={() => {
            setSelectedTab("Lunch");
            setSelectedTime(null);
            setSelectedOfferId(null);
            setSelectedOfferDetails(null);
          }}
        >
          <Text className={`text-base ${selectedTab === "Lunch" ? "text-white" : "text-smalltext"}`} style={{ fontFamily: selectedTab === "Lunch" ? 'outfit-bold' : 'outfit-medium' }}>Lunch</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className={`py-2.5 px-6 rounded-full mx-2 bg-white border ${selectedTab === "Dinner" ? "bg-primary border-border" : "border-border"}`}
          onPress={() => {
            setSelectedTab("Dinner");
            setSelectedTime(null);
            setSelectedOfferId(null);
            setSelectedOfferDetails(null);
          }}
        >
          <Text className={`text-base ${selectedTab === "Dinner" ? "text-white" : "text-smalltext"}`} style={{ fontFamily: selectedTab === "Dinner" ? 'outfit-bold' : 'outfit-medium' }}>Dinner</Text>
        </TouchableOpacity>
      </View>

      {currentSlots.length > 0 ? (
        <FlatList
          data={currentSlots}
          keyExtractor={(item, index) => index.toString()}
          numColumns={3}
          contentContainerStyle={{ paddingHorizontal: 8, marginBottom: 20 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              className={`bg-white rounded-lg border py-3 m-1.5 items-center justify-center shadow-sm ${selectedTime === item.slot ? "bg-primary border-red-500" : "border-gray-300"}`}
              style={{ width: "30%" }}
              onPress={() => {
                setSelectedTime(item.slot);
                setSelectedOfferId(item.offer?.id || null);
                setSelectedOfferDetails(item.offer || null);
              }}
            >
              <Text className={`text-sm ${selectedTime === item.slot ? "text-white" : "text-gray-700"}`} style={{ fontFamily: selectedTime === item.slot ? 'outfit-bold' : 'outfit-medium' }}>
                {item.slot}
              </Text>
              {item.offer && <Text className="text-xs text-red-500 mt-1" style={{ fontFamily: 'outfit-medium' }}>Offer Available</Text>}
            </TouchableOpacity>
          )}
        />
      ) : (
        <View className="mx-2.5 mb-5 bg-white border border-gray-400 p-2.5 rounded-lg flex-1 justify-center items-center">
          <TouchableOpacity onPress={() => setScheduleModalVisible(true)}>
            <Text className="text-gray-600 text-base font-bold">
              {selectedScheduleTime || "No slots available Schedule your booking here"}
            </Text>
          </TouchableOpacity>
          {scheduleModalVisible && (
            <Schedule
              onClose={() => setScheduleModalVisible(false)}
              onSave={(selectedTime) => {
                setSelectedScheduleTime(selectedTime);
                setScheduleModalVisible(false);
              }}
              type="dining"
            />
          )}
        </View>
      )}

      {selectedTime && selectedOfferDetails && (
        <View className="mt-4 mb-6 bg-white rounded-xl p-4 shadow-sm">
          <Text className="text-lg text-gray-800 mb-1" style={{ fontFamily: 'outfit-bold' }}>Offer available</Text>
          <Text className="text-xs text-gray-500 mb-3" style={{ fontFamily: 'outfit' }}>Auto-applied on booking</Text>
          <View className="flex-row justify-between p-4 rounded-lg bg-gray-50 mb-2 items-center">
            <View>
              <Text className="text-base text-red-500" style={{ fontFamily: 'outfit-bold' }}>
                {selectedOfferDetails.discountValue}% OFF
              </Text>
              <Text className="text-xs text-gray-600 mt-1" style={{ fontFamily: 'outfit' }}>
                Code: {selectedOfferDetails.code}
              </Text>
            </View>
          </View>
        </View>
      )}

      <TouchableOpacity className="bg-primary p-4 rounded-xl mb-6 shadow-lg" onPress={handleContinue}>
        <Text className="text-white text-base text-center" style={{ fontFamily: 'outfit-bold' }}>Continue</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={inputModal}
        onRequestClose={toggleInputModal}
      >
        <View className="flex-1 bg-black/50 justify-center items-center">
          <View className="bg-white rounded-2xl p-6 w-11/12 max-w-sm">
            <Text className="text-xl text-gray-800 mb-5 text-center" style={{ fontFamily: 'outfit-bold' }}>Enter your details</Text>
            <TextInput
              className="border border-gray-300 rounded-lg p-3.5 mb-4 bg-gray-50 text-base"
              style={{ fontFamily: 'outfit' }}
              placeholder="Enter your name"
              value={name}
              onChangeText={setname}
            />
            <TextInput
              value={email}
              onChangeText={setEmail}
              className="border border-gray-300 rounded-lg p-3.5 mb-4 bg-gray-50 text-base"
              style={{ fontFamily: 'outfit' }}
              placeholder="Enter your email"
            />
            <TextInput
              value={contact}
              onChangeText={setcontact}
              className="border border-gray-300 rounded-lg p-3.5 mb-4 bg-gray-50 text-base"
              style={{ fontFamily: 'outfit' }}
              placeholder="Enter your contact"
              keyboardType='numeric'
            />
            <TouchableOpacity onPress={handleConfirm} className="bg-primary p-4 rounded-lg mt-2">
              <Text className="text-white text-base text-center" style={{ fontFamily: 'outfit-bold' }}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}
