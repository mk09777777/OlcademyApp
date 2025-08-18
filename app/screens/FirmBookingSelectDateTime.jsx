import { View, Text, TouchableOpacity, Alert, FlatList, ScrollView, TextInput, Modal } from 'react-native';
import React, { useState, useEffect } from 'react';
import { styles } from '@/styles/FirmBookingStyles';
import { Ionicons } from '@expo/vector-icons';
import { useGlobalSearchParams, useRouter } from 'expo-router';
import DateTimePicker from 'react-native-ui-datepicker';
import dayjs from 'dayjs';
import InputBoxStyles from '../../styles/InputBox';
import { useSafeNavigation } from '@/hooks/navigationPage';
import { Schedule } from '@/components/Schedule';

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
        const response = await fetch(`http://192.168.0.100:3000/api/operating-hours/formatted-with-offers-only/${firmId}`);
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
      contact.length !== 10
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
        date: new Date(date).toDateString(),
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
    <ScrollView style={styles.container}>
      <View style={styles.upperPannel}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name='arrow-back' size={24} />
        </TouchableOpacity>
        <View>
          <Text style={styles.pageHeader}>Select Date and Time</Text>
          <Text style={styles.subHeader}>{firmName}</Text>
        </View>
      </View>

      <View style={styles.calenderContainer}>
        <DateTimePicker
          mode="single"
          date={date}
          onChange={(params) => setDate(params.date)}
          calendarTextStyle={{ fontFamily: 'outfit' }}
          todayTextStyle={{ color: 'black' }}
          todayContainerStyle={{ borderColor: '#e23845' }}
          selectedItemColor='#e23845'
        />
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, selectedTab === "Lunch" && styles.activeTab]}
          onPress={() => {
            setSelectedTab("Lunch");
            setSelectedTime(null);
            setSelectedOfferId(null);
            setSelectedOfferDetails(null);
          }}
        >
          <Text style={[styles.tabText, selectedTab === "Lunch" && styles.activeTabText]}>Lunch</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === "Dinner" && styles.activeTab]}
          onPress={() => {
            setSelectedTab("Dinner");
            setSelectedTime(null);
            setSelectedOfferId(null);
            setSelectedOfferDetails(null);
          }}
        >
          <Text style={[styles.tabText, selectedTab === "Dinner" && styles.activeTabText]}>Dinner</Text>
        </TouchableOpacity>
      </View>

      {currentSlots.length > 0 ? (
        <FlatList
          data={currentSlots}
          keyExtractor={(item, index) => index.toString()}
          numColumns={3}
          contentContainerStyle={styles.timeSlotsContainer}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.timeSlot,
                selectedTime === item.slot && styles.selectedTimeSlot,
              ]}
              onPress={() => {
                setSelectedTime(item.slot);
                setSelectedOfferId(item.offer?.id || null);
                setSelectedOfferDetails(item.offer || null);
              }}
            >
              <Text style={[
                styles.timeSlotText,
                selectedTime === item.slot && styles.selectedTimeSlotText,
              ]}>
                {item.slot}
              </Text>
              {item.offer && <Text style={styles.offerText}>Offer Available</Text>}
            </TouchableOpacity>
          )}
        />
      ) : (
        <View style={{
          marginLeft: 10,
          marginBottom: 20,
          marginRight: 10,
          backgroundColor: "white",
          borderColor: "#b1b1b1ff",
          borderWidth: 1,
          padding: 10,
          borderRadius: 10,
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}>
          <TouchableOpacity onPress={() => setScheduleModalVisible(true)}>
            <Text style={{ color: "#525252ff", fontSize: 16, fontWeight: "bold" }}>
              {selectedScheduleTime || "No slots available Schedule your booking"}
            </Text>
          </TouchableOpacity>
          {scheduleModalVisible && (
            <Schedule
              onClose={() => setScheduleModalVisible(false)}
              onSave={(selectedTime) => {
                setSelectedScheduleTime(selectedTime);
                setScheduleModalVisible(false);

              }}
            />
          )}
        </View>
      )}

      {selectedTime && selectedOfferDetails && (
        <View style={styles.offersContainer}>
          <Text style={styles.offerHeader}>Offer available</Text>
          <Text style={styles.offerSubHeader}>Auto-applied on booking</Text>
          <View style={styles.offerItem}>
            <View>
              <Text style={styles.offerTitle}>
                {selectedOfferDetails.discountValue}% OFF
              </Text>
              <Text style={styles.offerSubtitle}>
                Code: {selectedOfferDetails.code}
              </Text>
            </View>
          </View>
        </View>
      )}

      <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={inputModal}
        onRequestClose={toggleInputModal}
      >
        <View style={InputBoxStyles.background}>
          <View style={InputBoxStyles.inputContainer}>
            <View style={InputBoxStyles.headingContainer}>
              <Text style={InputBoxStyles.headingText}>Enter your details</Text>
            </View>
            <TextInput
              style={InputBoxStyles.inputBox}
              placeholder="Enter your name"
              value={name}
              onChangeText={setname}
            />
            <TextInput
              value={email}
              onChangeText={setEmail}
              style={InputBoxStyles.inputBox}
              placeholder="Enter your email"
            />
            <TextInput
              value={contact}
              onChangeText={setcontact}
              style={InputBoxStyles.inputBox}
              placeholder="Enter your contact"
              keyboardType='numeric'
            />
            <TouchableOpacity onPress={handleConfirm} style={InputBoxStyles.ConfirmButton}>
              <Text style={InputBoxStyles.ConfirmText}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}
